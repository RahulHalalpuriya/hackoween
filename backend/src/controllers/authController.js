import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import { Farmer } from '../models/Farmer.js';
import { Farm } from '../models/Farm.js';
import { Worker } from '../models/Worker.js';
import { executeAgentCycle } from '../agents/agentLoop.js';
import { emitToFarmer } from '../services/socketService.js';

export async function registerFarmer(req, res, next) {
  try {
    const {
      name,
      phone,
      password = 'farmer@kisanai',
      village,
      district,
      state,
      preferredLanguage = 'hi',
      farms = [],
      workers = [],
      fertilizerStock = []
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    // Check if phone already registered - if so, UPDATE farmer details, farms, and workers
    let farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      const cleanDigits = String(phone).replace(/\D/g, '').slice(-10);
      if (cleanDigits) {
        const allFarmers = await Farmer.find({});
        farmer = allFarmers.find(f => {
          const fDigits = String(f.phone || '').replace(/\D/g, '').slice(-10);
          return fDigits && fDigits === cleanDigits;
        });
      }
    }

    if (farmer) {
      const farmerId = farmer._id || farmer.id;
      // Update farmer profile
      farmer = await Farmer.findByIdAndUpdate(
        farmerId,
        {
          name,
          village: village || farmer.village || 'Kisan Nagar',
          district: district || farmer.district || 'Ludhiana',
          state: state || farmer.state || 'Punjab',
          preferredLanguage: preferredLanguage || farmer.preferredLanguage || 'hi',
          ...(fertilizerStock && fertilizerStock.length > 0 ? { fertilizerStock } : {})
        },
        { new: true }
      );

      // If new farms provided, replace or append them
      let updatedFarms = [];
      if (farms && farms.length > 0) {
        await Farm.deleteMany({ farmerId });
        for (const f of farms) {
          const sowing = f.sowingDate ? new Date(f.sowingDate) : new Date(Date.now() - 45 * 86400000);
          const harvest = f.expectedHarvestDate ? new Date(f.expectedHarvestDate) : new Date(sowing.getTime() + 120 * 86400000);

          const farmDoc = await Farm.create({
            farmerId,
            name: f.name || `${f.cropName || 'Field'} - Plot`,
            area: Number(f.area) || 2.5,
            areaUnit: f.areaUnit || 'acre',
            location: f.location || { lat: 30.7333, lng: 76.7794, address: `${village || farmer.village || 'Village'}, ${district || farmer.district || 'District'}` },
            cropName: (f.cropName || 'wheat').toLowerCase(),
            cropVariety: f.cropVariety || 'HD-2967',
            sowingDate: sowing,
            expectedHarvestDate: harvest,
            soilType: f.soilType || 'loam',
            irrigationType: f.irrigationType || 'tubewell',
            motorDetails: {
              hp: Number(f.motorHp) || 7.5,
              pumpType: f.pumpType || 'Submersible Tubewell',
              status: 'off'
            },
            soilSensorId: f.soilSensorId || `ESP32-${Math.floor(1000 + Math.random() * 9000)}`,
            currentMoisture: f.cropName === 'rice' ? 68 : 42,
            currentTemp: 27.5,
            currentHealth: 'green',
            cropStage: f.cropStage || 'Vegetative'
          });
          updatedFarms.push(farmDoc);
        }
      } else {
        updatedFarms = await Farm.find({ farmerId });
      }

      // If new workers provided, update them
      let updatedWorkers = [];
      if (workers && workers.length > 0) {
        await Worker.deleteMany({ farmerId });
        for (const w of workers) {
          const workerDoc = await Worker.create({
            farmerId,
            role: w.role || 'sprayer',
            name: w.name,
            phone: w.phone,
            preferredLanguage: w.preferredLanguage || preferredLanguage || 'hi',
            availabilityDays: w.availabilityDays || ['Monday', 'Wednesday', 'Friday'],
            ratePerAcre: Number(w.ratePerAcre) || 350,
            isBackup: Boolean(w.isBackup)
          });
          updatedWorkers.push(workerDoc);
        }
      } else {
        updatedWorkers = await Worker.find({ farmerId });
      }

      const secret = process.env.JWT_SECRET || 'kisanai_hackathon_super_secret_jwt_key_2026';
      const token = jwt.sign({ id: farmerId, phone: farmer.phone }, secret, { expiresIn: '30d' });

      // Run background cycle
      setTimeout(() => {
        executeAgentCycle({ farmerId });
      }, 500);

      return res.status(200).json({
        success: true,
        message: 'Farmer profile, fields, and workers updated successfully!',
        token,
        farmer: {
          id: farmerId,
          _id: farmerId,
          name: farmer.name,
          phone: farmer.phone,
          village: farmer.village,
          district: farmer.district,
          state: farmer.state,
          preferredLanguage: farmer.preferredLanguage,
          autoModePreferences: farmer.autoModePreferences
        },
        farms: updatedFarms,
        workers: updatedWorkers
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    farmer = await Farmer.create({
      name,
      phone,
      password: hashedPassword,
      village: village || 'Kisan Nagar',
      district: district || 'Ludhiana',
      state: state || 'Punjab',
      preferredLanguage,
      fertilizerStock,
      autoModePreferences: {
        irrigation: 'auto',
        spray: 'auto',
        harvest: 'ask'
      }
    });

    const farmerId = farmer._id || farmer.id;

    // Create farms
    const createdFarms = [];
    if (farms && farms.length > 0) {
      for (const f of farms) {
        const sowing = f.sowingDate ? new Date(f.sowingDate) : new Date(Date.now() - 45 * 86400000);
        const harvest = f.expectedHarvestDate ? new Date(f.expectedHarvestDate) : new Date(sowing.getTime() + 120 * 86400000);

        const farmDoc = await Farm.create({
          farmerId,
          name: f.name || `${f.cropName || 'Field'} - Plot`,
          area: Number(f.area) || 2.5,
          areaUnit: f.areaUnit || 'acre',
          location: f.location || { lat: 30.7333, lng: 76.7794, address: `${village || 'Village'}, ${district || 'District'}` },
          cropName: (f.cropName || 'wheat').toLowerCase(),
          cropVariety: f.cropVariety || 'HD-2967',
          sowingDate: sowing,
          expectedHarvestDate: harvest,
          soilType: f.soilType || 'loam',
          irrigationType: f.irrigationType || 'tubewell',
          motorDetails: {
            hp: Number(f.motorHp) || 7.5,
            pumpType: f.pumpType || 'Submersible Tubewell',
            status: 'off'
          },
          soilSensorId: f.soilSensorId || `ESP32-${Math.floor(1000 + Math.random() * 9000)}`,
          currentMoisture: f.cropName === 'rice' ? 68 : 42,
          currentTemp: 28,
          currentHealth: 'green',
          cropStage: f.cropStage || 'Vegetative'
        });
        createdFarms.push(farmDoc);
      }
    }

    // Create workers
    const createdWorkers = [];
    if (workers && workers.length > 0) {
      for (const w of workers) {
        const workerDoc = await Worker.create({
          farmerId,
          role: w.role || 'sprayer',
          name: w.name,
          phone: w.phone,
          preferredLanguage: w.preferredLanguage || preferredLanguage,
          availabilityDays: w.availabilityDays || ['Monday', 'Wednesday', 'Friday'],
          ratePerAcre: Number(w.ratePerAcre) || 350,
          isBackup: Boolean(w.isBackup)
        });
        createdWorkers.push(workerDoc);
      }
    }

    const secret = process.env.JWT_SECRET || 'kisanai_hackathon_super_secret_jwt_key_2026';
    const token = jwt.sign({ id: farmerId, phone: farmer.phone }, secret, { expiresIn: '30d' });

    // Instantly run initial cycle asynchronously in background
    setTimeout(() => {
      executeAgentCycle({ farmerId });
    }, 1000);

    return res.status(201).json({
      success: true,
      token,
      farmer: {
        id: farmerId,
        _id: farmerId,
        name: farmer.name,
        phone: farmer.phone,
        village: farmer.village,
        district: farmer.district,
        state: farmer.state,
        preferredLanguage: farmer.preferredLanguage,
        autoModePreferences: farmer.autoModePreferences
      },
      farms: createdFarms,
      workers: createdWorkers
    });
  } catch (err) {
    next(err);
  }
}

export async function loginFarmer(req, res, next) {
  try {
    const { phone, password } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let farmer = await Farmer.findOne({ phone });
    if (!farmer) {
      const cleanDigits = String(phone).replace(/\D/g, '').slice(-10);
      if (cleanDigits) {
        const allFarmers = await Farmer.find({});
        farmer = allFarmers.find(f => {
          const fDigits = String(f.phone || '').replace(/\D/g, '').slice(-10);
          return fDigits && fDigits === cleanDigits;
        });
      }
    }

    if (!farmer) {
      return res.status(404).json({ success: false, message: 'No farmer found with this phone number' });
    }

    // For hackathon convenience, accept default or verified password
    if (password && password !== 'demo' && password !== 'kisanai') {
      const isMatch = await bcrypt.compare(password, farmer.password);
      if (!isMatch && farmer.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const farmerId = farmer._id || farmer.id;
    const secret = process.env.JWT_SECRET || 'kisanai_hackathon_super_secret_jwt_key_2026';
    const token = jwt.sign({ id: farmerId, phone: farmer.phone }, secret, { expiresIn: '30d' });

    const farms = await Farm.find({ farmerId });
    const workers = await Worker.find({ farmerId });

    return res.json({
      success: true,
      token,
      farmer: {
        id: farmerId,
        _id: farmerId,
        name: farmer.name,
        phone: farmer.phone,
        village: farmer.village,
        district: farmer.district,
        state: farmer.state,
        preferredLanguage: farmer.preferredLanguage,
        autoModePreferences: farmer.autoModePreferences,
        emergencyOverride: farmer.emergencyOverride
      },
      farms,
      workers
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentFarmer(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const farmer = await Farmer.findById(farmerId);
    const farms = await Farm.find({ farmerId });
    const workers = await Worker.find({ farmerId });

    return res.json({
      success: true,
      farmer,
      farms,
      workers
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const { autoModePreferences, emergencyOverride, preferredLanguage } = req.body;

    const update = {};
    if (autoModePreferences) update.autoModePreferences = autoModePreferences;
    if (emergencyOverride !== undefined) update.emergencyOverride = emergencyOverride;
    if (preferredLanguage) update.preferredLanguage = preferredLanguage;

    const updated = await Farmer.findByIdAndUpdate(farmerId, update, { new: true });

    emitToFarmer(farmerId, 'farmer:updated', updated);

    return res.json({
      success: true,
      farmer: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const farmerId = req.farmerId;
    const {
      name,
      phone,
      village,
      district,
      state,
      preferredLanguage,
      autoModePreferences,
      emergencyOverride,
      fertilizerStock
    } = req.body;

    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (village !== undefined) update.village = village;
    if (district !== undefined) update.district = district;
    if (state !== undefined) update.state = state;
    if (preferredLanguage !== undefined) update.preferredLanguage = preferredLanguage;
    if (autoModePreferences !== undefined) update.autoModePreferences = autoModePreferences;
    if (emergencyOverride !== undefined) update.emergencyOverride = emergencyOverride;
    if (fertilizerStock !== undefined) update.fertilizerStock = fertilizerStock;

    const updated = await Farmer.findByIdAndUpdate(farmerId, update, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Farmer not found' });
    }

    emitToFarmer(farmerId, 'farmer:updated', updated);

    return res.json({
      success: true,
      message: 'Farmer details updated successfully!',
      farmer: {
        id: updated._id || updated.id,
        _id: updated._id || updated.id,
        name: updated.name,
        phone: updated.phone,
        village: updated.village,
        district: updated.district,
        state: updated.state,
        preferredLanguage: updated.preferredLanguage,
        autoModePreferences: updated.autoModePreferences,
        emergencyOverride: updated.emergencyOverride,
        fertilizerStock: updated.fertilizerStock
      }
    });
  } catch (err) {
    next(err);
  }
}

// In-memory OTP storage for registration & login verification
const otpStore = new Map();

export async function sendOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = String(phone).replace(/[^\d+]/g, '');
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    otpStore.set(cleanPhone, { code: otpCode, expiresAt });
    const last10 = cleanPhone.slice(-10);
    otpStore.set(last10, { code: otpCode, expiresAt });

    console.log(`[OTP] 📲 Generated OTP for ${cleanPhone}: ${otpCode}`);

    let isRealSmsSent = false;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        let targetPhone = cleanPhone;
        if (!targetPhone.startsWith('+')) {
          targetPhone = targetPhone.length === 10 ? '+91' + targetPhone : '+' + targetPhone;
        }
        await client.messages.create({
          body: `[KisanAI] Your mobile verification code is: ${otpCode}. Valid for 5 minutes. Autonomous Farm Operations.`,
          to: targetPhone,
          from: process.env.TWILIO_PHONE_NUMBER
        });
        isRealSmsSent = true;
        console.log(`[OTP] ✉️ Real Twilio SMS dispatched to ${targetPhone}`);
      } catch (smsErr) {
        console.warn(`[OTP] Twilio SMS failed (${smsErr.message}). Fallback to simulated OTP.`);
      }
    }

    return res.json({
      success: true,
      message: isRealSmsSent
        ? `Verification OTP sent to ${phone} via SMS`
        : `Verification OTP generated for ${phone}`,
      demoOtp: otpCode,
      isRealSmsSent,
      expiresInSec: 300
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP code are required' });
    }

    const cleanPhone = String(phone).replace(/[^\d+]/g, '');
    const last10 = cleanPhone.slice(-10);
    const stored = otpStore.get(cleanPhone) || otpStore.get(last10);

    const isMasterDemoOtp = (String(otp).trim() === '123456');
    const isMatchingStoredOtp = stored && stored.code === String(otp).trim() && Date.now() < stored.expiresAt;

    if (!isMasterDemoOtp && !isMatchingStoredOtp) {
      return res.status(400).json({
        success: false,
        message: stored && Date.now() >= stored.expiresAt
          ? 'OTP code has expired. Please request a new OTP.'
          : 'Invalid OTP code. Please enter the correct 6-digit code or demo OTP 123456.'
      });
    }

    otpStore.delete(cleanPhone);
    otpStore.delete(last10);

    return res.json({
      success: true,
      message: 'Mobile number verified successfully! ✅'
    });
  } catch (err) {
    next(err);
  }
}

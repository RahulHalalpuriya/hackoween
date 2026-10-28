const MANDI_RATES = {
  wheat: {
    crop: 'Wheat (गेहूं)',
    msp: 2275, // ₹/quintal
    modalPrice: 2480,
    priceChange: '+ ₹65 (2.7%)',
    trend: 'up',
    market: 'Khanna Mandi, Punjab (Asia’s largest grain market)',
    arrivals: '14,200 Quintals',
    aiRecommendation: {
      action: 'HOLD',
      badgeColor: 'amber',
      reason: 'Flour mill procurement demand is rising. Expected to reach ₹2,550/quintal in 12 days before government buffer stock tenders open.',
      confidence: 88
    },
    sevenDayHistory: [
      { day: 'Mon', price: 2390 },
      { day: 'Tue', price: 2410 },
      { day: 'Wed', price: 2435 },
      { day: 'Thu', price: 2420 },
      { day: 'Fri', price: 2450 },
      { day: 'Sat', price: 2465 },
      { day: 'Today', price: 2480 }
    ]
  },
  rice: {
    crop: 'Basmati Rice 1121 (बासमती चावल)',
    msp: 2203,
    modalPrice: 3850,
    priceChange: '+ ₹120 (3.2%)',
    trend: 'up',
    market: 'Karnal Mandi, Haryana',
    arrivals: '8,900 Quintals',
    aiRecommendation: {
      action: 'SELL NOW (Partial 50%)',
      badgeColor: 'emerald',
      reason: 'Export demand from Middle East is currently at peak season premium. Locking in current ₹3,850/q is highly profitable.',
      confidence: 91
    },
    sevenDayHistory: [
      { day: 'Mon', price: 3680 },
      { day: 'Tue', price: 3710 },
      { day: 'Wed', price: 3750 },
      { day: 'Thu', price: 3790 },
      { day: 'Fri', price: 3820 },
      { day: 'Sat', price: 3840 },
      { day: 'Today', price: 3850 }
    ]
  },
  sugarcane: {
    crop: 'Sugarcane (गन्ना)',
    msp: 340, // FRP ₹/quintal
    modalPrice: 380, // State Advised Price (SAP)
    priceChange: '0.0% (Stable SAP)',
    trend: 'stable',
    market: 'Muzaffarnagar Sugar Mill Gate, UP',
    arrivals: '45,000 Quintals',
    aiRecommendation: {
      action: 'SUPPLY TO MILL',
      badgeColor: 'blue',
      reason: 'Sugar recovery rate is optimal at 10.8%. Mills are offering timely cane parchi slips.',
      confidence: 95
    },
    sevenDayHistory: [
      { day: 'Mon', price: 380 },
      { day: 'Tue', price: 380 },
      { day: 'Wed', price: 380 },
      { day: 'Thu', price: 380 },
      { day: 'Fri', price: 380 },
      { day: 'Sat', price: 380 },
      { day: 'Today', price: 380 }
    ]
  },
  cotton: {
    crop: 'Cotton / Kapas (कपास)',
    msp: 7121,
    modalPrice: 7450,
    priceChange: '- ₹40 (-0.5%)',
    trend: 'down',
    market: 'Rajkot Mandi, Gujarat',
    arrivals: '6,200 Bales',
    aiRecommendation: {
      action: 'HOLD',
      badgeColor: 'amber',
      reason: 'Global textile spinning mill orders picking up. Expect price rebound to ₹7,700 within 3 weeks.',
      confidence: 84
    },
    sevenDayHistory: [
      { day: 'Mon', price: 7550 },
      { day: 'Tue', price: 7520 },
      { day: 'Wed', price: 7490 },
      { day: 'Thu', price: 7480 },
      { day: 'Fri', price: 7460 },
      { day: 'Sat', price: 7450 },
      { day: 'Today', price: 7450 }
    ]
  },
  mustard: {
    crop: 'Mustard (सरसों)',
    msp: 5650,
    modalPrice: 5920,
    priceChange: '+ ₹90 (1.5%)',
    trend: 'up',
    market: 'Alwar Mandi, Rajasthan',
    arrivals: '11,400 Quintals',
    aiRecommendation: {
      action: 'SELL NOW',
      badgeColor: 'emerald',
      reason: 'Edible oil import duties revised; domestic crushers paying above MSP.',
      confidence: 89
    },
    sevenDayHistory: [
      { day: 'Mon', price: 5780 },
      { day: 'Tue', price: 5800 },
      { day: 'Wed', price: 5840 },
      { day: 'Thu', price: 5870 },
      { day: 'Fri', price: 5890 },
      { day: 'Sat', price: 5910 },
      { day: 'Today', price: 5920 }
    ]
  }
};

export async function getMandiRates(req, res, next) {
  try {
    const { crop } = req.query;
    if (crop && MANDI_RATES[crop.toLowerCase()]) {
      return res.json({
        success: true,
        rates: [MANDI_RATES[crop.toLowerCase()]]
      });
    }

    return res.json({
      success: true,
      rates: Object.values(MANDI_RATES)
    });
  } catch (err) {
    next(err);
  }
}

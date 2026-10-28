const SCHEMES_DATABASE = [
  {
    id: 'pm-kisan',
    title: 'PM-Kisan Samman Nidhi',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    category: 'Direct Income Support',
    benefit: '₹6,000 / year (₹2,000 in 3 installments)',
    eligibility: 'All landholding farmer families across India',
    deadline: 'Open throughout year',
    portalUrl: 'https://pmkisan.gov.in',
    docsRequired: ['Aadhaar Card', 'Land Ownership Records (Jamabandi/Khasra)', 'Bank Account details'],
    eligibleForFarmer: true,
    statusBadge: 'Active & Verified'
  },
  {
    id: 'pmfby',
    title: 'PM Fasal Bima Yojana (PMFBY)',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'Crop Insurance',
    benefit: 'Comprehensive cover against drought, unseasonal rain, hail & pests at only 1.5% - 2% premium',
    eligibility: 'All farmers growing notified crops (Wheat, Rice, Sugarcane, Cotton)',
    deadline: 'Before Sowing Season Cutoff',
    portalUrl: 'https://pmfby.gov.in',
    docsRequired: ['Sowing Certificate', 'Land Possession Document', 'Aadhaar Card'],
    eligibleForFarmer: true,
    statusBadge: 'Highly Recommended for Rabi Season'
  },
  {
    id: 'per-drop-more-crop',
    title: 'Per Drop More Crop (PDMC)',
    titleHi: 'प्रति बूंद अधिक फसल (ड्रिप एवं स्प्रिंकलर सब्सिडी)',
    category: 'Irrigation Modernization',
    benefit: '45% to 55% Government Subsidy on Drip & Sprinkler Systems',
    eligibility: 'Farmers having water source and tubewell connection',
    deadline: 'State Department Annual Allocation',
    portalUrl: 'https://pmksy.gov.in',
    docsRequired: ['Electricity Connection/Tubewell proof', 'Field Map', 'Soil/Water test'],
    eligibleForFarmer: true,
    statusBadge: 'Matches Your Irrigation Profile'
  },
  {
    id: 'smam-subsidy',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    titleHi: 'कृषि यंत्रीकरण उप-मिशन',
    category: 'Equipment & Drone Subsidy',
    benefit: '40% to 50% subsidy on buying Tractors, Rotavators & Agricultural Spray Drones',
    eligibility: 'Individual farmers and Farmer Producer Organizations (FPOs)',
    deadline: 'Quarterly window',
    portalUrl: 'https://agrimachinery.nic.in',
    docsRequired: ['Quotation from authorized dealer', 'Aadhaar Card', 'Land proof'],
    eligibleForFarmer: true,
    statusBadge: 'Subsidies Available in Your State'
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    titleHi: 'मृदा स्वास्थ्य कार्ड योजना',
    category: 'Soil Testing',
    benefit: 'Free soil test reports every 2 years with exact N-P-K & micronutrient dosage',
    eligibility: 'Every farmer in India',
    deadline: 'Always Available',
    portalUrl: 'https://soilhealth.dac.gov.in',
    docsRequired: ['Khasra Number', 'Field location'],
    eligibleForFarmer: true,
    statusBadge: 'Free Service'
  },
  {
    id: 'kcc-loan',
    title: 'Kisan Credit Card (KCC) at 4% Interest',
    titleHi: 'किसान क्रेडिट कार्ड (केसीसी ऋण)',
    category: 'Agricultural Credit',
    benefit: 'Low-interest institutional credit up to ₹3,00,000 at effective 4% interest rate',
    eligibility: 'Owner cultivators, tenant farmers, and sharecroppers',
    deadline: 'Immediate Bank Application',
    portalUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    docsRequired: ['Land records', 'Identity proof', 'Passport photos'],
    eligibleForFarmer: true,
    statusBadge: 'Low Interest Credit'
  }
];

export async function getSchemes(req, res, next) {
  try {
    return res.json({
      success: true,
      count: SCHEMES_DATABASE.length,
      schemes: SCHEMES_DATABASE
    });
  } catch (err) {
    next(err);
  }
}

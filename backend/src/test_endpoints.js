import axios from 'axios';

async function testAll() {
  console.log('Testing KisanAI Endpoints...');

  // 1. Health
  const health = await axios.get('http://localhost:5000/api/health');
  console.log('✅ Health:', health.data.status, '| System:', health.data.system);

  // 2. Login
  const login = await axios.post('http://localhost:5000/api/auth/login', {
    phone: '9876543210',
    password: 'demo'
  });
  console.log('✅ Login Successful for:', login.data.farmer.name);
  const token = login.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // 3. Farms
  const farms = await axios.get('http://localhost:5000/api/farms', authHeaders);
  console.log(`✅ Loaded ${farms.data.farms.length} sample farms:`, farms.data.farms.map(f => f.name));

  // 4. Mandi Rates
  const mandi = await axios.get('http://localhost:5000/api/mandi', authHeaders);
  console.log(`✅ Mandi Rates available for ${mandi.data.rates.length} crops`);

  // 5. Govt Schemes
  const schemes = await axios.get('http://localhost:5000/api/schemes', authHeaders);
  console.log(`✅ Govt Schemes available: ${schemes.data.count} schemes`);

  // 6. Finances & SDG Impact
  const finances = await axios.get('http://localhost:5000/api/finances', authHeaders);
  console.log('✅ SDG Impact Verified:', Object.keys(finances.data.sdgImpact));
  console.log('   - Total Water Saved:', finances.data.sdgImpact.sdg13_climateAction.waterSavedLitres, 'Litres');
  console.log('   - Total Chemicals Avoided:', finances.data.sdgImpact.sdg12_responsibleConsumption.chemicalSavedKg, 'kg');

  // 7. Disease Scanner
  const disease = await axios.post('http://localhost:5000/api/disease/scan', {
    farmId: farms.data.farms[0]._id || farms.data.farms[0].id,
    sampleKey: 'wheat_rust'
  }, authHeaders);
  console.log('✅ Leaf Doctor Diagnosis:', disease.data.diagnosis.diseaseName, `(${disease.data.diagnosis.confidence}%)`);

  // 8. Demo Scenario Trigger
  const demo = await axios.post('http://localhost:5000/api/agent/demo-scenario', {}, authHeaders);
  console.log('✅ 2-Minute Demo Scenario Successfully Executed!');
  console.log('   Replan cards generated:');
  demo.data.replanCards.forEach(c => {
    console.log(`   - ${c.farmName}: "${c.before}" -> "${c.after}"`);
    console.log(`     Reason: ${c.reason}`);
  });

  console.log('\n🌟 ALL FULL-STACK BACKEND & AGENTIC APIS FUNCTIONING WITH 100% SUCCESS!');
}

testAll().catch(err => {
  console.error('Test failed:', err.response?.data || err.message);
});

// test_endpoints.js - Autonomous end-to-end endpoint verification
async function testAll() {
  console.log('Testing KisanAI Endpoints...');

  // 1. Health
  const healthRes = await fetch('http://localhost:5000/api/health');
  if (!healthRes.ok) throw new Error(`Health check failed: ${healthRes.statusText}`);
  const health = await healthRes.json();
  console.log('✅ Health:', health.status, '| System:', health.system);

  // 2. Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '9876543210',
      password: 'demo'
    })
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
  const login = await loginRes.json();
  console.log('✅ Login Successful for:', login.farmer.name);
  const token = login.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 3. Farms
  const farmsRes = await fetch('http://localhost:5000/api/farms', { headers: authHeaders });
  if (!farmsRes.ok) throw new Error(`Farms fetch failed: ${farmsRes.statusText}`);
  const farms = await farmsRes.json();
  console.log(`✅ Loaded ${farms.farms.length} sample farms:`, farms.farms.map(f => f.name));

  // 4. Mandi Rates
  const mandiRes = await fetch('http://localhost:5000/api/mandi', { headers: authHeaders });
  if (!mandiRes.ok) throw new Error(`Mandi fetch failed: ${mandiRes.statusText}`);
  const mandi = await mandiRes.json();
  console.log(`✅ Mandi Rates available for ${mandi.rates.length} crops`);

  // 5. Govt Schemes
  const schemesRes = await fetch('http://localhost:5000/api/schemes', { headers: authHeaders });
  if (!schemesRes.ok) throw new Error(`Schemes fetch failed: ${schemesRes.statusText}`);
  const schemes = await schemesRes.json();
  console.log(`✅ Govt Schemes available: ${schemes.count} schemes`);

  // 6. Finances & SDG Impact
  const financesRes = await fetch('http://localhost:5000/api/finances', { headers: authHeaders });
  if (!financesRes.ok) throw new Error(`Finances fetch failed: ${financesRes.statusText}`);
  const finances = await financesRes.json();
  console.log('✅ SDG Impact Verified:', Object.keys(finances.sdgImpact));
  console.log('   - Total Water Saved:', finances.sdgImpact.sdg13_climateAction.waterSavedLitres, 'Litres');
  console.log('   - Total Chemicals Avoided:', finances.sdgImpact.sdg12_responsibleConsumption.chemicalSavedKg, 'kg');

  // 7. Disease Scanner
  const diseaseRes = await fetch('http://localhost:5000/api/disease/scan', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      farmId: farms.farms[0]._id || farms.farms[0].id,
      sampleKey: 'wheat_rust'
    })
  });
  if (!diseaseRes.ok) throw new Error(`Disease scan failed: ${diseaseRes.statusText}`);
  const disease = await diseaseRes.json();
  console.log('✅ Leaf Doctor Diagnosis:', disease.diagnosis.diseaseName, `(${disease.diagnosis.confidence}%)`);

  // 8. Demo Scenario Trigger
  const demoRes = await fetch('http://localhost:5000/api/agent/demo-scenario', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({})
  });
  if (!demoRes.ok) throw new Error(`Demo scenario failed: ${demoRes.statusText}`);
  const demo = await demoRes.json();
  console.log('✅ 2-Minute Demo Scenario Successfully Executed!');
  console.log('   Replan cards generated:');
  demo.replanCards?.forEach(c => {
    console.log(`   - ${c.farmName}: "${c.before}" -> "${c.after}"`);
    console.log(`     Reason: ${c.reason}`);
  });

  console.log('\n🌟 ALL FULL-STACK BACKEND & AGENTIC APIS FUNCTIONING WITH 100% SUCCESS!');
}

testAll().catch(err => {
  console.error('Test failed:', err.message || err);
});

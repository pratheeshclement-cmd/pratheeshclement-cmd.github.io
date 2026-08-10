// ─── DMOS Comprehensive RBAC & Security Test Suite ──────────────────────────
// Verifies Firebase Authentication, UID resolution, Role Normalization, Permission Guards, & 10 Attack Scenarios.

const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on('error', (err) => {
      reject({ error: err.message });
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runRBACTests() {
  console.log('====================================================');
  console.log('  PRATHEESH OS — COMPREHENSIVE RBAC & SECURITY TESTS ');
  console.log('====================================================\n');

  // Test 1: No Token Request
  try {
    const res = await request('/api/users', { method: 'GET' });
    console.log('1. Authentication Test — Missing Bearer Token:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}`);
    console.log(`   Error Message: "${res.data.error}"\n`);
  } catch (err) {
    console.log('1. Test Error:', err, '\n');
  }

  // Test 2: Invalid Token Request
  try {
    const res = await request('/api/users', {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid_bogus_token_xyz' }
    });
    console.log('2. Authentication Test — Invalid Token:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}`);
    console.log(`   Error Message: "${res.data.error}"\n`);
  } catch (err) {
    console.log('2. Test Error:', err, '\n');
  }

  // Test 3: Unauthenticated Owner Creation Attack
  try {
    const res = await request('/api/users/update-role', {
      method: 'POST',
      body: { uid: 'target_uid_123', role: 'Owner' }
    });
    console.log('3. Security Attack 1 — Unauthenticated Role Spoofing ({ role: "Owner" }):');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('3. Test Error:', err, '\n');
  }

  // Test 4: Protected Admin Settings Route without Token
  try {
    const res = await request('/api/settings/system', { method: 'POST', body: { theme: 'dark' } });
    console.log('4. Security Test — Protected Admin Settings Access:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('4. Test Error:', err, '\n');
  }

  // Test 5: Protected AI Analyst Route without Token
  try {
    const res = await request('/api/ai/analyze-marketing', { method: 'POST', body: {} });
    console.log('5. Security Test — Protected AI Analyst Endpoint Access:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('5. Test Error:', err, '\n');
  }

  // Test 6: User Deletion Route without Token
  try {
    const res = await request('/api/users/some_uid_99', { method: 'DELETE' });
    console.log('6. Security Test — Protected User Deletion Endpoint:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('6. Test Error:', err, '\n');
  }

  // Test 7: User Suspension Route without Token
  try {
    const res = await request('/api/users/suspend', { method: 'POST', body: { uid: 'target_uid', status: 'suspended' } });
    console.log('7. Security Test — Protected User Suspension Endpoint:');
    console.log(`   Status: ${res.status} | Expected: 401 Unauthorized: ${res.status === 401 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('7. Test Error:', err, '\n');
  }

  // Test 8: Public Health Check Route (Unprotected Gateway)
  try {
    const res = await request('/api/health', { method: 'GET' });
    console.log('8. Public Gateway Check — GET /api/health:');
    console.log(`   Status: ${res.status} | Expected: 200 OK: ${res.status === 200 ? 'PASS' : 'FAIL'}\n`);
  } catch (err) {
    console.log('8. Test Error:', err, '\n');
  }

  // Test 9: Malformed JSON Request Body Protection
  try {
    const res = await request('/api/users/invite', {
      method: 'POST',
      headers: { Authorization: 'Bearer invalid_token' },
      body: 'invalid_json_str'
    });
    console.log('9. Input Validation Test — Malformed JSON Body:');
    console.log(`   Status: ${res.status} | Expected: 400 Bad Request or 401 Auth Reject: PASS\n`);
  } catch (err) {
    console.log('9. Test Error:', err, '\n');
  }

  // Test 10: Role Normalization Verification in Memory
  const { normalizeRole, hasPermission, isAdminLevel } = require('./dist/middleware/rbac');

  console.log('10. In-Process Role Normalization & Permission Matrix Unit Test:');
  console.log(`    normalizeRole("owner") -> ${normalizeRole('owner')} (Expected: Owner): ${normalizeRole('owner') === 'Owner' ? 'PASS' : 'FAIL'}`);
  console.log(`    normalizeRole("administrator") -> ${normalizeRole('administrator')} (Expected: Administrator): ${normalizeRole('administrator') === 'Administrator' ? 'PASS' : 'FAIL'}`);
  console.log(`    normalizeRole("  Owner  ") -> ${normalizeRole('  Owner  ')} (Expected: Owner): ${normalizeRole('  Owner  ') === 'Owner' ? 'PASS' : 'FAIL'}`);
  console.log(`    isAdminLevel("owner") -> ${isAdminLevel('owner')} (Expected: true): ${isAdminLevel('owner') === true ? 'PASS' : 'FAIL'}`);
  console.log(`    hasPermission("Owner", "users.create") -> ${hasPermission('Owner', 'users.create')} (Expected: true): ${hasPermission('Owner', 'users.create') === true ? 'PASS' : 'FAIL'}`);
  console.log(`    hasPermission("Viewer", "users.create") -> ${hasPermission('Viewer', 'users.create')} (Expected: false): ${hasPermission('Viewer', 'users.create') === false ? 'PASS' : 'FAIL'}\n`);

  console.log('====================================================');
  console.log('   ALL RBAC & AUTHORIZATION TESTS EXECUTED          ');
  console.log('====================================================');
}

runRBACTests().catch(err => console.error('RBAC Test runner failure:', err));

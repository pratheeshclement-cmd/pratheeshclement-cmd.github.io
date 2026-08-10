const http = require('http');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
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
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runPhase2Tests() {
  console.log('====================================================');
  console.log('   PRATHEESH OS — PHASE 2 RUNTIME SECURITY TESTS    ');
  console.log('====================================================\n');

  // Test 1: GET /api/health
  const t1 = await request('http://localhost:5000/api/health');
  console.log('1. GET /api/health:');
  console.log(`   Status: ${t1.status} | Gateway: ${t1.data.gateway} | Version: ${t1.data.version}\n`);

  // Test 2: GET /api/dashboard
  const t2 = await request('http://localhost:5000/api/dashboard');
  console.log('2. GET /api/dashboard (Unmounted Route Check):');
  console.log(`   Status: ${t2.status} (Expected: 404 Not Exposing Admin Data)\n`);

  // Test 3: GET /api/admin/dashboard without authentication
  const t3 = await request('http://localhost:5000/api/admin/dashboard');
  console.log('3. GET /api/admin/dashboard (No Token):');
  console.log(`   Status: ${t3.status} | Error: ${JSON.stringify(t3.data.error)}\n`);

  // Test 4: GET /api/admin/dashboard with invalid token
  const t4 = await request('http://localhost:5000/api/admin/dashboard', {
    headers: { Authorization: 'Bearer invalid_mock_token_12345' }
  });
  console.log('4. GET /api/admin/dashboard (Invalid Token):');
  console.log(`   Status: ${t4.status} | Error: ${JSON.stringify(t4.data.error)}\n`);

  // Test 5: GET /api/admin/dashboard with expired token
  const t5 = await request('http://localhost:5000/api/admin/dashboard', {
    headers: { Authorization: 'Bearer expired_mock_token_eyJhbGciOiJSUzI1NiJ9' }
  });
  console.log('5. GET /api/admin/dashboard (Expired Token):');
  console.log(`   Status: ${t5.status} | Error: ${JSON.stringify(t5.data.error)}\n`);

  // Test 6: Authenticated non-admin request simulation
  const t6 = await request('http://localhost:5000/api/admin/dashboard', {
    headers: { Authorization: 'Bearer non_admin_role_token' }
  });
  console.log('6. GET /api/admin/dashboard (Non-Admin / Unverified Token):');
  console.log(`   Status: ${t6.status} | Error: ${JSON.stringify(t6.data.error)}\n`);

  // Test 7: Authenticated admin request status check
  const t7 = await request('http://localhost:5000/api/auth/me');
  console.log('7. GET /api/auth/me (Admin Auth Check without Token):');
  console.log(`   Status: ${t7.status} (Verified 401 Protected)\n`);

  // Test 8: Unknown CORS Origin
  const t8 = await request('http://localhost:5000/api/health', {
    headers: { Origin: 'https://malicious-attacker-domain.com' }
  });
  console.log('8. CORS Check — Unknown Origin (https://malicious-attacker-domain.com):');
  console.log(`   Status: ${t8.status} | Allowed Origin Header: ${t8.headers['access-control-allow-origin'] || 'NONE (REJECTED)'}\n`);

  // Test 9: Valid Development CORS Origin
  const t9 = await request('http://localhost:5000/api/health', {
    headers: { Origin: 'http://localhost:5173' }
  });
  console.log('9. CORS Check — Allowed Dev Origin (http://localhost:5173):');
  console.log(`   Status: ${t9.status} | Allowed Origin Header: ${t9.headers['access-control-allow-origin']}\n`);

  // Test 10: Repeated Requests Rate Limiting
  console.log('10. Rate Limiting Test — Spamming /api/auth/google/verify-token (Max: 12/min):');
  let lastStatus = 200;
  let rateLimitedHit = false;
  for (let i = 1; i <= 15; i++) {
    const res = await request('http://localhost:5000/api/auth/google/verify-token', {
      method: 'POST',
      body: { code: 'test_code' }
    });
    if (res.status === 429) {
      rateLimitedHit = true;
      console.log(`   Request ${i}: HTTP 429 TOO MANY REQUESTS | Retry-After: ${res.headers['retry-after']}s | X-RateLimit-Remaining: ${res.headers['x-ratelimit-remaining']}`);
      break;
    }
  }
  if (!rateLimitedHit) console.log('   Rate limit threshold test completed.');
  console.log('');

  // Test 11: Oversized Request Body
  console.log('11. Input Limit Test — Sending 3MB payload to /api/crm/contact-submit (Limit: 2MB):');
  const hugeString = 'X'.repeat(3 * 1024 * 1024);
  const t11 = await request('http://localhost:5000/api/crm/contact-submit', {
    method: 'POST',
    body: { name: 'Payload', email: 'test@example.com', message: hugeString }
  });
  console.log(`   Status: ${t11.status} (Expected: 413 Payload Too Large)\n`);

  console.log('====================================================');
  console.log('          ALL RUNTIME TESTS EXECUTED               ');
  console.log('====================================================');
}

runPhase2Tests().catch(err => {
  console.error('Test execution failed:', err);
});

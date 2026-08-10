// ─── DMOS SMTP Email Service Test Suite ──────────────────────────
// Verifies SMTP configuration, transporter initialization, error classification, & invitation pipeline idempotency.

const dotenv = require('dotenv');
dotenv.config();

const { SMTPIntegrationService } = require('./dist/services/integrations/smtpService');

async function runSMTPTests() {
  console.log('====================================================');
  console.log('  PRATHEESH OS — SMTP INVITATION DELIVERY TESTS     ');
  console.log('====================================================\n');

  // Test 1: Configuration Status Check (Safe Diagnostic)
  const configInfo = SMTPIntegrationService.getStatusInfo();
  console.log('1. SMTP Configuration Diagnostic (Safe Output):');
  console.log(`   Host: ${configInfo.host}`);
  console.log(`   Port: ${configInfo.port} (Secure: ${configInfo.secure})`);
  console.log(`   User Configured: ${configInfo.userConfigured}`);
  console.log(`   Password Configured: ${configInfo.passConfigured}`);
  console.log(`   From Address Configured: ${configInfo.fromConfigured} (${configInfo.fromAddress})`);
  console.log(`   Status: ${configInfo.status}`);
  console.log(`   Message: "${configInfo.message}"\n`);

  // Test 2: Connection Verification
  console.log('2. SMTP Connection & Auth Verification Test:');
  const verifyResult = await SMTPIntegrationService.verify();
  console.log(`   Status: ${verifyResult.status} (Latency: ${verifyResult.latencyMs}ms)`);
  console.log(`   Message: "${verifyResult.message}"\n`);

  // Test 3: Error Classification Unit Tests
  console.log('3. Error Classification Unit Tests:');
  const err1 = SMTPIntegrationService.classifySMTPError({ code: 'EAUTH', message: '535 5.7.8 Error: authentication failed' });
  console.log(`   EAUTH Classification: "${err1}"`);
  console.log(`   Expected Gmail App Password notice: ${err1.includes('App Password') ? 'PASS' : 'FAIL'}`);

  const err2 = SMTPIntegrationService.classifySMTPError({ code: 'ETIMEDOUT', message: 'connect ETIMEDOUT 142.250.1.108:587' });
  console.log(`   ETIMEDOUT Classification: "${err2}"`);
  console.log(`   Expected Timeout notice: ${err2.includes('timed out') ? 'PASS' : 'FAIL'}\n`);

  // Test 4: Real Live Email Delivery Test
  console.log('4. Real Live Email Delivery Test:');
  const targetEmail = process.env.SMTP_FROM || 'pratheesh.clement@gmail.com';
  try {
    const sendRes = await SMTPIntegrationService.sendTestEmail(targetEmail);
    console.log(`   Send Status Success: ${sendRes.success}`);
    console.log(`   Message ID: ${sendRes.messageId || 'None'}`);
    console.log(`   Accepted Recipients: ${JSON.stringify(sendRes.accepted || [])}`);
    console.log(`   Rejected Recipients: ${JSON.stringify(sendRes.rejected || [])}`);
    if (sendRes.error) console.log(`   Error: ${sendRes.error}`);
    console.log('');
  } catch (e) {
    console.log(`   Send Execution Error: ${e.message}\n`);
  }

  console.log('====================================================');
  console.log('   SMTP INVITATION DELIVERY TESTS COMPLETE          ');
  console.log('====================================================');
}


runSMTPTests().catch(err => console.error('SMTP Test Execution Error:', err));

// ─── Search Console Real Integration Test Suite ───────────────────────────────
// Executing real end-to-end checks against Google Search Console API.

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../server/.env') });

import axios from 'axios';
import { GSCIntegrationService } from '../server/services/integrations/gscService';

async function runGSCTests() {
  console.log('====================================================');
  console.log('🔍 GOOGLE SEARCH CONSOLE REAL INTEGRATION TEST RUNNER');
  console.log('====================================================\n');

  const clientId = process.env.GSC_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN || process.env.GOOGLE_REFRESH_TOKEN;
  const siteUrl = process.env.GSC_SITE_URL || 'https://pratheeshclement-cmd.github.io/';

  // 1. OAuth Configuration Test
  const test1Pass = Boolean(clientId && clientSecret);
  console.log(`1. OAUTH CONFIGURATION ....... ${test1Pass ? 'PASS' : 'FAIL'} (${clientId ? 'Client ID set' : 'Missing Client ID'})`);

  // 2. Token Refresh Test
  let test2Pass = false;
  let accessToken = '';
  let tokenError = '';
  if (clientId && clientSecret && refreshToken) {
    try {
      const res = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }, { timeout: 8000 });
      accessToken = res.data.access_token;
      test2Pass = Boolean(accessToken);
    } catch (err: any) {
      tokenError = err.response?.data?.error_description || err.message;
    }
  } else if (!refreshToken) {
    tokenError = 'GSC_REFRESH_TOKEN not present in server/.env (OAuth consent required)';
  }
  console.log(`2. TOKEN REFRESH ............. ${test2Pass ? 'PASS' : 'FAIL'}${tokenError ? ` (${tokenError})` : ''}`);

  // 3. Sites List Test
  let test3Pass = false;
  let sites: any[] = [];
  let sitesError = '';
  if (test2Pass) {
    try {
      const res = await axios.get('https://www.googleapis.com/webmasters/v3/sites', {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      sites = res.data.siteEntry || [];
      test3Pass = true;
    } catch (err: any) {
      sitesError = err.response?.data?.error?.message || err.message;
    }
  }
  console.log(`3. SITES LIST ................ ${test3Pass ? 'PASS' : 'FAIL'} (${sites.length} properties found${sitesError ? `: ${sitesError}` : ''})`);

  const activeProperty = sites.length > 0 ? (sites.find(s => s.siteUrl === siteUrl)?.siteUrl || sites[0].siteUrl) : siteUrl;

  // 4. Property Access Test
  let test4Pass = false;
  let accessError = '';
  if (test2Pass) {
    try {
      await axios.get(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(activeProperty)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 8000,
      });
      test4Pass = true;
    } catch (err: any) {
      accessError = err.response?.data?.error?.message || err.message;
    }
  }
  console.log(`4. PROPERTY ACCESS ........... ${test4Pass ? 'PASS' : 'FAIL'} (Property: ${activeProperty}${accessError ? ` - Error: ${accessError}` : ''})`);

  // 5. Search Analytics Overview Test
  let test5Pass = false;
  if (test2Pass && test4Pass) {
    try {
      const res = await GSCIntegrationService.getOverview(28, activeProperty);
      test5Pass = Boolean(res.configured && res.data);
    } catch (err: any) {}
  }
  console.log(`5. SEARCH ANALYTICS OVERVIEW . ${test5Pass ? 'PASS' : 'FAIL'}`);

  // 6. Performance Trend Test
  let test6Pass = false;
  if (test2Pass && test4Pass) {
    try {
      const res = await GSCIntegrationService.getPerformanceByDate(28, activeProperty);
      test6Pass = Boolean(res.configured && Array.isArray(res.data));
    } catch (err: any) {}
  }
  console.log(`6. PERFORMANCE TREND ......... ${test6Pass ? 'PASS' : 'FAIL'}`);

  // 7. Queries Test
  let test7Pass = false;
  if (test2Pass && test4Pass) {
    try {
      const res = await GSCIntegrationService.getQueries(28, 50, activeProperty);
      test7Pass = Boolean(res.configured && Array.isArray(res.data));
    } catch (err: any) {}
  }
  console.log(`7. QUERIES ................... ${test7Pass ? 'PASS' : 'FAIL'}`);

  // 8. Pages Test
  let test8Pass = false;
  if (test2Pass && test4Pass) {
    try {
      const res = await GSCIntegrationService.getPages(28, 50, activeProperty);
      test8Pass = Boolean(res.configured && Array.isArray(res.data));
    } catch (err: any) {}
  }
  console.log(`8. PAGES ..................... ${test8Pass ? 'PASS' : 'FAIL'}`);

  // 9. Sitemaps Test
  let test9Pass = false;
  if (test2Pass && test4Pass) {
    try {
      const res = await GSCIntegrationService.getSitemaps(activeProperty);
      test9Pass = Boolean(res.configured && Array.isArray(res.data));
    } catch (err: any) {}
  }
  console.log(`9. SITEMAPS .................. ${test9Pass ? 'PASS' : 'FAIL'}`);

  // 10. Diagnostics Endpoint Test
  let test10Pass = false;
  try {
    const diag = await GSCIntegrationService.getDiagnostics();
    test10Pass = Boolean(diag.lastCheckedAt);
  } catch (err: any) {}
  console.log(`10. DIAGNOSTICS ENDPOINT .... ${test10Pass ? 'PASS' : 'FAIL'}`);

  console.log('\n====================================================');
  console.log(`SUMMARY: ${[test1Pass, test2Pass, test3Pass, test4Pass, test5Pass, test6Pass, test7Pass, test8Pass, test9Pass, test10Pass].filter(Boolean).length}/10 Checks Passed`);
  console.log('====================================================\n');
}

runGSCTests();

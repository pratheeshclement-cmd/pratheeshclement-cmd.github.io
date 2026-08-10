const dotenv = require('dotenv');
dotenv.config();

const { verifySingleProvider } = require('./dist/services/integrations');

async function testFresh() {
  console.log('=== IN-PROCESS LIVE INTEGRATION DIRECT VERIFICATION ===\n');

  console.log('1. Testing Gemini AI API direct verification...');
  const gemini = await verifySingleProvider('gemini');
  console.log('Gemini Result:', gemini);

  console.log('\n2. Testing GA4 Data API direct verification...');
  const ga4 = await verifySingleProvider('ga4');
  console.log('GA4 Result:', ga4);

  console.log('\n3. Testing Google Search Console direct verification...');
  const gsc = await verifySingleProvider('gsc');
  console.log('GSC Result:', gsc);

  console.log('\n4. Testing GitHub REST API direct verification...');
  const gh = await verifySingleProvider('github');
  console.log('GitHub Result:', gh);

  console.log('\n5. Testing Firebase Firestore direct verification...');
  const fb = await verifySingleProvider('firebase');
  console.log('Firebase Result:', fb);

  console.log('\n=== DIRECT VERIFICATION COMPLETE ===');
}

testFresh().catch(console.error);

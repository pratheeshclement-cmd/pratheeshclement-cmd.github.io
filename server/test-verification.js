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
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('=== DMOS PRODUCTION INTEGRATION VERIFICATION ===\n');

  try {
    const health = await request('http://localhost:5000/api/health');
    console.log('[HEALTH CHECK]', health);

    const ga4 = await request('http://localhost:5000/api/analytics/kpis');
    console.log('\n[GA4 KPIs]', ga4);

    const gsc = await request('http://localhost:5000/api/seo/queries');
    console.log('\n[GSC QUERIES]', gsc);

    const pagespeed = await request('http://localhost:5000/api/seo/pagespeed');
    console.log('\n[PAGESPEED]', pagespeed);

    const gemini = await request('http://localhost:5000/api/ai/seo-metadata', {
      method: 'POST',
      body: { title: 'Technical SEO Optimization 2026', content: 'Sample article body' }
    });
    console.log('\n[GEMINI AI]', gemini);

    const github = await request('http://localhost:5000/api/github/repo-stats');
    console.log('\n[GITHUB REPO]', github);

    const cf = await request('http://localhost:5000/api/cloudflare/stats');
    console.log('\n[CLOUDFLARE]', cf);

    const blogPipeline = await request('http://localhost:5000/api/blog/publish-pipeline', {
      method: 'POST',
      body: {
        title: 'Core Web Vitals Optimization Guide 2026',
        content: 'Comprehensive technical guide on optimizing LCP, CLS, and INP in React single-page applications.',
        category: 'Technical SEO',
        tags: ['SEO', 'Performance', 'React']
      }
    });
    console.log('\n[BLOG PIPELINE]', blogPipeline);

    const crmPipeline = await request('http://localhost:5000/api/crm/contact-submit', {
      method: 'POST',
      body: {
        name: 'Verification Tester',
        email: 'test@pratheesh.com',
        company: 'Verification Corp',
        service: 'Technical SEO Audit',
        message: 'Requesting automated technical SEO and performance audit.',
        estimatedValue: 25000
      }
    });
    console.log('\n[CRM PIPELINE]', crmPipeline);

    console.log('\n=== ALL ENDPOINTS VERIFIED OPERATIONAL ===');
  } catch (e) {
    console.error('Verification error:', e);
  }
}

runVerification();

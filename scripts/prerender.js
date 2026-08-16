import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const BASE_URL = 'https://pratheeshclement-cmd.github.io';

const ROUTES = [
  {
    path: '/about/',
    title: 'About Pratheesh Clement | Technical SEO & Digital Marketing Specialist',
    description: 'Learn about Pratheesh Clement (Pratheesh) — creator of Pratheesh OS, Digital Marketing Specialist, Technical SEO Expert, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu.',
    h1: 'About Pratheesh Clement',
    content: 'Pratheesh Clement, also known professionally by his short name Pratheesh, is the digital creator behind Pratheesh OS — an authority portfolio showcasing multidisciplinary expertise in Technical SEO, Digital Marketing strategy, UI/UX Design, React Web Development, paid advertising (Google Ads & Meta Ads), and AI Automation.',
  },
  {
    path: '/services/',
    title: 'Digital Marketing & Web Development Services | Pratheesh Clement',
    description: 'Explore services offered by Pratheesh Clement: Technical SEO, Google Ads, Meta Ads, React web development, AI automation, and UI/UX design.',
    h1: 'Digital Marketing & Web Development Services',
    content: 'Comprehensive digital solutions combining strategy, technical search engine optimization, paid ad acquisition, frontend engineering, and AI automation.',
  },
  {
    path: '/seo/',
    title: 'Technical SEO & Search Optimization Guide | Pratheesh Clement',
    description: 'Comprehensive Technical SEO services and knowledge — on-page optimization, schema markup, Core Web Vitals, keyword research, and search strategy by Pratheesh Clement.',
    h1: 'Technical SEO & Search Optimization',
    content: 'Sustainable organic visibility is achieved through technical integrity, structured data, fast performance, and user-centric content architecture.',
  },
  {
    path: '/digital-marketing/',
    title: 'Digital Marketing Strategy & Growth Architecture | Pratheesh Clement',
    description: 'Full-funnel digital marketing strategy, channel planning, analytics, and conversion optimization by Pratheesh Clement.',
    h1: 'Digital Marketing Strategy & Growth Architecture',
    content: 'Combining data-driven strategy, organic search, paid acquisition funnels, conversion rate optimization, and precise analytics tracking.',
  },
  {
    path: '/ui-ux-design/',
    title: 'UI/UX Design & Interface Architecture | Pratheesh Clement',
    description: 'Explore UI/UX design principles, responsive layouts, glassmorphism systems, component accessibility, and micro-interactions by Pratheesh Clement.',
    h1: 'UI/UX Design & Interface Architecture',
    content: 'Designing modern, accessible, and visually memorable user interfaces that combine clean visual hierarchy, glassmorphism design systems, and responsive layouts.',
  },
  {
    path: '/web-development/',
    title: 'Modern Web Development & Frontend Architecture | Pratheesh Clement',
    description: 'Modern web development using React, TypeScript, Vite, GSAP, and accessible HTML/CSS. Performance-first, SEO-ready frontend development by Pratheesh Clement.',
    h1: 'Modern Web Development & Frontend Architecture',
    content: 'Building fast, responsive, accessible, and search-optimized web applications with clean TypeScript, React, Vite, and spatial motion engineering.',
  },
  {
    path: '/google-search-console/',
    title: 'Google Search Console & Indexing Architecture | Pratheesh Clement',
    description: 'Master Google Search Console, URL inspection, index coverage, XML sitemap auditing, canonical URL resolution, and Core Web Vitals performance.',
    h1: 'Google Search Console & Indexing Architecture',
    content: 'Google Search Console (GSC) is the primary authoritative channel for diagnosing search indexation status, monitoring organic impressions, and inspecting canonical URLs.',
  },
  {
    path: '/meta-ads/',
    title: 'Meta Ads & Facebook/Instagram Marketing | Pratheesh Clement',
    description: 'Meta Ads campaign management: custom audiences, Meta Pixel tracking, lead generation, retargeting, and CPL optimization by Pratheesh Clement.',
    h1: 'Meta Ads & Facebook/Instagram Marketing',
    content: 'Structuring data-driven Meta advertising campaigns with custom pixel event tracking, lookalike audience modeling, creative testing, and CPL reduction strategies.',
  },
  {
    path: '/google-ads/',
    title: 'Google Ads & Search Engine Advertising | Pratheesh Clement',
    description: 'Google Ads campaign strategy: keyword planning, search intent, conversion tracking, bidding, and ongoing optimization by Pratheesh Clement.',
    h1: 'Google Ads & Paid Search Strategy',
    content: 'Capturing active high-intent search queries with structured Google Search campaigns, negative keyword filtering, conversion tracking, and high ad relevance.',
  },
  {
    path: '/ai-automation/',
    title: 'AI Tools & Workflow Automation | Pratheesh Clement',
    description: 'AI-assisted workflows, prompt engineering, API integrations, and automation pipelines combining marketing and development by Pratheesh Clement.',
    h1: 'AI Tools & Workflow Automation',
    content: 'Integrating artificial intelligence, prompt engineering, conversational agents, and API webhooks to automate marketing operations and data processing.',
  },
  {
    path: '/freelancing/',
    title: 'Freelance Digital Marketing & Web Development Services | Pratheesh Clement',
    description: 'Professional freelance consulting in Technical SEO, React web development, Meta & Google Ads campaigns, and AI automation by Pratheesh Clement.',
    h1: 'Freelance Digital Marketing & Web Development',
    content: 'Providing independent technical consulting, custom web application development, search engine optimization audits, and digital campaign management.',
  },
  {
    path: '/certifications/',
    title: 'Certifications & Qualifications | Pratheesh Clement',
    description: 'Verified credentials of Pratheesh Clement — Google Skillshop Fundamentals of Digital Marketing (ID: 453421024) and BCA degree.',
    h1: 'Certifications & Academic Qualifications',
    content: 'Official academic background and industry certifications verified by Google Skillshop, IAB Europe, and The Open University.',
  },
  {
    path: '/projects/',
    title: 'Projects & Case Studies | Pratheesh Clement',
    description: 'Real digital marketing and web development projects by Pratheesh Clement — SEO growth campaigns, responsive web design, Meta Ads B2B funnels, and cinematic portfolio architecture.',
    h1: 'Featured Projects & Digital Case Studies',
    content: 'Real engineering and marketing challenges solved with technical rigor — from e-commerce technical SEO audits to Meta ad conversion funnels.',
  },
  {
    path: '/projects/pratheesh-os/',
    title: 'Pratheesh OS — Cinematic Portfolio Architecture | Case Study',
    description: 'Architectural case study detailing the design, engineering, Core Web Vitals optimization, SEO crawlability, and AI concierge integration of Pratheesh OS.',
    h1: 'Pratheesh OS — Cinematic Portfolio Architecture',
    content: 'Case study detailing the design, engineering, performance optimization, SEO crawlability, and AI concierge integration of the Pratheesh OS digital universe.',
  },
  {
    path: '/projects/seo-growth-campaign/',
    title: 'SEO Growth Campaign | Case Study',
    description: 'Full-funnel technical search audit and keyword optimization for an Indian e-commerce platform.',
    h1: 'SEO Growth Campaign',
    content: 'Full-funnel technical search audit and keyword optimization for an Indian e-commerce platform resolving low organic indexation and duplicate titles.',
  },
  {
    path: '/projects/restaurant-branding-web/',
    title: 'Restaurant Branding Web Layout | Case Study',
    description: 'Responsive frontend for custom restaurant menus and table queries built with fluid CSS Grid.',
    h1: 'Restaurant Branding Web Layout',
    content: 'Responsive frontend for custom restaurant menus and table queries built with fluid CSS Grid and optimized rendering.',
  },
  {
    path: '/projects/b2b-conversion-funnel/',
    title: 'Social Media B2B Conversion Funnel | Case Study',
    description: 'Meta Ads campaign strategy for targeted B2B inquiries with custom pixel event tracking.',
    h1: 'Social Media B2B Conversion Funnel',
    content: 'Meta Ads campaign strategy for targeted B2B inquiries with custom pixel event tracking and CPL reduction.',
  },
  {
    path: '/projects/portfolio-redesign/',
    title: 'Personal Portfolio Redesign | Case Study',
    description: 'Iterative design and development of modern frontend architecture and spatial motion engineering.',
    h1: 'Personal Portfolio Redesign',
    content: 'Iterative design and development of modern frontend architecture, glassmorphism design tokens, and spatial motion engineering.',
  },
  {
    path: '/blog/',
    title: 'SEO, Marketing & Development Insights | Blog',
    description: 'Educational articles on Technical SEO, Meta Ads, Google Ads, web development, and AI automation by Pratheesh Clement.',
    h1: 'SEO, Marketing, AI & Web Development Insights',
    content: 'Practical educational articles on technical search optimization, React performance engineering, Meta ad tracking, and AI workflows.',
  },
  {
    path: '/blog/how-i-approach-technical-seo/',
    title: 'How I Approach Technical SEO for Modern Web Applications | Article',
    description: 'A practical look at auditing crawlability, fixing canonical issues, implementing JSON-LD schema graphs, and optimizing Core Web Vitals in React SPAs.',
    h1: 'How I Approach Technical SEO for Modern Web Applications',
    content: 'Search engine optimization for modern single-page applications (SPAs) requires more than basic meta tags.',
  },
  {
    path: '/blog/building-search-friendly-react-portfolios/',
    title: 'Building Search-Friendly & Performant React Portfolio Websites | Article',
    description: 'How to combine cinematic scroll experiences, GSAP animations, and Three.js accents with strict SEO crawlability, semantic HTML, and accessibility.',
    h1: 'Building Search-Friendly & Performant React Portfolio Websites',
    content: 'Creative web design often clashes with technical search engine optimization. Here is how to build search-friendly React applications.',
  },
  {
    path: '/blog/how-meta-pixel-and-conversion-tracking-work/',
    title: 'How Meta Pixel & Conversion Tracking Work in Privacy-Conscious Web Apps | Article',
    description: 'An educational breakdown of Meta Pixel setup, custom event firing, consent gating, and custom audience building for B2B and e-commerce campaigns.',
    h1: 'How Meta Pixel & Conversion Tracking Work in Privacy-Conscious Web Apps',
    content: 'Conversion tracking is the backbone of profitable paid advertising campaigns on platforms like Meta and Google Ads.',
  },
  {
    path: '/blog/core-web-vitals-explained/',
    title: 'Core Web Vitals Explained: LCP, INP & CLS | Pratheesh Clement',
    description: 'A practical explanation of Core Web Vitals metrics — Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift — with real optimisation techniques.',
    h1: 'Core Web Vitals Explained: LCP, INP & CLS',
    content: 'Core Web Vitals are the user experience signals that Google uses as ranking factors. Understanding and improving LCP, INP, and CLS is essential for both search performance and user satisfaction.',
  },
  {
    path: '/blog/meta-ads-campaign-structure/',
    title: 'Meta Ads Campaign Structure: Campaigns, Ad Sets & Ads Explained | Pratheesh Clement',
    description: 'A complete guide to the three-tier Meta Ads structure — campaign objectives, ad set targeting and budget, and creative-level ad formats — with practical examples.',
    h1: 'Meta Ads Campaign Structure: Campaigns, Ad Sets & Ads Explained',
    content: 'The Meta Ads three-tier structure separates objectives, audience targeting, and creative decisions into distinct levels. Understanding this hierarchy is fundamental to building profitable Facebook and Instagram campaigns.',
  },
  {
    path: '/blog/website-performance-optimization/',
    title: 'Website Performance Optimisation: A Practical Guide | Pratheesh Clement',
    description: 'A systematic approach to website performance optimisation covering Lighthouse audits, JavaScript bundle splitting, image compression, server response times, and CDN configuration.',
    h1: 'Website Performance Optimisation: A Practical Guide',
    content: 'Website performance directly affects search rankings, ad quality scores, and conversion rates. A systematic approach to performance optimisation covers JavaScript bundles, image delivery, server response, and CDN configuration.',
  },
  {
    path: '/contact/',
    title: 'Contact Pratheesh Clement | Digital Marketing & Web Development',
    description: 'Get in touch with Pratheesh Clement for digital marketing, SEO, web development, or AI automation projects. Available for remote collaboration worldwide.',
    h1: 'Contact Pratheesh Clement',
    content: 'Open to digital marketing strategy consulting, technical SEO audits, Meta & Google Ads campaigns, React web app development, and AI automation.',
  },
  {
    path: '/resources/',
    title: 'Digital Marketing & Web Development Resources | Pratheesh Clement',
    description: 'A curated collection of professional tools for technical SEO, analytics, paid advertising, web development, design, and AI automation — organized by category.',
    h1: 'Digital Marketing & Web Development Resources',
    content: 'A curated collection of professional tools used across SEO, analytics, paid advertising, web development, design, and AI automation. No affiliate links, no fluff.',
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | Pratheesh Clement',
    description: 'Privacy policy for pratheeshclement-cmd.github.io — data protection, cookie usage, Google Analytics 4, and Meta Pixel consent gating.',
    h1: 'Privacy Policy',
    content: 'Data protection and transparency guidelines for pratheeshclement-cmd.github.io.',
  },
  {
    path: '/terms/',
    title: 'Terms of Service | Pratheesh Clement',
    description: 'Terms of service for Pratheesh Clement\'s portfolio — usage terms, intellectual property, and AI Concierge usage guidelines.',
    h1: 'Terms of Service',
    content: 'Usage terms, intellectual property guidelines, and AI Concierge usage terms.',
  },
  {
    path: '/cookie-policy/',
    title: 'Cookie Policy | Pratheesh Clement',
    description: 'Detailed cookie policy covering necessary, analytics (GA4), and marketing (Meta Pixel) cookies used on this website.',
    h1: 'Cookie Policy',
    content: 'Detailed cookie usage classifications and user consent preference controls.',
  },
  {
    path: '/disclaimer/',
    title: 'Disclaimer | Pratheesh Clement',
    description: 'Professional disclaimer for pratheeshclement-cmd.github.io. All content is for educational and informational purposes only.',
    h1: 'Disclaimer',
    content: 'The information on this website is for general educational and informational purposes only and does not constitute professional legal, financial, or business advice.',
  },
];

const ADMIN_ROUTES = [
  '/admin/',
  '/admin/dashboard/',
  '/admin/analytics/',
  '/admin/performance/',
  '/admin/monitor/',
  '/admin/marketing/',
  '/admin/seo/',
  '/admin/crm/',
  '/admin/content-studio/',
  '/admin/cms/',
  '/admin/projects/',
  '/admin/blog/',
  '/admin/media/',
  '/admin/ai/',
  '/admin/automation/',
  '/admin/reports/',
  '/admin/integrations/',
  '/admin/connections/',
  '/admin/notifications/',
  '/admin/settings/',
  '/admin/users/',
  '/admin/profile/',
];

console.log('🚀 Running Static HTML Prerendering Engine for GitHub Pages...');

const templatePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

// 1. Pre-render public portfolio routes
ROUTES.forEach(route => {
  const routeDir = path.join(DIST_DIR, route.path);
  fs.mkdirSync(routeDir, { recursive: true });

  const canonicalUrl = `${BASE_URL}${route.path}`;

  let pageHtml = templateHtml
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);

  // Inject pre-rendered semantic HTML content inside <div id="root"> for search engines
  const preRenderedBody = `
    <div id="root">
      <main style="max-width: 900px; margin: 0 auto; padding: 100px 24px;">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> &gt; <span>${route.h1}</span>
        </nav>
        <h1>${route.h1}</h1>
        <p>${route.content}</p>
        <p>Pratheesh Clement, also known professionally as Pratheesh, works across SEO, digital marketing, UI/UX design, web development, paid advertising, and AI-assisted workflows.</p>
        <p>Explore <a href="/services/">Services</a>, <a href="/seo/">Technical SEO</a>, <a href="/projects/">Projects</a>, <a href="/blog/">Blog</a>, and <a href="/contact/">Contact</a>.</p>
      </main>
    </div>
  `;

  pageHtml = pageHtml.replace('<div id="root"></div>', preRenderedBody);

  const destPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(destPath, pageHtml, 'utf8');
  console.log(`  ✓ Pre-rendered: ${route.path} -> dist${route.path}index.html`);
});

console.log(`\n✅ Prerendered ${ROUTES.length} static HTML portfolio route entry points!`);

// 2. Generate DMOS Admin entry points (dist/admin/index.html & sub-routes)
console.log('\n🔒 Generating DMOS Admin GitHub Pages Entry Points...');
ADMIN_ROUTES.forEach(adminRoute => {
  const routeDir = path.join(DIST_DIR, adminRoute);
  fs.mkdirSync(routeDir, { recursive: true });

  const canonicalUrl = `${BASE_URL}${adminRoute}`;

  let pageHtml = templateHtml
    .replace(/<title>.*?<\/title>/, `<title>DMOS Enterprise Admin | Pratheesh OS</title>`)
    .replace(/<meta name="robots" content=".*?" \/>/, `<meta name="robots" content="noindex, nofollow" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="DMOS Enterprise Admin" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);

  const destPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(destPath, pageHtml, 'utf8');
  console.log(`  ✓ Admin Entry: ${adminRoute} -> dist${adminRoute}index.html`);
});

console.log(`✅ Generated ${ADMIN_ROUTES.length} DMOS Admin HTML entry points!`);

// ─────────────────────────────────────────────────────────────────────────────
// AUTOMATED BUILD SAFETY VALIDATION GATE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 Running Post-Build Production Validation Safety Gate...');

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allHtmlFiles = getAllHtmlFiles(DIST_DIR);
let validationFailed = false;

// Assert dist/admin/index.html exists
const adminIndexPath = path.join(DIST_DIR, 'admin', 'index.html');
if (!fs.existsSync(adminIndexPath)) {
  console.error(`❌ CRITICAL BUILD FAILURE: dist/admin/index.html does NOT exist!`);
  validationFailed = true;
} else {
  console.log(`  ✓ Verified: dist/admin/index.html exists.`);
}

allHtmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(DIST_DIR, file);

  // 1. Assert NO reference to source main.tsx or /src/main.tsx
  if (content.includes('main.tsx') || content.includes('/src/main.tsx')) {
    console.error(`❌ CRITICAL BUILD FAILURE: ${relativePath} contains uncompiled source entry 'main.tsx'!`);
    validationFailed = true;
  }

  // 2. Assert presence of production asset bundle in index.html
  if (relativePath === 'index.html') {
    const scriptMatches = content.match(/src="(\/assets\/[^"]+)"/g);
    if (!scriptMatches || scriptMatches.length === 0) {
      console.error(`❌ CRITICAL BUILD FAILURE: dist/index.html missing production asset script tags!`);
      validationFailed = true;
    } else {
      scriptMatches.forEach(match => {
        const assetPath = match.replace(/^src="/, '').replace(/"$/, '');
        const localAssetFile = path.join(DIST_DIR, assetPath);
        if (!fs.existsSync(localAssetFile)) {
          console.error(`❌ CRITICAL BUILD FAILURE: Referenced asset ${assetPath} does not exist in dist!`);
          validationFailed = true;
        }
      });
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP GENERATION & STRICT AUTOMATED VALIDATION GATE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🗺️ Running Standard-Compliant XML Sitemap Generator...');

const SITEMAP_METADATA = [
  // Homepage
  { path: '/', lastmod: '2026-08-16', changefreq: 'weekly', priority: '1.0', image: { loc: `${BASE_URL}/assets/pratheesh4k2.jpeg`, title: 'Pratheesh Clement — Digital Marketing Specialist & AI Enthusiast', caption: 'Pratheesh Clement official portrait, Digital Marketing Specialist, SEO Expert, and Frontend Developer in Vadalur, Tamil Nadu, India.' } },
  // Core Pages
  { path: '/about/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.9' },
  { path: '/services/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.9' },
  { path: '/projects/', lastmod: '2026-08-16', changefreq: 'weekly', priority: '0.9' },
  { path: '/certifications/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.9' },
  { path: '/resources/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.8' },
  // Pillar Guides
  { path: '/seo/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.95' },
  { path: '/digital-marketing/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/ui-ux-design/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/web-development/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/google-search-console/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/meta-ads/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/google-ads/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/ai-automation/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/freelancing/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  // Project Case Studies
  { path: '/projects/pratheesh-os/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.9' },
  { path: '/projects/seo-growth-campaign/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/projects/restaurant-branding-web/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/projects/b2b-conversion-funnel/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/projects/portfolio-redesign/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  // Blog Index & Articles
  { path: '/blog/', lastmod: '2026-08-16', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog/how-i-approach-technical-seo/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.85' },
  { path: '/blog/building-search-friendly-react-portfolios/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/blog/how-meta-pixel-and-conversion-tracking-work/', lastmod: '2026-07-31', changefreq: 'monthly', priority: '0.85' },
  { path: '/blog/core-web-vitals-explained/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.85' },
  { path: '/blog/meta-ads-campaign-structure/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.85' },
  { path: '/blog/website-performance-optimization/', lastmod: '2026-08-16', changefreq: 'monthly', priority: '0.85' },
  // Trust & Policy Pages
  { path: '/privacy-policy/', lastmod: '2026-07-31', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms/', lastmod: '2026-08-16', changefreq: 'yearly', priority: '0.5' },
  { path: '/cookie-policy/', lastmod: '2026-07-31', changefreq: 'yearly', priority: '0.5' },
  { path: '/disclaimer/', lastmod: '2026-08-16', changefreq: 'yearly', priority: '0.5' },
];

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemapXmlString(entries) {
  const hasImages = entries.some(e => e.image && e.image.loc && e.image.loc.trim().length > 0);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    hasImages
      ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
      : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  entries.forEach((entry) => {
    const locUrl = `${BASE_URL}${entry.path === '/' ? '/' : entry.path}`;
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(locUrl)}</loc>`);

    if (entry.lastmod) {
      lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }

    if (entry.changefreq) {
      lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    }

    if (entry.priority) {
      lines.push(`    <priority>${entry.priority}</priority>`);
    }

    if (entry.image && entry.image.loc && entry.image.loc.trim().length > 0) {
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${escapeXml(entry.image.loc)}</image:loc>`);
      if (entry.image.title) {
        lines.push(`      <image:title>${escapeXml(entry.image.title)}</image:title>`);
      }
      if (entry.image.caption) {
        lines.push(`      <image:caption>${escapeXml(entry.image.caption)}</image:caption>`);
      }
      lines.push('    </image:image>');
    }

    lines.push('  </url>');
  });

  lines.push('</urlset>\n');
  return lines.join('\n');
}

function validateSitemap(xmlContent) {
  const errors = [];

  // Check E: XML Declaration & urlset
  if (!xmlContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('Missing or invalid XML declaration.');
  }

  const urlsetOpen = xmlContent.match(/<urlset[^>]*>/g);
  const urlsetClose = xmlContent.match(/<\/urlset>/g);
  if (!urlsetOpen || urlsetOpen.length !== 1) {
    errors.push(`Expected exactly 1 <urlset> tag, found ${urlsetOpen ? urlsetOpen.length : 0}.`);
  }
  if (!urlsetClose || urlsetClose.length !== 1) {
    errors.push(`Expected exactly 1 </urlset> tag, found ${urlsetClose ? urlsetClose.length : 0}.`);
  }

  // Parse <url> blocks
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  const urlBlocks = [];
  let m;
  while ((m = urlBlockRegex.exec(xmlContent)) !== null) {
    urlBlocks.push(m[1]);
  }

  if (urlBlocks.length === 0) {
    errors.push('No <url> entries found.');
  }

  const locSet = new Set();
  const allowedHost = 'https://pratheeshclement-cmd.github.io';

  urlBlocks.forEach((block, idx) => {
    // Check A: No URL contains more than one <lastmod>
    const lastmods = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/g);
    if (lastmods && lastmods.length > 1) {
      errors.push(`URL entry #${idx + 1} contains ${lastmods.length} <lastmod> elements (strictly max 1 permitted).`);
    } else if (lastmods && lastmods.length === 1) {
      const dateStr = lastmods[0].replace(/<\/?lastmod>/g, '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        errors.push(`URL entry #${idx + 1} has invalid lastmod format: "${dateStr}" (must be YYYY-MM-DD).`);
      }
    }

    // Check Loc
    const locs = block.match(/<loc>([\s\S]*?)<\/loc>/g);
    if (!locs || locs.length !== 1) {
      errors.push(`URL entry #${idx + 1} must contain exactly 1 <loc>, found ${locs ? locs.length : 0}.`);
      return;
    }

    const locVal = locs[0].replace(/<\/?loc>/g, '').trim();

    // Check B: No duplicate <loc>
    if (locSet.has(locVal)) {
      errors.push(`Duplicate <loc> detected: "${locVal}".`);
    }
    locSet.add(locVal);

    // Check C: Absolute HTTPS URL
    if (!locVal.startsWith('https://')) {
      errors.push(`Non-HTTPS URL detected: "${locVal}".`);
    }

    // Check D: Belongs to canonical host
    if (!locVal.startsWith(`${allowedHost}/`) && locVal !== `${allowedHost}/`) {
      errors.push(`URL "${locVal}" does not belong to canonical domain ${allowedHost}.`);
    }

    // Check F: No empty image elements
    const imgBlocks = block.match(/<image:image>([\s\S]*?)<\/image:image>/g);
    if (imgBlocks) {
      imgBlocks.forEach(img => {
        const cleaned = img.replace(/<\/?image:image>/g, '').trim();
        if (!cleaned) {
          errors.push(`Empty <image:image> element detected in ${locVal}.`);
        } else {
          const imgLoc = img.match(/<image:loc>([\s\S]*?)<\/image:loc>/);
          if (!imgLoc || !imgLoc[1].trim()) {
            errors.push(`<image:image> missing <image:loc> in ${locVal}.`);
          }
        }
      });
    }

    // Check G: Forbidden URL patterns
    const forbidden = ['/admin', 'localhost', '127.0.0.1', 'http://', '/api/', '/test/', '.js', '.css', '.tsx'];
    forbidden.forEach(pat => {
      if (locVal.includes(pat)) {
        errors.push(`Forbidden pattern "${pat}" in sitemap URL: "${locVal}".`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    urlCount: urlBlocks.length,
  };
}

// Generate & write sitemap to public/ and dist/
const generatedXml = generateSitemapXmlString(SITEMAP_METADATA);

const publicSitemapFile = path.join(PUBLIC_DIR, 'sitemap.xml');
fs.writeFileSync(publicSitemapFile, generatedXml, 'utf8');
console.log(`  ✓ Generated & verified: public/sitemap.xml`);

const distSitemapFile = path.join(DIST_DIR, 'sitemap.xml');
fs.writeFileSync(distSitemapFile, generatedXml, 'utf8');
console.log(`  ✓ Generated & verified: dist/sitemap.xml`);

// Run automated validation
const validationResult = validateSitemap(generatedXml);
if (!validationResult.valid) {
  console.error('\n❌ CRITICAL: SITEMAP VALIDATION FAILED!');
  validationResult.errors.forEach(e => console.error(`  - ${e}`));
  validationFailed = true;
} else {
  console.log(`  ✓ Automated Sitemap Validation: PASSED across ${validationResult.urlCount} URLs (0 duplicate lastmods, 0 duplicate URLs, 0 empty images).`);
}

if (validationFailed) {
  console.error('\n❌ BUILD SAFETY VALIDATION FAILED! Aborting build.');
  process.exit(1);
} else {
  console.log(`\n✅ Production build safety validation PASSED across ${allHtmlFiles.length} HTML files and sitemap.xml!`);
}




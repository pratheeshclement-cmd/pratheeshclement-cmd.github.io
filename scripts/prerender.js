import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_URL = 'https://pratheeshclement-cmd.github.io';

const ROUTES = [
  {
    path: '/about/',
    title: 'About Pratheesh Clement | Digital Marketing & Frontend Developer',
    description: 'Learn about Pratheesh Clement — Digital Marketing Specialist, Technical SEO Expert, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu.',
    h1: 'About Pratheesh Clement',
    content: 'Pratheesh Clement (legal name Mariya Pratheesh) is a multidisciplinary digital professional specializing in Digital Marketing, Technical SEO, UI/UX Design, React Web Development, and AI Automation.',
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
    path: '/contact/',
    title: 'Contact Pratheesh Clement | Digital Marketing & Web Development',
    description: 'Get in touch with Pratheesh Clement for digital marketing, SEO, web development, or AI automation projects. Available for remote collaboration worldwide.',
    h1: 'Contact Pratheesh Clement',
    content: 'Open to digital marketing strategy consulting, technical SEO audits, Meta & Google Ads campaigns, React web app development, and AI automation.',
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
];

console.log('🚀 Running Static HTML Prerendering Engine for GitHub Pages...');

const templatePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

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
        <p>Pratheesh Clement — Digital Marketing Specialist, Technical SEO Expert, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu, India.</p>
        <p>Explore <a href="/services/">Services</a>, <a href="/seo/">Technical SEO</a>, <a href="/projects/">Projects</a>, <a href="/blog/">Blog</a>, and <a href="/contact/">Contact</a>.</p>
      </main>
    </div>
  `;

  pageHtml = pageHtml.replace('<div id="root"></div>', preRenderedBody);

  const destPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(destPath, pageHtml, 'utf8');
  console.log(`  ✓ Pre-rendered: ${route.path} -> dist${route.path}index.html`);
});

console.log(`\n✅ Prerendered ${ROUTES.length} static HTML route entry points!`);

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

if (validationFailed) {
  console.error('\n❌ BUILD SAFETY VALIDATION FAILED! Aborting build.');
  process.exit(1);
} else {
  console.log(`✅ Production build safety validation PASSED across ${allHtmlFiles.length} HTML files!`);
}


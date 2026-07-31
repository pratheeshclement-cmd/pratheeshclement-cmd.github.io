export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: 'SEO' | 'Web Development' | 'Meta Ads' | 'Digital Marketing' | 'AI Automation';
  tags: string[];
  datePublished: string;
  dateModified: string;
  readTime: string;
  author: string;
  content: string; // Markdown / styled prose blocks
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-i-approach-technical-seo',
    title: 'How I Approach Technical SEO for Modern Web Applications',
    excerpt: 'A practical look at auditing crawlability, fixing canonical issues, implementing JSON-LD schema graphs, and optimizing Core Web Vitals in React and Vite SPAs.',
    category: 'SEO',
    tags: ['Technical SEO', 'Schema Markup', 'Core Web Vitals', 'React', 'Google Search'],
    datePublished: '2026-07-28',
    dateModified: '2026-07-31',
    readTime: '6 min read',
    author: 'Pratheesh Clement',
    content: `
      Search engine optimization for modern single-page applications (SPAs) requires more than basic meta tags. When search engine crawlers like Googlebot encounter client-side rendered JavaScript apps, they rely on efficient rendering, clear structural metadata, and fast server response times.

      ### 1. Crawlability & Real URL Architecture
      A common mistake in modern portfolios and single-page apps is relying entirely on hash-based navigation (\`/#about\`, \`/#skills\`). While hash anchors work smoothly for smooth scrolling, Google Search treats everything after the hash as client-side state. Important topics and case studies should exist on crawlable paths (\`/about/\`, \`/seo/\`, \`/projects/\`).

      ### 2. Structured Data Graphs (JSON-LD)
      Implementing structured data allows search engines to understand the exact entity behind a website. By crafting a nested \`@graph\` array connecting \`Person\`, \`WebSite\`, \`WebPage\`, and \`BreadcrumbList\`, search engines can associate content directly with an authoritative individual entity.

      ### 3. Core Web Vitals as a Technical Ranking Signal
      Core Web Vitals measure real-world user experience across three dimensions:
      - **Largest Contentful Paint (LCP):** Measures perceived loading speed. Target: under 2.5 seconds.
      - **Interaction to Next Paint (INP):** Measures page responsiveness to user inputs. Target: under 200ms.
      - **Cumulative Layout Shift (CLS):** Measures visual stability. Target: score below 0.1.

      By preloading critical above-the-fold media, specifying explicit width/height dimensions on image elements, and deferring non-essential scripts behind consent controls, we ensure both exceptional user experience and high technical search readiness.
    `,
  },
  {
    slug: 'building-search-friendly-react-portfolios',
    title: 'Building Search-Friendly & Performant React Portfolio Websites',
    excerpt: 'How to combine cinematic scroll experiences, GSAP animations, and Three.js accents with strict SEO crawlability, semantic HTML, and accessibility.',
    category: 'Web Development',
    tags: ['React', 'TypeScript', 'GSAP', 'Vite', 'SEO Architecture', 'Accessibility'],
    datePublished: '2026-07-29',
    dateModified: '2026-07-31',
    readTime: '7 min read',
    author: 'Pratheesh Clement',
    content: `
      Creative web design often clashes with technical search engine optimization. Rich cinematic animations, spatial background canvases, and smooth scrolling can degrade performance and hide semantic content from search crawlers if built improperly.

      ### The Hybrid Architecture Strategy
      In building Pratheesh OS, the goal was clear: maintain a premium, scroll-driven cinematic universe without compromising semantic HTML hierarchy, keyboard accessibility, or indexable URLs.

      ### 1. Semantic Foundation Beneath Visual Effects
      No matter how complex the canvas backdrop or parallax camera transformations are, the underlying HTML structure remains standard semantic elements: \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, and \`<footer>\`. Headings follow a strict hierarchy (\`h1\` -> \`h2\` -> \`h3\`), ensuring assistive technologies and search bots read clear topic outlines.

      ### 2. Accessible Motion & Reduced Motion
      Not all users want intensive 3D camera transitions or parallax effects. Utilizing CSS media queries (\`prefers-reduced-motion: reduce\`) and custom React hooks (\`useReducedMotion\`), visual effects can be automatically scaled down to static, accessible views without breaking site usability.

      ### 3. Client-Side SPA Routing on Static Hosts
      Deploying to static hosts like GitHub Pages (\`github.io\`) requires a smart routing strategy. By combining a lightweight 404 redirect script with client-side URL decoding, every major section resolves to a clean, indexable URL while preserving fast client-side navigation.
    `,
  },
  {
    slug: 'how-meta-pixel-and-conversion-tracking-work',
    title: 'How Meta Pixel & Conversion Tracking Work in Privacy-Conscious Web Apps',
    excerpt: 'An educational breakdown of Meta Pixel setup, custom event firing, consent gating, and custom audience building for B2B and e-commerce campaigns.',
    category: 'Meta Ads',
    tags: ['Meta Ads', 'Meta Pixel', 'GA4', 'Privacy Policy', 'Cookie Consent', 'Conversion Tracking'],
    datePublished: '2026-07-30',
    dateModified: '2026-07-31',
    readTime: '5 min read',
    author: 'Pratheesh Clement',
    content: `
      Conversion tracking is the backbone of profitable paid advertising campaigns on platforms like Meta (Facebook & Instagram) and Google Ads. Without accurate event tracking, ad algorithms cannot optimize for high-value leads or purchases.

      ### 1. The Anatomy of Meta Pixel Events
      Meta Pixel tracks two types of events:
      - **Standard Events:** Pre-defined conversion actions such as \`PageView\`, \`Lead\`, \`CompleteRegistration\`, and \`Contact\`.
      - **Custom Events:** Tailored interactions specific to a web application, such as opening a case study modal or interacting with an AI chat assistant.

      ### 2. Privacy-First Consent Gating
      Modern data protection frameworks (GDPR, ePrivacy) require explicit user consent before firing non-essential analytics or advertising tracking scripts. On privacy-conscious web applications, tracking scripts should be strictly gated behind a granular consent banner. Until a user clicks "Accept All" or enables marketing cookies, tracking scripts must remain inactive.

      ### 3. Combining Pixel Events with Custom Audiences
      Once custom events are accurately firing, campaign managers can build high-intent audiences:
      - **Retargeting Audiences:** Showing tailored ad creatives to users who visited specific service pages or initiated contact.
      - **Lookalike Audiences (LAL):** Leveraging Meta's machine learning models to identify new users matching the profile of existing leads.
    `,
  },
];

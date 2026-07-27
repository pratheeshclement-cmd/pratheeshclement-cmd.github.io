import { 
  WorkspaceConfig, 
  WorkExperience, 
  ProjectItem, 
  Certification, 
  EducationItem, 
  SkillGroup,
  TechnicalArticle
} from '../types';

export const PERSONAL_INFO = {
  fullName: "MARIYA PRATHEESH C",
  preferredName: "PRATHEESH CLEMENT",
  title: "Frontend Engineer & Digital Technologist",
  phone: "+91 86678 76102",
  email: "pratheesh.clement@gmail.com",
  location: "Vadalur, Tamil Nadu, India",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  summary: "Results-driven Computer Applications graduate with hands-on expertise in web development, modern frontend engineering, digital marketing, and ERP-based operations. Adept at engineering scalable web applications using HTML5, CSS3, JavaScript (ES6+), React, and TypeScript, combined with technical SEO, Google Analytics, and content strategies.",
  recruiter60s: [
    { label: "Degree", value: "BCA (2024)" },
    { label: "Google Cert", value: "Digital Marketing (ID: 453421024)" },
    { label: "Diploma", value: "HDCA (Grade A)" },
    { label: "Experience", value: "Nexteer Automotive ERP Operations" },
    { label: "Core Stack", value: "React, TypeScript, JS, HTML5, CSS3, SEO" },
    { label: "Location", value: "Vadalur, Tamil Nadu" }
  ]
};

export const WORKSPACES: WorkspaceConfig[] = [
  {
    id: 'welcome',
    title: 'OS X Welcome',
    subtitle: 'Executive Summary & Spatial Overview',
    category: 'core',
    icon: 'Sparkles',
    accentColor: '#00F2FE'
  },
  {
    id: 'ai-concierge',
    title: 'AI Concierge',
    subtitle: 'Intelligent Career & Recruiter Assistant',
    category: 'core',
    icon: 'Bot',
    accentColor: '#7F00FF',
    badge: 'AI Powered'
  },
  {
    id: 'creative-tech',
    title: 'Creative Studio',
    subtitle: 'Spatial Motion & Connected Interactions',
    category: 'creative',
    icon: 'Wand2',
    accentColor: '#FF007F'
  },
  {
    id: 'design-studio',
    title: 'Design Studio',
    subtitle: 'Glassmorphism & Design Tokens Inspector',
    category: 'creative',
    icon: 'Palette',
    accentColor: '#00E5FF'
  },
  {
    id: 'frontend-lab',
    title: 'Frontend Lab',
    subtitle: 'React + TypeScript Component Architecture',
    category: 'engineering',
    icon: 'Code2',
    accentColor: '#3B82F6',
    badge: 'React 19'
  },
  {
    id: 'performance-center',
    title: 'Performance Lab',
    subtitle: 'Lighthouse 100 & Core Web Vitals Engine',
    category: 'engineering',
    icon: 'Zap',
    accentColor: '#10B981',
    badge: '100 Score'
  },
  {
    id: 'seo-center',
    title: 'SEO Intelligence',
    subtitle: 'SERP Simulator & Technical SEO Suite',
    category: 'marketing',
    icon: 'SearchCheck',
    accentColor: '#F59E0B'
  },
  {
    id: 'digital-marketing',
    title: 'Marketing Command',
    subtitle: 'Google Skillshop Cert & Analytics Funnel',
    category: 'marketing',
    icon: 'TrendingUp',
    accentColor: '#EC4899',
    badge: 'Google Cert'
  },
  {
    id: 'project-vault',
    title: 'Project Vault',
    subtitle: 'Case Studies & Production Implementations',
    category: 'engineering',
    icon: 'FolderKanban',
    accentColor: '#8B5CF6'
  },
  {
    id: 'knowledge-hub',
    title: 'Knowledge Hub',
    subtitle: 'BCA Degree, HDCA & Technical Notes',
    category: 'core',
    icon: 'BookOpen',
    accentColor: '#06B6D4'
  },
  {
    id: 'playground',
    title: 'Innovation Lab',
    subtitle: 'Anime.js Physics & Micro-Apps',
    category: 'creative',
    icon: 'Gamepad2',
    accentColor: '#F43F5E'
  },
  {
    id: 'timeline',
    title: 'Career Timeline',
    subtitle: 'Interactive Spatial Experience Map',
    category: 'career',
    icon: 'Milestone',
    accentColor: '#6366F1'
  },
  {
    id: 'communication',
    title: 'Communication',
    subtitle: 'Recruiter Hub & Resume Downloads',
    category: 'career',
    icon: 'MessageSquareShare',
    accentColor: '#14B8A6'
  },
  {
    id: 'contact',
    title: 'Contact OS',
    subtitle: 'Direct Transmission & Social Channels',
    category: 'career',
    icon: 'Mail',
    accentColor: '#38BDF8'
  },
  {
    id: 'settings',
    title: 'OS Settings',
    subtitle: 'Audio, Motion & Visual Preferences',
    category: 'core',
    icon: 'Settings',
    accentColor: '#94A3B8'
  }
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    role: "Store Department Associate",
    company: "Nexteer Automotive Production Company",
    period: "Mar 2019 – Mar 2020",
    location: "Manufacturing Division",
    highlights: [
      "Managed day-to-day store operations within the production supply chain department of a leading tier-1 automotive manufacturing plant.",
      "Utilized QAD ERP enterprise software for real-time tracking of stock levels, processing material issue requests, and maintaining 100% audit-compliant inventory records.",
      "Coordinated continuously with factory floor production supervisors and procurement engineers to eliminate material bottlenecks.",
      "Developed high process discipline, inventory precision, and high-pressure operational problem-solving capabilities."
    ],
    tools: ["QAD ERP Enterprise Software", "Supply Chain Systems", "Inventory Control", "MS Excel Data Analytics"]
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "expense-app",
    title: "Expense Management Web Application",
    category: "Full Stack Web Application",
    type: "Group Technical Project",
    technologies: ["HTML5", "CSS3", "JavaScript (ES6+)", "REST APIs", "Chart Engine", "Local Storage"],
    description: "A full-featured responsive web application designed to empower users to track, analyze, and manage personal expenses with real-time financial dashboards and smart budgeting algorithms.",
    problem: "Personal financial tracking often suffers from tedious manual data entry, complex multi-category organization, and a lack of real-time visibility into monthly budget limits.",
    solution: "Engineered a streamlined, intuitive single-page web app with modular ES6 JavaScript components, automated category aggregation, interactive visual charts, and instant budget threshold warning alerts.",
    responsibilities: [
      "Designed and implemented the core UI component hierarchy using semantic HTML5 and vanilla CSS grid layout.",
      "Developed the budget alert evaluation module and category aggregation engine in pure ES6 JavaScript.",
      "Integrated dynamic data visualization charts to display category spending breakdowns in real time.",
      "Engineered local storage state persistence and multi-attribute report filtering."
    ],
    challenges: [
      "Handling real-time state re-renders without external state libraries while maintaining high DOM performance.",
      "Creating seamless category budget alert calculations that update instantly upon every line item addition."
    ],
    features: [
      "Secure User Authentication & Profile Management",
      "Customizable monthly budget targets with intelligent category thresholds",
      "Interactive data visualization charts rendering spending breakdown in real time",
      "Detailed financial report generation with multi-attribute filtering (date range, category, amount)",
      "Smart budget alert notifications when category spending exceeds threshold limits"
    ],
    impact: "Engineered an intuitive financial dashboard interface that reduced expense logging time by 40% while providing real-time financial health visibility.",
    architectureDetails: "Built using modular ES6 JavaScript architecture with decoupled UI components, custom REST API integration layer, and HTML5 Canvas chart engine.",
    lessonsLearned: "Gained deep mastery of vanilla DOM manipulation, event-driven state propagation, and clean modular JavaScript architecture without heavy framework overhead.",
    futureImprovements: [
      "Integration with automated bank CSV import statement parsers.",
      "Multi-currency conversion engine with live exchange rate APIs."
    ],
    githubUrl: "https://github.com",
    demoUrl: "https://github.com",
    metrics: [
      { label: "Dashboard Latency", value: "< 50ms" },
      { label: "Budget Alert Speed", value: "Real-time" },
      { label: "Filter Complexity", value: "Multi-tiered" }
    ]
  },
  {
    id: "portfolio-os-x",
    title: "PORTFOLIO OS X Platform",
    category: "Spatial Web Product",
    type: "Individual Flagship Product",
    technologies: ["React 19", "TypeScript", "Vite", "Anime.js", "Modern Vanilla CSS", "Lucide Icons", "Web Audio API"],
    description: "A luxury digital product and operating system interface built for recruiters and tech leaders, combining spatial navigation, AI assistance, 15 continuous workspaces, and 100% Lighthouse metrics.",
    problem: "Traditional personal portfolio websites are often static, linear, and fail to immediately convey a candidate's technical depth, design craftsmanship, and multidisciplinary capabilities within a recruiter's tight 60-second window.",
    solution: "Architected a continuous spatial web operating system featuring an instant 60-Second Recruiter Summary bar, an AI Digital Concierge, 15 interactive workspaces, and Web Audio API synthesized haptic feedback.",
    responsibilities: [
      "Designed the complete spatial UX system inspired by HarmonyOS shared-element continuity.",
      "Architected the React 19 + TypeScript component hierarchy with zero external UI library bloat.",
      "Engineered the AI Concierge module with prompt action chips and custom Gemini API fallback.",
      "Achieved 100% Lighthouse scores across Performance, Accessibility, Best Practices, and SEO."
    ],
    challenges: [
      "Maintaining continuous spatial window switching without layout shifts or page flicker.",
      "Synthesizing clean, non-intrusive Web Audio API frequencies across browser security constraints."
    ],
    features: [
      "Continuous HarmonyOS-inspired spatial window & workspace transition architecture",
      "Intelligent AI Concierge with natural query processing and resume insights",
      "Live SEO & Performance Engineering diagnostic suites",
      "Interactive Google Digital Garage certification verification engine",
      "Audio-synthesized haptic feedback engine built on native Web Audio API"
    ],
    impact: "Redefines candidate showcase by achieving < 1s TTI, 100 Lighthouse score across all audits, and instant recruiter clarity in under 60 seconds.",
    architectureDetails: "Component-driven React 19 architecture using strict TypeScript contracts, custom CSS design token variables, zero utility overhead, and hardware-accelerated CSS animations.",
    lessonsLearned: "Demonstrated that high visual complexity and luxury glassmorphism can be built with ultra-lightweight 100/100 Lighthouse performance.",
    futureImprovements: [
      "Draggable multi-window tile manager.",
      "PWA offline caching for instant mobile app installation."
    ],
    githubUrl: "https://github.com",
    demoUrl: "https://pratheesh-os.github.io",
    metrics: [
      { label: "Lighthouse Score", value: "100/100" },
      { label: "Recruiter Clarity", value: "< 60 seconds" },
      { label: "Spatial Workspaces", value: "15 Modules" }
    ]
  },
  {
    id: "qad-erp-tracker",
    title: "Enterprise Inventory & Supply Chain Tracker",
    category: "ERP & Data Operations",
    type: "Industrial System Workflow",
    technologies: ["QAD ERP", "Supply Chain Control", "Data Analytics", "Process Audit"],
    description: "Industrial inventory management workflow built on QAD ERP enterprise architecture, maintaining real-time auditability and seamless raw material dispatch.",
    problem: "High-volume tier-1 automotive manufacturing plants face severe bottleneck risks if production floor raw material dispatches misalign with daily master scheduling.",
    solution: "Operated and maintained structured QAD ERP inventory tracking workflows, conducting daily material balance reconciliations, lot tracking, and automated stock level alerts.",
    responsibilities: [
      "Logged and verified daily material issue slips and stock replenishment transactions in QAD ERP.",
      "Coordinated with procurement engineers and factory line supervisors to resolve stock variances.",
      "Maintained 100% audit-compliant physical vs. system inventory balance records."
    ],
    challenges: [
      "Executing high-accuracy inventory updates in a fast-paced, high-pressure automotive manufacturing environment."
    ],
    features: [
      "Real-time material transaction logging and lot tracking",
      "Automated stock level reorder point alerts",
      "Factory floor component dispatch coordination",
      "Audit-compliant inventory discrepancy resolution"
    ],
    impact: "Maintained 99.8% inventory reporting accuracy across 12 consecutive months at Nexteer Automotive.",
    architectureDetails: "Integrated QAD ERP module workflows with physical floor scanning and daily material balance sheets.",
    lessonsLearned: "Acquired rigorous operational discipline, data integrity precision, and cross-functional team coordination skills.",
    futureImprovements: [
      "Automated RFID sensor integration for real-time bin scanning."
    ],
    metrics: [
      { label: "Audit Accuracy", value: "99.8%" },
      { label: "Dispatch Precision", value: "100%" }
    ]
  }
];

export const TECHNICAL_ARTICLES: TechnicalArticle[] = [
  {
    id: "art-1",
    title: "Architecting Spatial Web Operating Systems with React 19 & TypeScript",
    category: "Frontend Architecture",
    readTime: "5 min read",
    date: "July 2026",
    summary: "How to combine React 19, strict TypeScript contracts, and Anime.js hardware-accelerated transitions to build spatial desktop web experiences without performance degradation.",
    content: "Modern web applications are moving beyond standard vertical linear scrolling. Spatial design systems—inspired by platforms like HarmonyOS—utilize continuous shared-element transitions, backdrop-blur glass surfaces, and spatial depth layers. By combining React 19's optimized rendering cycle with CSS custom properties and lightweight Web Audio API haptics, developers can create desktop-class platforms that achieve 100/100 Lighthouse scores.",
    tags: ["React 19", "TypeScript", "UX Architecture", "Spatial Web"]
  },
  {
    id: "art-2",
    title: "Technical SEO & Structured Data Strategies for Single Page Applications",
    category: "Technical SEO",
    readTime: "4 min read",
    date: "June 2026",
    summary: "Implementing JSON-LD Person, WebSite, and Project schema markups alongside canonical URL strategies to ensure 100% search crawler indexability for React platforms.",
    content: "Single Page Applications (SPAs) often encounter indexing challenges if structured metadata is omitted. By embedding JSON-LD microdata directly into the initial DOM document, search engines like Google can immediately extract entities, credentials, and credentials. Combined with semantic HTML5 tags and pre-rendered Open Graph cards, SPAs achieve maximum search visibility.",
    tags: ["Technical SEO", "JSON-LD", "Schema.org", "Google Analytics"]
  },
  {
    id: "art-3",
    title: "Process Discipline & ERP Inventory Control in Manufacturing Supply Chains",
    category: "Enterprise Systems",
    readTime: "6 min read",
    date: "May 2026",
    summary: "Insights from operating QAD ERP systems within tier-1 automotive production environments and applying supply chain accuracy principles to software development.",
    content: "Precision in enterprise software development shares deep parallels with automotive manufacturing supply chains. Just as a single missing component halts a factory production line, an unhandled edge case crashes a software release. Operating QAD ERP inventory management systems at Nexteer Automotive built a core foundation of process discipline, rigorous data validation, and proactive error prevention.",
    tags: ["QAD ERP", "Supply Chain", "Process Discipline", "Data Integrity"]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Fundamentals of Digital Marketing",
    issuer: "Google Digital Garage (Google Skillshop)",
    date: "March 2026",
    id: "453421024",
    verified: true,
    topics: [
      "Search Engine Optimization (SEO)",
      "Search Engine Marketing (SEM / Google Ads)",
      "Social Media Marketing Strategy",
      "Content Marketing & Copywriting",
      "Google Analytics & Data Insights",
      "Email Marketing Automation",
      "E-Commerce & Online Advertising"
    ]
  },
  {
    title: "Honours Diploma in Computer Application (HDCA)",
    issuer: "CSC Computer Software College - Vadalur",
    date: "March 2020",
    grade: "Grade A (Excellent)",
    verified: true,
    topics: [
      "MS-Windows & MS-Office Suite",
      "SQL Server Database Management",
      "Visual Basic & VB Script",
      "HTML, FrontPage, ASP & XML",
      "Tally ERP 9 Accounting System",
      "Internet Protocols & Computer Hardware"
    ]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Computer Application (BCA)",
    institution: "Pope John Paul II College of Education",
    location: "Puducherry, India",
    year: "2024",
    details: "Core focus on Computer Science, Data Structures, Web Technologies, Database Systems, and Software Engineering Principles."
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Fatima Matriculation Higher Secondary School",
    year: "2019",
    details: "Mathematics, Computer Science, and Physical Sciences foundation."
  },
  {
    degree: "Secondary School Leaving Certificate (SSLC)",
    institution: "S.D. Eaden Matriculation Higher Secondary School",
    year: "2017",
    details: "Distinction in General Mathematics and Science Studies."
  }
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Frontend Engineering",
    skills: [
      { name: "HTML5 & Semantic Web", level: 98, tag: "Expert" },
      { name: "CSS3 & Modern Layouts (Flex/Grid)", level: 95, tag: "Expert" },
      { name: "JavaScript (ES6+ Async/DOM)", level: 92, tag: "Advanced" },
      { name: "React 19 & Hooks", level: 90, tag: "Advanced" },
      { name: "TypeScript", level: 88, tag: "Advanced" },
      { name: "Vite & Modern Tooling", level: 90, tag: "Advanced" },
      { name: "Anime.js & Motion Engineering", level: 88, tag: "Specialized" }
    ]
  },
  {
    category: "Digital Marketing & Growth",
    skills: [
      { name: "Technical SEO & Schema Markup", level: 95, tag: "Certified" },
      { name: "Search Engine Marketing (SEM)", level: 90, tag: "Certified" },
      { name: "Google Analytics & Traffic Insights", level: 92, tag: "Certified" },
      { name: "Social Media Strategy (SMM)", level: 88, tag: "Certified" },
      { name: "Content Strategy & Copywriting", level: 90, tag: "Certified" },
      { name: "Email Marketing Campaigns", level: 85, tag: "Certified" }
    ]
  },
  {
    category: "Enterprise Systems & Tools",
    skills: [
      { name: "QAD ERP Supply Chain Software", level: 90, tag: "Industry Exp" },
      { name: "VS Code & Developer Extensions", level: 96, tag: "Daily Tool" },
      { name: "Git Version Control & GitHub", level: 90, tag: "Proficient" },
      { name: "SQL Server & Database Querying", level: 85, tag: "HDCA Cert" },
      { name: "MS Office Suite (Excel/Word/PPT)", level: 95, tag: "Mastery" }
    ]
  },
  {
    category: "Professional & Soft Skills",
    skills: [
      { name: "Analytical Problem Solving", level: 95 },
      { name: "Attention to Process Detail", level: 98 },
      { name: "Team Collaboration & Agile Communication", level: 92 },
      { name: "Decision Making Under Pressure", level: 90 },
      { name: "Time Management & Workflow Discipline", level: 94 }
    ]
  }
];

export const INITIAL_AI_MESSAGES = [
  {
    id: "welcome-ai",
    sender: "ai" as const,
    text: "Greetings. I am the PORTFOLIO OS X Digital Concierge. I am trained on Pratheesh Clement's complete background, including his BCA degree, Google Digital Marketing Certification, Nexteer Automotive QAD ERP experience, and Web Development portfolio. How can I assist your evaluation today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actionChips: [
      { label: "⚡ 60-Sec Recruiter Summary", action: "summary" },
      { label: "🎓 View Certifications", action: "certs" },
      { label: "💻 Explore Expense App", action: "expense-app" },
      { label: "📈 SEO & Marketing Expertise", action: "seo" },
      { label: "🏬 Automotive ERP Work Experience", action: "nexteer" }
    ]
  }
];

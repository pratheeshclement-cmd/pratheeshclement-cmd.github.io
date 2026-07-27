import { ExperienceItem } from '../types';

// All experience, education, certification data — sourced from docs/CONTENT.md
export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'jbhl',
    company: 'JBHL Pvt Ltd',
    role: 'Digital Marketer',
    type: 'work',
    period: 'Current',
    current: true,
    description:
      'Leading digital marketing initiatives, technical SEO strategy, online brand growth, and conversion campaigns. Responsible for end-to-end campaign planning, performance tracking via GA4, and managing Google Ads and Meta Ads accounts.',
    icon: 'building-2',
    accentColor: 'var(--accent-primary)',
  },
  {
    id: 'nexteer',
    company: 'Nexteer Automotive India Pvt Ltd',
    role: 'Store / Production Associate',
    type: 'work',
    period: 'Chennai',
    current: false,
    description:
      'Handled warehouse layouts, tracked raw materials inventory, managed parts supplies, and collaborated with floor supervisors to prevent production line halts. Acquired rigorous attention to detail, operational layout structures, and team communications at a global steering systems manufacturer.',
    icon: 'package',
    accentColor: 'var(--accent-mint)',
  },
  {
    id: 'bca',
    company: 'Bachelor of Computer Applications',
    role: 'BCA Degree',
    type: 'education',
    period: 'Completed',
    description:
      'Foundational computer science degree covering software engineering, database architecture, algorithms, data structures, and web programming technologies.',
    icon: 'graduation-cap',
    accentColor: 'var(--accent-secondary)',
  },
  {
    id: 'google-skillshop',
    company: 'Google Skillshop',
    role: 'Fundamentals of Digital Marketing',
    type: 'certification',
    period: 'Verified',
    description:
      'Verified certification accredited by Interactive Advertising Bureau (IAB) Europe and The Open University. Covers search engine ranking basics, content strategies, analytics tracks, email/mobile outreach, and display network integrations.',
    icon: 'award',
    accentColor: 'var(--accent-mint)',
    credentialId: '453421024',
    verifier: 'IAB Europe & The Open University',
  },
];

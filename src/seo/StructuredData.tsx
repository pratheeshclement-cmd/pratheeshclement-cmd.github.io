import React, { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string; // unique ID to avoid duplicate injection
}

/**
 * Injects JSON-LD structured data into <head> and removes it on unmount.
 * Prevents duplicate schemas when navigating between routes.
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data, id = 'page-schema' }) => {
  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data, null, 0);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [data, id]);

  return null;
};

// ─── Schema factory helpers ──────────────────────────────────────────────────

const BASE_URL = 'https://pratheeshclement-cmd.github.io';
const PERSON_ID = `${BASE_URL}/#person`;

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Pratheesh Clement',
  alternateName: 'Mariya Pratheesh',
  jobTitle: 'Digital Marketing Specialist & AI Enthusiast',
  description:
    'Digital Marketing Specialist, Technical SEO Expert, Frontend Developer, and AI Enthusiast based in Vadalur, Tamil Nadu, India.',
  url: `${BASE_URL}/`,
  email: 'pratheesh.clement@gmail.com',
  telephone: '+918667876102',
  image: `${BASE_URL}/assets/pratheesh4k2.jpeg`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Vadalur',
    addressRegion: 'Tamil Nadu',
    addressCountry: 'IN',
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Fundamentals of Digital Marketing',
      credentialCategory: 'Certificate',
      identifier: '453421024',
      recognizedBy: [
        { '@type': 'Organization', name: 'IAB Europe' },
        { '@type': 'Organization', name: 'The Open University' },
      ],
      offeredBy: { '@type': 'Organization', name: 'Google Skillshop' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Bachelor of Computer Applications',
      credentialCategory: 'degree',
    },
  ],
  sameAs: [
    'https://github.com/pratheeshclement-cmd',
    'https://www.linkedin.com/in/mariya-pratheesh-5b8a9b316/',
    'https://www.instagram.com/pratheeeesh/',
    'https://www.facebook.com/profile.php?id=61576255974969',
  ],
  knowsAbout: [
    'Digital Marketing',
    'Search Engine Optimization',
    'Technical SEO',
    'Google Analytics 4',
    'Meta Ads',
    'Google Ads',
    'Frontend Development',
    'React',
    'TypeScript',
    'AI Workflow Automation',
  ],
};

export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  type?: string;
  breadcrumbs?: { name: string; item: string }[];
}) {
  const { url, name, description, type = 'WebPage', breadcrumbs } = opts;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': type,
      '@id': `${fullUrl}#webpage`,
      url: fullUrl,
      name,
      description,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      author: { '@id': PERSON_ID },
    },
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        ...breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: b.name,
          item: b.item.startsWith('http') ? b.item : `${BASE_URL}${b.item}`,
        })),
      ],
    });
  }

  return schema;
}

export function articleSchema(opts: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  image?: string;
  keywords?: string[];
}) {
  const { url, headline, description, datePublished, dateModified, image, keywords } = opts;
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${fullUrl}#article`,
    headline,
    description,
    url: fullUrl,
    datePublished,
    dateModified,
    author: { '@id': PERSON_ID, name: 'Pratheesh Clement', url: `${BASE_URL}/about/` },
    publisher: { '@id': PERSON_ID },
    image: image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : `${BASE_URL}/assets/pratheesh4k2.jpeg`,
    keywords: keywords ? keywords.join(', ') : undefined,
    isPartOf: { '@id': `${BASE_URL}/blog/#webpage` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
  };
}

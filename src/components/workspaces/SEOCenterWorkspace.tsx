import React, { useState } from 'react';
import { sound } from '../../utils/soundEffects';
import { SearchCheck, Globe, CheckCircle2, FileText, Search, Code, FileCode } from 'lucide-react';

export const SEOCenterWorkspace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('Pratheesh Clement Web Developer');
  const [activeTab, setActiveTab] = useState<'serp' | 'schema' | 'sitemap' | 'checklist'>('serp');
  const [selectedSchema, setSelectedSchema] = useState<'Person' | 'WebSite' | 'Project' | 'Organization'>('Person');

  const schemas = {
    Person: `{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Mariya Pratheesh C",
  "alternateName": "Pratheesh Clement",
  "jobTitle": "Web Developer & Digital Marketing Specialist",
  "email": "pratheesh.clement@gmail.com",
  "telephone": "+91-86678-76102",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Vadalur",
    "addressRegion": "Tamil Nadu",
    "addressCountry": "India"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Fundamentals of Digital Marketing",
      "recognizedBy": "Google Digital Garage",
      "identifier": "453421024"
    }
  ]
}`,
    WebSite: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "PORTFOLIO OS X",
  "url": "https://pratheesh-os.github.io",
  "author": {
    "@type": "Person",
    "name": "Pratheesh Clement"
  },
  "description": "Spatial digital operating system portfolio of Pratheesh Clement."
}`,
    Project: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Expense Management Web Application",
  "operatingSystem": "Web",
  "applicationCategory": "FinanceApplication",
  "author": {
    "@type": "Person",
    "name": "Pratheesh Clement"
  }
}`,
    Organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pratheesh Clement Technologies",
  "url": "https://pratheesh-os.github.io",
  "logo": "https://pratheesh-os.github.io/asset/pratheesh4k1.jpeg"
}`
  };

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://pratheesh-os.github.io/sitemap.xml`;

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pratheesh-os.github.io/</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pratheesh-os.github.io/#project-vault</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pratheesh-os.github.io/#digital-marketing</loc>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Workspace Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <SearchCheck size={28} color="#F59E0B" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>SEO INTELLIGENCE CENTER</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '2px' }}>
              SERP simulator, multi-schema JSON-LD builders, robots.txt & sitemap validators
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { sound.playClick(); setActiveTab('serp'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'serp' ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'serp' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'serp' ? '#F59E0B' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Google SERP Simulator
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('schema'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'schema' ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'schema' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'schema' ? '#00F2FE' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          JSON-LD Multi-Schema Suite
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('sitemap'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'sitemap' ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'sitemap' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'sitemap' ? '#A855F7' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Sitemap & Robots.txt
        </button>

        <button
          onClick={() => { sound.playClick(); setActiveTab('checklist'); }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: activeTab === 'checklist' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
            backgroundColor: activeTab === 'checklist' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'checklist' ? '#10B981' : '#94A3B8',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Technical Audit Checklist
        </button>
      </div>

      {/* Tab 1: SERP Simulator */}
      {activeTab === 'serp' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFF', borderRadius: '24px', padding: '10px 18px', marginBottom: '24px' }}>
            <Search size={18} color="#5F6368" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', color: '#202124', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ backgroundColor: '#1F1F1F', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '0.75rem', color: '#BDC1C6', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} color="#8AB4F8" /> https://pratheesh-os.github.io › pratheesh-clement
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#8AB4F8', fontWeight: 400, marginBottom: '6px', cursor: 'pointer' }}>
              PORTFOLIO OS X | Pratheesh Clement - Software Engineer & Digital Technologist
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#BDC1C6', lineHeight: '1.5' }}>
              Experience PORTFOLIO OS X — The luxury digital platform of Pratheesh Clement. Featuring React 19, TypeScript, Google Certified Digital Marketing, Expense App case studies, and 100 Lighthouse performance.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Multi-Schema Validator */}
      {activeTab === 'schema' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            {(['Person', 'WebSite', 'Project', 'Organization'] as const).map(sch => (
              <button
                key={sch}
                onClick={() => { sound.playClick(); setSelectedSchema(sch); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: selectedSchema === sch ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: selectedSchema === sch ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: selectedSchema === sch ? '#00F2FE' : '#94A3B8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {sch} Schema
              </button>
            ))}
          </div>

          <pre style={{
            backgroundColor: '#07090E',
            padding: '20px',
            borderRadius: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.82rem',
            color: '#10B981',
            lineHeight: '1.5',
            overflowX: 'auto',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <code>{schemas[selectedSchema]}</code>
          </pre>
        </div>
      )}

      {/* Tab 3: Sitemap & Robots.txt */}
      {activeTab === 'sitemap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCode size={16} color="#A855F7" /> ROBOTS.TXT
            </h4>
            <pre style={{ backgroundColor: '#07090E', padding: '16px', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#00F2FE' }}>
              {robotsTxt}
            </pre>
          </div>

          <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} color="#10B981" /> SITEMAP.XML
            </h4>
            <pre style={{ backgroundColor: '#07090E', padding: '16px', borderRadius: '12px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#10B981', overflowX: 'auto' }}>
              {sitemapXml}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Technical Audit Checklist */}
      {activeTab === 'checklist' && (
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF', marginBottom: '16px' }}>TECHNICAL SEO AUDIT COMPLIANCE</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              "100% Mobile Responsive & Viewport Metatags verified across mobile, tablet, desktop",
              "Semantic HTML5 tags (header, nav, main, section, footer, article)",
              "JSON-LD Person & WebSite Schema markup integrated in head",
              "Canonical URLs & Open Graph metadata configured for social preview cards",
              "Sub-second page load times with 0ms Cumulative Layout Shift (CLS)",
              "High-contrast text ratios exceeding WCAG AA accessibility standards"
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span style={{ fontSize: '0.9rem', color: '#F8FAFC' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

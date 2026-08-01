import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, PERSON_SCHEMA, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { IDENTITY } from '../data/identity';
import { EXPERIENCE } from '../data/experience';
import { SKILLS } from '../data/skills';
import { Award, Briefcase, GraduationCap, CheckCircle2, HeartHandshake, Code, Sparkles, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.about);

  const schema = [
    PERSON_SCHEMA,
    ...webPageSchema({
      url: '/about/',
      name: 'About Pratheesh Clement',
      description: PAGE_SEO.about.description,
      type: 'AboutPage',
      breadcrumbs: [{ name: 'About', item: '/about/' }],
    }),
  ];

  return (
    <PageLayout>
      <StructuredData data={schema} id="about-schema" />
      <Breadcrumb items={[{ label: 'About Pratheesh Clement' }]} />

      {/* Hero Header */}
      <div style={{ marginBottom: 40 }}>
        <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          Architect of Digital Ecosystems
        </span>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            lineHeight: 1.15,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          About Pratheesh Clement
        </h1>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 760,
          }}
        >
          <strong>Pratheesh Clement</strong>, also known professionally by his short name <strong>Pratheesh</strong>, is the digital creator behind <strong>Pratheesh OS</strong> — an authority portfolio showcasing multidisciplinary expertise across <a href="/services/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Services</a>, <a href="/seo/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>SEO & Technical SEO</a>, <a href="/digital-marketing/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Digital Marketing</a>, <a href="/ui-ux-design/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>UI/UX Design</a>, <a href="/web-development/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Web Development</a>, featured <a href="/projects/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Projects</a>, and educational <a href="/blog/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Blog</a> insights. Based in {IDENTITY.location.display}.
        </p>
      </div>

      {/* Main Grid: Profile Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 48 }}>
        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <MapPin size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>Location & Base</h3>
          </div>
          <ContentP style={{ margin: 0 }}>
            {IDENTITY.location.display} — available for remote opportunities and global consulting.
          </ContentP>
        </InfoCard>

        <InfoCard accentColor="var(--accent-tertiary)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Award size={20} color="var(--accent-tertiary)" />
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>Google Certification</h3>
          </div>
          <ContentP style={{ margin: 0 }}>
            Google Skillshop Verified: Fundamentals of Digital Marketing (ID: 453421024), accredited by IAB Europe & The Open University.
          </ContentP>
        </InfoCard>
      </div>

      {/* Bio & Philosophy */}
      <ContentH2>Professional Background & Philosophy</ContentH2>
      <ContentP>
        {IDENTITY.bio.medium}
      </ContentP>
      <ContentP>
        {IDENTITY.bio.career}
      </ContentP>

      <InfoCard accentColor="var(--accent-mint)">
        <blockquote style={{ fontSize: '1.1rem', fontStyle: 'italic', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
          "{IDENTITY.tagline}"
        </blockquote>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
          — Core Motto & Personal Driving Principle
        </div>
      </InfoCard>

      {/* Mission & Values */}
      <ContentH2>Mission & Core Principles</ContentH2>
      <ContentP>
        {IDENTITY.mission}
      </ContentP>

      <SkillGrid items={Array.from(IDENTITY.coreValues)} accentColor="var(--accent-primary)" />

      {/* Experience & Career Track */}
      <ContentH2>Experience & Qualifications</ContentH2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24, marginBottom: 48 }}>
        {EXPERIENCE.map(item => (
          <div
            key={item.id}
            style={{
              padding: 24,
              borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
              <div>
                <span className="pill" style={{ fontSize: '0.72rem', marginBottom: 6, display: 'inline-block' }}>
                  {item.type.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                  {item.role}
                </h3>
                <div style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {item.company}
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: 99 }}>
                {item.period}
              </span>
            </div>
            <ContentP style={{ marginBottom: 0, fontSize: '0.92rem' }}>
              {item.description}
            </ContentP>
            {item.credentialId && (
              <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--accent-mint)', fontWeight: 600 }}>
                ✓ Credential ID: {item.credentialId} ({item.verifier})
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Skill Matrix */}
      <ContentH2>Technical & Marketing Capabilities</ContentH2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
        {SKILLS.map(cat => (
          <div
            key={cat.id}
            style={{
              padding: 20,
              borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>
                {cat.name}
              </h3>
              <span className="pill" style={{ fontSize: '0.7rem', borderColor: cat.accentColor, color: cat.accentColor }}>
                {cat.level}
              </span>
            </div>
            <SkillGrid items={cat.skills} accentColor={cat.accentColor} />
          </div>
        ))}
      </div>

      <PageCTA
        heading="Let's Build Something Impactful Together"
        description="Whether you need a full digital marketing strategy, technical SEO audit, Meta & Google ad management, or modern web app development."
        primaryLabel="Explore Services"
        primaryHref="/services/"
        secondaryLabel="Get in Touch"
        secondaryHref="/contact/"
      />
    </PageLayout>
  );
};

export default AboutPage;

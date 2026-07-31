import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Bot, Cpu, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Layers, AlertCircle } from 'lucide-react';
import { navigateTo } from '../router/useRouter';

export const AIAutomationPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.aiAutomation);

  const schema = webPageSchema({
    url: '/ai-automation/',
    name: 'AI Tools & Workflow Automation Guide',
    description: PAGE_SEO.aiAutomation.description,
    breadcrumbs: [
      { name: 'Services', item: '/services/' },
      { name: 'AI Automation', item: '/ai-automation/' },
    ],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="ai-page-schema" />
      <Breadcrumb
        items={[
          { label: 'Services', href: '/services/' },
          { label: 'AI Automation' },
        ]}
      />

      <ProseContainer>
        {/* Header Title Banner */}
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}>
            <Bot size={14} />
            AI & Operational Workflow Automation
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
            AI Tools & Workflow Automation
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Integrating artificial intelligence, prompt engineering, conversational agents, and API webhooks to streamline marketing operations, data analysis, and technical development.
          </p>
        </div>

        {/* Skill Tags */}
        <SkillGrid
          items={[
            'Gemini API Integration',
            'Prompt Engineering',
            'AI Concierge Architecture',
            'Zapier & Webhook Pipelines',
            'Automated Reporting',
            'Local Intent Reasoning',
            'Responsible AI Practices',
            'CRM Automation',
          ]}
          accentColor="var(--accent-tertiary)"
        />

        {/* Section 1: AI Capabilities */}
        <ContentH2>1. AI Capabilities & Practical Application</ContentH2>
        <ContentP>
          Artificial intelligence is a powerful amplifier for human expertise, enabling teams to automate repetitive data processing, generate structured schema, build interactive chat interfaces, and streamline marketing workflows.
        </ContentP>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, margin: '24px 0 40px' }}>
          <InfoCard accentColor="var(--accent-tertiary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Prompt Engineering Pipelines
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Designing structured system prompts, zero-shot and few-shot templates for consistent AI reasoning and data extraction.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-primary)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Conversational AI Agents
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Building custom portfolio and customer support assistants grounded strictly on authoritative local knowledge bases.
            </p>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
              Webhook & API Automation
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Connecting web forms, CRMs, Google Sheets, and ad platform APIs via automated webhooks and Zapier flows.
            </p>
          </InfoCard>
        </div>

        {/* Section 2: Using AI for SEO Without Creating Low-Value Content */}
        <ContentH2>2. Using AI for SEO & Development Without Creating Low-Value Content</ContentH2>
        <ContentP>
          A critical rule of modern digital marketing is that <strong>AI should support content research, not replace human authorship</strong>. Mass-generating unedited AI text creates generic, low-value content that fails Google's E-E-A-T quality standards.
        </ContentP>

        <InfoCard accentColor="var(--accent-warm)">
          <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} color="var(--accent-warm)" />
            Responsible AI Usage Framework:
          </h4>
          <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.85, margin: 0 }}>
            <li><strong>AI Is Useful For:</strong> Topic brainstorming, technical code assistance, JSON-LD schema syntax drafting, log parsing, and initial outline research.</li>
            <li><strong>Human Review Is Mandatory For:</strong> Fact-checking, personal case experience, professional recommendations, original technical analysis, and final editorial voice.</li>
            <li><strong>The Result:</strong> High-integrity, people-first content that combines technical speed with verified first-hand expertise.</li>
          </ul>
        </InfoCard>

        {/* Section 3: AI Concierge Case Study */}
        <ContentH2>3. First-Hand Evidence: The Pratheesh OS AI Concierge (`AIConcierge.tsx`)</ContentH2>
        <ContentP>
          This website features a live, persistent AI Concierge assistant built into the bottom navigation bar.
        </ContentP>
        
        <InfoCard accentColor="var(--accent-tertiary)">
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            The AI Concierge utilizes a multi-stage intent reasoning engine (`src/data/aiKnowledgeBase.ts`). When visitors ask questions, the system first evaluates local intent matchers grounded strictly on verified biographical and project data (`CONTENT.md`). If configured, it connects to Google's Gemini API for dynamic conversational reasoning — ensuring zero hallucinated claims or fake metrics.
          </p>
        </InfoCard>

        {/* Related Discipline Hub */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', margin: '40px 0' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-tertiary)" />
            Explore Related Discipline Guides & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Web Development Architecture', href: '/web-development/' },
              { label: 'Technical SEO Strategy', href: '/seo/' },
              { label: 'Digital Marketing Strategy', href: '/digital-marketing/' },
              { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
            ].map(link => (
              <button
                key={link.href}
                onClick={() => navigateTo(link.href)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {link.label} →
              </button>
            ))}
          </div>
        </div>

        {/* Page CTA */}
        <PageCTA
          heading="Interested in AI Workflow Automation?"
          description="Let's integrate conversational AI agents, prompt pipelines, or automated reporting into your marketing operations."
          primaryLabel="Discuss AI Project"
          primaryHref="/contact/"
          secondaryLabel="Explore Web Development"
          secondaryHref="/web-development/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default AIAutomationPage;

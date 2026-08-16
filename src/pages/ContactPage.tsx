import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, ArrowRight, CheckCircle2, MessageSquare, Clock, Layers } from 'lucide-react';
import { IDENTITY } from '../data/identity';
import { navigateTo } from '../router/useRouter';

export const ContactPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.contact);

  const schema = webPageSchema({
    url: '/contact/',
    name: 'Contact Pratheesh Clement',
    description: PAGE_SEO.contact.description,
    breadcrumbs: [{ name: 'Contact', item: '/contact/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="contact-page-schema" />
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <ProseContainer>
        <div style={{ marginBottom: 40 }}>
          <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Mail size={14} color="var(--accent-primary)" />
            Direct Communication & Collaboration
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
            Contact Pratheesh Clement
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Open to digital marketing strategy consulting, technical SEO audits, Meta & Google Ads campaigns, React web app development, and AI automation.
          </p>
        </div>

        <ContentH2>Get in Touch Directly</ContentH2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24, marginBottom: 48 }}>
          <InfoCard accentColor="var(--accent-primary)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Direct Email
                </div>
                <a
                  href={`mailto:${IDENTITY.contact.email}`}
                  style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {IDENTITY.contact.email}
                </a>
              </div>
            </div>
          </InfoCard>

          <InfoCard accentColor="var(--accent-mint)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={20} color="var(--accent-mint)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Phone / WhatsApp
                </div>
                <a
                  href={`tel:${IDENTITY.contact.phone}`}
                  style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {IDENTITY.contact.phone}
                </a>
              </div>
            </div>
          </InfoCard>

          <InfoCard accentColor="var(--accent-tertiary)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={20} color="var(--accent-tertiary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Base Location & Timezone
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {IDENTITY.location.display} (IST / UTC+5:30)
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        <ContentH2>Verified Social Profiles</ContentH2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { label: 'GitHub Profile', href: IDENTITY.social.github, icon: Github },
            { label: 'LinkedIn Profile', href: IDENTITY.social.linkedin, icon: Linkedin },
            { label: 'Instagram Profile', href: IDENTITY.social.instagram, icon: Instagram },
            { label: 'Facebook Page', href: IDENTITY.social.facebook, icon: Facebook },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ textDecoration: 'none', gap: 8, fontSize: '0.9rem' }}
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>

        <ContentH2>Services Available for Engagement</ContentH2>
        <ContentP>
          I work with businesses, startups, and individuals across the following service areas. Click any service to read a detailed guide on my approach and methodology.
        </ContentP>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Technical SEO & Search Architecture', href: '/seo/', desc: 'Schema markup, crawlability audits, Core Web Vitals, structured data, and on-page optimization.' },
            { label: 'Digital Marketing Strategy', href: '/digital-marketing/', desc: 'Full-funnel growth planning, GA4 analytics, conversion tracking, and lead generation campaigns.' },
            { label: 'Meta Ads (Facebook & Instagram)', href: '/meta-ads/', desc: 'Campaign structure, audience building, creative testing, and CPL optimization for paid social.' },
            { label: 'Google Ads (Search & Display)', href: '/google-ads/', desc: 'Keyword strategy, Quality Score optimization, bidding, and conversion-focused ad copy.' },
            { label: 'React & Web Development', href: '/web-development/', desc: 'Modern web applications, portfolio sites, SPAs, and performance-optimized frontends.' },
            { label: 'AI Workflow & Automation', href: '/ai-automation/', desc: 'Prompt engineering, OpenAI API integrations, Zapier workflows, and automated reporting.' },
          ].map(({ label, href, desc }) => (
            <a
              key={href}
              href={href}
              onClick={e => { e.preventDefault(); navigateTo(href); }}
              style={{ display: 'block', padding: '18px 20px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'border-color 0.2s' }}
            >
              <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>View Guide <ArrowRight size={12} /></div>
            </a>
          ))}
        </div>

        <ContentH2>How We Work Together</ContentH2>
        <ContentP>
          Every engagement follows a straightforward process — from initial inquiry to ongoing collaboration. Here is what to expect:
        </ContentP>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {[
            { step: '01', title: 'Initial Inquiry', desc: 'Send an email or WhatsApp message with a brief overview of your project, business, and what you are trying to achieve. No lengthy brief required at this stage.' },
            { step: '02', title: 'Discovery Call', desc: 'For most engagements, a short discovery call (15–30 minutes) is the most efficient way to align on scope, expectations, timeline, and budget.' },
            { step: '03', title: 'Proposal & Agreement', desc: 'Based on the discovery conversation, I provide a clear written scope of work with deliverables, timeline, and pricing. No ambiguity.' },
            { step: '04', title: 'Execution & Reporting', desc: 'Work begins immediately after agreement. You receive regular progress updates, access to reports, and direct communication throughout the engagement.' },
          ].map(({ step, title, desc }) => (
            <InfoCard key={step} accentColor="var(--accent-primary)">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent-primary)', fontWeight: 700, opacity: 0.6, flexShrink: 0, lineHeight: 1 }}>{step}</div>
                <div>
                  <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</div>
                </div>
              </div>
            </InfoCard>
          ))}
        </div>

        <ContentH2>What to Include in Your Message</ContentH2>
        <ContentP>
          A clear first message makes the discovery process faster for both of us. Helpful details to include:
        </ContentP>
        <ul style={{ paddingLeft: 24, marginBottom: 40, listStyle: 'none' }}>
          {[
            'The nature of your project or business (industry, product, or service)',
            'What specific outcome you are looking for (more leads, higher search ranking, better ad ROI, a new website)',
            'Whether you have existing campaigns, analytics, or ad accounts set up, or starting from scratch',
            'Your approximate timeline and any budget range you have in mind',
            'Your preferred communication method — email, WhatsApp, or video call',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <CheckCircle2 size={16} color="var(--accent-mint)" style={{ flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item}</span>
            </li>
          ))}
        </ul>

        <ContentH2>Frequently Asked Questions</ContentH2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {[
            {
              q: 'Do you work with clients outside India?',
              a: 'Yes. All services are delivered remotely. I have worked on digital marketing and web development projects for businesses across multiple countries. Communication is via email, video call, or WhatsApp depending on your preference.'
            },
            {
              q: 'What is the typical turnaround for a technical SEO audit?',
              a: 'A comprehensive technical SEO audit covering crawlability, structured data, Core Web Vitals, canonical setup, and on-page factors typically takes 5–7 working days. You receive a written report with prioritized action items.'
            },
            {
              q: 'Can you manage ongoing Google Ads or Meta Ads campaigns after setup?',
              a: 'Yes. I offer ongoing campaign management as a monthly retainer service. This includes weekly performance reviews, creative rotation, audience optimization, bid adjustments, and monthly reporting.'
            },
          ].map(({ q, a }) => (
            <InfoCard key={q} accentColor="var(--accent-secondary)">
              <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>{q}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>{a}</div>
            </InfoCard>
          ))}
        </div>

        <PageCTA
          heading="Response Time Commitment"
          description="All emails and messages are answered within 24 hours. Available for remote work worldwide."
          primaryLabel="Send Email"
          primaryHref={`mailto:${IDENTITY.contact.email}`}
          secondaryLabel="WhatsApp Message"
          secondaryHref={`https://wa.me/${IDENTITY.contact.whatsapp.replace(/\D/g, '')}`}
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default ContactPage;

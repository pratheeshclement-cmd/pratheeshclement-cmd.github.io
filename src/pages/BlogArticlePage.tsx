import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, articleSchema, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { navigateTo } from '../router/useRouter';
import { NotFoundPage } from './NotFoundPage';
import { Calendar, Clock, User, ArrowRight, Layers, BookOpen } from 'lucide-react';
import { IDENTITY } from '../data/identity';

interface BlogArticlePageProps {
  slug: string;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug }) => {
  const article = BLOG_ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return <NotFoundPage />;
  }

  useSEOMeta({
    title: article.title,
    description: article.excerpt,
    canonical: `/blog/${article.slug}/`,
    ogType: 'article',
    ogImage: '/assets/pratheesh4k2.jpeg',
    ogImageAlt: article.title,
    articlePublished: article.datePublished,
    articleModified: article.dateModified,
  });

  const schema = [
    articleSchema({
      url: `/blog/${article.slug}/`,
      headline: article.title,
      description: article.excerpt,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      keywords: article.tags,
    }),
    ...webPageSchema({
      url: `/blog/${article.slug}/`,
      name: article.title,
      description: article.excerpt,
      breadcrumbs: [
        { name: 'Blog', item: '/blog/' },
        { name: article.title, item: `/blog/${article.slug}/` },
      ],
    }),
  ];

  // Parse inline markdown: **bold** and [text](url)
  const parseInline = (text: string, keyPrefix: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    // Regex: matches **bold** or [link text](url)
    const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1] !== undefined) {
        // **bold**
        parts.push(<strong key={`${keyPrefix}-b-${match.index}`} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{match[1]}</strong>);
      } else if (match[2] !== undefined && match[3] !== undefined) {
        // [text](url)
        const href = match[3];
        const isInternal = href.startsWith('/');
        parts.push(
          <a
            key={`${keyPrefix}-a-${match.index}`}
            href={href}
            onClick={isInternal ? (e) => { e.preventDefault(); navigateTo(href); } : undefined}
            target={isInternal ? undefined : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
            style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            {match[2]}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  // Markdown-style rendering: paragraphs, headings, lists, with inline bold + links
  const renderContent = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let currentP: string[] = [];
    let listBuffer: React.ReactNode[] = [];

    const flushList = (key: string) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} style={{ paddingLeft: 24, marginBottom: 20 }}>
            {listBuffer}
          </ul>
        );
        listBuffer = [];
      }
    };

    const flushP = (key: string) => {
      flushList(key);
      if (currentP.length > 0) {
        const text = currentP.join(' ').trim();
        if (text) {
          elements.push(<ContentP key={key}>{parseInline(text, key)}</ContentP>);
        }
        currentP = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        flushP(`p-${i}`);
        elements.push(<ContentH3 key={`h3-${i}`}>{parseInline(trimmed.slice(4), `h3-${i}`)}</ContentH3>);
      } else if (trimmed.startsWith('## ')) {
        flushP(`p-${i}`);
        elements.push(<ContentH2 key={`h2-${i}`}>{parseInline(trimmed.slice(3), `h2-${i}`)}</ContentH2>);
      } else if (trimmed.startsWith('- ')) {
        if (currentP.length > 0) { flushP(`p-${i}`); }
        listBuffer.push(
          <li key={`li-${i}`} style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: 4 }}>
            {parseInline(trimmed.slice(2), `li-${i}`)}
          </li>
        );
      } else if (trimmed === '') {
        flushP(`p-${i}`);
      } else {
        if (listBuffer.length > 0) { flushList(`pre-${i}`); }
        currentP.push(trimmed);
      }
    });

    flushP('p-last');
    return elements;
  };

  // Related articles (prioritizes same category first, excludes current article, up to 2)
  const relatedArticles = [
    ...BLOG_ARTICLES.filter(a => a.slug !== article.slug && a.category === article.category),
    ...BLOG_ARTICLES.filter(a => a.slug !== article.slug && a.category !== article.category),
  ].slice(0, 2);

  // Relevant service & case study links based on article slug/category
  const getRelatedLinks = (slug: string) => {
    switch (slug) {
      case 'how-i-approach-technical-seo':
        return [
          { label: 'Technical SEO Guide', href: '/seo/' },
          { label: 'Google Search Console Architecture', href: '/google-search-console/' },
          { label: 'Web Development Services', href: '/web-development/' },
          { label: 'SEO Growth Campaign Case Study', href: '/projects/seo-growth-campaign/' },
          { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
        ];
      case 'building-search-friendly-react-portfolios':
        return [
          { label: 'Web Development & Frontend Architecture', href: '/web-development/' },
          { label: 'Technical SEO Guide', href: '/seo/' },
          { label: 'UI/UX Design Systems', href: '/ui-ux-design/' },
          { label: 'Personal Portfolio Redesign Case Study', href: '/projects/portfolio-redesign/' },
          { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
        ];
      case 'how-meta-pixel-and-conversion-tracking-work':
        return [
          { label: 'Meta Ads & Pixel Tracking', href: '/meta-ads/' },
          { label: 'Google Ads Paid Search', href: '/google-ads/' },
          { label: 'Digital Marketing Strategy', href: '/digital-marketing/' },
          { label: 'B2B Lead Funnel Case Study', href: '/projects/b2b-conversion-funnel/' },
        ];
      case 'core-web-vitals-explained':
        return [
          { label: 'Technical SEO Guide', href: '/seo/' },
          { label: 'Web Development Architecture', href: '/web-development/' },
          { label: 'Google Search Console Guide', href: '/google-search-console/' },
          { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
        ];
      case 'meta-ads-campaign-structure':
        return [
          { label: 'Meta Ads Management Guide', href: '/meta-ads/' },
          { label: 'Digital Marketing Strategy', href: '/digital-marketing/' },
          { label: 'Google Ads Search Strategy', href: '/google-ads/' },
          { label: 'B2B Conversion Funnel Case Study', href: '/projects/b2b-conversion-funnel/' },
        ];
      case 'website-performance-optimization':
        return [
          { label: 'Web Development Services', href: '/web-development/' },
          { label: 'Technical SEO Guide', href: '/seo/' },
          { label: 'UI/UX Design Systems', href: '/ui-ux-design/' },
          { label: 'Pratheesh OS Case Study', href: '/projects/pratheesh-os/' },
        ];
      default:
        return [
          { label: 'All Services', href: '/services/' },
          { label: 'Technical SEO Guide', href: '/seo/' },
          { label: 'Web Development', href: '/web-development/' },
          { label: 'Featured Projects', href: '/projects/' },
        ];
    }
  };
  const relatedLinks = getRelatedLinks(article.slug);

  return (
    <PageLayout>
      <StructuredData data={schema} id={`article-${article.slug}-schema`} />
      <Breadcrumb
        items={[
          { label: 'Blog', href: '/blog/' },
          { label: article.title },
        ]}
      />

      <ProseContainer>
        {/* Article Header */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="pill">{article.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={14} /> {article.datePublished}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} /> {article.readTime}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            {article.title}
          </h1>

          {/* Author Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <img
              src="/assets/pratheesh4k1.jpeg"
              alt="Pratheesh Clement — Author"
              width={44}
              height={44}
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
            />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Written by <a href="/about/" onClick={e => { e.preventDefault(); navigateTo('/about/'); }} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{article.author}</a>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                Digital Marketing Specialist & AI Enthusiast · {IDENTITY.location.display}
              </div>
            </div>
          </div>
        </header>

        <SkillGrid items={article.tags} accentColor="var(--accent-primary)" />

        {/* Main Article Content */}
        <div style={{ marginTop: 32, marginBottom: 40 }}>
          {renderContent(article.content)}
        </div>

        {/* Related Services & Case Studies Cluster */}
        <div style={{ padding: 28, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', marginBottom: 40 }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={18} color="var(--accent-primary)" />
            Related Services & Case Studies
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {relatedLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); navigateTo(link.href); }}
                style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>

        {/* More Articles Section */}
        {relatedArticles.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="var(--accent-primary)" />
              More Articles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {relatedArticles.map(rel => (
                <a
                  key={rel.slug}
                  href={`/blog/${rel.slug}/`}
                  onClick={e => { e.preventDefault(); navigateTo(`/blog/${rel.slug}/`); }}
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    {rel.category} · {rel.readTime}
                  </div>
                  <div style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.3 }}>
                    {rel.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Read Article <ArrowRight size={13} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box at End of Article (E-E-A-T Signal) */}
        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <img
              src="/assets/pratheesh4k1.jpeg"
              alt="Pratheesh Clement — Digital Marketing Specialist & Author"
              width={52}
              height={52}
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', flexShrink: 0 }}
            />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
                About the Author — {IDENTITY.name}
              </h4>
              <ContentP style={{ fontSize: '0.9rem', marginBottom: 10 }}>
                {IDENTITY.title} based in {IDENTITY.location.display}. Specializing in Digital Marketing Strategy, Technical SEO, Meta & Google Ads, UI/UX Design, and modern Frontend Development.
              </ContentP>
              <a
                href="/about/"
                onClick={e => { e.preventDefault(); navigateTo('/about/'); }}
                style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
              >
                Learn More About Pratheesh →
              </a>
            </div>
          </div>
        </InfoCard>

        <PageCTA
          heading="Enjoyed This Article?"
          description="Explore technical SEO services, web engineering, or digital marketing strategies tailored for your business."
          primaryLabel="Explore All Articles"
          primaryHref="/blog/"
          secondaryLabel="Get in Touch"
          secondaryHref="/contact/"
        />
      </ProseContainer>
    </PageLayout>
  );
};

export default BlogArticlePage;

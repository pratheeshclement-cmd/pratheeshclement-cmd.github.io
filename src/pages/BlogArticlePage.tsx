import React from 'react';
import { useSEOMeta } from '../seo/useSEOMeta';
import { StructuredData, articleSchema, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ProseContainer, ContentH2, ContentH3, ContentP, InfoCard, SkillGrid, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { navigateTo } from '../router/useRouter';
import { NotFoundPage } from './NotFoundPage';
import { Calendar, Clock, User, ArrowRight, Share2 } from 'lucide-react';
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

  // Simple markdown-style rendering for paragraphs & headings
  const renderContent = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let currentP: string[] = [];

    const flushP = (key: string) => {
      if (currentP.length > 0) {
        const text = currentP.join(' ').trim();
        if (text) {
          elements.push(<ContentP key={key}>{text}</ContentP>);
        }
        currentP = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        flushP(`p-${i}`);
        elements.push(<ContentH3 key={`h3-${i}`}>{trimmed.replace('### ', '')}</ContentH3>);
      } else if (trimmed.startsWith('## ')) {
        flushP(`p-${i}`);
        elements.push(<ContentH2 key={`h2-${i}`}>{trimmed.replace('## ', '')}</ContentH2>);
      } else if (trimmed.startsWith('- ')) {
        flushP(`p-${i}`);
        elements.push(
          <li key={`li-${i}`} style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.8, marginLeft: 20 }}>
            {trimmed.replace('- ', '')}
          </li>
        );
      } else if (trimmed === '') {
        flushP(`p-${i}`);
      } else {
        currentP.push(trimmed);
      }
    });

    flushP('p-last');
    return elements;
  };

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
        <div style={{ marginTop: 32, marginBottom: 48 }}>
          {renderContent(article.content)}
        </div>

        {/* Author Bio Box at End of Article (E-E-A-T Signal) */}
        <InfoCard accentColor="var(--accent-primary)">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <img
              src="/assets/pratheesh4k1.jpeg"
              alt="Pratheesh Clement"
              width={52}
              height={52}
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)', flexShrink: 0 }}
            />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 6 }}>
                About the Author — {IDENTITY.name}
              </h4>
              <ContentP style={{ fontSize: '0.9rem', marginBottom: 10 }}>
                {IDENTITY.bio.medium}
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
          description="Explore technical SEO services, web engineering, or digital marketing strategies."
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

import React from 'react';
import { useSEOMeta, PAGE_SEO } from '../seo/useSEOMeta';
import { StructuredData, webPageSchema } from '../seo/StructuredData';
import { PageLayout, ContentH2, ContentP, PageCTA } from './components/PageLayout';
import { Breadcrumb } from './components/Breadcrumb';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { navigateTo } from '../router/useRouter';
import { BookOpen, ArrowRight, Calendar, Clock, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  useSEOMeta(PAGE_SEO.blog);

  const schema = webPageSchema({
    url: '/blog/',
    name: 'SEO, Marketing & Development Insights',
    description: PAGE_SEO.blog.description,
    type: 'CollectionPage',
    breadcrumbs: [{ name: 'Blog', item: '/blog/' }],
  });

  return (
    <PageLayout>
      <StructuredData data={schema} id="blog-index-schema" />
      <Breadcrumb items={[{ label: 'Blog & Educational Articles' }]} />

      <div style={{ marginBottom: 40 }}>
        <span className="pill" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <BookOpen size={14} color="var(--accent-primary)" />
          Knowledge Hub & Insights
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
          SEO, Marketing, AI & Web Development Insights
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760 }}>
          Practical educational articles on technical search optimization, React performance engineering, Meta ad tracking, and AI-assisted marketing workflows — written by Pratheesh Clement.
        </p>
      </div>

      <ContentH2>Latest Articles</ContentH2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24, marginBottom: 56 }}>
        {BLOG_ARTICLES.map((article) => (
          <article
            key={article.slug}
            style={{
              padding: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span className="pill" style={{ fontSize: '0.72rem' }}>
                  {article.category}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} /> {article.datePublished}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} /> {article.readTime}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                <a
                  href={`/blog/${article.slug}/`}
                  onClick={e => { e.preventDefault(); navigateTo(`/blog/${article.slug}/`); }}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {article.title}
                </a>
              </h3>

              <ContentP style={{ fontSize: '0.96rem', marginBottom: 20 }}>
                {article.excerpt}
              </ContentP>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                {article.tags.map((t) => (
                  <span key={t} className="pill" style={{ fontSize: '0.73rem', padding: '2px 8px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--bg-tertiary)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                <User size={13} color="var(--accent-primary)" /> By {article.author}
              </span>
              <a
                href={`/blog/${article.slug}/`}
                onClick={e => { e.preventDefault(); navigateTo(`/blog/${article.slug}/`); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Read Article <ArrowRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>

      <PageCTA
        heading="Have Questions About SEO or Web Engineering?"
        description="Reach out to discuss technical search strategy, custom web applications, or performance optimization."
        primaryLabel="Get in Touch"
        primaryHref="/contact/"
        secondaryLabel="Explore SEO Guide"
        secondaryHref="/seo/"
      />
    </PageLayout>
  );
};

export default BlogPage;

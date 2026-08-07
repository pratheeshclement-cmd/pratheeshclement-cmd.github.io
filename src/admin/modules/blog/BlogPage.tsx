// ─── DMOS Blog CMS: Firestore Realtime & Automated Pipeline ───────────────

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText, Search, Sparkles } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, db, storage, auth } from '../../../lib/firebase';
import { BlogService, AIService } from '../../services/domainServices';
import { Card, Button, Badge, PageHeader, SectionHeader } from '../../design-system/components';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  canonicalUrl: string;
  metaDescription: string;
  readingTime: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  createdAt: string;
}

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical SEO');
  const [tagsInput, setTagsInput] = useState('SEO, React, Core Web Vitals');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/assets/blog-default.jpg');
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Subscribe to Firestore blogs collection
  useEffect(() => {
    console.log('[BlogPage] Mounted. Subscribing to Firestore "blogs"...');
    console.log('[BlogPage] Firebase App Project ID:', app?.options?.projectId);
    console.log('[BlogPage] Storage Bucket:', app?.options?.storageBucket);
    console.log('[BlogPage] Current Auth User:', auth?.currentUser?.uid || 'ANONYMOUS/NONE');

    if (!db) {
      console.warn('[BlogPage] Firestore DB instance null. Reading from backend REST API...');
      BlogService.listBlogs().then(res => {
        if (Array.isArray(res)) setBlogs(res);
        setLoading(false);
      }).catch((e) => {
        console.error('[BlogPage] Backend listBlogs error:', e);
        setLoading(false);
      });
      return;
    }

    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: BlogArticle[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<BlogArticle, 'id'>)
        }));
        console.log('[BlogPage] Realtime Snapshot Updated. Blog Count:', items.length);
        setBlogs(items);
        setLoading(false);
      }, (err) => {
        console.warn('[BlogPage] Firestore read error:', err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e: any) {
      console.error('[BlogPage] Firestore subscription error:', e.message);
      setLoading(false);
    }
  }, []);

  // 2. Cover Image Upload to Firebase Storage
  const handleCoverUpload = async (file: File) => {
    console.log('[BlogPage] handleCoverUpload ENTRY with file:', file.name, file.size);
    console.log('[BlogPage] Current User:', auth?.currentUser?.uid || 'NONE');

    if (!storage) {
      console.error('[BlogPage] FAILURE: Firebase Storage instance null.');
      alert('Firebase Storage not initialized.');
      return;
    }

    console.log('[BlogPage] Firebase Storage Initialized, Bucket:', storage.app.options.storageBucket);
    setUploadingImage(true);

    try {
      const storagePath = `blog-covers/${Date.now()}_${file.name}`;
      console.log('[BlogPage] Uploading to path:', storagePath);
      const storageRef = ref(storage, storagePath);

      console.log('[BlogPage] Calling uploadBytes...');
      const snapshot = await uploadBytes(storageRef, file);
      console.log('[BlogPage] Upload Complete Snapshot:', snapshot.ref.fullPath);

      console.log('[BlogPage] Fetching Download URL...');
      const url = await getDownloadURL(snapshot.ref);
      console.log('[BlogPage] SUCCESS: Download URL Received:', url);
      setCoverImage(url);
    } catch (e: any) {
      console.error('[BlogPage] FAILURE in handleCoverUpload:', e.message);
      alert(`Cover image upload error: ${e.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // 3. AI Assisted Blog Generation
  const handleAIGenerate = async () => {
    console.log('[BlogPage] handleAIGenerate ENTRY, Title:', title);
    if (!title) {
      alert('Please enter a blog title or topic first.');
      return;
    }
    setAiGenerating(true);
    try {
      const result = await AIService.generateBlog({ topic: title, keywords: tagsInput });
      if (result?.content) {
        console.log('[BlogPage] SUCCESS: AI generated content length:', result.content.length);
        setContent(result.content);
      }
    } catch (e: any) {
      console.error('[BlogPage] FAILURE in handleAIGenerate:', e.message);
      alert(`AI generation error: ${e.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // 4. Save & Execute Automated Pipeline
  const handleSaveBlog = async (status: 'published' | 'draft') => {
    console.log('[BlogPage] handleSaveBlog ENTRY, Status:', status, 'Title:', title);
    console.log('[BlogPage] Current Auth User:', auth?.currentUser?.uid || 'NONE');
    console.log('[BlogPage] Collection Path: blogs');

    if (!title || !content) {
      alert('Title and Content are required.');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();
    const wordCount = content.split(/\s+/).length;
    const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

    const blogPayload = {
      title,
      slug,
      content,
      category,
      tags,
      featuredImage: coverImage,
      canonicalUrl: `https://pratheeshclement-cmd.github.io/blog/${slug}/`,
      metaDescription: `${title} guide by Pratheesh Clement`,
      readingTime,
      status,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    try {
      if (editingId && db) {
        console.log('[BlogPage] Updating existing blog document ID:', editingId);
        try {
          await updateDoc(doc(db, 'blogs', editingId), { ...blogPayload, updatedAt: now });
          console.log('[BlogPage] SUCCESS: Web SDK Firestore document updated:', editingId);
        } catch (updateErr: any) {
          console.error('[BlogPage] updateDoc Error Code:', updateErr.code);
          console.error('[BlogPage] updateDoc Error Message:', updateErr.message);
        }
      } else {
        console.log('[BlogPage] Executing Automated Backend Publishing Pipeline...');
        const result = await BlogService.executeAutomatedPublishing({
          title,
          content,
          category,
          tags,
        });
        console.log('[BlogPage] Pipeline Result Received:', result);

        if (db) {
          console.log('[BlogPage] Writing blog document via Web SDK addDoc...');
          try {
            const docRef = await addDoc(collection(db, 'blogs'), blogPayload);
            console.log('[BlogPage] SUCCESS: Web SDK Firestore Document Created ID:', docRef.id);
          } catch (addErr: any) {
            console.error('[BlogPage] addDoc Error Code:', addErr.code);
            console.error('[BlogPage] addDoc Error Message:', addErr.message);
            console.warn('[BlogPage] Document written via Express Backend Admin SDK pipeline ID:', result?.blog?.id);
          }
        }
      }

      setModalOpen(false);
      resetForm();
    } catch (e: any) {
      console.error('[BlogPage] FAILURE in handleSaveBlog:', e.message);
      alert(`Save blog error: ${e.message}`);
    }
  };

  // 5. Delete Blog
  const handleDelete = async (id: string) => {
    console.log('[BlogPage] handleDelete ENTRY ID:', id);
    if (!confirm('Are you sure you want to delete this blog post from Firestore?')) return;
    try {
      if (db) {
        console.log('[BlogPage] Deleting doc from Firestore:', id);
        try {
          await deleteDoc(doc(db, 'blogs', id));
          console.log('[BlogPage] SUCCESS: Web SDK deleteDoc completed:', id);
        } catch (delErr: any) {
          console.error('[BlogPage] deleteDoc Error Code:', delErr.code);
          console.error('[BlogPage] deleteDoc Error Message:', delErr.message);
        }
      }
      await BlogService.deleteBlog(id).catch(() => {});
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch (e: any) {
      console.error('[BlogPage] FAILURE in handleDelete:', e.message);
      alert(`Delete error: ${e.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Technical SEO');
    setTagsInput('SEO, React, Performance');
    setCoverImage('/assets/blog-default.jpg');
  };

  const filteredBlogs = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Blog CMS"
        subtitle={<>Firestore: <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.76rem' }}>blogs</code> · Automated SEO &amp; Schema Pipeline</>}
        badge={<Badge variant="neutral">{blogs.length} Posts</Badge>}
        actions={
          <Button variant="primary" onClick={() => { resetForm(); setModalOpen(true); }} leftIcon={<Plus size={15} />}>
            New Blog Post
          </Button>
        }
      />

      {/* Search Bar */}
      <div style={{ marginBottom: 20, maxWidth: 360, position: 'relative' }}>
        <Search size={14} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 10, top: 10 }} />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '7px 12px 7px 32px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)',
            fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
          Loading Firestore blog documents…
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)' }}>
          <FileText size={32} color="var(--dmos-text-subtle)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)' }}>No Blog Articles Found</div>
          <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Click "New Blog Post" to publish an article to Firestore.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredBlogs.map(item => (
            <Card key={item.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                    {item.status?.toUpperCase() || 'PUBLISHED'}
                  </Badge>
                  <span style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)' }}>{item.category}</span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)', margin: 0, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.content || item.metaDescription || 'No content preview.'}
                </p>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--dmos-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)' }}>{item.readingTime || '5 min read'} · {item.views || 0} views</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      console.log('[BlogPage] Edit Post Clicked ID:', item.id);
                      setEditingId(item.id);
                      setTitle(item.title);
                      setCategory(item.category || 'Technical SEO');
                      setTagsInput((item.tags || []).join(', '));
                      setContent(item.content || '');
                      setCoverImage(item.featuredImage || '/assets/blog-default.jpg');
                      setModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-text-muted)' }}
                    title="Edit Post"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)' }}
                    title="Delete Post"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 998, backdropFilter: 'blur(4px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{
                position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto',
                background: 'var(--dmos-card-elevated)', border: '1px solid var(--dmos-border-strong)',
                borderRadius: 14, boxShadow: 'var(--dmos-shadow-lg)', zIndex: 999, padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--dmos-text)', margin: 0 }}>
                  {editingId ? 'Edit Blog Document' : 'Create & Publish New Blog'}
                </h2>
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  style={{
                    padding: '6px 12px', background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.4)',
                    borderRadius: 8, color: '#c084fc', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <Sparkles size={14} />
                  {aiGenerating ? 'Generating via Gemini AI…' : 'Generate via Gemini AI'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Article Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Master Technical SEO in React 2026"
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', background: 'var(--dmos-surface)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option value="Technical SEO">Technical SEO</option>
                      <option value="Paid Advertising">Paid Advertising</option>
                      <option value="AI & Automation">AI & Automation</option>
                      <option value="Web Development">Web Development</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={e => setTagsInput(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Cover Image (Firebase Storage Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      console.log('[BlogPage] File Chosen:', e.target.files?.[0]?.name);
                      e.target.files?.[0] && handleCoverUpload(e.target.files[0]);
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--dmos-text-muted)' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '0.74rem', color: 'var(--dmos-primary-light)', marginLeft: 8 }}>Uploading to Firebase Storage…</span>}
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Markdown Content</label>
                  <textarea
                    rows={10}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write article content in Markdown format..."
                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="secondary" onClick={() => handleSaveBlog('draft')}>Save Draft</Button>
                  <Button variant="primary" onClick={() => handleSaveBlog('published')}>Publish & Trigger Pipeline</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

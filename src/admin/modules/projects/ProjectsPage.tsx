// ─── DMOS Projects CMS: Firestore Realtime ─────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, Edit2, Trash2, ExternalLink, Star, Search, HardDrive } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader } from '../../design-system/components';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string;
  category: string;
  technologies: string[];
  featured: boolean;
  coverImage: string;
  createdAt: string;
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('JBHL Pvt Ltd');
  const [category, setCategory] = useState('Web Development');
  const [techInput, setTechInput] = useState('React, TypeScript, Vite, Firebase');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('/assets/project-default.jpg');
  const [featured, setFeatured] = useState(false);

  // 1. Subscribe to Firestore projects collection
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Project[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Project, 'id'>)
        }));
        setProjects(items);
        setLoading(false);
      }, () => {
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  // 2. Cover image upload to Firebase Storage
  const handleCoverUpload = async (file: File) => {
    if (!storage) return;
    try {
      const storagePath = `project-covers/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      setCoverImage(url);
    } catch (e: any) {
      alert(`Upload error: ${e.message}`);
    }
  };

  // 3. Save Project to Firestore
  const handleSave = async () => {
    if (!title || !description) {
      alert('Title and description are required.');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const technologies = techInput.split(',').map(t => t.trim()).filter(Boolean);
    const now = new Date().toISOString();

    try {
      if (editingId && db) {
        await updateDoc(doc(db, 'projects', editingId), {
          title,
          slug,
          client,
          category,
          technologies,
          description,
          featured,
          coverImage,
          updatedAt: now,
        });
      } else if (db) {
        await addDoc(collection(db, 'projects'), {
          title,
          slug,
          client,
          category,
          technologies,
          description,
          featured,
          coverImage,
          createdAt: now,
          updatedAt: now,
        });
      }

      setModalOpen(false);
      resetForm();
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    }
  };

  // 4. Toggle Featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      if (db) {
        await updateDoc(doc(db, 'projects', id), { featured: !current });
      }
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
    } catch (e: any) {
      alert(`Toggle error: ${e.message}`);
    }
  };

  // 5. Delete Project
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project from Firestore?')) return;
    try {
      if (db) {
        await deleteDoc(doc(db, 'projects', id));
      }
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setClient('JBHL Pvt Ltd');
    setCategory('Web Development');
    setTechInput('React, TypeScript, Vite, Firebase');
    setCoverImage('/assets/project-default.jpg');
    setFeatured(false);
  };

  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Portfolio Projects"
        subtitle={<>Firestore: <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.76rem' }}>projects</code> · CMS &amp; Featured Project Manager</>}
        badge={<Badge variant="neutral">{projects.length} Projects</Badge>}
        actions={<Button variant="primary" onClick={() => { resetForm(); setModalOpen(true); }} leftIcon={<Plus size={15} />}>Add Project</Button>}
      />
      {/* Search Input */}
      <div style={{ marginBottom: 20, maxWidth: 360, position: 'relative' }}>
        <Search size={14} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 10, top: 10 }} />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '7px 12px 7px 32px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)',
            fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
          Loading Firestore project documents…
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)' }}>
          <Folder size={32} color="var(--dmos-text-subtle)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)' }}>No Projects Found</div>
          <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Click "Add Project" to save a project to Firestore.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredProjects.map(project => (
            <Card key={project.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Badge variant={project.featured ? 'success' : 'neutral'}>
                    {project.category || 'Web Development'}
                  </Badge>
                  <button
                    onClick={() => handleToggleFeatured(project.id, project.featured)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: project.featured ? '#f59e0b' : 'var(--dmos-text-subtle)' }}
                    title={project.featured ? 'Featured Project' : 'Mark as Featured'}
                  >
                    <Star size={16} fill={project.featured ? '#f59e0b' : 'none'} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 6px 0' }}>
                  {project.title}
                </h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--dmos-text-subtle)', marginBottom: 8 }}>
                  Client: {project.client}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)', margin: 0, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--dmos-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {(project.technologies || []).slice(0, 3).map(tech => (
                    <span key={tech} style={{ fontSize: '0.66rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: 4, color: 'var(--dmos-text-muted)' }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setEditingId(project.id);
                      setTitle(project.title);
                      setClient(project.client || 'JBHL Pvt Ltd');
                      setCategory(project.category || 'Web Development');
                      setTechInput((project.technologies || []).join(', '));
                      setDescription(project.description || '');
                      setCoverImage(project.coverImage || '/assets/project-default.jpg');
                      setFeatured(!!project.featured);
                      setModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-text-muted)' }}
                    title="Edit Project"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)' }}
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <div onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 998, backdropFilter: 'blur(4px)' }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{
                position: 'fixed', top: '8%', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto',
                background: 'var(--dmos-card-elevated)', border: '1px solid var(--dmos-border-strong)',
                borderRadius: 14, boxShadow: 'var(--dmos-shadow-lg)', zIndex: 999, padding: 24,
              }}
            >
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--dmos-text)', margin: '0 0 20px 0' }}>
                {editingId ? 'Edit Project Document' : 'Add New Project'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Client</label>
                    <input
                      type="text"
                      value={client}
                      onChange={e => setClient(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Technologies Used (comma separated)</label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Project Cover Image (Firebase Storage)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
                    style={{ fontSize: '0.8rem', color: 'var(--dmos-text-muted)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSave}>Save Project to Firestore</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

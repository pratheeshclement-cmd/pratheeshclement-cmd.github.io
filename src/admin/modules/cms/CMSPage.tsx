// ─── DMOS Portfolio CMS: Firestore Document Store ──────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, CheckCircle, Upload, FileText, User, Briefcase, Sparkles, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, SectionHeader, Tabs } from '../../design-system/components';

export const CMSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [headline, setHeadline] = useState('Architect of Digital Ecosystems');
  const [subheadline, setSubheadline] = useState('Digital Marketing Specialist · AI Enthusiast — AI + Marketing + Development');
  const [location, setLocation] = useState('Vadalur, Tamil Nadu, India');
  const [bio, setBio] = useState('Multidisciplinary Digital Marketer at JBHL Pvt Ltd with background in production/store department at Nexteer Automotive India. Google Skillshop Certified — Fundamentals of Digital Marketing.');
  const [resumeUrl, setResumeUrl] = useState('/assets/resume.pdf');
  const [uploadingResume, setUploadingResume] = useState(false);

  // 1. Subscribe to Firestore settings/portfolio_cms
  useEffect(() => {
    if (!db) return;
    try {
      const docRef = doc(db, 'settings', 'portfolio_cms');
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.headline) setHeadline(data.headline);
          if (data.subheadline) setSubheadline(data.subheadline);
          if (data.location) setLocation(data.location);
          if (data.bio) setBio(data.bio);
          if (data.resumeUrl) setResumeUrl(data.resumeUrl);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      // Fallback local state
    }
  }, []);

  // 2. Upload Resume to Firebase Storage
  const handleResumeUpload = async (file: File) => {
    if (!storage) return;
    setUploadingResume(true);
    try {
      const storagePath = `resumes/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      setResumeUrl(url);
    } catch (e: any) {
      alert(`Resume upload error: ${e.message}`);
    } finally {
      setUploadingResume(false);
    }
  };

  // 3. Save Settings to Firestore
  const handleSaveSettings = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      if (db) {
        await setDoc(doc(db, 'settings', 'portfolio_cms'), {
          headline,
          subheadline,
          location,
          bio,
          resumeUrl,
          updatedAt: new Date().toISOString(),
          updatedBy: 'Pratheesh Clement',
        }, { merge: true });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Portfolio CMS"
        subtitle={<>Firestore: <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.76rem' }}>settings/portfolio_cms</code> · Live Hero, About &amp; Services Editor</>}
        actions={<Button variant="primary" onClick={handleSaveSettings} disabled={saving} leftIcon={<Save size={15} />}>{saving ? 'Saving…' : 'Save All'}</Button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--dmos-border)', paddingBottom: 12 }}>
        {[
          { id: 'hero', label: 'Hero & Branding', icon: User },
          { id: 'about', label: 'About & Bio', icon: FileText },
          { id: 'resume', label: 'Resume & Documents', icon: Upload },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600,
              border: activeTab === tab.id ? '1px solid var(--dmos-primary)' : '1px solid transparent',
              background: activeTab === tab.id ? 'rgba(46,90,255,0.12)' : 'transparent',
              color: activeTab === tab.id ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'hero' && (
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 16px 0' }}>Hero Section & Branding</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Main Headline Title</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Subheadline Tagline</label>
              <input
                type="text"
                value={subheadline}
                onChange={e => setSubheadline(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Location Tag</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'about' && (
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 16px 0' }}>About Section & Bio</h2>
          <div>
            <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Professional Bio Text</label>
            <textarea
              rows={8}
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)', fontSize: '0.86rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
        </Card>
      )}

      {activeTab === 'resume' && (
        <Card style={{ padding: 24 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dmos-text)', margin: '0 0 16px 0' }}>Resume Document (Firebase Storage)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Upload New Resume PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                style={{ fontSize: '0.8rem', color: 'var(--dmos-text-muted)' }}
              />
              {uploadingResume && <span style={{ fontSize: '0.74rem', color: 'var(--dmos-primary-light)', marginLeft: 8 }}>Uploading to Firebase Storage…</span>}
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', color: 'var(--dmos-text-muted)', display: 'block', marginBottom: 4 }}>Active Download URL</label>
              <input
                type="text"
                readOnly
                value={resumeUrl}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text-muted)', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

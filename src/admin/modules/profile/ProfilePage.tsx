// ─── DMOS Profile Page v7 — Realtime Avatar Upload & Profile Persistence ────

import React, { useState, useRef } from 'react';
import { Save, Camera, Mail, Phone, MapPin, Globe, Github, Linkedin, Instagram, Loader2, Check } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../../lib/firebase';
import { Card, SectionHeader, Button, Badge, PageHeader, Input } from '../../design-system/components';
import { useAuth } from '../../auth/AuthProvider';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState(user?.displayName || 'Pratheesh Clement');
  const [phone, setPhone] = useState('+91 86678 76102');
  const [location, setLocation] = useState('Vadalur, Tamil Nadu, India');
  const [jobTitle, setJobTitle] = useState('Digital Marketing Specialist & AI Enthusiast');
  const [bio, setBio] = useState('Pratheesh Clement is a multidisciplinary digital professional specializing in Digital Marketing, UI/UX Design, SEO, Web Development, and AI-powered solutions.');
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '');

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!user) {
      alert('You must be logged in to upload an avatar.');
      return;
    }

    setUploading(true);
    try {
      if (storage) {
        const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          null,
          (err) => {
            console.error('[ProfilePage] Avatar upload error:', err);
            setUploading(false);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setPhotoUrl(url);

            // Update Auth Current User
            if (auth.currentUser) {
              await updateProfile(auth.currentUser, { photoURL: url }).catch(() => {});
            }

            // Update Firestore Document
            if (db) {
              await updateDoc(doc(db, 'users', user.uid), { photoURL: url, updatedAt: new Date().toISOString() }).catch(() => {});
            }

            // Update local user object photoURL
            (user as any).photoURL = url;

            setUploading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }
        );
      } else {
        const localUrl = URL.createObjectURL(file);
        setPhotoUrl(localUrl);
        (user as any).photoURL = localUrl;
        setUploading(false);
      }
    } catch (err: any) {
      alert(`Avatar upload error: ${err.message}`);
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName }).catch(() => {});
      }

      if (db && user) {
        await updateDoc(doc(db, 'users', user.uid), {
          displayName,
          phone,
          location,
          jobTitle,
          bio,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      }

      if (user) {
        (user as any).displayName = displayName;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      alert(`Error saving profile: ${e.message}`);
    }
  };

  const avatarChar = displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'P';

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your identity, avatar, contact information, and role attributes"
        badge={<Badge variant="danger">{user?.role || 'Super Admin'}</Badge>}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>
        {/* Avatar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--dmos-primary), var(--dmos-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 800, color: '#fff', margin: '0 auto',
                overflow: 'hidden', border: '3px solid var(--dmos-border-strong)',
                boxShadow: 'var(--dmos-shadow-md)',
              }}>
                {photoUrl ? (
                  <img src={photoUrl} alt={avatarChar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  avatarChar
                )}
              </div>

              <button
                onClick={handleAvatarClick}
                disabled={uploading}
                style={{
                  position: 'absolute', bottom: 0, right: 0, width: 28, height: 28,
                  borderRadius: '50%', background: 'var(--dmos-primary)',
                  border: '2px solid var(--dmos-card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
                title="Upload & replace photo"
              >
                {uploading ? (
                  <Loader2 size={13} color="#fff" style={{ animation: 'dmos-spin 0.8s linear infinite' }} />
                ) : (
                  <Camera size={13} color="#fff" />
                )}
              </button>
            </div>

            <div style={{ fontWeight: 700, color: 'var(--dmos-text)', fontSize: '0.94rem' }}>{displayName}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--dmos-text-subtle)', marginTop: 4 }}>{user?.email}</div>
            <div style={{ marginTop: 12 }}>
              <Badge variant="danger">{user?.role || 'Super Admin'}</Badge>
            </div>
          </Card>

          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--dmos-text-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Quick Links</div>
            {[
              { icon: Globe, label: 'Live Portfolio', href: 'https://pratheeshclement-cmd.github.io/' },
              { icon: Github, label: 'GitHub Profile', href: 'https://github.com/pratheeshclement-cmd' },
              { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/mariya-pratheesh-5b8a9b316/' },
              { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/pratheeeesh/' },
            ].map(link => (
              <a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', color: 'var(--dmos-text-muted)', fontSize: '0.8rem', textDecoration: 'none', borderBottom: '1px solid var(--dmos-border)' }}
              >
                <link.icon size={14} />
                {link.label}
              </a>
            ))}
          </Card>
        </div>

        {/* Form Column */}
        <Card style={{ padding: 24 }}>
          <SectionHeader title="Profile Information" subtitle="Persists to Firebase Auth & Firestore collection: users" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
              <Input label="Email Address (Read Only)" value={user?.email || 'pratheesh.clement@gmail.com'} disabled readOnly />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Phone / WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} />
              <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} />
            </div>

            <Input label="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)', marginBottom: 6 }}>Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="dmos-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid var(--dmos-border)', alignItems: 'center' }}>
              <Button variant="primary" onClick={handleSaveProfile} leftIcon={saved ? <Check size={14} color="var(--dmos-success)" /> : <Save size={14} />}>
                {saved ? 'Profile Saved!' : 'Save Profile'}
              </Button>
              <Button variant="danger" onClick={logout}>Sign Out</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

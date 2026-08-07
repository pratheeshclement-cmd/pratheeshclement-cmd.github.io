// ─── DMOS Media Library: Firebase Storage & Firestore Realtime ───────────

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Video, FileText, Search, Trash2, Copy, Check, ExternalLink, HardDrive, RefreshCw } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, storage, auth } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, ProgressBar } from '../../design-system/components';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  uploadedBy?: string;
  storagePath?: string;
}

export const MediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Subscribe to Firestore media collection
  useEffect(() => {
    console.log('[MediaPage] Mounted. Subscribing to Firestore "media" collection...');
    if (!db) {
      console.warn('[MediaPage] Firestore DB instance not ready.');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: MediaItem[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<MediaItem, 'id'>)
        }));
        console.log('[MediaPage] Realtime Snapshot Updated. Item Count:', items.length);
        setMediaList(items);
        setLoading(false);
      }, (err) => {
        console.warn('[MediaPage] Firestore read fallback:', err.message);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e: any) {
      console.error('[MediaPage] Firestore subscription error:', e.message);
      setLoading(false);
    }
  }, []);

  // 2. Handle File Upload to Firebase Storage & Firestore
  const handleFileUpload = async (files: FileList | null) => {
    console.log('[MediaPage] handleFileUpload ENTRY with files:', files);
    if (!files || files.length === 0) return;
    const file = files[0];

    console.log('[MediaPage] File Selected:', file.name, file.size, file.type);
    console.log('[MediaPage] Current Auth User:', auth?.currentUser);

    if (!storage || !db) {
      console.error('[MediaPage] FAILURE: Firebase Storage or Firestore not initialized.');
      alert('Firebase Storage not connected. Please check your credentials.');
      return;
    }

    console.log('[MediaPage] Firebase Storage Initialized. Bucket:', storage.app.options.storageBucket);

    setUploading(true);
    setUploadProgress(0);

    const storagePath = `media/${Date.now()}_${file.name}`;
    console.log('[MediaPage] Uploading to path:', storagePath);
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        console.log('[MediaPage] Upload Progress:', progress, '%');
        setUploadProgress(progress);
      },
      (error) => {
        console.error('[MediaPage] FAILURE: Firebase Storage upload error:', error);
        alert(`Upload failed: ${error.message}`);
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('[MediaPage] Download URL Received:', downloadURL);
          const now = new Date().toISOString();

          const docRef = await addDoc(collection(db, 'media'), {
            name: file.name,
            url: downloadURL,
            mimeType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
            createdAt: now,
            uploadedBy: 'Pratheesh Clement',
            storagePath,
          });

          console.log('[MediaPage] SUCCESS: Firestore Document Created ID:', docRef.id);
          setUploading(false);
          setUploadProgress(0);
        } catch (err: any) {
          console.error('[MediaPage] FAILURE in getDownloadURL / Firestore addDoc:', err.message);
          setUploading(false);
        }
      }
    );
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    console.log('[MediaPage] File Dropped via Drag & Drop:', e.dataTransfer.files);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // 3. Handle File Deletion
  const handleDelete = async (item: MediaItem) => {
    console.log('[MediaPage] handleDelete ENTRY:', item.id, item.name);
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      if (storage && item.storagePath) {
        console.log('[MediaPage] Deleting from Storage path:', item.storagePath);
        const fileRef = ref(storage, item.storagePath);
        await deleteObject(fileRef).catch((e) => console.warn('[MediaPage] Storage delete warning:', e.message));
      }
      if (db) {
        console.log('[MediaPage] Deleting document from Firestore:', item.id);
        await deleteDoc(doc(db, 'media', item.id));
      }
      console.log('[MediaPage] SUCCESS: Media item deleted:', item.id);
      setMediaList(prev => prev.filter(m => m.id !== item.id));
    } catch (e: any) {
      console.error('[MediaPage] FAILURE in handleDelete:', e.message);
      alert(`Delete error: ${e.message}`);
    }
  };

  // 4. Handle Copy URL
  const handleCopy = (id: string, url: string) => {
    console.log('[MediaPage] Copying URL for asset ID:', id, url);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'image') return matchesSearch && item.mimeType.startsWith('image/');
    if (filterType === 'video') return matchesSearch && item.mimeType.startsWith('video/');
    if (filterType === 'document') return matchesSearch && (item.mimeType.includes('pdf') || item.mimeType.includes('document'));
    return matchesSearch;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Media Library"
        subtitle={<>Firebase Storage: <code style={{ color: 'var(--dmos-primary-light)', fontFamily: 'var(--dmos-font-mono)', fontSize: '0.76rem' }}>pratheesh-os.firebasestorage.app</code> · {mediaList.length} assets</>}
        badge={<Badge variant="neutral">{mediaList.length} Files</Badge>}
      />
      {/* File Dropzone & Upload Progress */}
      <Card style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed var(--dmos-primary)' : '2px dashed var(--dmos-border)',
            background: isDragging ? 'rgba(46,90,255,0.08)' : 'rgba(16,24,39,0.5)',
            textAlign: 'center', padding: '32px 20px', cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <input
            type="file"
            id="media-upload-input"
            style={{ display: 'none' }}
            onChange={e => handleFileUpload(e.target.files)}
          />
          <label htmlFor="media-upload-input" style={{ cursor: 'pointer', display: 'block' }}>
            <Upload size={36} color={isDragging ? 'var(--dmos-primary)' : 'var(--dmos-primary-light)'} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--dmos-text)' }}>
              {uploading ? `Uploading to Firebase Storage (${uploadProgress}%)...` : isDragging ? 'Drop File to Upload Now' : 'Click or Drag & Drop File to Upload to Firebase Storage'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)', marginTop: 4 }}>
              Supports PNG, JPEG, WebP, MP4, PDF, and Documents up to 50MB
            </div>
          </label>

          {uploading && (
            <div style={{ width: '100%', maxWidth: 400, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, margin: '16px auto 0', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'var(--dmos-primary)', borderRadius: 999 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'image', 'video', 'document'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                border: filterType === type ? '1px solid var(--dmos-primary)' : '1px solid var(--dmos-border)',
                background: filterType === type ? 'rgba(46,90,255,0.15)' : 'rgba(255,255,255,0.03)',
                color: filterType === type ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)',
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
              }}
            >
              {type}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} color="var(--dmos-text-subtle)" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '7px 12px 7px 32px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--dmos-border)', borderRadius: 8, color: 'var(--dmos-text)',
              fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)', fontSize: '0.84rem' }}>
          Loading Firebase Storage assets…
        </div>
      ) : filteredMedia.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center', color: 'var(--dmos-text-muted)' }}>
          <HardDrive size={32} color="var(--dmos-text-subtle)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--dmos-text)' }}>No Media Assets Found</div>
          <div style={{ fontSize: '0.78rem', marginTop: 4 }}>Upload an image or document above to populate Firebase Storage.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filteredMedia.map(item => (
            <Card key={item.id} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 130, background: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {item.mimeType.startsWith('image/') ? (
                  <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : item.mimeType.startsWith('video/') ? (
                  <Video size={36} color="var(--dmos-primary-light)" />
                ) : (
                  <FileText size={36} color="var(--dmos-text-subtle)" />
                )}
              </div>

              <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dmos-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', marginTop: 4 }}>
                    {formatSize(item.sizeBytes)} · {item.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: '1px solid var(--dmos-border)' }}>
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === item.id ? 'var(--dmos-success)' : 'var(--dmos-text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}
                    title="Copy Public Download URL"
                  >
                    {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === item.id ? 'Copied' : 'URL'}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--dmos-text-muted)', display: 'flex' }}
                    title="Open File"
                  >
                    <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => handleDelete(item)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dmos-danger)', display: 'flex' }}
                    title="Delete File"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

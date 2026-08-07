// ─── DMOS Backend: Media & Storage Router ─────────────────────────────────

import { Router } from 'express';
import { db, storage } from '../config/firebaseAdmin';
import { FIRESTORE_COLLECTIONS } from '../db/schema';

export const mediaRouter = Router();

// GET /api/media/files
mediaRouter.get('/files', async (req, res) => {
  try {
    if (!db) {
      return res.json([
        { id: '1', name: 'pratheesh4k2.jpeg', sizeBytes: 2202009, mimeType: 'image/jpeg', dimensions: '3840×2160', url: '/assets/pratheesh4k2.jpeg' },
        { id: '2', name: 'seo-og.jpg', sizeBytes: 145408, mimeType: 'image/jpeg', dimensions: '1200×630', url: '/assets/seo-og.jpg' },
        { id: '3', name: 'resume.pdf', sizeBytes: 97280, mimeType: 'application/pdf', dimensions: '—', url: '/assets/resume.pdf' },
      ]);
    }

    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.MEDIA).orderBy('createdAt', 'desc').get();
    const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(files);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

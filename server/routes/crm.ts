// ─── DMOS Backend: CRM & Contact Pipeline Router ───────────────────────────

import { Router } from 'express';
import { db } from '../config/firebaseAdmin';
import { FIRESTORE_COLLECTIONS, CRMLeadDocument } from '../db/schema';
import { requireAdminAuth } from '../middleware/auth';

export const crmRouter = Router();

// GET /api/crm/leads
crmRouter.get('/leads', requireAdminAuth as any, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: 'Firestore unavailable. CRM data is not configured.' });
    }

    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.CRM).orderBy('createdAt', 'desc').get();
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.json({ success: true, leads });
  } catch (e: any) {
    console.error('[CRM Route] GET /leads error:', e.message);
    res.status(500).json({ success: false, error: 'Unable to load CRM leads.' });
  }
});

// POST /api/crm/contact-submit — Web Contact Form Submission Pipeline
crmRouter.post('/contact-submit', async (req, res) => {
  try {
    const { name, email, phone = '', company = 'Self', service = 'General Inquiry', message = '', estimatedValue = 10000 } = req.body;
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedCompany = typeof company === 'string' ? company.trim() : 'Self';
    const trimmedService = typeof service === 'string' ? service.trim() : 'General Inquiry';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    const value = Number(estimatedValue);

    if (!trimmedName) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }
    if (!trimmedMessage) {
      return res.status(400).json({ success: false, error: 'Message is required.' });
    }
    if (trimmedMessage.length > 2000) {
      return res.status(400).json({ success: false, error: 'Message cannot exceed 2000 characters.' });
    }
    if (!db) {
      return res.status(503).json({ success: false, error: 'Firestore unavailable. Contact form cannot be processed.' });
    }

    const now = new Date().toISOString();
    const priority = trimmedMessage.length > 50 ? 'High' : 'Medium';
    const aiSummary = `Inquiry for ${trimmedService} from ${trimmedName} (${trimmedCompany}). Message: "${trimmedMessage}"`;

    const leadDoc: Partial<CRMLeadDocument> = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      company: trimmedCompany,
      service: trimmedService,
      message: trimmedMessage,
      value: Number.isNaN(value) ? 0 : value,
      stage: 'new',
      priority,
      aiSummary,
      createdAt: now,
      updatedAt: now,
      createdBy: 'website_form',
      status: 'active',
      version: 1,
    };

    const contactRef = await db.collection(FIRESTORE_COLLECTIONS.CONTACTS).add({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      company: trimmedCompany,
      createdAt: now,
    });

    const crmRef = await db.collection(FIRESTORE_COLLECTIONS.CRM).add(leadDoc);

    await db.collection(FIRESTORE_COLLECTIONS.NOTIFICATIONS).add({
      title: `New Lead: ${trimmedName} (${trimmedCompany})`,
      desc: `${trimmedService} inquiry — ₹${Number(value).toLocaleString()}`,
      type: 'lead',
      read: false,
      priority: 'critical',
      createdAt: now,
    });

    res.json({
      success: true,
      message: 'Contact form processed and pipeline updated.',
      lead: { id: crmRef.id, ...leadDoc },
      firestoreSaved: true,
    });
  } catch (e: any) {
    console.error('[CRM Route] contact-submit error:', e.message);
    res.status(500).json({ success: false, error: 'Unable to process contact submission at this time.' });
  }
});

// PATCH /api/crm/leads/:id — Update lead stage or fields
crmRouter.patch('/leads/:id', requireAdminAuth as any, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid Lead ID is required.' });
    }
    if (!db) {
      return res.status(503).json({ success: false, error: 'Firestore unavailable.' });
    }

    const { stage, priority, notes, value } = req.body;
    const updates: Record<string, any> = { updatedAt: new Date().toISOString() };

    if (stage && typeof stage === 'string') updates.stage = stage.trim();
    if (priority && typeof priority === 'string') updates.priority = priority.trim();
    if (notes && typeof notes === 'string') updates.notes = notes.trim().slice(0, 1000);
    if (typeof value === 'number' && !isNaN(value)) updates.value = Math.max(0, value);

    await db.collection(FIRESTORE_COLLECTIONS.CRM).doc(id).update(updates);
    res.json({ success: true, message: `Lead ${id} updated successfully.`, updates });
  } catch (e: any) {
    res.status(500).json({ success: false, error: 'Failed to update lead.' });
  }
});

// DELETE /api/crm/leads/:id — Remove lead from pipeline
crmRouter.delete('/leads/:id', requireAdminAuth as any, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid Lead ID is required.' });
    }
    if (!db) {
      return res.status(503).json({ success: false, error: 'Firestore unavailable.' });
    }

    await db.collection(FIRESTORE_COLLECTIONS.CRM).doc(id).delete();
    res.json({ success: true, message: `Lead ${id} deleted successfully.` });
  } catch (e: any) {
    res.status(500).json({ success: false, error: 'Failed to delete lead.' });
  }
});


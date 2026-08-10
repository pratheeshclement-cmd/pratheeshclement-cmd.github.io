// ─── DMOS User Management Backend API Router ───────────────────────────────
// Real Firebase Admin SDK user management, RBAC authorization, and SMTP invitation email delivery.

import { Router, Response } from 'express';
import { adminAuth, db } from '../config/firebaseAdmin';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth';
import { normalizeRole } from '../middleware/rbac';
import { SMTPIntegrationService } from '../services/integrations/smtpService';


export const usersRouter = Router();

// Protect all user management endpoints with requireAdminAuth middleware
usersRouter.use(requireAdminAuth);

// Helper function to build ActionCodeSettings for password setup link
function getActionCodeSettings(): any {
  const publicUrl = process.env.APP_PUBLIC_URL || 'https://pratheeshclement-cmd.github.io/admin/';
  return {
    url: publicUrl,
    handleCodeInApp: true,
  };
}

// Helper function to render HTML invitation email
function renderInvitationHtml(cleanName: string, cleanEmail: string, role: string, setupLink: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0d111a; color: #f5f7fa; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
      <h2 style="color: #3b63ff; margin-top: 0; font-size: 1.4rem; font-weight: 800;">Pratheesh Control Center</h2>
      <p style="font-size: 15px; color: #a7b0c0; line-height: 1.6;">Hi ${cleanName},</p>
      <p style="font-size: 15px; color: #a7b0c0; line-height: 1.6;">You have been invited to join <strong>Pratheesh Control Center</strong>.</p>
      <div style="background: rgba(255,255,255,0.04); border-left: 4px solid #3b63ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #697386; font-weight: 600; text-transform: uppercase;">Invitation Details</p>
        <p style="margin: 0; font-size: 14px; color: #f5f7fa;"><strong>Email:</strong> ${cleanEmail}</p>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #f5f7fa;"><strong>Role:</strong> ${role}</p>
      </div>

      <p style="font-size: 14px; color: #a7b0c0; line-height: 1.6;">Click the button below to set your password and activate your account:</p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${setupLink}" style="display: inline-block; padding: 14px 28px; background: #3b63ff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px; box-shadow: 0 4px 14px rgba(59,99,255,0.4);">Set Up Your Account</a>
      </div>

      <p style="font-size: 12px; color: #697386; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
        This invitation was sent from Pratheesh Control Center. If you were not expecting this invitation, you can safely ignore this email.
      </p>
    </div>
  `;
}

// GET /api/users — List real users from Firestore / Firebase Auth
usersRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (db) {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, users });
    }

    if (adminAuth) {
      const listResult = await adminAuth.listUsers(100);
      const users = listResult.users.map(u => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName || u.email?.split('@')[0],
        status: u.disabled ? 'suspended' : 'active',
        invitationStatus: 'sent',
        createdAt: u.metadata.creationTime,
        lastLogin: u.metadata.lastSignInTime,
      }));
      return res.status(200).json({ success: true, users });
    }

    return res.status(200).json({ success: true, users: [] });
  } catch (error: any) {
    console.error('[UsersRouter] GET / error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/invite — Create/lookup Firebase Auth account & deliver SMTP email invitation
usersRouter.post('/invite', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, displayName, role } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ success: false, error: 'User role is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = displayName ? displayName.trim() : cleanEmail.split('@')[0];
    const invitedBy = req.user?.email || 'Admin';
    const now = new Date().toISOString();
    let realUid: string;
    let setupLink: string | null = null;

    if (adminAuth) {
      let existingUser: any = null;
      try {
        existingUser = await adminAuth.getUserByEmail(cleanEmail);
      } catch (e: any) {
        // User not found in Firebase Auth, proceed to create
      }

      if (existingUser) {
        realUid = existingUser.uid;
      } else {
        const userRecord = await adminAuth.createUser({
          email: cleanEmail,
          displayName: cleanName,
          emailVerified: false,
          disabled: false,
        });
        realUid = userRecord.uid;
      }

      try {
        await adminAuth.setCustomUserClaims(realUid, { role });
      } catch (claimErr: any) {
        console.warn('[UsersRouter] Custom claims set warning:', claimErr.message);
      }

      try {
        setupLink = await adminAuth.generatePasswordResetLink(cleanEmail, getActionCodeSettings());
      } catch (linkErr: any) {
        console.warn('[UsersRouter] Action link generation with settings warning, falling back:', linkErr.message);
        try {
          setupLink = await adminAuth.generatePasswordResetLink(cleanEmail);
        } catch (fallbackErr: any) {
          console.error('[UsersRouter] Password reset link generation failed:', fallbackErr.message);
          return res.status(500).json({
            success: false,
            error: 'Failed to generate password setup link.',
            details: fallbackErr.message,
          });
        }
      }
    } else {
      realUid = `usr_${Buffer.from(cleanEmail).toString('hex').substring(0, 16)}`;
      setupLink = `${process.env.APP_PUBLIC_URL || 'https://pratheeshclement-cmd.github.io/admin/'}?setup=${realUid}`;
    }

    // Deliver invitation email via Nodemailer SMTP
    const emailSendResult = await SMTPIntegrationService.sendEmail({
      to: cleanEmail,
      subject: "You're invited to Pratheesh Control Center",
      text: `Hi ${cleanName},\n\nYou have been invited to join Pratheesh Control Center.\n\nRole: ${role}\n\nSet up your account: ${setupLink}\n\nEmail: ${cleanEmail}\nRole: ${role}\n\nThis invitation was sent from Pratheesh Control Center.`,
      html: renderInvitationHtml(cleanName, cleanEmail, role, setupLink),
    });

    const isEmailSent = emailSendResult.success;
    const invitationStatus = isEmailSent ? 'sent' : 'failed';

    const userDoc = {
      uid: realUid,
      email: cleanEmail,
      displayName: cleanName,
      role,
      status: 'active',
      invitationStatus,
      invitedAt: now,
      invitedBy,
      lastInvitationSentAt: isEmailSent ? now : null,
      emailVerified: false,
      disabled: false,
      createdAt: now,
      updatedAt: now,
    };

    if (db) {
      await db.collection('users').doc(realUid).set(userDoc, { merge: true });
    }

    if (!isEmailSent) {
      return res.status(500).json({
        success: false,
        error: 'User created, but invitation email could not be delivered.',
        details: emailSendResult.error,
        user: userDoc,
        inviteLink: setupLink,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Invitation sent successfully to ${cleanEmail}`,
      user: userDoc,
      inviteLink: setupLink,
    });
  } catch (error: any) {
    console.error('[UsersRouter] POST /invite error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/resend-invite — Resend invitation email for pending/sent/failed users
usersRouter.post('/resend-invite', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uid, email } = req.body;
    if (!uid && !email) {
      return res.status(400).json({ success: false, error: 'User UID or email is required.' });
    }

    const now = new Date().toISOString();
    let targetUid = uid;
    let targetEmail = email;
    let targetName = 'Admin User';
    let targetRole = 'Editor';

    // Fetch existing user profile from Firestore if available
    if (db && targetUid) {
      const docSnap = await db.collection('users').doc(targetUid).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        targetEmail = data?.email || targetEmail;
        targetName = data?.displayName || targetName;
        targetRole = data?.role || targetRole;
      }
    }

    if (!targetEmail) {
      return res.status(400).json({ success: false, error: 'Target email address not found.' });
    }

    const cleanEmail = targetEmail.trim().toLowerCase();
    let setupLink: string | null = null;

    if (adminAuth) {
      let fbUser = null;
      try {
        fbUser = await adminAuth.getUserByEmail(cleanEmail);
        targetUid = fbUser.uid;
      } catch (e: any) {
        return res.status(404).json({ success: false, error: `Firebase Auth user ${cleanEmail} not found.` });
      }

      try {
        setupLink = await adminAuth.generatePasswordResetLink(cleanEmail, getActionCodeSettings());
      } catch (linkErr: any) {
        setupLink = await adminAuth.generatePasswordResetLink(cleanEmail);
      }
    } else {
      setupLink = `${process.env.APP_PUBLIC_URL || 'https://pratheeshclement-cmd.github.io/admin/'}?setup=${targetUid}`;
    }

    // Deliver email via Nodemailer SMTP
    const emailSendResult = await SMTPIntegrationService.sendEmail({
      to: cleanEmail,
      subject: "You're invited to Pratheesh Control Center",
      text: `Hi ${targetName},\n\nYou have been invited to join Pratheesh Control Center.\n\nRole: ${targetRole}\n\nSet up your account: ${setupLink}\n\nEmail: ${cleanEmail}\nRole: ${targetRole}\n\nThis invitation was sent from Pratheesh Control Center.`,
      html: renderInvitationHtml(targetName, cleanEmail, targetRole, setupLink),
    });

    const isEmailSent = emailSendResult.success;
    const invitationStatus = isEmailSent ? 'sent' : 'failed';

    if (db && targetUid) {
      await db.collection('users').doc(targetUid).update({
        invitationStatus,
        lastInvitationSentAt: isEmailSent ? now : null,
        updatedAt: now,
      });
    }

    if (!isEmailSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to deliver invitation email via SMTP.',
        details: emailSendResult.error,
        inviteLink: setupLink,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Invitation resent successfully to ${cleanEmail}`,
      inviteLink: setupLink,
    });
  } catch (error: any) {
    console.error('[UsersRouter] POST /resend-invite error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/update-role — Update user role in Firestore & Firebase Auth custom claims
usersRouter.post('/update-role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uid, role } = req.body;
    if (!uid || !role) {
      return res.status(400).json({ success: false, error: 'User UID and role are required.' });
    }

    const canonicalRole = normalizeRole(role);

    // Security Guard: Only an Owner can assign the Owner role
    if (canonicalRole === 'Owner' && req.user?.role !== 'Owner') {
      return res.status(403).json({ success: false, error: 'Forbidden. Only an Owner can delegate the Owner role.' });
    }

    // Security Guard: User cannot modify their own role
    if (uid === req.user?.uid && canonicalRole !== req.user?.role) {
      return res.status(403).json({ success: false, error: 'Forbidden. Self-role modification is not permitted.' });
    }

    if (db) {
      await db.collection('users').doc(uid).update({
        role: canonicalRole,
        updatedAt: new Date().toISOString(),
      });
    }

    if (adminAuth) {
      try {
        await adminAuth.setCustomUserClaims(uid, { role: canonicalRole });
      } catch (e: any) {
        console.warn('[UsersRouter] Custom claims update warning:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Role for user ${uid} updated to ${canonicalRole}.`,
    });
  } catch (error: any) {
    console.error('[UsersRouter] POST /update-role error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// POST /api/users/suspend — Suspend or activate user in Firebase Auth & Firestore
usersRouter.post('/suspend', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uid, status } = req.body;
    if (!uid || !status || (status !== 'active' && status !== 'suspended')) {
      return res.status(400).json({ success: false, error: 'Valid UID and status (active|suspended) are required.' });
    }

    const isSuspended = status === 'suspended';

    if (adminAuth) {
      try {
        await adminAuth.updateUser(uid, { disabled: isSuspended });
      } catch (e: any) {
        console.warn('[UsersRouter] Firebase Auth updateUser status warning:', e.message);
      }
    }

    if (db) {
      await db.collection('users').doc(uid).update({
        status,
        updatedAt: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${uid} status updated to ${status}.`,
    });
  } catch (error: any) {
    console.error('[UsersRouter] POST /suspend error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/users/reset-password — Generate password reset link via Firebase Admin SDK
usersRouter.post('/reset-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'User email address is required.' });
    }

    let resetLink: string | null = null;
    if (adminAuth) {
      try {
        resetLink = await adminAuth.generatePasswordResetLink(email.trim(), getActionCodeSettings());
      } catch (e: any) {
        resetLink = await adminAuth.generatePasswordResetLink(email.trim());
      }
    }

    return res.status(200).json({
      success: true,
      message: `Password reset request processed for ${email}.`,
      resetLink,
    });
  } catch (error: any) {
    console.error('[UsersRouter] POST /reset-password error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:uid — Delete user from Firebase Auth & Firestore
usersRouter.delete('/:uid', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID parameter is required.' });
    }

    if (adminAuth) {
      try {
        await adminAuth.deleteUser(uid);
      } catch (e: any) {
        console.warn('[UsersRouter] Firebase Auth deleteUser warning:', e.message);
      }
    }

    if (db) {
      await db.collection('users').doc(uid).delete();
    }

    return res.status(200).json({
      success: true,
      message: `User ${uid} deleted successfully.`,
    });
  } catch (error: any) {
    console.error('[UsersRouter] DELETE /:uid error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

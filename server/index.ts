// ─── DMOS Enterprise Express Server Entry Point ───────────────────────────

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './auth/auth.routes';
import { aiRouter } from './routes/ai';
import { createRateLimiter } from './middleware/rateLimiter';
import { requireAdminAuth } from './middleware/auth';
import { blogRouter } from './routes/blog';
import { crmRouter } from './routes/crm';
import { analyticsRouter } from './routes/analytics';
import { seoRouter } from './routes/seo';
import { githubRouter } from './routes/github';
import { cloudflareRouter } from './routes/cloudflare';
import { automationRouter } from './routes/automation';
import { mediaRouter } from './routes/media';
import { reportsRouter } from './routes/reports';
import { systemRouter } from './routes/system';
import { marketingRouter } from './routes/marketing';
import { contentStudioRouter } from './routes/content_studio';
import { usersRouter } from './routes/users';
import { settingsRouter } from './routes/settings';
import { dashboardRouter } from './routes/dashboard';
import { profileRouter } from './routes/profile';
import { projectsRouter } from './routes/projects';
import { notificationsRouter } from './routes/notifications';
import { connectionsRouter } from './routes/connections';
import { clarityRouter } from './routes/clarity';
import { searchConsoleRouter } from './routes/searchConsole';
import { firebaseRouter } from './routes/firebase';
import { metaRouter } from './routes/meta';
import { smtpRouter } from './routes/smtp';
import { mapsRouter } from './routes/maps';
import { pageSpeedRouter } from './routes/pageSpeed';
import { googleAdsRouter } from './routes/googleAds';
import { googleBusinessRouter } from './routes/googleBusiness';
import { microsoftAdsRouter } from './routes/microsoftAds';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://pratheeshclement-cmd.github.io',
];

const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 12,
  message: 'Too many authentication requests. Please wait a minute and try again.',
});

const publicAiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 8,
  message: 'Too many AI requests. Please slow down and try again shortly.',
});

const publicWriteLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 6,
  message: 'Too many write requests. Please wait a minute and try again.',
});

const publicReadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests. Please wait a moment and try again.',
});

const adminRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many admin requests. Please slow down and try again shortly.',
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

app.use(['/auth/google', '/api/auth/google'], authRateLimiter);
app.use(['/auth/google/verify-token', '/api/auth/google/verify-token'], authRateLimiter);
app.use('/api/ai/concierge', publicAiLimiter);
app.use('/api/ai/generate-blog', publicAiLimiter);
app.use('/api/ai/generate', publicAiLimiter);
app.use('/api/crm/contact-submit', publicWriteLimiter);
app.use('/api/blog/publish-pipeline', publicWriteLimiter);
app.use('/api/analytics/kpis', publicReadLimiter);
app.use('/api/seo/pagespeed', publicReadLimiter);
app.use('/api/admin', adminRateLimiter);

// Health Endpoint
app.get('/api/health', (req, res) => {
  const startTime = performance.now();
  const serverTime = new Date().toISOString();
  const latencyMs = Math.max(1, Math.round(performance.now() - startTime));

  res.json({
    status: 'healthy',
    gateway: 'operational',
    serverTime,
    latencyMs,
    uptimeSeconds: Math.round(process.uptime()),
    version: '2.4.0-enterprise',
  });
});

// Mount Google OAuth & Auth Routes
app.use('/auth', authRouter);
app.use('/api/auth', authRouter);

// Mount Application Routes
app.use('/api/ai', aiRouter);
app.use('/api/admin/gemini', requireAdminAuth, aiRouter);
app.use('/api/blog', blogRouter);
app.use('/api/crm', crmRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin/analytics', analyticsRouter);
app.use('/api/clarity', clarityRouter);
app.use('/api/admin/clarity', clarityRouter);
app.use('/api/seo', seoRouter);
app.use('/api/admin/search-console', searchConsoleRouter);
app.use('/api/admin/firebase', firebaseRouter);
app.use('/api/admin/meta', metaRouter);
app.use('/api/github', githubRouter);
app.use('/api/admin/github', githubRouter);
app.use('/api/cloudflare', cloudflareRouter);
app.use('/api/admin/cloudflare', cloudflareRouter);
app.use('/api/admin/smtp', smtpRouter);
app.use('/api/admin/google-maps', mapsRouter);
app.use('/api/admin/pagespeed', pageSpeedRouter);
app.use('/api/admin/google-ads', googleAdsRouter);
app.use('/api/admin/google-business', googleBusinessRouter);
app.use('/api/admin/microsoft-ads', microsoftAdsRouter);
app.use('/api/microsoft-ads', microsoftAdsRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/admin/connections', connectionsRouter);
app.use('/api/automation', automationRouter);
app.use('/api/media', mediaRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/system', systemRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/content-studio', contentStudioRouter);
app.use('/api/admin/users', usersRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/notifications', notificationsRouter);

// Global Error Handling & Error Sanitization Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[DMOS Error Handler]', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'An error occurred processing your request.',
  });
});

app.listen(PORT, () => {
  console.log(`[DMOS Enterprise Server] Running on http://localhost:${PORT}`);
});


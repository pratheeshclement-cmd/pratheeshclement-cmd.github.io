// ─── DMOS Enterprise Express Server Entry Point ───────────────────────────

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './auth/auth.routes';
import { aiRouter } from './routes/ai';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://pratheeshclement-cmd.github.io'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    gateway: 'operational',
    serverTime: new Date().toISOString(),
    version: '2.4.0-enterprise',
  });
});

// Mount Google OAuth & Auth Routes
app.use('/auth', authRouter);
app.use('/api/auth', authRouter);

// Mount Application Routes
app.use('/api/ai', aiRouter);
app.use('/api/blog', blogRouter);
app.use('/api/crm', crmRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/seo', seoRouter);
app.use('/api/github', githubRouter);
app.use('/api/cloudflare', cloudflareRouter);
app.use('/api/automation', automationRouter);
app.use('/api/media', mediaRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/system', systemRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/content-studio', contentStudioRouter);
app.use('/api/users', usersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/connections', connectionsRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[DMOS Backend Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[DMOS Enterprise Server] Running on http://localhost:${PORT}`);
});

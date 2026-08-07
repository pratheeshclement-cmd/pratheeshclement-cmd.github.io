// ─── DMOS Projects Express Router ────────────────────────────────────────────

import { Router, Request, Response } from 'express';

export const projectsRouter = Router();

let PROJECTS_STORE: any[] = [];

// GET /api/projects
projectsRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, projects: PROJECTS_STORE });
});

// POST /api/projects
projectsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, client, category, technologies, featured } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Project title is required' });
    }

    const newProj = {
      id: `proj_${Date.now()}`,
      title,
      description: description || '',
      client: client || '',
      category: category || 'Web Development',
      technologies: Array.isArray(technologies) ? technologies : ['React', 'TypeScript'],
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    PROJECTS_STORE.unshift(newProj);
    res.status(201).json({ success: true, project: newProj });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/projects/:id
projectsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  PROJECTS_STORE = PROJECTS_STORE.filter(p => p.id !== id);
  res.json({ success: true, message: 'Project deleted successfully' });
});

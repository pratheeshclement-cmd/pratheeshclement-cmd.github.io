// ─── DMOS Centralized RBAC & Permission Architecture ──────────────────────────
// Secure server-side permission evaluation.
// Owner receives full root access (*). Frontend role is UX only; backend strictly enforces permissions.

export type UserRole =
  | 'Owner'
  | 'Administrator'
  | 'Editor'
  | 'SEO Manager'
  | 'Marketing'
  | 'CRM Executive'
  | 'Content Writer'
  | 'Viewer';

export type Permission =
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.read'
  | 'roles.assign'
  | 'billing.read'
  | 'billing.manage'
  | 'settings.read'
  | 'settings.manage'
  | 'analytics.read'
  | 'analytics.manage'
  | 'seo.read'
  | 'seo.manage'
  | 'cms.read'
  | 'cms.manage'
  | 'content.read'
  | 'content.manage'
  | 'blog.read'
  | 'blog.manage'
  | 'crm.read'
  | 'crm.manage'
  | 'ai.read'
  | 'ai.manage'
  | 'reports.read'
  | 'reports.manage'
  | 'connections.read'
  | 'connections.manage'
  | 'dashboard.read'
  | 'dashboard.manage';

// Role Normalization Layer: maps any raw input string to canonical UserRole
export function normalizeRole(rawRole?: string | null): UserRole {
  if (!rawRole) return 'Viewer';
  const clean = rawRole.trim().toLowerCase();

  switch (clean) {
    case 'owner':
    case 'superadmin':
    case 'root':
      return 'Owner';

    case 'administrator':
    case 'admin':
      return 'Administrator';

    case 'editor':
      return 'Editor';

    case 'seo manager':
    case 'seo_manager':
    case 'seomanager':
    case 'seo':
      return 'SEO Manager';

    case 'marketing':
    case 'marketing_manager':
      return 'Marketing';

    case 'crm executive':
    case 'crm_executive':
    case 'crmexecutive':
    case 'crm':
      return 'CRM Executive';

    case 'content writer':
    case 'content_writer':
    case 'contentwriter':
    case 'writer':
      return 'Content Writer';

    case 'viewer':
    case 'guest':
    case 'user':
    default:
      return 'Viewer';
  }
}

// Role-to-Permissions Matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Owner: [
    'users.read', 'users.create', 'users.update', 'users.delete',
    'roles.read', 'roles.assign',
    'billing.read', 'billing.manage',
    'settings.read', 'settings.manage',
    'analytics.read', 'analytics.manage',
    'seo.read', 'seo.manage',
    'cms.read', 'cms.manage',
    'content.read', 'content.manage',
    'blog.read', 'blog.manage',
    'crm.read', 'crm.manage',
    'ai.read', 'ai.manage',
    'reports.read', 'reports.manage',
    'connections.read', 'connections.manage',
    'dashboard.read', 'dashboard.manage',
  ],

  Administrator: [
    'users.read', 'users.create', 'users.update',
    'roles.read', 'roles.assign',
    'settings.read', 'settings.manage',
    'analytics.read', 'analytics.manage',
    'seo.read', 'seo.manage',
    'cms.read', 'cms.manage',
    'content.read', 'content.manage',
    'blog.read', 'blog.manage',
    'crm.read', 'crm.manage',
    'ai.read', 'ai.manage',
    'reports.read', 'reports.manage',
    'connections.read', 'connections.manage',
    'dashboard.read', 'dashboard.manage',
  ],

  Editor: [
    'cms.read', 'cms.manage',
    'content.read', 'content.manage',
    'blog.read', 'blog.manage',
    'analytics.read',
    'dashboard.read',
  ],

  'SEO Manager': [
    'seo.read', 'seo.manage',
    'analytics.read',
    'content.read',
    'blog.read',
    'dashboard.read',
  ],

  Marketing: [
    'analytics.read',
    'crm.read', 'crm.manage',
    'content.read',
    'dashboard.read',
  ],

  'CRM Executive': [
    'crm.read', 'crm.manage',
    'dashboard.read',
  ],

  'Content Writer': [
    'content.read', 'content.manage',
    'blog.read', 'blog.manage',
    'dashboard.read',
  ],

  Viewer: [
    'dashboard.read',
    'analytics.read',
  ],
};

// Check if a resolved canonical role has a specific permission
export function hasPermission(role: string, permission: Permission): boolean {
  const canonicalRole = normalizeRole(role);
  if (canonicalRole === 'Owner') return true; // Owner receives full root access
  const permissions = ROLE_PERMISSIONS[canonicalRole] || [];
  return permissions.includes(permission);
}

// Check if a resolved canonical role is at least Admin level (Owner or Administrator)
export function isAdminLevel(role?: string): boolean {
  const canonicalRole = normalizeRole(role);
  return canonicalRole === 'Owner' || canonicalRole === 'Administrator';
}

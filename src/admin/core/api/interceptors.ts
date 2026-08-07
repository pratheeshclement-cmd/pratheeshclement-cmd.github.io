// ─── DMOS API Gateway: Interceptors ──────────────────────────────────────

export interface RequestInterceptorContext {
  url: string;
  headers: Record<string, string>;
  provider: string;
}

export function applyRequestInterceptors(context: RequestInterceptorContext): RequestInterceptorContext {
  const activeWorkspace = localStorage.getItem('dmos_active_workspace_id') || 'portfolio';
  
  return {
    ...context,
    headers: {
      'Content-Type': 'application/json',
      'X-DMOS-Workspace': activeWorkspace,
      'X-DMOS-Client-Version': '2.4.0-enterprise',
      ...context.headers,
    },
  };
}

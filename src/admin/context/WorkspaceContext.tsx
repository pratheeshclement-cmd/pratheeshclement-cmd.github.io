import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Workspace {
  id: string;
  name: string;
  domain: string;
  type: 'portfolio' | 'company' | 'client_ecommerce' | 'client_saas';
  avatar: string;
  badgeColor: string;
  connectedApisCount: number;
}

export const WORKSPACES: Workspace[] = [
  { id: 'portfolio', name: 'Pratheesh Portfolio (Main)', domain: 'pratheeshclement-cmd.github.io', type: 'portfolio', avatar: 'P', badgeColor: '#2E5AFF', connectedApisCount: 11 },
  { id: 'jbhl', name: 'JBHL Pvt Ltd', domain: 'jbhl.in', type: 'company', avatar: 'J', badgeColor: '#17B4CE', connectedApisCount: 6 },
  { id: 'client_a', name: 'Client A — E-Commerce', domain: 'shopbrand.com', type: 'client_ecommerce', avatar: 'A', badgeColor: '#22C55E', connectedApisCount: 4 },
  { id: 'client_b', name: 'Client B — Tech SaaS', domain: 'saasplatform.io', type: 'client_saas', avatar: 'B', badgeColor: '#A78BFA', connectedApisCount: 8 },
];

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  setWorkspaceId: (id: string) => void;
  allWorkspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const WORKSPACE_STORAGE_KEY = 'dmos_active_workspace_id';

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem(WORKSPACE_STORAGE_KEY) || 'portfolio';
  });

  const setWorkspaceId = (id: string) => {
    setActiveId(id);
    localStorage.setItem(WORKSPACE_STORAGE_KEY, id);
  };

  const currentWorkspace = WORKSPACES.find(w => w.id === activeId) || WORKSPACES[0];

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setWorkspaceId, allWorkspaces: WORKSPACES }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return ctx;
};

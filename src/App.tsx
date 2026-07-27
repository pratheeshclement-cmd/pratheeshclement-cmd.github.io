import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { WORKSPACES } from './data/pratheeshData';
import { WorkspaceId, SystemSettings } from './types';
import { BootScreen } from './components/BootScreen';
import { OSHeaderBar } from './components/OSHeaderBar';
import { OSDock } from './components/OSDock';
import { RecruiterBar } from './components/RecruiterBar';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Workspaces
import { WelcomeWorkspace } from './components/workspaces/WelcomeWorkspace';
import { AIConcierge } from './components/AIConcierge';
import { CreativeTechWorkspace } from './components/workspaces/CreativeTechWorkspace';
import { DesignStudioWorkspace } from './components/workspaces/DesignStudioWorkspace';
import { FrontendLabWorkspace } from './components/workspaces/FrontendLabWorkspace';
import { PerformanceCenterWorkspace } from './components/workspaces/PerformanceCenterWorkspace';
import { SEOCenterWorkspace } from './components/workspaces/SEOCenterWorkspace';
import { DigitalMarketingWorkspace } from './components/workspaces/DigitalMarketingWorkspace';
import { ProjectVaultWorkspace } from './components/workspaces/ProjectVaultWorkspace';
import { KnowledgeHubWorkspace } from './components/workspaces/KnowledgeHubWorkspace';
import { PlaygroundWorkspace } from './components/workspaces/PlaygroundWorkspace';
import { TimelineWorkspace } from './components/workspaces/TimelineWorkspace';
import { CommunicationWorkspace } from './components/workspaces/CommunicationWorkspace';
import { ContactWorkspace } from './components/workspaces/ContactWorkspace';
import { SettingsWorkspace } from './components/workspaces/SettingsWorkspace';

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>('welcome');
  const [recruiterBarOpen, setRecruiterBarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    reducedMotion: false,
    soundMuted: false,
    highContrast: false,
    glowIntensity: 'medium'
  });

  const viewportRef = useRef<HTMLDivElement>(null);
  const activeWorkspace = WORKSPACES.find(w => w.id === activeWorkspaceId) || WORKSPACES[0];

  useEffect(() => {
    if (!isBooting && viewportRef.current && !systemSettings.reducedMotion) {
      viewportRef.current.scrollTop = 0;
      anime({
        targets: viewportRef.current,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 350,
        easing: 'cubicBezier(0.25, 1, 0.5, 1)'
      });
    }
  }, [activeWorkspaceId, isBooting, systemSettings.reducedMotion]);

  const handleBootComplete = () => {
    setIsBooting(false);
  };

  const handleSelectWorkspace = (id: WorkspaceId) => {
    setActiveWorkspaceId(id);
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
  };

  const renderActiveWorkspace = () => {
    switch (activeWorkspaceId) {
      case 'welcome':
        return <WelcomeWorkspace onNavigate={handleSelectWorkspace} />;
      case 'ai-concierge':
        return <AIConcierge />;
      case 'creative-tech':
        return <CreativeTechWorkspace />;
      case 'design-studio':
        return <DesignStudioWorkspace />;
      case 'frontend-lab':
        return <FrontendLabWorkspace />;
      case 'performance-center':
        return <PerformanceCenterWorkspace />;
      case 'seo-center':
        return <SEOCenterWorkspace />;
      case 'digital-marketing':
        return <DigitalMarketingWorkspace />;
      case 'project-vault':
        return <ProjectVaultWorkspace />;
      case 'knowledge-hub':
        return <KnowledgeHubWorkspace />;
      case 'playground':
        return <PlaygroundWorkspace />;
      case 'timeline':
        return <TimelineWorkspace />;
      case 'communication':
        return <CommunicationWorkspace />;
      case 'contact':
        return <ContactWorkspace />;
      case 'settings':
        return <SettingsWorkspace settings={systemSettings} onUpdateSettings={handleUpdateSettings} />;
      default:
        return <WelcomeWorkspace onNavigate={handleSelectWorkspace} />;
    }
  };

  if (isBooting) {
    return <BootScreen onBootComplete={handleBootComplete} />;
  }

  return (
    <div className={`os-container ${systemSettings.highContrast ? 'high-contrast-mode' : ''}`}>
      {/* Ambient Background */}
      <div className="ambient-background" style={{ opacity: systemSettings.glowIntensity === 'low' ? 0.15 : 0.35 }}>
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* Spatial Grid */}
      <div className="spatial-grid" />

      {/* Top Header Bar */}
      <OSHeaderBar
        activeWorkspace={activeWorkspace}
        onToggleRecruiterBar={() => setRecruiterBarOpen(!recruiterBarOpen)}
        recruiterBarOpen={recruiterBarOpen}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigate={handleSelectWorkspace}
      />

      {/* Recruiter Summary Banner */}
      {recruiterBarOpen && (
        <RecruiterBar
          onClose={() => setRecruiterBarOpen(false)}
          onNavigate={(id) => {
            setRecruiterBarOpen(false);
            handleSelectWorkspace(id);
          }}
        />
      )}

      {/* Active Workspace Viewport */}
      <main ref={viewportRef} className="os-viewport">
        {renderActiveWorkspace()}
      </main>

      {/* Bottom HarmonyOS Dock */}
      <OSDock
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSelectWorkspace}
      />
    </div>
  );
};

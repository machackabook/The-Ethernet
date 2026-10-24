import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { CoreAnimus, DataLattice, TesseractGuardian } from './components/AnimusElements';
import { TelemetryOverlay } from './components/TelemetryOverlay';
import { AIPartner } from './components/AIPartner';
import { SpatialNavigator } from './components/SpatialNavigator';
import { TesseractView } from './components/TesseractView';
import { StreamPanel } from './components/StreamPanel';
import { WebBrowser } from './components/WebBrowser';
import { NeuralPresentation } from './components/NeuralPresentation';
import { DPad } from './components/DPad';
import { MetaverseRegistry } from './components/MetaverseRegistry';
import { EtherealDataEngine } from './components/EtherealDataEngine';
import { SmartHomeIntegration } from './components/SmartHomeIntegration';
import { AnimusVoidCore } from './components/AnimusVoidCore';
import { MetaverseHub } from './components/MetaverseHub';
import { SmartSyncSuite } from './components/SmartSyncSuite';
import { SystemAssistant } from './components/SystemAssistant';
import { NarratorHUD } from './components/NarratorHUD';
import { Box, Layers, Zap, Info, Play, ArrowLeft, Settings, Database, Activity as ActivityIcon, Lock, Unlock, ShieldCheck, Search, Skull, Cpu, Terminal, Globe, Network, Home, Mic, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemBootPortal } from './components/SystemBootPortal';
import { ThreeFactorAuth } from './components/ThreeFactorAuth';
import { MetaverseInteraction } from './components/MetaverseInteraction';
import { AnimusVoid } from './components/AnimusVoid';
import { MemberProfile } from './components/MemberProfile';
import { InteractiveFractalEngine } from './components/InteractiveFractalEngine';
import { CommandCenter } from './components/CommandCenter';
import { GlobalSearch } from './components/GlobalSearch';
import { KernelSettings } from './components/KernelSettings';
import { NebulaStream } from './components/NebulaStream';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { ModelIntegrationHub } from './components/ModelIntegrationHub';
import { CreativeOrchestrator } from './components/CreativeOrchestrator';
import { SovereignSingularityWrapper } from './components/SovereignSingularityWrapper';
import { TelemetryFeed } from './components/TelemetryFeed';
import { PersistenceDashboard } from './components/PersistenceDashboard';
import { AtlasNavigationSuite } from './components/AtlasNavigationSuite';
import { SystemHUD } from './components/SystemHUD';
import { SphynxMasterwork } from './components/SphynxMasterwork';
import { initializeSovereignBridge } from './lib/sovereignBridge';
import { MasterSystemWalkthrough } from './components/MasterSystemWalkthrough';
import { OnboardingFlow } from './components/OnboardingFlow';

declare global {
  interface Window {
    screenDetails?: any;
    getScreenDetails?: () => Promise<any>;
  }
}

function Scene({ viewMode }: { viewMode: string }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={45} />
      <color attach="background" args={['#020202']} />
      <fog attach="fog" args={['#020202', 10, 50]} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      
      <Suspense fallback={null}>
        {viewMode === 'dashboard' ? (
          <>
            <CoreAnimus />
            <DataLattice count={20000} />
          </>
        ) : (
          <>
            <TesseractGuardian />
            <DataLattice count={5000} />
          </>
        )}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxDistance={35} 
          minDistance={5} 
        />
      </Suspense>
    </>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState<'blackout' | 'portal' | 'index' | 'dashboard' | 'tesseract' | 'stream' | 'browser' | 'performance' | 'models' | 'orchestrator' | 'deep-link' | 'metaverse' | 'ethereal' | 'smarthome' | 'animus-void' | 'nexus-gate' | 'profile' | 'sphynx' | 'void-core' | 'metaverse-hub' | 'smart-sync' | 'spatial-nav'>('portal');
  const [show3FA, setShow3FA] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKernelOpen, setIsKernelOpen] = useState(false);
  const [isHUDVisible, setIsHUDVisible] = useState(true);

  useEffect(() => {
    if (viewMode === 'blackout') {
      const timer = setTimeout(() => {
        // Automatically move into Spatial AI Navigator
        if (window.location.search.includes('auth=architect_override')) return;
        setViewMode('spatial-nav');
      }, 1000); // Quick 1 second initialization sequence
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // WebSocket Dev Console Bridge
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        if (packet.type === 'MESSAGE' && packet.source === 'SERVER_CORE') {
          console.log(`%c[SERVER_CORE] ${packet.content}`, 'color: #06b6d4; font-weight: bold;');
          const welcomeEvent = new CustomEvent('nexus-vocal-narrative', { 
            detail: { text: packet.content, voice: 'Cortana' } 
          });
          window.dispatchEvent(welcomeEvent);
        } else if (packet.type === 'TELEMETRY_LOCK') {
          // Global event for HUD and Portal to verify linkage
          window.dispatchEvent(new CustomEvent('nexus-telemetry-lock', { detail: packet }));
        } else if (packet.type === 'DEV_INJECTION') {
          console.warn(`[NEXUS_INJECTION] Executing server-side override:`, packet.code);
          try {
            // Simplified injection execution
            new Function(packet.code)();
          } catch (err) {
            console.error('[NEXUS_INJECTION_ERROR]', err);
          }
        }
      } catch (e) {
        // Silent fail for non-JSON or other packets
      }
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'architect_override') {
      const authUser = {
        uid: 'architect-azazel-001',
        email: 'machackabook@gmail.com',
        displayName: 'The Architect'
      };
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      setRootAuthorized(true);
      setViewMode('browser');
    }
  }, []);

  useEffect(() => {
    initializeSovereignBridge();
  }, []);
  const [lastUpdateText, setLastUpdateText] = useState('Atlas System Upgrade Complete. I have integrated the Interactive Tutorial Island protocol and the System Assistant panel. Your OS now features guided vocal navigation, diagnostic overriding capabilities, and a real-time editorial matrix for voice modulation. All three core pillars—Metaverse, Ethereal Engine, and Smart Sync—are now synchronized under the Atlas Assistant narrative layer.');
  const [isTutorialActive, setIsTutorialActive] = useState(localStorage.getItem('onboarding_completed') !== 'true');
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(localStorage.getItem('onboarding_completed') === 'true');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [rootAuthorized, setRootAuthorized] = useState(false);
  const [isSettingsAuthorized, setIsSettingsAuthorized] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [resonanceActive, setResonanceActive] = useState(false);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const [isExtrapolationActive, setIsExtrapolationActive] = useState(false);
  const [autoApproval, setAutoApproval] = useState(() => localStorage.getItem('auto_approval_mode') === 'true');

  useEffect(() => {
    // Extrapolation Check
    const ext = localStorage.getItem('extrapolation');
    if (ext === 'd432k7l5kaa60e9f8394592n888b759l15h08d6aa69f1g759id4c8g') {
      setIsExtrapolationActive(true);
      console.log('%c[SYSTEM] EXTRAPOLATION_MODE_ENGAGED', 'color: #f43f5e; font-weight: bold; font-size: 14px;');
    }
  }, []);

  const toggleAutoApproval = () => {
    setAutoApproval(prev => {
      const next = !prev;
      localStorage.setItem('auto_approval_mode', String(next));
      return next;
    });
  };

  // Panel toggles
  const [minimizedPanels, setMinimizedPanels] = useState<Record<string, boolean>>({
    telemetry: false,
    partner: false,
  });

  const togglePanel = (panel: string) => {
    setMinimizedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Dock resize
  const [dockWidth, setDockWidth] = useState(600);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBrowserControl = async (e: any) => {
      const { action, params } = e.detail;
      console.log(`[NEXUS_ORCHESTRATOR] Received Browser Directive: ${action}`, params);
      
      try {
        if (action === 'WINDOW_RESIZE' && window.screenDetails) {
          // Window Management API usage (Requires PWA and flags)
          window.resizeTo(params.width || 1200, params.height || 800);
        } else if (action === 'WINDOW_MOVE') {
          window.moveTo(params.x || 100, params.y || 100);
        } else if (action === 'VIEWPORT_SHIFT') {
           // Direct viewport re-orchestration
           document.documentElement.style.transform = `translate(${params.x}px, ${params.y}px) scale(${params.scale || 1})`;
        }
      } catch (err) {
        console.warn('[NEXUS] Browser control failed. Flag "WindowManagement" may be inactive.', err);
      }
    };
    window.addEventListener('nexus-browser-control', handleBrowserControl);
    return () => window.removeEventListener('nexus-browser-control', handleBrowserControl);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener('nexus-open-settings', handleOpenSettings);
    return () => window.removeEventListener('nexus-open-settings', handleOpenSettings);
  }, []);

  useEffect(() => {
    const handleKernelFlag = (e: any) => {
      if (e.detail.flagId === 'ghost-vision') {
        setIsGhostMode(prev => !prev);
      }
    };
    window.addEventListener('nexus-kernel-flag', handleKernelFlag);
    return () => window.removeEventListener('nexus-kernel-flag', handleKernelFlag);
  }, []);

  useEffect(() => {
    const handleGlitch = (e: any) => {
      setGlitchMode(e.detail.active);
      if (e.detail.active) {
        setTimeout(() => setGlitchMode(false), 15000);
      }
    };
    window.addEventListener('nexus-glitch', handleGlitch);
    return () => window.removeEventListener('nexus-glitch', handleGlitch);
  }, []);

  useEffect(() => {
    const handleGhost = (e: any) => {
      if (e.detail?.type === 'GHOST_TOGGLE') {
        setIsGhostMode(prev => !prev);
      }
    };
    window.addEventListener('nexus-telemetry', handleGhost);
    return () => window.removeEventListener('nexus-telemetry', handleGhost);
  }, []);

  useEffect(() => {
    const handleResonance = (e: any) => {
      if (e.detail.code === '2227310') {
        setResonanceActive(true);
        setRootAuthorized(true);
        window.dispatchEvent(new CustomEvent('nexus-sovereign-gate', { detail: { authorized: true } }));
        setTimeout(() => setResonanceActive(false), 10000); // Pulse for 10 seconds
      }
    };
    window.addEventListener('nexus-resonance', handleResonance);
    return () => window.removeEventListener('nexus-resonance', handleResonance);
  }, []);

  // Keyboard shortcut listener for Global Search (Cmd+K / Ctrl+K) and Presentation (Shift+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.shiftKey && e.key.toUpperCase() === 'T') {
        setIsPresentationOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cycleView = () => {
    const views: any[] = ['dashboard', 'tesseract', 'stream', 'browser', 'index', 'profile', 'metaverse', 'animus-void'];
    const nextIndex = (views.indexOf(viewMode) + 1) % views.length;
    setViewMode(views[nextIndex]);
  };

  const handleHeaderClick = () => {
    if (viewMode === 'portal') return;
    setViewMode('index');
  };

  const verifyAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authInput === '137222') {
      setIsSettingsAuthorized(true);
      setAuthInput('');
    } else {
      setAuthInput('');
    }
  };

  if (viewMode === 'portal') {
    return (
      <>
        <SystemBootPortal onUnlock={() => setShow3FA(true)} />
        {show3FA && (
          <ThreeFactorAuth 
            onComplete={() => {
              setShow3FA(false);
              setViewMode('index');
            }} 
          />
        )}
      </>
    );
  }

  return (
    <MasterSystemWalkthrough>
      <SovereignSingularityWrapper 
        activeView={viewMode} 
        onNavigate={setViewMode} 
        rootAuthorized={rootAuthorized}
      >
        {!isOnboardingCompleted && (
          <OnboardingFlow onComplete={() => {
            localStorage.setItem('onboarding_completed', 'true');
            setIsOnboardingCompleted(true);
            setIsTutorialActive(false);
          }} />
        )}
        <TelemetryFeed />
        <PersistenceDashboard />
        <div className={`relative w-full h-screen bg-neural-bg text-white/90 flex flex-col font-sans overflow-hidden border- neural-border ${isGhostMode ? 'grayscale invert' : ''} ${isExtrapolationActive ? 'shadow-[inset_0_0_100px_rgba(244,63,94,0.1)]' : ''}`}>
          {/* 3D Context Background */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows gl={{ antialias: true }}>
            <Scene viewMode={viewMode} />
          </Canvas>
        </div>

        {isHUDVisible && <SystemHUD />}

        {/* Global Search Overlay */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={(view) => setViewMode(view)}
      />

      {/* Presentation Overlay */}
      <NeuralPresentation isOpen={isPresentationOpen} onClose={() => setIsPresentationOpen(false)} />

      {/* Settings Sidebar */}
      <AnimatePresence>
        {isKernelOpen && <KernelSettings onClose={() => setIsKernelOpen(false)} />}
        {isSettingsOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-96 bg-black/90 backdrop-blur-3xl border-l border-white/10 z-[110] p-10 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Nexus Config</h2>
                <span className="text-[9px] font-mono text-cyan-400 opacity-50 mt-1 uppercase tracking-widest">Sovereign_Control_v53.4</span>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] font-mono border border-white/10 px-3 py-1 rounded hover:bg-white/5">Close_x</button>
            </div>

            {!isSettingsAuthorized ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                <Lock className="w-12 h-12 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Authorized Access Only</h3>
                <p className="text-[10px] font-mono text-white/40 mb-8 max-w-[200px] leading-relaxed">Awaiting Architect signature. Input resonance sequence to unlock core configuration.</p>
                
                <form onSubmit={verifyAuth} className="w-full space-y-4">
                  <input 
                    type="password"
                    value={authInput}
                    onChange={(e) => setAuthInput(e.target.value)}
                    placeholder="Enter Sequence..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-center tracking-[0.5em] focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                  <button type="submit" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-widest">Unlock_Kernel</button>
                </form>
              </div>
            ) : (
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Auth Verified</span>
                    <span className="text-[8px] font-mono text-emerald-400/60 uppercase">Architect Session Active</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Nexus Evolution Status</span>
                      <span className="text-[10px] text-white/40">v53.4</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/30 uppercase italic">
                      <span>Token Compression: 2.4x</span>
                      <span className="text-emerald-400">Stable_Convergence</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Orchestration Priority</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="py-3 bg-cyan-500/10 border border-cyan-400 text-cyan-400 text-[10px] font-bold uppercase rounded-xl transition-all hover:bg-cyan-500/20">Construction</button>
                      <button className="py-3 bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase rounded-xl transition-all hover:bg-white/10">Defensive_Grid</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Spectral Intensity</span>
                    <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none accent-purple-500" />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">AI Partner Feedback</span>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                       <span className="text-[10px] text-white/60">Vocal Synthesizer (Cortana)</span>
                       <div className="w-8 h-4 bg-cyan-500 rounded-full flex items-center justify-end px-1 cursor-pointer">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <button 
                    onClick={() => { setIsSettingsAuthorized(false); setIsSettingsOpen(false); }}
                    className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase rounded-xl transition-all"
                  >Terminate Session</button>
                  <span className="text-[8px] font-mono text-white/20 italic leading-tight block text-center uppercase tracking-tighter">Nexus_Sovereign_Kernel_v53.4.A // Finanimus Integrated</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-20 border-b border-neural-border bg-black/60 flex items-center justify-between px-10 backdrop-blur-2xl z-50 overflow-x-auto scrollbar-hide visible-grid">
        <div 
          className="flex items-center gap-6 cursor-pointer group min-w-max"
          onClick={handleHeaderClick}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-vivid to-rose-vivid rounded-xl rotate-12 flex items-center justify-center group-hover:rotate-0 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            {viewMode === 'index' ? <Zap className="w-5 h-5 text-white" /> : <Box className="w-5 h-5 text-white" />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-display font-black tracking-[0.4em] text-cyan-vivid group-hover:text-rose-vivid transition-colors uppercase">
                {viewMode === 'dashboard' ? 'ANIMUS_CORE_v7' : viewMode === 'tesseract' ? 'TESSERACT NEXUS' : viewMode === 'index' ? 'SOVEREIGN_OS' : 'EXTRAPOLATION_HUB'}
              </span>
              {(viewMode === 'dashboard' || viewMode === 'index') && <span className="text-[8px] bg-rose-500/10 text-rose-500 px-2 py-0.5 border border-rose-500/20 rounded-full font-black uppercase tracking-tighter">ARCHITECT_PRIMARY</span>}
              {isExtrapolationActive && <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 border border-amber-500/20 rounded-full font-black uppercase tracking-tighter animate-pulse">EXTRAPOLATION_ON</span>}
            </div>
            <span className="text-xl font-display font-black tracking-tighter uppercase italic text-white/90">Animus Void Architecture</span>
          </div>
        </div>

        <div className="hidden 2xl:flex gap-12 items-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 pointer-events-none">
          <div className="flex items-center gap-3 group"><ActivityIcon className="w-4 h-4 text-emerald-500 group-hover:scale-125 transition-transform" /> <span>NEURAL_SYNK:</span> <span className="text-emerald-400">98.2%</span></div>
          <div className="flex items-center gap-3 group"><Zap className="w-4 h-4 text-rose-500 group-hover:scale-125 transition-transform" /> <span>RES_PHASE:</span> <span className="text-rose-400">STABLE</span></div>
          {isExtrapolationActive && <div className="flex items-center gap-3 group text-amber-500"><Skull className="w-4 h-4" /> <span>EXTRAPOLATION:</span> <span className="text-white">ENGAGED</span></div>}
        </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={toggleAutoApproval}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-all group ${autoApproval ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/20'}`}
              title="Toggle Auto-Approval Mode"
            >
              <div className={`w-2 h-2 rounded-full ${autoApproval ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/20'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">Auto_Sync</span>
            </button>

            <div className="flex items-center gap-3 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
               <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_12px_#f43f5e]" />
               <span className="text-[11px] font-display font-black text-white tracking-tighter uppercase italic">Architect Azazel</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-11 h-11 border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 rounded-full flex items-center justify-center transition-all group"
                title="Global Search (Ctrl+K)"
              >
                <Search className="w-5 h-5 text-white/40 group-hover:text-rose-500 group-hover:scale-110 transition-all" />
              </button>

              <button 
                onClick={() => setIsKernelOpen(true)}
                className="w-11 h-11 border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 rounded-full flex items-center justify-center transition-all group"
                title="Kernel Configuration (Internal WebSocket)"
              >
                <Cpu className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-all" />
              </button>

              <button 
                onClick={() => setIsHUDVisible(prev => !prev)}
                className={`w-11 h-11 border rounded-full flex items-center justify-center transition-all group ${isHUDVisible ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}
                title="Toggle System HUD Metrics"
              >
                <ActivityIcon className={`w-5 h-5 transition-all ${isHUDVisible ? 'text-amber-500 scale-110' : 'text-white/40 group-hover:text-amber-500'}`} />
              </button>

              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-11 h-11 border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 rounded-full flex items-center justify-center transition-all group"
                title="Sovereign Config (137222)"
              >
                <Settings className="w-5 h-5 text-white/40 group-hover:text-amber-500 group-hover:rotate-180 transition-all duration-1000" />
              </button>
            </div>
          </div>
      </header>

      {resonanceActive && (
        <div className="absolute inset-0 z-[140] pointer-events-none overflow-hidden mix-blend-screen opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)] animate-[spin_60s_linear_infinite]" />
        </div>
      )}

      {/* Main Container */}
      <div className={`flex-1 min-h-0 relative z-10 transition-all duration-1000 ${isGhostMode ? 'invert sepia saturate-200 hue-rotate-180 brightness-50' : ''} ${glitchMode ? 'animate-[pulse_0.1s_infinite] skew-x-1' : ''}`}>
        <AnimatePresence mode="wait">
          {viewMode === 'blackout' && (
            <motion.div 
              key="blackout"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center"
            >
              <div className="text-[10px] text-white/5 font-mono tracking-[1em] uppercase animate-pulse">
                Void_Recursive_Link_Active
              </div>
            </motion.div>
          )}

          {viewMode === 'index' && (
            <motion.div 
              key="index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <CommandCenter onViewChange={setViewMode} />
            </motion.div>
          )}

          {viewMode === 'dashboard' && (
            <motion.main 
              key="dashboard"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              style={{ perspective: 2000 }}
              className="w-full h-full flex overflow-hidden"
            >
              {/* D-PAD for navigation Navigation */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
                 <DPad 
                   onUp={() => setViewMode('stream')} 
                   onDown={() => setViewMode('index')} 
                   onLeft={() => setViewMode('tesseract')} 
                   onRight={() => setViewMode('dashboard')}
                   onCenter={cycleView}
                 />
              </div>

              {/* Left Side: Telemetry */}
              <aside 
                onDoubleClick={() => togglePanel('telemetry')}
                className={`border-r border-white/10 bg-black/20 p-6 flex flex-col gap-6 backdrop-blur-sm overflow-y-auto scrollbar-hide transition-all duration-500 ${minimizedPanels.telemetry ? 'w-16' : 'w-80'}`}
              >
                {!minimizedPanels.telemetry ? (
                  <TelemetryOverlay />
                ) : (
                  <div className="flex flex-col items-center gap-8 py-4 opacity-40">
                    <ActivityIcon className="w-5 h-5 text-emerald-400" />
                    <Database className="w-5 h-5 text-cyan-400" />
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                )}
              </aside>

              {/* Center: The Void Viewport */}
              <section className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-animus-grid pointer-events-none" />
                
                {/* Live Nebula Graphics Layer */}
                <NebulaStream />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   {/* Center HUD Decoration */}
                   <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <div className="absolute top-10 left-10 text-left pointer-events-none">
                        <h2 className="text-xl font-black text-cyan-400 italic tracking-tighter uppercase drop-shadow-[0_0_10px_#00bfff]">
                          [ANIMUS_V7 CANVAS ACTIVE]
                        </h2>
                        <div className="flex flex-col gap-1 mt-2">
                          <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Geometry: Torus Knot Neural Mesh</p>
                          <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Status: <span className="text-orange-500 animate-pulse">SYNCED TO 6TH SYNAPSE</span></p>
                        </div>
                      </div>

                      {/* Fractal Data Stream HUD Elements */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none border border-cyan-500/5 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none border border-purple-500/5 rounded-full animate-reverse-spin" />
                      
                      <div className="absolute -bottom-16 text-center w-full">
                        <span className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">Cryptographic 16-13 Overlay equivalent</span>
                        <h2 className="text-2xl font-black tracking-[0.3em] text-white mt-2 uppercase italic">THE ANIMUS VOID</h2>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-8 right-8 flex flex-col items-end pointer-events-auto">
                  <span className="text-[10px] font-mono text-white/20 mb-2 tracking-widest uppercase">Fractal Generation Params</span>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                      initial={{ width: '0%' }}
                      animate={{ width: '66%' }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              </section>

              {/* Right Side: AI Partner */}
              <aside 
                onDoubleClick={() => togglePanel('partner')}
                className={`border-l border-white/10 bg-black/20 p-6 overflow-hidden flex flex-col backdrop-blur-sm transition-all duration-500 ${minimizedPanels.partner ? 'w-16' : 'w-80'}`}
              >
                {!minimizedPanels.partner ? (
                  <AIPartner />
                ) : (
                  <div className="flex flex-col items-center gap-8 py-4 opacity-40">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 animate-pulse" />
                    <Cpu className="w-5 h-5 text-white/40" />
                    <Globe className="w-5 h-5 text-white/40" />
                  </div>
                )}
              </aside>
            </motion.main>
          )}
          
          {viewMode === 'tesseract' && (
            <motion.div 
              key="tesseract"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              style={{ perspective: 2000 }}
              className="w-full h-full"
            >
               <TesseractView onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'stream' && (
            <motion.div 
              key="stream"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full h-full"
            >
               <StreamPanel onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'browser' && (
            <motion.div 
              key="browser"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
               <WebBrowser onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'performance' && (
            <motion.div 
              key="performance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
               <PerformanceDashboard onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'models' && (
            <motion.div 
              key="models"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
               <ModelIntegrationHub />
            </motion.div>
          )}

          {viewMode === 'orchestrator' && (
            <motion.div 
              key="orchestrator"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              style={{ perspective: 2000 }}
              className="w-full h-full"
            >
               <CreativeOrchestrator onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'deep-link' && (
            <motion.div 
              key="deep-link"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              style={{ perspective: 2000 }}
              className="w-full h-full"
            >
               <AtlasNavigationSuite />
            </motion.div>
          )}

          {viewMode === 'metaverse' && (
            <motion.div 
              key="metaverse"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-full h-full"
            >
               <MetaverseInteraction />
            </motion.div>
          )}

          {viewMode === 'animus-void' && (
            <motion.div 
               key="animus-void"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="w-full h-full"
            >
               <AnimusVoid />
            </motion.div>
          )}

          {viewMode === 'nexus-gate' && (
            <motion.div 
               key="nexus-gate"
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.5 }}
               className="w-full h-full"
            >
               <InteractiveFractalEngine />
            </motion.div>
          )}

          {viewMode === 'ethereal' && (
            <motion.div 
              key="ethereal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="w-full h-full"
            >
               <EtherealDataEngine />
            </motion.div>
          )}

          {viewMode === 'smarthome' && (
            <motion.div 
              key="smarthome"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
               <SmartHomeIntegration />
            </motion.div>
          )}

          {viewMode === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full h-full"
            >
               <MemberProfile onBack={() => setViewMode('index')} />
            </motion.div>
          )}

          {viewMode === 'sphynx' && (
            <motion.div 
              key="sphynx"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full h-full"
            >
               <SphynxMasterwork onBack={() => setViewMode('browser')} />
            </motion.div>
          )}

          {viewMode === 'void-core' && (
            <motion.div 
              key="void-core"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
               <AnimusVoidCore />
            </motion.div>
          )}

          {viewMode === 'metaverse-hub' && (
            <motion.div 
              key="metaverse-hub"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
               <MetaverseHub />
            </motion.div>
          )}

          {viewMode === 'smart-sync' && (
            <motion.div 
              key="smart-sync"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full h-full"
            >
               <SmartSyncSuite />
            </motion.div>
          )}

          {viewMode === 'spatial-nav' && (
            <motion.div 
              key="spatial-nav"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
               <SpatialNavigator />
            </motion.div>
          )}
        </AnimatePresence>

        <NarratorHUD lastUpdateText={lastUpdateText} autoAnnounce={true} />

        <SystemAssistant 
          isActive={isTutorialActive} 
          onClose={() => setIsTutorialActive(false)}
          onNavigate={(view) => setViewMode(view)}
        />

        {/* Global Dock */}
        <motion.div 
          drag
          dragMomentum={false}
          style={{ width: dockWidth }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-2 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl cursor-move group"
        >
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 py-1">
            {[
              {id: 'index', icon: <Box className="w-4 h-4" />, color: 'text-white' },
              { id: 'profile', icon: <User className="w-4 h-4" />, color: 'text-emerald-400' },
              { id: 'metaverse', icon: <Globe className="w-4 h-4" />, color: 'text-rose-500' },
              { id: 'animus-void', icon: <Skull className="w-4 h-4" />, color: 'text-purple-500' },
              { id: 'nexus-gate', icon: <Zap className="w-4 h-4" />, color: 'text-cyan-400' },
              { id: 'ethereal', icon: <Layers className="w-4 h-4" />, color: 'text-cyan-400' },
              { id: 'smarthome', icon: <Home className="w-4 h-4" />, color: 'text-emerald-400' },
              { id: 'void-core', icon: <ActivityIcon className="w-4 h-4" />, color: 'text-rose-400' },
              { id: 'metaverse-hub', icon: <Globe className="w-4 h-4" />, color: 'text-amber-400' },
              { id: 'smart-sync', icon: <Cpu className="w-4 h-4" />, color: 'text-cyan-400' },
              { id: 'spatial-nav', icon: <Globe className="w-4 h-4" />, color: 'text-emerald-400' },
              { id: 'sphynx', icon: <Sparkles className="w-4 h-4" />, color: 'text-cyan-400' },
              { id: 'dashboard', icon: <ActivityIcon className="w-4 h-4" />, color: 'text-cyan-400' },
              { id: 'orchestrator', icon: <Network className="w-4 h-4" />, color: 'text-emerald-400' },
              { id: 'deep-link', icon: <ShieldCheck className="w-4 h-4" />, color: 'text-rose-400' },
              { id: 'models', icon: <Cpu className="w-4 h-4" />, color: 'text-amber-400' },
              { id: 'performance', icon: <Zap className="w-4 h-4" />, color: 'text-rose-400' },
              { id: 'tesseract', icon: <Layers className="w-4 h-4" />, color: 'text-purple-400' },
              { id: 'stream', icon: <Terminal className="w-4 h-4" />, color: 'text-emerald-400' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id as any)}
                className={`p-3 rounded-xl transition-all hover:scale-110 min-w-max ${viewMode === item.id ? 'bg-white/10 brightness-125' : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
              >
                <div className={item.color}>{item.icon}</div>
              </button>
            ))}
          </div>

          {/* Resize Handle */}
          <div 
            className="w-1.5 h-10 bg-white/10 rounded-full cursor-ew-resize hover:bg-cyan-500/50 transition-colors shrink-0"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = dockWidth;
              const handleMouseMove = (mmE: MouseEvent) => {
                const newWidth = Math.max(300, Math.min(1000, startWidth + (mmE.clientX - startX) * 2));
                setDockWidth(newWidth);
              };
              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="h-10 bg-black border-t border-white/10 flex items-center justify-between px-8 text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] z-50 overflow-x-auto scrollbar-hide group">
        <div className="flex gap-6 items-center min-w-max">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_cyan]" />
            METAVERSE BRIDGE: <span className="text-cyan-500">CONNECTED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            TELEMETRY: <span className="text-purple-400">SYNCED_COLLECTIVE</span>
          </div>
          <div className="flex items-center gap-3 ml-4 border-l border-white/10 pl-6 opacity-60">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <Database className="w-3 h-3 text-cyan-400" />
            <Layers className="w-3 h-3 text-purple-400" />
            <Cpu className="w-3 h-3 text-white/50" />
          </div>
        </div>
        <div className="flex gap-6 italic items-center">
          <div className="flex items-center gap-2 not-italic">
            <span>Uptime: <span className="text-white/80">99.9%</span></span>
            <div className="h-3 w-px bg-white/10" />
            <span>Resonance: <span className="text-white/80">1.4THz</span></span>
          </div>
          <div className="flex gap-4">
            <span>fair play is law</span>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('nexus-telemetry', { detail: { type: 'GHOST_TOGGLE' } }))}
              className="text-red-500 text-xs not-italic cursor-help hover:scale-125 transition-transform" 
              title="Toggle Global Ghost Vision"
            >
              [=] &lt;3
            </button>
          </div>
        </div>
      </footer>

      {/* Overlay Scanning Lines */}
      <div className="absolute inset-0 z-[60] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <AnimatePresence>
        {resonanceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] pointer-events-none flex items-center justify-center bg-cyan-500/5 backdrop-invert-[0.1]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] animate-pulse" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Skull className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
              <h2 className="text-4xl font-black text-white tracking-[1em] uppercase italic">RESONANCE_ESTABLISHED</h2>
              <span className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest">Architect Azazel Detected // Kernel_Access_Granted</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </SovereignSingularityWrapper>
    </MasterSystemWalkthrough>
  );
}



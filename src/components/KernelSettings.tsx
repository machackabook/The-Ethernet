import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Wifi, Globe, Terminal, Lock, Unlock, Zap, Activity, Gamepad, Keyboard, Crosshair, Compass, RotateCcw, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KernelFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresReboot?: boolean;
}

interface Keybinding {
  id: string;
  name: string;
  category: 'Movement' | 'PvP Combat' | 'Space Navigation';
  key: string;
  description: string;
}

const DEFAULT_BINDINGS: Keybinding[] = [
  { id: 'move-forward', name: 'Move Forward', category: 'Movement', key: 'w', description: 'Standard linear propulsion through voxel matrices' },
  { id: 'move-backward', name: 'Move Backward', category: 'Movement', key: 's', description: 'Reverse thruster deceleration' },
  { id: 'strafe-left', name: 'Strafe Left', category: 'Movement', key: 'a', description: 'Lateral drift left' },
  { id: 'strafe-right', name: 'Strafe Right', category: 'Movement', key: 'd', description: 'Lateral drift right' },
  { id: 'jump', name: 'Jump / Ascend', category: 'Movement', key: ' ', description: 'Thrust vector vertical lift' },
  { id: 'fire-weapon', name: 'Fire Primary Weapon', category: 'PvP Combat', key: 'f', description: 'Discharge tactical energy projectile' },
  { id: 'activate-shield', name: 'Reflective Shield', category: 'PvP Combat', key: 'q', description: 'Generate electrostatic deflection barrier' },
  { id: 'build-voxel', name: 'Construct Voxel Block', category: 'PvP Combat', key: 'e', description: 'Deploy structural defense grid block' },
  { id: 'warp-drive', name: 'Warp Drive Engage', category: 'Space Navigation', key: 'Shift', description: 'Superluminal point-to-point warp leap' },
  { id: 'launch-drone', name: 'Launch Fighter Drone', category: 'Space Navigation', key: 'x', description: 'Deploy autonomous tactical wingman' },
  { id: 'sub-kernel-sync', name: 'Sovereign Sync', category: 'Space Navigation', key: 'c', description: 'Force real-time state synchronization' },
];

export function KernelSettings({ onClose }: { onClose: () => void }) {
  const [activeSocket, setActiveSocket] = useState(false);
  const [latency, setLatency] = useState(24);
  const [activeTab, setActiveTab] = useState<'flags' | 'shortcuts'>('flags');
  const [rebindingId, setRebindingId] = useState<string | null>(null);

  const [flags, setFlags] = useState<KernelFlag[]>([
    { id: 'isolated-app', name: 'Isolated Context', description: 'Enables high-privilege PWA environment isolation.', enabled: true },
    { id: 'window-control', name: 'Window Management', description: 'Allows Nexus to re-orchestrate viewport coordinates.', enabled: false },
    { id: 'unframed-iwa', name: 'Unframed Mode', description: 'Bypasses standard OS window frames for pure canvas immersion (#enable-unframed-iwa).', enabled: true },
    { id: 'sub-apps', name: 'Sub-App Spawning', description: 'Allows multi-manifest orchestration for sub-nodes (#enable-sub-apps).', enabled: true },
    { id: 'usb-bypass', name: 'WebUSB Unrestricted', description: 'Bypasses native hardware blocklists for local node synchronization.', enabled: false },
    { id: 'neural-ws', name: 'Neural WebSocket', description: 'Persistent real-time telemetry link to AE-M4 kernel.', enabled: true },
    { id: 'ghost-vision', name: 'Ghost Layer HUD', description: 'Overlays hidden resonance fragments onto the index.', enabled: false },
  ]);

  const [bindings, setBindings] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('nexus-metaverse-keybindings');
    if (saved) return JSON.parse(saved);
    const defaultMap: Record<string, string> = {};
    DEFAULT_BINDINGS.forEach(b => {
      defaultMap[b.id] = b.key;
    });
    return defaultMap;
  });

  useEffect(() => {
    // Detect PWA / High-Privilege Context
    const detectPrivileges = async () => {
      // Check for Window Management API (Modern Chrome/PWA)
      if ('getScreenDetails' in window || (window as any).screenDetails) {
        setFlags(prev => prev.map(f => f.id === 'window-control' ? { ...f, enabled: true, description: 'High-privilege Multi-Screen orchestration ACTIVE.' } : f));
      }
      
      // Check for Isolated Context (Simulated check for PWA headers/mode)
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      if (isPWA) {
        setFlags(prev => prev.map(f => f.id === 'isolated-app' ? { ...f, enabled: true, name: 'Isolated Context (VERIFIED)' } : f));
      }
    };

    detectPrivileges();

    // Simulate Neural WebSocket Activity
    const interval = setInterval(() => {
      setLatency(prev => {
        const next = prev + (Math.random() * 4 - 2);
        return Math.max(12, Math.min(80, next));
      });
      if (Math.random() > 0.8) setActiveSocket(true);
      setTimeout(() => setActiveSocket(false), 200);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener for active rebinding
  useEffect(() => {
    if (!rebindingId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setRebindingId(null);
        return;
      }

      // Convert spaces or modifiers to clean labels
      const newKey = e.key;
      const updated = { ...bindings, [rebindingId]: newKey };
      setBindings(updated);
      localStorage.setItem('nexus-metaverse-keybindings', JSON.stringify(updated));

      // Emit updated keybindings event
      window.dispatchEvent(new CustomEvent('nexus-keybindings-updated', { detail: updated }));
      setRebindingId(null);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [rebindingId, bindings]);

  const toggleFlag = (id: string) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    // Emit event for global system changes
    window.dispatchEvent(new CustomEvent('nexus-kernel-flag', { detail: { flagId: id } }));
  };

  const handleResetBindings = () => {
    const defaultMap: Record<string, string> = {};
    DEFAULT_BINDINGS.forEach(b => {
      defaultMap[b.id] = b.key;
    });
    setBindings(defaultMap);
    localStorage.setItem('nexus-metaverse-keybindings', JSON.stringify(defaultMap));
    window.dispatchEvent(new CustomEvent('nexus-keybindings-updated', { detail: defaultMap }));
  };

  const categories = ['Movement', 'PvP Combat', 'Space Navigation'] as const;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)] flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Kernel_Core_Config</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest flex items-center gap-1">
                   <div className={`w-1 h-1 rounded-full ${activeSocket ? 'bg-cyan-400 shadow-[0_0_5px_#06b6d4]' : 'bg-white/20'}`} />
                   WebSocket_Live
                </span>
                <span className="text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest">Latency: {latency.toFixed(1)}ms</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors uppercase font-mono text-[10px] border border-white/10 px-3 py-1 rounded-full">Close_X</button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 bg-black/20 p-2 gap-2">
          <button 
            onClick={() => setActiveTab('flags')}
            className={`flex-1 py-3.5 rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all ${activeTab === 'flags' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            System_Flags_Config
          </button>
          <button 
            onClick={() => setActiveTab('shortcuts')}
            className={`flex-1 py-3.5 rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all ${activeTab === 'shortcuts' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
          >
            Metaverse_Input_Shortcuts
          </button>
        </div>

        {/* Tab View Container */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'flags' ? (
              <motion.div
                key="flags-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {flags.map(flag => (
                    <button 
                      key={flag.id}
                      onClick={() => toggleFlag(flag.id)}
                      className={`p-4 rounded-2xl border text-left transition-all group relative overflow-hidden ${flag.enabled ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]' : 'bg-white/[0.02] border-white/10 opacity-60 hover:opacity-100 hover:bg-white/5'}`}
                    >
                      {flag.enabled && (
                        <motion.div 
                          layoutId="active-glow" 
                          className="absolute inset-0 bg-cyan-400/[0.03] pointer-events-none"
                        />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${flag.enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
                          {flag.id === 'neural-ws' ? <Wifi className="w-4 h-4" /> : flag.id === 'fs-access' ? <Terminal className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </div>
                        {flag.enabled ? <Lock className="w-3 h-3 text-cyan-400" /> : <Unlock className="w-3 h-3 text-white/20" />}
                      </div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{flag.name}</h4>
                      <p className="text-[9px] font-mono text-white/40 leading-snug">{flag.description}</p>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">PWA Environment Control</h4>
                  </div>
                  <p className="text-[9px] font-mono text-white/50 leading-relaxed uppercase italic">
                    These flags modify the browser architecture. To enable full "Browser Control" for the PWA instantiation, you must manifest: 
                    <br/>--enable-features=IsolatedWebApps,WindowManagement
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="shortcuts-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/15 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Interactive Bindings Mapper</h4>
                      <p className="text-[8px] font-mono text-white/40 uppercase">Rebind shortcuts live. Config overrides are stored locally.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleResetBindings}
                    className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-xl text-[8px] font-mono uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset_Defaults
                  </button>
                </div>

                {categories.map(category => (
                  <div key={category} className="space-y-3">
                    <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest font-black block pl-1">{category} Actions</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {DEFAULT_BINDINGS.filter(b => b.category === category).map(b => {
                        const currentKey = bindings[b.id] || b.key;
                        const isRebinding = rebindingId === b.id;

                        return (
                          <div 
                            key={b.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between relative overflow-hidden ${
                              isRebinding 
                                ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-pulse' 
                                : 'bg-white/[0.02] border-white/15 hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="space-y-1 max-w-[65%]">
                              <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                {category === 'Movement' ? <Compass className="w-3 h-3 text-cyan-400" /> : category === 'PvP Combat' ? <Crosshair className="w-3 h-3 text-rose-400" /> : <Sparkles className="w-3 h-3 text-purple-400" />}
                                {b.name}
                              </h4>
                              <p className="text-[8px] font-mono text-white/45 uppercase leading-normal leading-tight">{b.description}</p>
                            </div>

                            <button
                              onClick={() => setRebindingId(b.id)}
                              className={`px-4 py-3 rounded-xl min-w-[70px] text-center border font-mono text-[9px] uppercase tracking-wider font-bold transition-all shadow-md ${
                                isRebinding 
                                  ? 'bg-rose-500 text-white border-rose-400 font-black' 
                                  : 'bg-white/5 text-purple-300 border-white/10 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {isRebinding ? 'Press Key' : currentKey === ' ' ? 'Space' : currentKey}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl flex gap-3 items-start">
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-[8px] font-mono text-white/40 leading-relaxed uppercase">
                    SYSTEM INSTANCE DETECTED IN ACTIVE METAVERSE PORTAL. ANY SHORTCUT PRESSED OUTSIDE TEXT FIELD ENTRY WILL CORRELATE LIVE IN THE WORLD SIMULATOR. PRESSING ESCAPE TERMINATES ACTIVE REBIND LISTENING.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Bar */}
        <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 italic">
                 <Activity className="w-2.5 h-2.5 text-cyan-500" />
                 Heartbeat: 144BPM
              </span>
              <span>Uptime: 13,722,295.4s</span>
           </div>
           <span>Nexus_v7.3_Experimental</span>
        </div>
      </motion.div>
    </div>
  );
}

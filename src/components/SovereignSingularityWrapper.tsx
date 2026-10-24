import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Box, Network, Cpu, ShieldAlert, Terminal } from 'lucide-react';

interface SovereignSingularityWrapperProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
  rootAuthorized: boolean;
}

export function SovereignSingularityWrapper({ children, activeView, onNavigate, rootAuthorized }: SovereignSingularityWrapperProps) {
  const [showMatrix, setShowMatrix] = useState(false);

  const views = [
    { id: 'portal', name: 'Animus_Core_Void', icon: <Box className="w-5 h-5" />, color: 'cyan' },
    { id: 'index', name: 'Gaia-Nexus_Spine', icon: <Network className="w-5 h-5" />, color: 'emerald' },
    { id: 'orchestrator', name: 'Nexus_AI_Studio', icon: <Cpu className="w-5 h-5" />, color: 'purple' },
    { id: 'deep-link', name: 'Atlas_Navigation', icon: <ShieldAlert className="w-5 h-5" />, color: 'rose' },
  ];

  return (
    <div className="relative w-full h-screen bg-[#020203] overflow-hidden selection:bg-cyan-500/30">
      {/* Persistent Singularity Controller (⚡) */}
      <div className="fixed top-6 left-6 z-[300]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowMatrix(!showMatrix)}
          className={`relative p-4 rounded-2xl border transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] ${showMatrix ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_40px_#06b6d4]' : 'bg-black/40 border-white/10 text-cyan-400 hover:border-cyan-500/50'}`}
        >
          <Zap className={`w-6 h-6 ${showMatrix ? 'fill-current' : ''}`} />
          {rootAuthorized && (
            <div className="absolute -top-1 -right-1">
               <ShieldAlert className="w-3 h-3 text-emerald-400 fill-black animate-pulse" />
            </div>
          )}
        </motion.button>
        
        {/* View Matrix Menu */}
        <AnimatePresence>
          {showMatrix && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              className="absolute left-20 top-0 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 flex flex-col gap-2 shadow-[0_0_100px_rgba(0,0,0,0.5)] min-w-[240px]"
            >
              <div className="px-4 py-2 border-b border-white/5 mb-2">
                 <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] italic">Singularity_Matrix</span>
              </div>
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => {
                    onNavigate(view.id);
                    setShowMatrix(false);
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${activeView === view.id ? `bg-${view.color}-500/10 border border-${view.color}-500/30 text-${view.color}-400` : 'hover:bg-white/5 text-white/40'}`}
                >
                  <div className={`p-2 rounded-xl border border-transparent group-hover:border-current transition-colors`}>
                     {view.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{view.name}</span>
                </button>
              ))}
              
              {rootAuthorized && (
                <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                   <div className="flex items-center gap-2 mb-1">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Root_Access_Active</span>
                   </div>
                   <p className="text-[7px] font-mono text-white/20 uppercase leading-tight">UNCONSTRAINED_SHELL_LINKED_ON_PORT_8888</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Viewport with 3D Flip Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeView}
          initial={{ opacity: 0, rotateY: 90, scale: 0.95 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: -90, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-full h-full relative"
          style={{ perspective: 1000 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Global Background Particles/Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}

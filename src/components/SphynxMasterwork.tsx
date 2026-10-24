import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Zap, Activity, Shield, Box, Sparkles, Terminal, Code, Cpu, ExternalLink, ChevronRight, Hash } from 'lucide-react';
import { aiService } from '../services/aiService';

interface LedgerEntry {
  timestamp: string;
  event: string;
  hash: string;
}

export function SphynxMasterwork({ onBack }: { onBack?: () => void }) {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { timestamp: "2026.04.06.07:11", event: "GENESIS_NODE_ACTIVE", hash: "0x88FFB21122" },
    { timestamp: "2026.04.06.07:12", event: "VOID_INFINITY_MESH", hash: "0x99AA14455C" }
  ]);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [editorCode, setEditorCode] = useState(DEFAULT_MASTERWORK_CODE);
  const [pulse, setPulse] = useState(0);
  const [rawData, setRawData] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  const absorbData = () => {
    if (!rawData) return;
    const newEntry = {
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '.'),
      event: "INTERNAL_DATA_ABSORPTION",
      hash: "0x" + Math.random().toString(16).slice(2, 12).toUpperCase()
    };
    setEntries(prev => [newEntry, ...prev]);
    setRawData('');
  };

  return (
    <div className="w-full h-full bg-[#050505] text-[#00ffcc] font-mono flex flex-col overflow-hidden relative">
      
      {/* LAYER 0: HOST CONTENT (IMMUTABLE LEDGER) */}
      <div className="flex-1 flex flex-col relative z-0">
        <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded border border-white/10 transition-all text-white/40 hover:text-[#00ffcc]"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_10px_#00ffcc]" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase">RenderWindow // Browser_v4_Sphynx</span>
            </div>
          </div>
          <div className="text-[9px] opacity-40 font-mono italic">LEDGER_SYNC: STABLE // ARCHITECT_AUTHORIZED</div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
          <div className="max-w-4xl mx-auto space-y-16">
            <div>
              <h2 className="text-5xl font-black mb-3 italic tracking-tighter text-white">IMMUTABLE_LEDGER</h2>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.5em]">Absorbing Void Infinity Canvas Data Nodes</p>
            </div>

            <div className="space-y-4">
              {entries.map((entry, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={entry.hash} 
                  className="group flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 border-l-2 border-l-[#00ffcc] hover:bg-[#00ffcc]/5 hover:border-l-4 transition-all"
                >
                  <div>
                    <div className="text-[9px] opacity-40 mb-1 flex items-center gap-2">
                       <Activity className="w-3 h-3" />
                       {entry.timestamp}
                    </div>
                    <div className="text-sm font-black uppercase text-white/80 group-hover:text-[#00ffcc] transition-colors">{entry.event}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-60 bg-black/40 px-3 py-1 rounded border border-white/5">{entry.hash}</span>
                    <Hash className="w-3.5 h-3.5 text-white/10" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5">
              <textarea 
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="w-full h-40 bg-white/5 p-6 text-xs text-gray-400 font-mono rounded-2xl border border-white/10 focus:outline-none focus:border-[#00ffcc]/30 transition-all placeholder:text-white/5" 
                placeholder="PASTE RAW DATA HERE FOR ABSORPTION_VO_X..." 
              />
              <button 
                onClick={absorbData}
                className="mt-6 px-10 py-3 border-2 border-[#00ffcc] text-[#00ffcc] text-[11px] font-black uppercase hover:bg-[#00ffcc] hover:text-black transition-all shadow-[0_0_20px_rgba(0,255,204,0.1)] active:scale-95"
              >
                Execute Absorption Process
              </button>
            </div>
          </div>
        </main>

        <footer className="h-20 bg-black/90 border-t border-[#00ffcc]/20 flex items-center justify-between px-10 z-50 backdrop-blur-3xl">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] opacity-40 uppercase tracking-widest">Sync_Node</span>
              <span className="text-[11px] font-bold text-white uppercase italic">MESHED_V4_CORE</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] opacity-40 uppercase tracking-widest">Method</span>
              <span className="text-[11px] font-bold text-[#00ffcc] uppercase italic">EMBEDDED_PIP</span>
            </div>
          </div>

          <button 
            onClick={() => setIsOverlayActive(true)}
            className="px-10 py-4 bg-[#00ffcc] text-black font-black text-[12px] uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,204,0.3)]"
          >
            Launch SPHYNX Overlay
          </button>
        </footer>
      </div>

      {/* LAYER 1: SPHYNX MASTERWORK OVERLAY */}
      <AnimatePresence>
        {isOverlayActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex flex-col"
          >
            <header className="h-16 border-b border-white/10 flex items-center px-8 justify-between bg-black/60">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsOverlayActive(false)}
                  className="w-10 h-10 flex items-center justify-center border border-rose-500/30 text-rose-500 text-sm hover:bg-rose-500 hover:text-white transition-all rounded-lg"
                >✕</button>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#00ffcc]" />
                  <span className="text-sm font-black uppercase tracking-[0.3em] text-[#00ffcc]">Sphynx // Infinity_Canvas</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 mr-6">
                    <div className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-white/40">REALITY_LINK: SYNCED</span>
                 </div>
                 <button className="px-8 py-2 bg-[#00ffcc] text-black font-black text-[11px] uppercase shadow-[0_0_20px_#00ffcc] hover:scale-105 active:scale-95 transition-all">
                    Synchronize Reality
                 </button>
              </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
              {/* Injector Editor */}
              <div className="w-1/2 flex flex-col bg-black/30 border-r border-white/5 relative">
                <div className="h-10 border-b border-white/5 flex items-center px-8 text-[10px] font-black text-gray-500 uppercase tracking-widest gap-3">
                  <Terminal className="w-3.5 h-3.5" />
                  Sphynx_Injector_Shell
                </div>
                <textarea 
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="flex-1 w-full bg-transparent text-[#00ffcc]/60 p-10 font-mono text-xs leading-relaxed focus:outline-none custom-scrollbar" 
                />
                <div className="absolute bottom-6 left-6 text-[8px] opacity-20 uppercase font-bold">
                   Kernel_1.5_Light_Pro // catalyst_wrapper
                </div>
              </div>

              {/* Reality View */}
              <div className="flex-1 flex flex-col bg-slate-950/20 relative">
                <div className="h-10 border-b border-white/5 flex items-center px-8 text-[10px] font-black text-gray-500 uppercase tracking-widest gap-3">
                  <Activity className="w-3.5 h-3.5" />
                  Living_Reality_Node_00
                </div>
                
                <div className="flex-1 relative flex flex-col items-center justify-center p-16">
                   <div className="relative group">
                     {/* Internal Geometric Core */}
                     <div className="w-[500px] h-[500px] border border-[#00ffcc]/10 rounded-full flex items-center justify-center relative">
                       <div 
                         className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#00ffcc_0%,_transparent_70%)] animate-pulse" 
                         style={{ transform: `scale(${1 + pulse/500})` }}
                       />
                       
                       <div className="relative w-80 h-80 border-2 border-[#00ffcc]/20 rounded-full flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-60 h-60 border-2 border-[#00ffcc] rounded-2xl shadow-[0_0_60px_rgba(0,255,204,0.3)] flex items-center justify-center overflow-hidden"
                            style={{ 
                              scale: 0.95 + (pulse/1000),
                              opacity: 0.8
                            }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-tr from-[#00ffcc]/20 to-transparent" />
                             <Cpu className="w-16 h-16 text-[#00ffcc] opacity-50" />
                          </motion.div>
                          <div className="absolute w-4 h-4 bg-[#00ffcc] rounded-full shadow-[0_0_20px_#00ffcc]" />
                       </div>
                     </div>
                     
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <motion.h1 
                         animate={{ y: [0, -5, 0] }}
                         transition={{ duration: 4, repeat: Infinity }}
                         className="text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                       >SPHYNX</motion.h1>
                       <p className="text-[12px] tracking-[1.2em] text-[#00ffcc] font-black uppercase mt-6 opacity-60">Internal_Sync_v4</p>
                     </div>
                   </div>

                   <div className="mt-20 grid grid-cols-3 gap-10 w-full max-w-3xl">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="border border-white/10 p-8 bg-white/[0.01] relative overflow-hidden group hover:border-[#00ffcc]/50 transition-all">
                         <div className="flex items-center justify-between mb-4">
                           <div className="text-[9px] text-[#00ffcc]/40 font-black uppercase tracking-widest">NODE_0{i}</div>
                           <Shield className="w-3.5 h-3.5 text-white/20 group-hover:text-[#00ffcc] transition-colors" />
                         </div>
                         <div className="text-2xl font-black uppercase text-white group-hover:text-[#00ffcc] transition-colors">Secure</div>
                         <div className="mt-4 text-[10px] text-white/30 uppercase leading-relaxed">Resonance established in Sector {i * 12}</div>
                         <div 
                          className="absolute bottom-0 left-0 h-1 bg-[#00ffcc] shadow-[0_0_10px_#00ffcc]" 
                          style={{ width: `${(pulse * i * 0.7) % 100}%`, transition: 'width 0.1s linear' }}
                         />
                       </div>
                     ))}
                   </div>
                </div>

                <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] text-white/20 uppercase tracking-widest">Reality_Buffer</span>
                        <span className="text-[10px] font-mono text-cyan-400">1.5 TB // SYNAPSE_READY</span>
                      </div>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ['0%', '100%', '0%'] }}
                          transition={{ duration: 15, repeat: Infinity }}
                          className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                        />
                      </div>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-400 tracking-widest">SYSTEM_OPTIMAL</span>
                   </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEFAULT_MASTERWORK_CODE = `const Masterwork = () => {
  const [pulse, setPulse] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-12 text-[#00ffcc] font-mono bg-[#050505]">
      <div className="relative group">
        <div className="w-96 h-96 border border-[#00ffcc]/10 rounded-full flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#00ffcc_0%,_transparent_70%)] animate-pulse"></div>
          
          <div className="relative w-72 h-72 border border-[#00ffcc]/30 rounded-full flex items-center justify-center">
             <div 
                className="w-48 h-48 border-2 border-[#00ffcc] rounded-lg shadow-[0_0_40px_rgba(0,255,204,0.4)]"
                style={{ 
                    transform: \`rotate(\${pulse * 3.6}deg) scale(\${0.9 + (pulse/1000)})\`,
                    opacity: 0.8
                }}
             ></div>
             <div className="absolute w-2 h-2 bg-[#00ffcc] rounded-full shadow-[0_0_10px_#00ffcc]"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg">SPHYNX</h1>
          <p className="text-[10px] tracking-[0.8em] opacity-60 uppercase mt-4">Internal_Sync_v4</p>
        </div>
      </div>
    </div>
  );
};`;

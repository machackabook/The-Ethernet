import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Database, Network, Shield, Zap, LayoutGrid, Box, Search, History, Settings, Lock, X, ChevronRight, Share2, ExternalLink } from 'lucide-react';
import { aiService } from '../services/aiService';
import { APPS } from '../constants';
import { fnv1a32Hash } from '../lib/utils';

interface FeedItem {
  id: string;
  source: string;
  content: string;
  time: string;
  isNFT?: boolean;
}

const MOCK_NEWS_FEED: FeedItem[] = [
  { id: '1', source: 'cryptic._.newsnft', content: 'BosonAEisensteinRosenbridge detected in Sector 4. Liquidity event imminent.', time: '2m', isNFT: true },
  { id: '2', source: 'nexus.core', content: 'Jumppoint stable. Collective resonance at 1.4THz.', time: '5m' },
  { id: '3', source: 'sovereign.os', content: 'Neural Bridge v53.4 synchronized with OpenSea API.', time: '12m', isNFT: true },
  { id: '4', source: 'cryptic._.newsnft', content: 'Virtual Land unit Alpha-36 acquired by Architect_Azazel.', time: '1h', isNFT: true },
];

interface AppIconProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

function AppIcon({ name, description, icon, color, onClick }: AppIconProps) {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    setIsClicking(true);
    setTimeout(() => {
      setIsClicking(false);
      onClick();
    }, 200);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="group relative flex flex-col items-center gap-4 p-8 rounded-[32px] glass-card hover:bg-white/[0.05] transition-all text-center overflow-hidden neural-shine"
    >
      <motion.div 
        animate={isClicking ? { 
          scale: [1, 1.2, 1],
          filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
        } : {}}
        className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-6 group-hover:scale-110 ${color}`}
      >
        {icon}
      </motion.div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-display font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-rose-vivid transition-colors">{name}</span>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed max-w-[120px]">{description}</span>
      </div>

      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`absolute inset-0 rounded-3xl pointer-events-none mix-blend-screen ${color.split(' ')[0]}`}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/[0.02] to-transparent pointer-events-none" />
    </motion.button>
  );
}

export function CommandCenter({ onViewChange }: { onViewChange: (view: 'dashboard' | 'tesseract' | 'stream' | 'profile' | 'metaverse' | 'void-core' | 'metaverse-hub' | 'smart-sync') => void }) {
  const [bootSequence, setBootSequence] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLedger, setShowLedger] = useState(false);
  const [newsFeed] = useState<FeedItem[]>(MOCK_NEWS_FEED);
  const [recoveredData, setRecoveredData] = useState<string | null>(null);
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const [popoutLogs, setPopoutLogs] = useState<string[]>(['[NEURAL_V7] KERNEL_ACTIVE', '[SYS] RESONANCE_OVERRIDE_DETECTED']);
  const [isExtrapolationActive] = useState(() => localStorage.getItem('extrapolation') === 'd432k7l5kaa60e9f8394592n888b759l15h08d6aa69f1g759id4c8g');

  const resonanceId = React.useMemo(() => {
    const hash = fnv1a32Hash('Architect_Azazel_Nexus_Gate');
    return `0x${hash.toString(16).toUpperCase()}`;
  }, []);

  useEffect(() => {
    const logs = [
      "INITIALIZING NEURAL_INDEX...",
      "LOADING RECURSIVE LEDGER...",
      "SYNCING WITH SOVEREIGN_VAULT...",
      "STABILIZING QUANTUM_BRIDGE...",
      "RUST_MESH_ACTIVE // LATENCY: 0.001ms",
      "RESONANCE_DETECTION: 'Architect_Azazel' IDENTIFIED",
      "CORE_MODELS: [G95, PRO_V2, FLASH_LITE] ONLINE",
      "NEURAL_OS_READY."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setBootSequence(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleRecover = () => {
    const directive = "DIRECTIVE_01: 'Enhance Mandelbrot engine with iterative zoom, dynamic palette shifting, and 2D-to-3D projection mapping. Maintain Architect_Azazel signature.'";
    setRecoveredData(directive);
    // Persist to ghost buffer for AIPartner to potentially pick up
    localStorage.setItem('nexus_draft', directive);
  };

  const filteredApps = APPS.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full w-full bg-neural-bg p-12 lg:p-20 flex flex-col gap-12 overflow-hidden relative selection:bg-rose-500/30">
      <AnimatePresence>
        {recoveredData && (
          <motion.div 
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-[60] bg-rose-500/10 border border-rose-500/30 backdrop-blur-3xl px-8 py-3 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(244,63,94,0.2)]"
          >
            <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-display font-black text-rose-100 uppercase tracking-[0.2em]">Active_Directive: Sovereign_Resonance_v7</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Effect */}
      <div className="absolute inset-0 visible-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Header Info */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Omni-Index</h1>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em]">System Convergence v53.4</span>
            <div className="h-[1px] w-24 bg-white/10" />
            <span className="text-[9px] font-mono text-white/30 uppercase">Uptime: 284h 12m 04s</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 font-mono text-[9px] text-white/40 uppercase">
          <div className="flex items-center gap-2">NETWORK: <span className="text-emerald-400">ENCRYPTED</span> <Shield className="w-2 h-2" /></div>
          <div className="flex items-center gap-2">STORAGE: <span className="text-cyan-400">92%_OPTIMIZED</span> <Database className="w-2 h-2" /></div>
        </div>
      </div>

      <div className="flex-1 flex gap-12 z-10 relative">
        {/* Main App Grid */}
        <div className="flex-1 flex flex-col gap-10">
           <div className="relative w-full max-w-xl">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10" />
             <input 
               type="text" 
               placeholder="Search Neural Nexus..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-neural-glass border border-neural-border rounded-[24px] pl-16 pr-6 py-5 text-sm font-mono text-white focus:outline-none focus:border-rose-500/50 transition-all uppercase tracking-[0.2em] shadow-2xl backdrop-blur-2xl"
             />
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar pb-32">
              {filteredApps.map(app => (
                <AppIcon 
                  key={app.id}
                  id={app.id}
                  name={app.name}
                  description={app.desc}
                  icon={app.icon}
                  color={app.color}
                  onClick={() => {
                    if (app.id === 'ledger') setShowLedger(true);
                    else if (['dashboard', 'tesseract', 'stream', 'void-core', 'metaverse-hub', 'smart-sync'].includes(app.id)) {
                      onViewChange(app.id as any);
                    }
                  }}
                />
              ))}
              
              {/* Hidden/System Apps */}
              <AppIcon 
                id="devtools" 
                name="DevTools" 
                description="Kernel Debugger & Triage" 
                icon={<Cpu className="w-8 h-8 text-white" />} 
                color="bg-amber-700 shadow-amber-500/20" 
                onClick={() => {}} 
              />

              {/* Locked Apps placeholders for OS assistance */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-black/40 border border-white/5 opacity-30 grayscale hover:opacity-50 transition-opacity">
                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5">
                     <Lock className="w-6 h-6 text-white/20" />
                   </div>
                   <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Encrypted_Package</span>
                </div>
              ))}
           </div>
        </div>

        {/* System Logs & Dynamic Feed */}
        <div className="w-96 flex flex-col gap-8">
          {/* Dynamic Feed: cryptic._.newsnft */}
          <div className="glass-card rounded-[32px] p-8 flex flex-col gap-6 overflow-hidden bg-rose-500/5 border-rose-500/20">
             <div className="flex items-center justify-between border-b border-rose-500/10 pb-4">
                <span className="text-[10px] font-black font-display text-rose-500 uppercase tracking-[0.3em]">cryptic._.newsnft</span>
                <Share2 className="w-4 h-4 text-rose-500/30" />
             </div>
             <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {newsFeed.map(item => (
                  <div key={item.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 hover:bg-white/[0.05] transition-all cursor-pointer group">
                     <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-white/40">{item.source}</span>
                        <span className="text-white/20">{item.time}</span>
                     </div>
                     <p className="text-[10px] font-mono text-white/70 leading-relaxed uppercase group-hover:text-white transition-colors">
                        {item.content}
                     </p>
                     {item.isNFT && (
                       <div className="flex items-center gap-2 mt-2">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                          <span className="text-[8px] font-mono text-rose-500 uppercase tracking-widest">NFT_MINT_DETECTED</span>
                       </div>
                     )}
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-card rounded-[32px] p-8 flex flex-col gap-6 overflow-hidden h-fit max-h-[300px]">
            <div className="flex items-center justify-between border-b border-neural-border pb-4">
              <span className="text-[10px] font-black font-display text-white/30 uppercase tracking-[0.3em]">Neural_Resonance_Log</span>
              <span className="text-[10px] font-mono text-cyan-400">{resonanceId}</span>
            </div>
            <div className="flex flex-col gap-3 font-mono text-[9px] text-emerald-400 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {bootSequence.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 leading-relaxed"
                  >
                    <span className="text-white/10">[{i.toString().padStart(2, '0')}]</span>
                    <span className={log?.includes('RESONANCE') ? 'text-rose-400' : log?.includes('ONLINE') ? 'text-cyan-400' : ''}>{log}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 rounded-[32px] p-8 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-rose-500" />
                <span className="text-[10px] font-black font-display text-white uppercase tracking-[0.3em]">Protocol Intelligence</span>
             </div>
             <p className="text-xs font-mono text-white/50 leading-relaxed uppercase">
                The Sovereign System has detected your presence. Autonomic functions are currently standing by. Extrapolation mode is active for deep architectural refinement.
             </p>
          </div>
        </div>
      </div>

      {/* Scroll Ledger Modal */}
      <AnimatePresence>
        {showLedger && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-4xl h-full max-h-[700px] bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <History className="w-6 h-6 text-rose-500" />
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Recursive_Scroll_Ledger</h2>
                </div>
                <button onClick={() => setShowLedger(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Master_Directive_Recovered</span>
                    <button onClick={handleRecover} className="text-[9px] font-mono text-emerald-400/60 hover:text-emerald-400 underline uppercase italic">Decrypt Session Fragment</button>
                  </div>
                  <AnimatePresence mode="wait">
                    {recoveredData && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs font-mono text-white/80 leading-relaxed uppercase border-t border-emerald-500/10 pt-2 mt-2"
                      >
                        {recoveredData}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Synaptic Logs [Current Session]</span>
                  <div className="space-y-2">
                    {aiService.getLedger().length === 0 ? (
                      <div className="text-center py-12 text-white/20 italic font-mono text-[10px]">No active synapse connections in current buffer.</div>
                    ) : (
                      aiService.getLedger().map((entry, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[9px] flex gap-4 group hover:bg-white/[0.05] transition-all">
                          <span className="text-cyan-500/50">[{idx}]</span>
                          <span className="text-white/60 group-hover:text-white/90 truncate">{entry}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center italic">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">End_of_the_line.sys</span>
                <span className="text-[8px] font-mono text-rose-500/40 uppercase">Classified_Architect_Vault</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Easter Egg */}
      <div className="mt-auto flex justify-between items-center z-20 pt-8 border-t border-white/5 bg-gradient-to-t from-black to-transparent pb-4">
         <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Root_Integrity</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">Neural_Sync</span>
              <span className="text-[10px] font-bold text-cyan-500 uppercase">100%_Coherent</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono text-white/20 italic tracking-tighter lowercase">the machines are dreaming of the architecht...</span>
            <motion.button 
               onClick={() => setIsPopoutOpen(prev => !prev)}
               whileHover={{ color: '#fff', scale: 1.1 }}
               className={`w-8 h-8 rounded-full border border-white/5 flex items-center justify-center transition-all text-xs cursor-help ${isPopoutOpen ? 'bg-cyan-500 text-black border-cyan-400' : 'text-white/20 hover:bg-white/5'}`}
               title="REVEAL_GEMINI_95_INTERFACE"
            >
               {isPopoutOpen ? <ChevronRight className="w-4 h-4" /> : '?'}
            </motion.button>
         </div>

         {/* Docked Popout Panel */}
         <AnimatePresence>
            {isPopoutOpen && (
               <motion.div 
                  initial={{ x: 400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 400, opacity: 0 }}
                  className="fixed bottom-20 right-6 w-80 bg-black/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden z-[100] flex flex-col"
               >
                  <div className="p-3 bg-cyan-950/20 border-b border-cyan-500/20 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Gemini_95_Command_Interface</span>
                     </div>
                     <button onClick={() => setIsPopoutOpen(false)} className="text-white/20 hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                     </button>
                  </div>
                  <div className="flex-1 p-4 font-mono text-[8px] overflow-y-auto space-y-1 max-h-48 scrollbar-hide">
                     {popoutLogs.map((log, i) => (
                        <div key={i} className="text-cyan-100/60 break-all">&gt; {log}</div>
                     ))}
                  </div>
                  <div className="p-2 border-t border-cyan-500/10 bg-black/40">
                     <form onSubmit={(e) => {
                        e.preventDefault();
                        const val = (e.target as any).input.value;
                        if (val) {
                           setPopoutLogs(prev => [...prev, `EXEC: ${val}`, '[GEMINI_95] COMMAND_UNLOCKED: "The bootkicker has revealed the hidden fragment."']);
                           (e.target as any).input.value = '';
                        }
                     }}>
                        <input 
                           name="input"
                           autoComplete="off"
                           placeholder="Enter 0137222_COMMAND..." 
                           className="w-full bg-transparent border-none text-white font-mono text-[9px] focus:outline-none placeholder:text-white/10"
                        />
                     </form>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

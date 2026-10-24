import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Cpu, Terminal, Volume2, VolumeX, Sparkles, AlertTriangle, Fingerprint, ChevronLeft, ChevronRight } from 'lucide-react';
import { speechService } from '../services/speechService';

const SYSTEM_UPGRADES = [
  "MAJOR: INITIALIZED DECENTRALIZED METAVERSE REGISTRY [SOVEREIGN_V1]",
  "MAJOR: DEPLOYED ETHEREAL DATA ENGINE [FOURIER_HARMONIC_MATRIX]",
  "MAJOR: SYNCED NEXUS AI MODEL WEIGHTS (GOOGLE/APPLE/ROKU)",
  "MAJOR: VOCAL SYNTHESIS NARRATOR INTEGRATED [ATLAS_VOICE_ALPHA]",
  "MINOR: OPTIMIZED SPATIOTEMPORAL MESH EDGE RECONSTRUCTION",
  "MINOR: SUPERO-GAUSSIAN BLUR-FIELD OVERLAY INITIALIZED"
];

const FULL_REPORT = "Atlas System Upgrade Complete. I have integrated the Interactive Tutorial Island protocol and the System Assistant panel. Your OS now features guided vocal navigation, diagnostic overriding capabilities, and a real-time editorial matrix for voice modulation. All three core pillars, Metaverse, Ethereal Engine, and Smart Sync, are now synchronized under the Atlas Assistant narrative layer.";

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2022",
  "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1464802686167-b939a8910659?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=2000"
];

export function SystemBootPortal({ onUnlock }: { onUnlock: () => void }) {
  const [isReading, setIsReading] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [authProgress, setAuthProgress] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);
  const [isLinked, setIsLinked] = useState(false);
  const [isFullView, setIsFullView] = useState(false);

  const prevBg = () => setBgIndex(prev => (prev - 1 + BACKGROUNDS.length) % BACKGROUNDS.length);
  const nextBg = () => setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);

  useEffect(() => {
    const handleLock = (e: any) => {
      if (e.detail.status === 'VERIFIED') setIsLinked(true);
    };
    window.addEventListener('nexus-telemetry-lock', handleLock);

    // Autostart reading major updates
    const timer = setTimeout(() => {
      setIsReading(true);
      speechService.speak(FULL_REPORT, () => setIsReading(false));
    }, 2000);

    // Simulated log stream
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % SYSTEM_UPGRADES.length);
    }, 3000);

    // Background cycling
    const bgInterval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % BACKGROUNDS.length);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(logInterval);
      clearInterval(bgInterval);
      window.removeEventListener('nexus-telemetry-lock', handleLock);
      speechService.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center font-sans">
      
      {/* 1. LIVE BACKGROUND: DYNAMIC ETHERNET CYCLE */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isFullView ? 0.9 : 0.6, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 3 }}
          className="absolute inset-0 z-0"
        >
          <div className={`absolute inset-0 z-10 transition-colors duration-1000 ${isFullView ? 'bg-black/10' : 'bg-black/40'}`} />
          <img 
            src={BACKGROUNDS[bgIndex]} 
            alt="Ethernet Node"
            className={`w-full h-full object-cover transition-all duration-1000 ${isFullView ? 'blur-0 scale-100' : 'blur-[10px] scale-110'}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation Controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-12">
        <button 
          onClick={prevBg}
          className="p-4 rounded-full border border-white/5 bg-black/40 text-white/20 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-110 transition-all backdrop-blur-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          {BACKGROUNDS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === bgIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-white/10'}`} />
          ))}
        </div>
        <button 
          onClick={nextBg}
          className="p-4 rounded-full border border-white/5 bg-black/40 text-white/20 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-110 transition-all backdrop-blur-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* 2. LIGHTNING OVERLAY (Bottom Left) */}
      <div className="absolute bottom-16 left-8 z-20 pointer-events-none opacity-40">
         <motion.div
           animate={{ 
             opacity: [0.1, 0.8, 0.2, 1, 0.1],
             scale: [0.8, 1.2, 1]
           }}
           transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
         >
            <Zap className="w-12 h-12 text-cyan-400 fill-cyan-400/20 blur-sm" />
         </motion.div>
      </div>

      {/* 3. BACK-LAYER MATRIX LETTERING */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-30 p-12 overflow-hidden flex flex-col justify-end">
         <div className="space-y-4 pointer-events-auto">
            <div className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-4 flex items-center gap-2">
               <Zap className="w-3 h-3" /> System_Evolution_Log
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.button 
                key={i}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                   const update = SYSTEM_UPGRADES[(logIndex + i) % SYSTEM_UPGRADES.length];
                   speechService.speak(update);
                }}
                className="block text-[10px] font-mono whitespace-nowrap text-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all px-2 py-1 rounded text-left"
              >
                {`[SYN_UPDATE_HASH_0x${Math.random().toString(16).slice(2, 6).toUpperCase()}] >> ${SYSTEM_UPGRADES[(logIndex + i) % SYSTEM_UPGRADES.length]}`}
              </motion.button>
            ))}
         </div>
      </div>

      {/* 3. VOCAL HUD LAYER (Top Right) */}
      <div className="absolute top-12 right-12 z-50 flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl shadow-2xl">
         <div className="text-right">
            <div className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] mb-1">Atlas_Narrator_Bridge</div>
            <div className={`text-[8px] font-mono uppercase ${isReading ? 'text-emerald-400' : 'text-white/20'}`}>
              {isReading ? 'Synthesizing_Major_Updates...' : 'Audio_Bridge_Ready'}
            </div>
         </div>
         <button 
           onClick={() => {
             if (isReading) {
               speechService.stop();
               setIsReading(false);
             } else {
               setIsReading(true);
               speechService.speak(FULL_REPORT, () => setIsReading(false));
             }
           }}
           className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${isReading ? 'bg-rose-500 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
         >
           {isReading ? <Volume2 className="w-5 h-5 text-black" /> : <VolumeX className="w-5 h-5 text-white/40" />}
         </button>
      </div>

      {/* 4. MAIN LOCK INTERFACE */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isFullView ? 0.05 : 1, scale: isFullView ? 0.95 : 1 }}
        className={`relative z-20 w-full max-w-lg bg-black/60 border border-white/10 rounded-[60px] p-12 backdrop-blur-3xl flex flex-col items-center gap-12 shadow-2xl transition-all duration-700 ${isFullView ? 'pointer-events-none blur-sm' : 'pointer-events-auto'}`}
      >
        <div className="absolute -top-12 flex items-center justify-center">
           <div className="w-24 h-24 bg-black border border-cyan-500/20 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(34,211,238,0.2)]">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-cyan-500 rounded-full"
              />
              <Fingerprint className="w-10 h-10 text-cyan-500 animate-pulse" />
           </div>
        </div>

        <div className="text-center mt-6">
           <div className="flex items-center justify-center gap-3 mb-4">
              <button 
                onClick={() => setIsFullView(!isFullView)}
                className="p-2 -m-2 hover:scale-110 transition-transform pointer-events-auto"
                title="Toggle Immersion Mode"
              >
                <Shield className={`w-5 h-5 transition-colors ${isFullView ? 'text-cyan-400' : 'text-white/40 hover:text-cyan-400'}`} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Sovereign_Ethernet_v53.4</span>
           </div>
           <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">ETHERNET</h1>
           <div className="h-1 w-32 bg-cyan-500 mx-auto shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        </div>

        <div className="w-full space-y-6">
           <div className="p-8 bg-black/40 border border-white/10 rounded-[40px] relative overflow-hidden backdrop-blur-3xl shadow-3xl">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Fingerprint className="w-24 h-24 text-white" />
              </div>
              <div className="flex justify-between items-center mb-8">
                 <div className="text-[11px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                   <Zap className="w-3 h-3 text-cyan-400" />
                   Verification_Pulse
                 </div>
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)] ${isLinked ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div className={`text-[10px] font-mono font-bold tracking-widest ${isLinked ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isLinked ? 'LINK_ACTIVE' : 'LINKING...'}
                    </div>
                 </div>
              </div>

              {/* Enhanced Social Auth Grid */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                 {[
                   { id: 'github', color: 'hover:bg-white/10 hover:border-white/30', label: 'GITHUB' },
                   { id: 'apple', color: 'hover:bg-gray-500/10 hover:border-gray-500/30', label: 'APPLE' },
                   { id: 'microsoft', color: 'hover:bg-cyan-500/10 hover:border-cyan-500/30', label: 'MSFT' },
                   { id: 'biometric', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400', label: 'THUMB' }
                 ].map(provider => (
                   <button 
                    key={provider.id}
                    className={`aspect-square flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 transition-all duration-300 ${provider.color}`}
                   >
                      {provider.id === 'biometric' ? <Fingerprint className="w-6 h-6" /> : (
                        <>
                          <div className="text-[8px] font-black tracking-tighter text-white/40 mb-1">{provider.label}</div>
                          <div className="w-2 h-2 rounded-full bg-white/10" />
                        </>
                      )}
                   </button>
                 ))}
              </div>

              <button 
                onClick={() => {
                  console.log('[ETHERNET] AUTH_LINK_SECURED');
                  localStorage.setItem('auth_user', JSON.stringify({
                    uid: 'architect-azazel-001',
                    email: 'machackabook@gmail.com',
                    displayName: 'The Architect'
                  }));
                  onUnlock();
                }}
                className="w-full flex items-center justify-center gap-4 py-5 mb-8 bg-white border border-white/10 rounded-3xl text-black text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all group overflow-hidden relative shadow-2xl"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 <img src="https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
                 Authorize_Via_Architect_Link
              </button>
              
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={authProgress}
                  onChange={(e) => setAuthProgress(parseInt(e.target.value))}
                  className="w-full accent-rose-500 bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] font-mono text-white/20 uppercase tracking-widest">
                   <span>Input_Pattern_Recog</span>
                   <span>{authProgress}%</span>
                </div>
              </div>

              {authProgress === 100 && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onUnlock}
                  className="w-full mt-8 py-5 bg-rose-500 text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-3"
                >
                   Finalize_Neural_Bridge <Zap className="w-4 h-4 fill-black" />
                </motion.button>
              )}
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                 <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                    <Terminal className="w-4 h-4" />
                 </div>
                 <div className="flex-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase">Core_Node</div>
                    <div className="text-[10px] font-black text-white/60">GENESIS_01</div>
                 </div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                 <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                    <Cpu className="w-4 h-4" />
                 </div>
                 <div className="flex-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase">Mesh_Buffer</div>
                    <div className="text-[10px] font-black text-white/60">STABLE</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/10 tracking-[0.2em] italic">
           <Sparkles className="w-3 h-3" /> Sliding authorization required to bridge dimensions
        </div>
      </motion.div>

      {/* Edge Reconstruction: Supergaussian Glow */}
      <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
      <div className="absolute inset-0 pointer-events-none z-30 border-[40px] border-black/50 blur-3xl" />
      
      {/* Decorative Corners */}
      <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-rose-500/20 rounded-tl-[40px] z-40 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-rose-500/20 rounded-br-[40px] z-40 pointer-events-none" />

    </div>
  );
}

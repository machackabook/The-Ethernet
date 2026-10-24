import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Map, Lock, Unlock, Zap, Cpu, Terminal, ArrowRight, Layers, Globe, Radio } from 'lucide-react';

export function DeepLinkAnalysis() {
  // 3DES reduction state
  const [k1, setK1] = useState(1);
  const [k2, setK2] = useState(2);
  const [k3, setK3] = useState(3);
  const [desMode, setDesMode] = useState('3DES-EDE3');

  // Atlas mapping state
  const [mapOverride, setMapOverride] = useState(false);
  const [activeZone, setActiveZone] = useState('LOCAL');

  useEffect(() => {
    if (k1 === k3 && k2 === k3) {
      setDesMode('SINGLE-KEY DES (IDENTITY)');
    } else if (k1 === k3 || k2 === k3) {
      setDesMode('2-KEY 3DES (REDUCED)');
    } else {
      setDesMode('3DES-EDE3 (FULL)');
    }
  }, [k1, k2, k3]);

  const toggleAtlasOverride = () => {
    setMapOverride(!mapOverride);
    if (!mapOverride) {
      setActiveZone('ALL (SOVEREIGN)');
    } else {
      setActiveZone('LOCAL');
    }
  };

  return (
    <div className="w-full h-full bg-black text-white p-8 overflow-y-auto scrollbar-hide font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Deep_Link_Analysis</h1>
          <div className="flex gap-4">
             <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded border border-cyan-400/20">Protocol: 3DES_REDUCTION_READY</span>
             <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded border border-emerald-400/20">Mapping: ATLAS_BYPASS_AUTHORIZED</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 3DES Mathematical Reduction Module */}
          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Lock className="w-24 h-24 text-cyan-500" />
             </div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-cyan-500/10 rounded-2xl">
                      <Layers className="w-6 h-6 text-cyan-400" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase italic tracking-widest">3DES_Reduction_Space</h2>
                      <p className="text-[9px] font-mono text-white/30 uppercase">Tri-Key Cryptographic Displacement</p>
                   </div>
                </div>

                <div className="space-y-8 mb-10 text-[11px] font-mono">
                   {[
                     { id: 'k1', label: 'Key_Index_1', val: k1, set: setK1 },
                     { id: 'k2', label: 'Key_Index_2', val: k2, set: setK2 },
                     { id: 'k3', label: 'Key_Index_3', val: k3, set: setK3 },
                   ].map((slider) => (
                     <div key={slider.id} className="space-y-3">
                        <div className="flex justify-between uppercase">
                           <span className="text-white/40">{slider.label}</span>
                           <span className="text-cyan-400 font-bold">K_{slider.val}</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" max="3" step="1"
                          value={slider.val}
                          onChange={(e) => slider.set(parseInt(e.target.value))}
                          className="w-full accent-cyan-500 bg-white/10 rounded-lg h-1.5 appearance-none cursor-pointer"
                        />
                     </div>
                   ))}
                </div>

                <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl flex items-center justify-between">
                   <div>
                      <div className="text-[10px] font-black uppercase text-cyan-400/60 mb-2">Mathematical Equivalent</div>
                      <div className="text-lg font-black uppercase italic tracking-tighter text-white">{desMode}</div>
                   </div>
                   <div className={`p-4 rounded-full border ${desMode.includes('SINGLE') ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                      {desMode.includes('SINGLE') ? <Unlock /> : <Shield />}
                   </div>
                </div>
             </div>
          </section>

          {/* Atlas Mapping Override Module */}
          <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Globe className="w-24 h-24 text-emerald-500" />
             </div>

             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-3 bg-emerald-500/10 rounded-2xl">
                      <Map className="w-6 h-6 text-emerald-400" />
                   </div>
                   <div>
                      <h2 className="text-xl font-black uppercase italic tracking-widest">Atlas_Sovereignty</h2>
                      <p className="text-[9px] font-mono text-white/30 uppercase">Global Node Illumination Hub</p>
                   </div>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl font-mono">
                      <div>
                         <div className="text-[10px] font-black uppercase text-white/40 mb-1 tracking-widest">Bypass: atlas:override</div>
                         <div className="text-xs font-bold text-emerald-400 uppercase">--force --zone=all</div>
                      </div>
                      <button 
                        onClick={toggleAtlasOverride}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mapOverride ? 'bg-emerald-500 text-black shadow-[0_0_30px_#10b981]' : 'border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10'}`}
                      >
                        {mapOverride ? 'DEACTIVATE' : 'INJECT'}
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                         <div className="text-white/30 uppercase mb-2">Current_Zone</div>
                         <div className="font-bold text-white uppercase truncate">{activeZone}</div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                         <div className="text-white/30 uppercase mb-2">Relay_Path</div>
                         <div className="font-bold text-white uppercase italic">3DES_TUNNEL_01</div>
                      </div>
                   </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-center gap-4">
                   <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                      <Radio className="w-4 h-4 animate-pulse" />
                   </div>
                   <p className="text-[8px] font-mono text-emerald-400/60 uppercase leading-relaxed italic">
                     High-privilege overrides registered. Chromium engine flags #enable-unframed-iwa and #enable-isolated-web-app-dev-mode are currently suppressing standard Atlas zone restrictions.
                   </p>
                </div>
             </div>
          </section>
        </div>

        {/* Global Terminal Feed */}
        <section className="mt-12 bg-black border border-white/10 rounded-3xl p-6 font-mono overflow-hidden">
           <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-4 h-4 text-white/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Sovereign_Console // sudo -S access authorized</span>
           </div>
           <div className="space-y-1 text-[10px] text-emerald-400/80 uppercase">
              <p className="flex gap-2"><span>[0.0012]</span> <span className="text-white/40">nexus:</span> <span>INITIALIZING_3DES_SPACE_TRACKING...</span></p>
              <p className="flex gap-2"><span>[0.0045]</span> <span className="text-white/40">nexus:</span> <span>DETECTION_GATE_STRIPPED.</span></p>
              <p className="flex gap-2"><span>[0.0089]</span> <span className="text-white/40">nexus:</span> <span>PORT_8888_GAIA_LINK_OPEN.</span></p>
              <motion.p 
                animate={{ opacity: [0, 1, 0.5, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex gap-2"
              >
                <span>[SYNC]</span> <span className="text-white/40">nexus:</span> <span className="text-cyan-400 animate-pulse">LISTENING_FOR_UNCONSTRAINED_SIGNALS_...</span>
              </motion.p>
           </div>
        </section>
      </div>
    </div>
  );
}

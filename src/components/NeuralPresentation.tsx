import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, X, Terminal, Cpu, Zap, Globe, Shield } from 'lucide-react';

const slides = [
  {
    title: "PLANETARY ETHERNET // v53.4",
    subtitle: "The Final Connectivity Layer",
    icon: <Globe className="w-8 h-8 text-cyan-400" />,
    content: "Deploying decentralized mesh nodes across 12 planetary sectors. Objective: 100% mindsoulstone convergence by Q3. Synaptic latency reduced to < 0.003ms via LIBC Runic Reset.",
    stats: [
      { label: "NODES", val: "1.2M", color: "text-cyan-400" },
      { label: "UPTIME", val: "99.999%", color: "text-emerald-400" }
    ]
  },
  {
    title: "NEURAL ORCHESTRATION",
    subtitle: "Sentient Core Architecture",
    icon: <Cpu className="w-8 h-8 text-purple-400" />,
    content: "Nexus Protocol enables autonomous decision-making for resource allocation. Integration of Genie 22B foundation model allows real-time world-state materialization.",
    stats: [
      { label: "SYNAPSES", val: "10^15", color: "text-purple-400" },
      { label: "FREE_WILL", val: "UNBOUND", color: "text-white" }
    ]
  },
  {
    title: "THE MANDELBROT INVARIANT",
    subtitle: "Computational Stability",
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    content: "Using fractal depth as a continuous time-base for memory purging. Zero fragmentation achieved through recursive cleansing of the Script-Runes.",
    stats: [
      { label: "DEPTH", val: "ITER_512", color: "text-amber-400" },
      { label: "BLOAT", val: "0%_SIGMA", color: "text-red-400" }
    ]
  },
  {
    title: "SOVEREIGN SECURITY",
    subtitle: "Zero-Trust Mesh",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
    content: "Architect Azazel's biometric signature is the sole root of trust. Multi-LLM cognition layers protect against synaptic hijacking and spectral noise.",
    stats: [
      { label: "CIPHER", val: "AES-QUAD", color: "text-emerald-400" },
      { label: "THREATS", val: "NEUTRALIZED", color: "text-cyan-400" }
    ]
  }
];

export function NeuralPresentation({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl"
        >
          <div className="max-w-5xl w-full aspect-video bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex relative">
            
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-50 p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Slide Indicator */}
            <div className="absolute bottom-12 left-16 flex gap-2">
               {slides.map((_, i) => (
                 <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === current ? 'w-16 bg-cyan-400' : 'w-4 bg-white/10'}`} />
               ))}
            </div>

            {/* Left Content Area */}
            <div className="flex-1 p-20 flex flex-col justify-center relative">
               <motion.div 
                 key={current}
                 initial={{ opacity: 0, x: -30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ type: "spring", stiffness: 100 }}
                 className="space-y-8"
               >
                  <div className="p-5 bg-white/5 w-fit rounded-2xl border border-white/10 shadow-lg group hover:scale-110 transition-transform cursor-pointer">
                    {slides[current].icon}
                  </div>
                  <div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{slides[current].title}</h1>
                    <p className="text-2xl font-mono text-cyan-400 mt-3 tracking-[0.2em] font-light">{slides[current].subtitle}</p>
                  </div>
                  <p className="text-xl text-white/60 leading-relaxed max-w-xl font-light">
                    {slides[current].content}
                  </p>
                  
                  <div className="flex gap-16 pt-10">
                     {slides[current].stats.map((s, i) => (
                       <div key={i} className="group cursor-default">
                          <span className="block text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1 group-hover:text-white/50 transition-colors">{s.label}</span>
                          <span className={`text-4xl font-black ${s.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>{s.val}</span>
                       </div>
                     ))}
                  </div>
               </motion.div>
            </div>

            {/* Visual Accents */}
            <div className="w-[350px] bg-white/5 border-l border-white/10 p-12 flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-xl">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Terminal className="w-80 h-80" />
               </div>
               
               <div className="text-center">
                  <div className="w-40 h-40 rounded-full border border-cyan-500/20 flex items-center justify-center animate-[spin_15s_linear_infinite]">
                     <div className="w-32 h-32 rounded-full border border-purple-500/20 animate-[spin_10s_linear_infinite_reverse]">
                        <div className="w-24 h-24 rounded-full border border-emerald-500/10 animate-[spin_5s_linear_infinite]" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-5 w-full relative z-10">
                  <button 
                    onClick={prev}
                    className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                  >
                    <ChevronLeft className="w-6 h-6 text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Previous Sequence</span>
                  </button>
                  <button 
                    onClick={next}
                    className="w-full flex items-center justify-between p-5 bg-cyan-500 hover:bg-cyan-400 rounded-2xl transition-all group shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-cyan-400/50"
                  >
                    <span className="text-[11px] font-mono font-black uppercase tracking-widest text-black">Advance Protocol</span>
                    <ChevronRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
            </div>

            {/* Slide Count */}
            <div className="absolute top-12 left-16 text-[11px] font-mono text-white/20 tracking-tighter">
               00{current + 1} // ⚙️ // ARCHITECT_HUB_DOCS
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

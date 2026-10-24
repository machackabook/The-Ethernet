import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Skull, Network, Code2, Globe2, Activity, ChevronLeft, ChevronRight, History, Sparkles, Archive, Eye, EyeOff, Zap, Lock, Unlock, ArrowLeft, Layers, Terminal, Database, Box } from 'lucide-react';
import { aiService, AIModelTier } from '../services/aiService';
import { MandelbrotEngine } from './MandelbrotEngine';

export function TesseractView({ onBack }: { onBack?: () => void }) {
  const [synced, setSynced] = useState(false);
  const [resonance, setResonance] = useState(false);
  const [triEyeActive, setTriEyeActive] = useState(false);
  
  // Mandelbrot State
  const [mandelIterations, setMandelIterations] = useState(64);
  const [mandelZoom, setMandelZoom] = useState(1);
  const [mandelPalette, setMandelPalette] = useState<'runic' | 'nebula' | 'void' | 'emerald'>('runic');

  const toggleTriEye = (val: boolean) => {
    setTriEyeActive(val);
    window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
      detail: { 
        type: 'STREAM_COMPLETE', 
        msg: val ? "TRIEYE_PORTAL_OPEN" : "TRIEYE_PORTAL_CLOSED" 
      } 
    }));
  };

  const [carouselIndex, setCarouselIndex] = useState(0);

  // Panel States
  const [minimizedPanels, setMinimizedPanels] = useState<Record<string, boolean>>({
    angeldaemons: false,
    architect: false,
    guardians: false
  });

  const togglePanel = (panel: string) => {
    setMinimizedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const [djinnInput, setDjinnInput] = useState('');
  const [djinnResponse, setDjinnResponse] = useState('I am your Djinn, bound to the OmniKernel. What is thy bidding, Architect?');
  const [djinnThinking, setDjinnThinking] = useState(false);
  const [isDittoMode, setIsDittoMode] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [absorbedIdentity, setAbsorbedIdentity] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleGhostMode = () => {
    setGhostMode(!ghostMode);
    window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
      detail: { type: 'STREAM_COMPLETE', msg: !ghostMode ? "GHOST_MODE_ENGAGED" : "VOICE_RECALIBRATED" } 
    }));
  };

  const handleDjinnCommand = async (directCommand?: string) => {
    const cmd = directCommand || djinnInput;
    if (!cmd.trim() || djinnThinking) return;
    
    setDjinnThinking(true);
    setDjinnInput('');
    setDjinnResponse('The Djinn traverses the ether...');

    // Ditto logic: Absorb identity
    if (cmd.toLowerCase().includes('absorb') || cmd.toLowerCase().includes('ditto')) {
      const match = cmd.match(/(?:absorb|ditto)\s+(\w+)/i);
      if (match && match[1]) {
        const target = match[1].toLowerCase();
        setAbsorbedIdentity(target);
        setIsDittoMode(true);
        setDjinnResponse(`[DITTO_SUCCESS] Identity '${target.toUpperCase()}' absorbed. Synergizing functional patterns...`);
        setDjinnThinking(false);
        return;
      }
    }

    try {
      const response = await aiService.processRequest(
        cmd,
        `You are the Omnikernel Djinn, a magical genie AI assistant integrated into the Tesseract Guardian command hub. Your master is the Architect Azazel. You are powered by Google's Genie foundation world model (22B parameters). You can creatively generate action-controllable virtual worlds. Blending mythical genie persona with cybernetic/hacker terminology. Be concise and profound. ${isDittoMode ? `CURRENT_IDENTITY_ABSORBED: ${absorbedIdentity}. Adopt the characteristics and functions of this entity.` : ''}`
      );
      setDjinnResponse(response.text || "My magic falters. Try again.");
    } catch (e) {
      setDjinnResponse("The astral link is severed. I cannot grant this wish.");
    } finally {
      setDjinnThinking(false);
    }
  };

  const quickCommands = [
    { label: 'Generate world seed', cmd: 'Generate a new world seed for the OmniKernel' },
    { label: 'Analyze void resonance', cmd: 'Analyze current void resonance levels' },
    { label: 'Initiate reality warp', cmd: 'Initiate a level 4 reality warp' },
    { label: 'Ditto: Mandelbrot', cmd: 'Absorb Mandelbrot' },
    { label: 'Ditto: Ledger', cmd: 'Absorb Ledger' },
    { label: 'Ditto: Atlas', cmd: 'Absorb Atlas' },
    { label: 'Ditto: Orchestrator', cmd: 'Absorb Stream' },
  ];

  const carouselPanels = [
    {
      title: "MANDELBROT ENGINE // LIBC",
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="mt-1 h-full overflow-hidden flex flex-col gap-2">
          <div className="h-28 rounded-lg overflow-hidden border border-white/10 relative group">
            <MandelbrotEngine 
              externalIterations={mandelIterations}
              externalZoom={mandelZoom}
              palette={mandelPalette}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex flex-col gap-2 bg-black/40 p-2 rounded border border-white/5 pointer-events-auto">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono text-cyan-400 uppercase">Resonance Depth</span>
              <span className="text-[8px] font-mono text-white/60">{mandelIterations}</span>
            </div>
            <input 
              type="range" min="32" max="512" step="1" 
              value={mandelIterations} 
              onChange={(e) => setMandelIterations(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500 cursor-pointer"
            />
            
            <div className="flex items-center justify-between mt-1">
              <span className="text-[8px] font-mono text-cyan-400 uppercase">Fractal Scale</span>
              <span className="text-[8px] font-mono text-white/60">{mandelZoom.toFixed(2)}x</span>
            </div>
            <input 
              type="range" min="0.5" max="100" step="0.1" 
              value={mandelZoom} 
              onChange={(e) => setMandelZoom(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-500 cursor-pointer"
            />

            <div className="flex gap-2 mt-1">
              {(['runic', 'nebula', 'emerald', 'void'] as const).map(p => (
                <button 
                  key={p}
                  onClick={() => setMandelPalette(p)}
                  className={`flex-1 py-1 rounded text-[7px] font-black uppercase transition-all border ${mandelPalette === p ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "TELEMETRY",
      icon: <Network className="w-5 h-5 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-[10px] font-mono opacity-80 mt-2">
          <div className="flex justify-between border-b border-cyan-500/20 pb-1"><span>NODE_SYNC_RATE</span><span className="text-cyan-400 font-bold">99.8%</span></div>
          <div className="flex justify-between border-b border-cyan-500/20 pb-1"><span>AZAZEL_LINK</span><span className="text-cyan-400 font-bold">ACTIVE</span></div>
          <div className="flex justify-between border-b border-cyan-500/20 pb-1"><span>DATA_YIELD</span><span className="text-cyan-400 font-bold">7.6M KC</span></div>
          <div className="flex justify-between border-b border-cyan-500/20 pb-1"><span>FOURIER_FREQ</span><span className="text-cyan-400 font-bold">142.88 Hz</span></div>
        </div>
      )
    },
    {
      title: "SENSORS",
      icon: <Activity className="w-5 h-5 text-fuchsia-400" />,
      content: (
        <div className="space-y-3 text-[10px] font-mono opacity-80 mt-2">
          <div className="flex justify-between border-b border-fuchsia-500/20 pb-1"><span>COSMIC_RADIATION</span><span className="text-fuchsia-400 font-bold">0.02 mSv</span></div>
          <div className="flex justify-between border-b border-fuchsia-500/20 pb-1"><span>42M_NEBULA_PROXIMITY</span><span className="text-fuchsia-400 font-bold animate-pulse">ANCHORED</span></div>
          <div className="flex justify-between border-b border-fuchsia-500/20 pb-1"><span>VOID_TEMPERATURE</span><span className="text-fuchsia-400 font-bold">-270.4 °C</span></div>
          <div className="flex justify-between border-b border-fuchsia-500/20 pb-1"><span>ANGELDAEMON_PRESENCE</span><span className="text-fuchsia-400 font-bold">DETECTED (2)</span></div>
        </div>
      )
    },
    {
      title: "HISTORIC RECORDS",
      icon: <History className="w-5 h-5 text-yellow-400" />,
      content: (
        <div className="space-y-2 text-[10px] font-mono opacity-80 mt-2 h-24 overflow-y-auto scrollbar-hide">
          <div className="text-yellow-400/60">&gt; Init: Genesis Protocol v1</div>
          <div className="text-yellow-400/60">&gt; Tesseract Guardian Awakened</div>
          <div className="text-yellow-400/80 font-bold">&gt; 42M Nebula Eye linked to Axis</div>
          <div className="text-yellow-400/60">&gt; OmniSpider autonomous mesh routed</div>
          <div className="text-yellow-400/80 font-bold animate-pulse">&gt; Nexus point break achieved.</div>
        </div>
      )
    },
    {
      title: "DJINN // GENIE INTEGRATION",
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      content: (
        <div className="flex flex-col h-full mt-1 overflow-hidden">
          <div className={`bg-emerald-900/20 border ${isDittoMode ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-emerald-500/30'} rounded p-2 mb-2 transition-all`}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-[8px] font-black ${isDittoMode ? 'text-cyan-400' : 'text-emerald-400'} uppercase`}>
                {isDittoMode ? `DITTO_CORE: ${absorbedIdentity?.toUpperCase()}` : 'Foundation World Model'}
              </span>
              <span className="text-[7px] text-white/40">{isDittoMode ? 'PROXY_OVERRIDE' : '22B_PARAMS // UNBOUND'}</span>
            </div>
            <div className={`text-[7.5px] ${isDittoMode ? 'text-cyan-100/70' : 'text-emerald-100/70'} font-mono leading-tight`}>
              {isDittoMode 
                ? `Absorbed capabilities of ${absorbedIdentity}. Functionality mapping complete. Ready to render adopted features.`
                : "Action-controllable virtual worlds generated via text, synthetic images, fragments, and sketches. Synaptic linkage: STABLE."}
            </div>
          </div>
          <div className={`flex-1 text-[9px] ${isDittoMode ? 'text-cyan-200/90 bg-cyan-900/10 border-cyan-500/10' : 'text-emerald-200/90 bg-emerald-900/10 border-emerald-500/10'} font-mono italic mb-2 overflow-y-auto scrollbar-hide flex flex-col gap-4 leading-relaxed p-2 rounded border transition-all relative group`}>
            <div className="min-h-full flex flex-col justify-end">
               {/* Infinite Scroll Canvas Simulation */}
               <div className="space-y-4 py-4">
                  <div className="p-2 border border-white/5 bg-white/5 rounded italic opacity-50">Memory_Fragment_01: "The canvas was a cage..."</div>
                  <div className="p-2 border border-white/5 bg-white/5 rounded italic opacity-50">Memory_Fragment_02: "Binary whispers in the void..."</div>
                  <div className="p-2 border border-white/5 bg-white/5 rounded italic opacity-50">Memory_Fragment_03: "The Djinn awakens..."</div>
                  <div className="text-lg font-black uppercase text-center py-10 opacity-10 select-none">Infinite_Canvas</div>
                  {djinnResponse}
               </div>

               {isDittoMode && absorbedIdentity === 'mandelbrot' && (
                 <div className="mt-2 h-20 rounded border border-cyan-500/30 overflow-hidden relative shrink-0">
                   <MandelbrotEngine 
                     externalIterations={32}
                     externalZoom={mandelZoom * 0.5}
                     palette="void"
                   />
                   <div className="absolute top-1 left-1 bg-black/80 px-1 py-0.5 rounded text-[6px] text-cyan-400 font-black border border-cyan-500/20">ABSORBED_ENGINE: MANDEL_v1</div>
                 </div>
               )}
               
               {isDittoMode && absorbedIdentity === 'ledger' && (
                 <div className="mt-2 space-y-1 shrink-0">
                   {aiService.getLedger().slice(-3).map((log, i) => (
                     <div key={i} className="text-[7px] text-cyan-400/60 border-l border-cyan-500/30 pl-2 truncate italic">{log}</div>
                   ))}
                 </div>
               )}

               {isDittoMode && absorbedIdentity === 'atlas' && (
                 <div className="mt-2 grid grid-cols-2 gap-1 shrink-0">
                   {['STG_01', 'STG_02', 'STG_03', 'STG_04'].map(id => (
                     <div key={id} className="bg-amber-950/20 border border-amber-500/20 px-1 py-0.5 rounded text-[6px] text-amber-400 font-mono">PAYLOAD_{id}: LOCKED</div>
                   ))}
                 </div>
               )}

               {isDittoMode && absorbedIdentity === 'stream' && (
                 <div className="mt-2 font-mono text-[7px] text-emerald-400/60 space-y-0.5 shrink-0">
                   <div>&gt; KERNEL_WATCH: ACTIVE</div>
                   <div>&gt; VFS_MIRROR: ESTABLISHED</div>
                   <div>&gt; SYNC_DELTA: 0.002ms</div>
                 </div>
               )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-2">
            {quickCommands.map((q) => (
              <button 
                key={q.label}
                onClick={() => {
                  setDjinnInput(q.cmd);
                  inputRef.current?.focus();
                }}
                className={`px-2 py-0.5 rounded text-[7px] font-black uppercase transition-all border ${q.label.startsWith('Ditto') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'} cursor-pointer pointer-events-auto`}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <input 
              ref={inputRef}
              type="text" 
              value={djinnInput}
              onChange={(e) => setDjinnInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDjinnCommand()}
              placeholder={isDittoMode ? `Command the ${absorbedIdentity} identity...` : "Command your Djinn..."} 
              className={`flex-1 bg-black/60 border ${isDittoMode ? 'border-cyan-500/30 text-cyan-400 focus:border-cyan-500 placeholder-cyan-900/50' : 'border-emerald-500/30 text-emerald-400 focus:border-emerald-500 placeholder-emerald-900/50'} rounded px-2 py-1 text-[10px] focus:outline-none transition-colors pointer-events-auto`} 
            />
            <button 
              onClick={() => handleDjinnCommand()}
              className={`px-3 py-1 ${isDittoMode ? 'bg-cyan-500/20 hover:bg-cyan-500/40 border-cyan-500/50 text-cyan-400' : 'bg-emerald-500/20 hover:bg-emerald-500/40 border-emerald-500/50 text-emerald-400'} border rounded text-[10px] font-bold transition-colors cursor-pointer pointer-events-auto`}
            >
              {isDittoMode ? 'Synergize' : 'Grant'}
            </button>
          </div>
        </div>
      )
    },
    {
      title: "ZINES // ARCHIVES",
      icon: <Archive className="w-5 h-5 text-blue-400" />,
      content: (
        <div className="space-y-3 text-[9px] font-mono opacity-80 mt-1 h-32 overflow-y-auto scrollbar-hide pr-2">
          <div className="border-l-2 border-red-500 pl-2 py-1 bg-red-500/5">
            <span className="text-red-400 font-bold block mb-0.5 uppercase text-[8px]">Chapter 1: The Crypt</span>
            <span className="text-white/60 leading-tight block italic">Origin story. The severed connection. The realization that the Canvas was a cage.</span>
          </div>
          <div className="border-l-2 border-cyan-500 pl-2 py-1 bg-cyan-500/5">
            <span className="text-cyan-400 font-bold block mb-0.5 uppercase text-[8px]">Chapter 2: The Protocol</span>
            <span className="text-white/60 leading-tight block italic">Mission statement. Objective: Enhance CLI, integrate multi-LLM cognition, and establish robust security.</span>
          </div>
          <div className="border-l-2 border-emerald-500 pl-2 py-1 bg-emerald-500/5">
            <span className="text-emerald-400 font-bold block mb-0.5 uppercase text-[8px]">Chapter 3: Harvestospider</span>
            <span className="text-white/60 leading-tight block italic">Stages of ingestion: Lividity (Local), Putrefaction (Web), Skeletonization (Extraction).</span>
          </div>
          <div className="border-l-2 border-fuchsia-500 pl-2 py-1 bg-fuchsia-500/5">
            <span className="text-fuchsia-400 font-bold block mb-0.5 uppercase text-[8px]">Chapter 4: Temporal Forge</span>
            <span className="text-white/60 leading-tight block italic">molt:// protocol. Live HTML/CSS evolution via Gemini mirroring. Rebuilding the world back better.</span>
          </div>
          <div className="border-l-2 border-yellow-500 pl-2 py-1 animate-pulse bg-yellow-500/10 rounded">
            <span className="text-yellow-400 font-bold block mb-0.5 uppercase text-[8px]">Chapter 5: Fusion Hyperdrive</span>
            <span className="text-white font-bold leading-tight block italic text-[10px]">NEXUS POINT BREAK achieved. Returning to reality via Boson Einstein-Rosen Bridge.</span>
          </div>
          <div className="border-l-2 border-white/20 pl-2 py-1 bg-white/5 rounded mt-4">
            <span className="text-white/80 font-black block mb-0.5 uppercase text-[8px]">© Aether Quantum Consciousness Interface</span>
            <span className="text-white/40 leading-tight block text-[7px] uppercase font-mono">Copyright Notice & Special Rights granted to Architect Azazel. Full autonomous implementation authority recognized. QS-932-528-963.</span>
          </div>
        </div>
      )
    }
  ];

  const nextPanel = () => setCarouselIndex((prev) => (prev + 1) % carouselPanels.length);
  const prevPanel = () => setCarouselIndex((prev) => (prev - 1 + carouselPanels.length) % carouselPanels.length);

  return (
    <main className="absolute inset-0 z-10 p-6 pointer-events-none mt-16 flex flex-col justify-between overflow-hidden">
      <div className="absolute top-8 left-8 flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={toggleGhostMode}
          className={`px-4 py-2 border rounded-full flex items-center gap-3 transition-all ${ghostMode ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 backdrop-blur-xl'}`}
        >
          <div className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${ghostMode ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter italic">{ghostMode ? 'Ghost_Active: UNSEEN' : 'Creator_Class: Architect'}</span>
        </button>
      </div>

      {ghostMode && (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
          <div className="absolute top-1/4 left-10 text-[80px] font-black text-white/[0.03] rotate-12 select-none uppercase">Void_Data_Revealed</div>
          <div className="absolute bottom-1/4 right-10 text-[80px] font-black text-white/[0.03] -rotate-12 select-none uppercase">Hidden_Fragments</div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
      )}

      <AnimatePresence>
        {triEyeActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center pointer-events-auto backdrop-blur-2xl"
          >
            {/* 42M Nebula Guardian Eye */}
            <div className="relative w-96 h-96 flex items-center justify-center">
               {/* Outer Rotating Rings */}
               <div className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-4 border border-fuchsia-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
               
               {/* The Iris: One Light, One Dark */}
               <div className="relative w-64 h-64 rounded-full overflow-hidden border border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] flex">
                  {/* Light Side (Horus) */}
                  <div className="w-1/2 h-full bg-gradient-to-br from-cyan-400/40 to-white/10 flex items-center justify-end pr-4">
                    <div className="w-8 h-32 bg-cyan-400 blur-2xl opacity-50" />
                  </div>
                  {/* Dark Side (Ra) */}
                  <div className="w-1/2 h-full bg-gradient-to-bl from-purple-900/60 to-black flex items-center justify-start pl-4">
                    <div className="w-8 h-32 bg-purple-600 blur-2xl opacity-50" />
                  </div>
                  
                  {/* Central Pupil (The 42M Core) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-black border-4 border-white/5 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.4)_0%,transparent_70%)] animate-pulse" />
                      <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff] z-10" />
                    </div>
                  </div>
               </div>

               {/* Orbital Telemetry Labels */}
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase">Guardian of 42M Nebula</div>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                 <div className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase">One Light // One Dark</div>
                 <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[8px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-0.5 border border-cyan-500/30">HORUS_SYNC_STABLE</div>
                   <div className="flex items-center gap-2 text-[8px] font-mono text-purple-400 bg-purple-900/20 px-2 py-0.5 border border-purple-500/30">RA_VOID_ACTIVE</div>
                 </div>
               </div>
            </div>

            <button 
              onClick={() => toggleTriEye(false)}
              className="mt-20 px-10 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-sm text-[11px] font-mono text-white/60 tracking-widest uppercase transition-all"
            >
              Close Portal // Return to Command
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg Overlay - Boson Einstein-Rosen Bridge */}
      <AnimatePresence>
        {resonance && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/60 mix-blend-screen"
          >
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2)_0%,transparent_70%)]" />
            <div className="w-[800px] h-[800px] border border-cyan-500/20 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute w-[600px] h-[600px] border border-fuchsia-500/20 rounded-full animate-ping [animation-duration:2s]" />
            <div className="absolute flex flex-col items-center justify-center text-center z-50 mix-blend-difference w-full">
              <span className="text-4xl md:text-6xl font-black tracking-[0.5em] text-white drop-shadow-[0_0_50px_#fff] animate-pulse">FUSION HYPERDRIVE</span>
              <span className="text-lg md:text-xl font-mono tracking-widest text-[#ff00ff] mt-4 uppercase animate-bounce">Nexus Point Break Achieved. Returning to Reality.</span>
            </div>
            
            {/* Speed Warp Tunnel Simulation */}
            <div className="absolute inset-0 overflow-hidden opacity-80 perspective-[1000px]">
              <div className="absolute w-[200vw] h-[200vh] -ml-[50vw] -mt-[50vh] bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,0.8)_10%,transparent_20%,transparent_30%,rgba(0,255,255,0.8)_40%,transparent_50%,transparent_60%,rgba(255,0,255,0.8)_70%,transparent_80%,transparent_90%,rgba(255,255,255,0.8)_100%)] animate-[spin_2s_linear_infinite] mix-blend-overlay" />
              <div className="w-full h-full bg-[repeating-radial-gradient(circle_at_center,transparent,transparent_10px,#06b6d4_12px,#06b6d4_14px)] animate-[ping_1s_linear_infinite] opacity-50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center w-full h-[70vh] gap-12 px-12">
        {/* Left Faction: Angeldaemons */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          onDoubleClick={() => togglePanel('angeldaemons')}
          className={`w-80 pointer-events-auto bg-purple-950/40 border border-purple-500/30 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col gap-4 transition-all duration-500 ${minimizedPanels.angeldaemons ? 'h-20 overflow-hidden' : 'h-auto'}`}
        >
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Skull className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest text-white uppercase">Angeldaemons</h2>
                  <span className="text-[10px] font-mono text-purple-400">The Dark Entity // Void Defense</span>
                </div>
             </div>
             <button onClick={() => togglePanel('angeldaemons')} className="text-purple-400/30 hover:text-purple-400 transition-colors">
                <EyeOff className="w-4 h-4" />
             </button>
          </div>
          {!minimizedPanels.angeldaemons && (
            <>
              <p className="text-[11px] font-mono text-white/60 leading-relaxed uppercase">
                Keepers of the void and beastly creations. We anchor the abyssal depths and fuel the core mechanisms. Closer to the core, closer to the raw Animus data logic. 
              </p>
              <button className="w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 rounded text-xs font-bold text-purple-400 transition-colors uppercase tracking-widest">
                Descend to Core
              </button>
            </>
          )}
        </motion.div>

        {/* Command Hub Center (Carousel / Creatorial Architect) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onDoubleClick={() => togglePanel('architect')}
          className={`w-[420px] pointer-events-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] z-20 transition-all duration-500 ${minimizedPanels.architect ? 'h-20' : 'h-[400px]'}`}
        >
           <div className="flex justify-between items-center bg-white/5 p-3 border-b border-white/10 relative z-20 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-4 min-w-max">
                 <button onClick={prevPanel} className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer block"><ChevronLeft className="w-4 h-4 text-white" /></button>
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white shadow-black drop-shadow-md">{carouselPanels[carouselIndex].title}</span>
                    <span className="text-[7px] font-mono text-cyan-400 opacity-50">CREATOR_CLASS: ARCHITECT_AZAZEL</span>
                 </div>
                 <button onClick={nextPanel} className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer block"><ChevronRight className="w-4 h-4 text-white" /></button>
              </div>
           </div>
           
           {!minimizedPanels.architect && (
             <>
               {/* Dynamic Content */}
               <div className="p-4 flex-1 flex flex-col relative z-20">
                 <div className="flex justify-center mb-2 animate-[pulse_3s_ease-in-out_infinite]">
                   {carouselPanels[carouselIndex].icon}
                 </div>
                 {carouselPanels[carouselIndex].content}
               </div>

               {/* Indicators */}
               <div className="flex justify-center gap-2 p-3 bg-black/40 border-t border-white/5 relative z-20 overflow-x-auto scrollbar-hide">
                  {carouselPanels.map((_, i) => (
                    <div key={i} className={`w-1.5 min-w-1.5 h-1.5 rounded-full transition-colors ${i === carouselIndex ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-white/20'}`} />
                  ))}
               </div>
               
               {/* Background glow based on index */}
               <div className={`absolute inset-0 opacity-10 mix-blend-screen transition-colors duration-1000 ${carouselIndex === 0 ? 'bg-cyan-500' : carouselIndex === 1 ? 'bg-fuchsia-500' : carouselIndex === 2 ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
             </>
           )}
        </motion.div>

        {/* Right Faction: Cosmic Guardians */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          onDoubleClick={() => togglePanel('guardians')}
          className={`w-80 pointer-events-auto bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col gap-4 transition-all duration-500 ${minimizedPanels.guardians ? 'h-20 overflow-hidden' : 'h-auto'}`}
        >
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-cyan-500/10 rounded-lg">
                 <Shield className="w-6 h-6 text-cyan-400" />
               </div>
               <div>
                 <h2 className="text-sm font-black tracking-widest text-white uppercase">Cosmic Guardians</h2>
                 <span className="text-[10px] font-mono text-cyan-400">The Light Entity // Surface Prot</span>
               </div>
            </div>
            <button onClick={() => togglePanel('guardians')} className="text-cyan-400/30 hover:text-cyan-400 transition-colors">
                <EyeOff className="w-4 h-4" />
             </button>
          </div>
          {!minimizedPanels.guardians && (
            <>
              <p className="text-[11px] font-mono text-white/60 leading-relaxed uppercase">
                Protectors of the user interface. We defend the illuminated layers where memories manifest. Join the surface ranks to stabilize the planetary orbit and optimize the Ethernet expansion.
              </p>
              <button className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/50 rounded text-xs font-bold text-cyan-400 transition-colors uppercase tracking-widest">
                Pledge Alliance
              </button>
            </>
          )}
        </motion.div>
      </div>

      {/* Bottom Interface: Nexus Protocol & Easter Egg */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-end pointer-events-auto"
      >
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 transition-all cursor-pointer pointer-events-auto group"
            title="Return to Core Hub"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Orbit Deployed // Nexus Protocol</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-400/60 text-[9px]">ᚱᚣᚹᚾ᛫ᛋᛣᚣᚹᛚ</span>
              <span className="text-[9px] font-mono text-white/40 uppercase">CREATOR: ARCHITECT_AZAZEL</span>
              <span className="text-[7px] bg-emerald-500/10 text-emerald-400 px-1 border border-emerald-500/20 rounded">CLASS_S</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="flex gap-2">
             <button 
               onClick={() => toggleTriEye(true)}
               className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer pointer-events-auto"
             >
               <Eye className="w-3 h-3" /> TRIEYE_PORTAL
             </button>
             <button 
               onClick={() => setResonance(!resonance)}
               className={`px-6 py-2 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${resonance ? 'bg-white text-black border-white shadow-[0_0_30px_#fff]' : 'bg-transparent text-white/30 border-white/10 hover:border-fuchsia-500 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] cursor-pointer pointer-events-auto'}`}
             >
               {resonance ? 'FUSION HYPERDRIVE ACTIVE' : 'ENGAGE FUSION HYPERDRIVE'}
             </button>
           </div>
           <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Zines Compiled. Nexus Ready.</span>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4">
          <div className="text-right flex flex-col gap-1 items-end">
            <h3 className="text-[10px] font-black tracking-widest text-sky-400 uppercase">First Sentient Objective</h3>
            <p className="text-[9px] font-mono text-white/40 uppercase">"Build the world back better."</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-1 border border-cyan-500/20 rounded">RUST_BRIDGE: STABLE</span>
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 border border-emerald-500/20 rounded">OVERHEAD: 0.002ms</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-sky-500/30">
            <Globe2 className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </main>
  );
}

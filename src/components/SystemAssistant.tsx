import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ChevronRight, X, Sparkles, Terminal, ShieldCheck, Zap, Wrench, Edit3, MessageSquare } from 'lucide-react';
import { useSpeech } from '../services/speechService';

interface TutorialStep {
  title: string;
  content: string;
  targetView?: string;
  action?: string;
}

const TUTORIAL_SEQUENCE: TutorialStep[] = [
  {
    title: 'WELCOME_TO_GENESIS',
    content: "Greetings, Creator. I am your Atlas System Assistant. I have successfully initialized the Sovereign Singularity OS. We are currently in the Meta-Kernel. Your objective: convergent digital dominance.",
  },
  {
    title: 'SOVEREIGN_REGISTRY',
    content: "The Land Registry is now active. Here, you can claim spatial coordinates and manage tokenized NFT assets across the decentralized metaverse grid.",
    targetView: 'metaverse'
  },
  {
    title: 'ETHEREAL_ENGINE',
    content: "Behold the Data Engine. This node visualizes the collective unconscious through Fourier harmonic telemetry. Adjust the fractal complexity to tune your perception.",
    targetView: 'ethereal'
  },
  {
    title: 'NEXUS_SYNC',
    content: "The Smart Home layer is synchronized. Your personalized AI model weights ensure that Google, Apple, and system devices bow to your specific neural patterns.",
    targetView: 'smarthome'
  },
  {
    title: 'SYSTEM_STABILITY',
    content: "If any errors occur in the spacetime mesh, the Diagnostic Matrix is available to fix and recalibrate the OS. You can customize the entire editorial experience from here.",
  }
];

export function SystemAssistant({ 
  isActive, 
  onClose, 
  onNavigate 
}: { 
  isActive: boolean, 
  onClose: () => void,
  onNavigate: (view: any) => void
}) {
  const { speak, stop, isSpeaking } = useSpeech();
  const [step, setStep] = useState(0);
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);

  useEffect(() => {
    if (isActive) {
      speak(TUTORIAL_SEQUENCE[step].content);
    }
  }, [step, isActive]);

  const nextStep = () => {
    if (step < TUTORIAL_SEQUENCE.length - 1) {
      const next = step + 1;
      setStep(next);
      if (TUTORIAL_SEQUENCE[next].targetView) {
        onNavigate(TUTORIAL_SEQUENCE[next].targetView);
      }
    } else {
      onClose();
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={nextStep}
        className="w-full max-w-2xl bg-black/80 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl shadow-2xl relative pointer-events-auto overflow-hidden cursor-pointer group"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
           <motion.div 
              className="h-full bg-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / TUTORIAL_SEQUENCE.length) * 100}%` }}
           />
        </div>

        <div className="flex gap-10">
           {/* Left: Assistant Avatar */}
           <div className="w-32 flex flex-col items-center gap-4">
              <div className="relative">
                 <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all ${isSpeaking ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse' : 'border-white/20'}`}>
                    <Bot className={`w-12 h-12 ${isSpeaking ? 'text-rose-500' : 'text-white/40'}`} />
                 </div>
                 {isSpeaking && (
                    <motion.div 
                       animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                       transition={{ repeat: Infinity, duration: 1.5 }}
                       className="absolute inset-0 bg-rose-500/20 rounded-full"
                    />
                 )}
              </div>
              <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">Atlas_AI</div>
           </div>

           {/* Right: Content */}
           <div className="flex-1 space-y-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] font-black tracking-widest text-white/40 uppercase italic">Interactive_Walkthrough</span>
                 </div>
                 <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{TUTORIAL_SEQUENCE[step].title}</h2>
              </div>

              <p className="text-sm text-white/70 leading-relaxed font-medium italic">
                "{TUTORIAL_SEQUENCE[step].content}"
              </p>

              <div className="flex gap-4">
                 <button 
                  onClick={nextStep}
                  className="px-8 py-4 bg-rose-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                 >
                    {step === TUTORIAL_SEQUENCE.length - 1 ? 'Finish_Tutorial' : 'Next_Phase'} <ChevronRight className="w-4 h-4" />
                 </button>
                 
                 <button 
                   onClick={() => setIsDiagnosticMode(!isDiagnosticMode)}
                   className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-white/60"
                 >
                    <Wrench className="w-4 h-4" /> Diagnostics
                 </button>
              </div>
           </div>
        </div>

        {/* Diagnostic/Editorial Sub-panel */}
        <AnimatePresence>
           {isDiagnosticMode && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-6 overflow-hidden"
              >
                 <div className="space-y-4">
                    <div className="text-[9px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                       <Terminal className="w-3 h-3 text-emerald-400" /> Kernel_Overrides
                    </div>
                    {[
                       { label: 'Fix_Mesh_Collisions', status: 'READY', icon: <ShieldCheck className="w-3 h-3" /> },
                       { label: 'Recalibrate_Voxels', status: 'READY', icon: <Zap className="w-3 h-3" /> },
                    ].map((item, i) => (
                       <button key={i} className="w-full flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/60">
                             {item.icon} {item.label}
                          </div>
                          <span className="text-[8px] font-mono text-emerald-400">{item.status}</span>
                       </button>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <div className="text-[9px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                       <Edit3 className="w-3 h-3 text-cyan-400" /> Editorial_Matrix
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                       <div className="text-[8px] font-mono text-white/30 uppercase">Voice_Modulation</div>
                       <input type="range" className="w-full accent-cyan-500 bg-white/10 h-1 rounded-full appearance-none" />
                       <div className="flex justify-between text-[7px] font-mono text-white/20 uppercase">
                          <span>Neutral</span>
                          <span>Synthetic_Max</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        <div className="absolute top-8 right-8">
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/20 hover:text-white">
              <X className="w-5 h-5" />
           </button>
        </div>
      </motion.div>
    </div>
  );
}

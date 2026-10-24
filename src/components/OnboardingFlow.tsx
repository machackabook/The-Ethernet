import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, Mic, Home, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Social Sign-Up', icon: <User className="w-8 h-8" /> },
    { title: 'Identity Verification', icon: <Phone className="w-8 h-8" /> },
    { title: 'Voiceprint Capture', icon: <Mic className="w-8 h-8" /> },
    { title: 'Device Connection', icon: <Home className="w-8 h-8" /> },
    { title: 'Animus Initialization', icon: <Sparkles className="w-8 h-8" /> },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl"
      >
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-10">Magic Box Onboarding</h2>
        
        <div className="flex gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={i} className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border ${i === step ? 'bg-cyan-500/20 border-cyan-500' : i < step ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/10'}`}>
              {s.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[200px] flex items-center justify-center mb-10">
          {/* Step-specific content would go here */}
          <p className="text-xl font-mono text-white/60">Step {step + 1}: {steps[step].title} process...</p>
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest"
        >
          {step === steps.length - 1 ? 'Complete' : 'Continue'} <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}

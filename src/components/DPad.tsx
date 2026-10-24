import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface DPadProps {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onCenter?: () => void;
  className?: string;
}

export function DPad({ onUp, onDown, onLeft, onRight, onCenter, className = "" }: DPadProps) {
  return (
    <div className={`relative w-32 h-32 flex items-center justify-center ${className}`}>
      {/* Visual ring */}
      <div className="absolute inset-0 border border-white/5 rounded-full" />
      
      {/* Up */}
      <button 
        onClick={onUp}
        className="absolute top-0 left-1/2 -translate-x-1/2 p-2 hover:text-cyan-400 group transition-colors cursor-pointer pointer-events-auto"
      >
        <ChevronUp className="w-5 h-5 opacity-40 group-hover:opacity-100" />
      </button>
      
      {/* Down */}
      <button 
        onClick={onDown}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 p-2 hover:text-cyan-400 group transition-colors cursor-pointer pointer-events-auto"
      >
        <ChevronDown className="w-5 h-5 opacity-40 group-hover:opacity-100" />
      </button>
      
      {/* Left */}
      <button 
        onClick={onLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:text-cyan-400 group transition-colors cursor-pointer pointer-events-auto"
      >
        <ChevronLeft className="w-5 h-5 opacity-40 group-hover:opacity-100" />
      </button>
      
      {/* Right */}
      <button 
        onClick={onRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:text-cyan-400 group transition-colors cursor-pointer pointer-events-auto"
      >
        <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100" />
      </button>

      {/* Center Action */}
      <button 
        onClick={onCenter}
        className="z-10 w-10 h-10 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/30 flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      >
        <Circle className="w-4 h-4 text-cyan-400" />
      </button>

      {/* Decorative Cross */}
      <div className="absolute inset-4 pointer-events-none opacity-5">
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white -translate-x-1/2" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white -translate-y-1/2" />
      </div>
    </div>
  );
}

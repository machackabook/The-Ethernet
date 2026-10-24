import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Cpu, RefreshCw, Layers } from 'lucide-react';

interface MandelbrotEngineProps {
  externalIterations?: number;
  externalZoom?: number;
  palette?: 'runic' | 'nebula' | 'void' | 'emerald';
}

export function MandelbrotEngine({ externalIterations, externalZoom, palette = 'runic' }: MandelbrotEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalIterations, setInternalIterationDepth] = useState(64);
  const [internalZoom, setInternalZoom] = useState(1);
  const [paletteShift, setPaletteShift] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [stats, setStats] = useState({ variance: 0.003, latency: '0.003ms', overhead: '0.012ms' });

  const iterations = externalIterations ?? internalIterations;
  const zoom = (externalZoom ?? internalZoom) * (1 + Math.sin(paletteShift * 0.02) * 0.2);

  const runicReset = () => {
    setIsResetting(true);
    // Simulate malloc_trim / cache_invalidate
    window.dispatchEvent(new CustomEvent('nexus-telemetry', {
      detail: { type: 'STREAM_COMPLETE', msg: 'RUST_BRIDGE_STABILIZED // LIBC_RUNIC_RESET_EXECUTED' }
    }));
    setTimeout(() => setIsResetting(false), 800);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      const pShift = paletteShift;

      // Computational intensity increased by depth and resolution check
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let a = (x - width / 2) / (zoom * width / 2);
          let b = (y - height / 2) / (zoom * height / 2);
          const ca = a;
          const cb = b;
          let i = 0;

          while (i < iterations) {
            const aa = a * a - b * b;
            const bb = 2 * a * b;
            a = aa + ca;
            b = bb + cb;
            if (a * a + b * b > 16) break;
            i++;
          }

          const pix = (x + y * width) * 4;
          let brightness = i === iterations ? 0 : (i / iterations) * 255;
          
          // Optimized Palette Calculation
          const s4 = Math.sin(pShift * 0.04);
          const c2 = Math.cos(pShift * 0.02);

          if (palette === 'runic') {
            data[pix + 0] = brightness * (0.2 + Math.sin(pShift * 0.05) * 0.1); 
            data[pix + 1] = brightness * (0.8 + Math.cos(pShift * 0.03) * 0.2); 
            data[pix + 2] = brightness;       
          } else if (palette === 'nebula') {
            data[pix + 0] = brightness * (0.5 + s4 * 0.5); 
            data[pix + 1] = brightness * 0.2; 
            data[pix + 2] = brightness * (0.9 + c2 * 0.1);
          } else if (palette === 'emerald') {
            data[pix + 0] = brightness * 0.1; 
            data[pix + 1] = brightness * (0.7 + Math.sin(pShift * 0.06) * 0.3); 
            data[pix + 2] = brightness * 0.4;
          } else {
            const rShift = (Math.sin(pShift * 0.01) + 1) * 127;
            data[pix + 0] = (brightness + rShift) % 255; 
            data[pix + 1] = brightness * 0.5; 
            data[pix + 2] = brightness * 0.5;
          }
          data[pix + 3] = 255;             
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // Throttle rendering based on depth to reduce main thread overhead
    const throttle = iterations > 100 ? 2 : 1;
    if (paletteShift % throttle !== 0) return;

    const rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [iterations, zoom, palette, paletteShift]);

  useEffect(() => {
    if (externalIterations !== undefined) return;
    const interval = setInterval(() => {
      setInternalIterationDepth(prev => (prev < 128 ? prev + 1 : 48));
      setPaletteShift(prev => prev + 1);
      if (Math.random() > 0.99) runicReset();
    }, 50);
    return () => clearInterval(interval);
  }, [externalIterations]);

  return (
    <div className="relative group bg-black/80 border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
         <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm flex items-center gap-2">
           <Zap className="w-3 h-3 text-rose-400" />
           <span className="text-[10px] font-mono text-white/80 uppercase">Rust_Bridge: STABILIZED</span>
         </div>
         <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm flex items-center gap-2">
           <Cpu className="w-3 h-3 text-emerald-400" />
           <span className="text-[10px] font-mono text-white/80 uppercase">Overhead_Gap: {stats.overhead}</span>
         </div>
         <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm flex items-center gap-2">
           <Layers className="w-3 h-3 text-cyan-400" />
           <span className="text-[10px] font-mono text-white/80 uppercase">Root_Lattice: {iterations}</span>
         </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={runicReset}
          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-full transition-all group"
        >
          <RefreshCw className={`w-4 h-4 text-rose-400 ${isResetting ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={300} 
        className={`w-full h-full opacity-60 mix-blend-screen transition-all duration-700 ${isResetting ? 'blur-xl scale-110 opacity-0' : 'blur-0 scale-100 opacity-60'}`}
      />

      <AnimatePresence>
        {isResetting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cyan-950/20 backdrop-blur-2xl"
          >
             <Zap className="w-12 h-12 text-cyan-400 animate-pulse mb-2" />
             <span className="text-[12px] font-mono text-cyan-400 tracking-[0.5em] animate-bounce">RUNIC_RESET_ACTIVE</span>
             <span className="text-[9px] font-mono text-white/40 uppercase mt-2">malloc_trim() // cache_invalidate()</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
        <div className="flex flex-col gap-1">
           <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">LIBC Status</span>
           <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-emerald-500"
               animate={{ width: isResetting ? '0%' : '100%' }}
               transition={{ duration: isResetting ? 0.1 : 0.8 }}
             />
           </div>
        </div>
        <div className="text-right">
           <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter italic">V53.4 Pure Stream Lattice</h3>
           <p className="text-[8px] font-mono text-white/20 uppercase">Zero-Latency PWA Convergence</p>
        </div>
      </div>
    </div>
  );
}

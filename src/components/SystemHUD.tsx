import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Minimize2 } from 'lucide-react';
import { sendGeolocatedData } from '../lib/telemetry';

interface Metric {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export function SystemHUD() {
  const [isOpen, setIsOpen] = useState(true);
  const [isVerified, setIsVerified] = useState(false); 
  const [telemetrySync, setTelemetrySync] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, Metric>>({
    cpu: { label: 'CPU_LOAD', value: 34.2, unit: '%', color: 'text-cyan-400' },
    mem: { label: 'MEMORY_ALLOC', value: 1.4, unit: 'GB', color: 'text-purple-400' },
    net: { label: 'LATENCY_OVP', value: 24, unit: 'ms', color: 'text-emerald-400' },
    fps: { label: 'FRAME_RESONANCE', value: 144, unit: 'FPS', color: 'text-rose-400' },
  });

  useEffect(() => {
    // 1. Initial Linkage & Geo-Verification
    sendGeolocatedData('SYSTEM_BOOT_SYNC');

    const handleLock = (e: any) => {
      if (e.detail.status === 'VERIFIED') setIsVerified(true);
    };

    const handleSync = (e: any) => {
      console.log("[HUD] Telemetry Handshake Confirmed:", e.detail);
      setIsVerified(true);
    };

    window.addEventListener('nexus-telemetry-lock', handleLock);
    window.addEventListener('nexus-telemetry-sync', handleSync);

    const interval = setInterval(() => {
      setMetrics(prev => {
        const cpuJitter = (Math.random() - 0.5) * 4;
        const stabilizedCpu = prev.cpu.value + 0.15 * (Math.max(10, Math.min(95, prev.cpu.value + cpuJitter)) - prev.cpu.value);
        const stabilizedNet = prev.net.value + 0.1 * (20 + Math.sin(Date.now() / 2000) * 5 + (Math.random() - 0.5) * 10 - prev.net.value);

        // Dispatch global telemetry resonance event for V4 visualizations like AnimusVoidCore
        window.dispatchEvent(new CustomEvent('nexus-telemetry-update', { 
          detail: { 
            cpu: stabilizedCpu, 
            net: stabilizedNet, 
            timestamp: Date.now() 
          } 
        }));

        return {
          ...prev,
          cpu: { ...prev.cpu, value: +stabilizedCpu.toFixed(1) },
          net: { ...prev.net, value: +stabilizedNet.toFixed(0) },
          mem: { ...prev.mem, value: +(1.2 + Math.sin(Date.now() / 10000) * 0.4).toFixed(2) },
          fps: { ...prev.fps, value: +(144 + (Math.random() - 0.5) * 2).toFixed(1) }
        };
      });
      setTelemetrySync(prev => (prev + 1) % 100);
    }, 100);

    return () => {
        clearInterval(interval);
        window.removeEventListener('nexus-telemetry-lock', handleLock);
        window.removeEventListener('nexus-telemetry-sync', handleSync);
    };
  }, []);

  return (
    <div className="fixed top-24 left-10 z-[100] pointer-events-none">
      <AnimatePresence>
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/10 bg-black/60 backdrop-blur-3xl pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3 gap-8">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-black font-display text-white uppercase tracking-[0.2em]">Ethernet_Live_Telemetry</span>
                </div>
                <div className="flex items-center gap-1.5 ml-5">
                  <div className={`w-1 h-1 rounded-full ${isVerified ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]' : 'bg-rose-500'}`} />
                  <span className="text-[7px] font-mono text-emerald-500/60 uppercase tracking-tighter italic">Permanent_Backend_Link: VERIFIED</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/5 p-1 rounded-lg transition-colors text-white/20 hover:text-white"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {Object.values(metrics).map((metric) => (
                <div key={metric.label} className="flex flex-col gap-1.5 min-w-[90px]">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{metric.label}</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-[12px] font-mono font-bold ${metric.color}`}>{metric.value}</span>
                    <span className="text-[8px] font-mono text-white/20">{metric.unit}</span>
                  </div>
                  <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full bg-current ${metric.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, metric.label === 'FRAME_RESONANCE' ? (metric.value/144)*100 : metric.value)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[7px] font-mono text-white/10 uppercase tracking-widest">
                <span>Osmotic_Osmosis_Sync</span>
                <span>{telemetrySync}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-tighter">Fourier_Mitigation_Active_Stable</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center border border-white/10 bg-black/60 backdrop-blur-3xl pointer-events-auto hover:bg-cyan-500/10 transition-all shadow-2xl group"
          >
            <Activity className="w-6 h-6 text-white/40 group-hover:text-cyan-400 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

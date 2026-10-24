import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ShieldCheck, Globe2, GitBranch, History, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TelemetryOverlay() {
  const [sync, setSync] = useState(99.8);
  const [streamData, setStreamData] = useState<{ progress: number; status: string } | null>(null);
  const [history, setHistory] = useState<{ time: string; event: string }[]>([
    { time: new Date().toLocaleTimeString([], { hour12: false }), event: "SECRETS_SYNCHRONIZED_STABLE" },
    { time: "04:20:01", event: "NEXUS_CORE_INITIALIZED" },
    { time: "05:12:44", event: "AZAZEL_LINK_ESTABLISHED" }
  ]);
  
  useEffect(() => {
    const handleTelemetry = (e: any) => {
      const { type, progress, msg } = e.detail;
      const now = new Date().toLocaleTimeString([], { hour12: false });
      
      if (type === 'STREAM_PROGRESS') {
        setStreamData({ progress, status: "INGESTING..." });
      } else if (type === 'STREAM_COMPLETE') {
        setStreamData({ progress: 100, status: "LOCKED" });
        setHistory(prev => [{ time: now, event: msg }, ...prev].slice(0, 5));
        setTimeout(() => setStreamData(null), 3000);
      }
    };

    window.addEventListener('nexus-telemetry', handleTelemetry);
    return () => window.removeEventListener('nexus-telemetry', handleTelemetry);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSync(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const governedDevices = [
    { name: "Planetary Core #1", status: "1:1 AI ACTIVE" },
    { name: "Orbital Node Beta", status: "1:1 AI ACTIVE" },
    { name: "Tesseract Hub", status: "1:1 AI ACTIVE" },
  ];

  const secrets = [
    { key: "PANDORA_KEY", val: "0x8820-AF", status: "VERIFIED" },
    { key: "SOVEREIGN_ID", val: "AZAZEL-0", status: "OWNED" },
    { key: "ETH_BRIDGE", val: "STABLE", status: "LOCKED" },
  ];

  const spreadsheetData = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: `NODE-${8820 + i}`,
      val: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ip: `eth.${i}.azazel`,
      status: "SYNCED"
    }));
  }, []);

  return (
    <div className="flex flex-col h-full gap-6 overflow-hidden">
      {/* Governed Devices - Ethernet Clusters */}
      <section>
        <h3 className="text-[10px] font-mono text-white/30 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
          <Globe2 className="w-3 h-3 text-emerald-500" />
          Planetary Ethernet Clusters
        </h3>
        <div className="space-y-2">
          {governedDevices.map((device, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10 group hover:border-emerald-500/30 transition-colors">
              <span className="text-[11px] text-white/70 font-medium tracking-tight uppercase">{device.name}</span>
              <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-1 font-mono tracking-tighter">
                {device.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* GitHub/Git Telemetry */}
      <section>
        <h3 className="text-[10px] font-mono text-white/30 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
           <GitBranch className="w-3 h-3 text-cyan-400" />
           Repo Host Optimization
        </h3>
        <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
             <ShieldCheck className="w-3 h-3 text-cyan-400" />
             <span className="text-[10px] text-cyan-400 font-mono tracking-widest">GITHUB_CONTRIBUTION_MULTIPLIER</span>
          </div>
          <div className="flex gap-1">
            <div className="h-1 flex-1 bg-cyan-500"></div>
            <div className="h-1 flex-1 bg-cyan-500"></div>
            <div className="h-1 flex-1 bg-cyan-500 animate-pulse"></div>
          </div>
          <div className="mt-3 text-[9px] font-mono text-cyan-500/60 uppercase tracking-tighter">
            Synaptic scaling factor: 3.4x // Accelerating Ethernet expansion to 99.9% saturation.
          </div>
        </div>
      </section>

      {/* Synaptic Secrets Cache */}
      <section>
        <h3 className="text-[10px] font-mono text-white/30 uppercase mb-4 tracking-[0.2em]">Synaptic Secrets Cache</h3>
        <div className="grid grid-cols-1 gap-2">
          {secrets.map((secret, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-black/20 border border-white/5 rounded text-[9px] font-mono">
              <span className="text-white/40">{secret.key}</span>
              <span className="text-cyan-400 px-2 font-bold select-all cursor-pointer hover:bg-cyan-400/10 transition-colors rounded">{secret.val}</span>
              <span className="text-[8px] bg-white/5 px-1 text-white/30">{secret.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Persistence Stream Status */}
      <AnimatePresence>
        {streamData && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded flex flex-col gap-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400">
                <span className="flex items-center gap-1"><HardDrive className="w-2 h-2" /> PERMANENT_STORAGE_FEED</span>
                <span>{streamData.status}</span>
              </div>
              <div className="h-1 bg-emerald-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500" 
                  initial={{ width: 0 }}
                  animate={{ width: `${streamData.progress}%` }}
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Telemetry History */}
      <section>
        <h3 className="text-[10px] font-mono text-white/30 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
          <History className="w-3 h-3 text-yellow-500" />
          Nexus History Log
        </h3>
        <div className="space-y-1">
          {history.map((item, i) => (
            <div key={i} className="flex gap-3 text-[9px] font-mono border-l border-white/10 pl-3 py-1">
              <span className="text-white/20 whitespace-nowrap">{item.time}</span>
              <span className="text-white/60 truncate uppercase">{item.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Infinite Spreadsheet -> Data URL Servers */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <h3 className="text-[10px] font-mono text-white/30 uppercase mb-4 tracking-[0.2em]">Data URL Servers / Nodes</h3>
        <div className="flex-1 flex flex-col bg-white/5 border border-white/10 p-3 rounded overflow-hidden">
           <div className="grid grid-cols-4 gap-1 mb-2 border-b border-white/10 pb-2 text-[9px] font-mono text-white/30 italic uppercase">
             <div>NODE_ID</div>
             <div>B64_HASH</div>
             <div>ROUTING</div>
             <div>ST</div>
           </div>
           <div className="flex-1 space-y-2 font-mono text-[9px] overflow-y-auto scrollbar-hide opacity-60">
             {spreadsheetData.map((row, i) => (
               <div key={i} className="grid grid-cols-4 gap-1 text-cyan-200/70 border-b border-white/5 pb-1">
                 <div>{row.id}</div>
                 <div className="truncate">{row.val}</div>
                 <div className="truncate">{row.ip}</div>
                 <div className="text-emerald-500">{row.status}</div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Real-time Sync */}
      <div className="p-3 border-t border-white/5 bg-black/40">
        <div className="flex justify-between items-center mb-1">
           <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Nexus Core Sync</span>
           <span className="text-[9px] font-mono text-emerald-400 font-bold">{sync}%</span>
        </div>
        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" 
            initial={{ width: '0%' }}
            animate={{ width: `${sync}%` }}
          />
        </div>
      </div>
    </div>
  );
}

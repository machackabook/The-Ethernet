import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Zap, Cpu, Server, Wifi, Globe, Shield, AlertTriangle, ArrowUpRight, BarChart3, Clock, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PerformanceMetric {
  timestamp: string;
  latency: number;
  tokens: number;
  throughput: number;
}

export function PerformanceDashboard({ onBack }: { onBack?: () => void }) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [mcpStatus, setMcpStatus] = useState<'ONLINE' | 'STANDBY' | 'ERROR'>('ONLINE');
  const [activeRegion, setActiveRegion] = useState('US-EAST-1');
  const [networkLoad, setNetworkLoad] = useState(14);
  const [lastRelink, setLastRelink] = useState('13:42:01');

  useEffect(() => {
    // Shared historical data
    const initialData = Array.from({ length: 20 }).map((_, i) => ({
      timestamp: `${i}:00`,
      latency: Math.floor(Math.random() * 200) + 100,
      tokens: Math.floor(Math.random() * 50) + 10,
      throughput: Math.floor(Math.random() * 1000) + 500,
    }));
    setMetrics(initialData);

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      setMetrics(prev => [
        ...prev.slice(1),
        {
          timestamp: timeStr,
          latency: Math.floor(Math.random() * 150) + 80,
          tokens: Math.floor(Math.random() * 40) + 5,
          throughput: Math.floor(Math.random() * 1200) + 800,
        }
      ]);

      setNetworkLoad(prev => {
        const next = prev + (Math.random() * 10 - 5);
        return Math.max(5, Math.min(95, Math.round(next)));
      });

      if (Math.random() > 0.95) {
        setMcpStatus('STANDBY');
        setTimeout(() => setMcpStatus('ONLINE'), 2000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-[#050505] text-white p-6 overflow-y-auto scrollbar-hide font-sans">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
             <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Performance_Nexus</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Telemetry Synchronized
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                DATA_SOURCE: AE-M4_NODE
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <div className="text-right hidden md:block">
              <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Session_Uptime</div>
              <div className="text-xs font-mono font-bold">1d 04h 22m 13s</div>
           </div>
           {onBack && (
             <button 
               onClick={onBack}
               className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all"
             >
               Relink_Index
             </button>
           )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
         {/* Metric Cards */}
         {[
           { label: 'Avg Latency', value: '112ms', trend: -12, icon: <Clock />, color: 'emerald' },
           { label: 'Throughput', value: '4.2 TB/s', trend: 8, icon: <Zap />, color: 'cyan' },
           { label: 'Neural Load', value: `${networkLoad}%`, trend: 2, icon: <Cpu />, color: 'purple' },
           { label: 'MCP Status', value: mcpStatus, trend: 0, icon: <Server />, color: mcpStatus === 'ONLINE' ? 'emerald' : 'amber' },
         ].map((card, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:border-white/20 transition-all group"
           >
             <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-${card.color}-500/10 rounded-xl text-${card.color}-400 group-hover:scale-110 transition-transform`}>
                   {React.cloneElement(card.icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
                </div>
                {card.trend !== 0 && (
                  <div className={`flex items-center gap-1 text-[10px] font-mono ${card.trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {card.trend > 0 ? '+' : ''}{card.trend}% <ArrowUpRight className={`w-2.5 h-2.5 ${card.trend < 0 ? 'rotate-180' : ''}`} />
                  </div>
                )}
             </div>
             <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{card.label}</div>
             <div className="text-2xl font-black italic uppercase tracking-tighter truncate">{card.value}</div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Latency Graph */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <BarChart3 className="w-4 h-4 text-cyan-400" />
                 <h3 className="text-xs font-black uppercase tracking-widest">Neural_Latency_Matrix</h3>
              </div>
              <div className="flex gap-2">
                 {['1H', '24H', '7D'].map(t => (
                   <button key={t} className={`text-[8px] font-mono px-2 py-1 rounded border ${t === '1H' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'border-white/5 text-white/20'}`}>{t}</button>
                 ))}
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={metrics}>
                    <defs>
                       <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#ffffff20', fontFamily: 'monospace' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#ffffff20', fontFamily: 'monospace' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area type="monotone" dataKey="latency" stroke="#06b6d4" fillOpacity={1} fill="url(#latencyGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Node Connectivity Status */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-widest">Data_Sovereignty_Hub</h3>
           </div>
           <div className="flex-1 space-y-4">
              {[
                { name: 'NORTH_AMERICA_EAST', latency: '12ms', status: 'optimal' },
                { name: 'EUROPE_WEST_CENTRAL', latency: '88ms', status: 'optimal' },
                { name: 'ASIA_PACIFIC_SOUTH', latency: '242ms', status: 'warning' },
                { name: 'DEEP_VOID_NODE_B', latency: '---', status: 'offline' },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'optimal' ? 'bg-emerald-500' : node.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'} ${node.status === 'optimal' ? 'animate-pulse' : ''}`} />
                      <span className="text-[9px] font-mono text-white/70 tracking-tighter">{node.name}</span>
                   </div>
                   <span className="text-[9px] font-mono text-white/30">{node.latency}</span>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Always-On MCP v4</span>
                 <span className="text-[8px] font-mono text-emerald-400/60 uppercase">Operational</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: ['40%', '60%', '45%', '70%'] }} 
                   transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                   className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                 />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <Database className="w-4 h-4 text-purple-400" />
                 <h3 className="text-xs font-black uppercase tracking-widest">Model_Inference_Throughput</h3>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#ffffff20', fontFamily: 'monospace' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#ffffff20', fontFamily: 'monospace' }} />
                    <Line type="monotone" dataKey="throughput" stroke="#a855f7" strokeWidth={2} dot={false} />
                 </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-center gap-4">
            <div className="text-center">
               <Shield className="w-8 h-8 text-cyan-400/50 mx-auto mb-3" />
               <div className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest italic">Protocol Analysis</div>
               <div className="space-y-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded-lg text-[9px] font-mono text-emerald-400 flex items-center gap-2">
                     <AlertTriangle className="w-3 h-3" />
                     RELIABILITY: 99.98%
                  </div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 px-3 py-2 rounded-lg text-[9px] font-mono text-cyan-400 flex items-center gap-2">
                     <Zap className="w-3 h-3" />
                     TTFT: 0.14s
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

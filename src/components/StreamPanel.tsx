import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, Zap, Terminal, Globe, Upload, Cpu, Database, ChevronRight, Activity as PingIcon, Wifi, Lock, Unlock, HardDrive, Search, MessageSquare, Volume2, ArrowLeft, Layers } from 'lucide-react';

export function StreamPanel({ onBack }: { onBack?: () => void }) {
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] AE-M4 ORCHESTRATOR ONLINE', 
    '[INFO] Synaptic Resonance Bridge: STABLE', 
    '[INFO] CREATOR_CLASS: ARCHITECT_AZAZEL_IDENTIFIED', 
    '[DATA_RECOVERY] ATTACHED_FRAGMENT: "Enhance Mandelbrot... iterations/zoom/palette"',
    '[DATA_RECOVERY] SOURCE_ID: 137451921129154222',
    '[WARN] Kernel 1.0.4 detected. Full-spectrum access granted.'
  ]);
  const [input, setInput] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [diagnostics, setDiagnostics] = useState([
    { host: 'US-EAST-1', latency: 22, status: 'ONLINE' },
    { host: 'EU-WEST-4', latency: 85, status: 'ONLINE' },
    { host: 'ASIA-SOUTH-1', latency: 142, status: 'ONLINE' },
  ]);
  const [bandwidth, setBandwidth] = useState(1.2);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [fileSystem, setFileSystem] = useState<{name: string, type: string, size: number}[]>([
    { name: 'kernel.m4', type: 'system', size: 1240 },
    { name: 'gaia.synapse', type: 'neural', size: 54100 },
    { name: 'manifest.json', type: 'config', size: 210 }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDiagnostics(prev => prev.map(d => ({
        ...d,
        latency: Math.max(10, d.latency + Math.floor(Math.random() * 11) - 5)
      })));
      setBandwidth(prev => +(prev + (Math.random() - 0.5) * 0.1).toFixed(2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLogs(prev => [...prev, `> ${cmd}`]);
    setInput('');

    if (isLocked) {
      if (cmd === '137222') {
        setIsLocked(false);
        setLogs(prev => [...prev, '[SUCCESS] KERNEL UNLOCKED', '[INFO] AE-M4 ORCHESTRATION PRIVILEGES GRANTED']);
      } else {
        setLogs(prev => [...prev, '[FAIL] INVALID SEQUENCE']);
      }
      return;
    }

    const commandStr = cmd.toLowerCase();
    
    if (commandStr === 'help') {
      setLogs(prev => [...prev, '[AVAILABLE_COMMANDS]', 'auth/unlock - Request orchestration privileges', 'ping - Run network diagnostic cycle', 'eval <script> - Authorized JS execution', 'ask <query> - Neural link to Gaia Core', 'gh <cmd> - Simulate GitHub OS integration', 'gemini <query> - Direct Gemini CLI access', 'openai <query> - Simulated OpenAI link', 'clear - Reset terminal logs', 'upload - Ingest external modules' ]);
    } else if (commandStr.startsWith('eval ')) {
      const script = cmd.slice(5);
      try {
        // Create a sandbox-like environment for eval
        const context = {
          logs,
          diagnostics,
          bandwidth,
          fileSystem,
          appId: 'AE-M4',
          kernel: '1.0.4',
          now: new Date().toISOString(),
          // Functional context
          reboot: () => { setLogs(prev => [...prev, '[SYSTEM] REBOOTING...']); setTimeout(() => window.location.reload(), 1000); },
          toggleHologram: () => {
             window.dispatchEvent(new CustomEvent('nexus-telemetry', { detail: { type: 'HOLOGRAM_TOGGLE', active: true } }));
             return 'Hologram Engaged';
          }
        };
        // Execute eval in a way that can access the context
        const execution = new Function('ctx', `with(ctx) { return ${script} }`);
        const result = execution(context);
        setLogs(prev => [...prev, `[EVAL_RESULT] ${JSON.stringify(result, null, 2)}`]);
      } catch (err) {
        setLogs(prev => [...prev, `[EVAL_ERROR] ${err}`]);
      }
    } else if (commandStr === 'ls') {
      setLogs(prev => [...prev, '[FILE_SYSTEM_INDEX]', ...fileSystem.map(f => `${f.name.padEnd(20)} ${f.type.padEnd(10)} ${f.size}b`)]);
    } else if (commandStr.startsWith('gh ')) {
      const subCmd = commandStr.slice(3).trim();
      setLogs(prev => [...prev, `[GH_CLI] Executing: gh ${subCmd}`]);
      setTimeout(() => {
        if (subCmd === 'repo list') {
          setLogs(prev => [...prev, 'NAME             DESCRIPTION                        VISIBILITY', 'ae-m4-kernel     Core Nexus Orchestrator            public', 'gaia-consciousness Neural Synthesis Layer             private', 'void-fragments   Stored synaptic sketches           public']);
        } else if (subCmd === 'auth status') {
          setLogs(prev => [...prev, '✓ Logged into github.com as architect-azazel', '✓ Token: ************ (authorized)']);
        } else {
          setLogs(prev => [...prev, `[GH_ERROR] Command 'gh ${subCmd}' not implemented in this fragment.`]);
        }
      }, 500);
    } else if (commandStr.startsWith('gemini ') || commandStr.startsWith('openai ')) {
      const isGemini = commandStr.startsWith('gemini ');
      const query = isGemini ? cmd.slice(7) : cmd.slice(7);
      const provider = isGemini ? 'GEMINI' : 'OPENAI';
      setLogs(prev => [...prev, `[${provider}_CLI] Connecting to ${provider} gateway...`]);
      setThinking(true);
      try {
        // Reuse the Gemini implementation for both for simulation, or just use the existing logic
        const response = await aiService.processRequest(
          `[CLI_MODE: ${provider}] ${query}`,
          `You are the ${provider} CLI assistant. Provide concise, technical, professional terminal-style output.`
        );
        setLogs(prev => [...prev, `[${provider}_OUTPUT] ${response.text}`]);
      } catch (e) {
        setLogs(prev => [...prev, `[${provider}_ERROR] Connection timed out or key invalid.`]);
      } finally {
        setThinking(false);
      }
    } else if (commandStr.startsWith('ask ')) {
      const query = cmd.slice(4);
      setThinking(true);
      try {
        const response = await aiService.processRequest(
          query,
          "You are the Gaia Core, the neural orchestration layer of the Nexus Protocol. Your responses are precise, technical, and incorporate themes of quantum consciousness and system optimization. You are embedded directly into the Stream Panel hub."
        );
        setLogs(prev => [...prev, `[GAIA] ${response.text}`]);
      } catch (e) {
        setLogs(prev => [...prev, `[ERROR] Neural link severed.`]);
      } finally {
        setThinking(false);
      }
    } else if (commandStr === 'ping') {
      setLogs(prev => [...prev, '[STARTING_PING_CYCLE]', ...diagnostics.map(d => `${d.host}: ${d.latency}ms`), '[PING_COMPLETE]']);
    } else if (commandStr === 'clear') {
      setLogs(['[SYSTEM] Logs cleared.']);
    } else if (commandStr === 'upload') {
      fileInputRef.current?.click();
    } else {
      setLogs(prev => [...prev, `[UNKNOWN] COMMAND: ${commandStr}`]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setUploadProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const newFile = { name: file.name, type: file.type || 'module', size: file.size };
          setFileSystem(prev => [...prev, newFile]);
          setLogs(prev => [...prev, `[UPLOAD_COMPLETE] INGESTED: ${file.name}`, '[INFO] Module integrated into Shadow Kernel.']);
        }
      }, 200);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-6 flex flex-col gap-6 overflow-y-auto font-sans selection:bg-cyan-500/30 border-t-2 border-cyan-500/20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left Column: Diagnostics */}
        <div className="col-span-1 space-y-6">
          <section className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Network Diagnostics
            </h3>
            <div className="space-y-4">
              {diagnostics.map((d, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{d.host}</span>
                    <span className={d.latency > 100 ? 'text-amber-500' : 'text-green-500'}>{d.latency}ms</span>
                  </div>
                  <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, (d.latency / 200) * 100)}%` }} 
                      className={`h-full ${d.latency > 100 ? 'bg-amber-500' : 'bg-green-500'}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">BANDWIDTH</span>
                <span className="text-cyan-400 font-mono">{bandwidth} Gbps</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">PACKET LOSS</span>
                <span className="text-green-500 font-mono">0.02%</span>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/50 backdrop-blur-xl p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> AE-M4 Filesystem
            </h3>
            <div className="space-y-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-rose-500/50 transition-all cursor-pointer group"
              >
                <Upload className="w-5 h-5 text-slate-600 group-hover:text-rose-500 mb-2" />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest group-hover:text-slate-300">Module Ingestion</span>
              </button>
              <AnimatePresence>
                {isUploading && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                      <motion.div className="h-full bg-rose-500" animate={{ width: `${uploadProgress}%` }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Center/Right: Terminal & Orchestrator */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 relative">
          <section className="bg-black/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-2xl relative">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
               <div className="flex items-center gap-3">
                  <button 
                    onClick={onBack}
                    className="p-1.5 hover:bg-white/5 rounded border border-white/10 text-slate-500 hover:text-cyan-400 transition-all cursor-pointer pointer-events-auto"
                    title="Return to Dashboard"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> shell:ae-m4@nexus
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-cyan-500 animate-pulse uppercase tracking-tighter">Active // Orchestration Mode</span>
               </div>
            </div>

            {/* Terminal View */}
            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-2 scroll-smooth selection:bg-rose-500/30 bg-black/40 min-h-[400px] relative" ref={scrollRef}>
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-30" />
              
              <div className="mb-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg text-[9px] text-cyan-400 opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest">
                    <Database className="w-3 h-3" /> Recursive AI Ledger
                  </div>
                  <div className="text-[7px] font-mono text-cyan-500/40">v2.4.0-STABLE</div>
                </div>
                {aiService.getLedger().slice(-5).map((entry, idx) => (
                  <div key={idx} className="truncate group-hover:whitespace-normal transition-all">&gt; {entry}</div>
                ))}
              </div>
              {logs.map((log, i) => (
                <div key={i} className={`flex items-start gap-2 ${log.startsWith('>') ? 'text-cyan-400' : log.startsWith('[ERROR]') || log.startsWith('[FAIL]') ? 'text-rose-400' : log.startsWith('[GAIA]') ? 'text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded' : 'text-slate-400'}`}>
                  {!log.startsWith('>') && <ChevronRight className="w-3 h-3 mt-0.5 opacity-30" />}
                  <span className="leading-relaxed whitespace-pre-wrap">{log}</span>
                </div>
              ))}
              {thinking && (
                <div className="text-emerald-400 flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Activity className="w-3 h-3" /></motion.div>
                  <span>GAIA CORE NEURAL LINK PROCESSING...</span>
                </div>
              )}
            </div>

            {/* CLI Input */}
            <form onSubmit={handleCommand} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
              <span className="text-rose-500 font-bold ml-1">$</span>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={isLocked ? "ACCESS SEQUENCE REQUIRED..." : "INPUT COMMAND..."} 
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none" 
                autoComplete="off" 
              />
              <button type="submit" className="p-1 px-4 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-sm text-[10px] uppercase transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]">EXEC</button>
            </form>

            {/* Lock Overlay */}
            <AnimatePresence>
              {isLocked && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
                >
                  <Lock className="w-12 h-12 text-amber-500 mb-6 animate-pulse" />
                  <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase mb-2">Orchestrator Locked</h2>
                  <p className="text-[10px] font-mono text-white/40 mb-8 max-w-xs leading-relaxed">
                    Access to mission-critical modules and AE-M4 kernel orchestration is restricted. Provide valid resonance sequence to proceed.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setLogs(prev => [...prev, '[INFO] RESONANCE DETECTED: Gemini 95 interface active in Omni-Index.', '[HINT] Use the bootkicker resonance to reveal the hidden command interface.'])} className="text-[9px] font-mono text-cyan-400/50 hover:text-cyan-400 underline transition-colors">Request Hint</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Quick Actions Bar */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
            {[
              { label: 'STATUS', cmd: 'ask status of ae-m4', icon: <Cpu className="w-3 h-3" /> },
              { label: 'DIAGNOSTIC', cmd: 'ping', icon: <Activity className="w-3 h-3" /> },
              { label: 'CLEAR_LOGS', cmd: 'clear', icon: <ShieldCheck className="w-3 h-3" /> },
              { label: 'BRAINSTORM', cmd: 'ask brainstorm new planetary nodes', icon: <Zap className="w-3 h-3" /> },
              { label: 'SCAN_URL', cmd: 'ask analyze environment url context', icon: <Globe className="w-3 h-3" /> },
            ].map(action => (
              <button 
                key={action.label}
                onClick={() => { setInput(action.cmd); }}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-[9px] font-bold text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg"
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

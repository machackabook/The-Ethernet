import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Save, Share2, Plus, Terminal, Cpu, Database, Zap, HardDrive, RefreshCw } from 'lucide-react';

interface Cell {
  id: string;
  type: 'code' | 'markdown';
  content: string;
  output?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
}

export function NotebookWorkspace() {
  const [cells, setCells] = useState<Cell[]>([
    { id: '1', type: 'markdown', content: '# NEXUS_ORCHESTRATOR // Colab Instance 01\nSynchronizing synaptic code blocks with kernel memory.' },
    { id: '2', type: 'code', content: 'import nexus_kernel\nnexus = nexus_kernel.connect(id="137222")\nnexus.telemetry.verify_link()', status: 'idle' },
    { id: '3', type: 'code', content: 'print("RES_PHASE_VERIFIED: STABLE")', output: 'RES_PHASE_VERIFIED: STABLE', status: 'success' }
  ]);

  const runCell = (id: string) => {
    setCells(prev => prev.map(cell => {
      if (cell.id === id) {
        return { ...cell, status: 'running' };
      }
      return cell;
    }));

    setTimeout(() => {
      setCells(prev => prev.map(cell => {
        if (cell.id === id) {
          return { ...cell, status: 'success', output: 'PROTOCOL_EXECUTION_SUCCESS // LATENCY: 12ms' };
        }
        return cell;
      }));
    }, 1500);
  };

  const addCell = (type: 'code' | 'markdown') => {
    const newCell: Cell = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'code' ? '# New Synaptic Logic' : '### New Description',
      status: 'idle'
    };
    setCells([...cells, newCell]);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="h-12 bg-black border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <Database className="w-4 h-4 text-cyan-400" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Nexus_Colab_Link</span>
        </div>
        <div className="flex gap-2">
           <button onClick={() => addCell('code')} className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-cyan-400 transition-all"><Plus className="w-3.5 h-3.5" /></button>
           <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-emerald-400 transition-all"><Save className="w-3.5 h-3.5" /></button>
           <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-purple-400 transition-all"><Share2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {cells.map((cell, idx) => (
          <div key={cell.id} className="group relative">
            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-cyan-500/0 group-hover:bg-cyan-500/20 rounded-full transition-all" />
            
            {cell.type === 'markdown' ? (
              <div className="pl-6 prose prose-invert max-w-none">
                 <h1 className="text-xl font-bold text-white/80">{cell.content.split('\n')[0].replace('# ', '')}</h1>
                 <p className="text-[10px] text-white/40">{cell.content.split('\n')[1]}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[8px] text-white/20 font-mono">[{idx + 1}]</span>
                   <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="relative bg-black/60 border border-white/10 rounded-xl overflow-hidden group-hover:border-cyan-500/30 transition-all">
                  <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => runCell(cell.id)}
                      disabled={cell.status === 'running'}
                      className={`p-2 rounded-lg transition-all ${cell.status === 'running' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' : 'bg-cyan-500 text-black hover:bg-cyan-400'}`}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea 
                    value={cell.content}
                    onChange={(e) => {
                      const newCells = [...cells];
                      newCells[idx].content = e.target.value;
                      setCells(newCells);
                    }}
                    rows={cell.content.split('\n').length}
                    className="w-full bg-transparent p-4 text-[11px] font-mono text-cyan-100 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                {cell.output && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-6 p-3 bg-white/5 border-l-2 border-emerald-500/50 rounded-r-lg"
                  >
                    <pre className="text-[10px] font-mono text-emerald-400/80">{cell.output}</pre>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-24 bg-black border-t border-white/10 p-3">
        <div className="flex items-center gap-2 mb-2 text-amber-500">
           <Terminal className="w-3 h-3" />
           <span className="text-[8px] font-black uppercase tracking-widest">Kernel_Stdout</span>
        </div>
        <div className="text-[7px] font-mono text-white/30 space-y-0.5">
           <div>[SYSTEM] Memory synchronized. Synapse bridge active.</div>
           <div className="text-cyan-400/50">[OK] Google_Cloud_Colab_Integrated_Link established.</div>
           <div className="flex items-center gap-2">
             <RefreshCw className="w-2 h-2 animate-spin text-emerald-400/40" />
             <span>Pulling latest shards from Permanent Vault...</span>
           </div>
        </div>
      </div>
    </div>
  );
}

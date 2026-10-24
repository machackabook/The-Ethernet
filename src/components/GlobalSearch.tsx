import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, X, Cpu, Database, History, Zap, Settings, ArrowRight, Activity as ActivityIcon, Network, ShieldCheck } from 'lucide-react';
import { aiService } from '../services/aiService';
import { APPS } from '../constants';

interface SearchResult {
  id: string;
  type: 'app' | 'ledger' | 'system' | 'setting';
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  action?: () => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (view: any) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search Apps
    APPS.forEach(app => {
      if (app.name.toLowerCase().includes(normalizedQuery) || app.desc.toLowerCase().includes(normalizedQuery)) {
        matches.push({
          id: `app-${app.id}`,
          type: 'app',
          title: app.name,
          description: app.desc,
          category: 'Applications',
          icon: app.icon,
          action: () => onNavigate(app.id)
        });
      }
    });

    // Search Ledger
    aiService.getLedger().forEach((entry, idx) => {
      if (entry.toLowerCase().includes(normalizedQuery)) {
        matches.push({
          id: `ledger-${idx}`,
          type: 'ledger',
          title: 'Memory Fragment',
          description: entry.substring(0, 100) + '...',
          category: 'Recursive Ledger',
          icon: <History className="w-4 h-4 text-rose-400" />,
          action: () => {
             // Maybe open ledger in CommandCenter?
             onNavigate('index');
          }
        });
      }
    });

    // Search System Context (Ghost Buffer)
    const ghost = localStorage.getItem('nexus_draft');
    if (ghost && ghost.toLowerCase().includes(normalizedQuery)) {
      matches.push({
        id: 'system-ghost',
        type: 'system',
        title: 'Active Ghost Buffer',
        description: ghost.substring(0, 80) + '...',
        category: 'Kernel Memory',
        icon: <Zap className="w-4 h-4 text-cyan-400" />,
        action: () => {}
      });
    }

    // Static Settings/Directives
    const systemPoints = [
      { id: 'settings', title: 'System Config', desc: 'Adjust kernel parameters and auth keys', cat: 'Settings', icon: <Settings className="w-4 h-4 text-amber-400" />, view: 'settings' },
      { id: 'deep-link', title: 'Atlas Navigation', desc: 'Hubble Telemetry & Spacetime Mapping', cat: 'Astro', icon: <ShieldCheck className="w-4 h-4 text-rose-400" />, view: 'deep-link' },
      { id: 'performance', title: 'Performance Dashboard', desc: 'Real-time telemetry and network metrics', cat: 'Metrics', icon: <ActivityIcon className="w-4 h-4 text-emerald-400" />, view: 'performance' },
      { id: 'models', title: 'Model Integration', desc: 'AI Hub and cross-kernel orchestration', cat: 'AI_LAB', icon: <Cpu className="w-4 h-4 text-cyan-400" />, view: 'models' },
      { id: 'orchestrator', title: 'Universe Orchestrator', desc: 'Procedural Spacetime & Engine Matrix', cat: 'Infinite', icon: <Network className="w-4 h-4 text-purple-400" />, view: 'orchestrator' },
    ];

    systemPoints.forEach(p => {
      if (p.title.toLowerCase().includes(normalizedQuery) || p.desc.toLowerCase().includes(normalizedQuery)) {
        matches.push({
          id: p.id,
          type: 'setting',
          title: p.title,
          description: p.desc,
          category: p.cat,
          icon: p.icon,
          action: () => {
             if (p.view === 'settings') {
                // Settings is a sidebar, handled in App.tsx but we can trigger it
                window.dispatchEvent(new CustomEvent('nexus-open-settings'));
             } else {
                onNavigate(p.view);
             }
          }
        });
      }
    });

    return matches;
  }, [query, onNavigate]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(results.length - 1, prev + 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        results[selectedIndex].action?.();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[60vh]"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center px-6 py-4 border-b border-white/5 space-x-4 bg-white/[0.02]">
              <Search className="w-5 h-5 text-white/30" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Animus Void... (Apps, Ledger, Kernel)"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm uppercase tracking-wider placeholder:text-white/20"
              />
              <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10">
                <span className="text-[10px] font-mono text-white/40 uppercase">ESC TO CANCEL</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      onClick={() => { result.action?.(); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                        index === selectedIndex ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 text-white/60 ${index === selectedIndex ? 'text-cyan-400' : ''}`}>
                        {result.icon}
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{result.title}</span>
                          <span className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/5 text-[7px] font-mono text-white/30 uppercase tracking-tighter">{result.category}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/40 uppercase truncate max-w-[400px]">{result.description}</span>
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="w-4 h-4 text-cyan-500 animate-pulse" />
                      )}
                    </motion.button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                  <Cpu className="w-12 h-12 text-white/5 animate-pulse" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">No fragments identified</span>
                    <span className="text-[9px] font-mono text-white/10 uppercase italic letter-spacing-widest">Query returned zero convergence points</span>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                  <Command className="w-10 h-10 text-white/5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Synaptic Convergence Hub</span>
                    <span className="text-[9px] font-mono text-white/10 uppercase italic">Type to begin recursion scanning</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase">
                <div className="flex items-center gap-1.5">
                  <div className="px-1 py-0.5 rounded bg-white/5 border border-white/10">↑↓</div>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-bold">↵</div>
                  <span>Select</span>
                </div>
              </div>
              <span className="text-[8px] font-mono text-white/10 italic uppercase">Nexus_Global_Search_v1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

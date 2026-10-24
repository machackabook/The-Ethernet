import React from 'react';
import { Box, LayoutGrid, Terminal, History, Database, Globe, Activity, Cpu } from 'lucide-react';

export interface AppDefinition {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

export const APPS: AppDefinition[] = [
  { id: 'dashboard', name: 'Nexus Hub', desc: 'Core Engine & 3D Animus', icon: <Box className="w-8 h-8 text-white" />, color: 'bg-cyan-600 shadow-cyan-500/20' },
  { id: 'void-core', name: 'Void Core', desc: 'Cosmic Animus Fractal Void', icon: <Activity className="w-8 h-8 text-white" />, color: 'bg-rose-600 shadow-rose-500/20' },
  { id: 'metaverse-hub', name: 'Metaverse', desc: 'Virtual Land & NFT Market', icon: <Globe className="w-8 h-8 text-white" />, color: 'bg-amber-600 shadow-amber-500/20' },
  { id: 'smart-sync', name: 'Smart Sync', desc: 'AI Device Control Matrix', icon: <Cpu className="w-8 h-8 text-white" />, color: 'bg-cyan-500 shadow-cyan-500/20' },
  { id: 'tesseract', name: 'Tesseract', desc: 'Fractal Engine & Telemetry', icon: <LayoutGrid className="w-8 h-8 text-white" />, color: 'bg-purple-600 shadow-purple-500/20' },
  { id: 'stream', name: 'Orchestrator', desc: 'Kernel Console & VFS', icon: <Terminal className="w-8 h-8 text-white" />, color: 'bg-emerald-600 shadow-emerald-500/20' },
  { id: 'ledger', name: 'Scroll Ledger', desc: 'Recursive Memory Index', icon: <History className="w-8 h-8 text-white" />, color: 'bg-rose-600 shadow-rose-500/20' },
  { id: 'atlas', name: 'Cosmic Atlas', desc: 'Stego Payload Registry', icon: <Database className="w-8 h-8 text-white" />, color: 'bg-amber-600 shadow-amber-500/20' },
];

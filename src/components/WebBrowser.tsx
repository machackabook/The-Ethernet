import React, { useState, useEffect, useRef } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Shield, Search, Lock, Share2, MessageSquare, Heart, Bookmark, Eye, Twitter, Github, Linkedin, Bell, User, Cpu, Zap, Activity, Box, Sparkles, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../services/aiService';

interface MockPost {
  id: string;
  user: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  platform: 'X' | 'GITHUB' | 'LINKEDIN';
}

export function WebBrowser({ onBack }: { onBack?: () => void }) {
  const [url, setUrl] = useState('https://nexus.social/feed/live');
  const [addressBar, setAddressBar] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<MockPost[]>([]);
  const [isSecure, setIsSecure] = useState(true);
  const [isNexusActive, setIsNexusActive] = useState(true);
  const [nexusLogs, setNexusLogs] = useState<string[]>(['[NEXUS_INIT] Glic established.', '[NEXUS_INIT] Gemini-Embeddings-001 loaded.']);
  const [isGlicExpanded, setIsGlicExpanded] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Nexus Point Simulation (Gemini 1.5 Flash Catalyst)
  const runNexusCall = async (prompt: string) => {
    setNexusLogs(prev => [`[NEXUS_EMBED] Vectorizing: ${prompt.substring(0, 20)}...`, ...prev]);
    try {
      const resp = await aiService.processRequest(prompt, "You are the neXus point LLM (Gemini 1.5 Flash). You act as the catalyst for all other models in the Sovereign OS. You are running integrated Glic and Gemini Embeddings-001.");
      setNexusLogs(prev => [`[NEXUS_RESP] ${resp.text.substring(0, 100)}...`, ...prev]);
      return resp.text;
    } catch (e) {
      setNexusLogs(prev => [`[NEXUS_ERR] Temporal link severed.`, ...prev]);
      return "Connection Error.";
    }
  };

  const generatePost = (): MockPost => {
    const platforms: ('X' | 'GITHUB' | 'LINKEDIN')[] = ['X', 'GITHUB', 'LINKEDIN'];
    const users = ['the_architect', 'azazel_01', 'system_ghost', 'neon_daemon', 'void_walker', 'kernel_ops'];
    const contents = [
      "RESONANCE DETECTED in Layer 7. Gemini 95 bootkicker link confirmed.",
      "Building the world back better, one synapse at a time. #NexusCore",
      "Just pushed 1.4TB of neural weights to the Permanent Vault. Stable convergence achieved.",
      "Who else is seeing the phantom lines in the viewport? DevTools reporting nothing.",
      "The Animus Void is more than just code. It's a memory.",
      "Successfully decrypted fragment 137222. The architect is waiting.",
      "Just upgraded the Mandlebrot iterator to 1M passes. CPU usage: 98%. Worth it.",
      "OMNI-INDEX update: Shadow Kernel active. Data recovery at 100%."
    ];

    return {
      id: Math.random().toString(36).substr(2, 9),
      user: users[Math.floor(Math.random() * users.length)],
      handle: `@${users[Math.floor(Math.random() * users.length)]}_${Math.floor(Math.random() * 1000)}`,
      content: contents[Math.floor(Math.random() * contents.length)],
      timestamp: 'JUST NOW',
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 200),
      shares: Math.floor(Math.random() * 100),
      platform: platforms[Math.floor(Math.random() * platforms.length)]
    };
  };

  useEffect(() => {
    // Initial posts
    setPosts(Array.from({ length: 5 }).map(generatePost));

    // Live logging interval
    const interval = setInterval(() => {
      setPosts(prev => [generatePost(), ...prev.slice(0, 50)]);
    }, 4000);

    // Listen for system events
    const handleLedgerUpdate = (e: any) => {
      const entry = e.detail.lastEntry;
      const newPost: MockPost = {
        id: `sys-${Date.now()}`,
        user: 'NEXUS_CORE',
        handle: '@nexus_kernel_live',
        content: `[SYSTEM_LOG] New synaptic entry detected. Ledger count: ${e.detail.count}. Content: ${entry.substring(0, 80)}...`,
        timestamp: 'LIVE',
        likes: 0,
        comments: 0,
        shares: 0,
        platform: 'GITHUB'
      };
      setPosts(prev => [newPost, ...prev.slice(0, 50)]);
    };

    window.addEventListener('nexus-ledger-update', handleLedgerUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('nexus-ledger-update', handleLedgerUpdate);
    };
  }, []);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUrl(addressBar);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="w-full h-full bg-[#050505] flex flex-col font-sans relative overflow-hidden">
      {/* Glic & Nexus LLM Layer */}
      <div className="absolute bottom-12 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isGlicExpanded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-72 bg-black/90 border border-cyan-500/30 rounded-2xl p-4 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-3xl pointer-events-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Glic_Hub</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[8px] font-mono text-emerald-500">NEXUS_LINK_UP</span>
                </div>
              </div>

              <div className="h-48 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
                {nexusLogs.map((log, i) => (
                  <div key={i} className={`text-[9px] font-mono leading-tight ${log.startsWith('[NEXUS_ERR]') ? 'text-rose-400' : 'text-cyan-400/70'}`}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask the Nexus..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-cyan-500/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      runNexusCall(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Terminal className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsGlicExpanded(prev => !prev)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all pointer-events-auto shadow-2xl ${isGlicExpanded ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-black/60 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10'}`}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Browser Chrome */}
      <div className="bg-[#111] border-b border-white/10 p-3 flex flex-col gap-2 z-20">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 ml-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40"><ArrowLeft className="w-3 h-3" /></button>
            <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40"><ArrowRight className="w-3 h-3" /></button>
            <button onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }} className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40"><RotateCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /></button>
          </div>

          <form onSubmit={handleGo} className="flex-1 max-w-2xl mx-auto flex items-center bg-black/60 border border-white/5 rounded-full px-4 py-1.5 gap-2 group focus-within:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-1.5">
              {isSecure ? <Lock className="w-2.5 h-2.5 text-emerald-400" /> : <Globe className="w-2.5 h-2.5 text-white/20" />}
              <span className="text-[9px] font-mono text-emerald-400/60 uppercase">Secure</span>
            </div>
            <input 
              value={addressBar}
              onChange={(e) => setAddressBar(e.target.value)}
              className="flex-1 bg-transparent border-none text-[10px] font-mono text-white/80 focus:outline-none placeholder:text-white/20"
              placeholder="Enter Nexus_URL..."
            />
            <Search className="w-3 h-3 text-white/20 group-hover:text-cyan-400 transition-colors cursor-pointer" />
          </form>

          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-white/40"><Bell className="w-3.5 h-3.5" /></button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-px">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white/80" />
              </div>
            </div>
            {onBack && (
               <button onClick={onBack} className="ml-2 text-[9px] font-mono text-white/40 hover:text-white transition-colors border border-white/10 px-2 py-1 rounded">CLOSE_X</button>
            )}
          </div>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-white/5 bg-[#080808] p-4 flex flex-col gap-6 hidden lg:flex">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Navigation</h4>
            <nav className="space-y-1">
              {[
  { name: 'Synapse_Feed', icon: <MessageSquare className="w-3 h-3" />, active: url.includes('/feed') },
  { name: 'Planetary_Pulse', icon: <Globe className="w-3 h-3" />, active: url.includes('/spatial') },
  { name: 'Google_Nexus', icon: <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center text-[8px] font-black text-black">G</div>, active: url.includes('google.com') },
  { name: 'Kernel_Ops', icon: <Shield className="w-3 h-3" /> },
  { name: 'Vault_Archive', icon: <Bookmark className="w-3 h-3" /> },
].map(item => (
  <button 
    key={item.name} 
    onClick={() => {
      if (item.name === 'Google_Nexus') {
         setUrl('https://www.google.com/search?q=nexus+aggregated+outward+direction');
         setAddressBar('google://nexus.aggregated.nexus');
      } else if (item.name === 'Planetary_Pulse') {
         setUrl('https://nexus.social/spatial/navigation');
         setAddressBar('spatial://nexus.nav');
      }
    }}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-mono transition-all ${item.active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
  >
                  {item.icon} {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-3 bg-white/[0.02] border border-white/5 rounded-xl">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-emerald-400 uppercase">Live_Resonance</span>
             </div>
             <p className="text-[7px] font-mono text-white/30 lowercase leading-tight italic">
                monitoring collective consciousness for architectural alignment...
             </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-black relative scrollbar-hide" ref={scrollRef}>
          {isLoading ? (
            <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center gap-4">
               <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
               <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Establishing Secure Link...</span>
            </div>
          ) : (
            <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
              <header className="flex flex-col gap-2 mb-10 pb-6 border-b border-white/5">
                <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Nexus_Social</h1>
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">DECENTRALIZED NEURAL LOGGING PROTOCOL v1.0</span>
              </header>

              <AnimatePresence initial={false}>
                {posts.map((post, i) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center shrink-0">
                         {post.platform === 'X' ? <Twitter className="w-4 h-4 text-white/50" /> : post.platform === 'GITHUB' ? <Github className="w-4 h-4 text-white/50" /> : <Linkedin className="w-4 h-4 text-white/50" />}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors uppercase italic">{post.user}</span>
                            <span className="text-[9px] font-mono text-white/30 lowercase">{post.handle}</span>
                          </div>
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">{post.timestamp}</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/70 leading-relaxed uppercase">
                          {post.content}
                        </p>
                        <div className="flex gap-6 pt-2">
                           <div className="flex items-center gap-1.5 text-white/30 hover:text-rose-500 transition-colors cursor-pointer group/action">
                              <Heart className="w-3 h-3 group-hover/action:scale-110 transition-transform" />
                              <span className="text-[9px] font-mono">{post.likes}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-white/30 hover:text-cyan-500 transition-colors cursor-pointer group/action">
                              <MessageSquare className="w-3 h-3 group-hover/action:scale-110 transition-transform" />
                              <span className="text-[9px] font-mono">{post.comments}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-white/30 hover:text-emerald-500 transition-colors cursor-pointer group/action">
                              <Share2 className="w-3 h-3 group-hover/action:scale-110 transition-transform" />
                              <span className="text-[9px] font-mono">{post.shares}</span>
                           </div>
                           <div className="ml-auto text-white/10 group-hover:text-cyan-500/20 transition-colors">
                              <div className="flex items-center gap-1">
                                 <Eye className="w-3 h-3" />
                                 <span className="text-[8px] font-mono tracking-tighter">SYNA_V: {Math.floor(Math.random() * 10000)}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-black border-t border-white/5 flex items-center justify-between px-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <Globe className="w-3 h-3" />
               <span>Nexus_Gate: <span className="text-emerald-500">CONNECTED</span></span>
            </div>
            <span>IP: 137.222.95.0</span>
         </div>
         <div className="flex items-center gap-4">
            <span>RES: 1080n_HDR</span>
            <span>FPS: 144.2</span>
         </div>
      </footer>
    </div>
  );
}

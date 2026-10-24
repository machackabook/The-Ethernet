import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Globe, ShoppingBag, Coins, TrendingUp, User, Map, Wallet, Sparkles, Gem, Layers } from 'lucide-react';

interface LandParcel {
  id: string;
  x: number;
  y: number;
  owner: string;
  price: number;
  type: 'commercial' | 'residential' | 'void' | 'plaza';
  status: 'for_sale' | 'owned';
}

export function MetaverseHub() {
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [balance, setBalance] = useState(12450.75); // Tokenized currency
  const [landGrid, setLandGrid] = useState<LandParcel[]>([]);

  useEffect(() => {
    // Generate a 10x10 land grid for the Decentraland-inspired metaverse
    const parcels: LandParcel[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        parcels.push({
          id: `parcel-${x}-${y}`,
          x,
          y,
          owner: Math.random() > 0.7 ? 'User_0x82...f2' : 'Sovereign_Foundation',
          price: Math.floor(500 + Math.random() * 5000),
          type: x === 5 && y === 5 ? 'plaza' : (Math.random() > 0.8 ? 'commercial' : 'residential'),
          status: Math.random() > 0.5 ? 'for_sale' : 'owned'
        });
      }
    }
    setLandGrid(parcels);
  }, []);

  return (
    <div className="w-full h-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      {/* 1. METAVERSE TOP NAV */}
      <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between bg-black/40 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Nexus_Environment</h1>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Global_Decentralized_Reality_v1.2</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
             <Coins className="w-4 h-4 text-amber-400" />
             <div className="flex flex-col">
                <span className="text-[8px] text-white/40 uppercase font-black">Sovereign_Tokens</span>
                <span className="text-sm font-mono text-emerald-400">{balance.toLocaleString()} VOD</span>
             </div>
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
            <Wallet className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* 2. LAND MAP VIEW (GIRLD BASED) */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)] overflow-auto custom-scrollbar p-10">
           <div className="grid grid-cols-10 gap-1 w-[800px] h-[800px] mx-auto">
              {landGrid.map((parcel) => (
                <motion.button
                  key={parcel.id}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  onClick={() => setSelectedParcel(parcel)}
                  className={`aspect-square border transition-all duration-300 relative group ${
                    parcel.type === 'plaza' ? 'bg-cyan-500/20 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]' :
                    parcel.status === 'for_sale' ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/60' :
                    'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="absolute inset-x-0 bottom-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[6px] font-mono text-white/40">[{parcel.x},{parcel.y}]</span>
                  </div>
                  {parcel.type === 'commercial' && <Box className="w-3 h-3 absolute top-1 right-1 opacity-20" />}
                </motion.button>
              ))}
           </div>
        </div>

        {/* 3. ASSET INSPECTOR SLIDEOUT */}
        <div className="w-[420px] bg-black/60 border-l border-white/5 backdrop-blur-3xl p-10 flex flex-col gap-8 z-20 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {selectedParcel ? (
              <motion.div
                key={selectedParcel.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Parcel_Inspector</div>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                    District_{selectedParcel.id.split('-').slice(1).join('_')}
                  </h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono uppercase text-white/40">{selectedParcel.type}</span>
                    <span className={`px-3 py-1 border rounded-lg text-[9px] font-mono uppercase ${selectedParcel.status === 'for_sale' ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' : 'bg-rose-400/10 border-rose-400/30 text-rose-400'}`}>
                      {selectedParcel.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 uppercase font-black">Current_Owner</span>
                      <span className="text-xs font-mono font-bold text-white/80">{selectedParcel.owner}</span>
                   </div>
                   <div className="h-px bg-white/5" />
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 uppercase font-black">Coordinate_Matrix</span>
                      <span className="text-xs font-mono font-bold text-white/80">{selectedParcel.x}X / {selectedParcel.y}Y</span>
                   </div>
                   <div className="h-px bg-white/5" />
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40 uppercase font-black">Valuation</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-mono font-black text-emerald-400">{selectedParcel.price.toLocaleString()}</span>
                        <span className="text-[10px] font-mono text-emerald-400/40">VOD</span>
                      </div>
                   </div>
                </div>

                <button 
                  disabled={selectedParcel.status !== 'for_sale'}
                  className="w-full py-5 bg-cyan-500 rounded-3xl text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100"
                >
                  Acquire_Virtual_Land
                </button>

                <div className="pt-8 border-t border-white/5">
                   <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <ShoppingBag className="w-3 h-3" />
                     Related_Tokenized_Assets
                   </div>
                   <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer">
                           <div className="w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/5">
                              <Sparkles className="w-6 h-6 text-cyan-400" />
                           </div>
                           <div className="flex-1 flex flex-col justify-center">
                              <span className="text-[10px] font-bold text-white/80 uppercase">Nexus_Engine_NFT_0{i}</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <TrendingUp className="w-3 h-3 text-emerald-400" />
                                 <span className="text-[9px] font-mono text-emerald-400">+12.4% Yield</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40">
                <Map className="w-16 h-16" />
                <div className="flex flex-col gap-1">
                   <span className="text-sm font-black uppercase tracking-widest text-white">No_Parcel_Selected</span>
                   <span className="text-[10px] font-mono max-w-[200px]">Synchronize with mapping matrix to view tokenized land details.</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 4. BOTTOM ANALYTICS BAR */}
      <footer className="h-16 bg-black border-t border-white/5 px-10 flex items-center justify-between z-30">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                 <span className="text-[7px] text-white/20 uppercase tracking-widest">Market_Index</span>
                 <span className="text-[10px] font-mono text-emerald-400">84.22% Bullish</span>
              </div>
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <div className="flex flex-col">
                 <span className="text-[7px] text-white/20 uppercase tracking-widest">Network_Throughput</span>
                 <span className="text-[10px] font-mono text-purple-400">14.4K TPS</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <span className="text-[8px] font-black text-emerald-400/60 uppercase italic">Ledger_Integrity_Verified</span>
        </div>
      </footer>
    </div>
  );
}

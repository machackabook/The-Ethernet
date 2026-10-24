import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, Shield, Zap, Database, Share2, Network, Globe, Map as MapIcon, Grid, LayoutGrid, Info, ArrowUpRight, TrendingUp, Hexagon, Fingerprint } from 'lucide-react';

interface LandParcel {
  id: string;
  coords: { x: number; y: number };
  owner: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'VOID' | 'SANCTUARY';
  value: number;
  tokens: number;
}

const LAND_DATABASE: LandParcel[] = [
  { id: 'PARCEL_A1', coords: { x: 0, y: 0 }, owner: 'GENESIS_CORE', type: 'SANCTUARY', value: 125000, tokens: 12.5 },
  { id: 'PARCEL_B4', coords: { x: 1, y: 2 }, owner: 'USER_8812', type: 'COMMERCIAL', value: 45000, tokens: 4.5 },
  { id: 'PARCEL_C9', coords: { x: -2, y: 1 }, owner: 'VOID_ENTITY', type: 'VOID', value: 89000, tokens: 8.9 },
  { id: 'PARCEL_D2', coords: { x: 3, y: -1 }, owner: 'STARK_IND', type: 'COMMERCIAL', value: 210000, tokens: 21.0 },
  { id: 'PARCEL_E5', coords: { x: -1, y: -2 }, owner: 'UNCLAIMED', type: 'RESIDENTIAL', value: 15000, tokens: 1.5 },
];

export function MetaverseRegistry() {
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [viewMode, setViewMode] = useState<'GRID' | 'DATA'>('GRID');

  return (
    <div className="w-full h-full bg-[#050508] p-12 text-white flex flex-col gap-12 font-sans overflow-hidden">
      {/* Top Navigation */}
      <div className="flex justify-between items-end shrink-0">
         <div>
            <div className="flex items-center gap-3 mb-2">
               <Fingerprint className="w-6 h-6 text-rose-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Ownership_Protocol_v1</span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Sovereign_Land_Registry</h1>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => setViewMode('GRID')}
              className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${viewMode === 'GRID' ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`}
            >
               <LayoutGrid className="w-4 h-4" /> Spatial_Grid
            </button>
            <button 
              onClick={() => setViewMode('DATA')}
              className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${viewMode === 'DATA' ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`}
            >
               <Database className="w-4 h-4" /> Asset_Matrix
            </button>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-12 min-h-0">
         {/* Grid View */}
         <div className="col-span-8 bg-white/[0.02] border border-white/5 rounded-[40px] p-8 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative grid grid-cols-5 grid-rows-5 gap-4">
               {Array.from({ length: 25 }).map((_, i) => {
                  const x = (i % 5) - 2;
                  const y = Math.floor(i / 5) - 2;
                  const parcel = LAND_DATABASE.find(p => p.coords.x === x && p.coords.y === y);
                  
                  return (
                     <motion.button
                        key={i}
                        whileHover={{ scale: 1.05, zIndex: 10 }}
                        onClick={() => setSelectedParcel(parcel || null)}
                        className={`w-24 h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 group ${parcel ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/40'}`}
                     >
                        <div className="text-[8px] font-mono text-white/20 uppercase">{x},{y}</div>
                        {parcel ? (
                           <>
                              <Hexagon className="w-6 h-6 text-rose-500" />
                              <div className="text-[7px] font-black uppercase text-white/60">{parcel.type}</div>
                           </>
                        ) : (
                           <div className="w-6 h-6 border border-white/10 rounded-full border-dashed" />
                        )}
                     </motion.button>
                  );
               })}
            </div>
         </div>

         {/* Info Panel */}
         <div className="col-span-4 flex flex-col gap-8 min-h-0">
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex-1 flex flex-col shadow-2xl">
               <AnimatePresence mode="wait">
                  {selectedParcel ? (
                     <motion.div 
                        key={selectedParcel.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex-1 flex flex-col"
                     >
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <div className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mb-2 italic">Land_Parcel_Object</div>
                              <h2 className="text-3xl font-black italic text-white uppercase">{selectedParcel.id}</h2>
                           </div>
                           <div className="p-3 bg-rose-500/10 rounded-2xl">
                              <Shield className="w-6 h-6 text-rose-500" />
                           </div>
                        </div>

                        <div className="space-y-6 flex-1">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                 <div className="text-[8px] font-mono text-white/20 uppercase mb-2">Owner_Registry</div>
                                 <div className="text-xs font-black text-white">{selectedParcel.owner}</div>
                              </div>
                              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                 <div className="text-[8px] font-mono text-white/20 uppercase mb-2">Spatial_Zone</div>
                                 <div className="text-xs font-black text-rose-400">{selectedParcel.type}</div>
                              </div>
                           </div>

                           <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                              <div className="flex justify-between items-center mb-4">
                                 <div className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3 text-emerald-400" /> Market_Analysis
                                 </div>
                                 <div className="text-[8px] font-mono text-white/30 uppercase">Synced_Live</div>
                              </div>
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-white/40 uppercase">Est_Value</span>
                                    <span className="text-xl font-black text-white">${selectedParcel.value.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono text-white/40 uppercase">Token_Yield</span>
                                    <span className="text-xl font-black text-emerald-400">{selectedParcel.tokens} NEX</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                              <div className="text-[10px] font-black uppercase text-white tracking-widest mb-4">Digital_Inventory (NFTs)</div>
                              <div className="grid grid-cols-3 gap-3">
                                 {['MODULAR_HUB', 'VOID_GATE', 'OXYGEN_NODE'].map((item, i) => (
                                    <div key={i} className="aspect-square bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center hover:border-rose-500/50 transition-all cursor-pointer">
                                       <Box className="w-5 h-5 text-white/20" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <button className="w-full py-5 bg-rose-500 text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_50px_rgba(244,63,94,0.3)]">
                           Initiate_Title_Transfer
                        </button>
                     </motion.div>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 opacity-20">
                        <Grid className="w-20 h-20" />
                        <div className="space-y-2">
                           <div className="text-xl font-black uppercase tracking-widest">No_Parcel_Selected</div>
                           <p className="text-[10px] font-mono uppercase italic">Select a grid coordinate to view dimensional data</p>
                        </div>
                     </div>
                  )}
               </AnimatePresence>
            </div>

            {/* Global Stats */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6 shadow-xl">
               <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Network_Ecosystem_Stats</span>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div>
                     <div className="text-[8px] font-mono text-white/20 uppercase mb-1">Total_Parcels</div>
                     <div className="text-2xl font-black text-white">100,000</div>
                  </div>
                  <div>
                     <div className="text-[8px] font-mono text-white/20 uppercase mb-1">Active_Users</div>
                     <div className="text-2xl font-black text-white">42,881</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Compass, MapPin, Activity, HardDrive, Shield } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export function SpatialNavigator() {
  const [telemetry, setTelemetry] = useState<{ lat: number, lng: number, id: string, status: string }[]>([
    { lat: 37.7749, lng: -122.4194, id: 'NODE_ALPHA', status: 'SYNCHRONIZED' },
    { lat: 34.0522, lng: -118.2437, id: 'NODE_BETA', status: 'PENDING_LINK' },
    { lat: 40.7128, lng: -74.0060, id: 'NODE_GAMMA', status: 'RESONANCE_DETECTED' }
  ]);

  const [activeNode, setActiveNode] = useState(telemetry[0]);

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#050505] text-white p-8 font-mono border-2 border-dashed border-white/5 m-4 rounded-3xl">
        <MapPin className="w-16 h-16 text-cyan-500/20 mb-6" />
        <h2 className="text-xl font-black italic tracking-widest uppercase mb-4 text-cyan-400">Spatial AI Offline</h2>
        <p className="text-[10px] text-white/40 max-w-sm text-center mb-8 uppercase tracking-tighter">
          The Google Maps Platform API key is required to render the real-time spatial AI navigation matrix.
        </p>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-md w-full">
            <ol className="text-[9px] space-y-3 uppercase tracking-widest">
                <li>1. Open Settings (⚙️ Top Right)</li>
                <li>2. Select Secrets</li>
                <li>3. Add <span className="text-cyan-400">GOOGLE_MAPS_PLATFORM_KEY</span></li>
            </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden font-mono">
      <div className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-6 z-20">
         <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-black italic uppercase tracking-[0.3em] text-white">Spatial_AI_Nav_Matrix</h2>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <Activity className="w-3 h-3 text-emerald-500" />
               <span className="text-[9px] text-white/40">LINK_STABILITY: <span className="text-emerald-400">99.8%</span></span>
            </div>
            <div className="flex items-center gap-2">
               <Shield className="w-3 h-3 text-cyan-400" />
               <span className="text-[9px] text-white/40">NODES_LOGGED: <span className="text-cyan-400">{telemetry.length}</span></span>
            </div>
         </div>
      </div>

      <div className="flex-1 relative">
         <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
              defaultZoom={4}
              mapId="D0C_MAP_NEXUS"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
               {telemetry.map(node => (
                 <AdvancedMarker 
                    key={node.id} 
                    position={{ lat: node.lat, lng: node.lng }}
                    onClick={() => setActiveNode(node)}
                 >
                    <div className="relative group">
                       <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute -inset-4 bg-cyan-500/20 rounded-full"
                       />
                       <div className={`w-3 h-3 rounded-full border-2 border-white shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all ${node.id === activeNode.id ? 'bg-cyan-400 scale-125' : 'bg-cyan-900 group-hover:bg-cyan-600'}`} />
                    </div>
                 </AdvancedMarker>
               ))}
            </Map>
         </APIProvider>

         {/* Floating Node Info */}
         <div className="absolute top-6 left-6 w-64 pointer-events-none space-y-4">
            <AnimatePresence mode="wait">
               <motion.div 
                 key={activeNode.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-4 rounded-2xl pointer-events-auto"
               >
                  <div className="flex items-center gap-3 mb-3">
                     <HardDrive className="w-4 h-4 text-cyan-400" />
                     <h3 className="text-[10px] font-black text-white italic tracking-widest">{activeNode.id}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                     <div className="flex justify-between text-[8px] font-mono">
                        <span className="text-white/40">COORDS</span>
                        <span className="text-cyan-400">{activeNode.lat.toFixed(4)}, {activeNode.lng.toFixed(4)}</span>
                     </div>
                     <div className="flex justify-between text-[8px] font-mono">
                        <span className="text-white/40">STATUS</span>
                        <span className="text-emerald-400 tracking-tighter italic">{activeNode.status}</span>
                     </div>
                  </div>
                  <button className="w-full py-1.5 border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-black text-cyan-400 uppercase tracking-widest rounded-lg hover:bg-cyan-500 hover:text-black transition-all">
                     Initiate_Synapse_Link
                  </button>
               </motion.div>
            </AnimatePresence>

            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl backdrop-blur-sm pointer-events-auto">
               <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Telemetry_Stream</h4>
               <div className="space-y-1.5">
                  {telemetry.map(node => (
                    <div key={node.id} className="flex items-center gap-2 text-[8px] font-mono">
                       <div className={`w-1 h-1 rounded-full ${node.status === 'SYNCHRONIZED' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                       <span className="text-white/60 truncate flex-1">{node.id}</span>
                       <span className="text-white/20">OK</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Navigation HUD Control */}
         <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto">
            <button className="w-12 h-12 bg-black/80 border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 hover:border-cyan-400 transition-all shadow-2xl">
               <Navigation className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
}

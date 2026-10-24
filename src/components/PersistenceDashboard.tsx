import React from 'react';
import { saveWorldState, loadWorldState, WorldState } from '../lib/persistence';

export function PersistenceDashboard() {
  const handleSave = () => {
    // In a real app, you'd aggregate state from context/state managers
    const dummyState: WorldState = {
        animus: { complexity: parseFloat(localStorage.getItem('animus-void-complexity') || '0.5'), speed: parseFloat(localStorage.getItem('animus-void-speed') || '1') },
        metaverse: { devices: JSON.parse(localStorage.getItem('metaverse-devices') || '[]') }
    };
    saveWorldState(dummyState);
    alert("World state archived to Sovereign Cache.");
  };

  const handleLoad = () => {
    const state = loadWorldState();
    if (state) {
        localStorage.setItem('animus-void-complexity', state.animus.complexity.toString());
        localStorage.setItem('animus-void-speed', state.animus.speed.toString());
        localStorage.setItem('metaverse-devices', JSON.stringify(state.metaverse.devices));
        window.location.reload();
    } else {
        alert("No temporal state found.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex gap-2">
      <button onClick={handleSave} className="p-2 bg-black border border-[#ff003c] text-[#ff003c] rounded text-xs font-mono hover:bg-[#ff003c]/20">SAVE_STATE</button>
      <button onClick={handleLoad} className="p-2 bg-black border border-[#00f0ff] text-[#00f0ff] rounded text-xs font-mono hover:bg-[#00f0ff]/20">LOAD_STATE</button>
    </div>
  );
}

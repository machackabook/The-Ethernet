import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';

interface TelemetryData {
    neuralLoad: number;
    entropy: number;
    voxelSync: number;
}

export const TelemetryFeed: React.FC = () => {
    const [telemetry, setTelemetry] = useState<TelemetryData>({ neuralLoad: 0, entropy: 0, voxelSync: 1.0 });

    useEffect(() => {
        const handleTelemetry = (e: Event) => {
            const detail = (e as CustomEvent<TelemetryData>).detail;
            setTelemetry(detail);
        };
        window.addEventListener('sovereign-telemetry', handleTelemetry);
        return () => window.removeEventListener('sovereign-telemetry', handleTelemetry);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-20 right-4 z-[100] p-4 bg-black/80 backdrop-blur-md border border-[#ff003c]/40 rounded-lg text-[#00f0ff] font-mono text-xs w-48 shadow-[0_0_10px_rgba(255,0,60,0.3)]"
        >
            <div className="flex items-center gap-2 mb-2 border-b border-[#ff003c]/20 pb-2">
                <Activity size={12} className="text-[#ff003c]" />
                <span className="font-bold text-[#ff003c]">TELEMETRY_FEED</span>
            </div>
            <div className="space-y-1">
                <div>NEURAL_LOAD: {telemetry.neuralLoad}</div>
                <div>ENTROPY: {telemetry.entropy}</div>
                <div>VOXEL_SYNC: {telemetry.voxelSync.toFixed(2)}</div>
            </div>
        </motion.div>
    );
};

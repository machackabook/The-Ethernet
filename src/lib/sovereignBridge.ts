
export interface SovereignCore {
    version: string;
    status: string;
    canvasSync: boolean;
    metrics: { neuralLoad: number; entropy: number; voxelSync: number };
    streamEncrypted?: boolean;
}

declare global {
    interface Window {
        SOVEREIGN_CORE: SovereignCore;
        toggleStreamEncryption: (forceState?: boolean) => boolean;
        startFourierTelemetryStream: (frequencyMs?: number) => void;
        triggerVoicePanicKeyword: (keyword?: string) => void;
        ws?: WebSocket;
    }
}

export function initializeSovereignBridge() {
    if (typeof window === 'undefined') return;

    window.SOVEREIGN_CORE = {
        version: "v28.0-Forge",
        status: "ACTIVE_PROACTIVE",
        canvasSync: true,
        metrics: { neuralLoad: 0.12, entropy: 0.05, voxelSync: 1.0 }
    };

    window.toggleStreamEncryption = function(forceState) {
        const current = window.SOVEREIGN_CORE.streamEncrypted ?? true;
        window.SOVEREIGN_CORE.streamEncrypted = forceState !== undefined ? forceState : !current;
        console.log(`[ENCRYPTION SHIELD] State shifted to: ${window.SOVEREIGN_CORE.streamEncrypted ? "E-ON" : "E-OFF"}`);
        return !!window.SOVEREIGN_CORE.streamEncrypted;
    };

    let telemetryInterval: NodeJS.Timeout | null = null;
    window.startFourierTelemetryStream = function(frequencyMs = 1000) {
        if (telemetryInterval) clearInterval(telemetryInterval);
        
        telemetryInterval = setInterval(() => {
            window.SOVEREIGN_CORE.metrics.neuralLoad = +(Math.random() * 0.4 + 0.1).toFixed(2);
            window.SOVEREIGN_CORE.metrics.entropy = +(Math.random() * 0.1).toFixed(2);
            
            // Dispatch standard telemetry update event for active canvas layers
            const event = new CustomEvent("sovereign-telemetry", { detail: window.SOVEREIGN_CORE.metrics });
            window.dispatchEvent(event);
        }, frequencyMs);
        console.log(`[SOVEREIGN] Telemetry loop streaming at ${frequencyMs}ms intervals.`);
    };

    window.triggerVoicePanicKeyword = function(keyword = "Help") {
        console.warn(`[PROACTIVE RECOVERY] Acoustic scanner tripped on term: "${keyword}"`);
        if (window.ws && window.ws.readyState === 1) {
            window.ws.send(`sys://panic-trigger {"source":"voice_profile","keyword":"${keyword}"}`);
        }
    };

    window.addEventListener("message", (event) => {
        if (event.data && event.data.source === "harvester-extension") {
            console.log("🕷️ [VON NEUMANN INGESTION] ", event.data.payload);
            if (window.ws && window.ws.readyState === 1) {
                window.ws.send(`sys://ingest ${JSON.stringify(event.data.payload)}`);
            }
        }
    });

    window.startFourierTelemetryStream(2000);
    console.log("%c §ɣ²⁸ CORESYNCOCKPIT INITIALIZED ", "background: #1a0933; color: #00f0ff; font-weight: bold; font-size: 14px; padding: 4px; border: 1px solid #ff003c;");
}

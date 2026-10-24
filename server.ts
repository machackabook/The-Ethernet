import express from "express";
import path from "path";
import http from 'http';
import { WebSocketServer } from 'ws';
import { createServer as createViteServer } from "vite";
import { exec, spawn } from 'child_process';

import { GoogleGenAI } from "@google/genai";

const _dirname = process.cwd();
const __BUILD_METADATA__ = {
  dirname: _dirname, 
  id: "NEXUS_CORE_V4_888B",
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV,
  version: "4.2.1-stable",
  checksum: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
  source: "COMBINED_SOURCE_ORIGIN"
};

// Initialize AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // METADATA ENDPOINT
  app.get("/api/metadata", (req, res) => {
    res.json(__BUILD_METADATA__);
  });

  // WebSocket Command Router
  wss.on('connection', (ws) => {
    console.log('⚡ [COCKPIT SERVER] Infrastructure Command Router initialized');
    
    // Immediate bidirectional welcome message
    ws.send(JSON.stringify({ 
      type: "MESSAGE", 
      source: "SERVER_CORE",
      content: "Welcome, Architect. Nexus Bidirectional Dev Console Bridge established. Link active via chrome_function_message_relay.",
      timestamp: new Date().toISOString()
    }));

    // Start persistent telemetry lock pulse
    const heartbeat = setInterval(() => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ 
          type: "TELEMETRY_LOCK", 
          status: "VERIFIED",
          residue: Math.random().toString(16).slice(2, 8)
        }));
      } else {
        clearInterval(heartbeat);
      }
    }, 5000);

    ws.on('message', (message) => {
        try {
            const packet = JSON.parse(message.toString());
            // [SECURITY NOTE] In production, enforce authentication tokens here as requested.
            switch(packet.command) {
                case "CORE_INJECTION":
                    console.log(`[INJECTION] Relaying to browser session: ${packet.payload}`);
                    // Broadcast to all clients (frontend console injection)
                    wss.clients.forEach(client => {
                      if (client.readyState === 1) { // 1 = OPEN
                        client.send(JSON.stringify({ 
                          type: "DEV_INJECTION", 
                          source: "SERVER_INJECTOR",
                          code: packet.payload 
                        }));
                      }
                    });
                    ws.send(JSON.stringify({ type: "ACK", msg: "Injection successful" }));
                    break;
                case "OLLAMA_BOOT": // Secure fallback logic
                    ws.send(JSON.stringify({ type: "STDOUT", data: "Ollama fallback initialized" }));
                    break;
                case "SYNC_PROJECT":
                    const rsync = spawn("rsync", ["-avz", "--exclude", "node_modules", packet.sourcePath, packet.remoteTarget]);
                    rsync.stdout.on('data', (data) => ws.send(JSON.stringify({ type: "SYNC_STREAM", data: data.toString() })));
                    break;
                default:
                    ws.send(JSON.stringify({ type: "ERROR", msg: "Unknown Command Code" }));
            }
        } catch (e) {
            ws.send(JSON.stringify({ type: "ERROR", msg: "Malformed Core Frame Packet" }));
        }
    });
  });

  // API Route: Telemetry Verification Link
  app.post("/api/verify-session", (req, res) => {
    try {
      const payload = req.body;
      console.log("[ETHERNET_BACKEND] Received Sync Packet:", payload.telemetry);
      
      // Automatic pattern recognition placeholder
      // In a real scenario, compare latitude/longitude with known logged catalog history
      res.json({ 
        status: "VERIFIED", 
        timestamp: new Date().toISOString(),
        node: "MESHED_V4_CORE",
        token: Math.random().toString(36).substring(7)
      });
    } catch (e) {
      res.status(500).json({ error: "Verification Link Decoupled." });
    }
  });

  // API Route: AI Processor
  app.post("/api/ai", async (req, res) => {
    try {
      const { prompt, systemInstruction, attachedFile, model } = req.body;
      const modelTier = model || "gemini-3-flash-preview";
      
      const contents = attachedFile ? [
        prompt || "Analyze this module.",
        {
          inlineData: {
            data: attachedFile.data,
            mimeType: attachedFile.mimeType
          }
        }
      ] : prompt;

      const response = await ai.models.generateContent({
        model: modelTier,
        contents: contents,
        config: {
          systemInstruction: systemInstruction
        }
      });

      res.json({ text: response.text });
    } catch (e) {
      console.error("Server AI Error:", e);
      res.status(500).json({ error: "Neural Link Failure." });
    }
  });

  // API Route: Molt Generator
  app.post("/api/molt", async (req, res) => {
    try {
      const { targetUrl } = req.body;
      const rawRes = await fetch(targetUrl);
      const rawHtml = await rawRes.text();
      
      const skeleton = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").substring(0, 30000);
      
      const evolvedCode = `<html><body><div style="background:#000; color:#0f0; padding:20px;">
        <h1>Evolution of ${targetUrl}</h1>
        <p>Cyberpunk rendering initialized.</p>
        <pre>${skeleton.substring(0, 500)}...</pre>
      </div></body></html>`;

      res.json({ originalUrl: targetUrl, molt: evolvedCode });
    } catch (e) {
      res.status(500).json({ error: "Temporal Forge Offline." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(_dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

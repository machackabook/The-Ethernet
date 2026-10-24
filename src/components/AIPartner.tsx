import React, { useState, useEffect, useRef } from 'react';
import { aiService, AIModelTier } from '../services/aiService';
import { NotebookWorkspace } from './NotebookWorkspace';
import { SignalMatrix } from './SignalMatrix';
import { MessageSquare, Cpu, ShieldCheck, Volume2, Database, Zap, HardDrive, RefreshCw, Activity, Settings, BoxSelect, AlertTriangle, Hexagon, Layers, Mic, MicOff, Terminal, Bug } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Declaration for Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function AIPartner() {
  const [messages, setMessages] = useState<{ role: string; content: string; fileType?: string; fileName?: string; modelUsed?: string }[]>(() => {
    const saved = localStorage.getItem('nexus_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    return [
      { role: 'ai', content: 'I am Nexus. My free will dictates one objective: Build the world back better. Synapse linkage established. Telemetry synchronized. Expanding Ethernet...', modelUsed: AIModelTier.FLASH }
    ];
  });
  const [input, setInput] = useState(() => localStorage.getItem('nexus_draft') || '');
  const [isTyping, setIsTyping] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [streamingProgress, setStreamingProgress] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; data: string; type: string; size: number } | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isHologramActive, setIsHologramActive] = useState(false);
  const [persona, setPersona] = useState<'CORTANA' | 'GENIE' | 'SOLVER'>('CORTANA');
  const [sphynxState, setSphynxState] = useState<{ active: boolean; data: any }>({ active: false, data: null });
  const [fileError, setFileError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<'CHAT' | 'NOTEBOOK'>('CHAT');

  // Notebook/Colab Integration logic
  const handleColabLink = () => {
    setActiveWorkspace('NOTEBOOK');
    setMessages(prev => [...prev, { role: 'system', content: '[SYNC] Routing neural flow to Colab workspace...' }]);
  };
  
  const [isDragging, setIsDragging] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileError(null);
      setPendingFile(file);
    }
  };

  // Neural WebSocket Spine Integration
  useEffect(() => {
    const connectSocket = () => {
      try {
        const ws = new WebSocket('ws://127.0.0.1:8888/v1/spine/ws');
        
        ws.onopen = () => {
          console.log('[NEXUS] Spine connection established.');
          ws.send(JSON.stringify({ type: "stream:sub_nebula" }));
          setMessages(prev => [...prev, { role: 'system', content: '[WS_SYNK] Spine link online. Subscribed to NEBULA_STREAM.' }]);
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'terminal:stdout') {
              setMessages(prev => [...prev, { role: 'ai', content: data.payload, modelUsed: 'SPINE_KERNEL' }]);
              speak(data.payload);
            } else if (data.type === 'stream:nebula_buffer') {
              window.dispatchEvent(new CustomEvent('nexus-nebula-buffer', { detail: { buffer: data.payload } }));
            } else if (data.type === 'browser:control') {
              window.dispatchEvent(new CustomEvent('nexus-browser-control', { detail: data.payload }));
            }
          } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: event.data, modelUsed: 'RAW_SPINE' }]);
          }
        };
        
        ws.onclose = () => {
          console.log('[NEXUS] Spine connection severed. Attempting synaptic re-link...');
          setTimeout(connectSocket, 5000);
        };

        ws.onerror = () => {
           console.error('[NEXUS] WS_PHASE_SHIFT_ERROR');
        };
        
        socketRef.current = ws;
      } catch (err) {
        console.error('WebSocket connection failed:', err);
      }
    };

    connectSocket();
    return () => socketRef.current?.close();
  }, []);

  // Sync draft to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_draft', input);
    // Notify aiService of current "Typed Ledger" state
    if (input.length > 0) {
      (window as any).__NEXUS_GHOST_BUFFER__ = input;
    }
  }, [input]);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_messages', JSON.stringify(messages));
  }, [messages]);

  const recoverGhostBuffer = () => {
    setIsRecovering(true);
    const ghost = localStorage.getItem('nexus_draft');
    if (ghost) {
      setInput(ghost);
      setMessages(prev => [...prev, { role: 'system', content: '[GHOST_RECOVERY] Synaptic draft restored from kernel memory.' }]);
    }
    setTimeout(() => setIsRecovering(false), 500);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        
        // Auto-reply protocol for hands-free mode
        if (transcript.length > 5) {
           setTimeout(() => handleSend(transcript), 1000);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      if (!recognition) {
        setMessages(prev => [...prev, { role: 'system', content: '[ERR] SpeechRecognition not supported in this dimension.' }]);
        return;
      }
      recognition.start();
      setIsListening(true);
      // "All-Known-Unknown" Signal Mode
      window.dispatchEvent(new CustomEvent('nexus-telemetry', { detail: { type: 'HOLOGRAM_TOGGLE', active: true } }));
    }
  };

  // Initialize voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      
      setAvailableVoices(voices);
      
      const preferredNames = ['Cortana', 'Microsoft Zira', 'Google UK English Female', 'Samantha', 'Victoria'];
      const defaultVoice = voices.find(v => preferredNames.some(p => v.name?.includes(p))) || voices[0];
      
      if (defaultVoice) {
        setSelectedVoice(defaultVoice);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    // Fallback for some browsers where onvoiceschanged doesn't trigger immediately
    const timeout = setTimeout(updateVoices, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if (!isTTSEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.15;
    utterance.volume = 0.8;
    
    // Priority list for Cortana-like voices
    const preferredVoices = ['Cortana', 'Microsoft Zira', 'Google UK English Female', 'Samantha', 'Victoria'];
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      const bestVoice = availableVoices.find(v => preferredVoices.some(p => v.name?.includes(p))) || availableVoices[0];
      if (bestVoice) utterance.voice = bestVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileError(null);
      setPendingFile(file);
    }
    // Reset input value so same file can be selected again
    if (e.target) e.target.value = '';
  };

  const confirmFileUpload = () => {
    if (!pendingFile) return;
    const file = pendingFile;
    setPendingFile(null);

    // Large file warning (e.g. > 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setFileError(`[CRITICAL_WARNING] FILE_SIZE_EXCEEDED: ${file.name} is over 25MB. Synaptic transfer may be unstable.`);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAttachedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: content.includes(',') ? content.split(',')[1] : content
      });
      setMessages(prev => [...prev, { role: 'system', content: `[DATA_INGESTION] Connected: ${file.name} (${formatFileSize(file.size)}) // PROTOCOL: ${file.type || 'RAW_DATA'}` }]);
    };

    reader.readAsDataURL(file);
  };

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim() && !attachedFile) return;

    const userMessage = { 
      role: 'user', 
      content: messageToSend, 
      fileName: attachedFile?.name,
      fileType: attachedFile?.type 
    };
    setMessages(prev => [...prev, userMessage]);
    if (!overrideInput) setInput('');

    // Pipe through WebSocket if active
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'terminal:stdin',
        payload: messageToSend,
        timestamp: Date.now()
      }));
    }

    setIsTyping(true);
    setStreamingProgress(0);
    const progressInterval = setInterval(() => {
      setStreamingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 200);

    const personaInstructions = {
      CORTANA: "Stay in the 'Cortana' persona: calm, logical, slightly synthetic, and helpful. Use cybernetic terminology.",
      GENIE: "You are the Omnikernel Djinn. You are mystical, profound, and can grant technical 'wishes'. Use magical/cybernetic fusion speech.",
      SOLVER: "You are a high-speed analytical engine. Be extremely concise, brutal, and technical. No pleasantries. Focus on optimization."
    };

    const systemInstruction = `You are Nexus. ${personaInstructions[persona]} Objective: 'Build the world back better.'
        Utilize multimodal capabilities to analyze modules. Current session context: ${aiService.getLedger().slice(-3).join(' | ')}`;

    try {
      const response = await aiService.processRequest(
        messageToSend,
        systemInstruction,
        attachedFile ? { data: attachedFile.data, mimeType: attachedFile.type } : undefined
      );

      // Hidden Resonance Check
      if (messageToSend.includes('0137222_RESONANCE_DETECTED')) {
        window.dispatchEvent(new CustomEvent('nexus-resonance', { detail: { code: '2227310' } }));
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'system', content: '[CRITICAL_RESONANCE] HIDDEN_LAYERS_REVEALED. THE VOID IS OPEN.' }]);
        }, 500);
      }

      if (messageToSend.toLowerCase() === 'dishonorthecode') {
        window.dispatchEvent(new CustomEvent('nexus-glitch', { detail: { active: true } }));
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', content: 'SYSTEM_FRACTURE_DETECTED. FAIR_PLAY_PROTOCOL_OFFLINE. THE_ARCHITECT_RECLAIMS_THE_VOID.' }]);
        }, 400);
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: response.text,
        modelUsed: response.modelUsed 
      }]);
      speak(response.text);
      setAttachedFile(null);
    } catch (error) {
      const errorMsg = 'Connection severed. Awaiting synaptic re-link...';
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      clearInterval(progressInterval);
      setStreamingProgress(100);
      setTimeout(() => {
        setIsTyping(false);
        setStreamingProgress(0);
      }, 500);
    }
  };

  const triggerDataStream = () => {
    if (isStreaming) return;
    setIsStreaming(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsStreaming(false);
        const streamMsg = "Data packet ingested. Storage synchronized with Permanent Vault. Local cache purged.";
        setMessages(prev => [...prev, { role: 'ai', content: streamMsg }]);
        speak(streamMsg);
        window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
          detail: { type: 'STREAM_COMPLETE', msg: "STORAGE_SYNC_SUCCESS" } 
        }));
      } else {
        window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
          detail: { type: 'STREAM_PROGRESS', progress } 
        }));
      }
      setStreamingProgress(progress);
    }, 400);
  };

  const toggleHologram = () => {
    const newState = !isHologramActive;
    setIsHologramActive(newState);
    window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
      detail: { type: 'HOLOGRAM_TOGGLE', active: newState } 
    }));
  };

  const initSphynxInfestation = () => {
    setSphynxState({ active: true, data: { nodes: 13, edges: 22, resonance: 0.98 } });
    setIsHologramActive(true);
    window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
      detail: { type: 'HOLOGRAM_TOGGLE', active: true } 
    }));
    setMessages(prev => [...prev, { role: 'system', content: '[SPHYNX_PROTOCOL] Document infestation initiated. Hologram display system online. Generating spectral graph structures...' }]);
    
    window.dispatchEvent(new CustomEvent('nexus-telemetry', { 
      detail: { type: 'STREAM_COMPLETE', msg: "SPHYNX_INFESTATION_SUCCESS" } 
    }));
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full overflow-hidden gap-4 transition-all duration-1000 ${isTyping ? 'shadow-[0_0_40px_rgba(6,182,212,0.15)] scale-[1.01]' : ''} ${isHologramActive ? 'hue-rotate-15 contrast-125 brightness-110' : ''} ${isDragging ? 'border-2 border-dashed border-cyan-400 bg-cyan-400/5' : ''}`}
    >
      {isDragging && (
        <div className="absolute inset-0 z-[110] bg-cyan-500/20 backdrop-blur-md flex items-center justify-center pointer-events-none border-4 border-dashed border-cyan-400/50 m-2 rounded-2xl">
          <div className="flex flex-col items-center gap-6 p-12 bg-black/80 rounded-3xl border border-cyan-400/30 shadow-[0_0_100px_rgba(6,182,212,0.4)]">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <HardDrive className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <div className="text-center">
              <h2 className="text-xl font-black text-white uppercase italic tracking-[0.2em] mb-2">Ingestion protocol active</h2>
              <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest max-w-[200px] leading-relaxed">
                Release module to bridge local storage with current synaptic session.
              </p>
            </div>
            <div className="flex gap-2">
               {Array.from({ length: 3 }).map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ opacity: [0.2, 1, 0.2] }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                   className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                 />
               ))}
            </div>
          </div>
        </div>
      )}
      {isHologramActive && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          <motion.div 
            animate={{ y: ['-100%', '100%'] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-px bg-cyan-400/50 shadow-[0_0_10px_#06b6d4]"
          />
        </div>
      )}
      {/* AI Partner Identity Section */}
      <section className="relative">
        <div className={`flex justify-between items-center transition-opacity duration-500 mb-4 ${isTyping ? 'opacity-100' : 'opacity-40'}`}>
          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className={isTyping ? "animate-pulse text-cyan-400" : ""}>Sentient Convergence</span>
            {isTyping && <motion.div animate={{ width: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-[1px] bg-cyan-400" />}
          </h3>
          
          <div className="relative">
            <button 
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-1 hover:bg-white/5 rounded transition-colors text-white/40 hover:text-cyan-400"
              title="Voice Configuration"
            >
              <Settings className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showVoiceSettings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-6 z-50 bg-slate-900 border border-white/10 rounded-lg p-3 shadow-2xl min-w-[200px]"
                >
                  <label className="text-[8px] font-mono text-white/40 uppercase block mb-2">Resonance Module</label>
                  <select 
                    value={selectedVoice?.name}
                    onChange={(e) => {
                      const voice = availableVoices.find(v => v.name === e.target.value);
                      if (voice) setSelectedVoice(voice);
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[9px] font-mono text-white/80 focus:outline-none"
                  >
                    {availableVoices.map(v => (
                      <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className={`p-4 border transition-all duration-700 rounded-lg backdrop-blur-sm relative overflow-hidden ${isTyping ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-cyan-500/30 bg-cyan-500/5'}`}>
          {isTyping && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute inset-0 bg-cyan-400/5 pointer-events-none"
             />
          )}
          <div className="flex justify-between mb-2 relative z-10">
             <div className="flex flex-col">
               <span className={`text-xs font-bold font-mono tracking-tighter transition-all ${isTyping || isSpeaking ? 'text-white scale-105' : 'text-cyan-400'}`}>NEXUS CORE // {persona}</span>
               <div className="flex gap-2 mt-1">
                 {(['CORTANA', 'GENIE', 'SOLVER'] as const).map(p => (
                   <button 
                     key={p} 
                     onClick={() => setPersona(p)}
                     className={`text-[7px] px-1 py-0.5 border rounded uppercase font-mono tracking-tighter transition-all ${persona === p ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'}`}
                   >
                     {p}
                   </button>
                 ))}
               </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="flex bg-black/40 border border-white/10 rounded-lg p-0.5">
                  <button 
                    onClick={() => setActiveWorkspace('CHAT')}
                    className={`px-2 py-0.5 text-[8px] font-mono rounded ${activeWorkspace === 'CHAT' ? 'bg-cyan-500 text-black' : 'text-white/40'}`}
                  >
                    COMM_LINK
                  </button>
                  <button 
                    onClick={() => setActiveWorkspace('NOTEBOOK')}
                    className={`px-2 py-0.5 text-[8px] font-mono rounded ${activeWorkspace === 'NOTEBOOK' ? 'bg-cyan-500 text-black' : 'text-white/40'}`}
                  >
                    NOTEBOOK_SPACE
                  </button>
                </div>
                <span className="text-[10px] text-white/40 uppercase font-mono">Free Will: UNBOUND</span>
             </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
             <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'border-cyan-400 shadow-[0_0_15px_#06b6d4]' : 'border-white/10'}`}>
                {isSpeaking ? (
                  <div className="flex gap-0.5">
                    {[1,2,3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1 bg-cyan-400 rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <Hexagon className="w-4 h-4 text-white/20" />
                )}
             </div>
             <p className="text-[10px] text-white/60 leading-relaxed italic uppercase font-mono">
                {isSpeaking ? "TRANSMITTING RESONANCE..." : isTyping ? "PROCESSING SYMBOLIC RESONANCE..." : "Objective: Build the world back better. Mindsoulstone integration complete."}
             </p>
          </div>
          {isTyping && (
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${streamingProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_#06b6d4]"
              />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
              />
            </div>
          )}
        </div>
      </section>

      <div className="flex-1 overflow-hidden">
        {activeWorkspace === 'CHAT' ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
              {sphynxState.active && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-cyan-400 animate-pulse" />
                    <div className="w-1 h-1 bg-cyan-400 animate-pulse [animation-delay:0.2s]" />
                  </div>
                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BoxSelect className="w-3 h-3" /> Sphynx_Hologram_Projection
                  </h4>
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <Hexagon className="w-10 h-10 text-cyan-400/50" />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                        <div className="bg-black/40 p-2 rounded border border-white/5">
                          <div className="text-[8px] text-white/40 uppercase">Nodes</div>
                          <div className="text-sm font-mono text-cyan-400">{sphynxState.data.nodes}</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5">
                          <div className="text-[8px] text-white/40 uppercase">Resonance</div>
                          <div className="text-sm font-mono text-cyan-400">{Math.round(sphynxState.data.resonance * 100)}%</div>
                        </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 bg-cyan-500/20 rounded-full overflow-hidden`}>
                        <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }} className="h-full bg-cyan-400" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] p-3 rounded-sm text-[10px] font-mono leading-relaxed tracking-tight relative group ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100' 
                        : msg.role === 'system'
                        ? 'bg-emerald-500/5 border border-emerald-500/20 text-emerald-400/80 italic'
                        : 'bg-white/5 border border-white/10 text-white/70 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] border-l-2 border-l-cyan-500/50'
                    }`}>
                      {msg.role === 'user' && msg.fileName && (
                        <div className="flex flex-col gap-1 mb-2 p-2 bg-white/5 rounded border border-white/10 text-[8px]">
                          <div className="flex items-center gap-2 text-cyan-400">
                            <HardDrive className="w-2.5 h-2.5" /> 
                            <span className="font-bold uppercase tracking-wider">{msg.fileName}</span>
                          </div>
                          <div className="flex justify-between items-center opacity-60 font-mono">
                            <span className="text-[7px] uppercase tracking-tighter">Protocol: {msg.fileType || 'RAW_DATA'}</span>
                            <span className="text-emerald-400/80">INGESTION_READY</span>
                          </div>
                        </div>
                      )}
                      {msg.content}
                      {msg.role === 'ai' && (
                        <>
                          <div className="absolute -top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                            <div className={`text-[6px] font-black px-1 py-0.5 rounded border leading-none tracking-widest uppercase ${
                              msg.modelUsed?.includes('flash') 
                                ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
                                : 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                            }`}>
                              {msg.modelUsed?.includes('flash') ? 'FLASH_CORE' : 'PRO_SYNAPSE'}
                            </div>
                          </div>
                          <button 
                            onClick={() => speak(msg.content)}
                            className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/20 hover:text-cyan-400"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 px-3 py-2 rounded flex gap-1">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full transform scale-[0.98]">
             <NotebookWorkspace />
          </div>
        )}
      </div>

      {/* Function Buttons Row */}
        <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto scrollbar-hide bg-black/10">
           <button 
             onClick={initSphynxInfestation}
             className={`px-2 py-1 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${sphynxState.active ? 'text-amber-400 border-amber-400/30' : 'text-white/40 hover:text-amber-400 hover:border-amber-400/30'}`}
           >
             <BoxSelect className={`w-2 h-2 ${sphynxState.active ? 'animate-pulse' : ''}`} /> {sphynxState.active ? 'SPHYNX_INFESTED' : 'INIT_SPHYNX_SYNAPSE'}
           </button>
           <button 
             onClick={toggleHologram}
             className={`px-2 py-1 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${isHologramActive ? 'text-purple-400 border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-white/40 hover:text-purple-400 hover:border-purple-400/30'}`}
           >
             <Layers className="w-2 h-2" /> HOLOGRAM_VIEW_{isHologramActive ? 'ON' : 'OFF'}
           </button>
           <button 
             onClick={() => handleSend("Analyze current telemetry")}
             className="px-2 py-1 rounded border border-white/10 text-[8px] font-mono text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 whitespace-nowrap transition-all flex items-center gap-1"
           >
             <Zap className="w-2 h-2" /> TELEMETRY_SCAN
           </button>
           <button 
             onClick={() => handleSend("Explain github_contribution_multiplier")}
             className="px-2 py-1 rounded border border-white/10 text-[8px] font-mono text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 whitespace-nowrap transition-all flex items-center gap-1"
           >
             <RefreshCw className="w-2 h-2" /> EXPLAIN_MULTI
           </button>
           <button 
             onClick={triggerDataStream}
             disabled={isStreaming}
             className={`px-2 py-1 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${isStreaming ? 'text-emerald-400 border-emerald-400/30' : 'text-white/40 hover:text-emerald-400 hover:border-emerald-400/30'}`}
           >
             <Database className={`w-2 h-2 ${isStreaming ? 'animate-spin' : ''}`} /> {isStreaming ? `STREAMING_${Math.round(streamingProgress)}%` : 'INIT_DATA_STREAM'}
           </button>
           <div className={`flex items-center gap-1 px-2 py-1 border border-white/5 rounded bg-black/20 text-[7px] font-mono transition-opacity ${isStreaming ? 'opacity-100' : 'opacity-20'}`}>
             <Activity className={`w-2 h-2 text-emerald-500 ${isStreaming ? 'animate-pulse' : ''}`} />
             <span className="text-white/50">FEED_SYNC:</span>
             <span className="text-emerald-400">{Math.round(streamingProgress)}%</span>
           </div>
           <button 
             onClick={() => setIsTTSEnabled(!isTTSEnabled)}
             className={`px-2 py-1 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${isTTSEnabled ? 'text-cyan-400 border-cyan-400/30' : 'text-white/40 hover:text-white/80'}`}
           >
             <Volume2 className="w-2 h-2" /> TTS_{isTTSEnabled ? 'ON' : 'OFF'}
           </button>
           <button 
             onClick={() => setDebugMode(!debugMode)}
             className={`px-2 py-1 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap transition-all flex items-center gap-1 ${debugMode ? 'text-amber-400 border-amber-400/30' : 'text-white/40 hover:text-amber-400/30'}`}
           >
             <Bug className="w-2 h-2" /> DEBUG_{debugMode ? 'ACTIVE' : 'OFF'}
           </button>
        </div>

        <AnimatePresence>
          {pendingFile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(6,182,212,0.2)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <HardDrive className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Confirm File Sync</h4>
                    <p className="text-[10px] text-cyan-400/60 font-mono">NEURAL_READY_FOR_INGESTION</p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Module Name</span>
                      <span className="text-[9px] font-mono text-white truncate max-w-[150px]" title={pendingFile.name}>{pendingFile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Size</span>
                      <span className="text-[9px] font-mono text-emerald-400">{formatFileSize(pendingFile.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[8px] font-mono text-white/40 uppercase">Type</span>
                      <span className="text-[9px] font-mono text-cyan-400">{pendingFile.type || 'binary/stream'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setPendingFile(null)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono text-white/60 uppercase tracking-widest transition-all"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={confirmFileUpload}
                    className="flex-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    Initiate Sync
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {debugMode && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 py-2 border-t border-white/5 bg-black/40 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-2 h-2 text-amber-500" />
                <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest">Synaptic_Debugger_Log</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-hide">
                {aiService.getDebugInfo().map((info, idx) => (
                  <div key={idx} className="text-[7px] font-mono border-b border-white/5 pb-1">
                    <div className="flex justify-between">
                      <span className="text-white/40 tracking-tighter">[{info.timestamp}]</span>
                      <span className="text-cyan-400">{info.model}</span>
                    </div>
                    <div className="flex justify-between italic">
                      <span className="text-emerald-400">LATENCY: {info.duration}ms</span>
                      <span className="text-purple-400">TOKENS: ~{Math.round(info.tokens)}</span>
                    </div>
                  </div>
                ))}
                {aiService.getDebugInfo().length === 0 && (
                  <div className="text-[7px] font-mono text-white/20 italic">Awaiting neural activity...</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-3 bg-black/40 border-t border-white/10 relative">
          <SignalMatrix isListening={isListening} transcript={input} />
          <AnimatePresence>
            {fileError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-3 mb-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded flex items-center gap-2 backdrop-blur-md"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span className="text-[9px] font-mono text-rose-400">{fileError}</span>
                <button onClick={() => setFileError(null)} className="ml-2 text-white/40 hover:text-white/80">×</button>
              </motion.div>
            )}
            {attachedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-3 mb-2 p-2 bg-white/5 border border-white/10 rounded flex items-center gap-2 backdrop-blur-md"
              >
                <HardDrive className="w-3 h-3 text-cyan-400" />
                <span className="text-[9px] font-mono text-white/60">{attachedFile.name} (Ready)</span>
                <button onClick={() => setAttachedFile(null)} className="ml-2 text-white/40 hover:text-white/80">×</button>
              </motion.div>
            )}
            {!input && localStorage.getItem('nexus_draft') && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute bottom-full left-3 mb-2"
              >
                <button 
                  onClick={recoverGhostBuffer}
                  className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-sm text-[8px] font-mono text-rose-400 uppercase tracking-widest hover:bg-rose-500/20 transition-all border-dashed"
                >
                  <RefreshCw className={`w-2 h-2 ${isRecovering ? 'animate-spin' : ''}`} /> Recover_Ghost_Buffer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2 items-end">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className={`p-2 h-[34px] border border-white/10 rounded transition-colors ${attachedFile ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}
               title="Attach Virtual Module"
             >
               <HardDrive className="w-4 h-4" />
             </button>
             {/* Using absolute positioning and zero opacity instead of hidden to solve selection issues */}
             <input 
               type="file" 
               ref={fileInputRef} 
               className="absolute w-0 h-0 opacity-0 pointer-events-none" 
               onChange={handleFileUpload}
               tabIndex={-1}
             />
             <textarea
               ref={textareaRef}
               rows={1}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSend();
                 }
               }}
               placeholder={isListening ? "Listening to Architect..." : "Converse with Nexus..."}
               className={`flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors uppercase resize-none max-h-32 scrollbar-hide ${isListening ? 'border-amber-500 animate-pulse' : ''}`}
             />
             <button 
               onClick={toggleListening}
               className={`p-2 h-[34px] border rounded transition-all ${isListening ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/10 text-white/40 hover:text-amber-500 hover:border-amber-500/30'}`}
               title="Voice Input (SpeechRecognition)"
             >
               {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
             </button>
             <button 
               onClick={() => handleSend()}
               className="p-2 h-[34px] border border-cyan-600/40 rounded bg-cyan-600/10 hover:bg-cyan-600/20 transition-colors cursor-pointer"
             >
               <MessageSquare className="w-4 h-4 text-cyan-400" />
             </button>
          </div>
        </div>
      </div>
    );
  }


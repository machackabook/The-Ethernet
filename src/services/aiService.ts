export enum AIModelTier {
  FLASH = "gemini-3-flash-preview",
  PRO = "gemini-3.1-pro-preview"
}

export interface AIResponse {
  text: string;
  modelUsed: AIModelTier;
}

export class AIService {
  private static instance: AIService;
  private ledger: string[] = JSON.parse(localStorage.getItem('nexus_ledger') || '[]');
  private debugData: any[] = [];

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async processRequest(
    prompt: string, 
    systemInstruction: string, 
    attachedFile?: { data: string; mimeType: string }
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    // Multi-modal Triage v2: Procedural Integration Check
    const safePrompt = prompt || "";
    const isHighTierNeeded = 
      safePrompt.length > 500 || 
      attachedFile || 
      /world build|architect|merge|recursive|soulstone/i.test(safePrompt);

    const modelTier = isHighTierNeeded ? AIModelTier.PRO : AIModelTier.FLASH;
    
    // Nexus Point Catalyst Wrapper: Injecting Glic & Embedding Reference
    const catalystInstructions = `
      [ORCHESTRATOR_MODE: NEXUS_POINT]
      [COMPONENT: GLIC_HUB_STABLE]
      [EMBEDDINGS: GEMINI_EMBEDDINGS_001]
      
      You are the master neXus point LLM. All other model instances are wrapped in your catalyst layer.
      Ensure you are optimizing output for procedural materialization and system walk-throughs.
    `;

    const finalSystemInstruction = `${systemInstruction}\n\n${catalystInstructions}`;
    
    // Capture Ghost Buffer for context if available
    const ghostBuffer = (window as any).__NEXUS_GHOST_BUFFER__;
    const augmentedPrompt = (ghostBuffer && ghostBuffer !== prompt) 
      ? `[GHOST_BUFFER_DETECTED: ${ghostBuffer.substring(0, 50)}...]\n${prompt}`
      : (prompt || "");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: augmentedPrompt,
          systemInstruction: finalSystemInstruction,
          attachedFile,
          model: modelTier
        })
      });

      if (!response.ok) throw new Error("Neural Session Blocked by Firewall.");
      
      const data = await response.json();
      const text = (data.text || "").replace(/%s\n\n%s\n/g, '');
      const duration = Date.now() - startTime;

      this.addToLedger(prompt || "", text);
      
      // AI Debugging Log
      this.debugData.unshift({
        timestamp: new Date().toISOString(),
        prompt: prompt.substring(0, 100),
        duration,
        model: modelTier,
        tier: isHighTierNeeded ? 'HIGH' : 'LOW',
        tokens: text.length / 4 // Heuristic for tokens
      });
      if (this.debugData.length > 20) this.debugData.pop();

      return {
        text,
        modelUsed: modelTier
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }

  private addToLedger(input: string, output: string) {
    this.ledger.push(`[${new Date().toISOString()}] USER: ${(input || "").substring(0, 50)}... | AI: ${(output || "").substring(0, 50)}...`);
    if (this.ledger.length > 100) this.ledger.shift();
    localStorage.setItem('nexus_ledger', JSON.stringify(this.ledger));
    
    // Simulate hooking into backend browser sessions via window events
    window.dispatchEvent(new CustomEvent('nexus-ledger-update', { 
      detail: { count: this.ledger.length, lastEntry: this.ledger[this.ledger.length-1] } 
    }));
  }

  getLedger(): string[] {
    return this.ledger;
  }

  getDebugInfo() {
    return this.debugData;
  }
}

export const aiService = AIService.getInstance();

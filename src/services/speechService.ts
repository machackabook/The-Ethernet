import { useEffect, useCallback, useState } from 'react';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private currentUtterances: SpeechSynthesisUtterance[] = [];
  private isSpeakingChunks = false;
  private currentChunkIndex = 0;
  private chunks: string[] = [];
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      // Initialize voices
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer a clear, professional English voice
    this.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang === 'en-US') || voices[0];
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;
    
    // Cancel any ongoing speech and clean states safely
    this.stop();

    this.onEndCallback = onEnd || null;

    // Split text into safe, sentence-level chunks using punctuation to avoid Chrome GC/cutoff bugs
    const rawChunks = text.split(/([.!?]+)/);
    this.chunks = [];
    
    for (let i = 0; i < rawChunks.length; i += 2) {
      const textPart = rawChunks[i]?.trim();
      const punctPart = rawChunks[i + 1]?.trim() || '';
      if (textPart) {
        this.chunks.push(textPart + punctPart);
      }
    }

    if (this.chunks.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    this.isSpeakingChunks = true;
    this.currentChunkIndex = 0;
    this.speakNextChunk();
  }

  private speakNextChunk() {
    if (!this.synth || !this.isSpeakingChunks) return;

    if (this.currentChunkIndex >= this.chunks.length) {
      this.isSpeakingChunks = false;
      const callback = this.onEndCallback;
      this.onEndCallback = null;
      if (callback) {
        callback();
      }
      return;
    }

    const chunkText = this.chunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.pitch = 1.0;
    utterance.rate = 1.05; // Sleek modern pace
    utterance.volume = 1.0;

    // Storing reference in class instance to prevent garbage collection in Chrome/Safari
    this.currentUtterances.push(utterance);

    utterance.onend = () => {
      this.currentUtterances = this.currentUtterances.filter(u => u !== utterance);
      this.currentChunkIndex++;
      this.speakNextChunk();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error, continuing next chunk:', e);
      this.currentUtterances = this.currentUtterances.filter(u => u !== utterance);
      this.currentChunkIndex++;
      this.speakNextChunk();
    };

    this.synth.speak(utterance);
  }

  stop() {
    this.isSpeakingChunks = false;
    this.currentUtterances = [];
    this.chunks = [];
    this.currentChunkIndex = 0;
    this.onEndCallback = null; // Clear to prevent recursive/stale trigger
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    setIsSpeaking(true);
    speechService.speak(text, () => setIsSpeaking(false));
  }, []);

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}

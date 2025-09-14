// Real Speech Recognition Implementation
import { TranscriptionSegment, VoiceProfile, AudioCharacteristics } from '../types/meeting';

export class RealAudioTranscriptionService {
  private recognition: any;
  private isListening: boolean = false;
  private currentSessionId: string | null = null;
  private voiceProfiles: Map<string, VoiceProfile> = new Map();
  private onTranscriptionCallback?: (segments: TranscriptionSegment[]) => void;

  constructor() {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognitionConfig();
    this.setupRecognitionEvents();
  }

  private setupRecognitionConfig(): void {
    if (!this.recognition) return;

    // Configure speech recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
  }

  private setupRecognitionEvents(): void {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      switch (event.error) {
        case 'no-speech':
          console.log('No speech detected, continuing...');
          break;
        case 'audio-capture':
          console.error('Microphone not accessible');
          break;
        case 'not-allowed':
          console.error('Microphone permission denied');
          break;
        default:
          console.error('Unknown speech recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      this.isListening = false;
      
      // Restart if we're still supposed to be listening
      if (this.currentSessionId) {
        setTimeout(() => {
          this.startListening(this.currentSessionId!);
        }, 100);
      }
    };
  }

  async transcribeAudio(audioBuffer: ArrayBuffer, sessionId: string): Promise<TranscriptionSegment[]> {
    // For real-time speech recognition, we don't process audio buffers directly
    // Instead, we use the browser's built-in speech recognition
    // This method is kept for compatibility with the existing interface
    
    if (!this.isListening && sessionId) {
      this.startListening(sessionId);
    }
    
    return []; // Real transcription happens in the event handlers
  }

  startListening(sessionId: string): void {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return;
    }

    this.currentSessionId = sessionId;
    
    try {
      if (!this.isListening) {
        this.recognition.start();
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.currentSessionId = null;
      this.recognition.stop();
    }
  }

  private handleSpeechResult(event: any): void {
    if (!this.currentSessionId) return;

    const results = event.results;
    const lastResult = results[results.length - 1];
    
    if (lastResult.isFinal) {
      const transcript = lastResult[0].transcript.trim();
      const confidence = lastResult[0].confidence || 0.9;
      
      if (transcript.length > 0) {
        const segment: TranscriptionSegment = {
          id: this.generateSegmentId(),
          speakerId: 'current_user', // In a real system, this would be identified
          text: transcript,
          timestamp: new Date(),
          confidence: confidence,
          language: 'en-US',
          sentiment: this.analyzeSentiment(transcript),
          keywords: this.extractKeywords(transcript)
        };

        console.log('🗣️ Transcribed:', transcript);
        
        // Call the callback if set
        if (this.onTranscriptionCallback) {
          this.onTranscriptionCallback([segment]);
        }
      }
    }
  }

  setTranscriptionCallback(callback: (segments: TranscriptionSegment[]) => void): void {
    this.onTranscriptionCallback = callback;
  }

  private analyzeSentiment(text: string) {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'perfect', 'love', 'like', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'problem', 'issue', 'concern'];
    
    const words = text.toLowerCase().split(' ');
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) {
      return { positive: 0.5, negative: 0.2, neutral: 0.3, overall: 'neutral' as const };
    }
    
    const positive = positiveCount / total;
    const negative = negativeCount / total;
    const neutral = 1 - positive - negative;
    
    const overall = positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral';
    
    return { positive, negative, neutral, overall };
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5); // Return top 5 keywords
  }

  private generateSegmentId(): string {
    return `seg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  updateVoiceProfile(speakerId: string, name: string, email: string): void {
    // In a real system, this would update voice recognition profiles
    console.log(`Voice profile updated for ${name} (${email})`);
  }

  // Check if speech recognition is supported
  static isSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }

  // Get supported languages
  static getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 
      'pt-BR', 'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN'
    ];
  }
}
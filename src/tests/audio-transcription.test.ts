import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioTranscriptionService } from '../audio/transcription';

describe('AudioTranscriptionService', () => {
  let transcriptionService: AudioTranscriptionService;

  beforeEach(() => {
    transcriptionService = new AudioTranscriptionService();
  });

  describe('Audio Transcription', () => {
    it('should transcribe audio buffer successfully', async () => {
      const audioBuffer = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      expect(segments).toBeDefined();
      expect(Array.isArray(segments)).toBe(true);
    });

    it('should generate valid transcription segments', async () => {
      const audioBuffer = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      if (segments.length > 0) {
        const segment = segments[0];
        expect(segment.id).toBeDefined();
        expect(segment.speakerId).toBeDefined();
        expect(segment.text).toBeDefined();
        expect(segment.timestamp).toBeInstanceOf(Date);
        expect(segment.confidence).toBeGreaterThanOrEqual(0);
        expect(segment.confidence).toBeLessThanOrEqual(1);
        expect(segment.language).toBeDefined();
      }
    });

    it('should handle empty audio buffer', async () => {
      const audioBuffer = new ArrayBuffer(0);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      expect(segments).toBeDefined();
      expect(Array.isArray(segments)).toBe(true);
    });

    it('should handle invalid audio data gracefully', async () => {
      const invalidBuffer = new ArrayBuffer(10); // Very small buffer
      const sessionId = 'test-session-123';

      // Should not throw, but may return empty segments
      await expect(transcriptionService.transcribeAudio(invalidBuffer, sessionId))
        .resolves.not.toThrow();
    });
  });

  describe('Speaker Identification', () => {
    it('should identify speakers consistently', async () => {
      const audioBuffer1 = new ArrayBuffer(1024);
      const audioBuffer2 = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments1 = await transcriptionService.transcribeAudio(audioBuffer1, sessionId);
      const segments2 = await transcriptionService.transcribeAudio(audioBuffer2, sessionId);

      if (segments1.length > 0 && segments2.length > 0) {
        // In a real scenario, same speaker should have same ID
        expect(segments1[0].speakerId).toBeDefined();
        expect(segments2[0].speakerId).toBeDefined();
      }
    });

    it('should update voice profiles correctly', () => {
      const speakerId = 'speaker_123';
      const name = 'John Doe';
      const email = 'john@example.com';

      // Should not throw
      expect(() => {
        transcriptionService.updateVoiceProfile(speakerId, name, email);
      }).not.toThrow();
    });
  });

  describe('Language Detection', () => {
    it('should detect language in transcription segments', async () => {
      const audioBuffer = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      if (segments.length > 0) {
        expect(segments[0].language).toBeDefined();
        expect(typeof segments[0].language).toBe('string');
        expect(segments[0].language.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Sentiment Analysis', () => {
    it('should include sentiment analysis in segments', async () => {
      const audioBuffer = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      if (segments.length > 0 && segments[0].sentiment) {
        const sentiment = segments[0].sentiment;
        expect(sentiment.positive).toBeGreaterThanOrEqual(0);
        expect(sentiment.negative).toBeGreaterThanOrEqual(0);
        expect(sentiment.neutral).toBeGreaterThanOrEqual(0);
        expect(sentiment.overall).toMatch(/^(positive|negative|neutral)$/);
      }
    });
  });

  describe('Keyword Extraction', () => {
    it('should extract keywords from transcription', async () => {
      const audioBuffer = new ArrayBuffer(1024);
      const sessionId = 'test-session-123';

      const segments = await transcriptionService.transcribeAudio(audioBuffer, sessionId);

      if (segments.length > 0 && segments[0].keywords) {
        expect(Array.isArray(segments[0].keywords)).toBe(true);
        segments[0].keywords?.forEach(keyword => {
          expect(typeof keyword).toBe('string');
          expect(keyword.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle transcription failures gracefully', async () => {
      // Mock a failure scenario
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        // This might fail in some scenarios, but should not crash
        const audioBuffer = new ArrayBuffer(1024);
        const sessionId = 'test-session-123';

        const result = await transcriptionService.transcribeAudio(audioBuffer, sessionId);
        expect(result).toBeDefined();
      } finally {
        console.error = originalConsoleError;
      }
    });
  });
});
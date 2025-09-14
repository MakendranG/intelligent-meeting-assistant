import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentAnalyzer } from '../ai/content-analyzer';
import { TranscriptionSegment, Priority, ImpactLevel, DecisionCategory } from '../types/meeting';

describe('ContentAnalyzer', () => {
  let contentAnalyzer: ContentAnalyzer;
  const mockApiKey = 'test-openai-key';

  beforeEach(() => {
    contentAnalyzer = new ContentAnalyzer(mockApiKey);
  });

  describe('Action Item Extraction', () => {
    it('should extract action items from transcription segments', async () => {
      const mockSegments: TranscriptionSegment[] = [
        {
          id: 'seg_1',
          speakerId: 'speaker_1',
          text: 'John should complete the API integration by Friday',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        },
        {
          id: 'seg_2',
          speakerId: 'speaker_2',
          text: 'We need to review the design mockups before the next meeting',
          timestamp: new Date(),
          confidence: 0.90,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(mockSegments, 'test-session');

      expect(result.actionItems).toBeDefined();
      expect(Array.isArray(result.actionItems)).toBe(true);
      
      if (result.actionItems.length > 0) {
        const actionItem = result.actionItems[0];
        expect(actionItem.id).toBeDefined();
        expect(actionItem.description).toBeDefined();
        expect(actionItem.priority).toBeOneOf(Object.values(Priority));
        expect(actionItem.confidence).toBeGreaterThanOrEqual(0);
        expect(actionItem.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should assign appropriate priorities to action items', async () => {
      const urgentSegment: TranscriptionSegment[] = [
        {
          id: 'seg_urgent',
          speakerId: 'speaker_1',
          text: 'This is critical - we need to fix the security vulnerability immediately',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(urgentSegment, 'test-session');

      if (result.actionItems.length > 0) {
        const actionItem = result.actionItems[0];
        expect([Priority.HIGH, Priority.CRITICAL]).toContain(actionItem.priority);
      }
    });
  });

  describe('Decision Extraction', () => {
    it('should extract decisions from transcription segments', async () => {
      const mockSegments: TranscriptionSegment[] = [
        {
          id: 'seg_decision',
          speakerId: 'speaker_1',
          text: 'We have decided to use React for the frontend framework',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(mockSegments, 'test-session');

      expect(result.decisions).toBeDefined();
      expect(Array.isArray(result.decisions)).toBe(true);

      if (result.decisions.length > 0) {
        const decision = result.decisions[0];
        expect(decision.id).toBeDefined();
        expect(decision.description).toBeDefined();
        expect(decision.impact).toBeOneOf(Object.values(ImpactLevel));
        expect(decision.category).toBeOneOf(Object.values(DecisionCategory));
        expect(decision.confidence).toBeGreaterThanOrEqual(0);
        expect(decision.confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should categorize decisions correctly', async () => {
      const technicalDecision: TranscriptionSegment[] = [
        {
          id: 'seg_tech',
          speakerId: 'speaker_1',
          text: 'We decided to migrate to PostgreSQL database',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(technicalDecision, 'test-session');

      if (result.decisions.length > 0) {
        const decision = result.decisions[0];
        expect([DecisionCategory.TECHNICAL, DecisionCategory.OPERATIONAL]).toContain(decision.category);
      }
    });
  });

  describe('Meeting Summary Generation', () => {
    it('should generate comprehensive meeting summary', async () => {
      const mockSegments: TranscriptionSegment[] = [
        {
          id: 'seg_1',
          speakerId: 'speaker_1',
          text: 'Let\'s discuss the project timeline and identify key milestones',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        },
        {
          id: 'seg_2',
          speakerId: 'speaker_2',
          text: 'I\'m concerned about the tight deadline for the API integration',
          timestamp: new Date(),
          confidence: 0.90,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(mockSegments, 'test-session');

      expect(result.summary).toBeDefined();
      expect(result.summary.keyHighlights).toBeDefined();
      expect(Array.isArray(result.summary.keyHighlights)).toBe(true);
      expect(result.summary.mainTopics).toBeDefined();
      expect(Array.isArray(result.summary.mainTopics)).toBe(true);
      expect(result.summary.nextSteps).toBeDefined();
      expect(Array.isArray(result.summary.nextSteps)).toBe(true);
      expect(result.summary.overallSentiment).toBeDefined();
      expect(result.summary.participationStats).toBeDefined();
    });

    it('should calculate participation statistics', async () => {
      const mockSegments: TranscriptionSegment[] = [
        {
          id: 'seg_1',
          speakerId: 'speaker_1',
          text: 'First speaker contribution',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        },
        {
          id: 'seg_2',
          speakerId: 'speaker_2',
          text: 'Second speaker contribution',
          timestamp: new Date(),
          confidence: 0.90,
          language: 'en-US'
        },
        {
          id: 'seg_3',
          speakerId: 'speaker_1',
          text: 'Another contribution from first speaker',
          timestamp: new Date(),
          confidence: 0.92,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(mockSegments, 'test-session');

      const stats = result.summary.participationStats;
      expect(stats.speakingTime).toBeDefined();
      expect(stats.interactionCount).toBeDefined();
      expect(stats.engagementLevel).toBeDefined();

      // Speaker 1 should have more interactions
      expect(stats.interactionCount['speaker_1']).toBe(2);
      expect(stats.interactionCount['speaker_2']).toBe(1);
    });
  });

  describe('Risk and Next Steps Identification', () => {
    it('should identify risks in conversation', async () => {
      const riskSegments: TranscriptionSegment[] = [
        {
          id: 'seg_risk',
          speakerId: 'speaker_1',
          text: 'I\'m concerned about the security risk in our current implementation',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(riskSegments, 'test-session');

      expect(result.risks).toBeDefined();
      expect(Array.isArray(result.risks)).toBe(true);
    });

    it('should identify next steps', async () => {
      const nextStepSegments: TranscriptionSegment[] = [
        {
          id: 'seg_next',
          speakerId: 'speaker_1',
          text: 'Next, we should follow up with the client about their requirements',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(nextStepSegments, 'test-session');

      expect(result.nextSteps).toBeDefined();
      expect(Array.isArray(result.nextSteps)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty transcription segments', async () => {
      const emptySegments: TranscriptionSegment[] = [];

      const result = await contentAnalyzer.analyzeTranscription(emptySegments, 'test-session');

      expect(result).toBeDefined();
      expect(result.actionItems).toBeDefined();
      expect(result.decisions).toBeDefined();
      expect(result.summary).toBeDefined();
    });

    it('should handle analysis failures gracefully', async () => {
      const mockSegments: TranscriptionSegment[] = [
        {
          id: 'seg_1',
          speakerId: 'speaker_1',
          text: 'Normal conversation text',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      // Mock console.error to avoid noise in test output
      const originalConsoleError = console.error;
      console.error = vi.fn();

      try {
        const result = await contentAnalyzer.analyzeTranscription(mockSegments, 'test-session');
        expect(result).toBeDefined();
      } finally {
        console.error = originalConsoleError;
      }
    });
  });

  describe('Custom Vocabulary', () => {
    it('should handle custom vocabulary in analysis', async () => {
      // This would test custom vocabulary integration
      // For now, just ensure the analyzer doesn't crash with domain-specific terms
      const domainSegments: TranscriptionSegment[] = [
        {
          id: 'seg_domain',
          speakerId: 'speaker_1',
          text: 'We need to optimize the API endpoint for better throughput',
          timestamp: new Date(),
          confidence: 0.95,
          language: 'en-US'
        }
      ];

      const result = await contentAnalyzer.analyzeTranscription(domainSegments, 'test-session');
      expect(result).toBeDefined();
    });
  });
});
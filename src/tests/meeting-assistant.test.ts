import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntelligentMeetingAssistant } from '../index';
import { MeetingPlatform, MeetingStatus, PrivacyLevel } from '../types/meeting';

describe('IntelligentMeetingAssistant', () => {
  let assistant: IntelligentMeetingAssistant;
  const mockOpenAIKey = 'test-openai-key';

  beforeEach(() => {
    assistant = new IntelligentMeetingAssistant(mockOpenAIKey);
  });

  describe('Meeting Lifecycle', () => {
    it('should start a new meeting successfully', async () => {
      const meetingConfig = {
        title: 'Test Meeting',
        participants: [
          {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          }
        ],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId = await assistant.startMeeting(meetingConfig);

      expect(sessionId).toBeDefined();
      expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should process audio stream correctly', async () => {
      // Start a meeting first
      const meetingConfig = {
        title: 'Test Meeting',
        participants: [],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId = await assistant.startMeeting(meetingConfig);
      
      // Create mock audio buffer
      const audioBuffer = new ArrayBuffer(1024);
      
      // Process audio should not throw
      await expect(assistant.processAudioStream(sessionId, audioBuffer)).resolves.not.toThrow();
    });

    it('should end meeting and generate summary', async () => {
      // Start a meeting
      const meetingConfig = {
        title: 'Test Meeting',
        participants: [],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId = await assistant.startMeeting(meetingConfig);
      
      // End the meeting
      const completedSession = await assistant.endMeeting(sessionId);

      expect(completedSession.status).toBe(MeetingStatus.COMPLETED);
      expect(completedSession.endTime).toBeDefined();
      expect(completedSession.summary).toBeDefined();
    });

    it('should throw error for invalid session', async () => {
      const invalidSessionId = 'invalid-session-id';
      const audioBuffer = new ArrayBuffer(1024);

      await expect(assistant.processAudioStream(invalidSessionId, audioBuffer))
        .rejects.toThrow('Invalid or inactive session');
    });

    it('should throw error when ending non-existent session', async () => {
      const invalidSessionId = 'invalid-session-id';

      await expect(assistant.endMeeting(invalidSessionId))
        .rejects.toThrow('Session not found');
    });
  });

  describe('Session Management', () => {
    it('should generate unique session IDs', async () => {
      const meetingConfig = {
        title: 'Test Meeting',
        participants: [],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId1 = await assistant.startMeeting(meetingConfig);
      const sessionId2 = await assistant.startMeeting(meetingConfig);

      expect(sessionId1).not.toBe(sessionId2);
    });

    it('should handle multiple concurrent sessions', async () => {
      const meetingConfig = {
        title: 'Test Meeting',
        participants: [],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId1 = await assistant.startMeeting(meetingConfig);
      const sessionId2 = await assistant.startMeeting(meetingConfig);

      // Both sessions should be active
      const audioBuffer = new ArrayBuffer(1024);
      
      await expect(assistant.processAudioStream(sessionId1, audioBuffer)).resolves.not.toThrow();
      await expect(assistant.processAudioStream(sessionId2, audioBuffer)).resolves.not.toThrow();
    });
  });

  describe('Configuration Validation', () => {
    it('should handle missing optional configuration', async () => {
      const minimalConfig = {
        title: 'Minimal Meeting',
        participants: [],
        platform: MeetingPlatform.ZOOM,
        privacyLevel: PrivacyLevel.INTERNAL,
        recordingEnabled: false,
        aiProcessingEnabled: false
      };

      const sessionId = await assistant.startMeeting(minimalConfig);
      expect(sessionId).toBeDefined();
    });

    it('should preserve meeting configuration in session', async () => {
      const meetingConfig = {
        title: 'Configured Meeting',
        participants: [
          {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          }
        ],
        platform: MeetingPlatform.TEAMS,
        template: 'standup',
        customVocabulary: ['sprint', 'backlog', 'velocity'],
        privacyLevel: PrivacyLevel.CONFIDENTIAL,
        recordingEnabled: true,
        aiProcessingEnabled: true
      };

      const sessionId = await assistant.startMeeting(meetingConfig);
      const session = await assistant.endMeeting(sessionId);

      expect(session.title).toBe(meetingConfig.title);
      expect(session.platform).toBe(meetingConfig.platform);
      expect(session.participants).toEqual(meetingConfig.participants);
      expect(session.metadata.template).toBe(meetingConfig.template);
      expect(session.metadata.customVocabulary).toEqual(meetingConfig.customVocabulary);
      expect(session.metadata.privacyLevel).toBe(meetingConfig.privacyLevel);
    });
  });
});
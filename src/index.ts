import { MeetingSession, MeetingPlatform, MeetingStatus, Participant } from './types/meeting';
import { AudioTranscriptionService } from './audio/transcription';
import { ContentAnalyzer } from './ai/content-analyzer';
import { TaskManagerIntegration } from './integrations/task-manager';

export class IntelligentMeetingAssistant {
  private transcriptionService: AudioTranscriptionService;
  private contentAnalyzer: ContentAnalyzer;
  private taskManager: TaskManagerIntegration;
  private activeSessions: Map<string, MeetingSession> = new Map();

  constructor(openaiApiKey: string) {
    this.transcriptionService = new AudioTranscriptionService();
    this.contentAnalyzer = new ContentAnalyzer(openaiApiKey);
    this.taskManager = new TaskManagerIntegration();
  }

  async startMeeting(meetingConfig: MeetingConfig): Promise<string> {
    const session: MeetingSession = {
      id: this.generateSessionId(),
      title: meetingConfig.title,
      startTime: new Date(),
      participants: meetingConfig.participants,
      platform: meetingConfig.platform,
      status: MeetingStatus.IN_PROGRESS,
      transcription: [],
      actionItems: [],
      decisions: [],
      metadata: {
        template: meetingConfig.template,
        customVocabulary: meetingConfig.customVocabulary || [],
        privacyLevel: meetingConfig.privacyLevel,
        recordingEnabled: meetingConfig.recordingEnabled,
        aiProcessingEnabled: meetingConfig.aiProcessingEnabled
      }
    };

    this.activeSessions.set(session.id, session);
    console.log(`Meeting session ${session.id} started: ${session.title}`);
    return session.id;
  }

  async processAudioStream(sessionId: string, audioBuffer: ArrayBuffer): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session || session.status !== MeetingStatus.IN_PROGRESS) {
      throw new Error('Invalid or inactive session');
    }

    try {
      const newSegments = await this.transcriptionService.transcribeAudio(audioBuffer, sessionId);
      session.transcription.push(...newSegments);

      if (newSegments.length > 0) {
        const analysis = await this.contentAnalyzer.analyzeTranscription(newSegments, sessionId);
        session.actionItems.push(...analysis.actionItems);
        session.decisions.push(...analysis.decisions);
      }
    } catch (error) {
      console.error('Audio processing failed:', error);
    }
  }

  async endMeeting(sessionId: string): Promise<MeetingSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.endTime = new Date();
    session.status = MeetingStatus.COMPLETED;

    const finalAnalysis = await this.contentAnalyzer.analyzeTranscription(session.transcription, sessionId);
    session.actionItems = finalAnalysis.actionItems;
    session.decisions = finalAnalysis.decisions;
    session.summary = finalAnalysis.summary;

    await this.taskManager.createTasks(session.actionItems, sessionId);

    this.activeSessions.delete(sessionId);
    return session;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

export interface MeetingConfig {
  title: string;
  participants: Participant[];
  platform: MeetingPlatform;
  template?: any;
  customVocabulary?: string[];
  privacyLevel: any;
  recordingEnabled: boolean;
  aiProcessingEnabled: boolean;
}

export * from './types/meeting';
export * from './audio/transcription';
export * from './ai/content-analyzer';
export * from './integrations/task-manager';
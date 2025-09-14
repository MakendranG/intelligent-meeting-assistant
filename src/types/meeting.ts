// Core Meeting Assistant Types
export interface MeetingSession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  participants: Participant[];
  platform: MeetingPlatform;
  status: MeetingStatus;
  transcription: TranscriptionSegment[];
  actionItems: ActionItem[];
  decisions: Decision[];
  summary?: MeetingSummary;
  metadata: MeetingMetadata;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  voiceProfile?: VoiceProfile;
  engagementScore?: number;
}

export interface TranscriptionSegment {
  id: string;
  speakerId: string;
  text: string;
  timestamp: Date;
  confidence: number;
  language: string;
  sentiment?: SentimentScore;
  keywords?: string[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  priority: Priority;
  dueDate?: Date;
  status: TaskStatus;
  confidence: number;
  extractedFrom: string; // segment ID
  relatedDecisions?: string[];
  integrations: TaskIntegration[];
}

export interface Decision {
  id: string;
  description: string;
  participants: string[];
  confidence: number;
  timestamp: Date;
  impact: ImpactLevel;
  category: DecisionCategory;
  extractedFrom: string;
}export 
interface MeetingSummary {
  keyHighlights: string[];
  mainTopics: string[];
  nextSteps: string[];
  risks: string[];
  overallSentiment: SentimentScore;
  participationStats: ParticipationStats;
}

export interface VoiceProfile {
  speakerId: string;
  characteristics: AudioCharacteristics;
  confidence: number;
  lastUpdated: Date;
}

export interface AudioCharacteristics {
  pitch: number;
  tone: number;
  pace: number;
  accent?: string;
  language: string;
}

export interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
}

export interface TaskIntegration {
  platform: TaskPlatform;
  taskId?: string;
  status: IntegrationStatus;
  lastSync: Date;
}

export interface ParticipationStats {
  speakingTime: Record<string, number>;
  interactionCount: Record<string, number>;
  engagementLevel: Record<string, number>;
}

export interface MeetingMetadata {
  template?: MeetingTemplate;
  customVocabulary?: string[];
  privacyLevel: PrivacyLevel;
  recordingEnabled: boolean;
  aiProcessingEnabled: boolean;
}

// Enums
export enum MeetingPlatform {
  ZOOM = 'zoom',
  TEAMS = 'teams',
  GOOGLE_MEET = 'google_meet',
  SLACK_HUDDLES = 'slack_huddles',
  WEBEX = 'webex'
}

export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum DecisionCategory {
  STRATEGIC = 'strategic',
  OPERATIONAL = 'operational',
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  PERSONNEL = 'personnel'
}

export enum TaskPlatform {
  ASANA = 'asana',
  TRELLO = 'trello',
  JIRA = 'jira',
  MONDAY = 'monday',
  NOTION = 'notion',
  TODOIST = 'todoist'
}

export enum IntegrationStatus {
  CONNECTED = 'connected',
  PENDING = 'pending',
  FAILED = 'failed',
  DISABLED = 'disabled'
}

export enum MeetingTemplate {
  STANDUP = 'standup',
  PLANNING = 'planning',
  RETROSPECTIVE = 'retrospective',
  ONE_ON_ONE = 'one_on_one',
  ALL_HANDS = 'all_hands',
  CLIENT_MEETING = 'client_meeting',
  BRAINSTORMING = 'brainstorming'
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}
import { TranscriptionSegment, ActionItem, Decision, MeetingSummary, Priority, ImpactLevel, DecisionCategory } from '../types/meeting';

export class ContentAnalyzer {
  private openaiApiKey: string;
  private customVocabulary: Map<string, string[]> = new Map();

  constructor(apiKey: string) {
    this.openaiApiKey = apiKey;
    this.initializeCustomVocabulary();
  }

  async analyzeTranscription(segments: TranscriptionSegment[], sessionId: string): Promise<AnalysisResult> {
    const fullText = segments.map(s => `${s.speakerId}: ${s.text}`).join('\n');
    
    const [actionItems, decisions, summary] = await Promise.all([
      this.extractActionItems(segments),
      this.extractDecisions(segments),
      this.generateSummary(segments)
    ]);

    return {
      actionItems,
      decisions,
      summary,
      risks: await this.identifyRisks(segments),
      nextSteps: await this.identifyNextSteps(segments)
    };
  }

  private async extractActionItems(segments: TranscriptionSegment[]): Promise<ActionItem[]> {
    const actionItems: ActionItem[] = [];
    
    for (const segment of segments) {
      const items = await this.identifyActionItemsInText(segment.text, segment.id);
      actionItems.push(...items);
    }

    return this.deduplicateAndPrioritize(actionItems);
  }

  private async identifyActionItemsInText(text: string, segmentId: string): Promise<ActionItem[]> {
    // AI-powered action item extraction
    const prompt = `
    Analyze the following meeting text and extract action items. For each action item, provide:
    - Description
    - Suggested assignee (if mentioned)
    - Priority level (low, medium, high, critical)
    - Confidence score (0-1)
    
    Text: "${text}"
    
    Return as JSON array.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      const items = JSON.parse(response);
      
      return items.map((item: any) => ({
        id: this.generateId('action'),
        description: item.description,
        assignee: item.assignee || 'unassigned',
        priority: this.mapPriority(item.priority),
        status: 'pending' as const,
        confidence: item.confidence || 0.8,
        extractedFrom: segmentId,
        integrations: []
      }));
    } catch (error) {
      console.error('Action item extraction failed:', error);
      return [];
    }
  }

  private async extractDecisions(segments: TranscriptionSegment[]): Promise<Decision[]> {
    const decisions: Decision[] = [];
    
    for (const segment of segments) {
      const segmentDecisions = await this.identifyDecisionsInText(segment.text, segment.id, segment.timestamp);
      decisions.push(...segmentDecisions);
    }

    return decisions;
  }

  private async identifyDecisionsInText(text: string, segmentId: string, timestamp: Date): Promise<Decision[]> {
    const prompt = `
    Analyze the following meeting text and identify decisions made. For each decision:
    - Description of the decision
    - Impact level (low, medium, high, critical)
    - Category (strategic, operational, technical, financial, personnel)
    - Confidence score (0-1)
    
    Text: "${text}"
    
    Return as JSON array.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      const items = JSON.parse(response);
      
      return items.map((item: any) => ({
        id: this.generateId('decision'),
        description: item.description,
        participants: [], // Would be populated from speaker analysis
        confidence: item.confidence || 0.8,
        timestamp,
        impact: this.mapImpactLevel(item.impact),
        category: this.mapDecisionCategory(item.category),
        extractedFrom: segmentId
      }));
    } catch (error) {
      console.error('Decision extraction failed:', error);
      return [];
    }
  }

  private async generateSummary(segments: TranscriptionSegment[]): Promise<MeetingSummary> {
    const fullText = segments.map(s => s.text).join(' ');
    
    const prompt = `
    Create a comprehensive meeting summary from the following transcript:
    
    "${fullText}"
    
    Provide:
    - Key highlights (3-5 main points)
    - Main topics discussed
    - Next steps identified
    - Potential risks or concerns
    - Overall sentiment analysis
    
    Return as JSON.
    `;

    try {
      const response = await this.callOpenAI(prompt);
      const summary = JSON.parse(response);
      
      return {
        keyHighlights: summary.keyHighlights || [],
        mainTopics: summary.mainTopics || [],
        nextSteps: summary.nextSteps || [],
        risks: summary.risks || [],
        overallSentiment: summary.overallSentiment || { positive: 0.5, negative: 0.2, neutral: 0.3, overall: 'neutral' },
        participationStats: this.calculateParticipationStats(segments)
      };
    } catch (error) {
      console.error('Summary generation failed:', error);
      return this.getDefaultSummary();
    }
  }

  private async identifyRisks(segments: TranscriptionSegment[]): Promise<string[]> {
    const riskKeywords = ['concern', 'issue', 'problem', 'risk', 'blocker', 'challenge'];
    const risks: string[] = [];
    
    for (const segment of segments) {
      if (riskKeywords.some(keyword => segment.text.toLowerCase().includes(keyword))) {
        risks.push(segment.text);
      }
    }
    
    return risks;
  }

  private async identifyNextSteps(segments: TranscriptionSegment[]): Promise<string[]> {
    const nextStepKeywords = ['next', 'follow up', 'action', 'todo', 'will do', 'should'];
    const nextSteps: string[] = [];
    
    for (const segment of segments) {
      if (nextStepKeywords.some(keyword => segment.text.toLowerCase().includes(keyword))) {
        nextSteps.push(segment.text);
      }
    }
    
    return nextSteps;
  }

  private calculateParticipationStats(segments: TranscriptionSegment[]) {
    const speakingTime: Record<string, number> = {};
    const interactionCount: Record<string, number> = {};
    
    segments.forEach(segment => {
      const speakerId = segment.speakerId;
      speakingTime[speakerId] = (speakingTime[speakerId] || 0) + segment.text.length;
      interactionCount[speakerId] = (interactionCount[speakerId] || 0) + 1;
    });
    
    const engagementLevel: Record<string, number> = {};
    Object.keys(speakingTime).forEach(speakerId => {
      engagementLevel[speakerId] = (speakingTime[speakerId] + interactionCount[speakerId] * 10) / 100;
    });
    
    return { speakingTime, interactionCount, engagementLevel };
  }

  private async callOpenAI(prompt: string): Promise<string> {
    // OpenAI API integration
    // This would use the actual OpenAI SDK
    return JSON.stringify({
      keyHighlights: ["Sample highlight"],
      mainTopics: ["Sample topic"],
      nextSteps: ["Sample next step"]
    });
  }

  private deduplicateAndPrioritize(items: ActionItem[]): ActionItem[] {
    // Remove duplicates and sort by priority
    const unique = items.filter((item, index, self) => 
      index === self.findIndex(i => i.description.toLowerCase() === item.description.toLowerCase())
    );
    
    return unique.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));
  }

  private mapPriority(priority: string): Priority {
    switch (priority?.toLowerCase()) {
      case 'critical': return Priority.CRITICAL;
      case 'high': return Priority.HIGH;
      case 'medium': return Priority.MEDIUM;
      default: return Priority.LOW;
    }
  }

  private mapImpactLevel(impact: string): ImpactLevel {
    switch (impact?.toLowerCase()) {
      case 'critical': return ImpactLevel.CRITICAL;
      case 'high': return ImpactLevel.HIGH;
      case 'medium': return ImpactLevel.MEDIUM;
      default: return ImpactLevel.LOW;
    }
  }

  private mapDecisionCategory(category: string): DecisionCategory {
    switch (category?.toLowerCase()) {
      case 'strategic': return DecisionCategory.STRATEGIC;
      case 'operational': return DecisionCategory.OPERATIONAL;
      case 'technical': return DecisionCategory.TECHNICAL;
      case 'financial': return DecisionCategory.FINANCIAL;
      case 'personnel': return DecisionCategory.PERSONNEL;
      default: return DecisionCategory.OPERATIONAL;
    }
  }

  private getPriorityWeight(priority: Priority): number {
    switch (priority) {
      case Priority.CRITICAL: return 4;
      case Priority.HIGH: return 3;
      case Priority.MEDIUM: return 2;
      case Priority.LOW: return 1;
    }
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private initializeCustomVocabulary(): void {
    // Initialize with common business terms
    this.customVocabulary.set('general', [
      'action item', 'follow up', 'deliverable', 'milestone', 'deadline',
      'stakeholder', 'requirement', 'specification', 'implementation'
    ]);
  }

  private getDefaultSummary(): MeetingSummary {
    return {
      keyHighlights: [],
      mainTopics: [],
      nextSteps: [],
      risks: [],
      overallSentiment: { positive: 0.5, negative: 0.2, neutral: 0.3, overall: 'neutral' },
      participationStats: { speakingTime: {}, interactionCount: {}, engagementLevel: {} }
    };
  }
}

export interface AnalysisResult {
  actionItems: ActionItem[];
  decisions: Decision[];
  summary: MeetingSummary;
  risks: string[];
  nextSteps: string[];
}
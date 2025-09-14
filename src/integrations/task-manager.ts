import { ActionItem, TaskPlatform, TaskStatus, IntegrationStatus, Priority } from '../types/meeting';

export class TaskManagerIntegration {
  private integrations: Map<TaskPlatform, TaskPlatformAdapter> = new Map();

  constructor() {
    this.initializeAdapters();
  }

  async createTasks(actionItems: ActionItem[], sessionId: string): Promise<void> {
    const promises = actionItems.map(async (item) => {
      for (const integration of item.integrations) {
        if (integration.status === IntegrationStatus.CONNECTED) {
          await this.createTaskInPlatform(item, integration.platform, sessionId);
        }
      }
    });

    await Promise.all(promises);
  }

  private async createTaskInPlatform(actionItem: ActionItem, platform: TaskPlatform, sessionId: string): Promise<void> {
    const adapter = this.integrations.get(platform);
    if (!adapter) {
      console.error(`No adapter found for platform: ${platform}`);
      return;
    }

    try {
      const taskData = this.mapActionItemToTask(actionItem, sessionId);
      const taskId = await adapter.createTask(taskData);
      
      // Update action item with task ID
      const integration = actionItem.integrations.find(i => i.platform === platform);
      if (integration) {
        integration.taskId = taskId;
        integration.status = IntegrationStatus.CONNECTED;
        integration.lastSync = new Date();
      }
      
      console.log(`Created task ${taskId} in ${platform} for action item: ${actionItem.description}`);
    } catch (error) {
      console.error(`Failed to create task in ${platform}:`, error);
      const integration = actionItem.integrations.find(i => i.platform === platform);
      if (integration) {
        integration.status = IntegrationStatus.FAILED;
      }
    }
  }

  async syncTaskStatus(actionItems: ActionItem[]): Promise<void> {
    for (const item of actionItems) {
      for (const integration of item.integrations) {
        if (integration.taskId && integration.status === IntegrationStatus.CONNECTED) {
          await this.syncSingleTask(item, integration.platform, integration.taskId);
        }
      }
    }
  }

  private async syncSingleTask(actionItem: ActionItem, platform: TaskPlatform, taskId: string): Promise<void> {
    const adapter = this.integrations.get(platform);
    if (!adapter) return;

    try {
      const taskStatus = await adapter.getTaskStatus(taskId);
      actionItem.status = this.mapPlatformStatusToTaskStatus(taskStatus);
      
      const integration = actionItem.integrations.find(i => i.platform === platform);
      if (integration) {
        integration.lastSync = new Date();
      }
    } catch (error) {
      console.error(`Failed to sync task ${taskId} from ${platform}:`, error);
    }
  }

  async suggestAssignees(actionItem: ActionItem, participants: string[]): Promise<string[]> {
    // AI-powered assignee suggestion based on:
    // - Past assignment patterns
    // - Participant expertise
    // - Current workload
    // - Context of the action item
    
    const suggestions: string[] = [];
    
    // Simple heuristic for demo - would be replaced with ML model
    if (actionItem.description.toLowerCase().includes('design')) {
      suggestions.push(...participants.filter(p => p.includes('designer')));
    } else if (actionItem.description.toLowerCase().includes('code') || actionItem.description.toLowerCase().includes('develop')) {
      suggestions.push(...participants.filter(p => p.includes('developer')));
    } else if (actionItem.description.toLowerCase().includes('test')) {
      suggestions.push(...participants.filter(p => p.includes('qa') || p.includes('test')));
    }
    
    return suggestions.length > 0 ? suggestions : [participants[0]]; // Fallback to first participant
  }

  async suggestDueDate(actionItem: ActionItem): Promise<Date | undefined> {
    const urgencyKeywords = ['urgent', 'asap', 'immediately', 'critical', 'emergency'];
    const shortTermKeywords = ['today', 'tomorrow', 'this week', 'end of week'];
    const mediumTermKeywords = ['next week', 'two weeks', 'month'];
    
    const description = actionItem.description.toLowerCase();
    const now = new Date();
    
    if (urgencyKeywords.some(keyword => description.includes(keyword)) || actionItem.priority === Priority.CRITICAL) {
      // Same day or next day
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    } else if (shortTermKeywords.some(keyword => description.includes(keyword)) || actionItem.priority === Priority.HIGH) {
      // End of week
      const daysUntilFriday = (5 - now.getDay() + 7) % 7;
      return new Date(now.getTime() + daysUntilFriday * 24 * 60 * 60 * 1000);
    } else if (mediumTermKeywords.some(keyword => description.includes(keyword)) || actionItem.priority === Priority.MEDIUM) {
      // Two weeks
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else {
      // One month for low priority
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
  }

  private mapActionItemToTask(actionItem: ActionItem, sessionId: string): TaskData {
    return {
      title: actionItem.description,
      description: `Action item from meeting session: ${sessionId}`,
      assignee: actionItem.assignee,
      priority: this.mapPriorityToPlatform(actionItem.priority),
      dueDate: actionItem.dueDate,
      tags: ['meeting-assistant', sessionId],
      metadata: {
        sourceType: 'meeting',
        sourceId: sessionId,
        actionItemId: actionItem.id,
        confidence: actionItem.confidence
      }
    };
  }

  private mapPriorityToPlatform(priority: Priority): string {
    switch (priority) {
      case Priority.CRITICAL: return 'urgent';
      case Priority.HIGH: return 'high';
      case Priority.MEDIUM: return 'medium';
      case Priority.LOW: return 'low';
    }
  }

  private mapPlatformStatusToTaskStatus(platformStatus: string): TaskStatus {
    const statusMap: Record<string, TaskStatus> = {
      'todo': TaskStatus.PENDING,
      'in_progress': TaskStatus.IN_PROGRESS,
      'done': TaskStatus.COMPLETED,
      'blocked': TaskStatus.BLOCKED,
      'cancelled': TaskStatus.CANCELLED
    };
    
    return statusMap[platformStatus.toLowerCase()] || TaskStatus.PENDING;
  }

  private initializeAdapters(): void {
    this.integrations.set(TaskPlatform.ASANA, new AsanaAdapter());
    this.integrations.set(TaskPlatform.TRELLO, new TrelloAdapter());
    this.integrations.set(TaskPlatform.JIRA, new JiraAdapter());
    this.integrations.set(TaskPlatform.MONDAY, new MondayAdapter());
  }
}

// Abstract base class for task platform adapters
abstract class TaskPlatformAdapter {
  abstract createTask(taskData: TaskData): Promise<string>;
  abstract getTaskStatus(taskId: string): Promise<string>;
  abstract updateTask(taskId: string, updates: Partial<TaskData>): Promise<void>;
}

// Platform-specific adapters
class AsanaAdapter extends TaskPlatformAdapter {
  async createTask(taskData: TaskData): Promise<string> {
    // Asana API integration
    console.log('Creating Asana task:', taskData.title);
    return `asana_${Date.now()}`;
  }

  async getTaskStatus(taskId: string): Promise<string> {
    // Fetch from Asana API
    return 'todo';
  }

  async updateTask(taskId: string, updates: Partial<TaskData>): Promise<void> {
    console.log(`Updating Asana task ${taskId}:`, updates);
  }
}

class TrelloAdapter extends TaskPlatformAdapter {
  async createTask(taskData: TaskData): Promise<string> {
    // Trello API integration
    console.log('Creating Trello card:', taskData.title);
    return `trello_${Date.now()}`;
  }

  async getTaskStatus(taskId: string): Promise<string> {
    return 'todo';
  }

  async updateTask(taskId: string, updates: Partial<TaskData>): Promise<void> {
    console.log(`Updating Trello card ${taskId}:`, updates);
  }
}

class JiraAdapter extends TaskPlatformAdapter {
  async createTask(taskData: TaskData): Promise<string> {
    // Jira API integration
    console.log('Creating Jira issue:', taskData.title);
    return `jira_${Date.now()}`;
  }

  async getTaskStatus(taskId: string): Promise<string> {
    return 'todo';
  }

  async updateTask(taskId: string, updates: Partial<TaskData>): Promise<void> {
    console.log(`Updating Jira issue ${taskId}:`, updates);
  }
}

class MondayAdapter extends TaskPlatformAdapter {
  async createTask(taskData: TaskData): Promise<string> {
    // Monday.com API integration
    console.log('Creating Monday.com item:', taskData.title);
    return `monday_${Date.now()}`;
  }

  async getTaskStatus(taskId: string): Promise<string> {
    return 'todo';
  }

  async updateTask(taskId: string, updates: Partial<TaskData>): Promise<void> {
    console.log(`Updating Monday.com item ${taskId}:`, updates);
  }
}

interface TaskData {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  dueDate?: Date;
  tags: string[];
  metadata: {
    sourceType: string;
    sourceId: string;
    actionItemId: string;
    confidence: number;
  };
}
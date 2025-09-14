// Optimization-related type definitions

import { RiskLevel } from './core';

export interface OptimizationPlan {
  recommendations: Recommendation[];
  estimatedSavings: number;
  riskLevel: RiskLevel;
  approvalRequired: boolean;
  executionSteps: OptimizationStep[];
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  resourceId: string;
  description: string;
  impact: OptimizationImpact;
  confidence: number;
  priority: number;
}

export enum RecommendationType {
  RIGHTSIZING = 'rightsizing',
  IDLE_CLEANUP = 'idle_cleanup',
  RESERVED_INSTANCES = 'reserved_instances',
  SPOT_INSTANCES = 'spot_instances',
  STORAGE_OPTIMIZATION = 'storage_optimization',
  NETWORK_OPTIMIZATION = 'network_optimization',
  PERFORMANCE_TUNING = 'performance_tuning'
}

export interface OptimizationImpact {
  costSavings: number;
  performanceChange: number;
  availabilityRisk: RiskLevel;
  implementationEffort: 'low' | 'medium' | 'high';
}

export interface OptimizationStep {
  id: string;
  action: OptimizationAction;
  resourceId: string;
  parameters: Record<string, any>;
  dependencies: string[];
  estimatedDuration: number;
  rollbackPlan: string;
}

export enum OptimizationAction {
  RESIZE = 'resize',
  DELETE = 'delete',
  MIGRATE = 'migrate',
  RECONFIGURE = 'reconfigure',
  SCHEDULE = 'schedule'
}

export interface OptimizationResult {
  success: boolean;
  executedSteps: ExecutedStep[];
  actualSavings: number;
  errors: OptimizationError[];
}

export interface ExecutedStep {
  stepId: string;
  status: 'completed' | 'failed' | 'skipped';
  startTime: Date;
  endTime?: Date;
  result?: Record<string, any>;
}

export interface OptimizationError {
  stepId: string;
  errorCode: string;
  message: string;
  recoverable: boolean;
}

export interface MetricsData {
  resourceId: string;
  timestamp: Date;
  metrics: Record<string, number>;
  tags: Record<string, string>;
}

export interface PerformanceAnalysis {
  resourceId: string;
  period: {
    start: Date;
    end: Date;
  };
  utilization: UtilizationMetrics;
  bottlenecks: PerformanceBottleneck[];
  trends: PerformanceTrend[];
}

export interface UtilizationMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  custom: Record<string, number>;
}

export interface PerformanceBottleneck {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

export interface PerformanceTrend {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  prediction: number;
}

export interface CostAnalysis {
  totalCost: number;
  period: {
    start: Date;
    end: Date;
  };
  breakdown: ResourceCostBreakdown[];
  trends: CostTrend[];
  anomalies: CostAnomaly[];
}

export interface ResourceCostBreakdown {
  resourceId: string;
  cost: number;
  utilization: number;
  efficiency: number;
  recommendations: string[];
}

export interface CostTrend {
  period: string;
  cost: number;
  change: number;
  projection: number;
}

export interface CostAnomaly {
  resourceId: string;
  timestamp: Date;
  expectedCost: number;
  actualCost: number;
  deviation: number;
  cause?: string;
}
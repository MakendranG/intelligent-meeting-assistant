// Provisioning-related type definitions

import { Resource, CloudProvider } from './core';

export interface ProvisioningResult {
  success: boolean;
  resourceStates: ResourceState[];
  errors: ProvisioningError[];
  rollbackPlan?: RollbackPlan;
  estimatedCost: CostEstimate;
}

export interface ResourceState {
  resourceId: string;
  status: ResourceStatus;
  actualConfiguration: Record<string, any>;
  providerResourceId?: string;
  endpoints?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ResourceStatus {
  PENDING = 'pending',
  CREATING = 'creating',
  ACTIVE = 'active',
  UPDATING = 'updating',
  DELETING = 'deleting',
  DELETED = 'deleted',
  ERROR = 'error'
}

export interface ProvisioningError {
  resourceId: string;
  errorCode: string;
  message: string;
  details?: Record<string, any>;
  retryable: boolean;
}

export interface RollbackPlan {
  steps: RollbackStep[];
  estimatedDuration: number;
  riskAssessment: string;
}

export interface RollbackStep {
  action: 'delete' | 'update' | 'recreate';
  resourceId: string;
  parameters: Record<string, any>;
  order: number;
}

export interface CostEstimate {
  totalCost: number;
  currency: string;
  period: 'hourly' | 'daily' | 'monthly';
  breakdown: CostBreakdown[];
  confidence: number;
}

export interface CostBreakdown {
  resourceId: string;
  resourceType: string;
  cost: number;
  details: Record<string, number>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  resourceId?: string;
  field?: string;
  suggestedFix?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  resourceId?: string;
  field?: string;
  recommendation?: string;
}

export interface QuotaCheck {
  provider: CloudProvider;
  region: string;
  quotas: QuotaStatus[];
  overallStatus: 'ok' | 'warning' | 'exceeded';
}

export interface QuotaStatus {
  resourceType: string;
  current: number;
  limit: number;
  requested: number;
  available: number;
}

export interface SecurityValidation {
  passed: boolean;
  violations: SecurityViolation[];
  recommendations: SecurityRecommendation[];
}

export interface SecurityViolation {
  severity: 'critical' | 'high' | 'medium' | 'low';
  rule: string;
  resourceId: string;
  description: string;
  remediation: string;
}

export interface SecurityRecommendation {
  type: string;
  resourceId: string;
  description: string;
  impact: string;
}
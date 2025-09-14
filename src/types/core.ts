// Core type definitions for the Intelligent IaC system

export enum CloudProvider {
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp',
  KUBERNETES = 'kubernetes'
}

export enum ResourceType {
  COMPUTE = 'compute',
  STORAGE = 'storage',
  NETWORK = 'network',
  DATABASE = 'database',
  CONTAINER = 'container',
  SERVERLESS = 'serverless'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface InfrastructureSpec {
  metadata: {
    name: string;
    version: string;
    environment: string;
    tags: Record<string, string>;
  };
  resources: Resource[];
  dependencies: Dependency[];
  policies: Policy[];
  budgets: Budget[];
}

export interface Resource {
  id: string;
  type: ResourceType;
  provider: CloudProvider;
  configuration: Record<string, any>;
  dependencies: string[];
  monitoring: MonitoringConfig;
  optimization: OptimizationConfig;
}

export interface Dependency {
  from: string;
  to: string;
  type: 'hard' | 'soft';
}

export interface Policy {
  id: string;
  type: 'security' | 'cost' | 'performance';
  rules: PolicyRule[];
}

export interface PolicyRule {
  condition: string;
  action: string;
  severity: 'error' | 'warning' | 'info';
}

export interface Budget {
  name: string;
  limit: number;
  currency: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  alertThresholds: number[];
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerting: AlertConfig[];
}

export interface AlertConfig {
  metric: string;
  threshold: number;
  operator: '>' | '<' | '=' | '>=' | '<=';
  action: string;
}

export interface OptimizationConfig {
  enabled: boolean;
  strategies: OptimizationStrategy[];
  constraints: OptimizationConstraint[];
}

export interface OptimizationStrategy {
  type: 'cost' | 'performance' | 'availability';
  priority: number;
  parameters: Record<string, any>;
}

export interface OptimizationConstraint {
  type: string;
  value: any;
  enforced: boolean;
}
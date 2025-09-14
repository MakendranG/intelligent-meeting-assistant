// Error types for the Intelligent IaC system

export abstract class IaCError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Parsing Errors
export class SpecParsingError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'SPEC_PARSING_ERROR', context);
  }
}

export class TemplateExpansionError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'TEMPLATE_EXPANSION_ERROR', context);
  }
}

// Validation Errors
export class ResourceValidationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'RESOURCE_VALIDATION_ERROR', context);
  }
}

export class SecurityPolicyViolationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'SECURITY_POLICY_VIOLATION', context);
  }
}

export class QuotaExceededError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'QUOTA_EXCEEDED_ERROR', context);
  }
}

// Provisioning Errors
export class ProvisioningError extends IaCError {
  public readonly retryable: boolean;

  constructor(message: string, retryable: boolean = false, context?: Record<string, any>) {
    super(message, 'PROVISIONING_ERROR', context);
    this.retryable = retryable;
  }
}

export class DependencyResolutionError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'DEPENDENCY_RESOLUTION_ERROR', context);
  }
}

export class RollbackError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'ROLLBACK_ERROR', context);
  }
}

export class StateManagementError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'STATE_MANAGEMENT_ERROR', context);
  }
}

// Monitoring Errors
export class MonitoringError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'MONITORING_ERROR', context);
  }
}

export class MetricsCollectionError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'METRICS_COLLECTION_ERROR', context);
  }
}

// Optimization Errors
export class OptimizationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'OPTIMIZATION_ERROR', context);
  }
}

export class OptimizationExecutionError extends IaCError {
  public readonly recoverable: boolean;

  constructor(message: string, recoverable: boolean = false, context?: Record<string, any>) {
    super(message, 'OPTIMIZATION_EXECUTION_ERROR', context);
    this.recoverable = recoverable;
  }
}

// Cloud Provider Errors
export class CloudProviderError extends IaCError {
  public readonly provider: string;
  public readonly providerErrorCode?: string;

  constructor(
    message: string, 
    provider: string, 
    providerErrorCode?: string, 
    context?: Record<string, any>
  ) {
    super(message, 'CLOUD_PROVIDER_ERROR', context);
    this.provider = provider;
    this.providerErrorCode = providerErrorCode;
  }
}

export class AuthenticationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'AUTHENTICATION_ERROR', context);
  }
}

export class AuthorizationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'AUTHORIZATION_ERROR', context);
  }
}

// Configuration Errors
export class ConfigurationError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', context);
  }
}

export class InvalidEnvironmentError extends IaCError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'INVALID_ENVIRONMENT_ERROR', context);
  }
}

// Utility function to check if an error is retryable
export function isRetryableError(error: Error): boolean {
  if (error instanceof ProvisioningError) {
    return error.retryable;
  }
  
  if (error instanceof OptimizationExecutionError) {
    return error.recoverable;
  }
  
  // Network-related errors are generally retryable
  if (error.message.includes('timeout') || 
      error.message.includes('network') || 
      error.message.includes('connection')) {
    return true;
  }
  
  return false;
}

// Utility function to extract error context for logging
export function getErrorContext(error: Error): Record<string, any> {
  const context: Record<string, any> = {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
  
  if (error instanceof IaCError) {
    context.code = error.code;
    context.timestamp = error.timestamp;
    context.context = error.context;
  }
  
  if (error instanceof CloudProviderError) {
    context.provider = error.provider;
    context.providerErrorCode = error.providerErrorCode;
  }
  
  return context;
}
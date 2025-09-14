// Base component class for all IaC system components

export abstract class BaseComponent {
  protected readonly name: string;
  protected readonly version: string;
  protected logger: Logger;

  constructor(name: string, version: string = '1.0.0') {
    this.name = name;
    this.version = version;
    this.logger = new Logger(name);
  }

  protected log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    this.logger.log(level, message, metadata);
  }

  protected logError(error: Error, context?: string): void {
    this.logger.error(`${context ? `${context}: ` : ''}${error.message}`, {
      stack: error.stack,
      name: error.name
    });
  }

  public getName(): string {
    return this.name;
  }

  public getVersion(): string {
    return this.version;
  }
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export class Logger {
  constructor(private component: string) {}

  log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      component: this.component,
      message,
      ...metadata
    };
    
    // In a real implementation, this would integrate with a proper logging system
    console.log(JSON.stringify(logEntry));
  }

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }
}
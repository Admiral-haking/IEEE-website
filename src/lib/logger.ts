import { NextRequest } from 'next/server';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private service: string;
  private isProduction: boolean;

  constructor(service: string = 'hippogriff') {
    this.service = service;
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  private formatLog(level: LogLevel, message: string, metadata?: Record<string, any>, req?: NextRequest): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      metadata
    };

    if (req) {
      entry.ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      entry.userAgent = req.headers.get('user-agent') || 'unknown';
      entry.requestId = req.headers.get('x-request-id') || undefined;
    }

    return entry;
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    if (!this.isProduction) {
      // In development, just log to console
      console.log(JSON.stringify(entry, null, 2));
      return;
    }

    // In production, send to your logging service (ELK, Loki, etc.)
    try {
      const response = await fetch(process.env.LOGGING_ENDPOINT || 'http://localhost:3100/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LOGGING_TOKEN}`
        },
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        console.error('Failed to send log to logging service:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending log to logging service:', error);
    }
  }

  async error(message: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    const entry = this.formatLog(LogLevel.ERROR, message, metadata, req);
    await this.sendToLoggingService(entry);
  }

  async warn(message: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    const entry = this.formatLog(LogLevel.WARN, message, metadata, req);
    await this.sendToLoggingService(entry);
  }

  async info(message: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    const entry = this.formatLog(LogLevel.INFO, message, metadata, req);
    await this.sendToLoggingService(entry);
  }

  async debug(message: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    if (!this.isProduction) {
      const entry = this.formatLog(LogLevel.DEBUG, message, metadata, req);
      await this.sendToLoggingService(entry);
    }
  }

  // Security-specific logging methods
  async securityEvent(event: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    await this.warn(`Security Event: ${event}`, {
      ...metadata,
      securityEvent: true,
      severity: 'high'
    }, req);
  }

  async authEvent(event: string, userId?: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    await this.info(`Auth Event: ${event}`, {
      ...metadata,
      authEvent: true,
      userId
    }, req);
  }

  async rateLimitHit(ip: string, endpoint: string, req?: NextRequest): Promise<void> {
    await this.securityEvent('Rate limit exceeded', {
      ip,
      endpoint,
      rateLimitHit: true
    }, req);
  }

  async suspiciousActivity(activity: string, metadata?: Record<string, any>, req?: NextRequest): Promise<void> {
    await this.securityEvent(`Suspicious Activity: ${activity}`, {
      ...metadata,
      suspiciousActivity: true,
      severity: 'critical'
    }, req);
  }
}

// Export singleton instance
export const logger = new Logger();

// Helper functions for common logging scenarios
export async function logAuthAttempt(email: string, success: boolean, req?: NextRequest): Promise<void> {
  await logger.authEvent(
    success ? 'Login successful' : 'Login failed',
    undefined,
    { email, success },
    req
  );
}

export async function logRegistration(email: string, req?: NextRequest): Promise<void> {
  await logger.authEvent('User registration', undefined, { email }, req);
}

export async function logPasswordChange(userId: string, req?: NextRequest): Promise<void> {
  await logger.authEvent('Password changed', userId, {}, req);
}

export async function logAdminAction(action: string, adminId: string, targetId?: string, req?: NextRequest): Promise<void> {
  await logger.info(`Admin Action: ${action}`, {
    adminId,
    targetId,
    adminAction: true
  }, req);
}

export async function logDataAccess(resource: string, userId: string, action: string, req?: NextRequest): Promise<void> {
  await logger.info(`Data Access: ${action}`, {
    resource,
    userId,
    dataAccess: true
  }, req);
}

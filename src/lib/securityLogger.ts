import { logger } from './logger';

export interface SecurityEvent {
  type: 'auth_failure' | 'auth_success' | 'rate_limit' | 'csrf_violation' | 'xss_attempt' | 'sql_injection' | 'file_upload' | 'admin_action' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent?: string;
  endpoint: string;
  method: string;
  details: Record<string, any>;
  timestamp: Date;
}

export class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];

  private constructor() {}

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  public logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    // Log to console/file
    this.logToFile(fullEvent);

    // Store in memory for real-time monitoring
    this.events.push(fullEvent);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Send to external SIEM if configured
    this.sendToSIEM(fullEvent);

    // Check for patterns and trigger alerts
    this.checkForPatterns(fullEvent);
  }

  private logToFile(event: SecurityEvent): void {
    const logLevel = this.getLogLevel(event.severity);
    logger[logLevel]('Security Event', {
      type: event.type,
      severity: event.severity,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      endpoint: event.endpoint,
      method: event.method,
      details: event.details,
      timestamp: event.timestamp.toISOString()
    });
  }

  private getLogLevel(severity: SecurityEvent['severity']): 'info' | 'warn' | 'error' {
    switch (severity) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warn';
      case 'high':
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  }

  private async sendToSIEM(event: SecurityEvent): Promise<void> {
    const siemEndpoint = process.env.SIEM_ENDPOINT;
    if (!siemEndpoint) return;

    try {
      const response = await fetch(siemEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SIEM_TOKEN}`
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        logger.error('Failed to send event to SIEM', { status: response.status });
      }
    } catch (error) {
      logger.error('Error sending event to SIEM', { error });
    }
  }

  private checkForPatterns(event: SecurityEvent): void {
    // Check for brute force attacks
    if (event.type === 'auth_failure') {
      const recentFailures = this.events.filter(e => 
        e.type === 'auth_failure' && 
        e.ip === event.ip && 
        e.timestamp > new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
      );

      if (recentFailures.length >= 5) {
        this.triggerAlert('brute_force', {
          ip: event.ip,
          failureCount: recentFailures.length,
          timeWindow: '15 minutes'
        });
      }
    }

    // Check for suspicious activity patterns
    if (event.type === 'suspicious_activity') {
      const recentSuspicious = this.events.filter(e => 
        e.type === 'suspicious_activity' && 
        e.ip === event.ip && 
        e.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
      );

      if (recentSuspicious.length >= 10) {
        this.triggerAlert('suspicious_pattern', {
          ip: event.ip,
          activityCount: recentSuspicious.length,
          timeWindow: '1 hour'
        });
      }
    }
  }

  private triggerAlert(type: string, details: Record<string, any>): void {
    logger.error('Security Alert', {
      alertType: type,
      details,
      timestamp: new Date().toISOString()
    });

    // Send alert to external systems
    this.sendAlert(type, details);
  }

  private async sendAlert(type: string, details: Record<string, any>): Promise<void> {
    const alertEndpoint = process.env.ALERT_ENDPOINT;
    if (!alertEndpoint) return;

    try {
      await fetch(alertEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ALERT_TOKEN}`
        },
        body: JSON.stringify({
          type,
          details,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      logger.error('Error sending alert', { error });
    }
  }

  public getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  public getEventsByType(type: SecurityEvent['type'], limit: number = 100): SecurityEvent[] {
    return this.events
      .filter(e => e.type === type)
      .slice(-limit);
  }

  public getEventsByIP(ip: string, limit: number = 100): SecurityEvent[] {
    return this.events
      .filter(e => e.ip === ip)
      .slice(-limit);
  }
}

export const securityLogger = SecurityLogger.getInstance();

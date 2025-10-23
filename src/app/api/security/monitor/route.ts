import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    // Basic health check for security monitoring
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    await logger.info('Security monitor health check', { health }, req);
    
    return NextResponse.json(health);
  } catch (error) {
    await logger.error('Security monitor error', { error: error instanceof Error ? error.message : 'Unknown error' }, req);
    return NextResponse.json({ error: 'Monitor error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, severity, metadata } = body;

    // Log security events
    await logger.securityEvent(event, {
      severity: severity || 'medium',
      ...metadata
    }, req);

    return NextResponse.json({ success: true });
  } catch (error) {
    await logger.error('Security event logging error', { error: error instanceof Error ? error.message : 'Unknown error' }, req);
    return NextResponse.json({ error: 'Failed to log security event' }, { status: 400 });
  }
}

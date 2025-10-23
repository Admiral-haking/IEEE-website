import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth/guard';
import { securityLogger } from '@/lib/securityLogger';
import { AppError } from '@/server/errors';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(); // Only admins can view security events

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const ip = searchParams.get('ip');
    const limit = parseInt(searchParams.get('limit') || '100');

    let events;

    if (type) {
      events = securityLogger.getEventsByType(type as any, limit);
    } else if (ip) {
      events = securityLogger.getEventsByIP(ip, limit);
    } else {
      events = securityLogger.getRecentEvents(limit);
    }

    return NextResponse.json({
      success: true,
      events,
      count: events.length
    });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 500;
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const event = await req.json();
    
    // Validate event structure
    if (!event.type || !event.severity || !event.ip || !event.endpoint) {
      return NextResponse.json({ error: 'Invalid event structure' }, { status: 400 });
    }

    securityLogger.logEvent(event);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err instanceof AppError ? err.status : 400;
    const message = err instanceof AppError ? err.message : 'Invalid JSON';
    return NextResponse.json({ error: message }, { status });
  }
}

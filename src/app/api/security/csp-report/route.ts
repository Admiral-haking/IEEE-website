import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    
    // Log CSP violations for monitoring
    console.log('CSP Violation Report:', {
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
      report: report
    });
    
    // In production, you would send this to your logging service
    // For now, we just log it and return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json({ error: 'Failed to process report' }, { status: 400 });
  }
}

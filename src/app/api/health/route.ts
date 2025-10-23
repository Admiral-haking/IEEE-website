import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';

export async function GET() {
  try {
    // Check database connection
    await connectDB();
    
    // Check if database is responsive
    const db = await import('mongoose');
    const isConnected = db.connection.readyState === 1;
    
    if (!isConnected) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'disconnected' },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
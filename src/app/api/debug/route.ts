import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Stats from '@/models/Stats';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    console.log('Debug endpoint called');
    
    // Test database connection
    await connectDB();
    console.log('Database connected successfully');
    
    // Test Stats model
    const statsCount = await Stats.countDocuments();
    console.log('Stats count:', statsCount);
    
    // Test getting visible stats
    const visibleStats = await Stats.find({ visible: true }).lean();
    console.log('Visible stats:', visibleStats.length);
    
    return NextResponse.json({
      success: true,
      database: 'connected',
      statsCount,
      visibleStatsCount: visibleStats.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


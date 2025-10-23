import { NextResponse } from 'next/server';
import { getVisibleStats } from '@/server/stats/service';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    console.log('Testing getVisibleStats function...');
    const stats = await getVisibleStats();
    console.log('getVisibleStats result:', stats);
    
    return NextResponse.json({ 
      success: true, 
      stats, 
      count: stats.length,
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Test stats error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stack: error.stack,
      timestamp: new Date().toISOString() 
    }, { status: 500 });
  }
}


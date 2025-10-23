import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  try {
    return NextResponse.json({ message: 'Hello World', timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

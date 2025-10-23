import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({ 
        error: 'MONGODB_URI not configured',
        status: 'not_configured'
      }, { status: 500 });
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      // Already connected, get stats
      const db = mongoose.connection.db;
      if (!db) {
        return NextResponse.json({
          status: 'connection_error',
          error: 'Database connection exists but db object is null',
          timestamp: new Date().toISOString(),
        }, { status: 500 });
      }
      const stats = await db.stats();
      const collections = await db.listCollections().toArray();
      
      return NextResponse.json({
        status: 'connected',
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        dbStats: {
          collections: stats.collections,
          objects: stats.objects,
          avgObjSize: stats.avgObjSize,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          fileSize: stats.fileSize,
          indexes: stats.indexes,
          indexSize: stats.indexSize,
        },
        collections: collections.map(c => c.name),
        timestamp: new Date().toISOString(),
      });
    }

    // Try to connect
    try {
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      const db = mongoose.connection.db;
      if (!db) {
        return NextResponse.json({
          status: 'connection_error',
          error: 'Database connection exists but db object is null',
          timestamp: new Date().toISOString(),
        }, { status: 500 });
      }
      const stats = await db.stats();
      const collections = await db.listCollections().toArray();

      return NextResponse.json({
        status: 'connected',
        readyState: mongoose.connection.readyState,
        dbName: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        dbStats: {
          collections: stats.collections,
          objects: stats.objects,
          avgObjSize: stats.avgObjSize,
          dataSize: stats.dataSize,
          storageSize: stats.storageSize,
          fileSize: stats.fileSize,
          indexes: stats.indexes,
          indexSize: stats.indexSize,
        },
        collections: collections.map(c => c.name),
        timestamp: new Date().toISOString(),
      });
    } catch (connectError) {
      return NextResponse.json({
        status: 'connection_failed',
        readyState: mongoose.connection.readyState,
        error: connectError instanceof Error ? connectError.message : 'Unknown connection error',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Database health check error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    'MONGODB_URI is not set. DB routes will fail.'
  );
  console.warn(
    'Please set MONGODB_URI in your .env.local file for database functionality.'
  );
}

type MongooseGlobal = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

const globalWithMongoose = global as MongooseGlobal;

// تابع async برای اتصال
export const connectDB = async () => {
  if (!globalWithMongoose._mongooseConn) {
    globalWithMongoose._mongooseConn = (async () => {
      if (!MONGODB_URI) return mongoose; // no-op connection
      if (mongoose.connection.readyState >= 1) return mongoose;

      try {
        await mongoose.connect(MONGODB_URI, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
          retryWrites: true,
          retryReads: true,
          heartbeatFrequencyMS: 10000,
          maxIdleTimeMS: 30000,
        });

        console.log('MongoDB connected successfully');

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      }

      return mongoose;
    })();
  }

  return globalWithMongoose._mongooseConn;
};

// export default هم می‌تونه باشه ولی connectDB تابعی که لازم داری
export default connectDB;

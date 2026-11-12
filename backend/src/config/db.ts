import mongoose from 'mongoose';

// Global cache to reuse connection across serverless warm invocations
// Without this, each function invocation could open a new connection,
// exhausting MongoDB Atlas's connection pool.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

export const connectDB = async (): Promise<typeof mongoose> => {
  // Return existing connection immediately if available
  if (global._mongooseCache.conn) {
    return global._mongooseCache.conn;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('[Database] MONGO_URI is not defined in environment variables.');
  }

  // Create the connection promise once; subsequent calls await the same promise
  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10, // Conservative pool size for serverless scaling
    });
  }

  try {
    global._mongooseCache.conn = await global._mongooseCache.promise;
    console.log(`[Database] MongoDB Connected: ${global._mongooseCache.conn.connection.host}`);
  } catch (error: any) {
    // Reset promise on failure so the next request can retry
    global._mongooseCache.promise = null;
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }

  return global._mongooseCache.conn;
};

import mongoose from 'mongoose';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cachedPromise) {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/security_agency';
    
    cachedPromise = mongoose
      .connect(connStr, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      })
      .then((m) => {
        console.log(`[MongoDB] Connected successfully to host: ${m.connection.host}`);
        console.log(`[MongoDB] Database Name: ${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cachedPromise = null; // Clear cached promise on failure to allow retry
        console.error('[MongoDB] Connection error:', err.message || err);
        throw err;
      });
  }

  return cachedPromise;
};


import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/security_agency';
    const conn = await mongoose.connect(connStr);
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
  }
};

import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_db';
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.warn(`[Database Warning] Please ensure your MONGO_URI is set correctly in backend/.env`);
  }
};


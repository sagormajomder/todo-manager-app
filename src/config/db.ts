import env from '@/config/env.js';
import mongoose from 'mongoose';

mongoose.set('bufferCommands', env.NODE_ENV !== 'production');

mongoose.connection.on('connected', () => {
  console.log('📗 MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.warn('📕 MongoDB disconnected');
});

mongoose.connection.on('error', (err: Error) => {
  console.error('📛 MongoDB connection error:', err.message);
});

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;

  const conn = await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 5000,
  });
  console.log(`Database is connected at ${conn.connection.host}`);
};

export default connectDB;

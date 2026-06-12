import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`Database is connected at ${conn.connection.host}`);
  } catch (error) {
    console.log('Database is not connected');

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

export default connectDB;

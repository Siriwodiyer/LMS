import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db';

let isConnected = false;

export const connectMongoDB = async (): Promise<typeof mongoose> => {
  if (isConnected) {
    return mongoose;
  }

  try {
    console.log(`Connecting to MongoDB Atlas at ${MONGODB_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@')}...`);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      autoIndex: true
    });

    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Successfully connected to database: ${conn.connection.name}`);
    console.log(`🌐 [MongoDB Host] ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Error]', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Disconnected] Lost connection to MongoDB Atlas.');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 [MongoDB Reconnected] Re-established connection to MongoDB Atlas.');
      isConnected = true;
    });

    return conn;
  } catch (error: any) {
    console.error('❌ [MongoDB Atlas Connection Failed]:', error.message);
    console.error('👉 Please make sure MongoDB Atlas Network Access (IP Whitelist) allows your current IP or 0.0.0.0/0.');
    throw error;
  }
};

export const isMongoConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};

export const disconnectMongoDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB Atlas connection closed.');
  }
};

export default connectMongoDB;

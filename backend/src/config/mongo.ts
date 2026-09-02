import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Safely sanitizes MongoDB connection string for console logging so passwords/credentials are never exposed.
 */
export const sanitizeMongoUri = (uri: string): string => {
  if (!uri) return '';
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = '****';
    }
    if (parsed.username) {
      parsed.username = '****';
    }
    return parsed.toString();
  } catch {
    // Regex fallback if URL constructor fails on special characters
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@').replace(/:([^:@]+)@/, ':****@');
  }
};

export const getMongoUri = (): string => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_username>') || uri.includes('<password>') || uri.includes('<username>')) {
    return '';
  }
  return uri;
};

let isConnected = false;

export const connectMongoDB = async (): Promise<any> => {
  if (isConnected) {
    return mongoose;
  }

  const mongoUri = getMongoUri();
  if (!mongoUri) {
    console.warn('⚠️ [MongoDB Config] MONGODB_URI is not set or contains unreplaced template placeholders. Running in local file-backed mode.');
    return mongoose;
  }

  try {
    const maskedUri = sanitizeMongoUri(mongoUri);
    console.log(`Connecting to MongoDB Atlas at ${maskedUri}...`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      autoIndex: true
    });

    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Successfully connected to database: ${conn.connection.name}`);
    console.log(`🌐 [MongoDB Host] ${conn.connection.host}`);

    mongoose.connection.on('error', (err: any) => {
      console.error('❌ [MongoDB Error]', err.message || err);
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
    console.error('❌ [MongoDB Atlas Connection Failed]:', error.message || error);
    console.error('👉 Ensure MONGODB_URI is set correctly and MongoDB Atlas Network Access IP Whitelist includes your server IP (or 0.0.0.0/0).');
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


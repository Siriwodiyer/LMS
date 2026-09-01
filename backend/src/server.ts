import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDB, disconnectMongoDB, isMongoConnected, getMongoUri } from './config/mongo.js';
import { db } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas if URI is valid
    const mongoUri = getMongoUri();
    if (mongoUri) {
      await connectMongoDB();
      // 2. Synchronize memory state with live MongoDB collections
      await db.syncWithMongoDB();
    } else {
      console.warn('⚠️ [MongoDB] MONGODB_URI not configured or using template placeholder; running in local file-backed mode.');
    }
  } catch (err: any) {
    console.error('⚠️ [MongoDB Warning] Server starting with local fallback due to connection error:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 LMS RESTful API Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`🍃 Database: MongoDB Atlas (${isMongoConnected() ? 'CONNECTED' : 'LOCAL FALLBACK'})`);
    console.log(`=======================================================`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} signal received: shutting down server gracefully...`);
    server.close(async () => {
      await disconnectMongoDB();
      console.log('HTTP and MongoDB server connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
};

const serverPromise = startServer();
export default serverPromise;

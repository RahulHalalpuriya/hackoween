import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryInstance = null;

// State holder for database connection
export const dbState = {
  isConnected: false,
  isInMemory: false,
  uri: '',
  serverType: '',
  memoryStore: {
    farmers: [],
    farms: [],
    workers: [],
    tasks: [],
    sensorLogs: [],
    decisionLogs: [],
    callLogs: []
  }
};

/**
 * Connects to MongoDB:
 * 1. Attempts connection to configured MONGODB_URI (e.g. Atlas or local daemon).
 * 2. If unavailable, spins up an embedded MongoMemoryServer automatically so real MongoDB is running.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  mongoose.set('strictQuery', false);

  // Case 1: Custom MongoDB URI (like MongoDB Atlas)
  if (uri && !uri.includes('127.0.0.1:27017') && !uri.includes('localhost:27017')) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      dbState.isConnected = true;
      dbState.isInMemory = false;
      dbState.uri = uri;
      dbState.serverType = 'MongoDB Atlas / Custom URI';
      console.log('✅ [Database] Successfully connected to live MongoDB database!');
      return true;
    } catch (err) {
      console.warn(`⚠️ [Database] Connection to provided MONGODB_URI failed: ${err.message}`);
    }
  }

  // Case 2: Check for local MongoDB daemon on port 27017
  if (uri && (uri.includes('127.0.0.1:27017') || uri.includes('localhost:27017'))) {
    try {
      console.log(`[Database] Checking for running local MongoDB daemon at: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500
      });
      dbState.isConnected = true;
      dbState.isInMemory = false;
      dbState.uri = uri;
      dbState.serverType = 'Local MongoDB Daemon (port 27017)';
      console.log('✅ [Database] Successfully connected to local MongoDB daemon!');
      return true;
    } catch (err) {
      console.log(`ℹ️ [Database] Local MongoDB daemon on 27017 is not running. Starting Embedded Real MongoDB...`);
    }
  }

  // Case 3: Embedded Real MongoDB via mongodb-memory-server
  try {
    console.log('🚀 [Database] Starting Embedded Real MongoDB Server (mongodb-memory-server)...');
    mongoMemoryInstance = await MongoMemoryServer.create({
      instance: {
        dbName: 'kisanai'
      }
    });
    const memoryUri = mongoMemoryInstance.getUri();
    dbState.uri = memoryUri;
    dbState.serverType = 'Embedded MongoDB (mongodb-memory-server)';
    console.log(`📦 [Database] Real MongoDB Server active at: ${memoryUri}`);

    await mongoose.connect(memoryUri);
    dbState.isConnected = true;
    dbState.isInMemory = false; // Real MongoDB queries & collections!
    console.log('✅ [Database] Mongoose connected to Real MongoDB Server!');

    // Graceful cleanup on termination
    const cleanup = async () => {
      try {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
        if (mongoMemoryInstance) {
          await mongoMemoryInstance.stop();
        }
      } catch (e) {
        // quiet shutdown
      }
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    return true;
  } catch (err) {
    console.error(`🚨 [Database] Failed to start Embedded MongoDB: ${err.message}`);
    console.log('🚀 [Database] Activating Resilient In-Memory Smart Store fallback for KisanAI.');
    dbState.isConnected = true;
    dbState.isInMemory = true;
    dbState.serverType = 'In-Memory Smart Store Fallback';
    return false;
  }
}

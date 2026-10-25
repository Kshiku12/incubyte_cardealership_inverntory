import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from './app';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/car_dealership';

async function startServer() {
  try {
    // Attempt connecting to configured MongoDB
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to local/cloud MongoDB successfully.');
    } catch (dbErr) {
      console.warn('⚠️  Could not connect to external MongoDB. Starting standalone embedded MongoMemoryServer for effortless local testing...');
      const memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Connected to Embedded In-Memory MongoDB at: ${memUri}`);
    }

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🏎️  Car Dealership Inventory API Server`);
      console.log(`🚀  API running on: http://localhost:${PORT}`);
      console.log(`🩺  Health check:   http://localhost:${PORT}/api/health`);
      console.log(`🔑  Auth endpoint:  http://localhost:${PORT}/api/auth`);
      console.log(`🚘  Vehicles API:   http://localhost:${PORT}/api/vehicles`);
      console.log(`🤖  AI Concierge:   http://localhost:${PORT}/api/ai/chat`);
      console.log(`📰  Automotive News:http://localhost:${PORT}/api/news`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();

import mongoose from 'mongoose';
import { env } from './environment';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`✅ Connected to MongoDB: ${connection.connection.host}/${connection.connection.name}`);
    return connection;
  } catch (error) {
    logger.error({ error }, '❌ Failed to connect to MongoDB database.');
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('🔌 Disconnected from MongoDB.');
  } catch (error) {
    logger.error({ error }, 'Error while disconnecting from MongoDB.');
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB connection lost. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, '❌ MongoDB connection error:');
});

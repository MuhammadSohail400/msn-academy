import Redis from 'ioredis';
import { env } from './environment';
import { logger } from '../utils/logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('✅ Connected to Redis (Upstash)');
});

redis.on('error', (err) => {
  logger.error({ err: err.message }, '❌ Redis connection error');
});

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    logger.info('🔌 Disconnected from Redis.');
  } catch (error) {
    logger.error({ error }, 'Error while disconnecting from Redis.');
  }
}

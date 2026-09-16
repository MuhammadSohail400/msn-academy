import http from 'http';
import { app } from './app';
import { env } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import { redis, disconnectRedis } from './config/redis';
import { logger } from './utils/logger';

let server: http.Server;

async function bootstrap() {
  try {
    // 1. Connect to Database
    logger.info('Connecting to MongoDB...');
    await connectDatabase();


    // 2. Verify Redis Connection (non-blocking — don't let a dead Redis stop the server)
    logger.info('Connecting to Redis...');
    redis.ping()
      .then(() => logger.info('✅ Redis ping succeeded.'))
      .catch((err) => logger.warn({ err: err.message }, '⚠️ Redis unavailable — continuing without cache.'));

    // 3. Start HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 MSN Academy Backend REST API running at http://localhost:${env.PORT}`);
      logger.info(`🌐 Environment: ${env.NODE_ENV}`);
      logger.info(`🔒 CORS Allowed Origin: ${env.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.fatal({ error }, 'Fatal error during server bootstrap.');
    process.exit(1);
  }
}

// Graceful Shutdown Handlers
async function shutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDatabase();
      await disconnectRedis();
      logger.info('Process terminating gracefully.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection detected.');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught Exception detected.');
  shutdown('UNCAUGHT_EXCEPTION');
});

bootstrap();

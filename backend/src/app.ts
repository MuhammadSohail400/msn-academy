import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/environment';
import { logger } from './utils/logger';
import { ApiResponse } from './utils/ApiResponse';
import { ApiError } from './utils/ApiError';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Security Headers
  app.use(helmet());

  // 2. CORS Whitelist
  app.use(
    cors({
      origin: [env.CORS_ORIGIN, env.CLIENT_URL, 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Client-Timestamp'],
    })
  );

  // 3. Cookie Parser
  app.use(cookieParser(env.COOKIE_SECRET));

  // 4. Request Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 5. HTTP Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        autoLogging: {
          ignore: (req) => req.url === '/api/v1/health',
        },
        customSuccessMessage: (req, res, responseTime) => {
          return `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
        },
        customErrorMessage: (req, res, err) => {
          return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
        },
        serializers: {
          req: (req) => ({
            method: req.method,
            url: req.url,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      })
    );
  }

  // 6. Root & Health Check Endpoints
  app.get('/', (req: Request, res: Response) => {
    res.json(
      ApiResponse.ok({ status: 'active', version: 'v1' }, 'MSN Academy REST API Gateway is running')
    );
  });

  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.json(
      ApiResponse.ok(
        {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.floor(process.uptime()),
          environment: env.NODE_ENV,
        },
        'Health check passed'
      )
    );
  });

  // 7. Route Mounting
  app.use('/api/v1', apiRouter);

  // 8. 404 Catch-All Handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(ApiError.notFound(`Endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`));
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;

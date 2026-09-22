import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment-specific file or fallback to .env
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
// Also fallback load standard .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  MONGO_URI: z.string().default('mongodb://127.0.0.1:27017/msn_academy'),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('msn_super_secret_jwt_access_token_key_32chars!'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters').default('msn_super_secret_jwt_refresh_token_key_32chars!'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET must be at least 16 characters').default('msn_cookie_signing_secret_key_32chars!'),
  PAYMENT_WEBHOOK_SECRET: z.string().default('msn_webhook_secret_key_default_32chars!'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('MSN Academy <onboarding@resend.dev>'),
  ADMIN_EMAIL: z.string().default('admissions@msnacademy.pk'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('465').transform((val) => parseInt(val, 10)),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid Environment Variables Configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type Environment = z.infer<typeof environmentSchema>;

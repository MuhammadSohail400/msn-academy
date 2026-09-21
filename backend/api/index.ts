import { Request, Response } from 'express';
import { app } from '../src/app';
import { connectDatabase } from '../src/config/database';
import mongoose from 'mongoose';

// Cache database connection across serverless invocations
let isConnected = false;

async function ensureDatabaseConnected() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await connectDatabase();
    isConnected = true;
  } catch (error) {
    console.error('Failed to connect to MongoDB in serverless execution:', error);
  }
}

export default async function handler(req: Request, res: Response) {
  await ensureDatabaseConnected();
  return app(req, res);
}

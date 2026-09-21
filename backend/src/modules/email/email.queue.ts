import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';
import { emailService } from './email.service';
import { SendEmailOptions, EmailJobData } from './email.types';

const EMAIL_QUEUE_NAME = 'email-dispatch-queue';

// BullMQ Queue instance
export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
  connection: redis as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5s, 10s, 20s
    },
    removeOnComplete: 100, // keep latest 100 jobs
    removeOnFail: 200,
  },
});

// BullMQ Worker to process background emails
export const emailWorker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job: Job<EmailJobData>) => {
    logger.info({ jobId: job.id, jobType: job.data.jobType }, '⚙️ Processing background email job');
    const result = await emailService.sendEmail(job.data.options);
    if (!result.success) {
      throw new Error(result.error || 'Failed to dispatch email via provider');
    }
    return result;
  },
  {
    connection: redis as any,
    concurrency: 5,
  }
);

emailWorker.on('completed', (job) => {
  logger.info({ jobId: job.id, jobType: job.data.jobType }, '🎉 Email job completed successfully');
});

emailWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, jobType: job?.data?.jobType, err: err.message }, '❌ Email job failed');
});

/**
 * Enqueues an email for asynchronous background dispatch.
 * Falls back to direct in-process sending if Redis is temporarily unreachable.
 */
export async function queueEmail(jobType: EmailJobData['jobType'], options: SendEmailOptions): Promise<void> {
  try {
    if (redis.status === 'ready' || redis.status === 'connect') {
      await emailQueue.add(jobType, { jobType, options });
      logger.info({ jobType, to: options.to }, '📥 Email job enqueued in BullMQ');
      return;
    }
  } catch (err: any) {
    logger.warn({ err: err.message }, '⚠️ Redis queue unavailable. Falling back to direct email dispatch');
  }

  // Graceful fallback: send directly without queue
  await emailService.sendEmail(options);
}

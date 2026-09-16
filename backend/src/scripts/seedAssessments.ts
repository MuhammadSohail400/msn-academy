import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Course } from '../modules/courses/course.model';
import { Assessment } from '../modules/assessments/assessment.model';
import { logger } from '../utils/logger';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

type QuestionSeed = {
  questionNumber: number;
  questionText: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
};

const sampleQuestions: QuestionSeed[] = [
  {
    questionNumber: 1,
    questionText: 'Which HTML5 semantic element should be used to wrap the primary navigation links of a website?',
    options: [
      { key: 'A', text: '<section>' },
      { key: 'B', text: '<nav>' },
      { key: 'C', text: '<header>' },
      { key: 'D', text: '<aside>' },
    ],
    correctOptionKey: 'B',
  },
  {
    questionNumber: 2,
    questionText: 'In modern JavaScript (ES6+), what is the primary distinction between "let" and "const"?',
    options: [
      { key: 'A', text: '"const" cannot be reassigned after declaration, while "let" can be reassigned.' },
      { key: 'B', text: '"let" has global scope, whereas "const" has function scope.' },
      { key: 'C', text: '"const" only holds primitive numbers, while "let" holds objects.' },
      { key: 'D', text: '"let" variables are hoisted to the top, while "const" is never hoisted.' },
    ],
    correctOptionKey: 'A',
  },
  {
    questionNumber: 3,
    questionText: 'Which React hook is designed specifically for executing side effects such as data fetching or subscriptions?',
    options: [
      { key: 'A', text: 'useState' },
      { key: 'B', text: 'useContext' },
      { key: 'C', text: 'useEffect' },
      { key: 'D', text: 'useMemo' },
    ],
    correctOptionKey: 'C',
  },
  {
    questionNumber: 4,
    questionText: 'What HTTP status code is officially returned by REST APIs to represent unauthorized access due to missing or invalid credentials?',
    options: [
      { key: 'A', text: '400 Bad Request' },
      { key: 'B', text: '401 Unauthorized' },
      { key: 'C', text: '403 Forbidden' },
      { key: 'D', text: '404 Not Found' },
    ],
    correctOptionKey: 'B',
  },
  {
    questionNumber: 5,
    questionText: 'In MongoDB, what index type should be created on fields that are frequently queried together to accelerate filter performance?',
    options: [
      { key: 'A', text: 'Text Index' },
      { key: 'B', text: 'Compound Index' },
      { key: 'C', text: 'Geospatial Index' },
      { key: 'D', text: 'Wildcard Index' },
    ],
    correctOptionKey: 'B',
  },
  {
    questionNumber: 6,
    questionText: 'When designing a mobile-first responsive layout with CSS Grid, which CSS function creates repeated auto-fitting columns?',
    options: [
      { key: 'A', text: 'repeat(auto-fit, minmax(250px, 1fr))' },
      { key: 'B', text: 'flex-wrap: wrap' },
      { key: 'C', text: 'column-count: auto' },
      { key: 'D', text: 'grid-template-areas: auto' },
    ],
    correctOptionKey: 'A',
  },
  {
    questionNumber: 7,
    questionText: 'Which Node.js architectural mechanism allows executing asynchronous I/O operations without blocking the main execution thread?',
    options: [
      { key: 'A', text: 'Multi-threaded Garbage Collector' },
      { key: 'B', text: 'Event Loop & libuv thread pool' },
      { key: 'C', text: 'Synchronous blocking wait' },
      { key: 'D', text: 'Virtual DOM reconciliation' },
    ],
    correctOptionKey: 'B',
  },
  {
    questionNumber: 8,
    questionText: 'What security flag must be configured on HTTP cookies to prevent client-side JavaScript access and mitigate XSS token theft?',
    options: [
      { key: 'A', text: 'Secure=true' },
      { key: 'B', text: 'HttpOnly=true' },
      { key: 'C', text: 'SameSite=none' },
      { key: 'D', text: 'Domain=localhost' },
    ],
    correctOptionKey: 'B',
  },
  {
    questionNumber: 9,
    questionText: 'In professional international freelancing (Upwork/Fiverr), what is the most effective strategy to secure high-ticket clients?',
    options: [
      { key: 'A', text: 'Sending generic copy-pasted proposals to hundreds of jobs daily' },
      { key: 'B', text: 'Offering the absolute lowest price below minimum wage' },
      { key: 'C', text: 'Crafting tailored video audits and addressing the client specific business bottleneck' },
      { key: 'D', text: 'Using automated proposal bidding bots' },
    ],
    correctOptionKey: 'C',
  },
  {
    questionNumber: 10,
    questionText: 'In UX architecture, what does the term "Affordance" refer to?',
    options: [
      { key: 'A', text: 'The visual cues that indicate how an interface element should be interacted with' },
      { key: 'B', text: 'The financial subscription cost of using design tools' },
      { key: 'C', text: 'The page load time in milliseconds' },
      { key: 'D', text: 'The color contrast ratio according to WCAG' },
    ],
    correctOptionKey: 'A',
  },
];

async function seedAssessments() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    logger.error('MONGO_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB Atlas for Assessment Seeding.');

    const courses = await Course.find({ isDeleted: { $ne: true } });
    if (courses.length === 0) {
      logger.warn('No courses found in database to attach assessments.');
      process.exit(0);
    }

    let seededCount = 0;

    for (const course of courses) {
      const existing = await Assessment.findOne({ courseId: course._id });
      if (!existing) {
        await Assessment.create({
          courseId: course._id,
          title: `Final Certification Assessment: ${course.title}`,
          passMarkPercentage: 70,
          timeLimitMinutes: 120,
          maxAttempts: null,
          questionType: 'MCQ_ONLY',
          questions: sampleQuestions,
          status: 'ACTIVE',
        });
        seededCount++;
        logger.info(`✅ Created 10-MCQ Assessment for "${course.title}"`);
      } else {
        // Ensure active status and 10 questions
        existing.status = 'ACTIVE';
        existing.questions = sampleQuestions as any;
        await existing.save();
        logger.info(`ℹ️ Updated Assessment for "${course.title}"`);
      }
    }

    logger.info(
      `🎉 Assessment Seeding Completed. Seeded/Updated assessments for ${courses.length} courses.`
    );
  } catch (error) {
    logger.error({ error }, '❌ Error seeding assessments');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB Atlas.');
    process.exit(0);
  }
}

seedAssessments();

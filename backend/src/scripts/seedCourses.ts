import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Course } from '../modules/courses/course.model';
import { logger } from '../utils/logger';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sampleCourses = [
  {
    title: 'Professional Web Development Bootcamp',
    slug: 'professional-web-development-bootcamp',
    subtitle: 'Master HTML5, CSS3, JavaScript, React 19, Node.js, and MongoDB from scratch in Urdu & English.',
    description:
      'A comprehensive, industry-aligned full stack web development program engineered specifically for Pakistani aspiring software developers. From basic web fundamentals to building production-grade SaaS platforms.',
    category: 'Web Development',
    level: 'Beginner',
    badge: 'Bestseller',
    language: 'Urdu / English',
    price: 8500,
    originalPrice: 12000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationHours: 48,
    totalLectures: 85,
    enrolledStudentsCount: 340,
    averageRating: 4.9,
    totalReviews: 128,
    instructor: {
      name: 'Engr. Muhammad Saad',
      title: 'Senior Solutions Architect & Lead Instructor',
      bio: 'Ex-Silicon Valley consultant with 10+ years architecting enterprise distributed software systems.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Architect and build modern responsive web applications using React and Next.js',
      'Design and deploy robust RESTful APIs in Node.js and Express',
      'Implement authentication, JWT, cookies, and RBAC role-based authorization',
      'Model and optimize MongoDB databases with compound indexing',
      'Deploy full-stack applications with custom domains and SSL',
    ],
    prerequisites: [
      'Basic computer literacy and internet access',
      'No prior programming knowledge required — starts from ground zero',
    ],
    modules: [
      {
        title: 'Module 1: Web Fundamentals & Modern Architecture',
        order: 1,
        totalDurationMinutes: 180,
        lectures: [
          {
            title: 'How the Web Works: DNS, HTTP/HTTPS, Browsers & Servers',
            order: 1,
            durationMinutes: 25,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Foundational introduction to modern internet protocols, client-server communication, and browser rendering engines.',
            keyTopics: ['DNS Resolution', 'HTTP Request/Response Cycle', 'Status Codes', 'Browser DevTools'],
            resources: [
              { title: 'Web Architecture Cheatsheet.pdf', fileUrl: 'https://example.com/docs/cheatsheet.pdf', fileSize: '1.2 MB', fileType: 'pdf' },
            ],
          },
          {
            title: 'Setting Up Your Professional Developer Environment',
            order: 2,
            durationMinutes: 35,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Complete walkthrough of installing VS Code, Node.js, Git, GitHub SSH keys, and essential extensions.',
            keyTopics: ['VS Code Extensions', 'Terminal Basics', 'Git Configuration'],
            resources: [],
          },
        ],
      },
      {
        title: 'Module 2: React 19 Frontend Engineering',
        order: 2,
        totalDurationMinutes: 240,
        lectures: [
          {
            title: 'Modern Component Architecture & State Management',
            order: 1,
            durationMinutes: 45,
            isPreview: false,
            videoStreamUrl: null,
            description: 'Deep dive into functional components, hooks, props drilling vs Redux Toolkit.',
            keyTopics: ['React Hooks', 'State Management', 'Component Lifecycle'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    title: 'Applied Data Analytics with Power BI & Python',
    slug: 'applied-data-analytics-power-bi',
    subtitle: 'Extract, clean, transform, and visualize actionable commercial insights using Power BI, SQL, and Python.',
    description:
      'Become a job-ready Data Analyst. Learn to connect corporate databases, build automated executive dashboards, and drive strategic decision-making for domestic and international enterprises.',
    category: 'Data Science',
    level: 'Intermediate',
    badge: 'Job Ready',
    language: 'Urdu / English',
    price: 12000,
    originalPrice: 16000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationHours: 36,
    totalLectures: 64,
    enrolledStudentsCount: 280,
    averageRating: 4.8,
    totalReviews: 94,
    instructor: {
      name: 'Dr. Hamza Tariq',
      title: 'Head of Analytics & Business Intelligence',
      bio: 'Ph.D. in Computational Statistics with 8+ years leading enterprise BI transformations.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Write advanced SQL queries for data aggregation and multi-table joins',
      'Master Power BI DAX formulas, data modeling, and relationship management',
      'Build dynamic, interactive executive KPI dashboards',
      'Automate data cleaning pipelines with Python Pandas and NumPy',
    ],
    prerequisites: ['Basic understanding of Microsoft Excel spreadsheets'],
    modules: [
      {
        title: 'Module 1: Relational Data & SQL Mastery',
        order: 1,
        totalDurationMinutes: 200,
        lectures: [
          {
            title: 'Database Architecture & Query Fundamentals',
            order: 1,
            durationMinutes: 30,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Understanding relational tables, primary keys, foreign keys, and SELECT statements.',
            keyTopics: ['Relational Model', 'Filtering with WHERE', 'Sorting with ORDER BY'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    title: 'Generative AI & Prompt Engineering Mastery',
    slug: 'artificial-intelligence-prompt-engineering',
    subtitle: 'Leverage LLMs, ChatGPT, Claude, Midjourney, and LangChain to automate business workflows.',
    description:
      'Unlock the full potential of Generative Artificial Intelligence. Learn structured prompt design, autonomous AI agents, LangChain development, and integrating OpenAI APIs into modern web products.',
    category: 'Artificial Intelligence',
    level: 'Beginner',
    badge: 'Bestseller',
    language: 'Urdu / English',
    price: 15000,
    originalPrice: 20000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    durationHours: 32,
    totalLectures: 52,
    enrolledStudentsCount: 420,
    averageRating: 5.0,
    totalReviews: 180,
    instructor: {
      name: 'Syed Usman Ali',
      title: 'AI Automation Consultant & Researcher',
      bio: 'Machine learning practitioner specializing in enterprise LLM deployments and agentic systems.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Master Few-Shot, Chain-of-Thought, and ReAct prompt engineering patterns',
      'Build custom GPTs and autonomous AI customer support agents',
      'Connect LLM APIs with Python to automate repetitive data tasks',
      'Deploy Retrieval-Augmented Generation (RAG) vector pipelines',
    ],
    prerequisites: ['Curiosity and desire to integrate AI tools into daily workflows'],
    modules: [
      {
        title: 'Module 1: Foundations of Large Language Models',
        order: 1,
        totalDurationMinutes: 150,
        lectures: [
          {
            title: 'How LLMs Work Under the Hood: Tokens, Embeddings & Context Windows',
            order: 1,
            durationMinutes: 28,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Clear, non-technical explanation of transformer neural networks, attention mechanisms, and token limits.',
            keyTopics: ['Tokenization', 'Attention Mechanism', 'Temperature & Top-P'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    title: 'UI/UX Design Masterclass with Figma',
    slug: 'ui-ux-design-figma-masterclass',
    subtitle: 'Design world-class web and mobile interfaces, design systems, and clickable prototypes in Figma.',
    description:
      'Learn the end-to-end product design cycle: User research, wireframing, typography, color harmony, responsive auto-layout, micro-interactions, and building production-ready Figma design systems.',
    category: 'Design',
    level: 'Beginner',
    badge: 'Design',
    language: 'Urdu / English',
    price: 7500,
    originalPrice: 10000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    durationHours: 28,
    totalLectures: 45,
    enrolledStudentsCount: 190,
    averageRating: 4.7,
    totalReviews: 62,
    instructor: {
      name: 'Ayesha Siddiqui',
      title: 'Lead Product Designer',
      bio: 'Award-winning UI/UX designer with 7+ years crafting fintech and edtech digital experiences.',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Design responsive websites and native mobile application interfaces in Figma',
      'Create and maintain scalable multi-brand design systems and UI component kits',
      'Build realistic interactive clickable prototypes with smart animations',
      'Conduct usability tests and developer design handoffs',
    ],
    prerequisites: ['A laptop with web browser and free Figma account'],
    modules: [
      {
        title: 'Module 1: Principles of Modern Digital UI Design',
        order: 1,
        totalDurationMinutes: 140,
        lectures: [
          {
            title: 'Visual Hierarchy, Typography Scales & Color Theory',
            order: 1,
            durationMinutes: 24,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Mastering visual contrast, font pairing, and 60-30-10 color distribution in software UI.',
            keyTopics: ['Typography Systems', 'Contrast Ratios', 'Spacing Grids'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    title: 'Digital Marketing & Growth Hacking Mastery',
    slug: 'digital-marketing-growth-hacking',
    subtitle: 'Scale brand reach, run profitable Meta/TikTok ad campaigns, and master technical SEO.',
    description:
      'The complete modern marketing playbook tailored for the Pakistani commercial landscape. Learn paid advertising on Meta and TikTok, conversion rate optimization, content funnels, and technical SEO.',
    category: 'Marketing',
    level: 'All Levels',
    badge: 'Advanced',
    language: 'Urdu / English',
    price: 6000,
    originalPrice: 9000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    durationHours: 24,
    totalLectures: 38,
    enrolledStudentsCount: 160,
    averageRating: 4.8,
    totalReviews: 50,
    instructor: {
      name: 'Kashif Mehmood',
      title: 'Growth Marketing Director',
      bio: 'Managed over $2M in digital advertising spend across e-commerce and B2B SaaS ventures.',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Setup and manage high-ROI ad campaigns on Meta Ads Manager and TikTok',
      'Optimize sales funnels and implement pixel tracking with event deduplication',
      'Perform keyword research, on-page optimization, and backlink outreach',
      'Analyze customer acquisition costs (CAC) and customer lifetime value (LTV)',
    ],
    prerequisites: ['Basic familiarity with social media platforms'],
    modules: [
      {
        title: 'Module 1: The Modern Performance Marketing Funnel',
        order: 1,
        totalDurationMinutes: 120,
        lectures: [
          {
            title: 'Understanding Customer Journey: TOFU, MOFU, and BOFU',
            order: 1,
            durationMinutes: 20,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            description: 'Mapping awareness, consideration, conversion, and retention touchpoints.',
            keyTopics: ['Marketing Funnels', 'Targeting Audiences', 'Attribution Models'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
  {
    title: 'Freelancing & Global Client Acquisition',
    slug: 'freelancing-client-acquisition-mastery',
    subtitle: 'Win high-ticket international clients on Upwork, LinkedIn, and direct cold outreach.',
    description:
      'Stop bidding on low-paying gigs. Discover the proven system for winning $1,000+ contracts on Upwork, optimizing your professional LinkedIn presence, handling foreign remittances safely in Pakistan, and building lasting client relationships.',
    category: 'Productivity',
    level: 'All Levels',
    badge: 'Bestseller',
    language: 'Urdu / English',
    price: 5000,
    originalPrice: 8000,
    currency: 'PKR',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    durationHours: 20,
    totalLectures: 30,
    enrolledStudentsCount: 510,
    averageRating: 4.9,
    totalReviews: 240,
    instructor: {
      name: 'M. Suleman Naqvi',
      title: 'Founder & Top-Rated Plus Freelancer',
      bio: 'Upwork Top-Rated Plus consultant with over $250k+ in client billings and 100% job success score.',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    },
    learningOutcomes: [
      'Craft high-converting, personalized Upwork proposals that get interviews',
      'Optimize LinkedIn profile for inbound international job opportunities',
      'Negotiate value-based pricing instead of hourly race-to-the-bottom rates',
      'Setup Payoneer, Wise, and bank wire transfers seamlessly in Pakistan',
    ],
    prerequisites: ['A marketable skill (coding, design, writing, or marketing)'],
    modules: [
      {
        title: 'Module 1: Positioning as a High-Value Specialist',
        order: 1,
        totalDurationMinutes: 110,
        lectures: [
          {
            title: 'Generalist vs Specialist: How to Stand Out in Global Markets',
            order: 1,
            durationMinutes: 22,
            isPreview: true,
            videoStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            description: 'Why clients pay 5x more for niche problem solvers and how to position your service profile.',
            keyTopics: ['Niche Specialization', 'Portfolio Proof', 'Client Psychology'],
            resources: [],
          },
        ],
      },
    ],
    status: 'PUBLISHED',
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);

    logger.info('Syncing indexes and dropping legacy text indexes...');
    await Course.collection.dropIndexes().catch(() => {});
    await Course.syncIndexes();

    logger.info('Purging existing sample courses...');
    await Course.deleteMany({
      slug: { $in: sampleCourses.map((c) => c.slug) },
    });

    logger.info(`Inserting ${sampleCourses.length} comprehensive vocational courses...`);
    await Course.insertMany(sampleCourses);

    logger.info('✅ Successfully seeded 6 courses across all categories!');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Seeding failed:');
    process.exit(1);
  }
}

seed();

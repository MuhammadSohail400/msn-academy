import { Course, ICourse } from './course.model';
import { GetCoursesQuery } from './course.validation';
import { ApiError } from '../../utils/ApiError';
import { redis } from '../../config/redis';
import { logger } from '../../utils/logger';

export interface PaginatedCoursesResult {
  courses: Record<string, unknown>[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CategorySummary {
  name: string;
  slug: string;
  courseCount: number;
}

const CATEGORIES_CACHE_KEY = 'msn:catalog:categories:v1';
const CATEGORIES_CACHE_TTL_SEC = 900; // 15 minutes

export class CourseService {
  /**
   * Retrieves paginated, filtered, and sorted courses.
   */
  public static async getCourses(query: GetCoursesQuery): Promise<PaginatedCoursesResult> {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    // 1. Build Filter Query
    const filter: Record<string, unknown> = {
      status: 'PUBLISHED',
      isDeleted: { $ne: true },
    };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.level) {
      filter.level = query.level;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    // 2. Build Sort Query
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
    switch (query.sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { enrolledStudentsCount: -1 };
        break;
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // 3. Execute Parallel Count & Fetch
    const [total, rawCourses] = await Promise.all([
      Course.countDocuments(filter),
      Course.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select(
          '_id title slug subtitle category level badge price originalPrice currency thumbnail durationHours totalLectures averageRating totalReviews instructor'
        )
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    // 4. Format Catalog Card Output according to frozen contract
    const formattedCourses = rawCourses.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle,
      category: c.category,
      level: c.level,
      badge: c.badge || null,
      price: c.price,
      originalPrice: c.originalPrice || null,
      currency: c.currency,
      thumbnail: c.thumbnail,
      durationHours: c.durationHours,
      totalLectures: c.totalLectures,
      averageRating: c.averageRating,
      totalReviews: c.totalReviews,
      instructor: {
        name: c.instructor.name,
        title: c.instructor.title,
      },
    }));

    return {
      courses: formattedCourses,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Fetches full course details by human-readable slug.
   */
  public static async getCourseBySlug(slug: string, userId?: string): Promise<Record<string, unknown>> {
    const course = await Course.findOne({
      slug,
      status: { $in: ['PUBLISHED', 'COMING_SOON'] },
      isDeleted: { $ne: true },
    }).lean();

    if (!course) {
      throw ApiError.notFound('Course with specified slug not found');
    }

    // Determine if student is enrolled (placeholder for Phase 4 enrollment integration)
    const isEnrolled = false;

    // Sanitize modules and lectures: Non-preview video streaming URLs are shielded
    const sanitizedModules = (course.modules || []).map((mod) => ({
      id: mod._id ? mod._id.toString() : `mod-${mod.order}`,
      title: mod.title,
      order: mod.order,
      totalDurationMinutes: mod.totalDurationMinutes,
      lectures: (mod.lectures || []).map((lec) => ({
        id: lec._id ? lec._id.toString() : `lec-${lec.order}`,
        title: lec.title,
        order: lec.order,
        durationMinutes: lec.durationMinutes,
        isPreview: lec.isPreview,
        // Only provide video stream URL if lecture is explicitly a free preview or user is enrolled
        ...(lec.isPreview || isEnrolled ? { videoStreamUrl: lec.videoStreamUrl } : {}),
      })),
    }));

    return {
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      description: course.description,
      category: course.category,
      level: course.level,
      language: course.language,
      price: course.price,
      originalPrice: course.originalPrice || null,
      currency: course.currency,
      thumbnail: course.thumbnail,
      previewVideoUrl: course.previewVideoUrl || null,
      durationHours: course.durationHours,
      totalLectures: course.totalLectures,
      averageRating: course.averageRating,
      learningOutcomes: course.learningOutcomes || [],
      prerequisites: course.prerequisites || [],
      modules: sanitizedModules,
      isEnrolled,
    };
  }

  /**
   * Lightweight hierarchical syllabus tree for mobile & accordion view.
   */
  public static async getCourseSyllabus(courseId: string): Promise<Record<string, unknown>> {
    const course = await Course.findOne({
      _id: courseId,
      isDeleted: { $ne: true },
    })
      .select('_id title modules')
      .lean();

    if (!course) {
      throw ApiError.notFound('Course does not exist');
    }

    let totalLecturesCount = 0;
    const formattedModules = (course.modules || []).map((mod) => {
      totalLecturesCount += mod.lectures?.length || 0;
      return {
        id: mod._id ? mod._id.toString() : `mod-${mod.order}`,
        title: mod.title,
        order: mod.order,
        lectures: (mod.lectures || []).map((lec) => ({
          id: lec._id ? lec._id.toString() : `lec-${lec.order}`,
          title: lec.title,
          durationMinutes: lec.durationMinutes,
          isPreview: lec.isPreview,
        })),
      };
    });

    return {
      courseId: course._id.toString(),
      courseTitle: course.title,
      totalModules: formattedModules.length,
      totalLectures: totalLecturesCount,
      modules: formattedModules,
    };
  }

  /**
   * Aggregates course categories and counts, cached with Redis.
   */
  public static async getCategories(): Promise<CategorySummary[]> {
    // 1. Check Redis Cache
    try {
      const cached = await redis.get(CATEGORIES_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached) as CategorySummary[];
      }
    } catch (err) {
      logger.warn({ err }, 'Redis cache lookup failed for categories. Falling back to DB.');
    }

    // 2. Aggregate from MongoDB
    const aggregation = await Course.aggregate<{ _id: string; courseCount: number }>([
      { $match: { status: 'PUBLISHED', isDeleted: { $ne: true } } },
      { $group: { _id: '$category', courseCount: { $sum: 1 } } },
      { $sort: { courseCount: -1 } },
    ]);

    const standardCategories = [
      'Web Development',
      'Artificial Intelligence',
      'Data Science',
      'Design',
      'Marketing',
      'Productivity',
    ];

    const categoryMap = new Map<string, number>();
    standardCategories.forEach((cat) => categoryMap.set(cat, 0));
    aggregation.forEach((item) => categoryMap.set(item._id, item.courseCount));

    const result: CategorySummary[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      courseCount: count,
    }));

    // 3. Populate Redis Cache
    try {
      await redis.setex(CATEGORIES_CACHE_KEY, CATEGORIES_CACHE_TTL_SEC, JSON.stringify(result));
    } catch (err) {
      logger.warn({ err }, 'Failed to cache categories in Redis.');
    }

    return result;
  }
}

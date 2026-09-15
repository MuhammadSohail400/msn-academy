import { mockEnrolledCourses, mockStudentProfile } from '../data/mockCourses';

class LearningService {
  async getEnrolledCourses() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockEnrolledCourses });
      }, 150);
    });
  }

  async getCourseOverview(courseId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = mockEnrolledCourses.find(c => c.id === courseId) || mockEnrolledCourses[0];
        resolve({ success: true, data: course });
      }, 150);
    });
  }

  async getLessonDetails(courseId, lessonId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const course = mockEnrolledCourses.find(c => c.id === courseId) || mockEnrolledCourses[0];
        let foundLesson = null;
        let foundModule = null;

        for (const mod of course.modules) {
          const l = mod.lessons.find(item => item.id === lessonId);
          if (l) {
            foundLesson = l;
            foundModule = mod;
            break;
          }
        }

        if (!foundLesson && course.modules[0]?.lessons[0]) {
          foundLesson = course.modules[0].lessons[0];
          foundModule = course.modules[0];
        }

        resolve({
          success: true,
          data: {
            courseTitle: course.title,
            courseId: course.id,
            module: foundModule,
            lesson: foundLesson,
            allModules: course.modules,
            progress: course.progress
          }
        });
      }, 150);
    });
  }

  async toggleLessonComplete(courseId, lessonId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Lesson completion state updated" });
      }, 150);
    });
  }

  async getStudentProfile() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockStudentProfile });
      }, 100);
    });
  }
}

export const learningService = new LearningService();
export default learningService;

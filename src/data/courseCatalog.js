import {
  getStoredCourses,
  addStoredCourse,
  updateStoredCourse,
  deleteStoredCourse,
  getStoredCourseById,
} from './courseStorage.js';

export function normalizeCourse(course) {
  if (!course) return null;
  return {
    ...course,
    id: String(course.id),
    title: course.title || 'Untitled course',
    description: course.description || '',
    category: course.category || 'Uncategorized',
    instructor: course.instructor || 'Staff Instructor',
    status: course.status || 'Published',
    studentsCount: course.studentsCount ?? course.students ?? 0,
    lessonsCount: course.lessonsCount ?? course.lessons ?? 0,
    duration: course.duration || '20 hours',
    level: course.level || 'All Levels',
    image: course.image || 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop',
    price: course.price || 'Free',
  };
}

/**
 * Returns ALL catalog courses (both Published and Draft) for management views.
 */
export function getAllCatalogCourses() {
  return getStoredCourses().map(normalizeCourse);
}

/**
 * Returns only Published courses for public catalog, search, and student browsing.
 */
export function getCatalogCourses() {
  return getAllCatalogCourses().filter((course) => course.status === 'Published');
}

/**
 * Retrieves a course by ID from the shared catalog.
 */
export function getCatalogCourseById(courseId) {
  const course = getStoredCourseById(courseId);
  return course ? normalizeCourse(course) : null;
}

/**
 * Adds a new course to the shared catalog.
 */
export function addCatalogCourse(courseData) {
  return addStoredCourse(courseData);
}

/**
 * Updates an existing course in the shared catalog, preserving ID, syllabus, and other metadata.
 */
export function updateCatalogCourse(courseId, updatedData) {
  return updateStoredCourse(courseId, updatedData);
}

/**
 * Deletes a course from the shared catalog.
 */
export function deleteCatalogCourse(courseId) {
  return deleteStoredCourse(courseId);
}

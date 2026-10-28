import { coursesData } from './coursesData.js';
import { getStoredCourses } from './courseStorage.js';

export function normalizeCourse(course) {
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
  };
}

export function getCatalogCourses() {
  const merged = new Map(coursesData.map((course) => [course.id, normalizeCourse(course)]));

  getStoredCourses()
    .filter((course) => course.status === 'Published')
    .forEach((course) => merged.set(course.id, normalizeCourse(course)));

  return Array.from(merged.values());
}

export function getCatalogCourseById(courseId) {
  const publishedMatch = getCatalogCourses().find((course) => course.id === courseId);
  if (publishedMatch) return publishedMatch;

  const storedMatch = getStoredCourses().find((course) => course.id === courseId);
  return storedMatch ? normalizeCourse(storedMatch) : null;
}

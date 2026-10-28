import { coursesData } from './coursesData.js';

const STORAGE_KEY = 'instructor_courses';
const CATEGORIES_STORAGE_KEY = 'course_categories';
const DELETED_COURSES_KEY = 'lms_deleted_course_ids';

export const initialCategories = [
  'Web Development',
  'Computer Science',
  'Cloud & DevOps',
  'Design',
  'Data Science & AI',
  'Mobile Apps',
];

export const COURSE_CATEGORIES = initialCategories;

export const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
];

export const initialInstructorCourses = [
  {
    id: 'web-dev',
    title: 'Web Development (Full Stack)',
    instructor: 'Dr. Sarah Khan',
    category: 'Web Development',
    studentsCount: 34,
    lessonsCount: 12,
    duration: '38 hours',
    level: 'Beginner to Advanced',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop',
    description: 'Master modern web development from ground up. Learn React, Node.js, TypeScript, and modern deployment pipelines.',
    createdAt: '2026-01-15',
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    instructor: 'Prof. Amit Verma',
    category: 'Computer Science',
    studentsCount: 28,
    lessonsCount: 10,
    duration: '24 hours',
    level: 'Intermediate',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    description: 'Master core data structures and algorithmic complexity for high performance systems and technical interviews.',
    createdAt: '2026-02-10',
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing & DevOps',
    instructor: 'Dr. Neha Gupta',
    category: 'Cloud & DevOps',
    studentsCount: 21,
    lessonsCount: 8,
    duration: '20 hours',
    level: 'Intermediate',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
    description: 'Comprehensive introduction to cloud infrastructure, containerization with Docker, and automated deployment.',
    createdAt: '2026-03-01',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Masterclass',
    instructor: 'Marcus Chen',
    category: 'Design',
    studentsCount: 45,
    lessonsCount: 14,
    duration: '24 hours',
    level: 'All Levels',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
    description: 'Learn to design world-class user interfaces in Figma, create robust scalable design systems, and craft intuitive digital experiences.',
    createdAt: '2026-03-12',
  },
];

function normalizeInitialCourse(course) {
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
    image: course.image || PRESET_IMAGES[0],
    createdAt: course.createdAt || '2026-01-01',
  };
}

const initialCombinedMap = new Map();
coursesData.forEach((c) => initialCombinedMap.set(String(c.id), normalizeInitialCourse(c)));
initialInstructorCourses.forEach((c) => initialCombinedMap.set(String(c.id), normalizeInitialCourse(c)));
export const initialAllCourses = Array.from(initialCombinedMap.values());

// ========================
// CATEGORIES STORAGE UTILITIES
// ========================

export function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
      return initialCategories;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
    return initialCategories;
  } catch {
    return initialCategories;
  }
}

export function saveStoredCategories(categories) {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('course_categories_updated'));
  } catch (error) {
    void error;
  }
}

export function addStoredCategory(categoryName) {
  const trimmed = String(categoryName || '').trim();
  if (!trimmed) {
    return { ok: false, error: 'Category name cannot be empty.' };
  }
  const current = getStoredCategories();
  const isDuplicate = current.some((cat) => cat.trim().toLowerCase() === trimmed.toLowerCase());
  if (isDuplicate) {
    return { ok: false, error: `Category "${trimmed}" already exists.` };
  }
  const updated = [...current, trimmed];
  saveStoredCategories(updated);
  return { ok: true, category: trimmed, categories: updated };
}

export function updateStoredCategory(oldName, newName) {
  const trimmedOld = String(oldName || '').trim();
  const trimmedNew = String(newName || '').trim();
  if (!trimmedNew) {
    return { ok: false, error: 'Category name cannot be empty.' };
  }
  const current = getStoredCategories();
  const isDuplicate = current.some(
    (cat) => cat.trim().toLowerCase() === trimmedNew.toLowerCase() && cat.trim().toLowerCase() !== trimmedOld.toLowerCase()
  );
  if (isDuplicate) {
    return { ok: false, error: `Category "${trimmedNew}" already exists.` };
  }
  const updated = current.map((cat) => (cat.trim().toLowerCase() === trimmedOld.toLowerCase() ? trimmedNew : cat));
  saveStoredCategories(updated);

  // Cascade category rename to courses in storage
  const courses = getStoredCourses();
  let changed = false;
  const updatedCourses = courses.map((course) => {
    if (course.category && course.category.trim().toLowerCase() === trimmedOld.toLowerCase()) {
      changed = true;
      return { ...course, category: trimmedNew };
    }
    return course;
  });
  if (changed) {
    saveStoredCourses(updatedCourses);
  }

  return { ok: true, oldName: trimmedOld, newName: trimmedNew, categories: updated };
}

export function deleteStoredCategory(categoryName) {
  const trimmed = String(categoryName || '').trim();
  const courses = getStoredCourses();
  const inUseCourses = courses.filter(
    (c) => c.category && c.category.trim().toLowerCase() === trimmed.toLowerCase()
  );
  if (inUseCourses.length > 0) {
    return {
      ok: false,
      error: `Cannot delete category "${trimmed}": it is currently in use by ${inUseCourses.length} course(s).`,
      inUseCount: inUseCourses.length,
    };
  }
  const current = getStoredCategories();
  const updated = current.filter((cat) => cat.trim().toLowerCase() !== trimmed.toLowerCase());
  saveStoredCategories(updated);
  return { ok: true, categories: updated };
}

// ========================
// DELETED COURSES TRACKING
// ========================

export function getDeletedCourseIds() {
  try {
    const raw = localStorage.getItem(DELETED_COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markCourseDeleted(courseId) {
  try {
    const deleted = getDeletedCourseIds();
    const idStr = String(courseId);
    if (!deleted.includes(idStr)) {
      localStorage.setItem(DELETED_COURSES_KEY, JSON.stringify([...deleted, idStr]));
    }
  } catch {}
}

// ========================
// COURSES STORAGE UTILITIES
// ========================

export function getStoredCourses() {
  try {
    const deletedIds = getDeletedCourseIds();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const filteredInitial = initialAllCourses.filter((c) => !deletedIds.includes(String(c.id)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInitial));
      return filteredInitial;
    }
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      parsed = initialAllCourses;
    }
    // Ensure all baseline courses are present unless explicitly deleted
    const parsedMap = new Map(parsed.map((c) => [String(c.id), c]));
    let mergedChanged = false;
    initialAllCourses.forEach((initialCourse) => {
      const id = String(initialCourse.id);
      if (!parsedMap.has(id) && !deletedIds.includes(id)) {
        parsedMap.set(id, initialCourse);
        mergedChanged = true;
      }
    });

    const finalCourses = Array.from(parsedMap.values()).filter((c) => !deletedIds.includes(String(c.id)));
    if (mergedChanged) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalCourses));
    }
    return finalCourses;
  } catch {
    return initialAllCourses;
  }
}

export function saveStoredCourses(courses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    window.dispatchEvent(new Event('instructor_courses_updated'));
  } catch (error) {
    void error;
  }
}

export function addStoredCourse(courseData) {
  const current = getStoredCourses();
  const newId = courseData.id || `crs-${Date.now()}`;
  const newCourse = {
    ...courseData,
    id: String(newId),
    instructor: courseData.instructor || 'Staff Instructor',
    studentsCount: Number(courseData.studentsCount) || 0,
    lessonsCount: Number(courseData.lessonsCount) || 1,
    duration: courseData.duration || '10 hours',
    level: courseData.level || 'All Levels',
    status: courseData.status || 'Draft',
    image: courseData.image || PRESET_IMAGES[0],
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [newCourse, ...current];
  saveStoredCourses(updated);
  return newCourse;
}

export function updateStoredCourse(courseId, updatedData) {
  const current = getStoredCourses();
  const idStr = String(courseId);
  const updated = current.map((c) => {
    if (String(c.id) === idStr) {
      return {
        ...c,
        ...updatedData,
        id: c.id, // preserve immutable ID
        studentsCount: updatedData.studentsCount !== undefined ? Number(updatedData.studentsCount) : c.studentsCount,
        lessonsCount: updatedData.lessonsCount !== undefined ? Number(updatedData.lessonsCount) : c.lessonsCount,
      };
    }
    return c;
  });
  saveStoredCourses(updated);
  return updated.find((c) => String(c.id) === idStr);
}

export function deleteStoredCourse(courseId) {
  markCourseDeleted(courseId);
  const current = getStoredCourses();
  const updated = current.filter((c) => String(c.id) !== String(courseId));
  saveStoredCourses(updated);
  return updated;
}

export function getStoredCourseById(courseId) {
  const current = getStoredCourses();
  return current.find((c) => String(c.id) === String(courseId)) || null;
}

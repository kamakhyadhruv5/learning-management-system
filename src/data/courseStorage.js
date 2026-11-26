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
    lessonsCount: 4,
    duration: '38 hours',
    level: 'Beginner to Advanced',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop',
    description: 'Master modern web development from ground up. Learn React, Node.js, TypeScript, and modern deployment pipelines.',
    createdAt: '2026-01-15',
    lessons: [
      { id: 'lsn-wd-1', title: '1. Introduction to Full Stack Architecture', duration: '45 mins', description: 'Overview of client-server model, HTTP/HTTPS protocols, and modern web application structure.' },
      { id: 'lsn-wd-2', title: '2. Modern React with Hooks & State', duration: '60 mins', description: 'Deep dive into useState, useEffect, custom hooks, and state management patterns.' },
      { id: 'lsn-wd-3', title: '3. Backend REST APIs with Node & Express', duration: '55 mins', description: 'Designing RESTful endpoints, middleware, request validation, and error handling.' },
      { id: 'lsn-wd-4', title: '4. Database Integration & Deployment', duration: '75 mins', description: 'Connecting databases, authentication with JWT, and continuous deployment.' },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    instructor: 'Prof. Amit Verma',
    category: 'Computer Science',
    studentsCount: 28,
    lessonsCount: 3,
    duration: '24 hours',
    level: 'Intermediate',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    description: 'Master core data structures and algorithmic complexity for high performance systems and technical interviews.',
    createdAt: '2026-02-10',
    lessons: [
      { id: 'lsn-ds-1', title: '1. Asymptotic Analysis & Big-O Notation', duration: '40 mins', description: 'Understanding time and space complexity, best-case, average-case, and worst-case scenarios.' },
      { id: 'lsn-ds-2', title: '2. Arrays, Strings & Two-Pointer Techniques', duration: '50 mins', description: 'In-depth array manipulations, string algorithms, and window sliding patterns.' },
      { id: 'lsn-ds-3', title: '3. Linked Lists, Stacks & Queues', duration: '60 mins', description: 'Implementation of singly and doubly linked lists, stack-based problem solving.' },
    ],
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing & DevOps',
    instructor: 'Dr. Neha Gupta',
    category: 'Cloud & DevOps',
    studentsCount: 21,
    lessonsCount: 2,
    duration: '20 hours',
    level: 'Intermediate',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
    description: 'Comprehensive introduction to cloud infrastructure, containerization with Docker, and automated deployment.',
    createdAt: '2026-03-01',
    lessons: [
      { id: 'lsn-cc-1', title: '1. Cloud Fundamentals & Virtualization', duration: '45 mins', description: 'Cloud deployment models, IaaS, PaaS, SaaS, and virtual machines vs containers.' },
      { id: 'lsn-cc-2', title: '2. Containerization with Docker', duration: '60 mins', description: 'Building Dockerfiles, managing container images, and container networking.' },
    ],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Masterclass',
    instructor: 'Marcus Chen',
    category: 'Design',
    studentsCount: 45,
    lessonsCount: 3,
    duration: '24 hours',
    level: 'All Levels',
    status: 'Published',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
    description: 'Learn to design world-class user interfaces in Figma, create robust scalable design systems, and craft intuitive digital experiences.',
    createdAt: '2026-03-12',
    lessons: [
      { id: 'lsn-ui-1', title: '1. User Research & Information Architecture', duration: '50 mins', description: 'Conducting user interviews, building personas, and mapping user journeys.' },
      { id: 'lsn-ui-2', title: '2. Wireframing & Responsive Layouts', duration: '60 mins', description: 'Designing low-fidelity wireframes and grid systems in Figma.' },
      { id: 'lsn-ui-3', title: '3. Design Systems & Component Tokens', duration: '70 mins', description: 'Creating scalable Figma design components, variants, and design tokens.' },
    ],
  },
];

function mapToStandardCategory(cat) {
  if (!cat) return 'Web Development';
  const norm = cat.trim().toLowerCase();
  if (norm === 'devops' || norm === 'cloud' || norm === 'cloud & devops') return 'Cloud & DevOps';
  if (norm === 'mobile' || norm === 'mobile apps') return 'Mobile Apps';
  if (norm === 'data science' || norm === 'ai & ml' || norm === 'ai/ml' || norm === 'data science & ai') return 'Data Science & AI';
  if (norm === 'cs' || norm === 'computer science') return 'Computer Science';
  if (norm === 'design' || norm === 'ui/ux') return 'Design';
  if (norm === 'web dev' || norm === 'web development') return 'Web Development';
  return cat;
}

function normalizeInitialCourse(course) {
  return {
    ...course,
    id: String(course.id),
    title: course.title || 'Untitled course',
    description: course.description || '',
    category: mapToStandardCategory(course.category),
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
      // Normalize to guarantee lessons array exists
      return parsed.map((course) => {
        if (!Array.isArray(course.lessons)) {
          const matchedInitial = initialInstructorCourses.find((init) => init.id === course.id);
          return {
            ...course,
            lessons: matchedInitial?.lessons ? [...matchedInitial.lessons] : [],
          };
        }
        return course;
      });
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
  const initialLessons = Array.isArray(courseData.lessons) ? courseData.lessons : [];
  const newCourse = {
    ...courseData,
    id: String(newId),
    instructor: courseData.instructor || 'Staff Instructor',
    studentsCount: Number(courseData.studentsCount) || 0,
    lessonsCount: initialLessons.length > 0 ? initialLessons.length : (Number(courseData.lessonsCount) || 1),
    duration: courseData.duration || '10 hours',
    level: courseData.level || 'All Levels',
    status: courseData.status || 'Draft',
    image: courseData.image || PRESET_IMAGES[0],
    createdAt: new Date().toISOString().split('T')[0],
    lessons: initialLessons,
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
      const mergedLessons = updatedData.lessons !== undefined ? updatedData.lessons : (c.lessons || []);
      const newLessonsCount = updatedData.lessonsCount !== undefined
        ? Number(updatedData.lessonsCount)
        : (mergedLessons.length > 0 ? mergedLessons.length : c.lessonsCount);

      return {
        ...c,
        ...updatedData,
        id: c.id, // preserve immutable ID
        lessons: mergedLessons,
        studentsCount: updatedData.studentsCount !== undefined ? Number(updatedData.studentsCount) : c.studentsCount,
        lessonsCount: newLessonsCount,
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
  const idStr = String(courseId);
  const updated = current.filter((c) => String(c.id) !== idStr);
  saveStoredCourses(updated);

  // Clean up any enrollments pointing to this deleted course to prevent broken references
  try {
    const rawEnr = localStorage.getItem('course_enrollments');
    if (rawEnr) {
      const enrs = JSON.parse(rawEnr);
      if (Array.isArray(enrs)) {
        const filtered = enrs.filter((e) => String(e.courseId) !== idStr);
        if (filtered.length !== enrs.length) {
          localStorage.setItem('course_enrollments', JSON.stringify(filtered));
          window.dispatchEvent(new Event('course_enrollments_updated'));
        }
      }
    }
  } catch {}

  return updated;
}

export function getStoredCourseById(courseId) {
  const current = getStoredCourses();
  return current.find((c) => String(c.id) === String(courseId)) || null;
}

// ==========================================
// Lesson Management Utilities
// ==========================================

export function getCourseLessons(courseId) {
  const course = getStoredCourseById(courseId);
  return course && Array.isArray(course.lessons) ? course.lessons : [];
}

export function addCourseLesson(courseId, lessonData) {
  const course = getStoredCourseById(courseId);
  if (!course) return null;

  const currentLessons = Array.isArray(course.lessons) ? course.lessons : [];
  const newLesson = {
    id: lessonData.id || `lsn-${Date.now()}`,
    title: lessonData.title || `Lesson ${currentLessons.length + 1}`,
    duration: lessonData.duration || '30 mins',
    description: lessonData.description || '',
    order: lessonData.order ?? currentLessons.length + 1,
    createdAt: new Date().toISOString(),
  };

  const updatedLessons = [...currentLessons, newLesson];
  updateStoredCourse(courseId, {
    lessons: updatedLessons,
    lessonsCount: updatedLessons.length,
  });

  return newLesson;
}

export function updateCourseLesson(courseId, lessonId, lessonData) {
  const course = getStoredCourseById(courseId);
  if (!course) return null;

  const currentLessons = Array.isArray(course.lessons) ? course.lessons : [];
  const updatedLessons = currentLessons.map((l) => {
    if (l.id === lessonId) {
      return {
        ...l,
        ...lessonData,
        id: l.id,
      };
    }
    return l;
  });

  updateStoredCourse(courseId, {
    lessons: updatedLessons,
    lessonsCount: updatedLessons.length,
  });

  return updatedLessons.find((l) => l.id === lessonId);
}

export function deleteCourseLesson(courseId, lessonId) {
  const course = getStoredCourseById(courseId);
  if (!course) return false;

  const currentLessons = Array.isArray(course.lessons) ? course.lessons : [];
  const updatedLessons = currentLessons.filter((l) => l.id !== lessonId);

  updateStoredCourse(courseId, {
    lessons: updatedLessons,
    lessonsCount: updatedLessons.length,
  });

  return true;
}

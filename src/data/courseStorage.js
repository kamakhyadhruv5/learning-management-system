const STORAGE_KEY = 'instructor_courses';

export const COURSE_CATEGORIES = [
  'Web Development',
  'Computer Science',
  'Cloud & DevOps',
  'Design',
  'Data Science & AI',
  'Mobile Apps',
];

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

export function getStoredCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInstructorCourses));
      return initialInstructorCourses;
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInstructorCourses));
    return initialInstructorCourses;
  } catch {
    return initialInstructorCourses;
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
    id: newId,
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
  const updated = current.map((c) => {
    if (c.id === courseId) {
      const mergedLessons = updatedData.lessons !== undefined ? updatedData.lessons : (c.lessons || []);
      const newLessonsCount = updatedData.lessonsCount !== undefined
        ? Number(updatedData.lessonsCount)
        : (mergedLessons.length > 0 ? mergedLessons.length : c.lessonsCount);

      return {
        ...c,
        ...updatedData,
        id: c.id,
        lessons: mergedLessons,
        studentsCount: updatedData.studentsCount !== undefined ? Number(updatedData.studentsCount) : c.studentsCount,
        lessonsCount: newLessonsCount,
      };
    }
    return c;
  });
  saveStoredCourses(updated);
  return updated.find((c) => c.id === courseId);
}

export function deleteStoredCourse(courseId) {
  const current = getStoredCourses();
  const updated = current.filter((c) => c.id !== courseId);
  saveStoredCourses(updated);
  return updated;
}

export function getStoredCourseById(courseId) {
  const current = getStoredCourses();
  return current.find((c) => c.id === courseId) || null;
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

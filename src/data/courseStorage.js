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

export function getStoredCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInstructorCourses));
      return initialInstructorCourses;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
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
  } catch {}
}

export function addStoredCourse(courseData) {
  const current = getStoredCourses();
  const newId = courseData.id || `crs-${Date.now()}`;
  const newCourse = {
    ...courseData,
    id: newId,
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
  const updated = current.map((c) => {
    if (c.id === courseId) {
      return {
        ...c,
        ...updatedData,
        id: c.id,
        studentsCount: updatedData.studentsCount !== undefined ? Number(updatedData.studentsCount) : c.studentsCount,
        lessonsCount: updatedData.lessonsCount !== undefined ? Number(updatedData.lessonsCount) : c.lessonsCount,
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

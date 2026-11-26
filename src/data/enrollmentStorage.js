const ENROLLMENTS_STORAGE_KEY = 'course_enrollments';

export const initialEnrollments = [
  {
    id: 'enr-101',
    studentEmail: 'student@lms.edu',
    courseId: 'full-stack-web-development',
    status: 'In Progress',
    progress: 60,
    createdAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'enr-102',
    studentEmail: 'student@lms.edu',
    courseId: 'python-data-science-machine-learning',
    status: 'In Progress',
    progress: 30,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'enr-103',
    studentEmail: 'student@lms.edu',
    courseId: 'cloud-devops-kubernetes',
    status: 'In Progress',
    progress: 10,
    createdAt: '2026-07-15T10:00:00.000Z',
  },
  {
    id: 'enr-104',
    studentEmail: 'student@lms.edu',
    courseId: 'ui-ux-design-masterclass',
    status: 'Completed',
    progress: 100,
    createdAt: '2026-03-10T10:00:00.000Z',
  },
  {
    id: 'enr-105',
    studentEmail: 'student@lms.edu',
    courseId: 'ai-llm-application-engineering',
    status: 'Not Started',
    progress: 0,
    createdAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'enr-106',
    studentEmail: 'alex.j@example.com',
    courseId: 'full-stack-web-development',
    status: 'In Progress',
    progress: 60,
    createdAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'enr-107',
    studentEmail: 'alex.j@example.com',
    courseId: 'python-data-science-machine-learning',
    status: 'In Progress',
    progress: 30,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
];

export function getEnrollments() {
  try {
    const raw = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(initialEnrollments));
      return initialEnrollments;
    }
    const stored = JSON.parse(raw);
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(initialEnrollments));
    return initialEnrollments;
  } catch {
    return initialEnrollments;
  }
}

export function getStudentEnrollments(studentEmail) {
  const email = studentEmail?.toLowerCase();
  return getEnrollments().filter((enrollment) => enrollment.studentEmail === email);
}

export function isCourseEnrolled(studentEmail, courseId) {
  const email = studentEmail?.toLowerCase();
  return getEnrollments().some(
    (item) => item.studentEmail === email && item.courseId === courseId
  );
}

export function getEnrollmentForCourse(studentEmail, courseId) {
  const email = studentEmail?.toLowerCase();
  return (
    getEnrollments().find(
      (item) => item.studentEmail === email && item.courseId === courseId
    ) || null
  );
}

export function saveEnrollment(enrollment) {
  const existing = getEnrollments();
  const studentEmail = enrollment.studentEmail?.toLowerCase();

  if (!studentEmail || !enrollment.courseId) {
    throw new Error('An enrollment requires a student and course identifier.');
  }

  const duplicate = existing.some(
    (item) => item.studentEmail === studentEmail && item.courseId === enrollment.courseId,
  );
  if (duplicate) return { ok: false, reason: 'duplicate' };

  const record = {
    id: `enr-${Date.now()}`,
    studentEmail,
    courseId: enrollment.courseId,
    status: enrollment.status || 'Enrolled',
    progress: Number(enrollment.progress) || 0,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify([...existing, record]));
  window.dispatchEvent(new Event('course_enrollments_updated'));
  return { ok: true, enrollment: record };
}

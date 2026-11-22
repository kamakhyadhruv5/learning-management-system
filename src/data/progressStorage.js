const LESSON_PROGRESS_KEY = 'course_lesson_progress';
const QUIZ_RESULTS_KEY = 'course_quiz_results';

/**
 * Get lesson progress for a specific student and course
 * returns an array of completed lesson IDs or lesson titles
 */
export function getCompletedLessons(studentEmail, courseId) {
  if (!studentEmail || !courseId) return [];
  try {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const key = `${studentEmail.toLowerCase()}::${courseId}`;
    return Array.isArray(all[key]) ? all[key] : [];
  } catch {
    return [];
  }
}

/**
 * Toggle or mark a lesson as completed
 */
export function toggleLessonCompletion(studentEmail, courseId, lessonId, totalCourseLessons = 1) {
  if (!studentEmail || !courseId || !lessonId) return { completed: false, count: 0, progress: 0 };
  try {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const key = `${studentEmail.toLowerCase()}::${courseId}`;
    const current = new Set(Array.isArray(all[key]) ? all[key] : []);

    let isCompleted = false;
    if (current.has(lessonId)) {
      current.delete(lessonId);
      isCompleted = false;
    } else {
      current.add(lessonId);
      isCompleted = true;
    }

    all[key] = Array.from(current);
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(all));

    // Calculate progress percentage
    const completedCount = all[key].length;
    const progress = Math.min(100, Math.round((completedCount / Math.max(1, totalCourseLessons)) * 100));

    // Update progress in enrollment storage as well
    updateEnrollmentProgress(studentEmail, courseId, progress);

    window.dispatchEvent(new Event('course_progress_updated'));
    window.dispatchEvent(new Event('course_enrollments_updated'));

    return { completed: isCompleted, count: completedCount, progress };
  } catch {
    return { completed: false, count: 0, progress: 0 };
  }
}

/**
 * Update enrollment progress & status in localStorage['course_enrollments']
 */
function updateEnrollmentProgress(studentEmail, courseId, progress) {
  try {
    const raw = localStorage.getItem('course_enrollments');
    if (!raw) return;
    const enrollments = JSON.parse(raw);
    const email = studentEmail.toLowerCase();
    let updated = false;

    const next = enrollments.map((enr) => {
      if (enr.studentEmail?.toLowerCase() === email && enr.courseId === courseId) {
        updated = true;
        const status = progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
        return {
          ...enr,
          progress,
          status,
          completedAt: progress >= 100 ? (enr.completedAt || new Date().toISOString()) : null,
        };
      }
      return enr;
    });

    if (updated) {
      localStorage.setItem('course_enrollments', JSON.stringify(next));
    }
  } catch (err) {
    console.error('Failed to update enrollment progress', err);
  }
}

/**
 * Quiz results storage
 */
export function getQuizResults(studentEmail, courseId = null) {
  if (!studentEmail) return [];
  try {
    const raw = localStorage.getItem(QUIZ_RESULTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const email = studentEmail.toLowerCase();
    return list.filter((r) => {
      const matchEmail = r.studentEmail?.toLowerCase() === email;
      return courseId ? (matchEmail && r.courseId === courseId) : matchEmail;
    });
  } catch {
    return [];
  }
}

export function saveQuizResult(result) {
  if (!result.studentEmail || !result.quizId) return { ok: false };
  try {
    const raw = localStorage.getItem(QUIZ_RESULTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const record = {
      id: `quiz-res-${Date.now()}`,
      studentEmail: result.studentEmail.toLowerCase(),
      courseId: result.courseId,
      quizId: result.quizId,
      quizTitle: result.quizTitle || 'Course Assessment',
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: Math.round((result.score / Math.max(1, result.totalQuestions)) * 100),
      passed: result.score / result.totalQuestions >= 0.6,
      answers: result.answers || {},
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify([...list, record]));
    window.dispatchEvent(new Event('quiz_results_updated'));
    return { ok: true, result: record };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

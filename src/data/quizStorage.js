const QUIZZES_STORAGE_KEY = 'course_quizzes';
const ATTEMPTS_STORAGE_KEY = 'student_quiz_attempts';

export const initialQuizzes = [
  {
    id: 'quiz-wd-1',
    courseId: 'web-dev',
    courseTitle: 'Web Development (Full Stack)',
    title: 'Full-Stack Web Development Fundamentals',
    description: 'Test your understanding of HTTP protocols, React hooks, and REST APIs.',
    duration: 15, // in minutes
    totalMarks: 30,
    passingMarks: 20,
    status: 'Published', // 'Published' | 'Draft'
    createdAt: '2026-02-10T10:00:00.000Z',
    instructor: 'Dr. Sarah Khan',
    instructorId: 'usr-instructor-01',
    questions: [
      {
        id: 'q-wd-1',
        question: 'Which HTTP method is considered idempotent and used to retrieve resources?',
        options: ['POST', 'GET', 'PATCH', 'CONNECT'],
        correctAnswer: 1, // index of 'GET'
        marks: 10,
        explanation: 'GET requests are safe and idempotent according to RFC 7231 standards.',
      },
      {
        id: 'q-wd-2',
        question: 'In React, which hook is primarily used to manage side effects such as data fetching or subscriptions?',
        options: ['useMemo', 'useState', 'useEffect', 'useReducer'],
        correctAnswer: 2, // index of 'useEffect'
        marks: 10,
        explanation: 'useEffect handles side-effects after component render and updates.',
      },
      {
        id: 'q-wd-3',
        question: 'What does JWT stand for in modern web authentication?',
        options: ['Java Web Token', 'JSON Web Token', 'Joint Web Transit', 'JavaScript Wire Trace'],
        correctAnswer: 1, // index of 'JSON Web Token'
        marks: 10,
        explanation: 'JWT stands for JSON Web Token, commonly used for stateless token-based auth.',
      },
    ],
  },
  {
    id: 'quiz-ds-1',
    courseId: 'data-structures',
    courseTitle: 'Data Structures & Algorithms',
    title: 'Data Structures - Quiz 1',
    description: 'Foundational assessment on Big-O analysis, arrays, stacks, and queues.',
    duration: 20,
    totalMarks: 30,
    passingMarks: 20,
    status: 'Published',
    createdAt: '2026-02-18T12:00:00.000Z',
    instructor: 'Prof. Amit Verma',
    instructorId: 'usr-instructor-02',
    questions: [
      {
        id: 'q-ds-1',
        question: 'What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 2,
        marks: 10,
        explanation: 'In a balanced BST, each comparison halves the remaining search space, yielding O(log n).',
      },
      {
        id: 'q-ds-2',
        question: 'Which data structure strictly operates under the First-In-First-Out (FIFO) principle?',
        options: ['Stack', 'Queue', 'Priority Queue', 'Binary Tree'],
        correctAnswer: 1,
        marks: 10,
        explanation: 'Queues process and remove elements in the same sequence they were inserted (FIFO).',
      },
      {
        id: 'q-ds-3',
        question: 'What is the worst-case time complexity of standard QuickSort algorithm?',
        options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'],
        correctAnswer: 2,
        marks: 10,
        explanation: 'When pivots are picked poorly (e.g. already sorted array without random pivot), QuickSort degrades to O(n^2).',
      },
    ],
  },
  {
    id: 'quiz-cc-1',
    courseId: 'cloud-computing',
    courseTitle: 'Cloud Computing & DevOps',
    title: 'Docker & Virtualization Essentials',
    description: 'Short quiz covering Docker containers, images, and cloud deployment basics.',
    duration: 10,
    totalMarks: 20,
    passingMarks: 10,
    status: 'Draft',
    createdAt: '2026-03-05T09:00:00.000Z',
    instructor: 'Dr. Neha Gupta',
    instructorId: '',
    questions: [
      {
        id: 'q-cc-1',
        question: 'What is the primary difference between a Docker container and a traditional Virtual Machine?',
        options: [
          'Containers include a full guest OS, VMs do not',
          'Containers share the host OS kernel and are lightweight',
          'Containers cannot connect to the internet',
          'VMs start significantly faster than containers',
        ],
        correctAnswer: 1,
        marks: 10,
        explanation: 'Containers share the host kernel and package only the application and dependencies.',
      },
      {
        id: 'q-cc-2',
        question: 'Which Docker command is used to build an image from a Dockerfile?',
        options: ['docker start', 'docker create', 'docker build', 'docker run'],
        correctAnswer: 2,
        marks: 10,
        explanation: 'docker build reads instructions from a Dockerfile to produce an image.',
      },
    ],
  },
];

export function getQuizzes() {
  try {
    const raw = localStorage.getItem(QUIZZES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(initialQuizzes));
      return initialQuizzes;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(initialQuizzes));
    return initialQuizzes;
  } catch {
    return initialQuizzes;
  }
}

export function saveQuizzes(quizzes) {
  try {
    localStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
    window.dispatchEvent(new Event('course_quizzes_updated'));
  } catch (err) {
    void err;
  }
}

export function getQuizzesByCourse(courseId) {
  const all = getQuizzes();
  return all.filter((q) => q.courseId === courseId);
}

export function getPublishedQuizzes() {
  const all = getQuizzes();
  return all.filter((q) => q.status === 'Published');
}

export function getQuizById(quizId) {
  const all = getQuizzes();
  return all.find((q) => q.id === quizId) || null;
}

export function saveQuiz(quizData) {
  const current = getQuizzes();
  const quizId = quizData.id || `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const questions = Array.isArray(quizData.questions) ? quizData.questions : [];
  
  // Recalculate totalMarks if questions have individual marks and not specified
  const calculatedMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 10), 0);
  const totalMarks = Number(quizData.totalMarks) || (calculatedMarks > 0 ? calculatedMarks : 100);
  const passingMarks = Number(quizData.passingMarks) || Math.round(totalMarks * 0.6);

  const existingIndex = current.findIndex((q) => q.id === quizId);

  const quizRecord = {
    ...quizData,
    id: quizId,
    courseId: quizData.courseId || '',
    courseTitle: quizData.courseTitle || '',
    title: quizData.title?.trim() || 'Untitled Quiz',
    description: quizData.description?.trim() || '',
    duration: Number(quizData.duration) || 15,
    totalMarks,
    passingMarks,
    status: quizData.status || 'Draft',
    instructor: quizData.instructor || 'Instructor',
    instructorId: quizData.instructorId || '',
    questions,
    createdAt: quizData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  let updated;
  if (existingIndex >= 0) {
    updated = current.map((q, idx) => (idx === existingIndex ? quizRecord : q));
  } else {
    updated = [quizRecord, ...current];
  }

  saveQuizzes(updated);
  return quizRecord;
}

export function deleteQuiz(quizId) {
  const current = getQuizzes();
  const updated = current.filter((q) => q.id !== quizId);
  saveQuizzes(updated);
  return updated;
}

// Question management
export function addQuizQuestion(quizId, questionData) {
  const quiz = getQuizById(quizId);
  if (!quiz) return null;

  const currentQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const newQuestion = {
    id: questionData.id || `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question: questionData.question?.trim() || 'Untitled Question',
    options: Array.isArray(questionData.options) ? questionData.options : ['Option A', 'Option B'],
    correctAnswer: Number(questionData.correctAnswer) || 0,
    marks: Number(questionData.marks) || 10,
    explanation: questionData.explanation?.trim() || '',
  };

  const updatedQuestions = [...currentQuestions, newQuestion];
  saveQuiz({
    ...quiz,
    questions: updatedQuestions,
  });

  return newQuestion;
}

export function updateQuizQuestion(quizId, questionId, questionData) {
  const quiz = getQuizById(quizId);
  if (!quiz) return null;

  const currentQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const updatedQuestions = currentQuestions.map((q) => {
    if (q.id === questionId) {
      return {
        ...q,
        ...questionData,
        id: q.id,
      };
    }
    return q;
  });

  saveQuiz({
    ...quiz,
    questions: updatedQuestions,
  });

  return updatedQuestions.find((q) => q.id === questionId) || null;
}

export function deleteQuizQuestion(quizId, questionId) {
  const quiz = getQuizById(quizId);
  if (!quiz) return false;

  const currentQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const updatedQuestions = currentQuestions.filter((q) => q.id !== questionId);

  saveQuiz({
    ...quiz,
    questions: updatedQuestions,
  });

  return true;
}

// ==========================================
// Student Quiz Attempts & Results
// ==========================================

export function getStudentQuizAttempts(studentEmail) {
  try {
    const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (!studentEmail) return parsed;
    return parsed.filter((att) => att.studentEmail?.toLowerCase() === studentEmail.toLowerCase());
  } catch {
    return [];
  }
}

export function getStudentAttemptForQuiz(studentEmail, quizId) {
  const attempts = getStudentQuizAttempts(studentEmail);
  return attempts.find((a) => a.quizId === quizId) || null;
}

export function saveStudentQuizAttempt({ studentEmail, studentName, quizId, answers }) {
  const quiz = getQuizById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  const questions = quiz.questions || [];
  let score = 0;
  let totalAvailableMarks = 0;

  const evaluatedAnswers = questions.map((q, idx) => {
    const selected = answers[q.id] !== undefined ? answers[q.id] : answers[idx];
    const isCorrect = Number(selected) === Number(q.correctAnswer);
    const qMarks = Number(q.marks) || 10;
    totalAvailableMarks += qMarks;
    if (isCorrect) score += qMarks;

    return {
      questionId: q.id,
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      marksAwarded: isCorrect ? qMarks : 0,
      totalMarks: qMarks,
    };
  });

  const percentage = totalAvailableMarks > 0 ? Math.round((score / totalAvailableMarks) * 100) : 0;
  const isPassed = score >= (quiz.passingMarks || Math.round(totalAvailableMarks * 0.6));

  const attemptRecord = {
    id: `att-${Date.now()}`,
    studentEmail: studentEmail?.toLowerCase() || 'student@lms.edu',
    studentName: studentName || 'Student',
    quizId,
    quizTitle: quiz.title,
    courseId: quiz.courseId,
    courseTitle: quiz.courseTitle,
    score,
    totalMarks: totalAvailableMarks,
    percentage,
    isPassed,
    attemptedAt: new Date().toISOString(),
    evaluatedAnswers,
  };

  try {
    const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    // Replace previous attempt for same quiz/student if desired, or keep latest
    const filtered = existing.filter(
      (a) => !(a.studentEmail === attemptRecord.studentEmail && a.quizId === quizId)
    );
    const updated = [attemptRecord, ...filtered];
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('student_quiz_attempts_updated'));
  } catch (err) {
    void err;
  }

  return attemptRecord;
}

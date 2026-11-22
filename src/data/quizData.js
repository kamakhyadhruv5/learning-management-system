export const courseQuizzes = {
  'full-stack-web-development': {
    id: 'quiz-web-dev-1',
    courseId: 'full-stack-web-development',
    title: 'Modern Full-Stack Web Development Assessment',
    description: 'Test your understanding of modern web foundations, React component architecture, APIs, and deployment.',
    timeMinutes: 10,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following is true about Semantic HTML5 elements?',
        options: [
          'They only affect the visual styling in modern browsers.',
          'They provide meaningful structure to both developers and assistive technologies.',
          'They cannot be styled using CSS flexbox or grid.',
          'They replace the need for JavaScript in web applications.'
        ],
        correctAnswer: 1,
        explanation: 'Semantic elements (like <header>, <article>, <main>) give meaning to page structure, benefiting accessibility and SEO.'
      },
      {
        id: 'q2',
        question: 'In React, what is the primary purpose of the useEffect hook?',
        options: [
          'To directly manipulate the real DOM outside of React.',
          'To create global CSS variables.',
          'To perform side effects such as data fetching, subscriptions, and DOM updates in functional components.',
          'To replace the return statement of a component.'
        ],
        correctAnswer: 2,
        explanation: 'useEffect is used to manage side effects like fetching data, timers, and manual DOM listeners in functional React components.'
      },
      {
        id: 'q3',
        question: 'What HTTP status code is typically returned for a successful REST API request that creates a resource?',
        options: [
          '200 OK',
          '201 Created',
          '204 No Content',
          '400 Bad Request'
        ],
        correctAnswer: 1,
        explanation: 'Status code 201 Created indicates that the request was successful and a new resource has been created.'
      },
      {
        id: 'q4',
        question: 'Which tool is commonly used to containerize applications for consistent deployment across environments?',
        options: [
          'Docker',
          'Babel',
          'PostCSS',
          'ESLint'
        ],
        correctAnswer: 0,
        explanation: 'Docker packages an application and its dependencies into standardized containers for development and production.'
      }
    ]
  },
  'python-data-science-machine-learning': {
    id: 'quiz-python-ds-1',
    courseId: 'python-data-science-machine-learning',
    title: 'Python for Data Science & ML Knowledge Check',
    description: 'Assess your skills in data frames, data manipulation with Pandas, and core machine learning concepts.',
    timeMinutes: 10,
    questions: [
      {
        id: 'q1',
        question: 'Which Python library is primarily optimized for fast vectorized numerical array operations?',
        options: [
          'Django',
          'NumPy',
          'Flask',
          'BeautifulSoup'
        ],
        correctAnswer: 1,
        explanation: 'NumPy provides N-dimensional arrays and fast vectorized mathematical routines.'
      },
      {
        id: 'q2',
        question: 'What is the main objective of supervised machine learning?',
        options: [
          'To cluster data points without pre-existing labels.',
          'To learn a mapping from input features to known target labels.',
          'To compress image files into smaller formats.',
          'To run database queries faster.'
        ],
        correctAnswer: 1,
        explanation: 'Supervised learning trains algorithms on labeled data where inputs and desired outputs are provided.'
      },
      {
        id: 'q3',
        question: 'Which metric is best suited for evaluating a classification model with highly imbalanced classes?',
        options: [
          'Accuracy only',
          'F1-Score / Precision-Recall',
          'Mean Squared Error (MSE)',
          'R-Squared'
        ],
        correctAnswer: 1,
        explanation: 'F1-Score, Precision, and Recall give a much more accurate evaluation on skewed/imbalanced datasets than raw accuracy.'
      }
    ]
  },
  'ui-ux-design-masterclass': {
    id: 'quiz-ui-ux-1',
    courseId: 'ui-ux-design-masterclass',
    title: 'UI/UX Design Principles Quiz',
    description: 'Verify your understanding of typography, color hierarchy, user flows, and design systems.',
    timeMinutes: 8,
    questions: [
      {
        id: 'q1',
        question: 'What is visual hierarchy in UI design?',
        options: [
          'The order of software layers in an operating system.',
          'The arrangement of design elements in an order of visual importance to guide user attention.',
          'Using the highest screen resolution possible.',
          'A strict alphabetical list of design tokens.'
        ],
        correctAnswer: 1,
        explanation: 'Visual hierarchy guides the user’s eye through content using scale, contrast, weight, and spacing.'
      },
      {
        id: 'q2',
        question: 'What is the minimum recommended color contrast ratio for standard text under WCAG AA standards?',
        options: [
          '2:1',
          '4.5:1',
          '10:1',
          '7:1'
        ],
        correctAnswer: 1,
        explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal body text.'
      }
    ]
  }
};

/**
 * Get quiz for a course, or generate a high quality default quiz based on course title
 */
export function getCourseQuiz(courseId, courseTitle = 'Course') {
  if (courseQuizzes[courseId]) {
    return courseQuizzes[courseId];
  }

  // Fallback dynamic quiz for any custom instructor created course
  return {
    id: `quiz-${courseId}`,
    courseId,
    title: `${courseTitle} Comprehensive Assessment`,
    description: `Evaluate your understanding of the core concepts taught in ${courseTitle}.`,
    timeMinutes: 10,
    questions: [
      {
        id: 'q1',
        question: `What is the primary core concept introduced in ${courseTitle}?`,
        options: [
          'Foundational principles and structured workflows',
          'Random unguided trial-and-error',
          'Outdated legacy tools without documentation',
          'Bypassing system security standards'
        ],
        correctAnswer: 0,
        explanation: 'Foundations and structured workflows ensure reliable, high-quality outcomes.'
      },
      {
        id: 'q2',
        question: 'Why is continuous review and modular practice important when learning new technical skills?',
        options: [
          'It reinforces long-term retention and allows practical problem solving.',
          'It is only useful for passing multiple choice exams.',
          'It replaces the need for hands-on application.',
          'It has no proven benefit.'
        ],
        correctAnswer: 0,
        explanation: 'Continuous review solidifies core understanding and unlocks effective real-world application.'
      },
      {
        id: 'q3',
        question: 'When implementing solutions in production, what practice is most crucial?',
        options: [
          'Testing, documentation, and adhering to best practices',
          'Ignoring error states and edge cases',
          'Hardcoding credentials in source code',
          'Skipping validation checks to save time'
        ],
        correctAnswer: 0,
        explanation: 'Rigorous testing and adhering to industry best practices ensure software reliability.'
      }
    ]
  };
}

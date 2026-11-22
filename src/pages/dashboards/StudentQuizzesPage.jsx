import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import {
  getPublishedQuizzes,
  getStudentQuizAttempts,
  saveStudentQuizAttempt,
} from '../../data/quizStorage';
import { enrolledCourses } from '../../data/studentData';
import { getEnrollments } from '../../data/enrollmentStorage';

export default function StudentQuizzesPage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [studentEmail, setStudentEmail] = useState('student@lms.edu');

  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Available' | 'Completed'

  // Quiz Taking Modal State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.email) setStudentEmail(user.email);
        if (user.fullName) setStudentName(user.fullName);
        else if (user.email) {
          const namePart = user.email.split('@')[0];
          setStudentName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }

    const loadQuizData = () => {
      const published = getPublishedQuizzes();
      setQuizzes(published);

      const email = studentEmail || 'student@lms.edu';
      const studentAttempts = getStudentQuizAttempts(email);
      setAttempts(studentAttempts);
    };

    loadQuizData();

    window.addEventListener('course_quizzes_updated', loadQuizData);
    window.addEventListener('student_quiz_attempts_updated', loadQuizData);

    return () => {
      window.removeEventListener('course_quizzes_updated', loadQuizData);
      window.removeEventListener('student_quiz_attempts_updated', loadQuizData);
    };
  }, [studentEmail]);

  // Determine enrolled course IDs
  const localEnrollments = getEnrollments()
    .filter((e) => e.studentEmail?.toLowerCase() === studentEmail.toLowerCase())
    .map((e) => e.courseId);
  const staticEnrollments = enrolledCourses.map((c) => c.courseId);
  const allEnrolledCourseIds = Array.from(new Set([...localEnrollments, ...staticEnrollments]));

  // Quizzes for enrolled courses or all published quizzes
  const relevantQuizzes = quizzes.filter(
    (q) => allEnrolledCourseIds.includes(q.courseId) || allEnrolledCourseIds.length === 0
  );

  const filteredQuizzes = relevantQuizzes.filter((quiz) => {
    const attempt = attempts.find((a) => a.quizId === quiz.id);
    if (activeFilter === 'Completed') return Boolean(attempt);
    if (activeFilter === 'Available') return !attempt;
    return true;
  });

  const completedCount = attempts.length;
  const passedCount = attempts.filter((a) => a.isPassed).length;

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setQuizSubmittedResult(null);
    setErrorMessage('');
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setErrorMessage('');
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (!activeQuiz) return;

    const questions = activeQuiz.questions || [];
    const unansweredCount = questions.filter((q) => userAnswers[q.id] === undefined).length;

    if (unansweredCount > 0) {
      setErrorMessage(`Please answer all ${questions.length} questions before submitting (remaining: ${unansweredCount}).`);
      return;
    }

    try {
      const result = saveStudentQuizAttempt({
        studentEmail,
        studentName,
        quizId: activeQuiz.id,
        answers: userAnswers,
      });

      setQuizSubmittedResult(result);
      setAttempts(getStudentQuizAttempts(studentEmail));
    } catch (err) {
      setErrorMessage(err.message || 'Error evaluating quiz.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <StudentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} studentName={studentName} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader setMobileOpen={setMobileOpen} studentName={studentName} />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div>
              <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                Assessments & Evaluations
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Course Quizzes
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm mt-1 max-w-lg">
                Attempt interactive assessments authored by your instructors to test your mastery and earn completion scores.
              </p>
            </div>

            <button
              onClick={() => navigate('/student/courses')}
              className="bg-[#07181E] hover:bg-[#10272F] text-[#A9C0C7] hover:text-white font-semibold text-xs px-4 py-3 rounded-xl border border-[#1D363E] transition-all self-start sm:self-center"
            >
              ← My Enrolled Courses
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0 text-xl">
                📝
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">
                  {relevantQuizzes.length}
                </div>
                <div className="text-xs text-[#A9C0C7] font-medium">Available Quizzes</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-sky-950/50 flex items-center justify-center text-sky-400 flex-shrink-0 text-xl">
                📊
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">
                  {completedCount}
                </div>
                <div className="text-xs text-[#A9C0C7] font-medium">Completed Attempts</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#143C3A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0 text-xl">
                🏆
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">
                  {passedCount}
                </div>
                <div className="text-xs text-[#A9C0C7] font-medium">Passed Assessments</div>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['All', 'Available', 'Completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeFilter === filter
                    ? 'bg-[#4DE2BD] text-[#07181E] border-[#4DE2BD]'
                    : 'bg-[#0D2229] text-[#A9C0C7] border-[#1D363E] hover:border-[#29444C] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Quizzes List */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-12 text-center">
              <p className="text-[#A9C0C7] text-sm mb-4">No quizzes match your current filter.</p>
              <button
                onClick={() => setActiveFilter('All')}
                className="bg-[#14323A] text-[#4DE2BD] font-bold text-xs px-4 py-2 rounded-xl border border-[#4DE2BD]/30"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuizzes.map((quiz) => {
                const attempt = attempts.find((a) => a.quizId === quiz.id);
                const questionCount = quiz.questions?.length || 0;

                return (
                  <div
                    key={quiz.id}
                    className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 flex flex-col justify-between hover:border-[#29444C] transition-all shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#14323A] text-[#4DE2BD] border border-[#4DE2BD]/30 truncate max-w-[200px]">
                          {quiz.courseTitle || 'Curriculum Course'}
                        </span>
                        {attempt ? (
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              attempt.isPassed
                                ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/40'
                                : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
                            }`}
                          >
                            {attempt.isPassed ? 'Passed' : 'Failed'}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#07181E] text-[#A9C0C7] border border-[#1D363E]">
                            Available
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{quiz.title}</h3>
                      <p className="text-xs text-[#A9C0C7] line-clamp-2 mb-4 leading-relaxed">
                        {quiz.description || 'Test your knowledge on course concepts.'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-[#A9C0C7] p-3 rounded-xl bg-[#07181E] border border-[#1D363E]/60 mb-4">
                        <div>
                          <span>Questions: </span>
                          <strong className="text-white">{questionCount}</strong>
                        </div>
                        <div>
                          <span>Duration: </span>
                          <strong className="text-white">{quiz.duration || 15} mins</strong>
                        </div>
                        <div>
                          <span>Total Marks: </span>
                          <strong className="text-white">{quiz.totalMarks} pts</strong>
                        </div>
                        <div>
                          <span>Passing: </span>
                          <strong className="text-white">{quiz.passingMarks} pts</strong>
                        </div>
                      </div>

                      {attempt && (
                        <div className="mb-4 p-3 rounded-xl bg-[#14323A]/50 border border-[#1D363E] text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[#A9C0C7]">Latest Score:</span>
                            <span className="font-bold text-white">
                              {attempt.score} / {attempt.totalMarks} pts ({attempt.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#07181E] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${attempt.isPassed ? 'bg-[#4DE2BD]' : 'bg-rose-400'}`}
                              style={{ width: `${attempt.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartQuiz(quiz)}
                      disabled={questionCount === 0}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                        questionCount === 0
                          ? 'bg-[#07181E] text-[#A9C0C7]/40 border border-[#1D363E] cursor-not-allowed'
                          : attempt
                          ? 'bg-[#14323A] hover:bg-[#1f4752] text-[#4DE2BD] border border-[#4DE2BD]/30'
                          : 'bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] shadow-md'
                      }`}
                    >
                      <span>{attempt ? 'Retake Quiz' : 'Take Quiz'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================
          MODAL: INTERACTIVE QUIZ ATTEMPT & RESULTS
         ======================================================== */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-2xl max-h-[92vh] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#1D363E]">
              <div>
                <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                  Assessment In Progress
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">{activeQuiz.title}</h3>
                <p className="text-xs text-[#A9C0C7] mt-1">
                  Course: <strong className="text-white">{activeQuiz.courseTitle}</strong> • Total Marks:{' '}
                  {activeQuiz.totalMarks} pts • Passing Score: {activeQuiz.passingMarks} pts
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveQuiz(null);
                  setQuizSubmittedResult(null);
                }}
                className="text-[#A9C0C7] hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Content: Result Screen OR Question Form */}
            {quizSubmittedResult ? (
              <div className="py-6 space-y-6 overflow-y-auto flex-1 pr-1">
                <div
                  className={`p-6 rounded-2xl text-center border ${
                    quizSubmittedResult.isPassed
                      ? 'bg-[#143e39]/60 border-[#4DE2BD]/40 text-[#4DE2BD]'
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{quizSubmittedResult.isPassed ? '🎉' : '📚'}</div>
                  <h4 className="text-2xl font-black text-white mb-1">
                    {quizSubmittedResult.isPassed ? 'Congratulations! You Passed!' : 'Assessment Completed'}
                  </h4>
                  <p className="text-sm font-semibold mb-3">
                    Your Score: <span className="text-white font-bold">{quizSubmittedResult.score}</span> /{' '}
                    {quizSubmittedResult.totalMarks} pts ({quizSubmittedResult.percentage}%)
                  </p>
                  <p className="text-xs text-[#A9C0C7] max-w-sm mx-auto">
                    {quizSubmittedResult.isPassed
                      ? 'You met or exceeded the passing requirement. Your results have been recorded in your student progress profile.'
                      : `The passing score is ${activeQuiz.passingMarks} pts. Review your answers below and try again when you are ready.`}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Answer Review</h4>
                  {activeQuiz.questions?.map((q, idx) => {
                    const evalItem = quizSubmittedResult.evaluatedAnswers?.find((ea) => ea.questionId === q.id);
                    const isCorrect = evalItem?.isCorrect;

                    return (
                      <div
                        key={q.id || idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                          isCorrect
                            ? 'bg-[#07181E] border-[#4DE2BD]/30'
                            : 'bg-[#07181E] border-rose-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <span
                            className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded-full ${
                              isCorrect ? 'bg-[#143e39] text-[#4DE2BD]' : 'bg-rose-950 text-rose-300'
                            }`}
                          >
                            {isCorrect ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}
                          </span>
                        </div>

                        <div className="space-y-1 pl-2">
                          {q.options?.map((opt, optIdx) => {
                            const isChosen = evalItem?.selectedAnswer === optIdx;
                            const isTrueCorrect = Number(q.correctAnswer) === optIdx;

                            let optStyle = 'text-[#A9C0C7]';
                            if (isTrueCorrect) optStyle = 'text-[#4DE2BD] font-bold';
                            else if (isChosen && !isCorrect) optStyle = 'text-rose-400 font-bold line-through';

                            return (
                              <p key={optIdx} className={optStyle}>
                                {String.fromCharCode(65 + optIdx)}. {opt}
                                {isTrueCorrect && '  ✓ (Correct Answer)'}
                                {isChosen && !isCorrect && '  ✗ (Your Answer)'}
                              </p>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <p className="text-[11px] text-[#A9C0C7]/80 italic bg-[#0D2229] p-2 rounded-lg">
                            💡 Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#1D363E] flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setActiveQuiz(null);
                      setQuizSubmittedResult(null);
                    }}
                    className="px-5 py-2.5 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] text-xs font-bold rounded-xl transition-all"
                  >
                    Done & Return to Quizzes
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuiz} className="flex-1 flex flex-col min-h-0 py-4">
                <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1">
                  {activeQuiz.questions?.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#07181E] border border-[#1D363E] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#14323A] text-[#4DE2BD] text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-bold text-white leading-snug">{q.question}</p>
                        </div>
                        <span className="text-xs text-[#A9C0C7] bg-[#0D2229] px-2 py-0.5 rounded border border-[#1D363E] flex-shrink-0">
                          {q.marks || 10} pts
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options?.map((opt, optIdx) => {
                          const isSelected = userAnswers[q.id] === optIdx;
                          return (
                            <label
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                                isSelected
                                  ? 'bg-[#143e39]/80 border-[#4DE2BD] text-white shadow-sm'
                                  : 'bg-[#0D2229] border-[#1D363E] text-[#A9C0C7] hover:bg-[#10272F] hover:text-white'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                checked={isSelected}
                                onChange={() => handleSelectOption(q.id, optIdx)}
                                className="accent-[#4DE2BD] w-4 h-4 cursor-pointer"
                              />
                              <span className="w-4 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                              <span className="flex-1">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#1D363E] flex items-center justify-between gap-4 mt-2">
                  <span className="text-xs text-[#A9C0C7]">
                    Answered:{' '}
                    <strong className="text-white">
                      {Object.keys(userAnswers).length} of {activeQuiz.questions?.length || 0}
                    </strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveQuiz(null)}
                      className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] text-xs font-bold rounded-xl transition-all shadow-md"
                    >
                      Submit Assessment
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

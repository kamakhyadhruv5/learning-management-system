import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { getCatalogCourseById } from '../../data/courseCatalog';
import { getCurrentSession } from '../../data/authStorage';
import { getCourseQuiz } from '../../data/quizData';
import { saveQuizResult, getQuizResults } from '../../data/progressStorage';

export default function StudentQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getCurrentSession();
  const course = getCatalogCourseById(id);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedResult, setSubmittedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const quiz = React.useMemo(() => {
    return getCourseQuiz(id, course?.title);
  }, [id, course]);

  useEffect(() => {
    if (session?.fullName) {
      setStudentName(session.fullName);
    } else if (session?.email) {
      const namePart = session.email.split('@')[0];
      setStudentName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, [session]);

  // Check if student already has a saved result for this course quiz
  useEffect(() => {
    if (session?.email && id) {
      const pastResults = getQuizResults(session.email, id);
      if (pastResults.length > 0) {
        // Show the latest result
        setSubmittedResult(pastResults[pastResults.length - 1]);
        setSelectedAnswers(pastResults[pastResults.length - 1].answers || {});
      }
    }
  }, [session?.email, id]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (submittedResult) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session?.email) {
      setErrorMsg('You must be logged in to submit an assessment.');
      return;
    }

    // Validate that all questions are answered
    const unanswered = quiz.questions.filter((q) => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setErrorMsg(`Please answer all ${quiz.questions.length} questions before submitting.`);
      return;
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    const saved = saveQuizResult({
      studentEmail: session.email,
      courseId: id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: quiz.questions.length,
      answers: selectedAnswers,
    });

    if (saved.ok) {
      setSubmittedResult(saved.result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetake = () => {
    setSubmittedResult(null);
    setSelectedAnswers({});
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <StudentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} studentName={studentName} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader setMobileOpen={setMobileOpen} studentName={studentName} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#A9C0C7]">
            <Link to="/student/courses" className="hover:text-[#4DE2BD] transition-colors">My Courses</Link>
            <span>/</span>
            <Link to={`/student/courses/${id}/learn`} className="hover:text-[#4DE2BD] transition-colors">{course?.title || 'Course'}</Link>
            <span>/</span>
            <span className="text-white font-medium">Quiz & Assessment</span>
          </div>

          {/* Quiz Header Banner */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-xl">
            <span className="inline-flex bg-[#14323A] border border-[#1D363E] text-[#4DE2BD] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Assessment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{quiz.title}</h1>
            <p className="text-xs sm:text-sm text-[#A9C0C7] mt-2 leading-relaxed">
              {quiz.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#A9C0C7] mt-4 pt-4 border-t border-[#1D363E]/60">
              <span>📝 {quiz.questions.length} Questions</span>
              <span>⏱️ Estimated: {quiz.timeMinutes} mins</span>
              <span>🎯 Passing grade: 60%</span>
            </div>
          </div>

          {/* Result Card if submitted */}
          {submittedResult && (
            <div className={`border rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4 ${
              submittedResult.passed
                ? 'bg-[#143C3A]/50 border-[#4DE2BD]/40 text-[#B9F6E4]'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="text-4xl mb-2">{submittedResult.passed ? '🎉' : '📚'}</div>
              <h2 className="text-2xl font-black text-white">
                {submittedResult.passed ? 'Assessment Passed!' : 'Assessment Completed'}
              </h2>
              <p className="text-sm">
                You scored <strong className="text-white text-base">{submittedResult.score} / {submittedResult.totalQuestions}</strong> ({submittedResult.percentage}%)
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  onClick={handleRetake}
                  className="bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl border border-[#1D363E] transition-all"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => navigate(`/student/courses/${id}/learn`)}
                  className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Back to Course Lessons
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs p-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Questions Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions.map((q, idx) => {
              const selectedIdx = selectedAnswers[q.id];
              const isSubmitted = Boolean(submittedResult);

              return (
                <div key={q.id} className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      <span className="text-[#4DE2BD] mr-2">Question {idx + 1}.</span>
                      {q.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      let optionStyle = 'bg-[#091B21] border-[#1D363E] text-[#A9C0C7] hover:border-[#29444C] hover:text-white';

                      if (isSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          optionStyle = 'bg-[#143C3A] border-[#4DE2BD] text-white font-semibold';
                        } else if (isChosen && optIdx !== q.correctAnswer) {
                          optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-300 font-semibold';
                        }
                      } else if (isChosen) {
                        optionStyle = 'bg-[#14323A] border-[#4DE2BD] text-white font-semibold shadow-sm';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm cursor-pointer transition-all ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                              isChosen ? 'border-[#4DE2BD] text-[#4DE2BD]' : 'border-[#1D363E] text-[#A9C0C7]'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSubmitted && optIdx === q.correctAnswer && (
                            <span className="text-[#4DE2BD] font-bold text-xs">✓ Correct</span>
                          )}
                          {isSubmitted && isChosen && optIdx !== q.correctAnswer && (
                            <span className="text-rose-400 font-bold text-xs">✗ Your Answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isSubmitted && q.explanation && (
                    <div className="bg-[#091B21] border border-[#1D363E]/60 p-3 rounded-xl text-xs text-[#A9C0C7] mt-2">
                      <strong className="text-[#4DE2BD] block mb-0.5">Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!submittedResult && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-md"
                >
                  Submit Quiz Answers
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

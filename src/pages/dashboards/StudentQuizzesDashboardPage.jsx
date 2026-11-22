import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { getCurrentSession } from '../../data/authStorage';
import { useStudentEnrollments } from '../../hooks/useStudentEnrollments';
import { getQuizResults } from '../../data/progressStorage';

export default function StudentQuizzesDashboardPage() {
  const navigate = useNavigate();
  const session = getCurrentSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const { enrollments } = useStudentEnrollments();
  const [resultsList, setResultsList] = useState([]);

  useEffect(() => {
    if (session?.fullName) {
      setStudentName(session.fullName);
    } else if (session?.email) {
      const namePart = session.email.split('@')[0];
      setStudentName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
    }
  }, [session]);

  const loadResults = () => {
    if (session?.email) {
      setResultsList(getQuizResults(session.email));
    }
  };

  useEffect(() => {
    loadResults();
    window.addEventListener('quiz_results_updated', loadResults);
    return () => window.removeEventListener('quiz_results_updated', loadResults);
  }, [session?.email]);

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <StudentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} studentName={studentName} />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader setMobileOpen={setMobileOpen} studentName={studentName} />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              Quizzes & Assessments
            </h1>
            <p className="text-sm text-[#A9C0C7]">
              Test your skills, assess your retention, and track your assessment scores
            </p>
          </div>

          {/* Available Quizzes from Enrolled Courses */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Assessments for Your Enrolled Courses
            </h2>

            {enrollments.length === 0 ? (
              <div className="p-8 text-center text-[#A9C0C7] text-sm">
                You have not enrolled in any courses yet. Enroll in a course to access its quizzes.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {enrollments.map((course) => {
                  const pastAttempts = resultsList.filter((r) => r.courseId === course.courseId);
                  const latestAttempt = pastAttempts[pastAttempts.length - 1];

                  return (
                    <div
                      key={course.courseId}
                      className="bg-[#091B21] border border-[#1D363E] rounded-xl p-5 flex flex-col justify-between hover:border-[#29444C] transition-all shadow-md space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#14323A] text-[#4DE2BD] border border-[#4DE2BD]/30">
                            {course.category}
                          </span>
                          {latestAttempt && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              latestAttempt.passed ? 'bg-[#143C3A] text-[#4DE2BD]' : 'bg-rose-950/40 text-rose-400'
                            }`}>
                              Score: {latestAttempt.percentage}%
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-[#A9C0C7]">
                          Comprehensive Knowledge Check
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/student/courses/${course.courseId}/quiz`)}
                        className="w-full bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs py-2.5 rounded-xl border border-[#1D363E] transition-all"
                      >
                        {latestAttempt ? 'Review / Retake Quiz' : 'Start Assessment'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Assessment Attempts History */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Assessment Results
            </h2>

            {resultsList.length === 0 ? (
              <p className="text-[#A9C0C7] text-xs">
                No quizzes attempted yet. Choose an assessment above to test your skills!
              </p>
            ) : (
              <div className="space-y-3">
                {resultsList.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-[#091B21] border border-[#1D363E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{res.quizTitle}</h4>
                      <p className="text-xs text-[#A9C0C7] mt-0.5">
                        Attempted on {new Date(res.completedAt).toLocaleDateString()} at {new Date(res.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">
                          {res.score} / {res.totalQuestions} ({res.percentage}%)
                        </span>
                        <span className={`text-[10px] font-semibold ${res.passed ? 'text-[#4DE2BD]' : 'text-rose-400'}`}>
                          {res.passed ? 'Passed' : 'Needs Practice'}
                        </span>
                      </div>

                      <Link
                        to={`/student/courses/${res.courseId}/quiz`}
                        className="text-xs font-bold text-[#4DE2BD] hover:underline"
                      >
                        View Attempt →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

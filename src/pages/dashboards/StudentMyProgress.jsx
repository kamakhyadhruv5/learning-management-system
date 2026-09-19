import React, { useState, useEffect } from 'react';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { enrolledCourses } from '../../data/studentData';

export default function StudentMyProgress() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.fullName) {
          setStudentName(user.fullName);
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          setStudentName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }
  }, []);

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter((c) => c.status === 'Completed').length;
  const inProgressCourses = enrolledCourses.filter((c) => c.status === 'In Progress').length;
  const totalLessons = enrolledCourses.reduce((sum, c) => sum + c.totalLessons, 0);
  const completedLessons = enrolledCourses.reduce((sum, c) => sum + c.lessonsCompleted, 0);
  const averageProgress = totalCourses > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
    : 0;

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-[#4DE2BD] bg-[#143C3A]/60 border-[#4DE2BD]/30';
    if (status === 'In Progress') return 'text-sky-400 bg-sky-950/40 border-sky-400/30';
    return 'text-amber-400 bg-amber-950/40 border-amber-400/30';
  };

  const getBarColor = (status) => {
    if (status === 'Completed') return 'bg-[#4DE2BD]';
    if (status === 'In Progress') return 'bg-sky-400';
    return 'bg-amber-400';
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <StudentSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        studentName={studentName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader
          setMobileOpen={setMobileOpen}
          studentName={studentName}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              My Progress
            </h1>
            <p className="text-sm text-[#A9C0C7]">
              Track your learning journey and course completion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{totalCourses}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Total Enrolled</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{averageProgress}%</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Avg. Progress</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#143C3A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{completedCourses}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Completed</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{completedLessons}/{totalLessons}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Lessons Done</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Overall Completion</h3>
              <span className="text-sm font-black text-[#4DE2BD]">{averageProgress}%</span>
            </div>
            <div className="w-full h-3 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
              <div
                className="h-full bg-gradient-to-r from-[#4DE2BD] to-[#38BDF8] rounded-full transition-all duration-500"
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-[#A9C0C7]">
              <span>{completedCourses} of {totalCourses} courses completed</span>
              <span>{inProgressCourses} in progress</span>
            </div>
          </div>

          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white tracking-tight mb-5">
              Course Progress Details
            </h3>

            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-[#1D363E] hover:border-[#29444C] hover:bg-[#10272F] transition-all"
                >
                  <div className="w-full sm:w-20 h-14 rounded-lg overflow-hidden bg-[#07181E] flex-shrink-0 border border-[#1D363E]/60">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{course.title}</h4>
                        <p className="text-xs text-[#A9C0C7]">{course.instructor}</p>
                      </div>
                      <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 w-fit ${getStatusColor(course.status)}`}>
                        {course.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full h-2 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(course.status)}`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white flex-shrink-0 w-10 text-right">
                        {course.progress}%
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-[#A9C0C7]">
                      <span>{course.lessonsCompleted} / {course.totalLessons} lessons</span>
                      <span>Last accessed: {course.lastAccessed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

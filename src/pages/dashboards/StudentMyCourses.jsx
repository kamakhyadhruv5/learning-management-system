import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { enrolledCourses } from '../../data/studentData';

export default function StudentMyCourses() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [activeFilter, setActiveFilter] = useState('All');

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

  const filters = ['All', 'In Progress', 'Completed', 'Not Started'];

  const filteredCourses = activeFilter === 'All'
    ? enrolledCourses
    : enrolledCourses.filter((c) => c.status === activeFilter);

  const inProgressCount = enrolledCourses.filter((c) => c.status === 'In Progress').length;
  const completedCount = enrolledCourses.filter((c) => c.status === 'Completed').length;
  const notStartedCount = enrolledCourses.filter((c) => c.status === 'Not Started').length;

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'text-[#4DE2BD] bg-[#143C3A]/60 border-[#4DE2BD]/30';
    if (status === 'In Progress') return 'text-sky-400 bg-sky-950/40 border-sky-400/30';
    return 'text-amber-400 bg-amber-950/40 border-amber-400/30';
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
              My Courses
            </h1>
            <p className="text-sm text-[#A9C0C7]">
              Manage and continue your enrolled courses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-sky-950/50 flex items-center justify-center text-sky-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{inProgressCount}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">In Progress</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-[#143C3A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{completedCount}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Completed</div>
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4 shadow-md">
              <div className="w-12 h-12 rounded-full bg-amber-950/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none mb-1">{notStartedCount}</div>
                <div className="text-xs text-[#A9C0C7] font-medium">Not Started</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
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

          {filteredCourses.length === 0 ? (
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-12 text-center">
              <p className="text-[#A9C0C7] text-sm">No courses found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 flex flex-col justify-between hover:border-[#29444C] transition-all shadow-md"
                >
                  <div>
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#07181E] mb-3.5 border border-[#1D363E]/60">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(course.status)}`}>
                        {course.status}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-[#A9C0C7] mb-1">
                      {course.instructor}
                    </p>
                    <p className="text-[11px] text-[#A9C0C7]/70 mb-3">
                      {course.lessonsCompleted} / {course.totalLessons} lessons
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-[#A9C0C7] mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-white">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
                        <div
                          className={`h-full rounded-full ${course.progressColor || 'bg-[#4DE2BD]'}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${course.courseId}`)}
                    className="w-full bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs py-2.5 rounded-xl border border-[#1D363E] hover:border-[#4DE2BD] transition-all"
                  >
                    {course.status === 'Completed' ? 'View Course' : course.status === 'Not Started' ? 'Start Learning' : 'Continue Learning'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

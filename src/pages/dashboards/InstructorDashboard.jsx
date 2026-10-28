import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import InstructorCourseCard from '../../components/instructor/InstructorCourseCard';
import EnrollmentChart from '../../components/instructor/EnrollmentChart';
import StatCard from '../../components/student/StatCard';
import { getStoredCourses } from '../../data/courseStorage';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [instructorName, setInstructorName] = useState('Instructor');
  const [instructorCourses, setInstructorCourses] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.fullName) {
          setInstructorName(user.fullName);
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          setInstructorName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }

    const loadCourses = () => {
      setInstructorCourses(getStoredCourses());
    };

    loadCourses();
    window.addEventListener('instructor_courses_updated', loadCourses);
    return () => window.removeEventListener('instructor_courses_updated', loadCourses);
  }, []);

  const recentActivities = [
    {
      id: 1,
      text: (
        <span>
          New student enrolled in <strong className="text-white">Web Development (Full Stack)</strong>
        </span>
      ),
      time: '2 hours ago',
      iconBg: 'bg-[#143e39]',
      iconText: 'text-[#4DE2BD]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 2,
      text: <span>A student submitted Quiz 1 - Data Structures</span>,
      time: '5 hours ago',
      iconBg: 'bg-[#14323A]',
      iconText: 'text-[#A9C0C7]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      text: <span>You received a 5-star rating for Cloud Computing</span>,
      time: '1 day ago',
      iconBg: 'bg-[#332616]',
      iconText: 'text-[#fbbf24]',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      text: (
        <span>
          You published a new course: <strong className="text-white">UI/UX Design</strong>
        </span>
      ),
      time: '2 days ago',
      iconBg: 'bg-[#143e39]',
      iconText: 'text-[#4DE2BD]',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Add New Course',
      desc: 'Create and publish a new course',
      path: '/instructor/courses/add',
      icon: (
        <svg className="w-5 h-5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'My Courses',
      desc: 'View all your courses',
      path: '/instructor/courses',
      icon: (
        <svg className="w-5 h-5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'View Students',
      desc: 'See enrolled students',
      path: '/instructor/courses',
      icon: (
        <svg className="w-5 h-5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'View Analytics',
      desc: 'Track course performance',
      path: '/instructor/courses',
      icon: (
        <svg className="w-5 h-5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const upcomingTasks = [
    {
      date: '18',
      month: 'Sep',
      title: 'Review Assignment Submissions',
      course: 'Web Development',
      urgent: true,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      date: '20',
      month: 'Sep',
      title: 'Create Lesson 5',
      course: 'Data Structures',
      urgent: false,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      date: '22',
      month: 'Sep',
      title: 'Publish Course',
      course: 'UI/UX Design',
      urgent: false,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      date: '25',
      month: 'Sep',
      title: 'Update Course Materials',
      course: 'Cloud Computing',
      urgent: false,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <InstructorSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        instructorName={instructorName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <InstructorHeader
          setMobileOpen={setMobileOpen}
          instructorName={instructorName}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          <div className="bg-[#091B21] border border-[#1D363E]/70 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="z-10 max-w-xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                Welcome back, <span className="text-[#4DE2BD]">{instructorName}!</span>
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm">
                Here's an overview of your teaching activity. Keep inspiring!
              </p>
            </div>

            <div className="z-10 flex items-center gap-6 sm:gap-10">
              <div className="hidden sm:block text-right">
                <p className="text-xs sm:text-sm text-white font-medium italic max-w-[200px] leading-snug mb-2">
                  "Great instructors build brighter futures."
                </p>
                <div className="w-8 h-1 bg-[#4DE2BD] rounded-full ml-auto"></div>
              </div>

              <div className="relative w-36 h-28 sm:w-44 sm:h-32 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="120" cy="80" r="60" fill="#13353c" opacity="0.6" />
                  <circle cx="60" cy="100" r="40" fill="#0f2a30" opacity="0.8" />

                  <g transform="translate(130, 40)">
                    <path d="M20 70 Q0 40 -5 10 Q15 25 20 65 Z" fill="#35c296" />
                    <path d="M20 60 Q35 25 45 5 Q40 40 22 65 Z" fill="#4de2bd" />
                    <polygon points="12,65 28,65 24,90 16,90" fill="#1e2c38" />
                  </g>

                  <g transform="translate(50, 20)">
                    <ellipse cx="45" cy="100" rx="35" ry="6" fill="#061215" opacity="0.6" />
                    <path d="M35 50 C32 65 30 85 30 100 L55 100 C56 85 55 65 52 50 Z" fill="#1b6e56" />
                    <path d="M30 95 C25 95 10 102 5 118 C2 128 -4 135 4 135 C12 133 20 120 22 110 L38 98 Z" fill="#182736" />
                    <path d="M38 95 C35 100 20 108 15 122 C12 132 8 138 15 138 C23 134 30 120 32 110 L48 98 Z" fill="#1f3244" />

                    <g transform="translate(15, 65)">
                      <path d="M6 18 L36 16 L38 20 L4 22 Z" fill="#1e293b" />
                      <polygon points="15,2 36,0 32,16 10,18" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                      <circle cx="23" cy="9" r="1.5" fill="#4DE2BD" />
                    </g>

                    <rect x="40" y="38" width="6" height="12" rx="3" fill="#e29b76" />
                    <circle cx="43" cy="30" r="9" fill="#f8b48f" />
                    <circle cx="44" cy="28" r="1.2" fill="#1e293b" />
                    <path d="M35 28 C34 22 38 16 45 16 C50 16 53 19 53 23 C53 25 50 25 49 24 C46 23 44 20 39 23 Z" fill="#111827" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              value={instructorCourses.length}
              label="Total Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              value={instructorCourses.reduce((acc, c) => acc + (Number(c.studentsCount) || 0), 0)}
              label="Total Students"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              value={instructorCourses.filter((c) => c.status === 'Published').length}
              label="Active Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              }
              value="4.8"
              label="Average Rating"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  My Courses
                </h3>
                <button
                  onClick={() => navigate('/instructor/courses')}
                  className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {instructorCourses.slice(0, 3).map((course) => (
                  <InstructorCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Recent Activity
                </h3>
                <button
                  onClick={() => navigate('/instructor/courses')}
                  className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3.5">
                {recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-[#10272F] transition-colors"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${act.iconBg} ${act.iconText} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      {act.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-[#A9C0C7] leading-snug">
                        {act.text}
                      </p>
                      <span className="text-[11px] text-[#A9C0C7]/70 block mt-0.5">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <EnrollmentChart />
            </div>

            <div className="lg:col-span-4 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <h3 className="text-lg font-bold text-white tracking-tight mb-4">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {quickActions.map((qa, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(qa.path)}
                    className="bg-[#091B21] border border-[#1D363E] hover:border-[#4DE2BD]/60 hover:bg-[#10272F] rounded-xl p-4 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#143e39] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      {qa.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#4DE2BD] transition-colors leading-tight mb-1">
                        {qa.title}
                      </h4>
                      <p className="text-[11px] text-[#A9C0C7] leading-tight">
                        {qa.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Upcoming Tasks
                </h3>
                <button
                  onClick={() => navigate('/instructor/courses')}
                  className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {upcomingTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#10272F] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold leading-none flex-shrink-0 ${
                          t.urgent
                            ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                            : 'bg-[#14323A] text-[#A9C0C7] border border-[#1D363E]'
                        }`}
                      >
                        <span className="text-xs font-extrabold">{t.date}</span>
                        <span className="text-[9px] uppercase mt-0.5">{t.month}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight line-clamp-1">
                          {t.title}
                        </h4>
                        <p className="text-[11px] text-[#A9C0C7] mt-0.5">
                          {t.course}
                        </p>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#091B21] flex items-center justify-center flex-shrink-0">
                      {t.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

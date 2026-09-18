import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import StatCard from '../../components/student/StatCard';
import ContinueLearningCard from '../../components/student/ContinueLearningCard';
import UpcomingDeadlinesCard from '../../components/student/UpcomingDeadlinesCard';
import MyCourseCard from '../../components/student/MyCourseCard';
import RecommendedCourseItem from '../../components/student/RecommendedCourseItem';

export default function StudentDashboard() {
  const navigate = useNavigate();
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

  const myCourses = [
    {
      id: 'web-dev',
      title: 'Web Development (Full Stack)',
      instructor: 'Dr. Sarah Khan',
      progress: 60,
      progressColor: 'bg-[#4DE2BD]',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop',
      link: '/courses/full-stack-web-development',
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      instructor: 'Prof. Amit Verma',
      progress: 30,
      progressColor: 'bg-rose-400',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
      link: '/courses/python-data-science-machine-learning',
    },
    {
      id: 'cloud-computing',
      title: 'Cloud Computing',
      instructor: 'Dr. Neha Gupta',
      progress: 10,
      progressColor: 'bg-sky-400',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
      link: '/courses/cloud-devops-kubernetes',
    },
  ];

  const recommendedCourses = [
    {
      id: 'ml-basics',
      title: 'Machine Learning Basics',
      instructor: 'Prof. Rohit Mehta',
      rating: '4.8',
      students: '12K students',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=200&auto=format&fit=crop',
      link: '/courses/ai-llm-application-engineering',
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      instructor: 'Ananya Desai',
      rating: '4.6',
      students: '8K students',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=200&auto=format&fit=crop',
      link: '/courses/ui-ux-design-masterclass',
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Fundamentals',
      instructor: 'Dr. Karan Singh',
      rating: '4.7',
      students: '10K students',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=200&auto=format&fit=crop',
      link: '/courses/cloud-devops-kubernetes',
    },
  ];

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
          <div className="bg-[#091B21] border border-[#1D363E]/70 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="z-10 max-w-xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                Welcome back, <span className="text-[#4DE2BD]">{studentName}!</span>
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm">
                Here's an overview of your learning journey. Keep going!
              </p>
            </div>

            <div className="z-10 flex items-center gap-6 sm:gap-10">
              <div className="hidden sm:block text-right">
                <p className="text-xs sm:text-sm text-white font-medium italic max-w-[200px] leading-snug mb-2">
                  "A little progress each day adds up to big results."
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              }
              value="5"
              label="Enrolled Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value="2"
              label="Completed"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              value="3"
              label="In Progress"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              value="12"
              label="Total Learning Hours"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <ContinueLearningCard />
            </div>
            <div className="lg:col-span-5">
              <UpcomingDeadlinesCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  My Courses
                </h3>
                <button
                  onClick={() => navigate('/student/courses')}
                  className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {myCourses.map((course) => (
                  <MyCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Recommended for You
                </h3>
                <button
                  onClick={() => navigate('/courses')}
                  className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {recommendedCourses.map((item) => (
                  <RecommendedCourseItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

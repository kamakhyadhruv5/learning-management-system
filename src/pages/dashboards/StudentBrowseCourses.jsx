import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { coursesData } from '../../data/coursesData';
import { enrolledCourses } from '../../data/studentData';

export default function StudentBrowseCourses() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentName, setStudentName] = useState('Student');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  const enrolledIds = enrolledCourses.map((c) => c.courseId);

  const categories = ['All', ...new Set(coursesData.map((c) => c.category))];

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

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
              Browse Courses
            </h1>
            <p className="text-sm text-[#A9C0C7]">
              Explore our catalog and find your next course
            </p>
          </div>

          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A9C0C7]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, topics or instructors..."
              className="w-full bg-[#0D2229] border border-[#1D363E] rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#4DE2BD] text-[#07181E] border-[#4DE2BD]'
                    : 'bg-[#0D2229] text-[#A9C0C7] border-[#1D363E] hover:border-[#29444C] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-12 text-center">
              <p className="text-[#A9C0C7] text-sm">No courses found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl overflow-hidden hover:border-[#29444C] hover:bg-[#10272F] transition-all duration-300 group shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative w-full h-48 overflow-hidden bg-[#07181E]">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#07181E]/80 backdrop-blur-md border border-[#1D363E] text-[#4DE2BD] text-xs font-semibold px-3 py-1 rounded-full">
                          {course.category}
                        </div>
                        {isEnrolled && (
                          <div className="absolute top-3 right-3 bg-[#4DE2BD] text-[#07181E] text-[10px] font-bold px-2.5 py-1 rounded-full">
                            Enrolled
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-[#07181E]/85 backdrop-blur-md border border-[#1D363E] text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <span className="text-[#4DE2BD]">★</span> {course.rating}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-white text-lg font-bold mb-2 group-hover:text-[#4DE2BD] transition-colors line-clamp-1">
                          {course.title}
                        </h3>

                        <p className="text-[#A9C0C7] text-xs sm:text-sm line-clamp-2 mb-4">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-6 h-6 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] text-xs font-bold">
                            {course.instructor.charAt(0)}
                          </div>
                          <span className="text-xs text-[#A9C0C7]">
                            {course.instructor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-[#1D363E] pt-4 flex items-center justify-between text-xs text-[#A9C0C7] mb-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{course.studentsCount}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>{course.lessonsCount} lessons</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="w-full bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all duration-200"
                      >
                        {isEnrolled ? 'Continue Learning' : 'View Course'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

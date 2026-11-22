import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import StatCard from '../../components/student/StatCard';
import { getStoredCourses, updateStoredCourse, deleteStoredCourse, getStoredCategories, COURSE_CATEGORIES } from '../../data/courseStorage';

export default function InstructorCoursesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [instructorName, setInstructorName] = useState('Instructor');
  const [currentUserId, setCurrentUserId] = useState('');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) setCurrentUserId(user.id);
        if (user.fullName) {
          setInstructorName(user.fullName);
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          setInstructorName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (e) {}
    }

    const loadCourses = () => {
      setCourses(getStoredCourses());
      setCategories(getStoredCategories());
    };

    loadCourses();
    window.addEventListener('instructor_courses_updated', loadCourses);
    window.addEventListener('course_categories_updated', loadCourses);
    window.addEventListener('storage', loadCourses);
    return () => {
      window.removeEventListener('instructor_courses_updated', loadCourses);
      window.removeEventListener('course_categories_updated', loadCourses);
      window.removeEventListener('storage', loadCourses);
    };
  }, []);

  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null) {
      setSearchTerm(urlQuery);
    }
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  const handleToggleStatus = (course) => {
    const nextStatus = course.status === 'Published' ? 'Draft' : 'Published';
    updateStoredCourse(course.id, { status: nextStatus });
    setCourses(getStoredCourses());
  };

  const handleDeleteCourse = () => {
    if (!deletingCourse) return;
    if (deletingCourse.instructorId && currentUserId && deletingCourse.instructorId !== currentUserId) {
      setActionError('You cannot delete a course belonging to another instructor.');
      setDeletingCourse(null);
      return;
    }
    deleteStoredCourse(deletingCourse.id);
    setCourses(getStoredCourses());
    setDeletingCourse(null);
  };

  const totalCount = courses.length;
  const publishedCount = courses.filter((c) => c.status === 'Published').length;
  const draftCount = courses.filter((c) => c.status === 'Draft').length;
  const totalStudents = courses.reduce((acc, c) => acc + (Number(c.studentsCount) || 0), 0);

  const filteredCourses = courses.filter((c) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Published' && c.status === 'Published') ||
      (activeTab === 'Draft' && c.status === 'Draft');

    const matchesCategory =
      selectedCategory === 'All' || c.category === selectedCategory;

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      c.title?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term);

    return matchesTab && matchesCategory && matchesSearch;
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D2229] border border-[#1D363E] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="z-10">
              <span className="text-[#4DE2BD] text-xs font-bold tracking-widest uppercase">
                Course Catalog
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                My Courses
              </h1>
              <p className="text-[#A9C0C7] text-xs sm:text-sm mt-1 max-w-lg">
                Manage, edit, and track performance of all your instructional courses.
              </p>
            </div>

            <button
              onClick={() => navigate('/instructor/courses/add')}
              className="z-10 self-start sm:self-center bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Course</span>
            </button>
          </div>

          {actionError && (
            <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-2xl p-4 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{actionError}</span>
              </div>
              <button
                onClick={() => setActionError('')}
                className="text-rose-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              value={totalCount}
              label="Total Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={publishedCount}
              label="Published Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
              value={draftCount}
              label="Draft Courses"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              value={totalStudents}
              label="Total Enrolled Students"
            />
          </div>

          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Published', 'Draft'].map((tab) => {
                const count =
                  tab === 'All' ? totalCount : tab === 'Published' ? publishedCount : draftCount;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                        : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto bg-[#07181E] border border-[#1D363E] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-none focus:border-[#4DE2BD] transition-colors cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#A9C0C7]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#A9C0C7]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Filter courses..."
                  className="w-full sm:w-56 bg-[#07181E] border border-[#1D363E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#14323A] text-[#4DE2BD] flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No courses found</h3>
              <p className="text-xs sm:text-sm text-[#A9C0C7] max-w-sm mb-6">
                No courses match your current search filters. Try clearing filters or create a new course.
              </p>
              <div className="flex gap-3">
                {(searchTerm || selectedCategory !== 'All' || activeTab !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setActiveTab('All');
                      setSearchParams({});
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] rounded-xl hover:bg-[#10272F] transition-all"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => navigate('/instructor/courses/add')}
                  className="px-4 py-2 text-xs font-bold text-[#07181E] bg-[#4DE2BD] hover:bg-[#41D1AC] rounded-xl transition-all"
                >
                  Create Course
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#0D2229] border border-[#1D363E] rounded-2xl overflow-hidden shadow-lg hover:border-[#29444C] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 bg-[#07181E] overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-[#07181E]/80 backdrop-blur-md border border-[#1D363E] text-[#4DE2BD] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {course.category}
                      </span>
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md ${
                          course.status === 'Published'
                            ? 'bg-[#143e39]/90 text-[#4DE2BD] border border-[#4DE2BD]/40'
                            : 'bg-[#2a2216]/90 text-[#fbbf24] border border-[#fbbf24]/40'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#A9C0C7] line-clamp-2 leading-relaxed mb-4">
                        {course.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1D363E]/60 text-xs text-[#A9C0C7]">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{course.studentsCount} Students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{course.lessonsCount} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{course.duration || '10 hours'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>{course.level || 'All Levels'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => navigate(`/instructor/courses/manage?courseId=${course.id}`)}
                        title="Manage lessons, materials & quizzes"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl border bg-[#14323A] text-[#4DE2BD] border-[#4DE2BD]/30 hover:bg-[#4DE2BD] hover:text-[#07181E] transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>Manage Content</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(course)}
                        title="Click to toggle status"
                        className={`text-xs font-bold py-2 px-3 rounded-xl border transition-all flex items-center gap-1.5 ${
                          course.status === 'Published'
                            ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30 hover:bg-[#184d47]'
                            : 'bg-[#2a2216] text-[#fbbf24] border-[#fbbf24]/30 hover:bg-[#382d1c]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            course.status === 'Published' ? 'bg-[#4DE2BD]' : 'bg-[#fbbf24]'
                          }`}
                        />
                        <span>{course.status}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1D363E]/40">
                      <button
                        onClick={() => navigate(`/instructor/courses/edit/${course.id}`)}
                        title="Edit course details"
                        className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border bg-[#07181E] text-[#A9C0C7] border-[#1D363E] hover:text-white hover:border-[#29444C] hover:bg-[#10272F] transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => setDeletingCourse(course)}
                        title="Delete course"
                        className="flex items-center gap-1 text-xs font-semibold py-1.5 px-2.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {deletingCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Course</h3>
            <p className="text-xs text-[#A9C0C7] mb-6">
              Are you sure you want to delete <span className="text-white font-bold">{deletingCourse.title}</span>? This action will remove the course and its associated content.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-5 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

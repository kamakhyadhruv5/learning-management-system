import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/student/StatCard';
import {
  getStoredCourses,
  addStoredCourse,
  updateStoredCourse,
  deleteStoredCourse,
  COURSE_CATEGORIES,
} from '../../data/courseStorage';

export default function AdminManageCourses() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [viewingCourse, setViewingCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    category: 'Web Development',
    status: 'Published',
    studentsCount: 0,
    lessonsCount: 10,
    duration: '20 hours',
    level: 'All Levels',
    description: '',
  });

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (storedAdmin.fullName) setAdminName(storedAdmin.fullName);
    else if (storedAdmin.email) setAdminName(storedAdmin.email.split('@')[0]);

    const loadCourses = () => {
      setCourses(getStoredCourses());
    };
    loadCourses();
    window.addEventListener('instructor_courses_updated', loadCourses);
    return () => window.removeEventListener('instructor_courses_updated', loadCourses);
  }, []);

  const totalCoursesCount = courses.length;
  const publishedCount = courses.filter((c) => c.status === 'Published').length;
  const draftCount = courses.filter((c) => c.status === 'Draft').length;
  const totalStudentsCount = courses.reduce((acc, c) => acc + (Number(c.studentsCount) || 0), 0);

  const filteredCourses = courses.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      c.title?.toLowerCase().includes(term) ||
      c.instructor?.toLowerCase().includes(term) ||
      c.category?.toLowerCase().includes(term);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      instructor: adminName || 'Dr. Sarah Khan',
      category: 'Web Development',
      status: 'Published',
      studentsCount: 0,
      lessonsCount: 12,
      duration: '24 hours',
      level: 'All Levels',
      description: '',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAddCourse = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addStoredCourse(formData);
    setCourses(getStoredCourses());
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      instructor: course.instructor || 'Dr. Sarah Khan',
      category: course.category || 'Web Development',
      status: course.status || 'Published',
      studentsCount: course.studentsCount || 0,
      lessonsCount: course.lessonsCount || 10,
      duration: course.duration || '20 hours',
      level: course.level || 'All Levels',
      description: course.description || '',
    });
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateStoredCourse(editingCourse.id, formData);
    setCourses(getStoredCourses());
    setEditingCourse(null);
  };

  const handleDeleteCourse = () => {
    if (!deletingCourse) return;
    deleteStoredCourse(deletingCourse.id);
    setCourses(getStoredCourses());
    setDeletingCourse(null);
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} adminName={adminName} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} adminName={adminName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div>
              <p className="text-xs text-[#4DE2BD] font-semibold uppercase tracking-widest mb-1">
                Curriculum Moderation
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Manage Courses</h1>
              <p className="text-sm text-[#A9C0C7] max-w-md leading-relaxed">
                Overview and manage all course offerings, categories, publishing states, and enrollment stats.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex-shrink-0 bg-[#4DE2BD] text-[#07181E] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#3ac9a8] transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              value={totalCoursesCount}
              label="Total Catalog Courses"
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
              value={totalStudentsCount}
              label="Active Enrollments"
            />
          </div>

          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Published', 'Draft'].map((st) => {
                const count =
                  st === 'All'
                    ? totalCoursesCount
                    : courses.filter((c) => c.status === st).length;
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                        : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                    }`}
                  >
                    {st} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[#07181E] border border-[#1D363E] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-none focus:border-[#4DE2BD] transition-colors cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {COURSE_CATEGORIES.map((cat) => (
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search course title or instructor..."
                  className="w-full sm:w-60 bg-[#07181E] border border-[#1D363E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl overflow-hidden shadow-xl">
            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#14323A] text-[#4DE2BD] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No courses found</h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] max-w-sm mb-4">
                  No courses match your active search filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('All');
                    setCategoryFilter('All');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] rounded-xl hover:bg-[#10272F] transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1D363E] bg-[#07181E]/60 text-xs font-semibold text-[#A9C0C7] uppercase tracking-wider">
                      <th className="py-4 px-6">Course Title</th>
                      <th className="py-4 px-6">Instructor</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Students</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D363E]/60 text-sm">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-[#0a1e26] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.image || 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop'}
                              alt={course.title}
                              className="w-12 h-9 rounded-lg object-cover bg-[#07181E] border border-[#1D363E] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-xs">{course.title}</p>
                              <p className="text-xs text-[#A9C0C7] truncate">
                                {course.lessonsCount || 10} Lessons • {course.duration || '20 hours'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-white/90 text-xs">
                          {course.instructor || 'Dr. Sarah Khan'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#14323A] text-[#4DE2BD] border border-[#4DE2BD]/30">
                            {course.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-[#A9C0C7] font-semibold">
                          {course.studentsCount || 0} enrolled
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                              course.status === 'Published'
                                ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30'
                                : 'bg-[#2a2216] text-[#fbbf24] border-[#fbbf24]/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                course.status === 'Published' ? 'bg-[#4DE2BD]' : 'bg-[#fbbf24]'
                              }`}
                            />
                            {course.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingCourse(course)}
                              title="View Course"
                              className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-[#4DE2BD] hover:bg-[#10272F] border border-[#1D363E] transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(course)}
                              title="Edit Course"
                              className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-sky-400 hover:bg-[#10272F] border border-[#1D363E] transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeletingCourse(course)}
                              title="Delete Course"
                              className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-rose-400 hover:bg-[#10272F] border border-[#1D363E] transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {viewingCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setViewingCourse(null)}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-4">
              <span className="text-xs font-bold text-[#4DE2BD] bg-[#14323A] border border-[#4DE2BD]/30 px-2.5 py-1 rounded-full inline-block mb-2">
                {viewingCourse.category}
              </span>
              <h3 className="text-xl font-bold text-white">{viewingCourse.title}</h3>
              <p className="text-xs text-[#A9C0C7] mt-1">Instructor: {viewingCourse.instructor || 'Dr. Sarah Khan'}</p>
            </div>

            <div className="space-y-3 text-xs bg-[#07181E] border border-[#1D363E] p-4 rounded-xl mb-4">
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Status</span>
                <span className={`font-bold ${viewingCourse.status === 'Published' ? 'text-[#4DE2BD]' : 'text-[#fbbf24]'}`}>
                  {viewingCourse.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Enrolled Students</span>
                <span className="font-bold text-white">{viewingCourse.studentsCount || 0}</span>
              </div>
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Lessons</span>
                <span className="font-semibold text-white">{viewingCourse.lessonsCount || 10}</span>
              </div>
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Duration</span>
                <span className="font-semibold text-white">{viewingCourse.duration || '20 hours'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9C0C7]">Difficulty Level</span>
                <span className="font-semibold text-white">{viewingCourse.level || 'All Levels'}</span>
              </div>
            </div>

            {viewingCourse.description && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#A9C0C7] mb-1">Description</p>
                <p className="text-xs text-white/90 bg-[#07181E] p-3 rounded-xl border border-[#1D363E] leading-relaxed">
                  {viewingCourse.description}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setViewingCourse(null)}
                className="px-5 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {(isAddModalOpen || editingCourse) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingCourse(null);
              }}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black text-white mb-4">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>

            <form onSubmit={editingCourse ? handleSaveEditCourse : handleSaveAddCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Web Architecture"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="Instructor Name"
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    {COURSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Lessons Count</label>
                  <input
                    type="number"
                    value={formData.lessonsCount}
                    onChange={(e) => setFormData({ ...formData, lessonsCount: Number(e.target.value) })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course brief outline..."
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#3ac9a8] transition-all"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              Are you sure you want to delete <span className="text-white font-bold">{deletingCourse.title}</span>? This action cannot be undone.
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

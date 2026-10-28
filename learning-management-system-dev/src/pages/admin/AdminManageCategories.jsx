import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/student/StatCard';
import {
  getStoredCategories,
  addStoredCategory,
  updateStoredCategory,
  deleteStoredCategory,
} from '../../data/courseStorage';
import { getAllCatalogCourses } from '../../data/courseCatalog';

export default function AdminManageCategories() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form states
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = () => {
    setCategories(getStoredCategories());
    setCourses(getAllCatalogCourses());
  };

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (storedAdmin.fullName) setAdminName(storedAdmin.fullName);
    else if (storedAdmin.email) setAdminName(storedAdmin.email.split('@')[0]);

    loadData();
    window.addEventListener('course_categories_updated', loadData);
    window.addEventListener('instructor_courses_updated', loadData);
    return () => {
      window.removeEventListener('course_categories_updated', loadData);
      window.removeEventListener('instructor_courses_updated', loadData);
    };
  }, []);

  // Compute course count per category
  const getCourseCountForCategory = (catName) => {
    const norm = String(catName || '').trim().toLowerCase();
    return courses.filter((c) => String(c.category || '').trim().toLowerCase() === norm).length;
  };

  const categoriesWithCounts = categories.map((cat) => ({
    name: cat,
    count: getCourseCountForCategory(cat),
  }));

  const totalCategoriesCount = categories.length;
  const categoriesInUseCount = categoriesWithCounts.filter((c) => c.count > 0).length;
  const unusedCategoriesCount = categoriesWithCounts.filter((c) => c.count === 0).length;
  const totalCoursesCount = courses.length;

  const filteredCategories = categoriesWithCounts.filter((cat) => {
    const term = searchTerm.toLowerCase().trim();
    return !term || cat.name.toLowerCase().includes(term);
  });

  // Modal open handlers
  const handleOpenAddModal = () => {
    setCategoryNameInput('');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (catName) => {
    setEditingCategory(catName);
    setCategoryNameInput(catName);
    setFormError('');
  };

  const handleOpenDeleteModal = (catName) => {
    setDeletingCategory(catName);
  };

  // Submit handlers with thorough validation
  const handleSaveAddCategory = (e) => {
    e.preventDefault();
    const trimmed = categoryNameInput.trim();
    if (!trimmed) {
      setFormError('Category name is required.');
      return;
    }
    if (trimmed.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }
    const isDuplicate = categories.some((c) => c.trim().toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setFormError(`A category named "${trimmed}" already exists (case-insensitive).`);
      return;
    }

    const result = addStoredCategory(trimmed);
    if (!result.ok) {
      setFormError(result.error || 'Failed to add category.');
      return;
    }

    loadData();
    setIsAddModalOpen(false);
  };

  const handleSaveEditCategory = (e) => {
    e.preventDefault();
    const trimmed = categoryNameInput.trim();
    if (!trimmed) {
      setFormError('Category name is required.');
      return;
    }
    if (trimmed.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }
    const isDuplicate = categories.some(
      (c) => c.trim().toLowerCase() === trimmed.toLowerCase() && c.trim().toLowerCase() !== editingCategory.trim().toLowerCase()
    );
    if (isDuplicate) {
      setFormError(`A category named "${trimmed}" already exists.`);
      return;
    }

    const result = updateStoredCategory(editingCategory, trimmed);
    if (!result.ok) {
      setFormError(result.error || 'Failed to update category.');
      return;
    }

    loadData();
    setEditingCategory(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    const count = getCourseCountForCategory(deletingCategory);
    if (count > 0) return; // Guard against deletion if in use

    deleteStoredCategory(deletingCategory);
    loadData();
    setDeletingCategory(null);
  };

  const deletingCourseCount = deletingCategory ? getCourseCountForCategory(deletingCategory) : 0;

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} adminName={adminName} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} adminName={adminName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div>
              <p className="text-xs text-[#4DE2BD] font-semibold uppercase tracking-widest mb-1">
                Taxonomy & Organization
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Manage Categories</h1>
              <p className="text-sm text-[#A9C0C7] max-w-md leading-relaxed">
                Add, rename, and manage classification categories across the entire shared course catalog.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex-shrink-0 bg-[#4DE2BD] text-[#07181E] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#3ac9a8] transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Category</span>
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              }
              value={totalCategoriesCount}
              label="Total Categories"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={categoriesInUseCount}
              label="Active Categories"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={unusedCategoriesCount}
              label="Unused Categories"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              value={totalCoursesCount}
              label="Total Catalog Courses"
            />
          </div>

          {/* Search bar */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#A9C0C7] font-semibold">
              Showing {filteredCategories.length} of {totalCategoriesCount} categories
            </p>

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
                placeholder="Search category name..."
                className="w-full sm:w-64 bg-[#07181E] border border-[#1D363E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl overflow-hidden shadow-xl">
            {filteredCategories.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#14323A] text-[#4DE2BD] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No categories found</h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] max-w-sm mb-4">
                  No categories match your search term.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-xs font-semibold text-[#A9C0C7] hover:text-white bg-[#07181E] border border-[#1D363E] rounded-xl hover:bg-[#10272F] transition-all cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1D363E] bg-[#07181E]/60 text-xs font-semibold text-[#A9C0C7] uppercase tracking-wider">
                      <th className="py-4 px-6">Category Name</th>
                      <th className="py-4 px-6">Courses Assigned</th>
                      <th className="py-4 px-6">Usage Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D363E]/60 text-sm">
                    {filteredCategories.map((cat) => (
                      <tr key={cat.name} className="hover:bg-[#0a1e26] transition-colors">
                        <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4DE2BD] flex-shrink-0" />
                          <span>{cat.name}</span>
                        </td>
                        <td className="py-4 px-6 text-xs text-[#A9C0C7] font-semibold">
                          {cat.count} {cat.count === 1 ? 'course' : 'courses'}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                              cat.count > 0
                                ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30'
                                : 'bg-[#142328] text-[#A9C0C7] border-[#1D363E]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cat.count > 0 ? 'bg-[#4DE2BD]' : 'bg-[#A9C0C7]'
                              }`}
                            />
                            {cat.count > 0 ? 'In Use' : 'Unassigned'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(cat.name)}
                              title="Edit Category"
                              className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-sky-400 hover:bg-[#10272F] border border-[#1D363E] transition-all cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(cat.name)}
                              title="Delete Category"
                              className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-rose-400 hover:bg-[#10272F] border border-[#1D363E] transition-all cursor-pointer"
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black text-white mb-4">Add New Category</h3>

            {formError && (
              <div className="mb-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryNameInput}
                  onChange={(e) => {
                    setCategoryNameInput(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
                <p className="text-[11px] text-[#A9C0C7]/70 mt-1.5">
                  Category names are validated to prevent duplicates regardless of letter case or spaces.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#3ac9a8] transition-all cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingCategory(null)}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black text-white mb-4">Edit Category</h3>

            {formError && (
              <div className="mb-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={categoryNameInput}
                  onChange={(e) => {
                    setCategoryNameInput(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
                <p className="text-[11px] text-[#A9C0C7]/70 mt-1.5">
                  Renaming will automatically update all existing courses currently assigned to this category.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#3ac9a8] transition-all cursor-pointer"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
            {deletingCourseCount > 0 ? (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cannot Delete Category</h3>
                <p className="text-xs text-[#A9C0C7] mb-6 leading-relaxed">
                  The category <strong className="text-white">"{deletingCategory}"</strong> is currently assigned to{' '}
                  <span className="text-[#4DE2BD] font-bold">{deletingCourseCount} course(s)</span>.
                  <br />
                  Please reassign or remove those courses before deleting this category.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="px-5 py-2.5 bg-[#14323A] text-[#4DE2BD] text-xs font-bold rounded-xl border border-[#4DE2BD]/30 hover:bg-[#1a404a] cursor-pointer"
                  >
                    Understood
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Category</h3>
                <p className="text-xs text-[#A9C0C7] mb-6">
                  Are you sure you want to delete category <strong className="text-white">"{deletingCategory}"</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeletingCategory(null)}
                    className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-5 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer"
                  >
                    Delete Category
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

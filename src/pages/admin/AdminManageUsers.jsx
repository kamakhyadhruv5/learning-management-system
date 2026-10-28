import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/student/StatCard';
import {
  getStoredUsers,
  addStoredUser,
  updateStoredUser,
  deleteStoredUser,
} from '../../data/userStorage';
export default function AdminManageUsers() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student',
    status: 'Active',
    detail: '',
  });
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (storedAdmin.fullName) setAdminName(storedAdmin.fullName);
    else if (storedAdmin.email) setAdminName(storedAdmin.email.split('@')[0]);
    const loadUsers = () => {
      setUsers(getStoredUsers());
    };
    loadUsers();
    window.addEventListener('admin_users_updated', loadUsers);
    return () => window.removeEventListener('admin_users_updated', loadUsers);
  }, []);
  const totalUsersCount = users.length;
  const studentsCount = users.filter((u) => u.role === 'Student').length;
  const instructorsCount = users.filter((u) => u.role === 'Instructor').length;
  const activeCount = users.filter((u) => u.status === 'Active').length;
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.id?.toLowerCase().includes(term);
    return matchesRole && matchesStatus && matchesSearch;
  });
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Student',
      status: 'Active',
      detail: '',
    });
    setIsAddModalOpen(true);
  };
  const handleSaveAddUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    addStoredUser(formData);
    setUsers(getStoredUsers());
    setIsAddModalOpen(false);
  };
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      detail: user.detail || '',
    });
  };
  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateStoredUser(editingUser.id, formData);
    setUsers(getStoredUsers());
    setEditingUser(null);
  };
  const handleDeleteUser = () => {
    if (!deletingUser) return;
    deleteStoredUser(deletingUser.id);
    setUsers(getStoredUsers());
    setDeletingUser(null);
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
                User Moderation
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Manage Users</h1>
              <p className="text-sm text-[#A9C0C7] max-w-md leading-relaxed">
                View, filter, edit, and manage all platform accounts including students, instructors, and administrators.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex-shrink-0 bg-[#4DE2BD] text-[#07181E] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#3ac9a8] transition-all flex items-center gap-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New User</span>
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              value={totalUsersCount}
              label="Total Platform Users"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              value={studentsCount}
              label="Enrolled Students"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              value={instructorsCount}
              label="Faculty Instructors"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={activeCount}
              label="Active Accounts"
            />
          </div>
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {['All', 'Student', 'Instructor', 'Admin'].map((role) => {
                const count =
                  role === 'All'
                    ? totalUsersCount
                    : users.filter((u) => u.role === role).length;
                const isActive = roleFilter === role;
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#123835] text-[#4DE2BD] border border-[#4DE2BD]/40 shadow-sm'
                        : 'text-[#A9C0C7] hover:text-white hover:bg-[#10272F]'
                    }`}
                  >
                    {role}s ({count})
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[#07181E] border border-[#1D363E] text-xs sm:text-sm text-white rounded-xl px-3.5 py-2.5 pr-8 appearance-none focus:outline-none focus:border-[#4DE2BD] transition-colors cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  placeholder="Search user name or email..."
                  className="w-full sm:w-60 bg-[#07181E] border border-[#1D363E] rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl overflow-hidden shadow-xl">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#14323A] text-[#4DE2BD] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No users found</h3>
                <p className="text-xs sm:text-sm text-[#A9C0C7] max-w-sm mb-4">
                  No user accounts match your criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('All');
                    setStatusFilter('All');
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
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Details</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D363E]/60 text-sm">
                    {filteredUsers.map((user) => {
                      const firstLetter = (user.name || 'U').charAt(0).toUpperCase();
                      return (
                        <tr key={user.id} className="hover:bg-[#0a1e26] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#143e39] text-[#4DE2BD] border border-[#4DE2BD]/40 font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                {firstLetter}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-[#A9C0C7] truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                                user.role === 'Admin'
                                  ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                                  : user.role === 'Instructor'
                                  ? 'bg-sky-950/40 text-sky-400 border-sky-500/30'
                                  : 'bg-emerald-950/40 text-[#4DE2BD] border-[#4DE2BD]/30'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                                user.status === 'Active'
                                  ? 'bg-[#143e39] text-[#4DE2BD] border-[#4DE2BD]/30'
                                  : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.status === 'Active' ? 'bg-[#4DE2BD]' : 'bg-rose-400'
                                }`}
                              />
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-xs text-[#A9C0C7]">
                            <p className="font-medium text-white/90">{user.detail || 'Standard Account'}</p>
                            <p className="text-[11px] text-[#A9C0C7]/70">Joined {user.joinedDate || 'Recently'}</p>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingUser(user)}
                                title="View User"
                                className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-[#4DE2BD] hover:bg-[#10272F] border border-[#1D363E] transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                title="Edit User"
                                className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-sky-400 hover:bg-[#10272F] border border-[#1D363E] transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
                                title="Delete User"
                                className="p-2 rounded-lg bg-[#07181E] text-[#A9C0C7] hover:text-rose-400 hover:bg-[#10272F] border border-[#1D363E] transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#143e39] text-[#4DE2BD] border border-[#4DE2BD]/40 font-black flex items-center justify-center text-xl shadow-md">
                {(viewingUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{viewingUser.name}</h3>
                <p className="text-xs text-[#A9C0C7]">{viewingUser.email}</p>
                <p className="text-[11px] text-[#4DE2BD] mt-0.5">ID: {viewingUser.id}</p>
              </div>
            </div>
            <div className="space-y-4 text-xs bg-[#07181E] border border-[#1D363E] p-4 rounded-xl">
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Account Role</span>
                <span className="font-bold text-white">{viewingUser.role}</span>
              </div>
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Account Status</span>
                <span className={`font-bold ${viewingUser.status === 'Active' ? 'text-[#4DE2BD]' : 'text-rose-400'}`}>
                  {viewingUser.status}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#1D363E]/60 pb-2">
                <span className="text-[#A9C0C7]">Joined Date</span>
                <span className="font-semibold text-white">{viewingUser.joinedDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9C0C7]">Activity / Metrics</span>
                <span className="font-semibold text-white">{viewingUser.detail || 'Standard Account'}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingUser(null);
              }}
              className="absolute top-4 right-4 text-[#A9C0C7] hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-black text-white mb-4">
              {editingUser ? 'Edit User Account' : 'Add New User Account'}
            </h3>
            <form onSubmit={editingUser ? handleSaveEditUser : handleSaveAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A9C0C7] mb-1">Account Notes / Info</label>
                <input
                  type="text"
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  placeholder="e.g. Enrolled in 3 courses"
                  className="w-full bg-[#07181E] border border-[#1D363E] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#4DE2BD]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4DE2BD] text-[#07181E] text-xs font-bold rounded-xl hover:bg-[#3ac9a8] transition-all"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D2229] border border-[#1D363E] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete User Account</h3>
            <p className="text-xs text-[#A9C0C7] mb-6">
              Are you sure you want to delete <span className="text-white font-bold">{deletingUser.name}</span> ({deletingUser.email})? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 bg-[#07181E] text-white text-xs font-bold rounded-xl border border-[#1D363E] hover:bg-[#10272F]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

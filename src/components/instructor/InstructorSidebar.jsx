import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Logo';

export default function InstructorSidebar({ mobileOpen, setMobileOpen, instructorName }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/instructor/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'My Courses',
      path: '/instructor/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Add Course',
      path: '/instructor/courses/add',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Course Management',
      path: '/instructor/courses/manage',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const firstLetter = (instructorName || 'Instructor').charAt(0).toUpperCase();

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#07181E] border-r border-[#1D363E] flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="h-[88px] px-6 flex items-center justify-between border-b border-[#1D363E]/50">
            <Link to="/">
              <Logo />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-[#A9C0C7] hover:text-white lg:hidden p-1.5"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#123835] text-[#4DE2BD] shadow-sm'
                      : 'text-[#A9C0C7] hover:bg-[#0D2229] hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#4DE2BD]' : 'text-[#A9C0C7]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1D363E]">
          <div
            onClick={() => navigate('/instructor/courses/manage')}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0D2229] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#4DE2BD] text-[#07181E] font-bold flex items-center justify-center text-sm shadow-sm">
                {firstLetter}
              </div>
              <span className="text-sm font-bold text-white truncate max-w-[120px]">
                {instructorName || 'Instructor'}
              </span>
            </div>
            <svg className="w-4 h-4 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
}

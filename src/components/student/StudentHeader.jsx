import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentHeader({ setMobileOpen, studentName }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const firstLetter = (studentName || 'Student').charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <header className="h-[88px] px-6 sm:px-10 flex items-center justify-between gap-4 border-b border-[#1D363E]/40 relative z-20">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[#A9C0C7] hover:text-white lg:hidden p-1.5 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <form onSubmit={handleSearch} className="relative w-full">
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
            placeholder="Search for courses, topics or instructors..."
            className="w-full bg-[#0D2229] border border-[#1D363E] rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/50 focus:outline-none focus:border-[#4DE2BD] transition-colors"
          />
        </form>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => navigate('/student/messages')}
          className="relative text-[#A9C0C7] hover:text-white p-2 transition-colors focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#07181E]" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#0D2229] transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#4DE2BD] text-[#07181E] font-bold flex items-center justify-center text-sm shadow-sm">
              {firstLetter}
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-white">
              Hi, {studentName || 'Student'}
            </span>
            <svg className="w-4 h-4 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0D2229] border border-[#1D363E] rounded-2xl py-2 shadow-2xl z-50">
              <div className="px-4 py-2 border-b border-[#1D363E]">
                <p className="text-xs text-[#A9C0C7]">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{studentName || 'Student'}</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/student/courses');
                }}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#A9C0C7] hover:bg-[#14323A] hover:text-[#4DE2BD] transition-colors"
              >
                My Courses
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/student/settings');
                }}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#A9C0C7] hover:bg-[#14323A] hover:text-[#4DE2BD] transition-colors"
              >
                Settings
              </button>
              <div className="border-t border-[#1D363E] my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-red-950/40 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

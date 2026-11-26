import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearCurrentSession } from '../../data/authStorage';

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
      navigate(`/student/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    clearCurrentSession();
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

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-[#0D2229] transition-colors focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#fbcfe8] text-[#831843] font-bold flex items-center justify-center text-sm shadow-sm">
              {firstLetter}
            </div>
            <span className="hidden sm:block text-sm font-bold text-white pr-1">
              {studentName}
            </span>
            <svg className="w-4 h-4 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0D2229] border border-[#1D363E] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#1D363E]/50">
                <p className="text-xs text-[#A9C0C7]">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{studentName}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-[#14323A] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { getCurrentSession, getDashboardPath } from '../data/authStorage';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(() => getCurrentSession());

  useEffect(() => {
    setSession(getCurrentSession());
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 h-[88px] flex items-center justify-between relative z-30">
      <div className="flex-shrink-0">
        <Link to="/" className="outline-none">
          <Logo />
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-12 text-[15px] font-medium">
        {navLinks.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <div key={item.path} className="relative flex flex-col items-center">
              <Link
                to={item.path}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#4DE2BD] font-semibold'
                    : 'text-[#A9C0C7] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
              {isActive && (
                <span className="w-8 h-[3px] bg-[#4DE2BD] rounded-full absolute -bottom-1"></span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="hidden sm:flex items-center space-x-7">
        <button
          onClick={() => navigate(session?.role === 'student' ? '/student/browse' : '/courses')}
          aria-label="Search"
          className="text-[#A9C0C7] hover:text-white transition-colors p-1.5 focus:outline-none"
        >
          <svg
            className="w-[22px] h-[22px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {session ? (
          <button
            onClick={() => navigate(getDashboardPath(session.role))}
            className="bg-[#14323A] border border-[#4DE2BD] text-[#4DE2BD] hover:bg-[#4DE2BD] hover:text-[#07181E] font-bold text-[14px] px-6 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Dashboard ({session.role.charAt(0).toUpperCase() + session.role.slice(1)})
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-[15px] px-8 py-2.5 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Login
          </button>
        )}
      </div>

      <div className="flex sm:hidden items-center space-x-3">
        {session ? (
          <button
            onClick={() => navigate(getDashboardPath(session.role))}
            className="bg-[#4DE2BD] text-[#07181E] font-bold text-xs px-3.5 py-1.5 rounded-full"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs px-4 py-1.5 rounded-full"
          >
            Login
          </button>
        )}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="text-[#A9C0C7] hover:text-white p-2 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-[88px] left-0 right-0 bg-[#0D2229] border-b border-[#1D363E] p-6 flex flex-col space-y-4 md:hidden z-50 shadow-2xl">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium py-2 ${
                location.pathname === item.path
                  ? 'text-[#4DE2BD]'
                  : 'text-[#A9C0C7]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {session && (
            <Link
              to={getDashboardPath(session.role)}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#4DE2BD] font-bold py-2 border-t border-[#1D363E] pt-4"
            >
              Go to Dashboard →
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'instructor', 'admin'].includes(roleParam.toLowerCase())) {
      setRole(roleParam.toLowerCase());
    }
  }, [searchParams]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify({ email, role, rememberMe }));

    if (role === 'student') {
      navigate('/student/dashboard');
    } else if (role === 'instructor') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#143e39]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0e2c2b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="pt-8 flex justify-center z-10">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-8 flex items-center justify-between z-10">
        <div className="hidden lg:flex w-1/4 justify-center items-end pb-8">
          <svg width="220" height="280" viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="220" rx="45" ry="8" fill="#051216" opacity="0.8" />
            
            <g transform="translate(10, 160)">
              <rect x="0" y="32" width="180" height="24" rx="12" fill="#135a44" />
              <rect x="0" y="16" width="175" height="24" rx="12" fill="#1b775b" />
              <rect x="15" y="0" width="150" height="22" rx="11" fill="#df9b6d" />
              <rect x="25" y="2" width="130" height="18" rx="9" fill="#f4ece4" />
            </g>

            <g transform="translate(62, 70)">
              <polygon points="12,85 64,85 56,125 20,125" fill="#1e2c38" />
              <rect x="8" y="80" width="60" height="7" rx="3" fill="#2d3f4e" />

              <path d="M38 85 Q10 55 4 20 Q24 35 38 75 Z" fill="#35c296" />
              <path d="M38 75 Q15 25 25 -15 Q42 15 42 70 Z" fill="#4de2bd" />
              <path d="M38 65 Q40 -5 50 -45 Q62 -5 44 60 Z" fill="#4de2bd" />
              <path d="M40 70 Q70 5 82 -15 Q75 30 44 75 Z" fill="#35c296" />
              <path d="M40 80 Q80 45 88 20 Q78 60 44 85 Z" fill="#4de2bd" />
            </g>
          </svg>
        </div>

        <div className="w-full max-w-md mx-auto bg-[#0D2229] border border-[#1D363E] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-[#A9C0C7] text-sm">
              Login to your account
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-950/40 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A9C0C7] pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your email"
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#A9C0C7] pointer-events-none">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#A9C0C7] hover:text-white"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#4DE2BD] transition-colors appearance-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-[#A9C0C7]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#A9C0C7]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#091B21] border-[#1D363E] text-[#4DE2BD] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link would be sent to your registered email.')}
                className="text-[#4DE2BD] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-base py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-glow-brand transform hover:translate-y-[-1px] active:translate-y-[0px] mt-2"
            >
              Login
            </button>
          </form>

          <div className="text-center text-xs text-[#A9C0C7] mt-6">
            Don't have an account?{' '}
            <Link to={`/signup?role=${role}`} className="text-[#4DE2BD] font-bold hover:underline ml-1">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex w-1/4 flex-col items-start pl-8">
          <p className="text-white text-xl font-medium leading-relaxed max-w-[200px] mb-3">
            "Education is the key to a brighter future."
          </p>
          <div className="w-10 h-1 bg-[#4DE2BD] rounded-full"></div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

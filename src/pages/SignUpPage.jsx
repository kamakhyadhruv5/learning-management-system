import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'instructor', 'admin'].includes(roleParam.toLowerCase())) {
      setRole(roleParam.toLowerCase());
    }
  }, [searchParams]);

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const newUser = { fullName, email, role, createdAt: new Date().toISOString() };
    localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));
    localStorage.setItem('currentUser', JSON.stringify({ email, role, fullName }));

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
      <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-[#143e39]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0e2c2b]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="pt-8 flex justify-center z-10">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-8 flex items-center justify-center z-10">
        <div className="w-full max-w-lg bg-[#0D2229] border border-[#1D363E] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-[#A9C0C7] text-sm">
              Join thousands of learners and instructors today
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-950/40 border border-red-500/50 text-red-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError('');
                }}
                placeholder="John Smith"
                className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="john@example.com"
                className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter password"
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#A9C0C7]/40 focus:outline-none focus:border-[#4DE2BD] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Select Your Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#091B21] border border-[#1D363E] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE2BD] transition-colors appearance-none cursor-pointer"
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

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#A9C0C7]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-[#091B21] border-[#1D363E] text-[#4DE2BD] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <span className="text-[#4DE2BD] hover:underline">Terms of Service</span> and{' '}
                  <span className="text-[#4DE2BD] hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm sm:text-base py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-glow-brand transform hover:translate-y-[-1px] active:translate-y-[0px] mt-2"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-xs text-[#A9C0C7] mt-6">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="text-[#4DE2BD] font-bold hover:underline ml-1">
              Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/student/StatCard';
import { adminData } from '../../data/adminData';
import { useNavigate } from 'react-router-dom';

function UserGrowthChart({ data }) {
  const width = 540;
  const height = 180;
  const padL = 40;
  const padR = 20;
  const padT = 16;
  const padB = 32;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.students)) * 1.1;

  const toX = (i) => padL + (i / (data.length - 1)) * chartW;
  const toY = (v) => padT + chartH - (v / maxVal) * chartH;

  const studentPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d.students)}`).join(' ');
  const studentArea = `${studentPath} L${toX(data.length - 1)},${padT + chartH} L${toX(0)},${padT + chartH} Z`;

  const instrPath = data.map((d, i) => {
    const yInstr = padT + chartH - ((d.instructors * 15) / maxVal) * chartH;
    return `${i === 0 ? 'M' : 'L'}${toX(i)},${yInstr}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="adminStudentGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4DE2BD" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4DE2BD" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padL}
          y1={padT + chartH - t * chartH}
          x2={padL + chartW}
          y2={padT + chartH - t * chartH}
          stroke="#1D363E"
          strokeWidth="1"
        />
      ))}
      <path d={studentArea} fill="url(#adminStudentGrad)" />
      <path d={studentPath} fill="none" stroke="#4DE2BD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={instrPath} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={toX(i)} cy={toY(d.students)} r="4" fill="#4DE2BD" />
          <text x={toX(i)} y={padT + chartH + 20} textAnchor="middle" fill="#A9C0C7" fontSize="10" fontFamily="inherit">
            {d.month}
          </text>
        </g>
      ))}
      {[0, Math.round(maxVal * 0.5), Math.round(maxVal)].map((v) => (
        <text
          key={v}
          x={padL - 6}
          y={toY(v) + 4}
          textAnchor="end"
          fill="#A9C0C7"
          fontSize="9"
          fontFamily="inherit"
        >
          {v}
        </text>
      ))}
    </svg>
  );
}

function DonutChart({ data, total }) {
  const r = 60;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = data.map((cat) => {
    const dashLen = (cat.percentage / 100) * circumference;
    const segment = { ...cat, dashLen, startOffset: offset };
    offset += dashLen;
    return segment;
  });

  return (
    <svg viewBox="0 0 180 180" className="w-full h-full">
      {segments.map((seg) => (
        <circle
          key={seg.name}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth="22"
          strokeDasharray={`${seg.dashLen} ${circumference}`}
          strokeDashoffset={-(seg.startOffset)}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="inherit">
        {total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#A9C0C7" fontSize="9" fontFamily="inherit">
        Courses
      </text>
    </svg>
  );
}

function ActivityIcon({ type }) {
  if (type === 'user') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  }
  if (type === 'course') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }
  if (type === 'instructor') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

const typeColors = {
  user: '#4DE2BD',
  course: '#38BDF8',
  instructor: '#A855F7',
  settings: '#F59E0B',
  category: '#EC4899',
};

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (stored.fullName) setAdminName(stored.fullName);
    else if (stored.email) setAdminName(stored.email.split('@')[0]);
  }, []);

  const quickActions = [
    { label: 'Add New User', icon: '👤', path: '/admin/users', color: '#4DE2BD' },
    { label: 'Add New Course', icon: '📚', path: '/admin/courses', color: '#38BDF8' },
    { label: 'View Reports', icon: '📊', path: '/admin/reports', color: '#A855F7' },
    { label: 'Settings', icon: '⚙️', path: '/admin/settings', color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-[#07181E] text-white flex">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} adminName={adminName} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader setMobileOpen={setMobileOpen} adminName={adminName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-56 opacity-10 pointer-events-none select-none">
              <svg viewBox="0 0 200 180" className="w-full h-full" fill="none">
                <circle cx="160" cy="40" r="60" fill="#4DE2BD" />
                <rect x="40" y="80" width="80" height="100" rx="8" fill="#38BDF8" opacity="0.6" />
                <rect x="20" y="60" width="50" height="120" rx="6" fill="#4DE2BD" opacity="0.4" />
                <circle cx="100" cy="50" r="20" fill="white" opacity="0.4" />
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-xs text-[#4DE2BD] font-semibold uppercase tracking-widest mb-1">Administration</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Welcome back, {adminName}!</h1>
              <p className="text-sm text-[#A9C0C7] max-w-md leading-relaxed">
                A better learning world starts with greater management.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/reports')}
              className="flex-shrink-0 bg-[#4DE2BD] text-[#07181E] font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#3ac9a8] transition-all relative z-10"
            >
              View Reports
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              value={adminData.stats.totalStudents}
              label="Total Students"
            />
            <StatCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              value={adminData.stats.totalInstructors}
              label="Instructors"
            />
            <StatCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
              value={adminData.stats.totalCourses}
              label="Total Courses"
            />
            <StatCard
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
              value={adminData.stats.totalCategories}
              label="Categories"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">User Growth</h3>
                  <p className="text-xs text-[#A9C0C7] mt-0.5">Jan – Jun 2026</p>
                </div>
                <div className="flex items-center gap-2 bg-[#143e39] border border-[#4DE2BD]/30 rounded-full px-3 py-1.5">
                  <span className="text-[#4DE2BD] text-xs font-bold">+18%</span>
                  <svg className="w-3.5 h-3.5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#4DE2BD] rounded-full inline-block" />
                  <span className="text-xs text-[#A9C0C7]">Students ({adminData.stats.totalStudents})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-px bg-[#38BDF8] inline-block" style={{borderTop:'2px dashed #38BDF8',height:0}} />
                  <span className="text-xs text-[#A9C0C7]">Instructors ({adminData.stats.totalInstructors})</span>
                </div>
              </div>
              <div className="h-48">
                <UserGrowthChart data={adminData.userGrowth} />
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 flex flex-col">
              <h3 className="text-base font-bold text-white mb-4">Recent Activity</h3>
              <div className="flex-1 space-y-1">
                {adminData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#0a1e26] transition-colors">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${typeColors[activity.type]}18`, color: typeColors[activity.type] }}
                    >
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight">{activity.title}</p>
                      <p className="text-[11px] text-[#A9C0C7] mt-0.5 leading-tight line-clamp-2">{activity.detail}</p>
                      <p className="text-[10px] text-[#4DE2BD]/70 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Course Distribution</h3>
              <div className="w-40 h-40 mx-auto mb-4">
                <DonutChart data={adminData.categoryDistribution} total={adminData.stats.totalCourses} />
              </div>
              <div className="space-y-2.5">
                {adminData.categoryDistribution.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs text-[#A9C0C7] truncate">{cat.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white ml-2 flex-shrink-0">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-[#07181E] border border-[#1D363E] hover:border-[#29444C] hover:bg-[#0a1e26] transition-all group"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <span className="text-xs font-semibold text-[#A9C0C7] group-hover:text-white text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {adminData.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#0a1e26] transition-colors">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-[#07181E] border border-[#1D363E] flex-shrink-0 text-center">
                      <span className="text-sm font-black text-[#4DE2BD] leading-none">{task.date}</span>
                      <span className="text-[9px] text-[#A9C0C7] leading-none mt-0.5">{task.month}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight">{task.title}</p>
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                        style={task.urgent
                          ? { backgroundColor: '#7f1d1d40', color: '#f87171' }
                          : { backgroundColor: '#14323A', color: '#4DE2BD' }}
                      >
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

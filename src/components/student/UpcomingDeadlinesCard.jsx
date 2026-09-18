import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpcomingDeadlinesCard() {
  const navigate = useNavigate();

  const deadlines = [
    {
      date: '15',
      month: 'Sep',
      title: 'Data Structures - Quiz 1',
      due: 'Due in 2 days',
      urgent: true,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      date: '18',
      month: 'Sep',
      title: 'Cloud Computing - Assignment',
      due: 'Due in 5 days',
      urgent: false,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
    {
      date: '22',
      month: 'Sep',
      title: 'Web Development - Project',
      due: 'Due in 9 days',
      urgent: false,
      icon: (
        <svg className="w-5 h-5 text-[#A9C0C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Upcoming Deadlines
        </h3>
        <button
          onClick={() => navigate('/student/quizzes')}
          className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
        >
          View All →
        </button>
      </div>

      <div className="space-y-3">
        {deadlines.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#10272F] transition-colors border border-transparent hover:border-[#1D363E]"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold leading-none flex-shrink-0 ${
                  item.urgent
                    ? 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                    : 'bg-[#14323A] text-[#A9C0C7] border border-[#1D363E]'
                }`}
              >
                <span className="text-sm font-extrabold">{item.date}</span>
                <span className="text-[10px] uppercase mt-0.5">{item.month}</span>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {item.title}
                </h4>
                <p
                  className={`text-[11px] mt-0.5 ${
                    item.urgent ? 'text-rose-400 font-medium' : 'text-[#A9C0C7]'
                  }`}
                >
                  {item.due}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#091B21] flex items-center justify-center">
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

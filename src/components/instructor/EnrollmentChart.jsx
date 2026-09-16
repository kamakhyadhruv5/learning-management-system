import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnrollmentChart() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Student Enrollment
        </h3>
        <button
          onClick={() => navigate('/instructor/courses')}
          className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
        >
          View All →
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 w-full h-44 flex items-end">
          <div className="w-full h-full flex flex-col justify-between relative">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-[#A9C0C7]" />
                <div className="border-b border-[#A9C0C7]" />
                <div className="border-b border-[#A9C0C7]" />
                <div className="border-b border-[#A9C0C7]" />
              </div>

              <svg
                viewBox="0 0 300 130"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4DE2BD" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4DE2BD" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 10 100 Q 55 85 90 70 T 170 80 T 235 45 T 290 15 L 290 120 L 10 120 Z"
                  fill="url(#chartFill)"
                />

                <path
                  d="M 10 100 Q 55 85 90 70 T 170 80 T 235 45 T 290 15"
                  fill="none"
                  stroke="#4DE2BD"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="10" cy="100" r="3.5" fill="#4DE2BD" />
                <circle cx="90" cy="70" r="3.5" fill="#4DE2BD" />
                <circle cx="170" cy="80" r="3.5" fill="#4DE2BD" />
                <circle cx="235" cy="45" r="3.5" fill="#4DE2BD" />
                <circle cx="290" cy="15" r="4" fill="#FFFFFF" stroke="#4DE2BD" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#A9C0C7] font-medium pt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-36 flex flex-col justify-center space-y-4 border-t sm:border-t-0 sm:border-l border-[#1D363E] pt-4 sm:pt-0 sm:pl-6">
          <div>
            <div className="text-3xl font-black text-white leading-none mb-1">
              128
            </div>
            <div className="text-xs text-[#A9C0C7] font-medium">
              Total Students
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-[#4DE2BD] text-sm font-bold bg-[#143e39] px-2.5 py-1 rounded-lg border border-[#4DE2BD]/30">
              <span>+12%</span>
              <span>↗</span>
            </div>
            <div className="text-[11px] text-[#A9C0C7] mt-1">
              from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

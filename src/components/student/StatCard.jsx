import React from 'react';

export default function StatCard({ icon, value, label }) {
  return (
    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-5 flex items-center gap-4.5 shadow-md hover:border-[#29444C] transition-all">
      <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center text-[#4DE2BD] flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-black text-white leading-none mb-1">
          {value}
        </div>
        <div className="text-xs text-[#A9C0C7] font-medium leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendedCourseItem({ item }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#10272F] transition-colors border border-transparent hover:border-[#1D363E]">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-[#091B21] border border-[#1D363E] flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
            {item.title}
          </h4>
          <p className="text-[11px] text-[#A9C0C7] mt-0.5">
            {item.instructor}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-[#A9C0C7] mt-1">
            <span className="text-[#4DE2BD] font-bold">★ {item.rating}</span>
            <span>•</span>
            <span>{item.students}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(item.link || '/courses')}
        className="bg-transparent hover:bg-[#4DE2BD] text-[#4DE2BD] hover:text-[#07181E] border border-[#4DE2BD] text-xs font-bold px-4 py-1.5 rounded-full transition-all"
      >
        View
      </button>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyCourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-4 flex flex-col justify-between hover:border-[#29444C] transition-all">
      <div>
        <div className="w-full h-28 rounded-xl overflow-hidden bg-[#07181E] mb-3.5 border border-[#1D363E]/60">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">
          {course.title}
        </h4>
        <p className="text-xs text-[#A9C0C7] mb-3">
          {course.instructor}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-[#A9C0C7] mb-1">
            <span>Progress</span>
            <span className="font-bold text-white">{course.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
            <div
              className={`h-full rounded-full ${course.progressColor || 'bg-[#4DE2BD]'}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(course.link || '/courses/full-stack-web-development')}
        className="w-full bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-xs py-2 rounded-xl border border-[#1D363E] hover:border-[#4DE2BD] transition-all"
      >
        Continue Learning
      </button>
    </div>
  );
}

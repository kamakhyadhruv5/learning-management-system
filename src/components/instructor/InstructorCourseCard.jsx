import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructorCourseCard({ course }) {
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

        <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">
          {course.title}
        </h4>

        <div className="flex items-center gap-4 text-xs text-[#A9C0C7] mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{course.studentsCount} students</span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#4DE2BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{course.lessonsCount} lessons</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-lg ${
            course.status === 'Published'
              ? 'bg-[#143e39] text-[#4DE2BD] border border-[#4DE2BD]/30'
              : 'bg-[#2a2216] text-[#fbbf24] border border-[#fbbf24]/30'
          }`}
        >
          {course.status}
        </span>

        <button
          onClick={() => navigate('/instructor/courses')}
          aria-label="Course options"
          className="text-[#A9C0C7] hover:text-white p-1 rounded-lg hover:bg-[#14323A] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

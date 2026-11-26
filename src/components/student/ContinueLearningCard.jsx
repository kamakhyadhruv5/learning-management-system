import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContinueLearningCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0D2229] border border-[#1D363E] rounded-2xl p-6 shadow-lg flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Continue Learning
        </h3>
        <button
          onClick={() => navigate('/student/courses')}
          className="text-xs font-semibold text-[#4DE2BD] hover:underline flex items-center gap-1"
        >
          View All →
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-[#07181E] flex-shrink-0 border border-[#1D363E]/60">
          <img
            src="https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=600&auto=format&fit=crop"
            alt="Web Development (Full Stack)"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="text-base font-bold text-white leading-snug">
                Web Development (Full Stack)
              </h4>
              <p className="text-xs text-[#A9C0C7] mt-0.5">
                Dr. Sarah Khan
              </p>
            </div>

            <button
              onClick={() => navigate('/courses/full-stack-web-development')}
              className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex-shrink-0 self-start sm:self-auto"
            >
              Continue
            </button>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-[#A9C0C7] mb-1.5">
              <span>Progress</span>
              <span className="font-bold text-white">60%</span>
            </div>
            <div className="w-full h-2 bg-[#091B21] rounded-full overflow-hidden border border-[#1D363E]">
              <div className="h-full bg-[#4DE2BD] rounded-full w-[60%]"></div>
            </div>
          </div>

          <p className="text-xs text-[#A9C0C7]">
            <span className="text-white font-medium">Next Lesson:</span> Introduction to React
          </p>
        </div>
      </div>
    </div>
  );
}

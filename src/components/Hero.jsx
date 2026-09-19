import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroIllustration from './HeroIllustration';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full max-w-[1380px] mx-auto px-6 sm:px-10 pt-4 pb-6 lg:pt-8 lg:pb-8 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
      <div className="w-full lg:w-[54%] z-10">
        <p className="text-[#A9C0C7] text-[12px] sm:text-[13px] font-semibold tracking-[0.22em] uppercase mb-3">
          Learning Anytime, Anywhere
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-black text-white tracking-tight leading-tight lg:whitespace-nowrap mb-4">
          Learn. <span className="text-[#4DE2BD]">Grow.</span> Succeed.
        </h1>

        <p className="text-[#A9C0C7] text-base sm:text-[19px] lg:text-[21px] font-normal leading-snug max-w-lg mb-7">
          Your complete learning management platform for modern education.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-[15px] px-7 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-glow-brand transform hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <span>Explore Courses</span>
            <span className="text-base leading-none">→</span>
          </button>

          <button
            onClick={() => navigate('/signup')}
            className="bg-transparent border-[1.5px] border-[#4DE2BD] text-[#4DE2BD] hover:bg-[#4DE2BD]/10 font-bold text-[15px] px-8 py-3 rounded-full transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        <div className="flex items-center space-x-12 sm:space-x-16">
          <div>
            <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-none">
              10K+
            </div>
            <div className="text-xs sm:text-[13px] text-[#A9C0C7] font-medium mt-1">
              Students
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-none">
              500+
            </div>
            <div className="text-xs sm:text-[13px] text-[#A9C0C7] font-medium mt-1">
              Courses
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-none">
              50+
            </div>
            <div className="text-xs sm:text-[13px] text-[#A9C0C7] font-medium mt-1">
              Instructors
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[46%] flex justify-center lg:justify-end items-center relative">
        <HeroIllustration />
      </div>
    </section>
  );
}

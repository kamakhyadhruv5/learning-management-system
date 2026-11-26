import React from 'react';

const features = [
  {
    icon: (
      <svg
        className="w-[22px] h-[22px] text-[#4DE2BD]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: 'Rich Courses',
    description: 'Access a wide range of courses and materials.',
  },
  {
    icon: (
      <svg
        className="w-[22px] h-[22px] text-[#4DE2BD]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Learn at Your Pace',
    description: 'Study anytime, anywhere at your own speed.',
  },
  {
    icon: (
      <svg
        className="w-[22px] h-[22px] text-[#4DE2BD]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
    title: 'Assessments',
    description: 'Take quizzes and evaluate your knowledge.',
  },
  {
    icon: (
      <svg
        className="w-[22px] h-[22px] text-[#4DE2BD]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Track Progress',
    description: 'Monitor your learning journey and achievements.',
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 pt-2 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-7 hover:border-[#29444C] hover:bg-[#10272F] transition-all duration-200 group cursor-pointer shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-[#14323A] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#193F4A] transition-all duration-200">
              {feature.icon}
            </div>

            <h3 className="text-white text-[17px] font-bold mb-2 tracking-tight">
              {feature.title}
            </h3>

            <p className="text-[#A9C0C7] text-[13px] sm:text-[14px] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

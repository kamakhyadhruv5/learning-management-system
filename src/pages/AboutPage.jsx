import React from 'react';

const values = [
  ['Flexible learning', 'Learn at the pace and time that works best for you.'],
  ['Practical skills', 'Explore focused courses built around real-world knowledge.'],
  ['Progress that matters', 'Stay motivated with a clear, purposeful learning journey.'],
];

export default function AboutPage() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-[#4DE2BD] text-xs font-semibold tracking-[0.2em] uppercase mb-3">About LMS</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5">Learning designed for real life.</h1>
        <p className="text-[#A9C0C7] text-base sm:text-lg leading-relaxed">
          LMS brings learners and educators together in one focused space. Our goal is to make meaningful education accessible, structured, and easy to continue from anywhere.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map(([title, description]) => (
          <article key={title} className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-7 shadow-lg">
            <div className="w-11 h-11 rounded-full bg-[#14323A] border border-[#1D363E] flex items-center justify-center text-[#4DE2BD] text-lg font-bold mb-5">+</div>
            <h2 className="text-white text-lg font-bold mb-2">{title}</h2>
            <p className="text-[#A9C0C7] text-sm leading-relaxed">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

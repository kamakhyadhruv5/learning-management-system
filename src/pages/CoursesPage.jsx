import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCatalogCourses } from '../data/courseCatalog';

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState(() => getCatalogCourses());
  const query = searchParams.get('search')?.trim().toLowerCase() || '';

  useEffect(() => {
    const reloadCourses = () => setCourses(getCatalogCourses());
    window.addEventListener('instructor_courses_updated', reloadCourses);
    return () => window.removeEventListener('instructor_courses_updated', reloadCourses);
  }, []);

  const visibleCourses = courses.filter((course) => !query || [course.title, course.instructor, course.category]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query)));

  return (
    <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <div className="max-w-2xl mb-10 sm:mb-12">
        <p className="text-[#4DE2BD] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Explore learning</p>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Courses for every next step.</h1>
        <p className="text-[#A9C0C7] text-base sm:text-lg leading-relaxed">
          Build practical skills with expert-led courses designed for flexible, modern learning.
        </p>
      </div>

      {visibleCourses.length === 0 ? (
        <div className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-10 text-center text-[#A9C0C7] text-sm">No courses match your search.</div>
      ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCourses.map((course) => (
          <article key={course.id} className="bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl overflow-hidden shadow-lg flex flex-col">
            <div className="relative h-48 bg-[#07181E] overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#07181E]/80 backdrop-blur-md border border-[#1D363E] text-[#4DE2BD] text-xs font-semibold px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-[#07181E]/85 backdrop-blur-md border border-[#1D363E] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {course.rating ? <><span className="text-[#4DE2BD]">★</span> {course.rating}</> : 'New'}
              </span>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-white text-lg font-bold mb-2 leading-snug">{course.title}</h2>
              <p className="text-[#A9C0C7] text-sm leading-relaxed mb-5 flex-1">{course.description}</p>
              <div className="border-t border-[#1D363E] pt-4 flex items-center justify-between gap-4 text-xs text-[#A9C0C7]">
                <span>{course.instructor || 'Instructor unavailable'}</span>
                <span className="text-[#4DE2BD] font-semibold whitespace-nowrap">{course.lessonsCount} lessons</span>
              </div>
              <Link to={`/courses/${course.id}`} className="mt-5 inline-flex items-center justify-center bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] font-bold text-sm py-2.5 rounded-xl transition-all">View Course</Link>
            </div>
          </article>
        ))}
      </div>}
    </section>
  );
}

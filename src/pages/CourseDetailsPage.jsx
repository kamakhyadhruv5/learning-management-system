import { Link, useParams } from 'react-router-dom';
import { getCatalogCourseById } from '../data/courseCatalog';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const course = getCatalogCourseById(id);

  if (!course) {
    return (
      <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
        <div className="max-w-xl bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-8 shadow-lg">
          <p className="text-[#4DE2BD] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Course unavailable</p>
          <h1 className="text-3xl font-black text-white tracking-tight mb-3">We couldn’t find that course.</h1>
          <p className="text-[#A9C0C7] text-sm leading-relaxed mb-6">The course may have been removed or the link is no longer valid.</p>
          <Link to="/courses" className="inline-flex bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-sm px-5 py-3 rounded-xl transition-all">Back to Courses</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1380px] mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#4DE2BD] hover:underline mb-7">← Back to Courses</Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          {course.image && <img src={course.image} alt={course.title} className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-[#1D363E] shadow-lg" />}
          <div className="mt-7">
            <span className="inline-flex bg-[#14323A] border border-[#1D363E] text-[#4DE2BD] text-xs font-semibold px-3 py-1 rounded-full">{course.category}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4 mb-4">{course.title}</h1>
            {course.description && <p className="text-[#A9C0C7] text-base leading-relaxed">{course.description}</p>}
          </div>
        </div>
        <aside className="lg:col-span-5 bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 shadow-lg h-fit">
          <h2 className="text-lg font-bold text-white mb-5">Course Overview</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Instructor</dt><dd className="text-white font-semibold text-right">{course.instructor || 'Not listed'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Lessons</dt><dd className="text-white font-semibold">{course.lessonsCount || 'Not listed'}</dd></div>
            {course.duration && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Duration</dt><dd className="text-white font-semibold">{course.duration}</dd></div>}
            {course.level && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Level</dt><dd className="text-white font-semibold text-right">{course.level}</dd></div>}
            {course.price && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Price</dt><dd className="text-[#4DE2BD] font-bold">{course.price}</dd></div>}
          </dl>
        </aside>
      </div>
      {course.syllabus?.length > 0 && (
        <div className="mt-10 bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-5">Course Syllabus</h2>
          <div className="space-y-5">{course.syllabus.map((module) => <div key={module.title} className="border-l-2 border-[#4DE2BD] pl-4"><h3 className="text-white font-semibold mb-2">{module.title}</h3><ul className="space-y-1 text-sm text-[#A9C0C7]">{module.lessons?.map((lesson) => <li key={lesson}>• {lesson}</li>)}</ul></div>)}</div>
        </div>
      )}
    </section>
  );
}

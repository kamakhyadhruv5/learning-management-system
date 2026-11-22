import { Link, useParams } from 'react-router-dom';
import { getCatalogCourseById } from '../data/courseCatalog';
import { getMaterialsByCourse, MATERIAL_TYPES } from '../data/materialStorage';
import { getQuizzesByCourse } from '../data/quizStorage';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const course = getCatalogCourseById(id);

  const materials = course ? getMaterialsByCourse(course.id) : [];
  const quizzes = course ? getQuizzesByCourse(course.id).filter((q) => q.status === 'Published') : [];

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
            <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Lessons</dt><dd className="text-white font-semibold">{course.lessons?.length || course.lessonsCount || 'Not listed'}</dd></div>
            {course.duration && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Duration</dt><dd className="text-white font-semibold">{course.duration}</dd></div>}
            {course.level && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Level</dt><dd className="text-white font-semibold text-right">{course.level}</dd></div>}
            {course.price && <div className="flex justify-between gap-4"><dt className="text-[#A9C0C7]">Price</dt><dd className="text-[#4DE2BD] font-bold">{course.price}</dd></div>}
          </dl>
          {quizzes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#1D363E]">
              <Link
                to="/student/quizzes"
                className="w-full inline-flex items-center justify-center bg-[#4DE2BD] hover:bg-[#41D1AC] text-[#07181E] font-bold text-xs py-3 rounded-xl transition-all shadow-md"
              >
                Attempt Course Quizzes ({quizzes.length})
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* Structured Course Lessons */}
      {course.lessons?.length > 0 && (
        <div className="mt-10 bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Course Curriculum & Lessons</h2>
            <span className="text-xs font-semibold text-[#4DE2BD] bg-[#143e39] px-3 py-1 rounded-full border border-[#4DE2BD]/30">
              {course.lessons.length} Modules
            </span>
          </div>
          <div className="space-y-3">
            {course.lessons.map((lesson, idx) => (
              <div
                key={lesson.id || idx}
                className="p-4 rounded-xl bg-[#07181E] border border-[#1D363E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#14323A] text-[#4DE2BD] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{lesson.title}</h3>
                    {lesson.description && <p className="text-xs text-[#A9C0C7] mt-0.5">{lesson.description}</p>}
                  </div>
                </div>
                <span className="text-xs text-[#A9C0C7] font-semibold bg-[#0D2229] px-3 py-1 rounded-lg border border-[#1D363E] self-start sm:self-center">
                  ⏱ {lesson.duration || '30 mins'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Materials & Resources */}
      {materials.length > 0 && (
        <div className="mt-10 bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Course Materials & Downloads</h2>
            <span className="text-xs font-semibold text-[#4DE2BD] bg-[#143e39] px-3 py-1 rounded-full border border-[#4DE2BD]/30">
              {materials.length} Resources Available
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((mat) => {
              const typeInfo = MATERIAL_TYPES.find((t) => t.value === mat.type) || { icon: '📄', label: 'Document' };
              return (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl bg-[#07181E] border border-[#1D363E] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-[#4DE2BD] bg-[#14323A] px-2 py-0.5 rounded">
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className="text-[11px] text-[#A9C0C7]">{mat.fileSize || '1.0 MB'}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{mat.title}</h3>
                    <p className="text-[11px] text-[#A9C0C7] mb-3">{mat.description || mat.lessonTitle || 'Course learning resource'}</p>
                  </div>
                  <a
                    href={mat.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#14323A] hover:bg-[#4DE2BD] hover:text-[#07181E] text-[#4DE2BD] py-2 px-3 rounded-lg border border-[#4DE2BD]/30 transition-all w-fit"
                  >
                    <span>Download / View Resource</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy Syllabus if available */}
      {course.syllabus?.length > 0 && !course.lessons?.length && (
        <div className="mt-10 bg-[#0D2229]/95 border border-[#1D363E] rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-5">Course Syllabus</h2>
          <div className="space-y-5">
            {course.syllabus.map((module) => (
              <div key={module.title} className="border-l-2 border-[#4DE2BD] pl-4">
                <h3 className="text-white font-semibold mb-2">{module.title}</h3>
                <ul className="space-y-1 text-sm text-[#A9C0C7]">
                  {module.lessons?.map((lesson) => (
                    <li key={lesson}>• {lesson}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

import { Link } from "react-router-dom"

function CourseCard({ course }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-700 bg-[#0d2630] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400">

      <div className="mb-4">
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
          {course.category}
        </span>
      </div>

      <h2 className="text-xl font-bold text-white">
        {course.title}
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Instructor: {course.instructor}
      </p>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-300">
        {course.description}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="rounded-lg bg-slate-700/50 px-3 py-1 text-sm font-medium text-slate-300">
          {course.level}
        </span>

        <Link
          to={`/courses/${course.id}`}
          className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a22] transition hover:bg-emerald-300"
        >
          View Details
        </Link>

      </div>

    </div>
  )
}

export default CourseCard
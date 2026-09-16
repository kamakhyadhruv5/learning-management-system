import { Link } from "react-router-dom"

function CourseCard({ course }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

      <div className="mb-4">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          {course.category}
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-800">
        {course.title}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Instructor: {course.instructor}
      </p>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
        {course.description}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {course.level}
        </span>

        <Link
          to={`/courses/${course.id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          View Details
        </Link>

      </div>

    </div>
  )
}

export default CourseCard
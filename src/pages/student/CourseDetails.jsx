import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import courses from "../../data/courses.json"

function CourseDetails() {
  const { id } = useParams()

  const course = courses.find(
    (course) => course.id === Number(id)
  )

  const [enrolled, setEnrolled] = useState(false)

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-700">
          Course not found
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">

        <Link
          to="/student/dashboard"
          className="text-2xl font-bold text-indigo-600"
        >
          LearnHub
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
            S
          </div>

          <span className="font-medium text-slate-700">
            Student
          </span>
        </div>

      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <Link
          to="/courses"
          className="mb-6 inline-block font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Courses
        </Link>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-4 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
              {course.category}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {course.level}
            </span>

          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            {course.title}
          </h1>

          <p className="mt-3 text-slate-500">
            Instructor: {course.instructor}
          </p>

          <div className="my-7 border-t border-slate-200"></div>

          <h2 className="text-xl font-semibold text-slate-800">
            About this course
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            {course.description}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-800">
                Lessons
              </h2>

              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                      {index + 1}
                    </div>

                    <p className="text-slate-700">
                      {lesson}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold text-slate-800">
                Study Materials
              </h2>

              <div className="space-y-3">
                {course.materials.map((material, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-700"
                  >
                    📄 {material}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-slate-200 pt-6">

            <button
              onClick={() => setEnrolled(true)}
              disabled={enrolled}
              className={`rounded-lg px-6 py-3 font-medium text-white transition ${
                enrolled
                  ? "cursor-not-allowed bg-green-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {enrolled ? "Enrolled ✓" : "Enroll Now"}
            </button>

          </div>

        </div>

      </main>

    </div>
  )
}

export default CourseDetails
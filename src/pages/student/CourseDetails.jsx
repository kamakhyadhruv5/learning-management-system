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
      <div className="flex min-h-screen items-center justify-center bg-[#071a22]">
        <h2 className="text-2xl font-bold text-white">
          Course not found
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#071a22] text-white">

      <nav className="flex h-16 items-center justify-between border-b border-slate-700 bg-[#0b2029] px-8">

        <Link
          to="/student/dashboard"
          className="text-2xl font-bold text-white"
        >
          <span className="text-emerald-400">▣</span> LMS
        </Link>

        <div className="flex items-center gap-3">

          <span className="text-lg">
            🔔
          </span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-semibold text-[#071a22]">
            S
          </div>

          <span className="font-medium text-slate-200">
            Student
          </span>

        </div>

      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <Link
          to="/courses"
          className="mb-6 inline-block font-medium text-emerald-400 transition hover:text-emerald-300"
        >
          ← Back to Courses
        </Link>

        <div className="rounded-xl border border-slate-700 bg-[#0d2630] p-8">

          <div className="mb-4 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-400">
              {course.category}
            </span>

            <span className="rounded-full bg-slate-700/50 px-3 py-1 text-sm font-medium text-slate-300">
              {course.level}
            </span>

          </div>

          <h1 className="text-3xl font-bold text-white">
            {course.title}
          </h1>

          <p className="mt-3 text-slate-400">
            Instructor: {course.instructor}
          </p>

          <div className="my-7 border-t border-slate-700"></div>

          <h2 className="text-xl font-semibold text-white">
            About this course
          </h2>

          <p className="mt-3 leading-7 text-slate-300">
            {course.description}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">

            <div>

              <h2 className="mb-4 text-xl font-semibold text-white">
                Lessons
              </h2>

              <div className="space-y-3">

                {course.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#071a22] p-4 transition hover:border-emerald-400"
                  >

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-semibold text-emerald-400">
                      {index + 1}
                    </div>

                    <p className="text-slate-300">
                      {lesson}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            <div>

              <h2 className="mb-4 text-xl font-semibold text-white">
                Study Materials
              </h2>

              <div className="space-y-3">

                {course.materials.map((material, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-700 bg-[#071a22] p-4 text-slate-300 transition hover:border-emerald-400"
                  >
                    📄 {material}
                  </div>
                ))}

              </div>

              <div className="mt-8">

                <h2 className="mb-4 text-xl font-semibold text-white">
                  Video Resource
                </h2>

                <a
                  href={course.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-[#071a22] p-4 transition hover:border-emerald-400"
                >

                  <div>
                    <p className="font-semibold text-white">
                      ▶ YouTube Tutorial
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Watch complete course tutorial
                    </p>
                  </div>

                  <span className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-[#071a22]">
                    Watch
                  </span>

                </a>

              </div>

            </div>

          </div>

          <div className="mt-10 border-t border-slate-700 pt-6">

            <button
              onClick={() => setEnrolled(true)}
              disabled={enrolled}
              className={`rounded-lg px-6 py-3 font-semibold transition ${
                enrolled
                  ? "cursor-not-allowed bg-emerald-900 text-emerald-300"
                  : "bg-emerald-400 text-[#071a22] hover:bg-emerald-300"
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
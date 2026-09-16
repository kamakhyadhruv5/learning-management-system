import { useState } from "react"
import courses from "../../data/courses.json"
import CourseCard from "../../components/student/CourseCard"

function CourseListing() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === "All" || course.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#071a22] text-white">

      <nav className="flex h-16 items-center justify-between border-b border-slate-700 bg-[#0b2029] px-8">

        <h1 className="text-2xl font-bold">
          <span className="text-emerald-400">▣</span> LMS
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-lg">🔔</span>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-semibold text-[#071a22]">
            S
          </div>

          <span className="font-medium text-slate-200">
            Student
          </span>
        </div>

      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Browse Courses
          </h2>

          <p className="mt-2 text-slate-400">
            Find the right course and start learning today.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-700 bg-[#0d2630] p-5 md:flex-row">

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-slate-600 bg-[#071a22] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-600 bg-[#071a22] px-4 py-3 text-slate-200 outline-none focus:border-emerald-400"
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Programming">Programming</option>
            <option value="DSA">DSA</option>
            <option value="Database">Database</option>
          </select>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-700 bg-[#0d2630] p-10 text-center">
            <h3 className="text-xl font-semibold text-white">
              No courses found
            </h3>

            <p className="mt-2 text-slate-400">
              Try another search or category.
            </p>
          </div>
        )}

      </main>

    </div>
  )
}

export default CourseListing
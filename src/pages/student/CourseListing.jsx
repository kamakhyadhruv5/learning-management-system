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
    <div className="min-h-screen bg-slate-50">

      <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <h1 className="text-2xl font-bold text-indigo-600">
          LearnHub
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
            S
          </div>

          <span className="font-medium text-slate-700">
            Student
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Browse Courses
          </h2>

          <p className="mt-2 text-slate-500">
            Find the right course and start learning today.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row">

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:border-indigo-500"
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
          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold text-slate-700">
              No courses found
            </h3>
            <p className="mt-2 text-slate-500">
              Try another search or category.
            </p>
          </div>
        )}

      </main>

    </div>
  )
}

export default CourseListing
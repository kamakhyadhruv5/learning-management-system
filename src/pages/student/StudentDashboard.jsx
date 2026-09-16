import { Link } from "react-router-dom"

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

     
      <nav className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        
        <h1 className="text-2xl font-bold text-indigo-600">
          LMS
        </h1>

        <div className="flex items-center gap-5">
          <span className="cursor-pointer text-xl">🔔</span>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              S
            </div>

            <span className="font-medium text-slate-700">
              Student
            </span>
          </div>
        </div>
      </nav>


      <div className="flex">

     
        <aside className="min-h-[calc(100vh-64px)] w-64 border-r border-slate-200 bg-white p-5">

          <div className="space-y-2">

            <Link
              to="/student/dashboard"
              className="block rounded-lg bg-indigo-50 px-4 py-3 font-medium text-indigo-600"
            >
              Dashboard
            </Link>

            <Link
              to="/courses"
              className="block rounded-lg px-4 py-3 text-slate-600 transition hover:bg-slate-100"
            >
              Browse Courses
            </Link>

            <Link
              to="/student/my-courses"
              className="block rounded-lg px-4 py-3 text-slate-600 transition hover:bg-slate-100"
            >
              My Courses
            </Link>

            <Link
              to="/student/progress"
              className="block rounded-lg px-4 py-3 text-slate-600 transition hover:bg-slate-100"
            >
              Progress
            </Link>

          </div>

        </aside>


       
        <main className="flex-1 p-8">

          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome back, Student 👋
            </h2>

            <p className="mt-2 text-slate-500">
              Continue learning and track your progress.
            </p>
          </div>


     
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Available Courses
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-800">
                4
              </h3>

              <p className="mt-2 text-sm text-indigo-600">
                Explore new courses
              </p>
            </div>


            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Enrolled Courses
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-800">
                0
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start learning today
              </p>
            </div>


            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Overall Progress
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-800">
                0%
              </h3>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 w-0 rounded-full bg-indigo-600"></div>
              </div>
            </div>

          </div>


          
          <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Explore Courses
                </h3>

                <p className="mt-1 text-slate-500">
                  Browse available courses and start learning something new.
                </p>
              </div>

              <Link
                to="/courses"
                className="rounded-lg bg-indigo-600 px-5 py-3 text-center font-medium text-white transition hover:bg-indigo-700"
              >
                Browse Courses
              </Link>

            </div>

          </div>


          
          <div className="mt-8">

            <h3 className="mb-4 text-xl font-semibold text-slate-800">
              My Courses
            </h3>

            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="mb-3 text-4xl">
                📚
              </div>

              <h4 className="font-semibold text-slate-700">
                No enrolled courses yet
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Enroll in a course to start your learning journey.
              </p>

              <Link
                to="/courses"
                className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
              >
                Find a Course
              </Link>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default StudentDashboard
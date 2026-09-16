import { Routes, Route } from "react-router-dom"
import CourseListing from "./pages/student/CourseListing"
import CourseDetails from "./pages/student/CourseDetails"
import StudentDashboard from "./pages/student/StudentDashboard"

function App() {
  return (
    <Routes>
      <Route
  path="/student/dashboard"
  element={<StudentDashboard />}
/>
      <Route
        path="/courses"
        element={<CourseListing />}
      />
      <Route path="/courses/:id" element={<CourseDetails />} />

    </Routes>
  )
}

export default App
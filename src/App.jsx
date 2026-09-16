import { Routes, Route } from "react-router-dom";
import CourseListing from "./pages/student/CourseListing";
import CourseDetails from "./pages/student/CourseDetails";

function App() {
  return (
    <Routes>
      <Route path="/courses" element={<CourseListing />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
    </Routes>
  );
}

export default App;
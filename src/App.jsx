import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import StudentMyCourses from './pages/dashboards/StudentMyCourses';
import StudentBrowseCourses from './pages/dashboards/StudentBrowseCourses';
import StudentMyProgress from './pages/dashboards/StudentMyProgress';
import InstructorDashboard from './pages/dashboards/InstructorDashboard';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
import InstructorAddCoursePage from './pages/instructor/InstructorAddCoursePage';
import InstructorEditCoursePage from './pages/instructor/InstructorEditCoursePage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import AdminManageCourses from './pages/admin/AdminManageCourses';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/role" element={<Navigate to="/signup" replace />} />

        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute allowedRoles={['student']}><StudentMyCourses /></ProtectedRoute>} />
        <Route path="/student/browse" element={<ProtectedRoute allowedRoles={['student']}><StudentBrowseCourses /></ProtectedRoute>} />
        <Route path="/student/progress" element={<ProtectedRoute allowedRoles={['student']}><StudentMyProgress /></ProtectedRoute>} />

        <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorCoursesPage /></ProtectedRoute>} />
        <Route path="/instructor/courses/add" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorAddCoursePage /></ProtectedRoute>} />
        <Route path="/instructor/courses/edit/:id" element={<ProtectedRoute allowedRoles={['instructor']}><InstructorEditCoursePage /></ProtectedRoute>} />
        <Route path="/instructor/courses/manage" element={<ProtectedRoute allowedRoles={['instructor']}><Navigate to="/instructor/courses" replace /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageUsers /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><AdminManageCourses /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

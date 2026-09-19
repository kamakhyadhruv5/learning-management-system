import React from 'react';
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
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import AdminManageCourses from './pages/admin/AdminManageCourses';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<StudentMyCourses />} />
        <Route path="/student/browse" element={<StudentBrowseCourses />} />
        <Route path="/student/progress" element={<StudentMyProgress />} />

        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
        <Route path="/instructor/courses/add" element={<InstructorAddCoursePage />} />
        <Route path="/instructor/courses/manage" element={<Navigate to="/instructor/courses" replace />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/courses" element={<AdminManageCourses />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

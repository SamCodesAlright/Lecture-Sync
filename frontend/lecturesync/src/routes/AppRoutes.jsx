import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import AdminLayout from "../components/layouts/AdminLayout.jsx";
import InstructorLayout from "../components/layouts/InstructorLayout.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import CoursesPage from "../pages/admin/Courses.jsx";
import AddCoursePage from "../pages/admin/AddCourse.jsx";
import EditCoursePage from "../pages/admin/EditCourse.jsx";
import InstructorsPage from "../pages/admin/Instructors.jsx";
import AssignLecturePage from "../pages/admin/AssignLecture.jsx";
import InstructorDashboard from "../pages/instructor/Dashboard.jsx";
import UnauthorizedPage from "../pages/common/Unauthorized.jsx";
import NotFoundPage from "../pages/common/NotFound.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<CoursesPage />} />
          <Route path="/admin/courses/add" element={<AddCoursePage />} />
          <Route path="/admin/courses/edit/:id" element={<EditCoursePage />} />
          <Route path="/admin/instructors" element={<InstructorsPage />} />
          <Route path="/admin/assign-lecture" element={<AssignLecturePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
        <Route element={<InstructorLayout />}>
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InstallPWA from "./components/InstallPWA";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";

import ProtectedRoute from "./components/ProtectedRoute";

// Lazy Loaded Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const ScanAttendancePage = lazy(() => import("./pages/ScanAttendancePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const CourseManage = lazy(() => import("./pages/CourseManage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const CourseCreate = lazy(() => import("./pages/CourseCreate"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Helper component for legacy redirects with params
const LegacyEventRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/courses/${id}`} replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col relative bg-[#050505]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Legacy Redirects */}
              <Route path="/events" element={<Navigate to="/courses" replace />} />
              <Route path="/events/:id" element={<LegacyEventRedirect />} />
              <Route path="/organizer" element={<Navigate to="/teacher" replace />} />
              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              
              {/* Teacher/Organizer Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/create-course" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <CourseCreate />
                </ProtectedRoute>
              } />
              <Route path="/courses/:id/manage" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <CourseManage />
                </ProtectedRoute>
              } />
              <Route path="/scan-attendance" element={
                <ProtectedRoute roles={['organizer', 'admin', 'student']}>
                   <ScanAttendancePage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <InstallPWA />
      </div>
    </ErrorBoundary>
  );
}

export default App;
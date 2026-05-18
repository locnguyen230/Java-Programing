import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/candidate/Home";
import CVAnalyzer from "../pages/candidate/CVAnalyzer";
import CareerAdvisor from "../pages/candidate/CareerAdvisor";
import JobDetail from "../pages/candidate/JobDetail";
import JobSearch from "../pages/candidate/JobSearch";
import JobSearchDirection from "../pages/candidate/JobSearchDirection";
import SavedJobs from "../pages/candidate/SavedJobs";
import LearningHub from "../pages/candidate/LearningHub";
import Profile from "../pages/candidate/Profile";
import Notifications from "../pages/candidate/Notifications";
import MyApplications from "../pages/candidate/MyApplications";

import Subscription from "../pages/user/Subscription";
import PaymentPage from "../pages/user/PaymentPage";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import JobApplicantsManagement from "../pages/recruiter/JobApplicantsManagement";
import JobComposer from "../pages/recruiter/JobComposer";

// Placeholder for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-12 text-center bg-white rounded-[3rem] shadow-xl border-2 border-dashed border-gray-200 max-w-2xl mx-auto mt-20">
    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
      {name}
    </h1>
    <div className="w-20 h-2 bg-emerald-100 mx-auto mb-6 rounded-full"></div>
    <p className="text-gray-400 font-medium text-lg">
      Our engineering team is crafting this experience. <br /> Please check back in a few days!
    </p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Candidate / Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/jobs/saved" element={<SavedJobs />} />

        <Route path="/cv-analyzer" element={<CVAnalyzer />} />
        <Route path="/career-advisor" element={<CareerAdvisor />} />
        <Route path="/job-search-direction" element={<JobSearchDirection />} />
        <Route path="/learning-hub" element={<LearningHub />} />

        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment" element={<PaymentPage />} />

        <Route element={<ProtectedRoute roles={["CANDIDATE"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Route>
      </Route>

      {/* Recruiter Routes */}
      <Route element={<ProtectedRoute roles={["RECRUITER"]} />}>
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<JobComposer />} />
          <Route path="/recruiter/jobs-manage" element={<Placeholder name="Job Lifecycle Manager" />} />
          <Route path="/recruiter/candidates" element={<JobApplicantsManagement />} />
          <Route path="/recruiter/billing" element={<Subscription />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/jobs" element={<Placeholder name="Global Job Moderation" />} />
          <Route path="/admin/finance" element={<Placeholder name="Revenue & Payroll Engine" />} />
          <Route path="/admin/analytics" element={<Placeholder name="Advanced BI Analytics" />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

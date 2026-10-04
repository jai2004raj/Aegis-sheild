import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { WorkerLayout } from './layouts/WorkerLayout';
import { CompanyLayout } from './layouts/CompanyLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Services } from './pages/public/Services';
import { Companies } from './pages/public/Companies';
import { Reviews } from './pages/public/Reviews';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WorkersMgmt } from './pages/admin/WorkersMgmt';
import { CompaniesMgmt } from './pages/admin/CompaniesMgmt';
import { AssignmentsMgmt } from './pages/admin/AssignmentsMgmt';
import { AttendanceMgmt } from './pages/admin/AttendanceMgmt';
import { SalariesMgmt } from './pages/admin/SalariesMgmt';
import { NotificationsMgmt } from './pages/admin/NotificationsMgmt';
import { ReviewsMgmt } from './pages/admin/ReviewsMgmt';
import { InquiriesMgmt } from './pages/admin/InquiriesMgmt';
import { ReportsMgmt } from './pages/admin/ReportsMgmt';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerProfile } from './pages/worker/WorkerProfile';
import { WorkerAssignment } from './pages/worker/WorkerAssignment';
import { WorkerAttendance } from './pages/worker/WorkerAttendance';
import { WorkerSalary } from './pages/worker/WorkerSalary';
import { WorkerNotifications } from './pages/worker/WorkerNotifications';

// Company Pages
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyProfile } from './pages/company/CompanyProfile';
import { CompanyWorkers } from './pages/company/CompanyWorkers';
import { CompanyAttendance } from './pages/company/CompanyAttendance';
import { CompanyAssignments } from './pages/company/CompanyAssignments';
import { CompanyReviews } from './pages/company/CompanyReviews';
import { trackVisitor } from './utils/visitorTracker';

export const App: React.FC = () => {
  React.useEffect(() => {
    trackVisitor();
  }, []);
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="workers" element={<WorkersMgmt />} />
              <Route path="companies" element={<CompaniesMgmt />} />
              <Route path="assignments" element={<AssignmentsMgmt />} />
              <Route path="attendance" element={<AttendanceMgmt />} />
              <Route path="salaries" element={<SalariesMgmt />} />
              <Route path="notifications" element={<NotificationsMgmt />} />
              <Route path="reviews" element={<ReviewsMgmt />} />
              <Route path="inquiries" element={<InquiriesMgmt />} />
              <Route path="reports" element={<ReportsMgmt />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Protected Worker Routes */}
            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={['WORKER']}>
                  <WorkerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="profile" element={<WorkerProfile />} />
              <Route path="assignment" element={<WorkerAssignment />} />
              <Route path="attendance" element={<WorkerAttendance />} />
              <Route path="salary" element={<WorkerSalary />} />
              <Route path="notifications" element={<WorkerNotifications />} />
              <Route index element={<Navigate to="/worker/dashboard" replace />} />
            </Route>

            {/* Protected Company Routes */}
            <Route
              path="/company"
              element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <CompanyLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="workers" element={<CompanyWorkers />} />
              <Route path="attendance" element={<CompanyAttendance />} />
              <Route path="assignments" element={<CompanyAssignments />} />
              <Route path="reviews" element={<CompanyReviews />} />
              <Route index element={<Navigate to="/company/dashboard" replace />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import StudentPortalPage from './pages/StudentPortalPage';
import CleaningDepartmentPage from './pages/CleaningDepartmentPage';
import ManagementDepartmentPage from './pages/ManagementDepartmentPage';
import HRDepartmentPage from './pages/HRDepartmentPage';
import StudentCounsellingPage from './pages/StudentCounsellingPage';
import StudentLeaderPage from './pages/StudentLeaderPage';
import FacultyPortalPage from './pages/FacultyPortalPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

function DashboardContent() {
  const { user, activeTab, navigate } = useApp();

  // If user is not logged in and wants to view authenticated content
  if (!user && activeTab !== 'home') {
    return <AuthPage initialMode="register" />;
  }

  // Active page router
  switch (activeTab) {
    case 'home':
      return <HomePage />;
    case 'student-portal':
      return <StudentPortalPage />;
    case 'cleaning':
      return <CleaningDepartmentPage />;
    case 'management':
      return <ManagementDepartmentPage />;
    case 'hr':
      return <HRDepartmentPage />;
    case 'counselling':
      return <StudentCounsellingPage />;
    case 'student-leader':
      return <StudentLeaderPage />;
    case 'faculty-portal':
      return <FacultyPortalPage />;
    case 'notifications':
      return <NotificationsPage />;
    case 'profile':
      return user ? <ProfilePage /> : <AuthPage initialMode="login" />;
    default:
      return <HomePage />;
  }
}

export default function App() {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex">
        {/* Persistent 11-Option Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-72 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <DashboardContent />
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-4 px-6 text-center text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <p>
                <strong>CampusConnect</strong> &copy; 2026 Apex Institute of Technology & Management. All rights reserved.
              </p>
              <p className="text-[11px] text-slate-400">
                Connected Modules: Student • Cleaning • Management • HR • Counselling • Leadership • Faculty
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Floating Alerts */}
      <Toast />
    </div>
  );
}


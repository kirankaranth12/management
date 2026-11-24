import React from 'react';
import { ShieldAlert } from 'lucide-react';
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

function RestrictedAccess({ departmentName, allowedRole, onReturn }) {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          The <strong>{departmentName}</strong> is restricted to authorized <strong>{allowedRole}</strong> personnel. Your current account does not have authorization to access internal operations for this department.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={onReturn}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
        >
          Return to My Workspace
        </button>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, activeTab, navigate } = useApp();

  // If user is not logged in and wants to view authenticated content
  if (!user && activeTab !== 'home') {
    return <AuthPage initialMode="register" />;
  }

  const role = user?.role || 'Guest';
  const isAdmin = role === 'Admin';
  const myWorkspace = role === 'Faculty' ? 'faculty-portal' : (role === 'Student' ? 'student-portal' : (role === 'Cleaning' ? 'cleaning' : (role === 'HR' ? 'hr' : 'home')));

  // Active page router with Role-Based Access Control
  switch (activeTab) {
    case 'home':
      return <HomePage />;
    case 'student-portal':
      if (!isAdmin && role !== 'Student') {
        return <RestrictedAccess departmentName="Student Portal" allowedRole="Enrolled Students" onReturn={() => navigate(myWorkspace)} />;
      }
      return <StudentPortalPage />;
    case 'cleaning':
      if (!isAdmin && role !== 'Cleaning') {
        return <RestrictedAccess departmentName="Cleaning Department" allowedRole="Sanitation Staff" onReturn={() => navigate(myWorkspace)} />;
      }
      return <CleaningDepartmentPage />;
    case 'management':
      if (!isAdmin) {
        return <RestrictedAccess departmentName="Management Department" allowedRole="Executive Management & Administrators" onReturn={() => navigate(myWorkspace)} />;
      }
      return <ManagementDepartmentPage />;
    case 'hr':
      if (!isAdmin && role !== 'HR') {
        return <RestrictedAccess departmentName="HR Department" allowedRole="Human Resources Officers" onReturn={() => navigate(myWorkspace)} />;
      }
      return <HRDepartmentPage />;
    case 'counselling':
      return <StudentCounsellingPage />;
    case 'student-leader':
      return <StudentLeaderPage />;
    case 'faculty-portal':
      if (!isAdmin && role !== 'Faculty') {
        return <RestrictedAccess departmentName="Faculty Portal" allowedRole="Faculty & Instructors" onReturn={() => navigate(myWorkspace)} />;
      }
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

  // If user is not logged in, show full-screen Authentication Portal (Register first, then login)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <AuthPage initialMode="register" />
        <Toast />
      </div>
    );
  }

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


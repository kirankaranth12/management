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

function RestrictedAccess({ departmentName, allowedRole, description, onReturn }) {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-lg mx-auto my-8 space-y-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Restricted</h3>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          {description || (
            <>
              The <strong>{departmentName}</strong> is restricted to authorized <strong>{allowedRole}</strong> personnel. Your current student account does not have authorization to view internal operations or faculty documents.
            </>
          )}
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={onReturn}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
        >
          Return to Student Portal
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
  const isStudent = role === 'Student';

  // Active page router with Role-Based Access Control
  // Rule: Everyone other than Student has full access to all campus modules and management areas.
  // Only Students are restricted from staff, HR, management, and faculty operations/documents.
  switch (activeTab) {
    case 'home':
      return <HomePage />;
    case 'student-portal':
      return <StudentPortalPage />;
    case 'cleaning':
      if (isStudent) {
        return (
          <RestrictedAccess
            departmentName="Cleaning & Facilities Department"
            allowedRole="Campus Staff & Faculty"
            description="Sanitation dispatch rosters, maintenance work orders, and cleaning operations are restricted from students. Students can report sanitation issues via the Student Portal."
            onReturn={() => navigate('student-portal')}
          />
        );
      }
      return <CleaningDepartmentPage />;
    case 'management':
      if (isStudent) {
        return (
          <RestrictedAccess
            departmentName="Management & Administration Department"
            allowedRole="Executive Management & Faculty Staff"
            description="Institutional oversight, executive operations, college budgets, and administrative performance data are restricted from student access."
            onReturn={() => navigate('student-portal')}
          />
        );
      }
      return <ManagementDepartmentPage />;
    case 'hr':
      if (isStudent) {
        return (
          <RestrictedAccess
            departmentName="Human Resources Department"
            allowedRole="HR Officers & Campus Staff"
            description="Staff credentials, official faculty attendance records, employee salary structures, and official leave authorizations are confidential and restricted from students."
            onReturn={() => navigate('student-portal')}
          />
        );
      }
      return <HRDepartmentPage />;
    case 'counselling':
      return <StudentCounsellingPage />;
    case 'student-leader':
      return <StudentLeaderPage />;
    case 'faculty-portal':
      if (isStudent) {
        return (
          <RestrictedAccess
            departmentName="Faculty Portal & Documents"
            allowedRole="Faculty & Academic Staff"
            description="Confidential faculty examination documents, grading books, course curriculum management, and student evaluation rosters are strictly restricted from student access."
            onReturn={() => navigate('student-portal')}
          />
        );
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


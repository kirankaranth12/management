import React from 'react';
import { 
  Home, 
  GraduationCap, 
  Sparkles, 
  Building2, 
  Users2, 
  HeartHandshake, 
  Award, 
  BookOpenCheck, 
  Bell, 
  UserCheck, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';

export default function Sidebar() {
  const { 
    activeTab, 
    navigate, 
    user, 
    logout, 
    sidebarOpen, 
    setSidebarOpen,
    unreadNotifsCount,
    complaints,
    cleaningTasks,
    leaveRequests,
    counsellingAppointments
  } = useApp();

  // Dynamic badges for department activity
  const pendingCleaning = cleaningTasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
  const requestedCounselling = counsellingAppointments.filter(a => a.status === 'Requested').length;

  // The 11 required navigation items:
  // 1. Home
  // 2. Student Portal
  // 3. Cleaning Department
  // 4. Management Department
  // 5. HR Department
  // 6. Student Counselling Department
  // 7. Student Leader Department
  // 8. Faculty Portal
  // 9. Notifications
  // 10. Profile
  // 11. Logout
  const navItems = [
    {
      id: 'home',
      label: '1. Home',
      shortLabel: 'Home',
      icon: Home,
      badge: null,
      primaryRole: null
    },
    {
      id: 'student-portal',
      label: '2. Student Portal',
      shortLabel: 'Student Portal',
      icon: GraduationCap,
      badge: 'Academics & Attendance',
      badgeColor: 'bg-blue-100 text-blue-700',
      primaryRole: 'Student'
    },
    {
      id: 'cleaning',
      label: '3. Cleaning Department',
      shortLabel: 'Cleaning Dept',
      icon: Sparkles,
      badge: pendingCleaning > 0 ? `${pendingCleaning} tasks` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      primaryRole: 'Cleaning'
    },
    {
      id: 'management',
      label: '4. Management Department',
      shortLabel: 'Management Dept',
      icon: Building2,
      badge: pendingComplaints > 0 ? `${pendingComplaints} open` : 'Operations',
      badgeColor: 'bg-purple-100 text-purple-700',
      primaryRole: 'Admin'
    },
    {
      id: 'hr',
      label: '5. HR Department',
      shortLabel: 'HR Dept',
      icon: Users2,
      badge: pendingLeaves > 0 ? `${pendingLeaves} leaves` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
      primaryRole: 'HR'
    },
    {
      id: 'counselling',
      label: '6. Student Counselling Dept',
      shortLabel: 'Counselling Dept',
      icon: HeartHandshake,
      badge: requestedCounselling > 0 ? `${requestedCounselling} new` : 'Confidential',
      badgeColor: 'bg-teal-100 text-teal-700',
      primaryRole: 'Counselling'
    },
    {
      id: 'student-leader',
      label: '7. Student Leader Department',
      shortLabel: 'Student Council',
      icon: Award,
      badge: 'Council & Events',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      primaryRole: 'StudentLeader'
    },
    {
      id: 'faculty-portal',
      label: '8. Faculty Portal',
      shortLabel: 'Faculty Portal',
      icon: BookOpenCheck,
      badge: 'Attendance & Classes',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      primaryRole: 'Faculty'
    },
    {
      id: 'notifications',
      label: '9. Notifications',
      shortLabel: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount} new` : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
      primaryRole: null
    },
    {
      id: 'profile',
      label: '10. Profile',
      shortLabel: 'My Profile',
      icon: UserCheck,
      badge: user ? 'Active' : 'Login',
      badgeColor: 'bg-slate-100 text-slate-700',
      primaryRole: null
    },
    {
      id: 'logout',
      label: '11. Logout',
      shortLabel: 'Logout',
      icon: LogOut,
      badge: null,
      primaryRole: null,
      isDanger: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-500/20">
              CC
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">Main Navigation</h2>
              <p className="text-[10px] text-slate-400 font-medium">11 Functional Modules</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* User Mini Card in Sidebar */}
        {user ? (
          <div className="p-4 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar}
                name={user.name}
                className="w-10 h-10 rounded-xl"
                textClassName="text-xs"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <p className="text-xs font-semibold text-slate-700">Not Logged In</p>
            <button
              onClick={() => navigate('profile')}
              className="mt-2 w-full py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Navigation list */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const userRole = user?.role || 'Guest';
            const isAdmin = userRole === 'Admin';
            const isRestricted = item.primaryRole && !isAdmin && userRole !== item.primaryRole;
            const isUserPrimary = user && user.role === item.primaryRole;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    logout();
                  } else {
                    navigate(item.id);
                  }
                }}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                    : item.isDanger
                    ? 'text-rose-600 hover:bg-rose-50/80 hover:text-rose-700'
                    : isRestricted
                    ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.isDanger
                        ? 'text-rose-500 group-hover:bg-rose-100'
                        : 'text-slate-500 group-hover:bg-slate-200/60 group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {isRestricted ? (
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-medium">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  ) : item.badge ? (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive ? 'bg-white/25 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                  {isUserPrimary && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Your Primary Module" />
                  )}
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>System v2.4 Online</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">NITM-CAMPUS</span>
          </div>
        </div>
      </aside>
    </>
  );
}


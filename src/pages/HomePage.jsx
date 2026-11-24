import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Building2, 
  Users2, 
  HeartHandshake, 
  Award, 
  BookOpenCheck, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Calendar, 
  ShieldCheck, 
  TrendingUp,
  Activity,
  Megaphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { 
    user, 
    role, 
    navigate, 
    complaints, 
    cleaningTasks, 
    announcements, 
    events, 
    managementStats, 
    unreadNotifsCount 
  } = useApp();

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const cleaningPending = cleaningTasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length;

  const departmentCards = [
    {
      id: 'student-portal',
      title: 'Student Portal',
      description: 'Attendance, timetable, academic grades, complaint registration & lost & found.',
      icon: GraduationCap,
      color: 'bg-blue-600',
      badge: 'Academic Hub',
      stat: '3.85 CGPA • 91.5% Att'
    },
    {
      id: 'cleaning',
      title: 'Cleaning Department',
      description: 'Report unclean areas, assign sanitation crew, track live cleaning progress & hygiene.',
      icon: Sparkles,
      color: 'bg-amber-600',
      badge: `${cleaningPending} Active Tasks`,
      stat: '98% Hygiene Score'
    },
    {
      id: 'management',
      title: 'Management Department',
      description: 'Campus operations, departmental budgets, cross-college complaint oversight & announcements.',
      icon: Building2,
      color: 'bg-purple-600',
      badge: 'Administration',
      stat: '7 Departments Active'
    },
    {
      id: 'hr',
      title: 'HR Department',
      description: 'Staff directory, employee profiles, daily attendance logs, and leave approval queue.',
      icon: Users2,
      color: 'bg-rose-600',
      badge: 'Staff Management',
      stat: '185 Faculty Members'
    },
    {
      id: 'counselling',
      title: 'Student Counselling Dept',
      description: 'Confidential 1-on-1 mental health sessions, academic guidance, and wellness resources.',
      icon: HeartHandshake,
      color: 'bg-teal-600',
      badge: 'Strictly Confidential',
      stat: 'Dr. Maya Patel Available'
    },
    {
      id: 'student-leader',
      title: 'Student Leader Dept',
      description: 'Student Council, Class Reps, suggestion voting forum, and campus event coordination.',
      icon: Award,
      color: 'bg-indigo-600',
      badge: 'Student Council',
      stat: '3 Live Campus Events'
    },
    {
      id: 'faculty-portal',
      title: 'Faculty Portal',
      description: 'Mark student attendance, post course notices, manage student academic complaints.',
      icon: BookOpenCheck,
      color: 'bg-emerald-600',
      badge: 'Lectures & Attendance',
      stat: 'Semester Classes Roster'
    },
    {
      id: 'notifications',
      title: 'Notifications Center',
      description: 'Real-time alerts for complaints status updates, announcements, and task assignments.',
      icon: Bell,
      color: 'bg-slate-700',
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount} Unread` : 'All Caught Up',
      stat: 'Instant Multi-Channel'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-blue-800 p-6 sm:p-8 text-white shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CampusConnect 360° Smart Campus Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {user ? user.name : 'Campus Visitor'}!
            </h1>
            <p className="text-blue-100/90 text-sm mt-2 leading-relaxed">
              {user ? (
                <span>
                  Logged in as <strong className="text-white underline decoration-blue-300 underline-offset-2">{user.role}</strong> ({user.department || 'Apex Institute'}). You have full access to interconnected college departments, real-time complaints handling, and academic portals.
                </span>
              ) : (
                <span>Access the centralized digital platform connecting students, faculty, and administrators.</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('student-portal', 'complaint-register')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Submit Complaint
            </button>
            <button
              onClick={() => navigate('cleaning', 'report')}
              className="px-4 py-2.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Report Unclean Area
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalComplaints}</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 94% Resolved
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cross-campus issues tracked</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{inProgressComplaints}</span>
            <span className="text-[11px] font-semibold text-amber-600">Under Action</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{pendingComplaints} awaiting review</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cleanliness Index</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">98.2%</span>
            <span className="text-[11px] font-semibold text-emerald-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{cleaningPending} sanitation tasks ongoing</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Announcements</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{announcements.length}</span>
            <span className="text-[11px] font-semibold text-purple-600">Published</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Academics, Events & Admin</p>
        </div>

      </div>

      {/* Main Department Modules Grid (Every button is fully functional) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">College Department Modules</h2>
            <p className="text-xs text-slate-500">Every module below navigates to its fully interactive functional page.</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            8 Interconnected Portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.id)}
                className="group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="font-semibold text-slate-700">{card.stat}</span>
                  <span className="text-blue-600 font-bold group-hover:underline">Open Page →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Live Complaint Interconnect Feed & Campus Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Complaints Live Feed (Interconnection demonstration) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Live Complaints Interconnection Feed
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complaints filed by students automatically dispatch to respective departments.
              </p>
            </div>
            <button
              onClick={() => navigate('student-portal', 'complaints-tracker')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              View All ({complaints.length})
            </button>
          </div>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                No active complaints filed. All campus facilities are operational!
              </div>
            ) : (
              complaints.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  if (c.category === 'Cleaning & Sanitation') navigate('cleaning');
                  else if (c.category === 'Academic & Faculty') navigate('faculty-portal');
                  else navigate('student-portal', 'complaints-tracker');
                }}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                        {c.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-400">• {c.location}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{c.description}</p>
                    {c.resolutionNotes && (
                      <p className="text-[10px] text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded mt-1.5 font-medium">
                        Dept Note: {c.resolutionNotes}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {c.department}
                    </span>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Right Column: Live Announcements Feed */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-600" />
                  Campus Announcements
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Broadcasted by Administration & Faculty</p>
              </div>
              <button
                onClick={() => navigate('student-portal', 'announcements')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                All Notices
              </button>
            </div>

            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                  No announcements published yet.
                </div>
              ) : (
                announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                  <div className="mt-2 text-[10px] text-slate-400 font-medium">
                    Posted by: <strong className="text-slate-700">{ann.postedBy}</strong> ({ann.authorRole})
                  </div>
                </div>
              )))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => navigate('student-leader', 'events')}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              View Campus Events ({events.length})
            </button>
            <button
              onClick={() => navigate('management')}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Publish New Notice →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}


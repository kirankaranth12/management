import React, { useState } from 'react';
import {
  Building2,
  Activity,
  Users,
  ShieldCheck,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Check,
  BarChart3,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ManagementDepartmentPage() {
  const {
    managementStats,
    departments,
    complaints,
    updateComplaintStatus,
    announcements,
    publishAnnouncement,
    cleaningTasks,
    user,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'departments' | 'complaints' | 'announcements' | 'performance'
  const [complaintDeptFilter, setComplaintDeptFilter] = useState('All');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('Academic');
  const [annTarget, setAnnTarget] = useState('All');
  const [annPriority, setAnnPriority] = useState('Normal');
  const [isPublishing, setIsPublishing] = useState(false);

  // New Department Form State
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [deptBudget, setDeptBudget] = useState('$250,000');

  // Handle Publish Announcement
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      showToast('Please provide a title and notice content.', 'error');
      return;
    }

    setIsPublishing(true);
    const res = await publishAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      targetAudience: annTarget,
      priority: annPriority
    });
    setIsPublishing(false);

    if (res.success) {
      setAnnTitle('');
      setAnnContent('');
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesDept = complaintDeptFilter === 'All' || c.department.includes(complaintDeptFilter);
    const matchesStatus = complaintStatusFilter === 'All' || c.status === complaintStatusFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const stats = managementStats || {
    totalStudents: 0,
    totalFaculty: 0,
    totalStaff: 0,
    totalComplaints: complaints.length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
    resolutionRate: complaints.length > 0 ? Math.round((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100) : 0
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Management & Administration</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Institutional Oversight
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Central executive operations, inter-departmental performance monitoring, college-wide complaint resolution, and announcements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('announcements')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <Megaphone className="w-4 h-4" />
            Broadcast Notice
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            Monitor Complaints ({complaints.length})
          </button>
        </div>
      </div>

      {/* High-Level Institutional Operations Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Enrolled Students</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalStudents || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {departments.length} departments</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Faculty & Staff</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{(stats.totalFaculty || 0) + (stats.totalStaff || 0)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalFaculty || 0} Faculty • {stats.totalStaff || 0} Staff</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-purple-700 uppercase">Resolution Efficiency</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{stats.resolutionRate || 0}%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {stats.resolvedComplaints || 0} of {stats.totalComplaints || complaints.length} resolved
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Sanitation Score</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {cleaningTasks.length > 0 ? `${Math.round((cleaningTasks.filter(t => t.status === 'Completed').length / cleaningTasks.length) * 100)}%` : '0%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{cleaningTasks.filter(t => t.status !== 'Completed').length} tasks pending</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        {[
          { id: 'operations', label: 'College Operations' },
          { id: 'departments', label: `Departments (${departments.length})` },
          { id: 'complaints', label: `College Complaints (${complaints.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'performance', label: 'Department Performance' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: OPERATIONS DASHBOARD ===================== */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Department Operations Table */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-900">Institutional Departments Summary</h3>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                  Academic Year 2026-2027
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Department</th>
                      <th className="p-3">Head of Dept (HOD)</th>
                      <th className="p-3">Students</th>
                      <th className="p-3">Faculty</th>
                      <th className="p-3">Budget</th>
                      <th className="p-3">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{dept.name}</td>
                        <td className="p-3 text-slate-600">{dept.head}</td>
                        <td className="p-3 font-semibold">{dept.studentCount || '-'}</td>
                        <td className="p-3 font-semibold">{dept.facultyCount}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{dept.budget}</td>
                        <td className="p-3 font-bold text-purple-700">{dept.satisfactionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Quick Operational Checklist */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Administrative Priority Queue</h3>

              {complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-700">All Priority Tasks Cleared</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No urgent administrative issues currently pending.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').slice(0, 5).map(c => (
                    <div key={c.id} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block">{c.title}</span>
                      <p className="text-amber-800 text-[11px] mt-0.5">{c.department} • {c.location}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ===================== TAB 2: MANAGE DEPARTMENTS ===================== */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {dept.id}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {dept.satisfactionRate}% Rating
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                <p className="text-xs text-slate-500">HOD: <strong className="text-slate-700">{dept.head}</strong></p>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Students</span>
                    <strong className="text-slate-800">{dept.studentCount || 'Staff Dept'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Annual Budget</span>
                    <strong className="text-emerald-700 font-mono">{dept.budget}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: MONITOR ALL COLLEGE COMPLAINTS ===================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Department:</span>
              <select
                value={complaintDeptFilter}
                onChange={(e) => setComplaintDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="All">All Departments</option>
                <option value="Cleaning">Cleaning Department</option>
                <option value="Faculty">Faculty / Academics</option>
                <option value="Management">Management Department</option>
                <option value="Counselling">Student Counselling</option>
              </select>

              <span className="text-xs font-bold text-slate-500 ml-2">Status:</span>
              <select
                value={complaintStatusFilter}
                onChange={(e) => setComplaintStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket title, student, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">ID & Category</th>
                    <th className="p-3.5">Title & Location</th>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Assigned Department</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No complaints filed. All campus operations are clear!
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            {c.id}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-1">{c.category}</span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-slate-900 block">{c.title}</strong>
                          <span className="text-[11px] text-slate-500">📍 {c.location}</span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-slate-800">{c.studentName}</strong>
                          <span className="block text-[10px] text-slate-400">{c.studentId}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-purple-900">{c.department}</span>
                          <span className="block text-[10px] text-slate-500">{c.assignedTo}</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : (c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800')
                            }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            {c.status !== 'Resolved' && (
                              <button
                                onClick={() => updateComplaintStatus(c.id, 'Resolved', 'Resolved by College Management Office', user?.name || 'Administration')}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                              >
                                Resolve
                              </button>
                            )}
                            {c.status === 'Pending' && (
                              <button
                                onClick={() => updateComplaintStatus(c.id, 'In Progress', 'Assigned by Management for immediate action', user?.name || 'Administration')}
                                className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                              >
                                Escalate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: BROADCAST ANNOUNCEMENTS ===================== */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Create Announcement Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Create College-Wide Announcement</h3>
            <p className="text-xs text-slate-500 mb-6">Instantly broadcasts across student portal, faculty portal, and notifications.</p>

            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Annual Tech Symposium & Hackathon"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notice Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Academic">Academic Schedule</option>
                    <option value="Administrative">Administrative Order</option>
                    <option value="Event">Campus Event</option>
                    <option value="Emergency">Emergency / Holiday Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={annTarget}
                    onChange={(e) => setAnnTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="All">All College Community</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty Members</option>
                    <option value="Staff">Administrative Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details, deadlines, and room allotments..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20"
              >
                {isPublishing ? 'Publishing...' : 'Publish & Broadcast Notice to Campus'}
              </button>
            </form>
          </div>

          {/* Active Notices List */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">Active Published Notices</h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    {ann.category} • Target: {ann.targetAudience}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{ann.content}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Author: {ann.postedBy}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ===================== TAB 5: DEPARTMENT PERFORMANCE ===================== */}
      {activeTab === 'performance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="text-base font-black text-slate-900">Department Performance & Resolution Scores</h3>

          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{dept.name}</h4>
                    <span className="text-[11px] text-slate-500">HOD: {dept.head}</span>
                  </div>
                  <span className="text-xs font-black text-purple-700">{dept.satisfactionRate}% Satisfaction</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${dept.satisfactionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}


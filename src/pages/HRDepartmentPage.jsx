import React, { useState } from 'react';
import {
  Users2,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Check,
  X,
  FileText,
  Award,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function HRDepartmentPage() {
  const {
    hrEmployees,
    leaveRequests,
    submitLeaveRequest,
    updateLeaveStatus,
    user,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('employees'); // 'employees' | 'attendance' | 'leaves' | 'dept-wise'
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Employee Modal
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDept, setEmpDept] = useState('Computer Science & Engineering');
  const [empDesignation, setEmpDesignation] = useState('Assistant Professor');
  const [empPhone, setEmpPhone] = useState('');
  const [empQuals, setEmpQuals] = useState('Ph.D. in Engineering');

  // Submit Leave Form
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Handle Leave Apply
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      showToast('Please provide dates and reason.', 'error');
      return;
    }

    const res = await submitLeaveRequest({
      leaveType,
      startDate,
      endDate,
      reason
    });

    if (res.success) {
      setLeaveModalOpen(false);
      setReason('');
      setActiveTab('leaves');
    }
  };

  // Filter employees
  const filteredEmployees = hrEmployees.filter(emp => {
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <Users2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Human Resources Department</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Staff & Faculty Operations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Faculty credentials, staff attendance tracking, official leave authorizations, and employee welfare administration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLeaveModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Apply For Leave
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            Leave Queue ({pendingLeaves.length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Faculty & Staff</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{hrEmployees.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 7 departments</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase">Present Today</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {hrEmployees.length > 0 ? `${((hrEmployees.filter(e => e.status === 'Present').length / hrEmployees.length) * 100).toFixed(1)}%` : '0.0%'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active on campus roster</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-rose-700 uppercase">Pending Leaves</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{pendingLeaves.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires HR review</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-purple-700 uppercase">Appraisal Index</span>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {hrEmployees.length > 0 ? '4.8 / 5.0' : '0.0 / 5.0'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Faculty satisfaction score</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        {[
          { id: 'employees', label: `Staff & Faculty Directory (${hrEmployees.length})` },
          { id: 'leaves', label: `Leave Approvals (${pendingLeaves.length} pending)` },
          { id: 'attendance', label: 'Daily Staff Attendance' },
          { id: 'dept-wise', label: 'Department Details' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-white text-rose-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: EMPLOYEES DIRECTORY ===================== */}
      {activeTab === 'employees' && (
        <div className="space-y-4">

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Department:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science & Engineering">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Comm</option>
                <option value="Sanitation & Facilities">Sanitation & Facilities</option>
                <option value="Student Counselling & Wellbeing">Student Counselling</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff name, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Employee Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Staff or Faculty Records</h4>
                <p className="text-xs text-slate-400 mt-1">Staff directory is currently empty. Registered staff and faculty will appear here.</p>
              </div>
            ) : (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-rose-300 transition-all"
                >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={emp.avatar}
                        name={emp.name}
                        className="w-14 h-14 rounded-2xl"
                        textClassName="text-sm"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{emp.name}</h4>
                        <p className="text-xs font-semibold text-rose-700">{emp.designation}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{emp.id}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                      {emp.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                    <p className="text-slate-600">🏛️ <strong>Dept:</strong> {emp.department}</p>
                    <p className="text-slate-600">🎓 <strong>Credentials:</strong> {emp.qualifications}</p>
                    <p className="text-slate-600">✉️ <strong>Email:</strong> {emp.email}</p>
                    <p className="text-slate-600">📞 <strong>Phone:</strong> {emp.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Leave Balance: <strong>{emp.leaveBalance?.casual || 10} Casual • {emp.leaveBalance?.sick || 10} Sick</strong>
                  </span>
                  <span className="text-xs font-bold text-rose-600 hover:underline cursor-pointer">
                    View Dossier →
                  </span>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: LEAVE REQUESTS QUEUE ===================== */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 leading-relaxed">
            <strong>HR Leave Approvals:</strong> Approving a leave request immediately updates the employee's active leave balance and sends a direct notification to their account.
          </div>

          <div className="space-y-4">
            {leaveRequests.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Leave Requests Pending</h4>
                <p className="text-xs text-slate-400 mt-1">All staff are on duty and no leave applications are in the queue.</p>
              </div>
            ) : (
              leaveRequests.map((leave) => (
                <div key={leave.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          {leave.id}
                        </span>
                        <strong className="text-xs text-slate-800">{leave.employeeName}</strong>
                        <span className="text-xs text-slate-500">({leave.department})</span>
                      </div>

                      <div className="text-xs font-semibold text-slate-900 mt-1">
                        {leave.leaveType} • 📅 {leave.startDate} to {leave.endDate} ({leave.days} Days)
                      </div>

                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        Reason: "{leave.reason}"
                      </p>

                      {leave.reviewerComments && (
                        <p className="text-[11px] text-rose-900 bg-rose-50/70 p-2 rounded-lg mt-2 font-medium">
                          HR Note: {leave.reviewerComments} (Reviewed by {leave.reviewedBy})
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : (leave.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800')
                        }`}>
                        {leave.status}
                      </span>

                      {leave.status === 'Pending' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Approved', 'Leave sanctioned with salary credit.')}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Rejected', 'Alternate dates recommended due to exam duty.')}
                            className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: DAILY STAFF ATTENDANCE ===================== */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Today's Faculty & Staff Attendance Log</h3>
              <p className="text-xs text-slate-500">One-click status toggle for biometric and on-duty logging.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
              Campus Status: Regular Operations
            </span>
          </div>

          <div className="space-y-3">
            {hrEmployees.map((emp) => (
              <div key={emp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                  <p className="text-[11px] text-slate-500">{emp.department} • {emp.designation}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${emp.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: DEPARTMENT DETAILS ===================== */}
      {activeTab === 'dept-wise' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { dept: 'Computer Science & Engineering', faculty: 28, staff: 6, leaveCount: 1 },
            { dept: 'Electronics & Communication', faculty: 22, staff: 4, leaveCount: 1 },
            { dept: 'Mechanical Engineering', faculty: 19, staff: 5, leaveCount: 0 },
            { dept: 'Civil Engineering', faculty: 16, staff: 3, leaveCount: 0 },
            { dept: 'Sanitation & Facilities', faculty: 0, staff: 35, leaveCount: 2 },
            { dept: 'Human Resources & Admin', faculty: 0, staff: 14, leaveCount: 0 }
          ].map((d, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900">{d.dept}</h4>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Faculty</span>
                  <strong>{d.faculty}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Staff</span>
                  <strong>{d.staff}</strong>
                </div>
                <div className="p-2 bg-rose-50 rounded-xl text-rose-800">
                  <span className="text-[10px] text-rose-500 block">On Leave</span>
                  <strong>{d.leaveCount}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Leave Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-base font-black text-slate-900">Submit Official Leave Request</h3>
            <p className="text-xs text-slate-500 mt-1">
              Applying as: <strong>{user?.name || 'Staff Member'}</strong> ({user?.department || 'Academics'})
            </p>

            <form onSubmit={handleApplyLeave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick / Medical Leave">Sick / Medical Leave</option>
                  <option value="Duty Leave (Conference/Exam)">Duty Leave (Conference/Research)</option>
                  <option value="Earned Privilege Leave">Earned Privilege Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Event Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason for leave, alternate lecture adjustment arrangements..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeaveModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                >
                  Send for HR Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


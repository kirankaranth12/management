import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  UploadCloud, 
  UserCheck, 
  Filter, 
  Search, 
  Check, 
  Building,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CleaningDepartmentPage() {
  const { 
    cleaningTasks, 
    submitCleaningTask, 
    updateCleaningTask, 
    complaints, 
    updateComplaintStatus, 
    user,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'student-complaints' | 'report' | 'staff'
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Report Unclean Area Form State
  const [areaName, setAreaName] = useState('');
  const [areaType, setAreaType] = useState('Classroom');
  const [issueType, setIssueType] = useState('Spill / Sanitation');
  const [priority, setPriority] = useState('Normal');
  const [assignedStaff, setAssignedStaff] = useState('Unassigned');
  const [photo, setPhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complete task modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // Sanitation Staff List
  const staffMembers = [
    { name: 'Ramesh Sharma', role: 'Senior Sanitation Lead', shift: 'Morning (06:00 AM - 02:00 PM)', activeTasks: 2 },
    { name: 'Sunita Devi', role: 'Floor Hygiene Specialist', shift: 'Morning (07:00 AM - 03:00 PM)', activeTasks: 1 },
    { name: 'Anil Verma', role: 'Waste & Chemical Safety Crew', shift: 'Afternoon (01:00 PM - 09:00 PM)', activeTasks: 1 },
    { name: 'Geeta Kumari', role: 'Disinfection Specialist', shift: 'Morning (07:00 AM - 03:00 PM)', activeTasks: 0 }
  ];

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new cleaning report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!areaName.trim()) {
      showToast('Please specify the location/area.', 'error');
      return;
    }

    setIsSubmitting(true);
    const res = await submitCleaningTask({
      area: areaName,
      areaType,
      issueType,
      priority,
      assignedStaff,
      photo
    });
    setIsSubmitting(false);

    if (res.success) {
      setAreaName('');
      setPhoto('');
      setPhotoPreview('');
      setActiveTab('tasks');
    }
  };

  // Complete cleaning task action
  const handleConfirmCompletion = async () => {
    if (!selectedTask) return;
    await updateCleaningTask(selectedTask.id, {
      status: 'Completed',
      completionNotes: completionNotes || 'Area thoroughly sanitized, inspected, and verified clean.'
    });
    setCompleteModalOpen(false);
    setSelectedTask(null);
    setCompletionNotes('');
  };

  // Interconnected: Student complaints in Cleaning & Sanitation category
  const studentCleaningComplaints = complaints.filter(c => c.category === 'Cleaning & Sanitation');

  // Filtered tasks
  const filteredTasks = cleaningTasks.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesArea = areaFilter === 'All' || t.areaType === areaFilter;
    const matchesSearch = t.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesArea && matchesSearch;
  });

  const totalTasks = cleaningTasks.length;
  const inProgressCount = cleaningTasks.filter(t => t.status === 'In Progress').length;
  const completedCount = cleaningTasks.filter(t => t.status === 'Completed').length;
  const pendingCount = cleaningTasks.filter(t => t.status === 'Pending' || t.status === 'Assigned').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Cleaning Department Dashboard</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Operations & Sanitation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time monitoring of campus cleanliness, classroom sanitization, washroom hygiene, and automated student ticket resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Report Unclean Area
          </button>
          <button
            onClick={() => setActiveTab('student-complaints')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            Student Queue ({studentCleaningComplaints.length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Requests</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalTasks}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all blocks & floors</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase">Pending Areas</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Waiting or assigned</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-blue-700 uppercase">In Progress</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Staff on site</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase">Cleaned Today</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Inspected & certified</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'tasks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Cleaning Tasks ({cleaningTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('student-complaints')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'student-complaints' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Student Complaints Queue</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
            {studentCleaningComplaints.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'report' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          + Report Unclean Area
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sanitation Staff Roster
        </button>
      </div>

      {/* ===================== TAB 1: ALL CLEANING TASKS ===================== */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {['All', 'Pending', 'Assigned', 'In Progress', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                      statusFilter === st ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-slate-500 ml-2">Area:</span>
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="All">All Area Types</option>
                <option value="Classroom">Classroom</option>
                <option value="Washroom">Washroom</option>
                <option value="Corridor">Corridor</option>
                <option value="Outdoor">Outdoor / Grounds</option>
                <option value="Cafeteria">Cafeteria</option>
              </select>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search area, cleaner, issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.length === 0 ? (
              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Cleaning Tasks Found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  All areas are currently clean and inspected. Click "Log Cleaning Task" to report an area.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {task.areaType}
                      </span>
                      {task.complaintId && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          Student Ref: {task.complaintId}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">{task.area}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Issue: {task.issueType} • Priority: {task.priority}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reported by: {task.reportedBy}</p>

                  {/* Photo if uploaded */}
                  {task.photo && (
                    <div className="mt-2.5">
                      <img
                        src={task.photo}
                        alt="Task location"
                        className="w-full h-28 object-cover rounded-xl border border-slate-200"
                      />
                    </div>
                  )}

                  {/* Staff Assignment Bar */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Assigned Cleaner:</span>
                    <select
                      value={task.assignedStaff}
                      onChange={(e) => updateCleaningTask(task.id, { assignedStaff: e.target.value, status: 'Assigned' })}
                      className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Ramesh Sharma">Ramesh Sharma</option>
                      <option value="Sunita Devi">Sunita Devi</option>
                      <option value="Anil Verma">Anil Verma</option>
                      <option value="Geeta Kumari">Geeta Kumari</option>
                    </select>
                  </div>

                  {task.completionNotes && (
                    <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
                      ✓ Completion Note: {task.completionNotes}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {task.status !== 'Completed' && (
                    <>
                      {task.status !== 'In Progress' && (
                        <button
                          onClick={() => updateCleaningTask(task.id, { status: 'In Progress' })}
                          className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          Start Cleaning
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setCompletionNotes('');
                          setCompleteModalOpen(true);
                        }}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Cleaned
                      </button>
                    </>
                  )}
                  {task.status === 'Completed' && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Cleaned & Verified ({task.completedAt ? new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'})
                    </span>
                  )}
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: INTERCONNECTED STUDENT COMPLAINTS QUEUE ===================== */}
      {activeTab === 'student-complaints' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
            <strong>Cross-Department Link Active:</strong> These complaints were submitted directly by students in the Student Portal under "Cleaning & Sanitation". Updating the status or adding department notes here automatically reflects on the student's live tracking view!
          </div>

          <div className="space-y-4">
            {studentCleaningComplaints.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Student Cleaning Complaints</h4>
                <p className="text-xs text-slate-400 mt-1">
                  No issues reported by students for sanitation. Everything is in order!
                </p>
              </div>
            ) : (
              studentCleaningComplaints.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">Student: {c.studentName}</span>
                      <span className="text-xs text-slate-400">• {c.location}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{c.description}"
                    </p>

                    {c.image && (
                      <div className="mt-2">
                        <img src={c.image} alt="Reported issue" className="w-28 h-20 rounded-lg object-cover border" />
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">Assigned Crew:</span>
                      <input
                        type="text"
                        defaultValue={c.assignedTo}
                        onBlur={(e) => updateComplaintStatus(c.id, c.status, c.resolutionNotes, e.target.value)}
                        placeholder="Assign staff member..."
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50"
                      />
                    </div>
                  </div>

                  {/* Actions for Sanitation Lead */}
                  <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : (c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800')
                    }`}>
                      Current Status: {c.status}
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      {c.status !== 'In Progress' && c.status !== 'Resolved' && (
                        <button
                          onClick={() => updateComplaintStatus(c.id, 'In Progress', 'Sanitation crew dispatched to location.', c.assignedTo || 'Sanitation Staff')}
                          className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
                        >
                          Dispatch Crew
                        </button>
                      )}
                      {c.status !== 'Resolved' && (
                        <button
                          onClick={() => updateComplaintStatus(c.id, 'Resolved', 'Area thoroughly sanitized, deep cleaned and verified by supervisor.', c.assignedTo || 'Sanitation Staff')}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: REPORT UNCLEAN AREA ===================== */}
      {activeTab === 'report' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <h2 className="text-lg font-black text-slate-900">Report Unclean Campus Location</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Log an area needing sanitation, trash disposal, or deep cleaning.
          </p>

          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area / Room Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Science Block C - 2nd Floor East Washroom or Room 304"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Area Type</label>
                <select
                  value={areaType}
                  onChange={(e) => setAreaType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Washroom">Washroom</option>
                  <option value="Corridor">Corridor / Hallway</option>
                  <option value="Cafeteria">Cafeteria / Mess</option>
                  <option value="Outdoor">Outdoor / Courtyard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Nature</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Spill / Sanitation">Spill / Sanitation</option>
                  <option value="Trash Overflow">Trash Overflow</option>
                  <option value="Deep Clean">Deep Clean & Mop</option>
                  <option value="Regular Routine">Regular Routine Sweep</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Cleaner</label>
                <select
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Unassigned">Assign Later</option>
                  <option value="Ramesh Sharma">Ramesh Sharma</option>
                  <option value="Sunita Devi">Sunita Devi</option>
                  <option value="Anil Verma">Anil Verma</option>
                  <option value="Geeta Kumari">Geeta Kumari</option>
                </select>
              </div>
            </div>

            {/* Photo upload */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-2">Upload Site Photo</label>
              <div className="flex items-center gap-3">
                {photoPreview ? (
                  <img src={photoPreview} alt="Site preview" className="w-16 h-16 rounded-xl object-cover border" />
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <Camera className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="clean-photo"
                    className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold hover:bg-slate-100"
                  >
                    Select Photo
                  </label>
                  <input id="clean-photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20"
            >
              {isSubmitting ? 'Creating Task...' : 'Dispatch Cleaning Task'}
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 4: SANITATION STAFF ROSTER ===================== */}
      {activeTab === 'staff' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Sanitation Team Roster & Shifts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {staffMembers.map((staff, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                  <p className="text-[11px] text-slate-500">{staff.role}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">🕒 {staff.shift}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {staff.activeTasks} Active Tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mark Completed Modal */}
      {completeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-base font-black text-slate-900">Confirm Task Completion</h3>
            <p className="text-xs text-slate-500 mt-1">
              Mark <strong>{selectedTask?.area}</strong> as completed. If linked to a student complaint, the student will be notified immediately.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Completion & Inspection Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Washroom mopped, bleached, restocked with soap and paper towels. Tested water flow."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setCompleteModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
              >
                Certify Cleaned
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


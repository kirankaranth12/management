import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Save,
  Plus,
  Megaphone,
  FileText,
  Check,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  Calculator,
  Award,
  Edit3,
  Edit,
  Trash2,
  MapPin,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function FacultyPortalPage() {
  const {
    user,
    studentAcademics,
    saveStudentAttendance,
    saveStudentMarks,
    gradeAssignment,
    complaints,
    updateComplaintStatus,
    announcements,
    publishAnnouncement,
    registeredStudents,
    timetable,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('grades'); // 'grades' | 'attendance' | 'assignments' | 'complaints' | 'timetable' | 'profile'

  // ==================== ATTENDANCE STATE ====================
  const [selectedCourse, setSelectedCourse] = useState('CS-301');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Interactive Roster for Attendance (Real registered students only)
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    if (registeredStudents && registeredStudents.length > 0) {
      setRoster(registeredStudents.map(s => ({
        id: s.id,
        name: s.name,
        rollNo: s.rollNo || s.id,
        status: 'Present'
      })));
    } else {
      setRoster([]);
    }
  }, [registeredStudents]);

  // ==================== MARKS & GRADING STATE ====================
  const [gradingCourse, setGradingCourse] = useState('CS-301');
  const [marksRoster, setMarksRoster] = useState([]);
  const [isSavingMarks, setIsSavingMarks] = useState(false);

  // Sync marks from backend or real registered students
  useEffect(() => {
    if (registeredStudents && registeredStudents.length > 0) {
      const savedCourseMarks = studentAcademics?.courseMarks && studentAcademics.courseMarks[gradingCourse];
      setMarksRoster(registeredStudents.map(s => {
        const found = Array.isArray(savedCourseMarks) ? savedCourseMarks.find(m => m.studentId === s.id || m.rollNo === s.rollNo) : null;
        return found || {
          studentId: s.id,
          studentName: s.name,
          rollNo: s.rollNo || s.id,
          internalMarks: 0,
          examMarks: 0,
          totalMarks: 0,
          maxMarks: 100,
          grade: '-',
          remarks: ''
        };
      }));
    } else {
      setMarksRoster([]);
    }
  }, [gradingCourse, studentAcademics, registeredStudents]);

  // Grade calculator helper
  const calculateGrade = (total) => {
    const num = Number(total);
    if (num >= 90) return 'A+';
    if (num >= 80) return 'A';
    if (num >= 75) return 'A-';
    if (num >= 70) return 'B+';
    if (num >= 60) return 'B';
    if (num >= 50) return 'C';
    return 'F';
  };

  // Update student mark field
  const handleMarkChange = (studentId, field, val) => {
    setMarksRoster(prev => prev.map(item => {
      if (item.studentId === studentId) {
        const updated = { ...item, [field]: val };
        const internal = field === 'internalMarks' ? Number(val) : Number(item.internalMarks || 0);
        const exam = field === 'examMarks' ? Number(val) : Number(item.examMarks || 0);
        const total = Math.min(100, Math.max(0, internal + exam));
        updated.totalMarks = total;
        updated.grade = calculateGrade(total);
        return updated;
      }
      return item;
    }));
  };

  // Save student marks
  const handleSaveMarks = async () => {
    setIsSavingMarks(true);
    await saveStudentMarks(gradingCourse, marksRoster);
    setIsSavingMarks(false);
  };

  // ==================== ASSIGNMENT EVALUATION MODAL ====================
  const [assignments, setAssignments] = useState([]);
  const [asnTitle, setAsnTitle] = useState('');
  const [asnCourse, setAsnCourse] = useState('CS-301: Advanced Data Structures');
  const [asnDue, setAsnDue] = useState('2026-12-02');
  const [asnModalOpen, setAsnModalOpen] = useState(false);

  // Evaluate single submission modal
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [selectedAsn, setSelectedAsn] = useState(null);
  const [evalStudent, setEvalStudent] = useState('');
  const [evalMarks, setEvalMarks] = useState('0');
  const [evalFeedback, setEvalFeedback] = useState('');

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!evalMarks || !selectedAsn) return;
    const targetStudentId = evalStudent ? evalStudent.split('(')[1]?.replace(')', '').trim() : (registeredStudents[0]?.id || '');
    const targetStudentName = evalStudent ? evalStudent.split('(')[0]?.trim() : (registeredStudents[0]?.name || 'Student');
    await gradeAssignment(
      selectedAsn.id,
      targetStudentId,
      targetStudentName,
      evalMarks,
      selectedAsn.maxMarks,
      evalFeedback
    );
    setEvalModalOpen(false);
  };

  // Toggle student attendance status
  const toggleStatus = (id) => {
    setRoster(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s));
  };

  // Save attendance
  const handleSaveAttendance = async () => {
    await saveStudentAttendance(selectedCourse, attendanceDate, roster);
  };

  // Academic Complaints
  const academicComplaints = complaints.filter(c => c.category === 'Academic & Faculty' || c.department.includes('Faculty'));

  // Timetable State & Operations
  const [timetableDayFilter, setTimetableDayFilter] = useState('All');
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [isEditingSlot, setIsEditingSlot] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState(null);
  const [slotDay, setSlotDay] = useState('Monday');
  const [slotTime, setSlotTime] = useState('09:00 AM - 10:30 AM');
  const [slotCourse, setSlotCourse] = useState('CS-301: Advanced Data Structures');
  const [slotRoom, setSlotRoom] = useState('Lecture Hall 304');
  const [slotFaculty, setSlotFaculty] = useState(user?.name || 'Dr. Robert Vance');
  const [slotDepartment, setSlotDepartment] = useState(user?.department || 'Computer Science & Engineering');

  const daysList = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const activeTimetable = (timetable && timetable.length > 0) ? timetable : (studentAcademics?.timetable || []);
  const filteredTimetable = timetableDayFilter === 'All'
    ? activeTimetable
    : activeTimetable.filter(slot => slot.day === timetableDayFilter);

  const handleOpenAddSlot = () => {
    setIsEditingSlot(false);
    setCurrentSlotId(null);
    setSlotDay(timetableDayFilter === 'All' ? 'Monday' : timetableDayFilter);
    setSlotTime('09:00 AM - 10:30 AM');
    setSlotCourse('CS-301: Advanced Data Structures');
    setSlotRoom('Lecture Hall 304');
    setSlotFaculty(user?.name || 'Dr. Robert Vance');
    setSlotDepartment(user?.department || 'Computer Science & Engineering');
    setSlotModalOpen(true);
  };

  const handleOpenEditSlot = (slot) => {
    setIsEditingSlot(true);
    setCurrentSlotId(slot.id);
    setSlotDay(slot.day || 'Monday');
    setSlotTime(slot.time || '09:00 AM - 10:30 AM');
    setSlotCourse(slot.course || '');
    setSlotRoom(slot.room || '');
    setSlotFaculty(slot.faculty || user?.name || '');
    setSlotDepartment(slot.department || user?.department || 'Computer Science & Engineering');
    setSlotModalOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!slotCourse.trim() || !slotTime.trim() || !slotRoom.trim()) {
      showToast('Please fill all mandatory slot fields.', 'error');
      return;
    }

    const payload = {
      day: slotDay,
      time: slotTime,
      course: slotCourse,
      room: slotRoom,
      faculty: slotFaculty || user?.name || 'Faculty Member',
      department: slotDepartment
    };

    if (isEditingSlot && currentSlotId) {
      await updateTimetableSlot(currentSlotId, payload);
    } else {
      await addTimetableSlot(payload);
    }
    setSlotModalOpen(false);
  };

  const handleDeleteSlot = async (id, courseName) => {
    if (window.confirm(`Are you sure you want to remove "${courseName}" from the timetable?`)) {
      await deleteTimetableSlot(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <BookOpenCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Faculty Academic Portal</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Instruction & Grading Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mark student marks/grades, record class attendance, evaluate assignments, and resolve student academic complaints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grades')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4" />
            Mark Student Grades
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        {[
          { id: 'grades', label: 'Mark Student Grades & Marks', icon: Calculator, highlight: true },
          { id: 'attendance', label: 'Student Attendance Management', icon: Clock },
          { id: 'assignments', label: `Assignments & Evaluation (${assignments.length})`, icon: FileText },
          { id: 'complaints', label: `Relevant Student Complaints (${academicComplaints.length})`, icon: AlertCircle },
          { id: 'timetable', label: 'Faculty Teaching Timetable', icon: Calendar },
          { id: 'profile', label: 'Faculty Profile', icon: UserCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {tab.highlight && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: MARK STUDENT GRADES & SCORES ===================== */}
      {activeTab === 'grades' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Mark Student Course Scores & Calculate Grades</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Live Sync to Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter or edit Internal Marks (0–30) and Exam Marks (0–70). The Total (0–100) and letter Grade are calculated automatically. Saving immediately updates the student's Academic Portal and recalculates their CGPA!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={gradingCourse}
                onChange={(e) => setGradingCourse(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="CS-301">CS-301: Advanced Data Structures</option>
                <option value="CS-304">CS-304: Distributed Database Systems</option>
                <option value="CS-308">CS-308: Cloud Architecture & DevOps</option>
                <option value="HU-301">HU-301: Professional Ethics</option>
              </select>

              <button
                onClick={handleSaveMarks}
                disabled={isSavingMarks}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSavingMarks ? 'Publishing...' : 'Save & Publish Marks'}
              </button>
            </div>
          </div>

          {/* Interactive Marks Table */}
          {marksRoster.length === 0 ? (
            <div className="py-12 px-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <p className="font-bold text-slate-700 text-sm">No Registered Students in Class</p>
              <p className="mt-1">Only real students who have registered an account will appear here for grading and course assessments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Student ID</th>
                    <th className="p-3 text-center">Internal (Max 30)</th>
                    <th className="p-3 text-center">Exam (Max 70)</th>
                    <th className="p-3 text-center">Total / 100</th>
                    <th className="p-3 text-center">Grade Awarded</th>
                    <th className="p-3">Faculty Remarks / Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marksRoster.map((item) => (
                    <tr key={item.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{item.rollNo}</td>
                      <td className="p-3 font-bold text-slate-900">{item.studentName}</td>
                      <td className="p-3 text-slate-500 font-mono">{item.studentId}</td>

                    {/* Internal Marks Input */}
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={item.internalMarks}
                        onChange={(e) => handleMarkChange(item.studentId, 'internalMarks', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </td>

                    {/* Exam Marks Input */}
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={item.examMarks}
                        onChange={(e) => handleMarkChange(item.studentId, 'examMarks', e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </td>

                    {/* Calculated Total */}
                    <td className="p-3 text-center">
                      <span className="font-black text-sm text-slate-900">
                        {item.totalMarks}
                      </span>
                    </td>

                    {/* Grade Pill */}
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-md font-extrabold text-xs ${item.grade === 'A+' || item.grade === 'A'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.grade === 'A-' || item.grade === 'B+'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : item.grade === 'B' || item.grade === 'C'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                        {item.grade}
                      </span>
                    </td>

                    {/* Remarks Input */}
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.remarks || ''}
                        onChange={(e) => handleMarkChange(item.studentId, 'remarks', e.target.value)}
                        placeholder="Add performance note..."
                        className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-medium">
            <span>
              💡 <strong>Grading Scale:</strong> A+ (&ge;90), A (&ge;80), A- (&ge;75), B+ (&ge;70), B (&ge;60), C (&ge;50), F (&lt;50). Saving updates the student's portal immediately!
            </span>
            <button
              onClick={handleSaveMarks}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              Publish Updated Marks
            </button>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ATTENDANCE MANAGEMENT ===================== */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Mark Student Class Attendance</h3>
              <p className="text-xs text-slate-500">
                Click status pill to toggle Present / Absent. Saving updates the student's live attendance metrics instantly.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="CS-301">CS-301: Advanced Data Structures</option>
                <option value="CS-308">CS-308: Cloud Architecture</option>
                <option value="CS-304">CS-304: Database Systems</option>
                <option value="HU-301">HU-301: Professional Ethics</option>
              </select>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />

              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Attendance
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          {roster.length === 0 ? (
            <div className="py-12 px-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <p className="font-bold text-slate-700 text-sm">No Registered Students in Class</p>
              <p className="mt-1">Only real students who have registered an account will appear here for class attendance.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Roll No</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Student ID</th>
                  <th className="p-3.5">Today's Attendance Status</th>
                  <th className="p-3.5">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{student.rollNo}</td>
                    <td className="p-3.5 font-bold text-slate-900">{student.name}</td>
                    <td className="p-3.5 text-slate-500 font-mono">{student.id}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs ${student.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Present' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => toggleStatus(student.id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: ASSIGNMENTS & EVALUATION ===================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Course Assignments & Grading Roster</h3>
              <p className="text-xs text-slate-500">Post new homework, lab assignments, and grade student submissions.</p>
            </div>
            <button
              onClick={() => setAsnModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Post New Assignment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asn) => (
              <div key={asn.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {asn.course}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{asn.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Due Date: 📅 {asn.dueDate} • Max Marks: {asn.maxMarks}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Submissions: {asn.submissions}</span>
                  <button
                    onClick={() => {
                      setSelectedAsn(asn);
                      setEvalModalOpen(true);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Evaluate & Grade →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Evaluate Submission Modal */}
          {evalModalOpen && selectedAsn && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
                <h3 className="text-base font-black text-slate-900">Evaluate Student Submission</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedAsn.title}</p>

                <form onSubmit={handleGradeSubmission} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                    <select
                      value={evalStudent}
                      onChange={(e) => setEvalStudent(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      {roster.length === 0 ? (
                        <option value="">No registered students found</option>
                      ) : (
                        roster.map(s => (
                          <option key={s.id} value={`${s.name} (${s.id})`}>{s.name} ({s.rollNo || s.id})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Awarded Marks (Out of {selectedAsn.maxMarks}) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedAsn.maxMarks}
                      required
                      value={evalMarks}
                      onChange={(e) => setEvalMarks(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Feedback & Remarks</label>
                    <textarea
                      rows={3}
                      value={evalFeedback}
                      onChange={(e) => setEvalFeedback(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEvalModalOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                    >
                      Save Grade & Notify Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Assignment Modal */}
          {asnModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
                <h3 className="text-base font-black text-slate-900">Post Course Assignment</h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!asnTitle.trim()) return;
                    setAssignments(prev => [
                      ...prev,
                      {
                        id: `ASN-${prev.length + 1}`,
                        title: asnTitle,
                        course: asnCourse,
                        dueDate: asnDue,
                        maxMarks: 50,
                        submissions: '0 / 45'
                      }
                    ]);
                    setAsnModalOpen(false);
                    setAsnTitle('');
                    showToast('Assignment posted to student portal!', 'success');
                  }}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lab Exercise 5: Binary Search Tree Optimizations"
                      value={asnTitle}
                      onChange={(e) => setAsnTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                    <select
                      value={asnCourse}
                      onChange={(e) => setAsnCourse(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="CS-301: Advanced Data Structures">CS-301: Advanced Data Structures</option>
                      <option value="CS-308: Cloud Architecture & DevOps">CS-308: Cloud Architecture</option>
                      <option value="CS-304: Distributed Database Systems">CS-304: Database Systems</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline *</label>
                    <input
                      type="date"
                      required
                      value={asnDue}
                      onChange={(e) => setAsnDue(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAsnModalOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    >
                      Post Assignment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: RELEVANT STUDENT COMPLAINTS ===================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-medium">
            <strong>Cross-Department Link:</strong> Complaints regarding lecture hall projectors, lab equipment, or course grading appear directly here for faculty review and resolution.
          </div>

          <div className="space-y-4">
            {academicComplaints.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <strong className="text-xs text-slate-800">Student: {c.studentName}</strong>
                      <span className="text-xs text-slate-400">• {c.location}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{c.description}"
                    </p>

                    {c.resolutionNotes && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg mt-2 font-medium">
                        Resolution Note: {c.resolutionNotes} (by {c.assignedTo})
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                      {c.status}
                    </span>

                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => updateComplaintStatus(c.id, 'Resolved', 'Facility issue inspected and resolved.', user?.name || 'Faculty Member')}
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs flex items-center gap-1 mt-2"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Resolve Complaint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 5: FACULTY TIMETABLE ===================== */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Faculty Weekly Teaching Timetable</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Live Sync to Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Add, reschedule, or remove class slots. Updates reflect instantly across student and campus portals.
              </p>
            </div>

            <button
              onClick={handleOpenAddSlot}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Class Slot
            </button>
          </div>

          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setTimetableDayFilter(day)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timetableDayFilter === day
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Slots List */}
          <div className="space-y-3">
            {filteredTimetable.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-200/70">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Class Slots Scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {timetableDayFilter === 'All' ? 'No lectures or lab sessions found in the timetable.' : `No classes scheduled for ${timetableDayFilter}.`}
                </p>
                <button
                  onClick={handleOpenAddSlot}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  + Add First Slot
                </button>
              </div>
            ) : (
              filteredTimetable.map((slot, index) => (
                <div
                  key={slot.id || index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.day} • {slot.time}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{slot.course}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Faculty: {slot.faculty || 'Unassigned'} • Dept: {slot.department || 'General'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slot.room}
                    </span>

                    <button
                      onClick={() => handleOpenEditSlot(slot)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Edit timetable slot"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id, slot.course)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add / Edit Slot Modal */}
          {slotModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-scale-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-slate-900">
                    {isEditingSlot ? 'Edit Class Timetable Slot' : 'Add New Class Slot'}
                  </h3>
                  <button
                    onClick={() => setSlotModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveSlot} className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Course Title & Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS-301: Advanced Data Structures"
                      value={slotCourse}
                      onChange={(e) => setSlotCourse(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week *</label>
                      <select
                        value={slotDay}
                        onChange={(e) => setSlotDay(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-emerald-500 outline-none"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 09:00 AM - 10:30 AM"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Lecture Hall / Room *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LH-304 / Lab 2"
                        value={slotRoom}
                        onChange={(e) => setSlotRoom(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={slotDepartment}
                        onChange={(e) => setSlotDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:border-emerald-500 outline-none"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Faculty In-charge</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Robert Vance"
                      value={slotFaculty}
                      onChange={(e) => setSlotFaculty(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSlotModalOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                    >
                      {isEditingSlot ? 'Save Changes' : 'Add Class Slot'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 6: FACULTY PROFILE ===================== */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Faculty Member'}
              className="w-20 h-20 rounded-2xl"
              textClassName="text-xl"
            />
            <div>
              <h3 className="text-lg font-black text-slate-900">{user?.name || 'Faculty Member'}</h3>
              <p className="text-xs font-bold text-emerald-700">{user?.designation || 'Assistant Professor'}, {user?.department || 'Computer Science'}</p>
              <p className="text-xs text-slate-500 mt-1">{user?.bio || 'Academic Instructor & Faculty Member'}</p>
            </div>
          </div>

          <div className="text-xs space-y-2 text-slate-700">
            <p>📧 Official Email: {user?.email || 'faculty@campusconnect.edu'}</p>
            <p>🏢 Office Cabin: Academic Complex, Cabin 14</p>
            <p>🕒 Student Office Hours: Mon & Fri, 02:00 PM - 04:00 PM</p>
          </div>
        </div>
      )}

    </div>
  );
}

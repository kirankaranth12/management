import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  UploadCloud,
  Camera,
  MessageSquare,
  HelpCircle,
  Star,
  Sparkles,
  FileText,
  UserCheck,
  Award,
  ChevronRight,
  Filter,
  Check,
  Eye,
  Info,
  Download,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function StudentPortalPage() {
  const {
    user,
    activeSubTab,
    complaints,
    submitComplaint,
    announcements,
    lostAndFound,
    reportLostFound,
    claimLostFoundItem,
    studentAcademics,
    submitSuggestion,
    showToast
  } = useApp();

  // Active sub-tab state
  const [subTab, setSubTab] = useState(activeSubTab || 'overview');

  // Timetable selected day
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Complaint form state
  const [compTitle, setCompTitle] = useState('');
  const [compCategory, setCompCategory] = useState('Cleaning & Sanitation');
  const [compLocation, setCompLocation] = useState('');
  const [compDescription, setCompDescription] = useState('');
  const [compPriority, setCompPriority] = useState('Medium');
  const [compImage, setCompImage] = useState('');
  const [compImagePreview, setCompImagePreview] = useState('');
  const [isSubmittingComp, setIsSubmittingComp] = useState(false);

  // Complaint tracker filter & search
  const [trackerFilter, setTrackerFilter] = useState('All');
  const [trackerSearch, setTrackerSearch] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Lost & Found form state
  const [lnfModalOpen, setLnfModalOpen] = useState(false);
  const [lnfTitle, setLnfTitle] = useState('');
  const [lnfCategory, setLnfCategory] = useState('Electronics');
  const [lnfLocation, setLnfLocation] = useState('');
  const [lnfStatus, setLnfStatus] = useState('Lost');
  const [lnfContact, setLnfContact] = useState('');
  const [lnfImage, setLnfImage] = useState('');

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState('Campus Infrastructure');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');

  // Handle complaint photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompImage(reader.result);
        setCompImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit complaint
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!compTitle.trim() || !compLocation.trim() || !compDescription.trim()) {
      showToast('Please fill all mandatory fields.', 'error');
      return;
    }

    setIsSubmittingComp(true);
    const result = await submitComplaint({
      title: compTitle,
      category: compCategory,
      location: compLocation,
      description: compDescription,
      priority: compPriority,
      image: compImage
    });
    setIsSubmittingComp(false);

    if (result.success) {
      setCompTitle('');
      setCompLocation('');
      setCompDescription('');
      setCompImage('');
      setCompImagePreview('');
      setSubTab('complaints-tracker');
    }
  };

  // Handle Lost and Found submit
  const handleLnfSubmit = async (e) => {
    e.preventDefault();
    if (!lnfTitle.trim() || !lnfLocation.trim()) return;

    await reportLostFound({
      title: lnfTitle,
      category: lnfCategory,
      locationFound: lnfLocation,
      status: lnfStatus,
      contact: lnfContact || user?.email,
      image: lnfImage || ''
    });

    setLnfModalOpen(false);
    setLnfTitle('');
    setLnfLocation('');
  };

  // Handle Feedback submit
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComments.trim()) return;

    await submitSuggestion({
      title: `[${feedbackCategory}] Rating: ${feedbackRating}★`,
      description: feedbackComments
    });

    showToast('Thank you! Your feedback has been shared with management & council.', 'success');
    setFeedbackComments('');
  };

  // Filter complaints for the logged-in student (strictly isolated to their account)
  const myComplaints = complaints.filter(c => {
    const matchesUser = user?.role === 'Student'
      ? (c.studentId === user?.id || (user?.email && c.studentEmail === user?.email))
      : true;
    const matchesStatus = trackerFilter === 'All' || c.status === trackerFilter;
    const matchesSearch = c.title.toLowerCase().includes(trackerSearch.toLowerCase()) ||
      c.location.toLowerCase().includes(trackerSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(trackerSearch.toLowerCase());
    return matchesUser && matchesStatus && matchesSearch;
  });

  const courses = studentAcademics?.courses || [];
  const timetable = studentAcademics?.timetable || [];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayTimetable = timetable.filter(t => t.day === selectedDay);

  const subTabs = [
    { id: 'overview', label: 'Overview & Profile', icon: UserCheck },
    { id: 'attendance', label: 'Attendance Details', icon: Clock },
    { id: 'academics', label: 'Academic Info', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'complaint-register', label: 'Register Complaint', icon: AlertCircle, highlight: true },
    { id: 'complaints-tracker', label: 'Track Complaints', icon: CheckCircle2, badge: myComplaints.length },
    { id: 'announcements', label: 'Announcements', icon: Award },
    { id: 'feedback', label: 'Feedback & Ideas', icon: MessageSquare },
    { id: 'lost-found', label: 'Lost & Found', icon: Sparkles, badge: lostAndFound.length }
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Portal Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Student Portal</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Active Term 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Central student station: Academic records, attendance monitoring, live complaints, timetable, and campus services.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('complaint-register')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            New Complaint
          </button>
          <button
            onClick={() => setSubTab('complaints-tracker')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            Track Status ({myComplaints.length})
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : tab.highlight
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================== SUBTAB 1: OVERVIEW & PROFILE ===================== */}
      {subTab === 'overview' && (
        <div className="space-y-6">

          {/* Student Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-start sm:items-center gap-5">
                <Avatar
                  src={user?.avatar}
                  name={user?.name || 'Student Member'}
                  className="w-20 h-20 rounded-2xl"
                  textClassName="text-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{user?.name || 'Student Member'}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Regular Student
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Roll No: <span className="font-mono text-slate-700">{user?.rollNo || user?.id || 'STU-001'}</span> • ID: <span className="font-mono text-slate-700">{user?.id || 'STU-001'}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {user?.department || 'Computer Science & Engineering'} • {user?.semester || '1st Semester'}
                  </p>
                </div>
              </div>

              {/* High-level stats */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">CGPA</span>
                  <p className="text-xl font-black text-blue-950 mt-0.5">{user?.cgpa || '0.00'}</p>
                  <span className="text-[10px] text-blue-600">Scale of 4.0</span>
                </div>
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Attendance</span>
                  <p className="text-xl font-black text-emerald-950 mt-0.5">{user?.attendance || 0}%</p>
                  <span className="text-[10px] text-emerald-600">Above 75% Min</span>
                </div>
                <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Credits</span>
                  <p className="text-xl font-black text-purple-950 mt-0.5">13</p>
                  <span className="text-[10px] text-purple-600">4 Active Courses</span>
                </div>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setSubTab('attendance')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all text-left group"
              >
                <Clock className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Check Attendance</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Subject-wise percentages</p>
              </button>

              <button
                onClick={() => setSubTab('timetable')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all text-left group"
              >
                <Calendar className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Weekly Timetable</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Lecture halls & times</p>
              </button>

              <button
                onClick={() => setSubTab('complaint-register')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all text-left group"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">File Complaint</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Cleaning, AC, Projector</p>
              </button>

              <button
                onClick={() => setSubTab('lost-found')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all text-left group"
              >
                <Sparkles className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-slate-800">Lost & Found</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Report or claim items</p>
              </button>
            </div>
          </div>

          {/* Current Semester Courses Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">Enrolled Courses & Academic Standings</h3>
              <button
                onClick={() => setSubTab('academics')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Full Academic Report →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                        {c.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{c.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Faculty: {c.faculty}</p>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                      Grade: {c.grade}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Attendance: {c.attendance}% ({c.attendedClasses}/{c.totalClasses})</span>
                    <span className="text-slate-700">{c.marks}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.attendance >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${c.attendance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================== SUBTAB 2: ATTENDANCE DETAILS ===================== */}
      {subTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Attendance Analytics & Criteria</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional threshold: Minimum 75% required for exam hall ticket generation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl border text-center ${(user?.attendance || 0) >= 75 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                  <span className="text-[10px] font-bold uppercase">Aggregate</span>
                  <p className="text-lg font-black">{user?.attendance || 0}%</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-center">
                  <span className="text-[10px] font-bold uppercase">Status</span>
                  <p className={`text-xs font-bold mt-1 ${(user?.attendance || 0) >= 75 ? 'text-emerald-700' : ((user?.attendance || 0) > 0 ? 'text-rose-600' : 'text-slate-500')}`}>
                    {(user?.attendance || 0) >= 75 ? 'Eligible for Exams' : ((user?.attendance || 0) > 0 ? 'Attendance Warning (<75%)' : 'Awaiting Faculty Attendance')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {courses.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Faculty: {c.faculty} • {c.credits} Credits</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">{c.attendance}%</span>
                      <p className="text-[11px] text-slate-500">{c.attendedClasses} attended of {c.totalClasses} classes</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${c.attendance >= 85 ? 'bg-emerald-500' : (c.attendance >= 75 ? 'bg-blue-500' : 'bg-rose-500')
                        }`}
                      style={{ width: `${c.attendance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 3: ACADEMIC INFO ===================== */}
      {subTab === 'academics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Cumulative CGPA</span>
              <p className="text-3xl font-black text-blue-700 mt-1">{user?.cgpa || '0.00'}</p>
              <p className="text-xs text-slate-500 mt-1">Calculated from published course grades</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Completed Credits</span>
              <p className="text-3xl font-black text-emerald-700 mt-1">0 / 160</p>
              <p className="text-xs text-slate-500 mt-1">Enrolled for current academic semester</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Degree Program</span>
              <p className="text-lg font-bold text-purple-900 mt-1">{user?.department || 'Computer Science & Engineering'}</p>
              <p className="text-xs text-slate-500 mt-1">Academic Year 2026-2027</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">Detailed Course Grading & Assessment</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Course Code</th>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Faculty</th>
                    <th className="p-3.5">Credits</th>
                    <th className="p-3.5">Marks Obtained</th>
                    <th className="p-3.5">Grade</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <tr key={c.code} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-blue-700">{c.code}</td>
                      <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3.5 text-slate-600">{c.faculty}</td>
                      <td className="p-3.5 font-medium">{c.credits}</td>
                      <td className="p-3.5 font-bold text-slate-800">{c.marks}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-xs ${c.grade === 'A+' || c.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.grade === 'A-' || c.grade === 'B+'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : c.grade === 'B' || c.grade === 'C'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                          {c.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-semibold">{c.marks !== '0/100' ? 'Graded' : 'Enrolled'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course Study Documents & Materials Shared by Faculty */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Faculty Course Materials & Syllabus Documents</h3>
                <p className="text-xs text-slate-500">Official syllabus outlines and course learning materials published by faculty.</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Academic Resources
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      {c.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Faculty: {c.faculty}</p>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded syllabus document for ${c.code}`, 'success')}
                    className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Syllabus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 4: TIMETABLE ===================== */}
      {subTab === 'timetable' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Weekly Lecture & Lab Schedule</h3>
              <p className="text-xs text-slate-500">Select day of the week to view class timings and hall allotments.</p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Timetable Cards */}
          <div className="space-y-3">
            {dayTimetable.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No classes scheduled for {selectedDay}. Enjoy your study hours!
              </div>
            ) : (
              dayTimetable.map((slot, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs shrink-0 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{slot.course}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Faculty In-charge: {slot.faculty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700">
                      📍 {slot.room}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 5: COMPLAINT REGISTRATION ===================== */}
      {subTab === 'complaint-register' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-3xl mx-auto">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              Automated Department Dispatch
            </div>
            <h2 className="text-xl font-black text-slate-900">Register a Complaint or Maintenance Issue</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the category accurately. Your ticket is immediately routed to the responsible department (Cleaning, Faculty, Management, etc.).
            </p>
          </div>

          <form onSubmit={handleComplaintSubmit} className="space-y-4">

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Complaint Category *
              </label>
              <select
                value={compCategory}
                onChange={(e) => setCompCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-800"
              >
                <option value="Cleaning & Sanitation">Cleaning & Sanitation (Washrooms, Classrooms, Garbage)</option>
                <option value="Academic & Faculty">Academic & Faculty (Projector, Lab Equipment, Course)</option>
                <option value="Campus Infrastructure">Campus Infrastructure (Water Dispensers, Power, Furniture)</option>
                <option value="Student Counselling">Student Counselling & Mental Wellbeing Guidance</option>
                <option value="Student Affairs & Leadership">Student Affairs, Council & Mess/Cafeteria</option>
                <option value="Other">Other Campus Facility Issue</option>
              </select>
              <p className="text-[11px] text-blue-600 mt-1">
                ➔ Route target: <strong>{compCategory === 'Cleaning & Sanitation' ? 'Cleaning Department' : (compCategory === 'Academic & Faculty' ? 'Faculty / Academics' : 'Management Department')}</strong>
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                placeholder="Brief summary (e.g. Water leak in Block B 2nd floor washroom)"
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Specific Location & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exact Location / Room *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Block C, Room 204 or Library West Wing"
                  value={compLocation}
                  onChange={(e) => setCompLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={compPriority}
                  onChange={(e) => setCompPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                >
                  <option value="Low">Low - Routine notice</option>
                  <option value="Medium">Medium - Regular priority</option>
                  <option value="High">High - Urgent attention required</option>
                  <option value="Emergency">Emergency - Hazard / Safety risk</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Description of the Issue *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what is wrong, when it was noticed, and any relevant safety hazards..."
                value={compDescription}
                onChange={(e) => setCompDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Photo Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Upload Supporting Photo (Optional)
              </label>

              <div className="flex items-center gap-4">
                {compImagePreview ? (
                  <div className="relative group shrink-0">
                    <img
                      src={compImagePreview}
                      alt="Uploaded proof"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCompImage('');
                        setCompImagePreview('');
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1">
                  <label
                    htmlFor="complaint-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold shadow-xs transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                    Browse or Take Photo
                  </label>
                  <input
                    id="complaint-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    PNG, JPG, or WEBP up to 5MB. Photos help sanitation and maintenance workers resolve issues faster.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingComp}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmittingComp ? 'Dispatching Ticket...' : 'Submit Complaint & Forward to Department'}
              <Check className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ===================== SUBTAB 6: COMPLAINT TRACKING ===================== */}
      {subTab === 'complaints-tracker' && (
        <div className="space-y-6">

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTrackerFilter(st)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${trackerFilter === st ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket title, room, ID..."
                value={trackerSearch}
                onChange={(e) => setTrackerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {myComplaints.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Complaints in this view</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Everything looks in order. Use "Register Complaint" if you notice any facility issue.
                </p>
              </div>
            ) : (
              myComplaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">
                          {c.id}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {c.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.priority === 'High' || c.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                          {c.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400">
                          Filed on {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900">{c.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">📍 Location: {c.location}</p>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{c.description}"
                      </p>

                      {/* Photo preview if present */}
                      {c.image && (
                        <div className="mt-3">
                          <img
                            src={c.image}
                            alt="Complaint proof"
                            className="w-32 h-20 rounded-xl object-cover border border-slate-200 shadow-xs"
                          />
                        </div>
                      )}

                      {/* Department Live Response */}
                      <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                          <span>Responsible Dept: {c.department}</span>
                          <span className="text-blue-700 font-semibold">Assigned: {c.assignedTo || 'In Queue'}</span>
                        </div>
                        <p className="text-xs text-blue-950 font-medium">
                          <strong>Latest Dept Note:</strong> {c.resolutionNotes || 'Awaiting initial department review.'}
                        </p>
                      </div>

                      {/* Action Timeline */}
                      {c.history && c.history.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Status Progression Timeline:
                          </p>
                          <div className="space-y-1">
                            {c.history.map((h, i) => (
                              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="font-semibold text-slate-800">[{h.status}]</span>
                                <span>{h.note}</span>
                                <span className="text-slate-400 text-[10px] ml-auto">({h.by})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Pill Badge */}
                    <div className="sm:text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-500' : (c.status === 'In Progress' ? 'bg-amber-500' : 'bg-rose-500')
                          }`} />
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 7: ANNOUNCEMENTS ===================== */}
      {subTab === 'announcements' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-black text-slate-900 mb-1">Official Student Notice Board</h3>
            <p className="text-xs text-slate-500 mb-4">Official notices published by examination branch and student council.</p>

            <div className="space-y-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Published by: <strong>{ann.postedBy}</strong> ({ann.authorRole})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== SUBTAB 8: FEEDBACK & SUGGESTIONS ===================== */}
      {subTab === 'feedback' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <h3 className="text-lg font-black text-slate-900">Campus Feedback & Facility Ratings</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Help improve campus infrastructure, library resources, cafeteria quality, and campus hygiene.
          </p>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area of Feedback</label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Campus Cleanliness & Hygiene">Campus Cleanliness & Hygiene</option>
                <option value="Library & Silent Study Zones">Library & Silent Study Zones</option>
                <option value="Cafeteria & Food Quality">Cafeteria & Food Quality</option>
                <option value="Computer Labs & High-Speed Wi-Fi">Computer Labs & High-Speed Wi-Fi</option>
                <option value="Sports Complex & Gymnasium">Sports Complex & Gymnasium</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Satisfaction Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{feedbackRating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Comments & Suggestions</label>
              <textarea
                rows={4}
                required
                placeholder="What can the college administration or student council improve?"
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Submit Feedback to Administration
            </button>
          </form>
        </div>
      )}

      {/* ===================== SUBTAB 9: LOST & FOUND ===================== */}
      {subTab === 'lost-found' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Campus Lost & Found Registry</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized registry managed with security desk and sanitation department.
              </p>
            </div>
            <button
              onClick={() => setLnfModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Report Lost or Found Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lostAndFound.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative mb-3 rounded-2xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Package className="w-8 h-8 mb-1 text-slate-300" />
                        <span className="text-[10px] font-bold">No Photo</span>
                      </div>
                    )}
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Claimed' ? 'bg-slate-900/80 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                      {item.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">📍 Found at: {item.locationFound}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Reported by: {item.reportedBy} ({item.date})</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  {item.status === 'Claimed' ? (
                    <span className="text-xs text-slate-400 font-medium">Claimed by: {item.claimant}</span>
                  ) : (
                    <button
                      onClick={() => claimLostFoundItem(item.id)}
                      className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Claim This Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Report Lost & Found Modal */}
          {lnfModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
                <h3 className="text-base font-black text-slate-900">Report Lost or Found Item</h3>

                <form onSubmit={handleLnfSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Item Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blue Dell Laptop Charger or Student ID Card"
                      value={lnfTitle}
                      onChange={(e) => setLnfTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                      <select
                        value={lnfStatus}
                        onChange={(e) => setLnfStatus(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="Lost">I Lost This Item</option>
                        <option value="Found">I Found This Item</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={lnfCategory}
                        onChange={(e) => setLnfCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Documents/ID">Documents / ID Cards</option>
                        <option value="Books">Books & Notebooks</option>
                        <option value="Accessories">Accessories & Bags</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Science Block 1st Floor bench"
                      value={lnfLocation}
                      onChange={(e) => setLnfLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email/Phone</label>
                    <input
                      type="text"
                      placeholder="your.email@campusconnect.edu"
                      value={lnfContact}
                      onChange={(e) => setLnfContact(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setLnfModalOpen(false)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Publish Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}


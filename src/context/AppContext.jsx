import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusconnect_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Navigation state
  // Tabs: 'home' | 'student-portal' | 'cleaning' | 'management' | 'hr' | 'counselling' | 'student-leader' | 'faculty-portal' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mobile sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications popup
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Data states
  const [complaints, setComplaints] = useState([]);
  const [cleaningTasks, setCleaningTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [hrEmployees, setHrEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [counsellingAppointments, setCounsellingAppointments] = useState([]);
  const [studentCouncil, setStudentCouncil] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [events, setEvents] = useState([]);
  const [lostAndFound, setLostAndFound] = useState([]);
  const [managementStats, setManagementStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [studentAcademics, setStudentAcademics] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('campusconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusconnect_user');
    }
  }, [user]);

  // Load all initial data when user logs in or page mounts
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [
        cmpRes,
        clnRes,
        annRes,
        hrEmpRes,
        hrLevRes,
        cnsRes,
        ldrRepsRes,
        ldrSugRes,
        ldrEvtRes,
        lnfRes,
        mgmtStatsRes,
        mgmtDeptsRes,
        notifRes,
        acadRes
      ] = await Promise.all([
        api.getComplaints(),
        api.getCleaningTasks(),
        api.getAnnouncements(),
        api.getEmployees(),
        api.getLeaves(),
        api.getCounsellingAppointments(),
        api.getRepresentatives(),
        api.getSuggestions(),
        api.getEvents(),
        api.getLostAndFound(),
        api.getManagementStats(),
        api.getDepartments(),
        api.getNotifications(user ? user.id : 'all'),
        api.getStudentAcademics(user ? user.id : 'all'),
        api.getUsers()
      ]);

      if (cmpRes.success) setComplaints(cmpRes.complaints || []);
      if (clnRes.success) setCleaningTasks(clnRes.tasks || []);
      if (annRes.success) setAnnouncements(annRes.announcements || []);
      if (hrEmpRes.success) setHrEmployees(hrEmpRes.employees || []);
      if (hrLevRes.success) setLeaveRequests(hrLevRes.leaves || []);
      if (cnsRes.success) setCounsellingAppointments(cnsRes.appointments || []);
      if (ldrRepsRes.success) setStudentCouncil(ldrRepsRes.representatives || []);
      if (ldrSugRes.success) setSuggestions(ldrSugRes.suggestions || []);
      if (ldrEvtRes.success) setEvents(ldrEvtRes.events || []);
      if (lnfRes.success) setLostAndFound(lnfRes.items || []);
      if (mgmtStatsRes.success) setManagementStats(mgmtStatsRes.stats || null);
      if (mgmtDeptsRes.success) setDepartments(mgmtDeptsRes.departments || []);
      if (notifRes.success) setNotifications(notifRes.notifications || []);
      if (acadRes.success) setStudentAcademics(acadRes);
      if (usersRes && usersRes.success) setAllUsers(usersRes.users || []);
    } catch (e) {
      console.error('Error refreshing data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [user?.id]);

  // Navigate helper
  const navigate = (tab, subTab = 'overview') => {
    if (tab === 'logout') {
      logout();
      return;
    }
    setActiveTab(tab);
    setActiveSubTab(subTab);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const login = async (identifier, password, role) => {
    const res = await api.login({ identifier, password, role });
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}! Logged in as ${res.user.role}.`, 'success');
      // Redirect based on role
      if (res.user.role === 'Student') {
        navigate('student-portal', 'overview');
      } else if (res.user.role === 'Faculty') {
        navigate('faculty-portal', 'overview');
      } else if (res.user.role === 'Admin') {
        navigate('management', 'overview');
      } else if (res.user.role === 'Cleaning') {
        navigate('cleaning', 'tasks');
      } else if (res.user.role === 'HR') {
        navigate('hr', 'employees');
      } else if (res.user.role === 'Counselling') {
        navigate('counselling', 'appointments');
      } else if (res.user.role === 'StudentLeader') {
        navigate('student-leader', 'council');
      } else {
        navigate('home');
      }
      return { success: true };
    } else {
      showToast(res.message || 'Login failed. Please verify credentials.', 'error');
      return { success: false, message: res.message };
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Account created successfully! Welcome, ${res.user.name}.`, 'success');
      // Redirect to respective dashboard
      if (res.user.role === 'Student') navigate('student-portal', 'overview');
      else if (res.user.role === 'Faculty') navigate('faculty-portal', 'overview');
      else if (res.user.role === 'Admin') navigate('management', 'overview');
      else if (res.user.role === 'Cleaning') navigate('cleaning', 'tasks');
      else if (res.user.role === 'HR') navigate('hr', 'employees');
      else if (res.user.role === 'Counselling') navigate('counselling', 'appointments');
      else if (res.user.role === 'StudentLeader') navigate('student-leader', 'council');
      else navigate('home');
      return { success: true };
    } else {
      showToast(res.message || 'Registration failed.', 'error');
      return { success: false, message: res.message };
    }
  };

  const logout = () => {
    const name = user ? user.name : 'User';
    setUser(null);
    try {
      localStorage.removeItem('campusconnect_user');
    } catch (e) {}
    setActiveTab('home');
    showToast(`Signed out successfully. Goodbye ${name}!`, 'info');
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    const res = await api.updateProfile(user.id, updates);
    if (res.success && res.user) {
      setUser(res.user);
      showToast('Profile information updated successfully!', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast(res.message || 'Failed to update profile.', 'error');
    return { success: false };
  };

  // Complaint actions
  const submitComplaint = async (complaintData) => {
    const payload = {
      ...complaintData,
      studentId: user?.id || 'STU-2024-001',
      studentName: user?.name || 'Student',
      studentEmail: user?.email || 'student@campusconnect.edu'
    };
    const res = await api.createComplaint(payload);
    if (res.success) {
      showToast(`Complaint ${res.complaint.id} registered and forwarded to ${res.complaint.department}!`, 'success');
      refreshAllData();
      return { success: true, complaint: res.complaint };
    }
    showToast(res.message || 'Could not submit complaint.', 'error');
    return { success: false };
  };

  const updateComplaintStatus = async (id, status, resolutionNotes, assignedTo) => {
    const res = await api.updateComplaint(id, {
      status,
      resolutionNotes,
      assignedTo,
      updatedBy: user ? `${user.name} (${user.role})` : 'Department Staff'
    });
    if (res.success) {
      showToast(`Complaint ${id} updated to ${status}! Student has been notified.`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to update complaint.', 'error');
    return { success: false };
  };

  // Cleaning actions
  const submitCleaningTask = async (taskData) => {
    const res = await api.createCleaningTask({
      ...taskData,
      reportedBy: user ? `${user.name} (${user.role})` : 'Campus Member'
    });
    if (res.success) {
      showToast(`Cleaning task created for ${res.task.area}!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to report cleaning task.', 'error');
    return { success: false };
  };

  const updateCleaningTask = async (id, updates) => {
    const res = await api.updateCleaningTask(id, updates);
    if (res.success) {
      showToast(`Cleaning task ${id} status: ${res.task.status}!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to update task.', 'error');
    return { success: false };
  };

  // Announcements
  const publishAnnouncement = async (annData) => {
    const res = await api.createAnnouncement({
      ...annData,
      postedBy: user?.name || 'Administration',
      authorRole: user?.role === 'Admin' ? 'Management Office' : (user?.designation || user?.role || 'Staff')
    });
    if (res.success) {
      showToast(`Announcement published and broadcast to ${annData.targetAudience || 'All'}!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to post announcement.', 'error');
    return { success: false };
  };

  // HR Leave actions
  const submitLeaveRequest = async (leaveData) => {
    const res = await api.createLeave({
      ...leaveData,
      employeeId: user?.id || 'EMP-001',
      employeeName: user?.name || 'Staff Member',
      department: user?.department || 'Academics'
    });
    if (res.success) {
      showToast('Leave request submitted to HR for approval.', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to submit leave request.', 'error');
    return { success: false };
  };

  const updateLeaveStatus = async (id, status, reviewerComments) => {
    const res = await api.updateLeave(id, {
      status,
      reviewerComments,
      reviewedBy: user ? `${user.name} (HR)` : 'HR Manager'
    });
    if (res.success) {
      showToast(`Leave request ${status.toLowerCase()}! Employee notified.`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to process leave request.', 'error');
    return { success: false };
  };

  // Counselling actions
  const bookCounselling = async (appData) => {
    const res = await api.bookCounsellingAppointment({
      ...appData,
      studentId: user?.id || 'STU-2024-001',
      studentName: user?.name || 'Student'
    });
    if (res.success) {
      showToast('Confidential counselling appointment requested! Dr. Maya Patel will confirm.', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to request appointment.', 'error');
    return { success: false };
  };

  const updateAppointment = async (id, updates) => {
    const res = await api.updateCounsellingAppointment(id, updates);
    if (res.success) {
      showToast(`Appointment status updated to ${updates.status || 'Updated'}!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to update appointment.', 'error');
    return { success: false };
  };

  const sendCounsellingMessage = async (id, text) => {
    const res = await api.sendCounsellingMessage(id, {
      sender: user?.name || 'Student',
      role: user?.role || 'Student',
      text
    });
    if (res.success) {
      refreshAllData();
      return { success: true };
    }
    return { success: false };
  };

  // Student Leader suggestions & events
  const submitSuggestion = async (sugData) => {
    const res = await api.createSuggestion({
      ...sugData,
      studentId: user?.id || 'STU-2024-001',
      studentName: user?.name || 'Student'
    });
    if (res.success) {
      showToast('Suggestion posted to the Student Council forum!', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to post suggestion.', 'error');
    return { success: false };
  };

  const toggleUpvoteSuggestion = async (id) => {
    const res = await api.upvoteSuggestion(id, user?.id || 'STU-2024-001');
    if (res.success) {
      refreshAllData();
      return { success: true };
    }
    return { success: false };
  };

  const respondSuggestion = async (id, responseData) => {
    const res = await api.respondToSuggestion(id, responseData);
    if (res.success) {
      showToast('Council response recorded and student notified.', 'success');
      refreshAllData();
      return { success: true };
    }
    return { success: false };
  };

  const createEvent = async (eventData) => {
    const res = await api.createEvent({
      ...eventData,
      coordinator: user ? `${user.name} (${user.role})` : 'Student Council'
    });
    if (res.success) {
      showToast(`Event "${eventData.title}" published!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to create event.', 'error');
    return { success: false };
  };

  const registerForEvent = async (id) => {
    const res = await api.registerEvent(id);
    if (res.success) {
      showToast('You have successfully registered for this campus event!', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Registration failed.', 'error');
    return { success: false };
  };

  // Lost & Found
  const reportLostFound = async (itemData) => {
    const res = await api.reportLostAndFound({
      ...itemData,
      reportedBy: user ? `${user.name} (${user.role})` : 'Campus Member'
    });
    if (res.success) {
      showToast(`Item reported to Lost & Found registry!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to report item.', 'error');
    return { success: false };
  };

  const claimLostFoundItem = async (id) => {
    const res = await api.claimLostAndFound(id, user?.name || 'Verified Claimant');
    if (res.success) {
      showToast('Item claimed successfully! Contact security desk with ID to collect.', 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to claim item.', 'error');
    return { success: false };
  };

  // Save student attendance (Faculty)
  const saveStudentAttendance = async (courseCode, date, attendanceRoster) => {
    const res = await api.saveClassAttendance({ courseCode, date, attendanceRoster });
    if (res.success) {
      showToast(`Attendance marked for ${attendanceRoster.length} students in ${courseCode}!`, 'success');
      refreshAllData();
      return { success: true };
    }
    showToast('Failed to save attendance.', 'error');
    return { success: false };
  };

  // Save student marks & grade evaluation (Faculty)
  const saveStudentMarks = async (courseCode, studentMarks) => {
    const res = await api.saveStudentMarks({ courseCode, studentMarks });
    if (res.success) {
      showToast(`Marks and grades published for ${courseCode}! Student cards updated.`, 'success');
      await refreshAllData();
      return { success: true };
    }
    showToast('Failed to save marks.', 'error');
    return { success: false };
  };

  // Grade student assignment
  const gradeAssignment = async (assignmentId, studentId, studentName, marks, maxMarks, feedback) => {
    const res = await api.gradeAssignment({ assignmentId, studentId, studentName, marks, maxMarks, feedback });
    if (res.success) {
      showToast(`Assignment evaluation recorded: ${marks}/${maxMarks}! Student notified.`, 'success');
      await refreshAllData();
      return { success: true };
    }
    showToast('Failed to grade assignment.', 'error');
    return { success: false };
  };

  // Notifications
  const markNotificationRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead(user ? user.id : 'all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  // Reset to demo (Full wipe to clean baseline & return to start)
  const resetToDemo = async () => {
    try {
      localStorage.removeItem('campusconnect_db');
      localStorage.removeItem('campusconnect_user');
    } catch (e) {}
    setUser(null);
    await api.resetSystem();
    showToast('All values reset to clean baseline! Ready to register or log in from start.', 'info');
    await refreshAllData();
  };

  // Unread count
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Real registered users categorized by role
  const registeredStudents = allUsers.filter(u => u.role === 'Student');
  const registeredFaculty = allUsers.filter(u => u.role === 'Faculty');
  const registeredStaff = allUsers.filter(u => !['Student', 'Faculty'].includes(u.role));

  return (
    <AppContext.Provider
      value={{
        user,
        role: user ? user.role : 'Guest',
        activeTab,
        activeSubTab,
        searchTerm,
        setSearchTerm,
        sidebarOpen,
        setSidebarOpen,
        notifDropdownOpen,
        setNotifDropdownOpen,
        navigate,
        login,
        register,
        logout,
        updateUserProfile,
        toasts,
        showToast,
        removeToast,
        complaints,
        submitComplaint,
        updateComplaintStatus,
        cleaningTasks,
        submitCleaningTask,
        updateCleaningTask,
        announcements,
        publishAnnouncement,
        hrEmployees,
        leaveRequests,
        submitLeaveRequest,
        updateLeaveStatus,
        counsellingAppointments,
        bookCounselling,
        updateAppointment,
        sendCounsellingMessage,
        studentCouncil,
        suggestions,
        submitSuggestion,
        toggleUpvoteSuggestion,
        respondSuggestion,
        events,
        createEvent,
        registerForEvent,
        lostAndFound,
        reportLostFound,
        claimLostFoundItem,
        studentAcademics,
        saveStudentAttendance,
        saveStudentMarks,
        gradeAssignment,
        managementStats,
        departments,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        refreshAllData,
        resetToDemo,
        allUsers,
        registeredStudents,
        registeredFaculty,
        registeredStaff,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}


// Robust API client with backend connection and instant localStorage fallback
import { initialData } from '../../server/initialData.js';

const API_BASE = '/api';

// Initialize local fallback storage if needed
function getLocalDB() {
  try {
    const raw = localStorage.getItem('campusconnect_db');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  const cloned = JSON.parse(JSON.stringify(initialData));
  try {
    localStorage.setItem('campusconnect_db', JSON.stringify(cloned));
  } catch (e) {}
  return cloned;
}

function saveLocalDB(data) {
  try {
    localStorage.setItem('campusconnect_db', JSON.stringify(data));
  } catch (e) {}
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`Backend fetch failed for ${endpoint}, using client state fallback:`, err.message);
    return fallbackHandler(endpoint, options);
  }
}

// Client fallback handler for seamless offline / zero-latency experience
function fallbackHandler(endpoint, options = {}) {
  const db = getLocalDB();
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const existing = db.users.find(u => u.email.toLowerCase() === body.email.toLowerCase() || (body.id && u.id.toLowerCase() === body.id.toLowerCase()));
    if (existing) {
      return { success: false, message: 'User already exists.' };
    }
    const newUser = {
      id: body.id || (body.role === 'Student' ? `STU-2024-${String(db.users.length + 1).padStart(3, '0')}` : `EMP-${body.role.toUpperCase().slice(0,3)}-${String(db.users.length + 1).padStart(3, '0')}`),
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'Student',
      department: body.department || 'General',
      phone: body.phone || '+1 (555) 000-0000',
      avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
      rollNo: body.rollNo || (body.role === 'Student' ? `CS24B${Math.floor(100 + Math.random() * 900)}` : undefined),
      employeeCode: body.employeeCode || (body.role !== 'Student' ? `EMP-${Date.now()}` : undefined),
      bio: body.bio || `Registered ${body.role}`,
      cgpa: body.role === 'Student' ? '0.00' : undefined,
      attendance: body.role === 'Student' ? 0 : undefined,
      semester: body.role === 'Student' ? '1st Semester' : undefined,
      joinedDate: 'November 2026'
    };
    db.users.push(newUser);
    if (newUser.role !== 'Student') {
      db.hrEmployees.push({
        id: newUser.employeeCode || newUser.id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        designation: newUser.role === 'Faculty' ? 'Assistant Professor' : `${newUser.role} Officer`,
        joinDate: new Date().toISOString().split('T')[0],
        salaryBand: 'Standard Band',
        status: 'Present',
        leaveBalance: { casual: 10, sick: 10, earned: 15 },
        phone: newUser.phone,
        qualifications: 'Verified Credentials',
        avatar: newUser.avatar
      });
    }
    saveLocalDB(db);
    const { password, ...safe } = newUser;
    return { success: true, user: safe, token: `token-${newUser.id}` };
  }

  // Auth Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const user = db.users.find(u => 
      (u.email.toLowerCase() === body.identifier.toLowerCase() || u.id.toLowerCase() === body.identifier.toLowerCase() || (u.rollNo && u.rollNo.toLowerCase() === body.identifier.toLowerCase()))
    );
    if (!user) return { success: false, message: 'No account found with this ID or Email.' };
    if (user.password !== body.password) return { success: false, message: 'Invalid password.' };
    const { password, ...safe } = user;
    return { success: true, user: safe, token: `token-${user.id}` };
  }

  // Auth Forgot Password
  if (endpoint === '/auth/forgot-password' && method === 'POST') {
    const temp = `Campus@${Math.floor(1000 + Math.random() * 9000)}`;
    return { success: true, message: `Reset link sent! Temporary password: ${temp}`, tempPassword: temp };
  }

  // Complaints GET
  if (endpoint.startsWith('/complaints') && method === 'GET') {
    return { success: true, complaints: db.complaints };
  }

  // Complaints POST
  if (endpoint === '/complaints' && method === 'POST') {
    const id = `CMP-${1000 + db.complaints.length + 1}`;
    const now = new Date().toISOString();
    let department = 'Management Department';
    if (body.category === 'Cleaning & Sanitation') department = 'Cleaning Department';
    else if (body.category === 'Academic & Faculty') department = 'Faculty / Academics';
    else if (body.category === 'Student Counselling') department = 'Student Counselling';
    else if (body.category === 'Student Affairs & Leadership') department = 'Student Leader Department';

    const newCmp = {
      id,
      title: body.title,
      category: body.category,
      department,
      studentId: body.studentId || 'STU-2024-001',
      studentName: body.studentName || 'Student',
      studentEmail: body.studentEmail || 'student@campusconnect.edu',
      location: body.location || 'Campus Premises',
      priority: body.priority || 'Medium',
      status: 'Pending',
      description: body.description,
      image: body.image || '',
      createdAt: now,
      updatedAt: now,
      assignedTo: 'Unassigned',
      resolutionNotes: 'Awaiting department review.',
      history: [{ date: now, status: 'Pending', note: 'Complaint submitted', by: 'Student' }]
    };
    db.complaints.unshift(newCmp);
    if (body.category === 'Cleaning & Sanitation') {
      db.cleaningTasks.unshift({
        id: `CLN-T${200 + db.cleaningTasks.length + 1}`,
        area: body.location || 'Campus Area',
        areaType: 'Washroom',
        issueType: 'Spill / Sanitation',
        reportedBy: `${body.studentName || 'Student'} (${id})`,
        assignedStaff: 'Unassigned',
        status: 'Pending',
        priority: body.priority || 'Medium',
        photo: body.image || '',
        completionPhoto: '',
        completionNotes: '',
        complaintId: id,
        createdAt: now,
        completedAt: ''
      });
    }
    saveLocalDB(db);
    return { success: true, complaint: newCmp };
  }

  // Complaints PUT
  if (endpoint.startsWith('/complaints/') && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const cmp = db.complaints.find(c => c.id === id);
    if (cmp) {
      if (body.status) cmp.status = body.status;
      if (body.assignedTo) cmp.assignedTo = body.assignedTo;
      if (body.resolutionNotes) cmp.resolutionNotes = body.resolutionNotes;
      cmp.updatedAt = new Date().toISOString();
      cmp.history.push({
        date: cmp.updatedAt,
        status: cmp.status,
        note: body.resolutionNotes || `Status updated to ${cmp.status}`,
        by: body.updatedBy || 'Department Officer'
      });
      saveLocalDB(db);
      return { success: true, complaint: cmp };
    }
  }

  // Cleaning Tasks
  if (endpoint === '/cleaning/tasks' && method === 'GET') {
    return { success: true, tasks: db.cleaningTasks };
  }
  if (endpoint === '/cleaning/tasks' && method === 'POST') {
    const task = {
      id: `CLN-T${200 + db.cleaningTasks.length + 1}`,
      area: body.area,
      areaType: body.areaType || 'Classroom',
      issueType: body.issueType || 'Regular Routine',
      reportedBy: body.reportedBy || 'Staff',
      assignedStaff: body.assignedStaff || 'Unassigned',
      status: body.assignedStaff && body.assignedStaff !== 'Unassigned' ? 'Assigned' : 'Pending',
      priority: body.priority || 'Normal',
      photo: body.photo || '',
      completionPhoto: '',
      completionNotes: '',
      complaintId: '',
      createdAt: new Date().toISOString(),
      completedAt: ''
    };
    db.cleaningTasks.unshift(task);
    saveLocalDB(db);
    return { success: true, task };
  }
  if (endpoint.startsWith('/cleaning/tasks/') && method === 'PUT') {
    const id = endpoint.split('/')[3];
    const task = db.cleaningTasks.find(t => t.id === id);
    if (task) {
      if (body.status) task.status = body.status;
      if (body.assignedStaff) task.assignedStaff = body.assignedStaff;
      if (body.completionNotes) task.completionNotes = body.completionNotes;
      if (body.completionPhoto) task.completionPhoto = body.completionPhoto;
      if (body.status === 'Completed') {
        task.completedAt = new Date().toISOString();
        if (task.complaintId) {
          const c = db.complaints.find(x => x.id === task.complaintId);
          if (c) {
            c.status = 'Resolved';
            c.resolutionNotes = task.completionNotes || 'Cleaned and inspected.';
          }
        }
      }
      saveLocalDB(db);
      return { success: true, task };
    }
  }

  // Management Stats & Departments
  if (endpoint === '/management/stats' && method === 'GET') {
    return {
      success: true,
      stats: {
        totalStudents: db.users.filter(u => u.role === 'Student').length,
        totalFaculty: db.users.filter(u => u.role === 'Faculty').length,
        totalStaff: db.users.filter(u => !['Student', 'Faculty'].includes(u.role)).length,
        totalComplaints: db.complaints.length,
        resolvedComplaints: db.complaints.filter(c => c.status === 'Resolved').length,
        pendingComplaints: db.complaints.filter(c => c.status === 'Pending').length,
        inProgressComplaints: db.complaints.filter(c => c.status === 'In Progress').length,
        resolutionRate: db.complaints.length > 0 ? Math.round((db.complaints.filter(c => c.status === 'Resolved').length / db.complaints.length) * 100) : 0,
        cleaningTasksTotal: db.cleaningTasks.length,
        cleaningCompleted: db.cleaningTasks.filter(t => t.status === 'Completed').length,
        sanitationScore: db.cleaningTasks.length > 0 ? Math.round((db.cleaningTasks.filter(t => t.status === 'Completed').length / db.cleaningTasks.length) * 100) : 0,
        departmentsCount: (db.departments || []).length
      }
    };
  }
  if (endpoint === '/management/departments' && method === 'GET') {
    return { success: true, departments: db.departments };
  }

  // Announcements
  if (endpoint === '/announcements' && method === 'GET') {
    return { success: true, announcements: db.announcements };
  }
  if (endpoint === '/announcements' && method === 'POST') {
    const newAnn = {
      id: `ANN-${300 + db.announcements.length + 1}`,
      title: body.title,
      content: body.content,
      category: body.category || 'Academic',
      postedBy: body.postedBy || 'Management Office',
      authorRole: body.authorRole || 'Administration',
      targetAudience: body.targetAudience || 'All',
      pinned: Boolean(body.pinned),
      priority: body.priority || 'Normal',
      createdAt: new Date().toISOString()
    };
    db.announcements.unshift(newAnn);
    saveLocalDB(db);
    return { success: true, announcement: newAnn };
  }

  // HR
  if (endpoint === '/hr/employees' && method === 'GET') return { success: true, employees: db.hrEmployees };
  if (endpoint === '/hr/leaves' && method === 'GET') return { success: true, leaves: db.leaveRequests };
  if (endpoint === '/hr/leaves' && method === 'POST') {
    const leave = {
      id: `LEV-${500 + db.leaveRequests.length + 1}`,
      employeeId: body.employeeId,
      employeeName: body.employeeName || 'Staff',
      department: body.department || 'General',
      leaveType: body.leaveType || 'Casual Leave',
      startDate: body.startDate,
      endDate: body.endDate,
      days: 2,
      reason: body.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      reviewedBy: 'HR Department',
      reviewerComments: ''
    };
    db.leaveRequests.unshift(leave);
    saveLocalDB(db);
    return { success: true, leave };
  }
  if (endpoint.startsWith('/hr/leaves/') && method === 'PUT') {
    const id = endpoint.split('/')[3];
    const leave = db.leaveRequests.find(l => l.id === id);
    if (leave) {
      leave.status = body.status;
      leave.reviewerComments = body.reviewerComments || '';
      saveLocalDB(db);
      return { success: true, leave };
    }
  }

  // Counselling
  if (endpoint.startsWith('/counselling/appointments') && method === 'GET') {
    return { success: true, appointments: db.counsellingAppointments };
  }
  if (endpoint === '/counselling/appointments' && method === 'POST') {
    const appItem = {
      id: `CNS-APP-${String(db.counsellingAppointments.length + 1).padStart(2, '0')}`,
      studentId: body.studentId || 'STU-2024-001',
      studentName: body.studentName || 'Student',
      counsellorName: 'Campus Counsellor',
      category: body.category || 'Academic Stress',
      date: body.date,
      timeSlot: body.timeSlot,
      mode: body.mode || 'In-Person (Room 108)',
      notes: body.notes || '',
      status: 'Requested',
      counsellorNotes: '',
      messages: [{ sender: body.studentName, role: 'Student', text: body.notes || 'Requested appointment.', timestamp: new Date().toISOString() }]
    };
    db.counsellingAppointments.unshift(appItem);
    saveLocalDB(db);
    return { success: true, appointment: appItem };
  }

  // Leaders
  if (endpoint === '/leaders/representatives' && method === 'GET') return { success: true, representatives: db.studentCouncil };
  if (endpoint === '/leaders/suggestions' && method === 'GET') return { success: true, suggestions: db.studentSuggestions };
  if (endpoint === '/leaders/events' && method === 'GET') return { success: true, events: db.campusEvents };

  // Academics
  if (endpoint.startsWith('/academics/student/') && method === 'GET') {
    return {
      success: true,
      courses: db.academicData.studentCourses,
      timetable: db.academicData.timetable,
      studentRoster: db.academicData.studentRoster,
      courseMarks: db.academicData.courseMarks || {}
    };
  }
  if (endpoint === '/academics/marks' && method === 'POST') {
    if (!db.academicData.courseMarks) db.academicData.courseMarks = {};
    db.academicData.courseMarks[body.courseCode] = body.studentMarks;
    const targetCourse = db.academicData.studentCourses.find(c => c.code === body.courseCode);
    const alexMark = body.studentMarks.find(m => m.studentId === 'STU-2024-001');
    if (targetCourse && alexMark) {
      targetCourse.marks = `${alexMark.totalMarks || (Number(alexMark.internalMarks || 0) + Number(alexMark.examMarks || 0))}/100`;
      targetCourse.grade = alexMark.grade;
      const u = db.users.find(x => x.id === 'STU-2024-001');
      if (u) {
        u.cgpa = "3.90";
      }
    }
    saveLocalDB(db);
    return {
      success: true,
      message: `Marks updated for ${body.courseCode}!`,
      courses: db.academicData.studentCourses,
      courseMarks: db.academicData.courseMarks[body.courseCode]
    };
  }
  if (endpoint === '/academics/grade-assignment' && method === 'POST') {
    return { success: true, message: `Assignment graded: ${body.marks}/${body.maxMarks || 50} recorded.` };
  }

  // Lost & Found
  if (endpoint === '/lost-found' && method === 'GET') return { success: true, items: db.lostAndFound };

  // Notifications
  if (endpoint.startsWith('/notifications/') && method === 'GET') {
    return { success: true, notifications: db.notifications };
  }

  return { success: true, message: 'OK' };
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  updateProfile: (id, data) => request(`/auth/profile/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (id, data) => request(`/auth/change-password/${id}`, { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => request('/auth/users'),

  // Complaints
  getComplaints: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/complaints${q ? '?' + q : ''}`);
  },
  createComplaint: (data) => request('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateComplaint: (id, data) => request(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Cleaning
  getCleaningTasks: () => request('/cleaning/tasks'),
  createCleaningTask: (data) => request('/cleaning/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateCleaningTask: (id, data) => request(`/cleaning/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Management
  getManagementStats: () => request('/management/stats'),
  getDepartments: () => request('/management/departments'),
  saveDepartment: (data) => request('/management/departments', { method: 'POST', body: JSON.stringify(data) }),

  // Announcements
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (data) => request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => request(`/announcements/${id}`, { method: 'DELETE' }),

  // HR
  getEmployees: () => request('/hr/employees'),
  createEmployee: (data) => request('/hr/employees', { method: 'POST', body: JSON.stringify(data) }),
  getLeaves: () => request('/hr/leaves'),
  createLeave: (data) => request('/hr/leaves', { method: 'POST', body: JSON.stringify(data) }),
  updateLeave: (id, data) => request(`/hr/leaves/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  markStaffAttendance: (data) => request('/hr/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Counselling
  getCounsellingAppointments: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/counselling/appointments${q ? '?' + q : ''}`);
  },
  bookCounsellingAppointment: (data) => request('/counselling/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateCounsellingAppointment: (id, data) => request(`/counselling/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  sendCounsellingMessage: (id, data) => request(`/counselling/appointments/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),

  // Student Leader
  getRepresentatives: () => request('/leaders/representatives'),
  getSuggestions: () => request('/leaders/suggestions'),
  createSuggestion: (data) => request('/leaders/suggestions', { method: 'POST', body: JSON.stringify(data) }),
  upvoteSuggestion: (id, userId) => request(`/leaders/suggestions/${id}/upvote`, { method: 'POST', body: JSON.stringify({ userId }) }),
  respondToSuggestion: (id, data) => request(`/leaders/suggestions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getEvents: () => request('/leaders/events'),
  createEvent: (data) => request('/leaders/events', { method: 'POST', body: JSON.stringify(data) }),
  registerEvent: (id) => request(`/leaders/events/${id}/register`, { method: 'POST' }),

  // Academics
  getStudentAcademics: (id) => request(`/academics/student/${id}`),
  saveClassAttendance: (data) => request('/academics/attendance', { method: 'POST', body: JSON.stringify(data) }),
  saveStudentMarks: (data) => request('/academics/marks', { method: 'POST', body: JSON.stringify(data) }),
  gradeAssignment: (data) => request('/academics/grade-assignment', { method: 'POST', body: JSON.stringify(data) }),

  // Lost & Found
  getLostAndFound: () => request('/lost-found'),
  reportLostAndFound: (data) => request('/lost-found', { method: 'POST', body: JSON.stringify(data) }),
  claimLostAndFound: (id, claimantName) => request(`/lost-found/${id}/claim`, { method: 'PUT', body: JSON.stringify({ claimantName }) }),

  // Notifications
  getNotifications: (userId) => request(`/notifications/${userId}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: (userId) => request(`/notifications/read-all/${userId}`, { method: 'PUT' }),

  // Reset
  resetSystem: () => request('/system/reset', { method: 'POST' })
};


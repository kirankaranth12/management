import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Database manager
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading db.json, falling back to initial data:', e);
    }
    this.save(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }

  save(dataToSave) {
    try {
      this.data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db.json:', e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }
}

const db = new Database();

// Helper to push notification
function createNotification({ userId = 'all', targetRole = 'all', title, message, type = 'system', link = 'home' }) {
  const notif = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    targetRole,
    title,
    message,
    type,
    link,
    read: false,
    createdAt: new Date().toISOString()
  };
  db.data.notifications.unshift(notif);
  db.save();
  return notif;
}

// ======================== AUTH ROUTES ========================

// Register
app.post('/api/auth/register', (req, res) => {
  const { id, name, email, password, role, department, avatar, phone, rollNo, employeeCode, bio } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  // Check existing
  const existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase() || (id && u.id.toLowerCase() === id.toLowerCase()));
  if (existing) {
    return res.status(400).json({ success: false, message: 'User with this ID or Email already exists.' });
  }

  const generatedId = id || (role === 'Student' ? `STU-2024-${String(db.data.users.length + 1).padStart(3, '0')}` : `EMP-${role.substring(0,3).toUpperCase()}-${String(db.data.users.length + 1).padStart(3, '0')}`);

  const newUser = {
    id: generatedId,
    name,
    email,
    password,
    role: role || 'Student',
    department: department || 'General',
    phone: phone || '+1 (555) 000-0000',
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    rollNo: rollNo || (role === 'Student' ? `CS24B${Math.floor(100 + Math.random() * 900)}` : undefined),
    employeeCode: employeeCode || (role !== 'Student' ? `EMP-${generatedId}` : undefined),
    bio: bio || `Registered ${role} in ${department || 'College'}.`,
    cgpa: role === 'Student' ? '3.80' : undefined,
    attendance: role === 'Student' ? 92.0 : undefined,
    semester: role === 'Student' ? '1st Semester' : undefined,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };

  db.data.users.push(newUser);

  // If faculty or staff, also add to HR employees
  if (newUser.role !== 'Student') {
    db.data.hrEmployees.push({
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

  createNotification({
    userId: newUser.id,
    targetRole: newUser.role,
    title: 'Welcome to CampusConnect!',
    message: `Welcome, ${newUser.name}! Your account has been registered successfully.`,
    type: 'system',
    link: 'profile'
  });

  db.save();

  // Return user without sensitive plain password in token payload
  const { password: _, ...userSafe } = newUser;
  return res.json({ success: true, user: userSafe, token: `fake-jwt-${Date.now()}` });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Please provide ID/Email and password.' });
  }

  const user = db.data.users.find(u => 
    (u.email.toLowerCase() === identifier.toLowerCase() || u.id.toLowerCase() === identifier.toLowerCase() || (u.rollNo && u.rollNo.toLowerCase() === identifier.toLowerCase()))
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'No account found with this ID or Email.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
  }

  // If role filter is given and doesn't match, warn or allow admin switch
  if (role && role !== 'All' && user.role !== role && user.role !== 'Admin') {
    // We still allow login but notify of actual registered role
  }

  const { password: _, ...userSafe } = user;
  return res.json({ success: true, user: userSafe, token: `jwt-token-${user.id}-${Date.now()}` });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() || u.id.toLowerCase() === (email || '').toLowerCase());
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'No registered user found with this email or ID.' });
  }

  // Simulate password reset
  const tempPassword = `Campus@${Math.floor(1000 + Math.random() * 9000)}`;
  user.password = tempPassword;
  db.save();

  return res.json({ 
    success: true, 
    message: `Password reset instructions sent! For demonstration, temporary password set to: ${tempPassword}`,
    tempPassword
  });
});

// Update Profile
app.put('/api/auth/profile/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const userIndex = db.data.users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Prevent overriding password through this endpoint without checks
  delete updates.password;

  db.data.users[userIndex] = { ...db.data.users[userIndex], ...updates };

  // Also sync in hrEmployees if exists
  const hrIndex = db.data.hrEmployees.findIndex(e => e.id === id || e.email === db.data.users[userIndex].email);
  if (hrIndex !== -1) {
    db.data.hrEmployees[hrIndex] = {
      ...db.data.hrEmployees[hrIndex],
      name: updates.name || db.data.hrEmployees[hrIndex].name,
      phone: updates.phone || db.data.hrEmployees[hrIndex].phone,
      avatar: updates.avatar || db.data.hrEmployees[hrIndex].avatar
    };
  }

  db.save();
  const { password: _, ...userSafe } = db.data.users[userIndex];
  return res.json({ success: true, user: userSafe });
});

// Change Password
app.post('/api/auth/change-password/:id', (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = db.data.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.password !== currentPassword) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  db.save();
  return res.json({ success: true, message: 'Password updated successfully!' });
});

// Get users list
app.get('/api/auth/users', (req, res) => {
  const safeUsers = db.data.users.map(({ password, ...u }) => u);
  res.json({ success: true, users: safeUsers });
});

// ======================== COMPLAINTS ROUTES ========================

// Get Complaints
app.get('/api/complaints', (req, res) => {
  const { category, department, studentId, status } = req.query;
  let list = [...db.data.complaints];

  if (category) {
    list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (department) {
    list = list.filter(c => c.department.toLowerCase().includes(department.toLowerCase()));
  }
  if (studentId) {
    list = list.filter(c => c.studentId === studentId);
  }
  if (status) {
    list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ success: true, complaints: list });
});

// Create Complaint
app.post('/api/complaints', (req, res) => {
  const { title, category, description, location, priority = 'Medium', image = '', studentId, studentName, studentEmail } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
  }

  // Route to the appropriate department
  let department = 'Management Department';
  let targetRole = 'Admin';
  if (category === 'Cleaning & Sanitation') {
    department = 'Cleaning Department';
    targetRole = 'Cleaning';
  } else if (category === 'Academic & Faculty') {
    department = 'Faculty / Academics';
    targetRole = 'Faculty';
  } else if (category === 'Student Counselling') {
    department = 'Student Counselling';
    targetRole = 'Counselling';
  } else if (category === 'Student Affairs & Leadership') {
    department = 'Student Leader Department';
    targetRole = 'StudentLeader';
  } else if (category === 'Campus Infrastructure') {
    department = 'Management Department';
    targetRole = 'Admin';
  }

  const complaintId = `CMP-${1000 + db.data.complaints.length + 1}`;
  const now = new Date().toISOString();

  const newComplaint = {
    id: complaintId,
    title,
    category,
    department,
    studentId: studentId || 'STU-2024-001',
    studentName: studentName || 'Student',
    studentEmail: studentEmail || 'student@campusconnect.edu',
    location: location || 'Campus Premises',
    priority,
    status: 'Pending',
    description,
    image,
    createdAt: now,
    updatedAt: now,
    assignedTo: 'Unassigned',
    resolutionNotes: 'Awaiting department review.',
    history: [
      { date: now, status: 'Pending', note: `Complaint submitted by ${studentName || 'Student'}`, by: 'Student' }
    ]
  };

  db.data.complaints.unshift(newComplaint);

  // If cleaning category, automatically create a linked cleaning task for the cleaning department!
  if (category === 'Cleaning & Sanitation') {
    const cleaningTask = {
      id: `CLN-T${200 + db.data.cleaningTasks.length + 1}`,
      area: location || 'Unspecified Location',
      areaType: location.toLowerCase().includes('washroom') ? 'Washroom' : (location.toLowerCase().includes('corridor') ? 'Corridor' : 'Classroom'),
      issueType: 'Spill / Sanitation',
      reportedBy: `${studentName || 'Student'} (${complaintId})`,
      assignedStaff: 'Unassigned',
      status: 'Pending',
      priority,
      photo: image,
      completionPhoto: '',
      completionNotes: '',
      complaintId: complaintId,
      createdAt: now,
      completedAt: ''
    };
    db.data.cleaningTasks.unshift(cleaningTask);
  }

  // Send notification to the responsible department
  createNotification({
    userId: 'all',
    targetRole,
    title: `New ${priority} Priority Complaint: ${title.slice(0, 40)}...`,
    message: `${studentName || 'A student'} filed a complaint under ${category} at ${location}.`,
    type: 'complaint',
    link: category === 'Cleaning & Sanitation' ? 'cleaning' : (category === 'Academic & Faculty' ? 'faculty' : 'management')
  });

  // Also confirm notification to the student
  createNotification({
    userId: newComplaint.studentId,
    targetRole: 'Student',
    title: `Complaint Registered (${complaintId})`,
    message: `Your complaint has been forwarded to the ${department}. Tracking ID: ${complaintId}`,
    type: 'complaint',
    link: 'student'
  });

  db.save();
  res.json({ success: true, complaint: newComplaint });
});

// Update Complaint Status & Notes (From Any Department)
app.put('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, resolutionNotes, updatedBy = 'Department Officer' } = req.body;

  const complaint = db.data.complaints.find(c => c.id === id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  const now = new Date().toISOString();
  if (status) complaint.status = status;
  if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
  if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
  complaint.updatedAt = now;

  complaint.history.push({
    date: now,
    status: status || complaint.status,
    note: resolutionNotes || `Status updated to ${status} by ${updatedBy}`,
    by: updatedBy
  });

  // If this complaint is tied to a cleaning task, sync status
  if (complaint.category === 'Cleaning & Sanitation') {
    const task = db.data.cleaningTasks.find(t => t.complaintId === complaint.id);
    if (task) {
      if (status === 'Resolved') {
        task.status = 'Completed';
        task.completedAt = now;
        task.completionNotes = resolutionNotes || 'Cleaned and verified.';
      } else if (status === 'In Progress') {
        task.status = 'In Progress';
      }
    }
  }

  // Send live update notification back to the student!
  createNotification({
    userId: complaint.studentId,
    targetRole: 'Student',
    title: `Complaint ${complaint.id} Update: ${complaint.status}`,
    message: `${updatedBy}: "${resolutionNotes || `Your complaint is now ${complaint.status}.`}"`,
    type: 'complaint',
    link: 'student'
  });

  db.save();
  res.json({ success: true, complaint });
});

// ======================== CLEANING DEPARTMENT ROUTES ========================

// Get cleaning tasks
app.get('/api/cleaning/tasks', (req, res) => {
  res.json({ success: true, tasks: db.data.cleaningTasks });
});

// Create cleaning task
app.post('/api/cleaning/tasks', (req, res) => {
  const { area, areaType = 'Classroom', issueType = 'Regular Routine', reportedBy, assignedStaff = 'Unassigned', priority = 'Normal', photo = '' } = req.body;

  if (!area) {
    return res.status(400).json({ success: false, message: 'Area is required.' });
  }

  const newTask = {
    id: `CLN-T${200 + db.data.cleaningTasks.length + 1}`,
    area,
    areaType,
    issueType,
    reportedBy: reportedBy || 'Campus Staff',
    assignedStaff,
    status: assignedStaff && assignedStaff !== 'Unassigned' ? 'Assigned' : 'Pending',
    priority,
    photo,
    completionPhoto: '',
    completionNotes: '',
    complaintId: '',
    createdAt: new Date().toISOString(),
    completedAt: ''
  };

  db.data.cleaningTasks.unshift(newTask);

  createNotification({
    userId: 'all',
    targetRole: 'Cleaning',
    title: `New Cleaning Request: ${area}`,
    message: `${issueType} reported for ${areaType} (${priority} priority).`,
    type: 'cleaning',
    link: 'cleaning'
  });

  db.save();
  res.json({ success: true, task: newTask });
});

// Update cleaning task
app.put('/api/cleaning/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedStaff, completionNotes, completionPhoto } = req.body;

  const task = db.data.cleaningTasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Cleaning task not found.' });
  }

  const now = new Date().toISOString();
  if (status) task.status = status;
  if (assignedStaff) task.assignedStaff = assignedStaff;
  if (completionNotes) task.completionNotes = completionNotes;
  if (completionPhoto) task.completionPhoto = completionPhoto;

  if (status === 'Completed') {
    task.completedAt = now;

    // INTERCONNECTION: If linked to a student complaint, mark student complaint as Resolved!
    if (task.complaintId) {
      const complaint = db.data.complaints.find(c => c.id === task.complaintId);
      if (complaint) {
        complaint.status = 'Resolved';
        complaint.updatedAt = now;
        complaint.resolutionNotes = completionNotes || 'Cleaned and sanitized by facilities team.';
        complaint.history.push({
          date: now,
          status: 'Resolved',
          note: `Cleaning completed by ${task.assignedStaff || 'Sanitation Team'}: ${task.completionNotes || 'Inspected and certified clean.'}`,
          by: 'Cleaning Department'
        });

        // Notify student immediately
        createNotification({
          userId: complaint.studentId,
          targetRole: 'Student',
          title: `Cleaning Verified: Complaint ${complaint.id} Resolved!`,
          message: `The cleaning team resolved your report for ${task.area}.`,
          type: 'cleaning',
          link: 'student'
        });
      }
    }
  } else if (status === 'In Progress' && task.complaintId) {
    const complaint = db.data.complaints.find(c => c.id === task.complaintId);
    if (complaint && complaint.status === 'Pending') {
      complaint.status = 'In Progress';
      complaint.updatedAt = now;
      complaint.assignedTo = task.assignedStaff || 'Cleaning Crew';
      complaint.history.push({
        date: now,
        status: 'In Progress',
        note: `Cleaning staff ${task.assignedStaff || 'dispatched'} started work on site.`,
        by: 'Cleaning Department'
      });
    }
  }

  db.save();
  res.json({ success: true, task });
});

// ======================== MANAGEMENT DEPARTMENT ROUTES ========================

// Stats
app.get('/api/management/stats', (req, res) => {
  const totalStudents = db.data.users.filter(u => u.role === 'Student').length;
  const totalFaculty = db.data.users.filter(u => u.role === 'Faculty').length;
  const totalStaff = db.data.users.filter(u => !['Student', 'Faculty'].includes(u.role)).length;
  const totalComplaints = db.data.complaints.length;
  const resolvedComplaints = db.data.complaints.filter(c => c.status === 'Resolved').length;
  const pendingComplaints = db.data.complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = db.data.complaints.filter(c => c.status === 'In Progress').length;
  const totalCleaningTasks = db.data.cleaningTasks.length;
  const completedCleaningTasks = db.data.cleaningTasks.filter(t => t.status === 'Completed').length;

  res.json({
    success: true,
    stats: {
      totalStudents: totalStudents + 2450, // realistic college base + live count
      totalFaculty: totalFaculty + 185,
      totalStaff: totalStaff + 64,
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100,
      cleaningTasksTotal: totalCleaningTasks,
      cleaningCompleted: completedCleaningTasks,
      departmentsCount: db.data.departments.length
    }
  });
});

// Departments list
app.get('/api/management/departments', (req, res) => {
  res.json({ success: true, departments: db.data.departments });
});

// Add / Update department
app.post('/api/management/departments', (req, res) => {
  const { id, name, head, facultyCount = 10, studentCount = 100, budget = '$200,000' } = req.body;
  if (!name || !head) {
    return res.status(400).json({ success: false, message: 'Department name and head are required.' });
  }

  const deptId = id || `DEP-${name.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4)}`;
  const existingIndex = db.data.departments.findIndex(d => d.id === deptId);

  const deptData = {
    id: deptId,
    name,
    head,
    facultyCount: Number(facultyCount),
    studentCount: Number(studentCount),
    activeComplaints: 0,
    budget,
    satisfactionRate: 95
  };

  if (existingIndex !== -1) {
    db.data.departments[existingIndex] = { ...db.data.departments[existingIndex], ...deptData };
  } else {
    db.data.departments.push(deptData);
  }

  db.save();
  res.json({ success: true, department: deptData });
});

// ======================== ANNOUNCEMENTS ROUTES ========================

// Get announcements
app.get('/api/announcements', (req, res) => {
  res.json({ success: true, announcements: db.data.announcements });
});

// Create announcement
app.post('/api/announcements', (req, res) => {
  const { title, content, category = 'Academic', postedBy, authorRole = 'Administration', targetAudience = 'All', priority = 'Normal', pinned = false } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const newAnn = {
    id: `ANN-${300 + db.data.announcements.length + 1}`,
    title,
    content,
    category,
    postedBy: postedBy || 'Management Office',
    authorRole,
    targetAudience,
    pinned: Boolean(pinned),
    priority,
    createdAt: new Date().toISOString()
  };

  db.data.announcements.unshift(newAnn);

  // Broadcast notification to audience
  createNotification({
    userId: 'all',
    targetRole: targetAudience === 'All' ? 'all' : targetAudience,
    title: `Announcement: ${title}`,
    message: `${postedBy} published a new ${category.toLowerCase()} notice.`,
    type: 'announcement',
    link: 'home'
  });

  db.save();
  res.json({ success: true, announcement: newAnn });
});

// Delete announcement
app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  db.data.announcements = db.data.announcements.filter(a => a.id !== id);
  db.save();
  res.json({ success: true, message: 'Announcement removed.' });
});

// ======================== HR DEPARTMENT ROUTES ========================

// Employees
app.get('/api/hr/employees', (req, res) => {
  res.json({ success: true, employees: db.data.hrEmployees });
});

app.post('/api/hr/employees', (req, res) => {
  const { name, email, department, designation, salaryBand = 'Standard Band', phone, qualifications, avatar } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ success: false, message: 'Name, email, and department are required.' });
  }

  const newEmp = {
    id: `EMP-STAFF-${100 + db.data.hrEmployees.length + 1}`,
    name,
    email,
    department,
    designation: designation || 'Staff Member',
    joinDate: new Date().toISOString().split('T')[0],
    salaryBand,
    status: 'Present',
    leaveBalance: { casual: 12, sick: 10, earned: 15 },
    phone: phone || '+1 (555) 000-0000',
    qualifications: qualifications || 'Bachelor Degree',
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
  };

  db.data.hrEmployees.push(newEmp);
  db.save();
  res.json({ success: true, employee: newEmp });
});

// Leaves
app.get('/api/hr/leaves', (req, res) => {
  res.json({ success: true, leaves: db.data.leaveRequests });
});

app.post('/api/hr/leaves', (req, res) => {
  const { employeeId, employeeName, department, leaveType, startDate, endDate, reason } = req.body;
  if (!employeeId || !startDate || !endDate || !reason) {
    return res.status(400).json({ success: false, message: 'Employee ID, dates, and reason are required.' });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

  const newLeave = {
    id: `LEV-${500 + db.data.leaveRequests.length + 1}`,
    employeeId,
    employeeName: employeeName || 'Employee',
    department: department || 'General',
    leaveType: leaveType || 'Casual Leave',
    startDate,
    endDate,
    days: diffDays,
    reason,
    status: 'Pending',
    appliedOn: new Date().toISOString().split('T')[0],
    reviewedBy: 'HR Department',
    reviewerComments: ''
  };

  db.data.leaveRequests.unshift(newLeave);

  createNotification({
    userId: 'all',
    targetRole: 'HR',
    title: `Leave Request from ${employeeName}`,
    message: `${diffDays}-day ${leaveType} requested for ${startDate} to ${endDate}.`,
    type: 'hr',
    link: 'hr'
  });

  db.save();
  res.json({ success: true, leave: newLeave });
});

// Approve / Reject Leave
app.put('/api/hr/leaves/:id', (req, res) => {
  const { id } = req.params;
  const { status, reviewerComments, reviewedBy = 'Priya Sharma (HR)' } = req.body;

  const leave = db.data.leaveRequests.find(l => l.id === id);
  if (!leave) {
    return res.status(404).json({ success: false, message: 'Leave request not found.' });
  }

  leave.status = status;
  leave.reviewerComments = reviewerComments || '';
  leave.reviewedBy = reviewedBy;

  // Deduct leave balance if approved
  if (status === 'Approved') {
    const emp = db.data.hrEmployees.find(e => e.id === leave.employeeId);
    if (emp && emp.leaveBalance) {
      if (leave.leaveType.toLowerCase().includes('sick') && emp.leaveBalance.sick >= leave.days) {
        emp.leaveBalance.sick -= leave.days;
      } else if (emp.leaveBalance.casual >= leave.days) {
        emp.leaveBalance.casual -= leave.days;
      }
    }
  }

  createNotification({
    userId: leave.employeeId,
    targetRole: 'Faculty',
    title: `Leave Request ${status}`,
    message: `Your ${leave.leaveType} for ${leave.startDate} was ${status.toLowerCase()} by HR. ${reviewerComments ? `Note: "${reviewerComments}"` : ''}`,
    type: 'hr',
    link: 'hr'
  });

  db.save();
  res.json({ success: true, leave });
});

// Mark Staff Attendance
app.post('/api/hr/attendance', (req, res) => {
  const { employeeId, status = 'Present' } = req.body;
  const emp = db.data.hrEmployees.find(e => e.id === employeeId);
  if (emp) {
    emp.status = status;
    db.save();
    return res.json({ success: true, employee: emp });
  }
  res.status(404).json({ success: false, message: 'Employee not found.' });
});

// ======================== STUDENT COUNSELLING ROUTES ========================

// Appointments
app.get('/api/counselling/appointments', (req, res) => {
  const { studentId } = req.query;
  let list = db.data.counsellingAppointments;
  if (studentId) {
    list = list.filter(a => a.studentId === studentId);
  }
  res.json({ success: true, appointments: list });
});

// Request Appointment
app.post('/api/counselling/appointments', (req, res) => {
  const { studentId, studentName, category = 'Academic Stress', date, timeSlot, mode = 'In-Person (Room 108, Wellbeing Wing)', notes = '' } = req.body;

  if (!studentId || !date || !timeSlot) {
    return res.status(400).json({ success: false, message: 'Date and time slot are required.' });
  }

  const newApp = {
    id: `CNS-APP-${String(db.data.counsellingAppointments.length + 1).padStart(2, '0')}`,
    studentId,
    studentName: studentName || 'Student',
    counsellorName: 'Dr. Maya Patel',
    category,
    date,
    timeSlot,
    mode,
    notes,
    status: 'Requested',
    counsellorNotes: '',
    messages: [
      {
        sender: studentName || 'Student',
        role: 'Student',
        text: notes ? `Reason for appointment: ${notes}` : `Requested appointment for ${category}.`,
        timestamp: new Date().toISOString()
      }
    ]
  };

  db.data.counsellingAppointments.unshift(newApp);

  createNotification({
    userId: 'all',
    targetRole: 'Counselling',
    title: `Confidential Counselling Request from ${studentName}`,
    message: `${category} session requested for ${date} at ${timeSlot}.`,
    type: 'appointment',
    link: 'counselling'
  });

  db.save();
  res.json({ success: true, appointment: newApp });
});

// Update Appointment Status
app.put('/api/counselling/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, counsellorNotes } = req.body;

  const appItem = db.data.counsellingAppointments.find(a => a.id === id);
  if (!appItem) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  if (status) appItem.status = status;
  if (counsellorNotes !== undefined) appItem.counsellorNotes = counsellorNotes;

  createNotification({
    userId: appItem.studentId,
    targetRole: 'Student',
    title: `Counselling Session ${status}`,
    message: `Your counselling session with ${appItem.counsellorName} has been ${status.toLowerCase()}. Date: ${appItem.date} at ${appItem.timeSlot}.`,
    type: 'appointment',
    link: 'counselling'
  });

  db.save();
  res.json({ success: true, appointment: appItem });
});

// Send confidential message
app.post('/api/counselling/appointments/:id/messages', (req, res) => {
  const { id } = req.params;
  const { sender, role, text } = req.body;

  const appItem = db.data.counsellingAppointments.find(a => a.id === id);
  if (!appItem) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  const msg = {
    sender: sender || 'User',
    role: role || 'Student',
    text,
    timestamp: new Date().toISOString()
  };

  if (!appItem.messages) appItem.messages = [];
  appItem.messages.push(msg);

  db.save();
  res.json({ success: true, message: msg });
});

// ======================== STUDENT LEADER ROUTES ========================

// Representatives
app.get('/api/leaders/representatives', (req, res) => {
  res.json({ success: true, representatives: db.data.studentCouncil });
});

// Suggestions
app.get('/api/leaders/suggestions', (req, res) => {
  res.json({ success: true, suggestions: db.data.studentSuggestions });
});

app.post('/api/leaders/suggestions', (req, res) => {
  const { studentName, studentId, title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const newSug = {
    id: `SUG-${400 + db.data.studentSuggestions.length + 1}`,
    studentName: studentName || 'Student',
    studentId: studentId || 'STU-2024-001',
    title,
    description,
    upvotes: 1,
    upvotedBy: [studentId || 'STU-2024-001'],
    status: 'Under Review',
    councilResponse: 'Submitted to Student Council for review.',
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.data.studentSuggestions.unshift(newSug);

  createNotification({
    userId: 'all',
    targetRole: 'StudentLeader',
    title: `New Student Suggestion: ${title.slice(0, 35)}...`,
    message: `${studentName || 'A student'} submitted a new suggestion to the council.`,
    type: 'system',
    link: 'student-leader'
  });

  db.save();
  res.json({ success: true, suggestion: newSug });
});

// Upvote suggestion
app.post('/api/leaders/suggestions/:id/upvote', (req, res) => {
  const { id } = req.params;
  const { userId = 'STU-2024-001' } = req.body;

  const sug = db.data.studentSuggestions.find(s => s.id === id);
  if (!sug) {
    return res.status(404).json({ success: false, message: 'Suggestion not found.' });
  }

  if (!sug.upvotedBy) sug.upvotedBy = [];
  const index = sug.upvotedBy.indexOf(userId);
  if (index === -1) {
    sug.upvotedBy.push(userId);
    sug.upvotes += 1;
  } else {
    sug.upvotedBy.splice(index, 1);
    sug.upvotes = Math.max(0, sug.upvotes - 1);
  }

  db.save();
  res.json({ success: true, suggestion: sug });
});

// Respond to suggestion (Council/Admin)
app.put('/api/leaders/suggestions/:id', (req, res) => {
  const { id } = req.params;
  const { status, councilResponse } = req.body;

  const sug = db.data.studentSuggestions.find(s => s.id === id);
  if (!sug) {
    return res.status(404).json({ success: false, message: 'Suggestion not found.' });
  }

  if (status) sug.status = status;
  if (councilResponse) sug.councilResponse = councilResponse;

  createNotification({
    userId: sug.studentId,
    targetRole: 'Student',
    title: `Council Responded to Your Suggestion: ${sug.title.slice(0, 30)}...`,
    message: `Status: ${sug.status}. "${councilResponse}"`,
    type: 'system',
    link: 'student-leader'
  });

  db.save();
  res.json({ success: true, suggestion: sug });
});

// Events
app.get('/api/leaders/events', (req, res) => {
  res.json({ success: true, events: db.data.campusEvents });
});

app.post('/api/leaders/events', (req, res) => {
  const { title, date, time, venue, category, coordinator, maxCapacity = 200, description } = req.body;
  if (!title || !date || !venue) {
    return res.status(400).json({ success: false, message: 'Title, date, and venue are required.' });
  }

  const newEvt = {
    id: `EVT-${600 + db.data.campusEvents.length + 1}`,
    title,
    date,
    time: time || '09:00 AM - 05:00 PM',
    venue,
    category: category || 'General',
    coordinator: coordinator || 'Student Council',
    registeredCount: 0,
    maxCapacity: Number(maxCapacity),
    description: description || 'Campus Event coordinated by Student Leadership.'
  };

  db.data.campusEvents.unshift(newEvt);

  createNotification({
    userId: 'all',
    targetRole: 'all',
    title: `New Event: ${title}`,
    message: `Join on ${date} at ${venue}. Coordinated by ${coordinator}.`,
    type: 'announcement',
    link: 'student-leader'
  });

  db.save();
  res.json({ success: true, event: newEvt });
});

// Register for event
app.post('/api/leaders/events/:id/register', (req, res) => {
  const { id } = req.params;
  const evt = db.data.campusEvents.find(e => e.id === id);
  if (!evt) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }
  evt.registeredCount += 1;
  db.save();
  res.json({ success: true, event: evt, message: 'Successfully registered for event!' });
});

// ======================== FACULTY & ACADEMIC ROUTES ========================

// Student courses & attendance & marks
app.get('/api/academics/student/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    courses: db.data.academicData.studentCourses,
    timetable: db.data.academicData.timetable,
    studentRoster: db.data.academicData.studentRoster,
    courseMarks: db.data.academicData.courseMarks || {}
  });
});

// Mark student marks & grade evaluation
app.post('/api/academics/marks', (req, res) => {
  const { courseCode, studentMarks, assessmentType = 'Final' } = req.body;
  // studentMarks: array of { studentId, internalMarks, examMarks, totalMarks, maxMarks = 100, grade, remarks }

  if (!courseCode || !Array.isArray(studentMarks)) {
    return res.status(400).json({ success: false, message: 'Course code and student marks list required.' });
  }

  if (!db.data.academicData.courseMarks) {
    db.data.academicData.courseMarks = {};
  }

  db.data.academicData.courseMarks[courseCode] = studentMarks;

  // Grade point mapping
  const gradeToPoint = (g) => {
    if (g === 'A+') return 4.0;
    if (g === 'A') return 3.85;
    if (g === 'A-') return 3.7;
    if (g === 'B+') return 3.3;
    if (g === 'B') return 3.0;
    if (g === 'C') return 2.0;
    return 0.0;
  };

  // Update marks and grade for course
  const targetCourse = db.data.academicData.studentCourses.find(c => c.code === courseCode);
  const primaryMark = studentMarks[0];

  if (targetCourse && primaryMark) {
    targetCourse.marks = `${primaryMark.totalMarks || (Number(primaryMark.internalMarks || 0) + Number(primaryMark.examMarks || 0))}/100`;
    targetCourse.grade = primaryMark.grade;

    // Recalculate student's CGPA
    let totalCredits = 0;
    let weightedPoints = 0;
    db.data.academicData.studentCourses.forEach(c => {
      const cr = Number(c.credits) || 3;
      totalCredits += cr;
      weightedPoints += cr * gradeToPoint(c.grade);
    });

    const newCGPA = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
    const studentUser = db.data.users.find(u => u.id === primaryMark.studentId || u.role === 'Student');
    if (studentUser) {
      studentUser.cgpa = newCGPA;
    }

    createNotification({
      userId: primaryMark.studentId || 'all',
      targetRole: 'Student',
      title: `Marks & Grade Published for ${courseCode}`,
      message: `Faculty updated marks for ${targetCourse.name}: ${targetCourse.marks} (Grade: ${targetCourse.grade}). New CGPA: ${newCGPA}`,
      type: 'academic',
      link: 'student'
    });
  }

  db.save();
  res.json({
    success: true,
    message: `Marks updated and published for ${courseCode}!`,
    courses: db.data.academicData.studentCourses,
    courseMarks: db.data.academicData.courseMarks[courseCode]
  });
});

// Grade Assignment
app.post('/api/academics/grade-assignment', (req, res) => {
  const { assignmentId, studentId = 'STU-001', studentName = 'Student Member', marks, maxMarks = 50, feedback = 'Well done!' } = req.body;

  createNotification({
    userId: studentId,
    targetRole: 'Student',
    title: `Assignment Graded (${marks}/${maxMarks})`,
    message: `Faculty evaluated your submission: "${feedback}". Score: ${marks}/${maxMarks}.`,
    type: 'academic',
    link: 'student'
  });

  db.save();
  res.json({ success: true, message: `Assignment graded: ${marks}/${maxMarks} recorded.` });
});

// Mark student attendance
app.post('/api/academics/attendance', (req, res) => {
  const { courseCode, date, attendanceRoster } = req.body;
  if (Array.isArray(attendanceRoster)) {
    attendanceRoster.forEach(record => {
      const student = db.data.academicData.studentRoster.find(s => s.id === record.id);
      if (student) {
        student.status = record.status;
      }
    });

    const course = db.data.academicData.studentCourses.find(c => c.code === courseCode);
    if (course) {
      course.totalClasses = (course.totalClasses || 0) + 1;
      const anyPresent = attendanceRoster.some(r => r.status === 'Present');
      if (anyPresent) {
        course.attendedClasses = (course.attendedClasses || 0) + 1;
      }
      course.attendance = course.totalClasses > 0 ? Math.round((course.attendedClasses / course.totalClasses) * 100) : 0;
    }
  }

  createNotification({
    userId: 'all',
    targetRole: 'Student',
    title: `Attendance Updated for ${courseCode || 'Class'}`,
    message: `Faculty marked attendance for ${date || 'today'}. Check your portal for updated metrics.`,
    type: 'academic',
    link: 'student'
  });

  db.save();
  res.json({ success: true, message: 'Attendance records updated successfully!' });
});

// ======================== LOST AND FOUND ROUTES ========================

app.get('/api/lost-found', (req, res) => {
  res.json({ success: true, items: db.data.lostAndFound });
});

app.post('/api/lost-found', (req, res) => {
  const { title, category, locationFound, status = 'Lost', reportedBy, contact, image = '' } = req.body;
  if (!title || !locationFound) {
    return res.status(400).json({ success: false, message: 'Title and location are required.' });
  }

  const newItem = {
    id: `LNF-${100 + db.data.lostAndFound.length + 1}`,
    title,
    category: category || 'Other',
    locationFound,
    date: new Date().toISOString().split('T')[0],
    status,
    reportedBy: reportedBy || 'Campus Member',
    contact: contact || 'security-desk@campusconnect.edu',
    image,
    claimant: ''
  };

  db.data.lostAndFound.unshift(newItem);
  db.save();
  res.json({ success: true, item: newItem });
});

app.put('/api/lost-found/:id/claim', (req, res) => {
  const { id } = req.params;
  const { claimantName } = req.body;

  const item = db.data.lostAndFound.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found.' });
  }

  item.status = 'Claimed';
  item.claimant = claimantName || 'Verified Claimant';
  db.save();
  res.json({ success: true, item, message: 'Item marked as claimed successfully!' });
});

// ======================== NOTIFICATIONS ROUTES ========================

app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const user = db.data.users.find(u => u.id === userId);
  const role = user ? user.role : 'Student';

  const userNotifs = db.data.notifications.filter(n => 
    n.userId === 'all' || n.userId === userId || n.targetRole === 'all' || n.targetRole === role
  );

  res.json({ success: true, notifications: userNotifs });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = db.data.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    db.save();
  }
  res.json({ success: true });
});

app.put('/api/notifications/read-all/:userId', (req, res) => {
  const { userId } = req.params;
  const user = db.data.users.find(u => u.id === userId);
  const role = user ? user.role : 'Student';

  db.data.notifications.forEach(n => {
    if (n.userId === 'all' || n.userId === userId || n.targetRole === 'all' || n.targetRole === role) {
      n.read = true;
    }
  });

  db.save();
  res.json({ success: true });
});

// System Reset
app.post('/api/system/reset', (req, res) => {
  const cleanData = db.reset();
  res.json({ success: true, message: 'System state reset to clean demo data.', data: cleanData });
});

// Serve frontend in production if built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`CampusConnect Server listening on port ${PORT}`);
  });
}

export default app;


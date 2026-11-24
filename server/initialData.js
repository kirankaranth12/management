// Fresh Baseline Initial Data for CampusConnect (Clean Slate / Zero State)

export const initialData = {
  // Generic role baseline template accounts so authentication and role exploration work seamlessly
  users: [
    {
      id: "FAC-001",
      name: "Faculty Member",
      email: "faculty@campusconnect.edu",
      password: "password123",
      role: "Faculty",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      employeeCode: "EMP-FAC-0001",
      phone: "+1 (555) 000-0002",
      avatar: "",
      bio: "Academic instructor and course coordinator.",
      joinedDate: "Fall 2026"
    },
    {
      id: "ADM-001",
      name: "Administrator",
      email: "admin@campusconnect.edu",
      password: "password123",
      role: "Admin",
      department: "Campus Administration & Operations",
      designation: "Campus Administrator",
      employeeCode: "EMP-ADM-0001",
      phone: "+1 (555) 000-0003",
      avatar: "",
      bio: "Overseeing campus facilities and administrative coordination.",
      joinedDate: "Fall 2026"
    },
    {
      id: "CLN-001",
      name: "Sanitation Staff",
      email: "cleaning@campusconnect.edu",
      password: "password123",
      role: "Cleaning",
      department: "Sanitation & Facilities",
      designation: "Sanitation Lead",
      employeeCode: "EMP-CLN-0001",
      phone: "+1 (555) 000-0004",
      avatar: "",
      bio: "Managing campus hygiene and sanitation requests.",
      joinedDate: "Fall 2026"
    },
    {
      id: "HR-001",
      name: "HR Officer",
      email: "hr@campusconnect.edu",
      password: "password123",
      role: "HR",
      department: "Human Resources",
      designation: "HR Manager",
      employeeCode: "EMP-HR-0001",
      phone: "+1 (555) 000-0005",
      avatar: "",
      bio: "Employee records and staff leave administration.",
      joinedDate: "Fall 2026"
    },
    {
      id: "CNS-001",
      name: "Campus Counsellor",
      email: "counsellor@campusconnect.edu",
      password: "password123",
      role: "Counselling",
      department: "Student Wellness & Guidance",
      designation: "Student Counsellor",
      employeeCode: "EMP-CNS-0001",
      phone: "+1 (555) 000-0006",
      avatar: "",
      bio: "Confidential emotional and academic counselling.",
      joinedDate: "Fall 2026"
    },
    {
      id: "SL-001",
      name: "Student Representative",
      email: "leader@campusconnect.edu",
      password: "password123",
      role: "StudentLeader",
      department: "Student Council",
      designation: "Council President",
      employeeCode: "STU-LDR-0001",
      phone: "+1 (555) 000-0007",
      avatar: "",
      bio: "Representing student interests and coordinating activities.",
      joinedDate: "Fall 2026"
    }
  ],

  // All transactional data starts clean at 0
  complaints: [],
  cleaningTasks: [],
  announcements: [],
  notifications: [],
  hrEmployees: [],
  hrStaff: [],
  leaveRequests: [],
  counsellingAppointments: [],
  counsellingMessages: {},
  studentCouncil: [],
  suggestions: [],
  campusEvents: [],
  lostAndFound: [],

  // Institutional Departments
  departments: [
    { id: "dept-cse", name: "Computer Science & Engineering", code: "CSE", hod: "Department Head", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-ece", name: "Electronics & Communication", code: "ECE", hod: "Department Head", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-me", name: "Mechanical Engineering", code: "ME", hod: "Department Head", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-ce", name: "Civil Engineering", code: "CE", hod: "Department Head", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-san", name: "Sanitation & Facilities", code: "SAN", hod: "Facilities Supervisor", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-hr", name: "Human Resources", code: "HR", hod: "HR Director", facultyCount: 0, budget: "$0", activeProjects: 0 },
    { id: "dept-cns", name: "Student Wellness & Guidance", code: "CNS", hod: "Lead Counsellor", facultyCount: 0, budget: "$0", activeProjects: 0 }
  ],

  // Executive Management Dashboard Metrics (0 Baseline)
  managementStats: {
    totalStudents: 0,
    totalFaculty: 0,
    totalStaff: 0,
    totalDepartments: 7,
    openComplaints: 0,
    resolvedComplaints: 0,
    pendingLeaves: 0,
    campusHygieneScore: 0,
    budgetUtilized: "0%"
  },

  // Academic Curriculum (0 Baseline - No pre-awarded marks or attendance)
  academicData: {
    studentCourses: [
      { code: "CS-301", name: "Advanced Data Structures & Algorithms", credits: 4, faculty: "Faculty Instructor", attendance: 0, attendedClasses: 0, totalClasses: 0, marks: "0/100", grade: "-" },
      { code: "CS-304", name: "Distributed Database Systems", credits: 4, faculty: "Faculty Instructor", attendance: 0, attendedClasses: 0, totalClasses: 0, marks: "0/100", grade: "-" },
      { code: "CS-308", name: "Cloud Architecture & DevOps", credits: 3, faculty: "Faculty Instructor", attendance: 0, attendedClasses: 0, totalClasses: 0, marks: "0/100", grade: "-" },
      { code: "HU-301", name: "Professional Ethics & Human Values", credits: 2, faculty: "Faculty Instructor", attendance: 0, attendedClasses: 0, totalClasses: 0, marks: "0/100", grade: "-" }
    ],
    timetable: [
      { id: "TT-001", day: "Monday", time: "09:00 AM - 10:30 AM", course: "CS-301: Advanced Data Structures", room: "Hall 101", faculty: "Faculty Instructor" },
      { id: "TT-002", day: "Tuesday", time: "11:00 AM - 12:30 PM", course: "CS-304: Distributed Databases", room: "Lab 2", faculty: "Faculty Instructor" },
      { id: "TT-003", day: "Thursday", time: "02:00 PM - 03:30 PM", course: "CS-308: Cloud Architecture", room: "Hall 304", faculty: "Faculty Instructor" },
      { id: "TT-004", day: "Friday", time: "10:00 AM - 11:30 AM", course: "HU-301: Professional Ethics", room: "Hall 202", faculty: "Faculty Instructor" }
    ],
    studentRoster: [],
    courseMarks: {}
  }
};

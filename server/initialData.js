// Comprehensive initial data for CampusConnect Smart College Management System

export const initialData = {
  users: [
    {
      id: "STU-2024-001",
      name: "Alex Rivera",
      email: "alex.rivera@campusconnect.edu",
      password: "password123",
      role: "Student",
      department: "Computer Science & Engineering",
      semester: "6th Semester",
      rollNo: "CS21B042",
      phone: "+1 (555) 234-8901",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      cgpa: "3.85",
      attendance: 91.5,
      bio: "Undergraduate CSE student interested in Distributed Systems and Full-stack development. Active in ACM Chapter.",
      joinedDate: "August 2021"
    },
    {
      id: "FAC-CS-101",
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@campusconnect.edu",
      password: "password123",
      role: "Faculty",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & HOD",
      employeeCode: "EMP-FAC-0101",
      phone: "+1 (555) 789-1234",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Ph.D. in Computer Science (MIT). Teaching Database Systems, Cloud Computing, and Software Architecture for 12+ years.",
      joinedDate: "July 2015"
    },
    {
      id: "ADM-001",
      name: "Dean Robert Vance",
      email: "robert.vance@campusconnect.edu",
      password: "password123",
      role: "Admin",
      department: "Campus Administration & Operations",
      designation: "Dean of Institutional Management",
      employeeCode: "EMP-ADM-0001",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      bio: "Overseeing campus facilities, departmental coordination, institutional growth and student welfare.",
      joinedDate: "January 2012"
    },
    {
      id: "CLN-001",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@campusconnect.edu",
      password: "password123",
      role: "Cleaning",
      department: "Sanitation & Facilities",
      designation: "Campus Sanitation Supervisor",
      employeeCode: "EMP-CLN-0402",
      phone: "+1 (555) 321-9876",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      bio: "Managing sanitation crew, campus cleanliness quality control, hygiene audits, and waste disposal.",
      joinedDate: "March 2018"
    },
    {
      id: "HR-001",
      name: "Priya Sharma",
      email: "priya.sharma@campusconnect.edu",
      password: "password123",
      role: "HR",
      department: "Human Resources",
      designation: "Senior HR Director",
      employeeCode: "EMP-HR-0021",
      phone: "+1 (555) 654-3210",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      bio: "Lead for faculty hiring, performance appraisals, leave management, payroll coordination, and staff development.",
      joinedDate: "June 2017"
    },
    {
      id: "CNS-001",
      name: "Dr. Maya Patel",
      email: "maya.patel@campusconnect.edu",
      password: "password123",
      role: "Counselling",
      department: "Student Counselling & Wellbeing",
      designation: "Chief Clinical Counsellor",
      employeeCode: "EMP-CNS-0112",
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      bio: "Licensed Clinical Psychologist specializing in adolescent stress management, academic guidance, and mental wellness.",
      joinedDate: "September 2019"
    },
    {
      id: "SL-001",
      name: "Rohan Mehta",
      email: "rohan.mehta@campusconnect.edu",
      password: "password123",
      role: "StudentLeader",
      department: "Mechanical Engineering",
      designation: "Student Council President",
      rollNo: "ME21B015",
      phone: "+1 (555) 432-1098",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      bio: "Elected President of the CampusConnect Student Council. Bridging student ideas with college leadership.",
      joinedDate: "August 2021"
    }
  ],

  departments: [
    {
      id: "DEP-CSE",
      name: "Computer Science & Engineering",
      head: "Dr. Sarah Jenkins",
      facultyCount: 28,
      studentCount: 720,
      activeComplaints: 2,
      budget: "$420,000",
      satisfactionRate: 94
    },
    {
      id: "DEP-ECE",
      name: "Electronics & Communication",
      head: "Dr. Arvind Rao",
      facultyCount: 22,
      studentCount: 540,
      activeComplaints: 1,
      budget: "$350,000",
      satisfactionRate: 91
    },
    {
      id: "DEP-MECH",
      name: "Mechanical Engineering",
      head: "Prof. David Miller",
      facultyCount: 19,
      studentCount: 480,
      activeComplaints: 3,
      budget: "$380,000",
      satisfactionRate: 88
    },
    {
      id: "DEP-CIVIL",
      name: "Civil Engineering",
      head: "Dr. Elena Rostova",
      facultyCount: 16,
      studentCount: 360,
      activeComplaints: 1,
      budget: "$310,000",
      satisfactionRate: 89
    },
    {
      id: "DEP-SAN",
      name: "Sanitation & Facilities",
      head: "Rajesh Kumar",
      facultyCount: 35,
      studentCount: 0,
      activeComplaints: 4,
      budget: "$180,000",
      satisfactionRate: 96
    },
    {
      id: "DEP-HR",
      name: "Human Resources",
      head: "Priya Sharma",
      facultyCount: 8,
      studentCount: 0,
      activeComplaints: 0,
      budget: "$120,000",
      satisfactionRate: 97
    },
    {
      id: "DEP-CNS",
      name: "Student Counselling & Wellbeing",
      head: "Dr. Maya Patel",
      facultyCount: 5,
      studentCount: 0,
      activeComplaints: 0,
      budget: "$95,000",
      satisfactionRate: 99
    }
  ],

  complaints: [
    {
      id: "CMP-1001",
      title: "Broken AC and Unsanitary Washroom in Block C 2nd Floor",
      category: "Cleaning & Sanitation",
      department: "Cleaning Department",
      studentId: "STU-2024-001",
      studentName: "Alex Rivera",
      studentEmail: "alex.rivera@campusconnect.edu",
      location: "Science Block C, 2nd Floor East Washroom",
      priority: "High",
      status: "In Progress",
      description: "Water leakage near washbasin 2 causing foul odor and wet floor hazard. Needs urgent disinfection and fixture check.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
      createdAt: "2026-11-20T09:30:00Z",
      updatedAt: "2026-11-21T11:15:00Z",
      assignedTo: "Rajesh Kumar (Sanitation Lead)",
      resolutionNotes: "Sanitation crew deployed. Deep sanitization completed; plumber scheduled for valve replacement by 4 PM.",
      history: [
        { date: "2026-11-20T09:30:00Z", status: "Pending", note: "Complaint filed by Alex Rivera", by: "Student" },
        { date: "2026-11-20T14:00:00Z", status: "In Progress", note: "Assigned to Sanitation Lead Rajesh Kumar. Crew dispatched for initial inspection.", by: "Cleaning Department" }
      ]
    },
    {
      id: "CMP-1002",
      title: "Projector Flicker in Lecture Hall 304",
      category: "Academic & Faculty",
      department: "Faculty / Academics",
      studentId: "STU-2024-001",
      studentName: "Alex Rivera",
      studentEmail: "alex.rivera@campusconnect.edu",
      location: "Academic Complex, Lecture Hall 304",
      priority: "Medium",
      status: "Resolved",
      description: "HDMI port on the podium projector cuts out intermittently during Database Systems lectures, disrupting slides.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80",
      createdAt: "2026-11-18T14:20:00Z",
      updatedAt: "2026-11-19T16:45:00Z",
      assignedTo: "IT Support & Dr. Sarah Jenkins",
      resolutionNotes: "HDMI adapter and high-speed cable replaced by Campus IT. Tested with multiple laptops; projector displaying in 4K smoothly.",
      history: [
        { date: "2026-11-18T14:20:00Z", status: "Pending", note: "Complaint registered", by: "Student" },
        { date: "2026-11-18T16:00:00Z", status: "In Progress", note: "Notified IT technician", by: "Faculty Department" },
        { date: "2026-11-19T16:45:00Z", status: "Resolved", note: "Hardware cabling renewed and tested with Prof Jenkins.", by: "Management Department" }
      ]
    },
    {
      id: "CMP-1003",
      title: "Cafeteria Water Dispenser Filter Due for Replacement",
      category: "Campus Infrastructure",
      department: "Management Department",
      studentId: "STU-2024-001",
      studentName: "Alex Rivera",
      studentEmail: "alex.rivera@campusconnect.edu",
      location: "Central Student Food Court, Ground Floor",
      priority: "Medium",
      status: "Pending",
      description: "The UV filter indicator light has turned orange on the main RO water dispenser near the south exit.",
      image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&auto=format&fit=crop&q=80",
      createdAt: "2026-11-21T18:10:00Z",
      updatedAt: "2026-11-21T18:10:00Z",
      assignedTo: "Unassigned",
      resolutionNotes: "Pending facility team review.",
      history: [
        { date: "2026-11-21T18:10:00Z", status: "Pending", note: "Complaint registered by Alex Rivera", by: "Student" }
      ]
    },
    {
      id: "CMP-1004",
      title: "Confidential Guidance Request - Course Load Balancing",
      category: "Student Counselling",
      department: "Student Counselling",
      studentId: "STU-2024-001",
      studentName: "Alex Rivera",
      studentEmail: "alex.rivera@campusconnect.edu",
      location: "Wellbeing Center",
      priority: "Low",
      status: "Resolved",
      description: "Seeking advice on managing capstone project workload alongside placement interview prep.",
      image: "",
      createdAt: "2026-11-15T10:00:00Z",
      updatedAt: "2026-11-16T15:30:00Z",
      assignedTo: "Dr. Maya Patel",
      resolutionNotes: "Session conducted on Nov 16. Structured weekly milestone calendar formulated with student.",
      history: [
        { date: "2026-11-15T10:00:00Z", status: "Pending", note: "Appointment requested", by: "Student" },
        { date: "2026-11-16T15:30:00Z", status: "Resolved", note: "1-on-1 session completed.", by: "Student Counselling" }
      ]
    }
  ],

  cleaningTasks: [
    {
      id: "CLN-T201",
      area: "Washroom - Science Block C (2nd Floor)",
      areaType: "Washroom",
      issueType: "Spill / Sanitation",
      reportedBy: "Alex Rivera (Student CMP-1001)",
      assignedStaff: "Ramesh Sharma (Sanitation Staff)",
      status: "In Progress",
      priority: "High",
      photo: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
      completionPhoto: "",
      completionNotes: "Deep scrub completed. Waiting for plumbing seal to cure.",
      complaintId: "CMP-1001",
      createdAt: "2026-11-20T09:40:00Z",
      completedAt: ""
    },
    {
      id: "CLN-T202",
      area: "Lecture Hall 201 & Corridor",
      areaType: "Classroom",
      issueType: "Regular Routine",
      reportedBy: "Faculty Dr. Sarah Jenkins",
      assignedStaff: "Sunita Devi",
      status: "Completed",
      priority: "Normal",
      photo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80",
      completionPhoto: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format&fit=crop&q=80",
      completionNotes: "Floor polished, desks sanitized, chalkboard cleaned and dustbins emptied.",
      complaintId: "",
      createdAt: "2026-11-21T07:00:00Z",
      completedAt: "2026-11-21T08:30:00Z"
    },
    {
      id: "CLN-T203",
      area: "Main Library 1st Floor Study Pods",
      areaType: "Corridor",
      issueType: "Trash Overflow",
      reportedBy: "Student Council Rep",
      assignedStaff: "Ramesh Sharma",
      status: "Pending",
      priority: "High",
      photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=80",
      completionPhoto: "",
      completionNotes: "",
      complaintId: "",
      createdAt: "2026-11-22T08:15:00Z",
      completedAt: ""
    },
    {
      id: "CLN-T204",
      area: "Cafeteria Outdoor Dining Patio",
      areaType: "Outdoor",
      issueType: "Deep Clean",
      reportedBy: "Rajesh Kumar (Supervisor)",
      assignedStaff: "Anil Verma",
      status: "Assigned",
      priority: "Normal",
      photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
      completionPhoto: "",
      completionNotes: "",
      complaintId: "",
      createdAt: "2026-11-22T09:00:00Z",
      completedAt: ""
    }
  ],

  announcements: [
    {
      id: "ANN-301",
      title: "Mid-Term Examination Schedule Released (Fall 2026)",
      content: "The official datesheet for the 2026 Mid-Semester Examinations is now accessible. Students are advised to verify their room allotments and check for any subject clashes with the Examination Cell by Friday.",
      category: "Academic",
      postedBy: "Dr. Sarah Jenkins",
      authorRole: "HOD Computer Science",
      targetAudience: "All",
      pinned: true,
      priority: "High",
      createdAt: "2026-11-21T10:00:00Z"
    },
    {
      id: "ANN-302",
      title: "Campus Cleanliness & Green Drive: 'Swachh Campus' Week",
      content: "Join the Student Council and Sanitation Department for our campus-wide cleanliness and tree-planting drive this Saturday, 9:00 AM at the Central Plaza. Refreshments and community service certificates provided.",
      category: "Event",
      postedBy: "Rohan Mehta",
      authorRole: "Student Council President",
      targetAudience: "All",
      pinned: false,
      priority: "Normal",
      createdAt: "2026-11-20T14:30:00Z"
    },
    {
      id: "ANN-303",
      title: "Special Workshop: Stress Resilience & Mindful Productivity",
      content: "The Student Counselling Center is organizing an interactive mental wellbeing workshop on November 25th in Seminar Hall 2. Topics include managing exam anxiety, mindfulness techniques, and healthy sleep habits.",
      category: "Administrative",
      postedBy: "Dr. Maya Patel",
      authorRole: "Chief Counsellor",
      targetAudience: "Students",
      pinned: false,
      priority: "Normal",
      createdAt: "2026-11-19T11:00:00Z"
    },
    {
      id: "ANN-304",
      title: "Campus Wi-Fi Maintenance Window Notice",
      content: "Scheduled core switch firmware upgrade on Sunday midnight between 1:00 AM and 4:00 AM. Internet access across dorms and library might experience brief interruptions.",
      category: "Emergency",
      postedBy: "Dean Robert Vance",
      authorRole: "Management Office",
      targetAudience: "All",
      pinned: false,
      priority: "High",
      createdAt: "2026-11-18T16:00:00Z"
    }
  ],

  counsellingAppointments: [
    {
      id: "CNS-APP-01",
      studentId: "STU-2024-001",
      studentName: "Alex Rivera",
      counsellorName: "Dr. Maya Patel",
      category: "Academic Stress",
      date: "2026-11-25",
      timeSlot: "11:00 AM - 11:45 AM",
      mode: "In-Person (Room 108, Wellbeing Wing)",
      notes: "Discussion on capstone workload and graduate school applications.",
      status: "Confirmed",
      counsellorNotes: "Student confirmed. Initial roadmap discussed in previous session.",
      messages: [
        { sender: "Alex Rivera", role: "Student", text: "Hello Dr. Patel, looking forward to our session this Wednesday.", timestamp: "2026-11-21T14:10:00Z" },
        { sender: "Dr. Maya Patel", role: "Counsellor", text: "Welcome Alex! Please bring your current study schedule draft.", timestamp: "2026-11-21T15:20:00Z" }
      ]
    },
    {
      id: "CNS-APP-02",
      studentId: "STU-2024-002",
      studentName: "Emily Chen",
      counsellorName: "Dr. Maya Patel",
      category: "Career Guidance",
      date: "2026-11-26",
      timeSlot: "02:00 PM - 02:45 PM",
      mode: "Confidential Online (CampusConnect Meet)",
      notes: "Exploring transition from Hardware Engineering to Robotics software.",
      status: "Requested",
      counsellorNotes: "",
      messages: []
    }
  ],

  hrEmployees: [
    {
      id: "EMP-FAC-0101",
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@campusconnect.edu",
      department: "Computer Science & Engineering",
      designation: "Associate Professor & HOD",
      joinDate: "2015-07-15",
      salaryBand: "Tier 1 - Senior Academic",
      status: "Present",
      leaveBalance: { casual: 8, sick: 10, earned: 15 },
      phone: "+1 (555) 789-1234",
      qualifications: "Ph.D. in Computer Science (MIT), M.Tech (Stanford)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "EMP-FAC-0102",
      name: "Prof. Michael Chang",
      email: "michael.chang@campusconnect.edu",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      joinDate: "2019-01-10",
      salaryBand: "Tier 2 - Mid Academic",
      status: "Present",
      leaveBalance: { casual: 6, sick: 8, earned: 12 },
      phone: "+1 (555) 345-6789",
      qualifications: "M.S. in Software Systems, B.E. CSE",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "EMP-FAC-0201",
      name: "Dr. Arvind Rao",
      email: "arvind.rao@campusconnect.edu",
      department: "Electronics & Communication",
      designation: "Professor & HOD",
      joinDate: "2014-08-01",
      salaryBand: "Tier 1 - Senior Academic",
      status: "On Leave",
      leaveBalance: { casual: 4, sick: 12, earned: 18 },
      phone: "+1 (555) 901-2345",
      qualifications: "Ph.D. in Signal Processing (Georgia Tech)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "EMP-CLN-0402",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@campusconnect.edu",
      department: "Sanitation & Facilities",
      designation: "Sanitation Supervisor",
      joinDate: "2018-03-20",
      salaryBand: "Operations Grade A",
      status: "Present",
      leaveBalance: { casual: 7, sick: 9, earned: 14 },
      phone: "+1 (555) 321-9876",
      qualifications: "Certified Facilities & Health Safety Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "EMP-CNS-0112",
      name: "Dr. Maya Patel",
      email: "maya.patel@campusconnect.edu",
      department: "Student Counselling & Wellbeing",
      designation: "Chief Clinical Counsellor",
      joinDate: "2019-09-01",
      salaryBand: "Tier 2 - Specialist",
      status: "Present",
      leaveBalance: { casual: 9, sick: 11, earned: 16 },
      phone: "+1 (555) 987-6543",
      qualifications: "Psy.D. in Clinical Psychology",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    }
  ],

  leaveRequests: [
    {
      id: "LEV-501",
      employeeId: "EMP-FAC-0201",
      employeeName: "Dr. Arvind Rao",
      department: "Electronics & Communication",
      leaveType: "Duty Leave (Conference)",
      startDate: "2026-11-22",
      endDate: "2026-11-24",
      days: 3,
      reason: "Presenting keynote paper at IEEE Global Communications Summit 2026.",
      status: "Approved",
      appliedOn: "2026-11-15",
      reviewedBy: "Priya Sharma (HR)",
      reviewerComments: "Approved with full conference sponsorship grant."
    },
    {
      id: "LEV-502",
      employeeId: "EMP-FAC-0102",
      employeeName: "Prof. Michael Chang",
      department: "Computer Science & Engineering",
      leaveType: "Casual Leave",
      startDate: "2026-11-28",
      endDate: "2026-11-29",
      days: 2,
      reason: "Family wedding event in Seattle.",
      status: "Pending",
      appliedOn: "2026-11-21",
      reviewedBy: "Priya Sharma (HR)",
      reviewerComments: ""
    }
  ],

  studentCouncil: [
    {
      id: "REP-01",
      name: "Rohan Mehta",
      role: "President, Student Council",
      department: "Mechanical Engineering (Final Year)",
      email: "rohan.mehta@campusconnect.edu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      focusArea: "Administration Liaison, Student Rights, Infrastructure upgrades",
      term: "2026-2027"
    },
    {
      id: "REP-02",
      name: "Aanya Gupta",
      role: "Vice President",
      department: "Computer Science (3rd Year)",
      email: "aanya.gupta@campusconnect.edu",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      focusArea: "Academics & Research Support, Tech Symposium Coordinator",
      term: "2026-2027"
    },
    {
      id: "REP-03",
      name: "Marcus Vance",
      role: "Sports & Health Secretary",
      department: "Civil Engineering (3rd Year)",
      email: "marcus.vance@campusconnect.edu",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      focusArea: "Inter-collegiate Sports, Gymnasium modernizations",
      term: "2026-2027"
    },
    {
      id: "REP-04",
      name: "Sneha Reddy",
      role: "Cultural & Arts Secretary",
      department: "Electronics (2nd Year)",
      email: "sneha.reddy@campusconnect.edu",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      focusArea: "Annual Fest 'AURA 2024', Clubs & Societies outreach",
      term: "2026-2027"
    }
  ],

  studentSuggestions: [
    {
      id: "SUG-401",
      studentName: "Alex Rivera",
      studentId: "STU-2024-001",
      title: "Extend Main Library Opening Hours to 24/7 during Final Exams",
      description: "During exam periods, the dorm rooms get noisy. Having quiet floor study pods accessible all night with security would help tremendously.",
      upvotes: 84,
      upvotedBy: ["STU-2024-001", "STU-2024-002", "STU-2024-003"],
      status: "Approved",
      councilResponse: "Council presented petition to Dean Robert Vance. Library 2nd floor silent zone will stay open 24 hours starting Dec 1st.",
      createdAt: "2026-11-14"
    },
    {
      id: "SUG-402",
      studentName: "Kavita Rao",
      studentId: "STU-2024-008",
      title: "Install EV Charging Stations in Student Parking Lot 2",
      description: "Over 60 students and staff now commute on electric two-wheelers and EVs. Solar-powered charging kiosks would promote green transport.",
      upvotes: 62,
      upvotedBy: ["STU-2024-001"],
      status: "In Discussion",
      councilResponse: "Discussed with Management Department. Quotations being acquired from campus solar partners.",
      createdAt: "2026-11-19"
    },
    {
      id: "SUG-403",
      studentName: "Liam Johnson",
      studentId: "STU-2024-012",
      title: "Add Healthy Plant-Based & Gluten-Free Options at Cafeteria",
      description: "Expand salad bar options and ensure gluten-free bread/pasta choices for students with dietary restrictions.",
      upvotes: 49,
      upvotedBy: [],
      status: "Under Review",
      councilResponse: "Scheduled meeting with Catering Services on Thursday.",
      createdAt: "2026-11-20"
    }
  ],

  campusEvents: [
    {
      id: "EVT-601",
      title: "TechPulse 2026: Annual Inter-College Hackathon",
      date: "2026-12-05",
      time: "09:00 AM - 09:00 PM",
      venue: "Innovation Hub & CSE Labs",
      category: "Hackathon / Tech",
      coordinator: "Aanya Gupta (VP Council)",
      registeredCount: 142,
      maxCapacity: 200,
      description: "36-hour hackathon tackling smart cities, AI for healthcare, and sustainable engineering. $10,000 in prizes and direct recruiter interviews."
    },
    {
      id: "EVT-602",
      title: "AURA 2026: Annual Cultural & Arts Festival",
      date: "2026-12-18",
      time: "04:00 PM - 11:00 PM",
      venue: "Open Air Amphitheatre",
      category: "Cultural",
      coordinator: "Sneha Reddy (Cultural Sec)",
      registeredCount: 480,
      maxCapacity: 1200,
      description: "The biggest collegiate cultural night featuring celebrity band performances, dance face-offs, fashion showcase and food stalls."
    },
    {
      id: "EVT-603",
      title: "Campus Blood Donation & Health Screening Camp",
      date: "2026-11-29",
      time: "10:00 AM - 04:00 PM",
      venue: "Student Activity Center (SAC)",
      category: "Social Cause",
      coordinator: "Marcus Vance (Sports Sec)",
      registeredCount: 88,
      maxCapacity: 150,
      description: "Partnering with the Red Cross Society. Free health check-up, blood typing, and donor certificates."
    }
  ],

  academicData: {
    studentCourses: [
      {
        code: "CS-301",
        name: "Advanced Data Structures & Algorithms",
        faculty: "Dr. Sarah Jenkins",
        credits: 4,
        attendance: 94,
        totalClasses: 36,
        attendedClasses: 34,
        grade: "A",
        marks: "91/100"
      },
      {
        code: "CS-304",
        name: "Distributed Database Systems",
        faculty: "Prof. Michael Chang",
        credits: 4,
        attendance: 88,
        totalClasses: 34,
        attendedClasses: 30,
        grade: "A-",
        marks: "86/100"
      },
      {
        code: "CS-308",
        name: "Cloud Architecture & DevOps",
        faculty: "Dr. Sarah Jenkins",
        credits: 3,
        attendance: 92,
        totalClasses: 28,
        attendedClasses: 26,
        grade: "A+",
        marks: "96/100"
      },
      {
        code: "HU-301",
        name: "Professional Ethics & Leadership",
        faculty: "Prof. Linda Watson",
        credits: 2,
        attendance: 90,
        totalClasses: 20,
        attendedClasses: 18,
        grade: "A",
        marks: "89/100"
      }
    ],
    timetable: [
      { day: "Monday", time: "09:00 AM - 10:30 AM", course: "CS-301: Advanced Data Structures", room: "Room 304", faculty: "Dr. Sarah Jenkins" },
      { day: "Monday", time: "11:00 AM - 12:30 PM", course: "CS-304: Distributed Database Systems", room: "Room 202", faculty: "Prof. Michael Chang" },
      { day: "Monday", time: "02:00 PM - 04:00 PM", course: "CS-308L: Cloud & DevOps Lab", room: "Linux Lab 2", faculty: "Dr. Sarah Jenkins" },
      { day: "Tuesday", time: "10:00 AM - 11:30 AM", course: "CS-308: Cloud Architecture", room: "Room 304", faculty: "Dr. Sarah Jenkins" },
      { day: "Tuesday", time: "01:30 PM - 03:00 PM", course: "HU-301: Professional Ethics", room: "Seminar Hall 1", faculty: "Prof. Linda Watson" },
      { day: "Wednesday", time: "09:00 AM - 10:30 AM", course: "CS-301: Advanced Data Structures", room: "Room 304", faculty: "Dr. Sarah Jenkins" },
      { day: "Wednesday", time: "11:00 AM - 12:30 PM", course: "CS-304: Distributed Database Systems", room: "Room 202", faculty: "Prof. Michael Chang" },
      { day: "Thursday", time: "10:00 AM - 12:00 PM", course: "CS-301L: Algorithms Lab", room: "Computing Lab 4", faculty: "Prof. Michael Chang" },
      { day: "Thursday", time: "02:00 PM - 03:30 PM", course: "CS-308: Cloud Architecture", room: "Room 304", faculty: "Dr. Sarah Jenkins" },
      { day: "Friday", time: "09:30 AM - 11:00 AM", course: "HU-301: Professional Ethics", room: "Seminar Hall 1", faculty: "Prof. Linda Watson" },
      { day: "Friday", time: "02:00 PM - 04:00 PM", course: "Student Mentorship & Project Review", room: "Staff Cabin 14", faculty: "Dr. Sarah Jenkins" }
    ],
    studentRoster: [
      { id: "STU-2024-001", name: "Alex Rivera", rollNo: "CS21B042", status: "Present" },
      { id: "STU-2024-002", name: "Emily Chen", rollNo: "CS21B018", status: "Present" },
      { id: "STU-2024-003", name: "David Kim", rollNo: "CS21B029", status: "Present" },
      { id: "STU-2024-004", name: "Sophia Taylor", rollNo: "CS21B055", status: "Absent" },
      { id: "STU-2024-005", name: "Zack Robinson", rollNo: "CS21B061", status: "Present" }
    ],
    courseMarks: {
      "CS-301": [
        { studentId: "STU-2024-001", studentName: "Alex Rivera", rollNo: "CS21B042", internalMarks: 28, examMarks: 63, totalMarks: 91, maxMarks: 100, grade: "A", remarks: "Consistent excellence in tree traversals and dynamic programming." },
        { studentId: "STU-2024-002", studentName: "Emily Chen", rollNo: "CS21B018", internalMarks: 26, examMarks: 59, totalMarks: 85, maxMarks: 100, grade: "A", remarks: "Great work on graph algorithms." },
        { studentId: "STU-2024-003", studentName: "David Kim", rollNo: "CS21B029", internalMarks: 24, examMarks: 54, totalMarks: 78, maxMarks: 100, grade: "B+", remarks: "Good conceptual grasp, improve time complexities." },
        { studentId: "STU-2024-004", studentName: "Sophia Taylor", rollNo: "CS21B055", internalMarks: 22, examMarks: 46, totalMarks: 68, maxMarks: 100, grade: "B", remarks: "Needs more lab practice on balancing AVL trees." },
        { studentId: "STU-2024-005", studentName: "Zack Robinson", rollNo: "CS21B061", internalMarks: 25, examMarks: 57, totalMarks: 82, maxMarks: 100, grade: "A", remarks: "Solid midterm performance." }
      ],
      "CS-304": [
        { studentId: "STU-2024-001", studentName: "Alex Rivera", rollNo: "CS21B042", internalMarks: 27, examMarks: 59, totalMarks: 86, maxMarks: 100, grade: "A-", remarks: "Deep understanding of ACID and transaction isolation." },
        { studentId: "STU-2024-002", studentName: "Emily Chen", rollNo: "CS21B018", internalMarks: 28, examMarks: 61, totalMarks: 89, maxMarks: 100, grade: "A", remarks: "Outstanding SQL tuning and sharding implementation." },
        { studentId: "STU-2024-003", studentName: "David Kim", rollNo: "CS21B029", internalMarks: 23, examMarks: 52, totalMarks: 75, maxMarks: 100, grade: "B+", remarks: "Strong replication logs and consensus understanding." },
        { studentId: "STU-2024-004", studentName: "Sophia Taylor", rollNo: "CS21B055", internalMarks: 20, examMarks: 44, totalMarks: 64, maxMarks: 100, grade: "B", remarks: "Review two-phase locking protocols." },
        { studentId: "STU-2024-005", studentName: "Zack Robinson", rollNo: "CS21B061", internalMarks: 26, examMarks: 55, totalMarks: 81, maxMarks: 100, grade: "A", remarks: "Very good database indexing analysis." }
      ],
      "CS-308": [
        { studentId: "STU-2024-001", studentName: "Alex Rivera", rollNo: "CS21B042", internalMarks: 29, examMarks: 67, totalMarks: 96, maxMarks: 100, grade: "A+", remarks: "Exemplary Kubernetes container orchestration project." },
        { studentId: "STU-2024-002", studentName: "Emily Chen", rollNo: "CS21B018", internalMarks: 27, examMarks: 63, totalMarks: 90, maxMarks: 100, grade: "A+", remarks: "Exceptional CI/CD automation pipeline." },
        { studentId: "STU-2024-003", studentName: "David Kim", rollNo: "CS21B029", internalMarks: 25, examMarks: 55, totalMarks: 80, maxMarks: 100, grade: "A", remarks: "Good microservices resilience architecture." },
        { studentId: "STU-2024-004", studentName: "Sophia Taylor", rollNo: "CS21B055", internalMarks: 21, examMarks: 49, totalMarks: 70, maxMarks: 100, grade: "B+", remarks: "Improve Terraform cloud state configuration." },
        { studentId: "STU-2024-005", studentName: "Zack Robinson", rollNo: "CS21B061", internalMarks: 26, examMarks: 58, totalMarks: 84, maxMarks: 100, grade: "A", remarks: "Well structured Docker Compose cluster." }
      ],
      "HU-301": [
        { studentId: "STU-2024-001", studentName: "Alex Rivera", rollNo: "CS21B042", internalMarks: 28, examMarks: 61, totalMarks: 89, maxMarks: 100, grade: "A", remarks: "Thoughtful case study analysis on AI ethics." },
        { studentId: "STU-2024-002", studentName: "Emily Chen", rollNo: "CS21B018", internalMarks: 29, examMarks: 63, totalMarks: 92, maxMarks: 100, grade: "A+", remarks: "Excellent essay on engineering accountability." },
        { studentId: "STU-2024-003", studentName: "David Kim", rollNo: "CS21B029", internalMarks: 26, examMarks: 56, totalMarks: 82, maxMarks: 100, grade: "A", remarks: "Good team presentation and active debate participation." },
        { studentId: "STU-2024-004", studentName: "Sophia Taylor", rollNo: "CS21B055", internalMarks: 24, examMarks: 51, totalMarks: 75, maxMarks: 100, grade: "B+", remarks: "Active discussion on workplace leadership." },
        { studentId: "STU-2024-005", studentName: "Zack Robinson", rollNo: "CS21B061", internalMarks: 27, examMarks: 58, totalMarks: 85, maxMarks: 100, grade: "A", remarks: "Strong ethical reasoning on data privacy." }
      ]
    }
  },

  lostAndFound: [
    {
      id: "LNF-101",
      title: "Silver Apple MacBook Air (M2) in Grey Felt Sleeve",
      category: "Electronics",
      locationFound: "Library 2nd Floor Silent Study Desk 14",
      date: "2026-11-21",
      status: "Found",
      reportedBy: "Library Desk Officer",
      contact: "library-desk@campusconnect.edu",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80",
      claimant: ""
    },
    {
      id: "LNF-102",
      title: "Blue Parker Vector Fountain Pen & Notebook",
      category: "Books",
      locationFound: "Lecture Hall 304 3rd row desk",
      date: "2026-11-20",
      status: "Claimed",
      reportedBy: "Cleaning Staff Sunita",
      contact: "sanitation@campusconnect.edu",
      image: "https://images.unsplash.com/photo-1585336261026-77cc7c3a067e?w=400&auto=format&fit=crop&q=80",
      claimant: "Alex Rivera (Claimed Nov 21)"
    },
    {
      id: "LNF-103",
      title: "Matte Black Noise-Cancelling Headphones (Sony WH-1000XM4)",
      category: "Electronics",
      locationFound: "Gymnasium Locker Bench 3",
      date: "2026-11-19",
      status: "Found",
      reportedBy: "Marcus Vance (Sports Sec)",
      contact: "sports-sec@campusconnect.edu",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
      claimant: ""
    }
  ],

  notifications: [
    {
      id: "NOTIF-01",
      userId: "all",
      targetRole: "all",
      title: "Mid-Term Examination Datesheet Published",
      message: "Dr. Sarah Jenkins posted the Fall 2026 examination schedule. Check announcements for details.",
      type: "announcement",
      link: "announcements",
      read: false,
      createdAt: "2026-11-21T10:05:00Z"
    },
    {
      id: "NOTIF-02",
      userId: "STU-2024-001",
      targetRole: "Student",
      title: "Complaint CMP-1001 Status Updated",
      message: "Cleaning Department: Rajesh Kumar assigned sanitation crew for washroom deep cleaning.",
      type: "complaint",
      link: "complaints",
      read: false,
      createdAt: "2026-11-20T14:02:00Z"
    },
    {
      id: "NOTIF-03",
      userId: "STU-2024-001",
      targetRole: "Student",
      title: "Counselling Appointment Confirmed",
      message: "Dr. Maya Patel confirmed your session on Nov 25th at 11:00 AM.",
      type: "appointment",
      link: "counselling",
      read: true,
      createdAt: "2026-11-21T09:15:00Z"
    },
    {
      id: "NOTIF-04",
      userId: "CLN-001",
      targetRole: "Cleaning",
      title: "New Student Sanitation Report Logged",
      message: "Student Alex Rivera filed a high priority report for Block C 2nd floor.",
      type: "cleaning",
      link: "cleaning",
      read: false,
      createdAt: "2026-11-20T09:31:00Z"
    },
    {
      id: "NOTIF-05",
      userId: "ADM-001",
      targetRole: "Admin",
      title: "Duty Leave Request Pending Approval",
      message: "Dr. Arvind Rao submitted a 3-day conference leave request.",
      type: "hr",
      link: "hr",
      read: true,
      createdAt: "2026-11-15T10:15:00Z"
    }
  ]
};


# CampusConnect - Smart Integrated College Management System

CampusConnect is a centralized, digital college management platform connecting students, faculty, department heads, student leaders, and college management.

---

## 🌟 Key Features & Interconnected Architecture

### 1. Authentication & Role-Based Access
- **First Register, Then Login**: New users can register with photo upload (from device or avatar presets), ID, official email, role, department, and password.
- **Roles Supported**: Student, Faculty, Admin, Cleaning Staff, HR Officer, Student Counsellor, Student Council Leader.
- **Forgot Password**: Built-in credential reset simulation with instant temporary password generation.
- **One-Click Quick Switcher**: The navigation bar includes a role switcher allowing instant perspective switching to verify inter-departmental links.

### 2. Main Dashboard & Professional Sidebar (All 11 Modules)
1. **Home**: High-level campus metrics, department shortcuts, live announcements ticker, and real-time complaint status spotlight.
2. **Student Portal**: Student profile, attendance analytics (percentage & subject-wise breakdown), academic standings & grades, interactive weekly timetable, announcements, complaint registration, complaint live tracking, feedback/suggestions, and Lost & Found.
3. **Cleaning Department**: Dedicated cleaning dashboard to report unclean areas with photos, assign tasks to sanitation crew, monitor progress, mark tasks as completed, and process student cleaning complaints.
4. **Management Department**: Executive operations overview, manage departments (headcount, budgets, HODs), college-wide complaint monitor with reassignment/escalation, department performance metrics, and campus-wide notice broadcast.
5. **HR Department**: Faculty and staff directory, comprehensive employee profiles, daily staff attendance management, leave request approval queue (with automated balance deductions), and department-wise staff distribution.
6. **Student Counselling Department**: 100% confidential 1-on-1 mental health and academic guidance session booking, session scheduling, counsellor dashboard (Dr. Maya Patel), and direct confidential chat thread.
7. **Student Leader Department**: Student Council representatives directory, suggestion forum with upvoting, campus event coordination (e.g. TechPulse Hackathon, AURA Fest), and official memoranda liaison with management.
8. **Faculty Portal**: Faculty profile, interactive student class attendance marking (with instant reflection on student portal), academic notices, teaching timetable, and relevant student complaint resolution.
9. **Notifications Center**: Centralized notifications system with unread badge counter, filtering by type (complaints, announcements, appointments, cleaning, HR).
10. **Profile**: Personal information editor, profile photo update (upload or preset picker), contact phone, biography, and security password update.
11. **Logout**: Safe session clearance with notification.

---

## 🔄 Cross-Department Interconnection In Action

- **Student Complaint to Department**:
  - A student files a complaint under **"Cleaning & Sanitation"** (e.g., washroom leak in Block C).
  - The ticket immediately appears in the **Cleaning Department** queue and creates a linked sanitation task.
  - When the Sanitation Lead assigns a worker and marks the task as **"Completed"**, the student's complaint automatically transitions to **"Resolved"**, the completion notes are displayed, and a real-time notification is sent to the student!
- **Faculty Attendance to Student Portal**:
  - When a faculty member marks student attendance in the **Faculty Portal**, the student's overall attendance percentage and class count update immediately.
- **Management Announcements to Campus**:
  - When the Management Department publishes a notice, it is automatically broadcasted to the **Student Portal**, **Faculty Portal**, and the **Notifications Center**.

---

## 🚀 How to Run the Application

### 1. Unified Fullstack Server (Frontend + Backend API)
```bash
npm start
```
Starts the Express server on `http://localhost:5000` which serves both the REST API and the compiled React production frontend.

### 2. Development Mode with Hot Reloading
```bash
# Terminal 1: Backend API
node server/index.js

# Terminal 2: Vite Dev Server
npm run dev
```
Open `http://localhost:5173` in your browser. Requests to `/api/*` are automatically proxied to port 5000.

---

## 👥 Demo Accounts for Testing

| Role | Name | ID / Email | Password |
|---|---|---|---|
| **Student** | Alex Rivera | `STU-2024-001` | `password123` |
| **Faculty** | Dr. Sarah Jenkins | `FAC-CS-101` | `password123` |
| **Admin** | Dean Robert Vance | `ADM-001` | `password123` |
| **Cleaning** | Rajesh Kumar | `CLN-001` | `password123` |
| **HR** | Priya Sharma | `HR-001` | `password123` |
| **Counsellor** | Dr. Maya Patel | `CNS-001` | `password123` |
| **Student Leader** | Rohan Mehta | `SL-001` | `password123` |


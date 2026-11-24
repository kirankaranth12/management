import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Phone, 
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function AuthPage({ initialMode = 'register' }) {
  // Mode: 'register' or 'login'
  const [mode, setMode] = useState(initialMode);
  const { login, register, showToast } = useApp();

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('All');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('Student');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regPhone, setRegPhone] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState(null);

  // Quick Demo Accounts
  const demoAccounts = [
    { label: 'Faculty Account', id: 'FAC-001', pass: 'password123', role: 'Faculty' },
    { label: 'Admin Account', id: 'ADM-001', pass: 'password123', role: 'Admin' },
    { label: 'Cleaning Staff', id: 'CLN-001', pass: 'password123', role: 'Cleaning' },
    { label: 'HR Officer', id: 'HR-001', pass: 'password123', role: 'HR' },
    { label: 'Counsellor', id: 'CNS-001', pass: 'password123', role: 'Counselling' },
    { label: 'Student Leader', id: 'SL-001', pass: 'password123', role: 'StudentLeader' },
  ];

  // Handle Photo File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setRegAvatar(reader.result);
        showToast('Profile photo uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Register Submit
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      name: regName,
      id: regId.trim() || undefined,
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      department: regDepartment,
      phone: regPhone.trim() || '+1 (555) 000-0000',
      avatar: regAvatar || avatarPreview
    });
    setIsSubmitting(false);

    if (result.success) {
      // User is logged in and redirected by context
    }
  };

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword.trim()) {
      showToast('Please provide your ID/Email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = await login(loginId.trim(), loginPassword, loginRole);
    setIsSubmitting(false);
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotResult(res);
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message || 'Error finding account.', 'error');
      }
    } catch (err) {
      showToast('Failed to contact server.', 'error');
    }
  };

  const handleQuickDemoClick = async (acc) => {
    setLoginId(acc.id);
    setLoginPassword(acc.pass);
    setLoginRole(acc.role);
    await login(acc.id, acc.pass, acc.role);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
        
        {/* Left Visual Column */}
        <div className="lg:col-span-5 bg-blue-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-xs font-semibold text-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen College Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              CampusConnect
            </h1>
            <p className="text-blue-100/90 text-sm mt-3 leading-relaxed">
              The centralized digital ecosystem connecting students, faculty, departments, and college leadership.
            </p>
          </div>

          {/* Center highlights */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Interconnected cross-department complaints</span>
            </div>
            <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time cleaning and sanitation tracking</span>
            </div>
            <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Confidential student counselling portal</span>
            </div>
            <div className="flex items-center gap-3 text-xs bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Faculty attendance & grade publishing</span>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="pt-4 border-t border-white/15 relative z-10">
            <p className="text-[11px] text-blue-200/80 font-mono">
              APEX INSTITUTE OF TECHNOLOGY • SECURE DIGITAL CAMPUS
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Top Toggle Switch */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'register' 
                  ? 'First register your credentials with photo, then login anytime.'
                  : 'Enter your College ID or Email to access your dashboard.'}
              </p>
            </div>

            <div className="p-1 bg-slate-100 rounded-xl flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Register
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Login
              </button>
            </div>
          </div>

          {/* ===================== REGISTRATION FORM ===================== */}
          {mode === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Real Device Photo Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Profile Photograph (Upload from Device)
                </label>
                
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Uploaded Preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <Camera className="w-6 h-6" />
                        <span className="text-[9px] font-bold mt-0.5">No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        {avatarPreview ? 'Change Photo' : 'Upload My Photo'}
                      </label>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarPreview('');
                            setRegAvatar('');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Upload your real photo from your computer or phone (JPG, PNG).
                    </p>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Lin"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Category *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty Member</option>
                    <option value="Admin">College Administration</option>
                    <option value="Cleaning">Cleaning & Sanitation Staff</option>
                    <option value="HR">Human Resources Officer</option>
                    <option value="Counselling">Student Counsellor</option>
                    <option value="StudentLeader">Student Council / Leader</option>
                  </select>
                </div>

                {/* ID Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student ID / Employee ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2024-042 or EMP-FAC-102"
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">Leave blank to auto-generate</p>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Eng</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Sanitation & Facilities">Sanitation & Facilities</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Student Counselling & Wellbeing">Student Counselling</option>
                    <option value="Campus Administration & Operations">Campus Administration</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@campusconnect.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-type password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Registering Account...' : 'Complete Registration & Enter CampusConnect'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ===================== LOGIN FORM ===================== */
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Role Filter Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Role View:
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  {['All', 'Student', 'Faculty', 'Admin'].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setLoginRole(r)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        loginRole === r
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* ID or Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student ID / Faculty ID / Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-001 or student@campusconnect.edu"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotEmail(loginId || '');
                      setForgotResult(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In to CampusConnect'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Credentials Bar */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick One-Click Demo Logins:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {demoAccounts.map((acc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickDemoClick(acc)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition-colors border border-slate-200/80"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered student ID or official email. We will generate instant reset instructions.
            </p>

            <form onSubmit={handleForgotPassword} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email or ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="student@campusconnect.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {forgotResult && (
                <div className={`p-3 rounded-xl text-xs font-medium ${
                  forgotResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <p>{forgotResult.message}</p>
                  {forgotResult.tempPassword && (
                    <p className="mt-1 font-bold">Use Password: {forgotResult.tempPassword}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


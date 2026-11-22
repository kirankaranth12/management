import React, { useState } from 'react';
import { 
  UserCheck, 
  Camera, 
  UploadCloud, 
  Lock, 
  Shield, 
  Mail, 
  Phone, 
  Building, 
  Save, 
  CheckCircle2, 
  KeyRound,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function ProfilePage() {
  const { user, updateUserProfile, showToast, role } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Change password modal
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Avatar presets
  const presets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ];

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
        showToast('Photo uploaded! Click "Save Profile Changes" to persist.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      name,
      phone,
      bio,
      avatar: avatar || avatarPreview
    });
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPass || !newPass) return;
    if (newPass !== confirmPass) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsChangingPass(true);
    const res = await api.changePassword(user.id, {
      currentPassword: currentPass,
      newPassword: newPass
    });
    setIsChangingPass(false);

    if (res.success) {
      showToast('Password updated successfully!', 'success');
      setPassModalOpen(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      showToast(res.message || 'Error changing password.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">User Profile & Account</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {user?.role || 'Campus User'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage personal credentials, contact phone, profile photo, and institutional security settings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setPassModalOpen(true)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <KeyRound className="w-4 h-4 text-slate-600" />
          Change Password
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Profile Photo Customization */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
            />
            <label
              htmlFor="profile-photo-change"
              className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-[10px] font-bold"
            >
              <Camera className="w-5 h-5" />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 mb-1">Update Profile Photograph</h4>
            <div className="flex items-center gap-2">
              <label
                htmlFor="profile-photo-change"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload New Image
              </label>
              <input
                id="profile-photo-change"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Quick Presets */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Or choose avatar:</span>
              <div className="flex items-center gap-1.5">
                {presets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAvatar(p);
                      setAvatarPreview(p);
                    }}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-transform ${
                      avatarPreview === p ? 'border-blue-600 scale-110 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Read-only Institutional Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Official ID</span>
            <p className="font-mono text-xs font-bold text-slate-800 mt-0.5">{user?.id || 'STU-2024-001'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Role</span>
            <p className="text-xs font-bold text-blue-700 mt-0.5">{user?.role || 'Student'}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
            <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{user?.department || 'Computer Science'}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || 'user@campusconnect.edu'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Registration Date</label>
            <input
              type="text"
              disabled
              value={user?.joinedDate || 'August 2021'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Short Biography / Academic Interests</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
          />
        </div>

        {/* Save Changes Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Role Privileges Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          Access Privileges & Role Mapping
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          As a <strong>{user?.role}</strong>, you have access to student portal complaints tracking, academic dashboards, timetable schedules, and cross-departmental announcements. Switch perspectives anytime using the top bar switcher to test other roles.
        </p>
      </div>

      {/* Change Password Modal */}
      {passModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-base font-black text-slate-900">Update Security Password</h3>
            
            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPassModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {isChangingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


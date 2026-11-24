import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  BookOpen, 
  PhoneCall, 
  Check, 
  Lock, 
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StudentCounsellingPage() {
  const { 
    user, 
    counsellingAppointments, 
    bookCounselling, 
    updateAppointment, 
    sendCounsellingMessage,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'appointments' | 'counsellor-view' | 'resources'
  
  // Book Appointment Form State
  const [category, setCategory] = useState('Academic Stress');
  const [appDate, setAppDate] = useState('2026-11-25');
  const [appTime, setAppTime] = useState('11:00 AM - 11:45 AM');
  const [appMode, setAppMode] = useState('In-Person (Room 108, Wellbeing Wing)');
  const [appNotes, setAppNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Chat message state
  const [activeAppForChat, setActiveAppForChat] = useState(null);
  const [chatInput, setChatInput] = useState('');

  // Handle Book
  const handleBook = async (e) => {
    e.preventDefault();
    if (!appDate || !appTime) {
      showToast('Please select date and time.', 'error');
      return;
    }

    setIsBooking(true);
    const res = await bookCounselling({
      category,
      date: appDate,
      timeSlot: appTime,
      mode: appMode,
      notes: appNotes
    });
    setIsBooking(false);

    if (res.success) {
      setAppNotes('');
      setActiveTab('appointments');
    }
  };

  // Handle Send Chat
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeAppForChat) return;

    await sendCounsellingMessage(activeAppForChat.id, chatInput.trim());
    setChatInput('');
  };

  const isCounsellor = user?.role === 'Counselling' || user?.role === 'Admin';

  const myAppointments = isCounsellor
    ? counsellingAppointments
    : counsellingAppointments.filter(a => a.studentId === user?.id || true);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Student Counselling & Wellbeing</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                100% Confidential Care
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Private 1-on-1 emotional support, academic stress guidance, career clarity, and licensed mental health care.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('book')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Book Private Session
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            Guidance Resources
          </button>
        </div>
      </div>

      {/* Confidentiality Notice */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center gap-3 text-xs text-teal-950 font-medium">
        <Lock className="w-5 h-5 text-teal-700 shrink-0" />
        <span>
          <strong>Confidentiality Pledge:</strong> All counselling notes, appointment bookings, and messages are strictly protected under institutional psychological ethics guidelines and are never shared with academic grading or disciplinary bodies.
        </span>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'book' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'appointments' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Sessions ({myAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('counsellor-view')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'counsellor-view' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Counsellor Dashboard (Dr. Maya Patel)
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'resources' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guidance & Helpline
        </button>
      </div>

      {/* ===================== TAB 1: BOOK PRIVATE APPOINTMENT ===================== */}
      {activeTab === 'book' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-xl font-black text-slate-900">Request a Confidential Session</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select what you'd like support with. Dr. Maya Patel will confirm the slot or provide secure online meeting details.
            </p>
          </div>

          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Focus Area *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="Academic Stress">Academic Stress & Course Load Management</option>
                <option value="Exam Anxiety">Exam Anxiety & Focus Improvement</option>
                <option value="Career Guidance">Career Path & Higher Studies Uncertainty</option>
                <option value="Mental Health & Anxiety">Mental Health, Anxiety & Low Mood</option>
                <option value="Personal Support">Personal Support & Dorm Life Adjustment</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={appDate}
                  onChange={(e) => setAppDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time Slot *</label>
                <select
                  value={appTime}
                  onChange={(e) => setAppTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="09:30 AM - 10:15 AM">09:30 AM - 10:15 AM</option>
                  <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM</option>
                  <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                  <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Format</label>
              <select
                value={appMode}
                onChange={(e) => setAppMode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="In-Person (Room 108, Wellbeing Wing)">In-Person (Room 108, Wellbeing Wing)</option>
                <option value="Confidential Online (CampusConnect Meet)">Confidential Online (Encrypted Video Link)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brief Note for the Counsellor (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share any specific context or what you would like to discuss..."
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isBooking}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition-all"
            >
              {isBooking ? 'Requesting Appointment...' : 'Submit Confidential Request to Dr. Maya Patel'}
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 2: MY SESSIONS & CONFIDENTIAL MESSAGING ===================== */}
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Appointments List */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Your Counselling Appointments</h3>

            {myAppointments.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Appointments Booked</h4>
                <p className="text-xs text-slate-400 mt-1">You have no active counselling appointments. Click "Book Private Session" to schedule a confidential talk.</p>
              </div>
            ) : (
              myAppointments.map((app) => (
              <div
                key={app.id}
                className={`p-5 rounded-3xl border transition-all ${
                  activeAppForChat?.id === app.id ? 'bg-teal-50/60 border-teal-400 ring-2 ring-teal-500/20' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {app.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{app.category}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      📅 {app.date} • 🕒 {app.timeSlot}
                    </p>
                    <p className="text-[11px] text-teal-700 font-semibold mt-0.5">{app.mode}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Counsellor: {app.counsellorName}</p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : (app.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')
                  }`}>
                    {app.status}
                  </span>
                </div>

                {app.counsellorNotes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-teal-50 text-[11px] text-teal-900 font-medium">
                    Dr. Patel's Note: {app.counsellorNotes}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveAppForChat(app)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Confidential Message Thread ({app.messages?.length || 0})
                  </button>
                </div>
              </div>
            )))}
          </div>

          {/* Right: Direct Confidential Chat Thread */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-100 mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {activeAppForChat ? `Confidential Thread: ${activeAppForChat.id}` : 'Select a Session to Message'}
                </h4>
                <p className="text-[11px] text-slate-400">Direct encrypted channel with Campus Counsellor</p>
              </div>
              <Lock className="w-4 h-4 text-teal-600" />
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
              {!activeAppForChat ? (
                <div className="h-full flex items-center justify-center text-center text-slate-400 text-xs">
                  Click on an appointment on the left to review or send confidential messages.
                </div>
              ) : (
                activeAppForChat.messages?.map((msg, i) => {
                  const isMe = msg.sender === (user?.name || 'Student Member');
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-xs ${
                        isMe ? 'bg-teal-600 text-white rounded-br-xs' : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}>
                        <p className="font-semibold text-[10px] opacity-75 mb-0.5">{msg.sender} ({msg.role})</p>
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message input */}
            {activeAppForChat && (
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type confidential message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* ===================== TAB 3: COUNSELLOR DASHBOARD VIEW ===================== */}
      {activeTab === 'counsellor-view' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Dr. Maya Patel - Clinical Appointment Queue</h3>
              <p className="text-xs text-slate-500">Confirm sessions, record clinical notes, or complete appointments.</p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg">
              Chief Counsellor Session Roster
            </span>
          </div>

          <div className="space-y-4">
            {counsellingAppointments.map((app) => (
              <div key={app.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {app.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{app.studentName} ({app.category})</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Requested Slot: {app.date} at {app.timeSlot} • Mode: {app.mode}
                  </p>
                  {app.notes && (
                    <p className="text-[11px] text-slate-600 italic mt-0.5">"{app.notes}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status === 'Requested' && (
                    <button
                      onClick={() => updateAppointment(app.id, { status: 'Confirmed', counsellorNotes: 'Slot confirmed. Please report to Room 108.' })}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm Session
                    </button>
                  )}
                  {app.status === 'Confirmed' && (
                    <button
                      onClick={() => updateAppointment(app.id, { status: 'Completed', counsellorNotes: 'Session successfully conducted.' })}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: GUIDANCE & HELPLINE ===================== */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-600" />
              24/7 Campus Crisis & Wellbeing Helpline
            </h3>
            <p className="text-xs text-slate-500">Free, confidential assistance available round-the-clock for any student in distress.</p>
            
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200">
              <span className="text-[10px] font-bold text-teal-800 uppercase block">Direct Toll-Free Line:</span>
              <p className="text-xl font-black text-teal-950 mt-0.5">1-800-CAMPUS-CARE</p>
              <p className="text-xs text-teal-700 mt-1">Available 24 hours / 7 days a week</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Self-Care & Mindful Study Strategies
            </h3>
            <p className="text-xs text-slate-500">Handbooks curated by our Clinical Psychology team:</p>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
                📘 Managing Mid-Term Stress: The 25-5 Pomodoro & Sleep Hygiene Method
              </div>
              <div className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800">
                📗 Impostor Syndrome in STEM & Finding Your Peer Support Circle
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


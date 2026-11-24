import React, { useState } from 'react';
import {
  Award,
  Users,
  MessageSquare,
  Calendar,
  ThumbsUp,
  CheckCircle2,
  Clock,
  Plus,
  FileText,
  Send,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function StudentLeaderPage() {
  const {
    studentCouncil,
    suggestions,
    submitSuggestion,
    toggleUpvoteSuggestion,
    events,
    createEvent,
    registerForEvent,
    user,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('council'); // 'council' | 'suggestions' | 'events' | 'liaison'

  // Suggestion form state
  const [sugTitle, setSugTitle] = useState('');
  const [sugDesc, setSugDesc] = useState('');
  const [isSubmittingSug, setIsSubmittingSug] = useState(false);

  // Event modal state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('');
  const [evtVenue, setEvtVenue] = useState('');
  const [evtCategory, setEvtCategory] = useState('Hackathon / Tech');
  const [evtDesc, setEvtDesc] = useState('');

  // Handle Suggestion submit
  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!sugTitle.trim() || !sugDesc.trim()) return;

    setIsSubmittingSug(true);
    const res = await submitSuggestion({
      title: sugTitle,
      description: sugDesc
    });
    setIsSubmittingSug(false);

    if (res.success) {
      setSugTitle('');
      setSugDesc('');
      setActiveTab('suggestions');
    }
  };

  // Handle Create Event submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtDate || !evtVenue.trim()) return;

    const res = await createEvent({
      title: evtTitle,
      date: evtDate,
      venue: evtVenue,
      category: evtCategory,
      description: evtDesc
    });

    if (res.success) {
      setEventModalOpen(false);
      setEvtTitle('');
      setEvtDate('');
      setEvtVenue('');
      setEvtDesc('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Student Leadership & Council</h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Elected Student Body 2026-2027
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Student representatives, suggestion voting forum, campus event coordination, and communication bridge with management.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEventModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            Create Campus Event
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
          >
            Suggestions Forum ({suggestions.length})
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit overflow-x-auto">
        {[
          { id: 'council', label: 'Student Representatives' },
          { id: 'suggestions', label: `Suggestions & Ideas (${suggestions.length})` },
          { id: 'events', label: `Event Coordination (${events.length})` },
          { id: 'liaison', label: 'Management Communication Bridge' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===================== TAB 1: REPRESENTATIVES DIRECTORY ===================== */}
      {activeTab === 'council' && (
        <div className="space-y-6">
          {studentCouncil.length === 0 ? (
            <div className="py-12 px-6 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500 text-xs">
              <p className="font-bold text-slate-700 text-sm">No Student Council Representatives Yet</p>
              <p className="mt-1">Elected or registered student representatives will appear in this council directory.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {studentCouncil.map((rep) => (
                <div key={rep.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <Avatar
                      src={rep.avatar}
                      name={rep.name}
                      className="w-16 h-16 mb-3"
                      textClassName="text-base"
                    />
                    <h4 className="text-sm font-bold text-slate-900">{rep.name}</h4>
                    <p className="text-xs font-bold text-indigo-700 mt-0.5">{rep.role}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{rep.department}</p>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Focus: {rep.focusArea}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Term: {rep.term} • {rep.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: SUGGESTIONS FORUM ===================== */}
      {activeTab === 'suggestions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Submit Suggestion Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit">
            <h3 className="text-base font-black text-slate-900 mb-1">Submit Idea / Suggestion</h3>
            <p className="text-xs text-slate-500 mb-4">
              Ideas that receive 50+ upvotes are formally submitted by the Student Council to College Administration.
            </p>

            <form onSubmit={handleSuggestionSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title of Idea *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24/7 Library Hours during Finals"
                  value={sugTitle}
                  onChange={(e) => setSugTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Rationale *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How will this benefit students? What problem does it solve?"
                  value={sugDesc}
                  onChange={(e) => setSugDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingSug}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                {isSubmittingSug ? 'Posting...' : 'Post Suggestion to Community'}
              </button>
            </form>
          </div>

          {/* Suggestions List with Upvoting */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Student Suggestions & Council Responses</h3>

            {suggestions.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
                <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Suggestions Yet</h4>
                <p className="text-xs text-slate-400 mt-1">Be the first to submit a suggestion to the Student Council!</p>
              </div>
            ) : (
              suggestions.map((sug) => {
                const hasUpvoted = sug.upvotedBy?.includes(user?.id || 'STU-2024-001');

                return (
                  <div key={sug.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                            {sug.id}
                          </span>
                          <span className="text-xs text-slate-500">By {sug.studentName}</span>
                          <span className="text-[10px] text-slate-400">• {sug.createdAt}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{sug.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sug.description}</p>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={() => toggleUpvoteSuggestion(sug.id)}
                        className={`flex flex-col items-center px-3 py-2 rounded-2xl border transition-all shrink-0 ${hasUpvoted ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200'
                          }`}
                      >
                        <ThumbsUp className="w-4 h-4 mb-0.5" />
                        <span className="text-xs font-black">{sug.upvotes}</span>
                        <span className="text-[9px] uppercase font-bold">{hasUpvoted ? 'Voted' : 'Vote'}</span>
                      </button>
                    </div>

                    {/* Council Status & Response */}
                    <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${sug.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                        {sug.status}
                      </span>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Council:</strong> {sug.councilResponse}
                      </p>
                    </div>
                  </div>
                );
              }))}
          </div>

        </div>
      )}

      {/* ===================== TAB 3: CAMPUS EVENT COORDINATION ===================== */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200/80">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Events Scheduled</h4>
              <p className="text-xs text-slate-400 mt-1">There are no upcoming campus events currently scheduled.</p>
            </div>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {evt.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{evt.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">📅 {evt.date} • {evt.time}</p>
                  <p className="text-xs text-slate-500">📍 {evt.venue}</p>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {evt.registeredCount} / {evt.maxCapacity} Registered
                  </span>
                  <button
                    onClick={() => registerForEvent(evt.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===================== TAB 4: MANAGEMENT LIAISON ===================== */}
      {activeTab === 'liaison' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Formal Council Petitions to College Leadership</h3>
          <p className="text-xs text-slate-500">Documented memoranda exchanged with College Leadership and Academic Council.</p>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">Memorandum #2026-04: Library Study Zone 24/7 Access</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Approved by Administration</span>
              </div>
              <p className="text-xs text-slate-600">
                Resolution: 2nd floor quiet room approved for round-the-clock student access with biometric pass scan starting Dec 1st.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">Memorandum #2026-05: EV Charging Stations Installation</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Procurement Stage</span>
              </div>
              <p className="text-xs text-slate-600">
                Resolution: Approved in principle; vendor quotations submitted to finance committee.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade-in">
            <h3 className="text-base font-black text-slate-900">Create Campus Event</h3>

            <form onSubmit={handleEventSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Coding Sprint or Music Jam"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={evtCategory}
                    onChange={(e) => setEvtCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Hackathon / Tech">Hackathon / Tech</option>
                    <option value="Cultural">Cultural & Arts</option>
                    <option value="Sports">Sports & Fitness</option>
                    <option value="Social Cause">Social Cause / Health</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditorium or SAC Ground"
                  value={evtVenue}
                  onChange={(e) => setEvtVenue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Description</label>
                <textarea
                  rows={3}
                  placeholder="Event schedule, rules, eligibility..."
                  value={evtDesc}
                  onChange={(e) => setEvtDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


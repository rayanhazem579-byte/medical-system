import { useState } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const DAYS = [
  { label: "Sun", date: "May 12", dayIndex: 0 },
  { label: "Mon", date: "May 13", dayIndex: 1 },
  { label: "Tue", date: "May 14", dayIndex: 2 },
  { label: "Wed", date: "May 15", dayIndex: 3 },
  { label: "Thu", date: "May 16", dayIndex: 4 },
  { label: "Fri", date: "May 17", dayIndex: 5 },
  { label: "Sat", date: "May 18", dayIndex: 6 },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const formatHour = (h: number) => {
  const suffix = h < 12 ? "AM" : "PM";
  const display = h > 12 ? h - 12 : h;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
};

const APPOINTMENTS = [
  {
    id: 1,
    patient: "Ahmed Hassan",
    type: "General Review",
    dayIndex: 1,
    startHour: 9,
    duration: 1,
    color: "bg-blue-500",
    status: "confirmed",
    doctor: "Dr. Mohamed Ali",
  },
  {
    id: 2,
    patient: "Sara Khaled",
    type: "Heart Follow-up",
    dayIndex: 1,
    startHour: 10,
    duration: 2,
    color: "bg-red-400",
    status: "in-progress",
    doctor: "Dr. Mohamed Ali",
  },
  {
    id: 3,
    patient: "Omar Youssef",
    type: "General Review",
    dayIndex: 1,
    startHour: 11,
    duration: 1,
    color: "bg-blue-500",
    status: "confirmed",
    doctor: "Dr. Mohamed Ali",
  },
  {
    id: 4,
    patient: "Nadia Farouk",
    type: "Orthopedic Check",
    dayIndex: 2,
    startHour: 9,
    duration: 1,
    color: "bg-green-500",
    status: "confirmed",
    doctor: "Dr. Layla Ahmed",
  },
  {
    id: 5,
    patient: "Karim Mansour",
    type: "Neurology Consult",
    dayIndex: 3,
    startHour: 10,
    duration: 2,
    color: "bg-purple-500",
    status: "confirmed",
    doctor: "Dr. Hana Ibrahim",
  },
  {
    id: 6,
    patient: "Mona Tarek",
    type: "General Review",
    dayIndex: 4,
    startHour: 8,
    duration: 1,
    color: "bg-blue-500",
    status: "confirmed",
    doctor: "Dr. Layla Ahmed",
  },
  {
    id: 7,
    patient: "Youssef Adel",
    type: "Heart Follow-up",
    dayIndex: 0,
    startHour: 13,
    duration: 1,
    color: "bg-red-400",
    status: "confirmed",
    doctor: "Dr. Hana Ibrahim",
  },
  {
    id: 8,
    patient: "Heba Samy",
    type: "Orthopedic Check",
    dayIndex: 5,
    startHour: 11,
    duration: 1,
    color: "bg-green-500",
    status: "confirmed",
    doctor: "Dr. Mohamed Ali",
  },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", badge: null },
  { id: "appointments", label: "Appointments", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", badge: "5" },
  { id: "patients", label: "Patients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", badge: null },
  { id: "doctors", label: "Doctors", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", badge: null },
  { id: "notifications", label: "Notification Log", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", badge: "3" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", badge: null },
];

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState("appointments");
  const [cancellationStatus, setCancellationStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState("All");
  const [filterDoctor, setFilterDoctor] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [smsMessage, setSmsMessage] = useState(
    "Dear patient, we regret to inform you that your appointment on Monday, May 13 (09:00 AM – 12:00 PM) with Dr. Mohamed Ali has been cancelled. Please call us to reschedule."
  );

  const CURRENT_TIME_MINUTES = 9 * 60 + 45; // 09:45 AM
  const HOUR_HEIGHT = 80; // px per hour
  const GRID_START = 8; // 8 AM

  const timeTopPx = ((CURRENT_TIME_MINUTES / 60) - GRID_START) * HOUR_HEIGHT;

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    setCancellationStatus("approved");
    showToast("✅ Cancellation approved. SMS sent to 12 patients.", "bg-green-600");
  };

  const handleReject = () => {
    setCancellationStatus("rejected");
    showToast("❌ Cancellation request rejected.", "bg-gray-700");
  };

  const handleSendSms = () => {
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      setSmsSent(true);
      setTimeout(() => {
        setShowSmsModal(false);
        setSmsSent(false);
        showToast("📱 SMS sent successfully to all patients.", "bg-blue-600");
      }, 1500);
    }, 2000);
  };

  const isMonCancelled = cancellationStatus === "approved";

  const filteredAppointments = APPOINTMENTS.filter((a) => {
    if (filterDoctor !== "All" && a.doctor !== filterDoctor) return false;
    if (filterSpecialty !== "All") {
      if (filterSpecialty === "Cardiology" && !a.type.includes("Heart")) return false;
      if (filterSpecialty === "Orthopedics" && !a.type.includes("Orthopedic")) return false;
      if (filterSpecialty === "Neurology" && !a.type.includes("Neurology")) return false;
      if (filterSpecialty === "General" && !a.type.includes("General")) return false;
    }
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    if (searchQuery && !a.patient.toLowerCase().includes(searchQuery.toLowerCase()) && !a.doctor.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 ${toast.color} text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all`}>
          {toast.msg}
        </div>
      )}

      {/* ── SMS Modal ── */}
      {showSmsModal && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📱</span> Send SMS to Patients
              </h2>
              <button onClick={() => setShowSmsModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Recipients</label>
              <div className="flex flex-wrap gap-2">
                {["All Patients (48)", "Monday Patients (12)", "Dr. Mohamed Ali's Patients"].map((r) => (
                  <span key={r} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-blue-100 transition">{r}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Message</label>
              <textarea
                rows={5}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{smsMessage.length} / 320 characters</p>
            </div>

            <div className="flex items-center gap-3">
              {smsSent ? (
                <div className="flex-1 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold py-3 rounded-xl text-center">
                  ✅ SMS Sent Successfully!
                </div>
              ) : (
                <button
                  onClick={handleSendSms}
                  disabled={smsSending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  {smsSending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : "📤 Send Now"}
                </button>
              )}
              <button onClick={() => setShowSmsModal(false)} className="px-5 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className="w-64 bg-[#0f1c3f] flex flex-col flex-shrink-0 h-full">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Hospital</p>
              <p className="text-blue-300 text-xs">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon.split(" M").map((d, i) => (
                    <path key={i} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={i === 0 ? d : "M" + d} />
                  ))}
                </svg>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-blue-500 text-white" : "bg-red-500 text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Dr. Ahmed Khaled</p>
              <p className="text-gray-400 text-xs truncate">System Administrator</p>
            </div>
            <button className="text-gray-400 hover:text-white transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Bar ── */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients or doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-semibold text-gray-700 whitespace-nowrap">May 12 – May 18, 2025</span>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-medium transition">Today</button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setShowSmsModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 shadow-sm shadow-blue-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send SMS to Patients
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ══ LEFT PANEL ══ */}
          <div className="w-72 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">

            {/* Cancellation Request */}
            <div className="p-4">
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${cancellationStatus === "pending" ? "border-red-200 bg-white" : cancellationStatus === "approved" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>

                {/* Header */}
                <div className={`px-4 py-3 flex items-center gap-2 ${cancellationStatus === "pending" ? "bg-red-50 border-b border-red-100" : cancellationStatus === "approved" ? "bg-green-50 border-b border-green-100" : "bg-gray-100 border-b border-gray-200"}`}>
                  <span className="text-base">
                    {cancellationStatus === "pending" ? "🚨" : cancellationStatus === "approved" ? "✅" : "❌"}
                  </span>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wide ${cancellationStatus === "pending" ? "text-red-600" : cancellationStatus === "approved" ? "text-green-700" : "text-gray-500"}`}>
                      {cancellationStatus === "pending" ? "Cancellation Request" : cancellationStatus === "approved" ? "Request Approved" : "Request Rejected"}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">MA</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Dr. Mohamed Ali</p>
                      <p className="text-xs text-gray-500">Cardiologist</p>
                    </div>
                  </div>

                  {/* Time Details */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1.5 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="font-semibold text-gray-700">Monday, May 13</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>09:00 AM – 12:00 PM</span>
                    </div>
                  </div>

                  {/* Smart Alert */}
                  {cancellationStatus === "pending" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                        <div>
                          <p className="text-xs font-bold text-amber-700">Smart Alert</p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            <span className="font-bold">12 registered patients</span> will be automatically notified via SMS if this cancellation is approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {cancellationStatus === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleApprove}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm"
                      >
                        Approve Cancellation
                      </button>
                      <button
                        onClick={handleReject}
                        className="px-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-bold py-2.5 rounded-xl transition"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancellationStatus("pending")}
                      className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-xs font-medium py-2 rounded-xl transition"
                    >
                      Reset Status
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 pb-4 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specialty</p>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "General", "Cardiology", "Orthopedics", "Neurology"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterSpecialty(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${filterSpecialty === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor</p>
                <div className="space-y-1.5">
                  {["All", "Dr. Mohamed Ali", "Dr. Layla Ahmed", "Dr. Hana Ibrahim"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setFilterDoctor(d)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg font-medium transition ${filterDoctor === d ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "All", label: "All", dot: "" },
                    { key: "confirmed", label: "Confirmed", dot: "bg-green-500" },
                    { key: "in-progress", label: "In Progress", dot: "bg-orange-400" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setFilterStatus(s.key)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition ${filterStatus === s.key ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Legend</p>
                <div className="space-y-1.5">
                  {[
                    { color: "bg-blue-500", label: "General Review" },
                    { color: "bg-red-400", label: "Heart Follow-up" },
                    { color: "bg-green-500", label: "Orthopedic Check" },
                    { color: "bg-purple-500", label: "Neurology Consult" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${l.color}`}></span>
                      <span className="text-xs text-gray-600">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ══ CALENDAR ══ */}
          <div className="flex-1 overflow-auto bg-white">

            {/* Day Headers */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
              <div className="flex">
                {/* Time gutter */}
                <div className="w-16 flex-shrink-0"></div>
                {DAYS.map((day) => {
                  const isCancelled = isMonCancelled && day.dayIndex === 1;
                  return (
                    <div
                      key={day.label}
                      className={`flex-1 text-center py-3 border-l border-gray-100 ${isCancelled ? "bg-red-50" : ""}`}
                    >
                      <p className={`text-xs font-semibold uppercase tracking-wide ${isCancelled ? "text-red-400" : "text-gray-400"}`}>
                        {day.label}
                      </p>
                      <p className={`text-lg font-bold mt-0.5 ${isCancelled ? "text-red-400 line-through" : "text-gray-800"}`}>
                        {day.date.split(" ")[1]}
                      </p>
                      {isCancelled && (
                        <span className="text-xs text-red-400 font-medium">Cancelled</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            <div className="relative">
              {/* Hour rows */}
              {HOURS.map((hour) => (
                <div key={hour} className="flex" style={{ height: HOUR_HEIGHT }}>
                  {/* Time label */}
                  <div className="w-16 flex-shrink-0 flex items-start justify-end pr-3 pt-1">
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{formatHour(hour)}</span>
                  </div>
                  {/* Day columns */}
                  {DAYS.map((day) => {
                    const isCancelled = isMonCancelled && day.dayIndex === 1;
                    return (
                      <div
                        key={day.label}
                        className={`flex-1 border-l border-t border-gray-100 relative ${isCancelled ? "bg-red-50/60" : "hover:bg-blue-50/20"}`}
                        style={isCancelled ? { backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(239,68,68,0.05) 8px, rgba(239,68,68,0.05) 16px)" } : {}}
                      />
                    );
                  })}
                </div>
              ))}

              {/* Current Time Line */}
              <div
                className="absolute left-0 right-0 z-10 pointer-events-none"
                style={{ top: timeTopPx + "px" }}
              >
                <div className="flex items-center">
                  <div className="w-16 flex justify-end pr-2 flex-shrink-0">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">09:45</span>
                  </div>
                  <div className="flex-1 border-t-2 border-red-500 relative">
                    <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>

              {/* Appointment Cards */}
              {filteredAppointments.map((appt) => {
                if (isMonCancelled && appt.dayIndex === 1) return null;
                const topPx = (appt.startHour - GRID_START) * HOUR_HEIGHT;
                const heightPx = appt.duration * HOUR_HEIGHT - 4;
                // Calculate left offset for day column
                return (
                  <div
                    key={appt.id}
                    className={`absolute z-10 rounded-xl p-2 text-white shadow-md cursor-pointer hover:brightness-110 transition-all overflow-hidden`}
                    style={{
                      top: topPx + 2 + "px",
                      height: heightPx + "px",
                      left: `calc(64px + ${appt.dayIndex * (100 / 7)}%)`,
                      width: `calc(${100 / 7}% - 8px)`,
                    }}
                  >
                    <div className={`absolute inset-0 ${appt.color} opacity-90 rounded-xl`}></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold leading-tight truncate">{appt.patient}</p>
                      <p className="text-xs opacity-80 truncate">{appt.type}</p>
                      {appt.duration > 1 && (
                        <p className="text-xs opacity-70 mt-1">{appt.startHour}:00 – {appt.startHour + appt.duration}:00</p>
                      )}
                      <span className={`inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full font-medium
                        ${appt.status === "confirmed" ? "bg-white/20 text-white" : "bg-orange-300/40 text-white"}`}>
                        {appt.status === "confirmed" ? "✓ Confirmed" : "⏳ In Progress"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

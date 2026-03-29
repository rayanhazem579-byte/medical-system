import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Filter, Search, User, CheckCircle2, 
  XCircle, Bell, ChevronLeft, ChevronRight, MoreVertical,
  Plus, AlertTriangle, UserPlus, History, ClipboardList, X, CalendarDays, LayoutGrid, Download,
  Users, Stethoscope, SearchCode
} from 'lucide-react';

interface AppointmentsPageProps {
  isAr: boolean;
  tx: any;
  depts?: any[];
  doctors?: any[];
  nurses?: any[];
}

const DAYS_FULL = [
  { labelAr: "السبت", labelEn: "Sat", key: 'Sat' },
  { labelAr: "الأحد", labelEn: "Sun", key: 'Sun' },
  { labelAr: "الاثنين", labelEn: "Mon", key: 'Mon' },
  { labelAr: "الثلاثاء", labelEn: "Tue", key: 'Tue' },
  { labelAr: "الأربعاء", labelEn: "Wed", key: 'Wed' },
  { labelAr: "الخميس", labelEn: "Thu", key: 'Thu' },
  { labelAr: "الجمعة", labelEn: "Fri", key: 'Fri' },
];

const APPOINTMENTS_DATA = [
  { id: 1, patient: "أحمد حسن", patientEn: "Ahmed Hassan", type: "مراجعة عامة", typeEn: "General Review", dayIndex: 1, startHour: 9, duration: 1, color: "bg-blue-500", status: "confirmed", doctor: "د. محمد علي", phone: "01012345678", followUpCount: 3 },
  { id: 2, patient: "سارة خالد", patientEn: "Sara Khaled", type: "متابعة قلب", typeEn: "Heart Follow-up", dayIndex: 1, startHour: 10, duration: 2, color: "bg-red-400", status: "pending", doctor: "د. محمد علي", phone: "01122334455", followUpCount: 5 },
  { id: 3, patient: "عمر يوسف", patientEn: "Omar Youssef", type: "مراجعة عامة", typeEn: "General Review", dayIndex: 1, startHour: 11, duration: 1, color: "bg-blue-500", status: "confirmed", doctor: "د. محمد علي", phone: "01233445566", followUpCount: 2 },
  { id: 4, patient: "ناديا فاروق", patientEn: "Nadia Farouk", type: "فحص عظام", typeEn: "Orthopedic Check", dayIndex: 2, startHour: 9, duration: 1, color: "bg-green-500", status: "confirmed", doctor: "د. ليلى أحمد", phone: "01566778899", followUpCount: 4 },
];

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ isAr, tx, depts = [], doctors = [], nurses = [] }) => {
  const [viewMode, setViewMode] = useState<'roster' | 'doctorView'>('roster');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState(APPOINTMENTS_DATA);
  const [messageToast, setMessageToast] = useState<{show: boolean, textAr: string, textEn: string} | null>(null);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showSidebarSearch, setShowSidebarSearch] = useState(false);
  
  const [activeDeptId, setActiveDeptId] = useState<number | string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ patient: '', patientEn: '', doctorId: '', time: '09:00', deptId: '' });
  const [doctorDropdownSearch, setDoctorDropdownSearch] = useState('');
  const [isDoctorSearchOpen, setIsDoctorSearchOpen] = useState(false);

  useEffect(() => {
    if (!activeDeptId && depts.length > 0) setActiveDeptId(depts[0].id);
  }, [depts]);

  useEffect(() => {
    if (tx?.patients && tx.patients.length > 0) {
      const dynamicAppointments = tx.patients.filter((p: any) => p.doctorId || p.doctor_id || p.doctor).map((p: any) => {
          const docId = p.doctorId || p.doctor_id;
          const doc = doctors.find(d => String(d.id) === String(docId)) || doctors.find(d => d.nameAr === p.doctor || d.nameEn === p.doctor);
          const docName = doc ? (isAr ? doc.nameAr : doc.nameEn) : p.doctor;
          
          return {
             id: p.id + 10000, // offset id to avoid conflicts with mock data
             patient: p.nameAr || p.name_ar || p.name || 'مريض غير معروف',
             patientEn: p.nameEn || p.name_en || p.name || 'Unknown Patient',
             type: p.specialty || p.medical_history || 'كشف',
             typeEn: 'Checkup',
             dayIndex: new Date(p.created_at || new Date()).getDay(),
             startHour: p.shift === 'evening' ? 18 : p.shift === 'night' ? 22 : 9, // Base on shift if available
             duration: 1,
             color: 'bg-indigo-500',
             status: 'confirmed',
             doctor: docName || 'غير محدد',
             phone: p.phone || '',
             followUpCount: 0
          };
      });
      
      const newAp = [...APPOINTMENTS_DATA];
      dynamicAppointments.forEach((da: any) => {
        if (!newAp.find(a => a.id === da.id)) {
           newAp.push(da);
        }
      });
      setAppointments(newAp);
    }
  }, [tx?.patients, doctors, isAr]);

  const getTodayNameAr = () => ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"][new Date().getDay()];
  const [selectedRosterDay, setSelectedRosterDay] = useState(getTodayNameAr());

  const activeDept = depts.find(d => String(d.id) === String(activeDeptId)) || depts[0];
  const deptDoctors = doctors.filter(doc => String(doc.deptId) === String(activeDeptId) || doc.deptAr === activeDept?.nameAr);
  const todayStaff = deptDoctors.filter(doc => (doc.day_shifts || []).some((s:any) => s.day === selectedRosterDay || s.day === DAYS_FULL.find(d => d.labelAr === selectedRosterDay)?.labelEn));
  const deptStaff = [...doctors, ...nurses].filter(staff => String(staff.deptId) === String(activeDeptId) || staff.deptAr === activeDept?.nameAr);

  const filteredDoctors = doctors.filter(doc => 
    (isAr ? doc.nameAr : doc.nameEn).toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const sidebarFiltered = doctors.filter(doc => 
    (isAr ? doc.nameAr : doc.nameEn).toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  const handleStatusChange = (id: number, newStatus: 'confirmed' | 'rejected') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    const msgAr = newStatus === 'confirmed' ? `تم تأكيد موعدك بنجاح للعيادة` : `نعتذر، تم إلغاء موعدك. يرجى مراجعة الاستقبال`;
    const msgEn = newStatus === 'confirmed' ? `Your appointment has been confirmed!` : `Sorry, your appointment was cancelled. Please contact reception.`;
    setMessageToast({ show: true, textAr: msgAr, textEn: msgEn });
    setTimeout(() => setMessageToast(null), 3000);
  };

  const handleSendMessage = (appt: any, type: 'active' | 'cancelled') => {
    const patientName = isAr ? appt.patient : appt.patientEn;
    const msgAr = type === 'active' ? `عزيزي ${patientName}، نود تذكيركم بموعدكم القائم.` : `عزيزي ${patientName}، نعتذر لإبلاغكم بإلغاء موعدكم اليوم.`;
    const msgEn = type === 'active' ? `Dear ${patientName}, this is a reminder.` : `Dear ${patientName}, we regret to inform you that your appointment is cancelled.`;
    setMessageToast({ show: true, textAr: msgAr, textEn: msgEn });
    setTimeout(() => setMessageToast(null), 5000);
  };

  const formatHour = (h: number) => {
    const suffix = h < 12 ? (isAr ? "ص" : "AM") : (isAr ? "م" : "PM");
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:00 ${suffix}`;
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200">
            <button 
              onClick={() => { setViewMode('roster'); setSelectedDoctor(null); }}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${viewMode === 'roster' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={14} />
              {isAr ? 'جدول المناوبات' : 'Weekly Roster'}
            </button>
            <button 
              disabled={!selectedDoctor}
              onClick={() => setViewMode('doctorView')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${viewMode === 'doctorView' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-400 hover:text-gray-600 disabled:opacity-30'}`}
            >
              <User size={14} />
              {isAr ? 'عرض الطبيب' : 'Doctor View'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-400 ml-4 font-mono font-black text-[10px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <ChevronLeft size={14} className="cursor-pointer hover:text-indigo-600" />
             <span className="text-slate-600">12 - 18 MAY</span>
             <ChevronRight size={14} className="cursor-pointer hover:text-indigo-600" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Global Physician Lookup */}
           <div className="relative group/search">
               <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder={isAr ? "ابحث عن الطبيب..." : "Quick Find Physician..."}
                 className="pr-10 pl-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-primary-200 outline-none w-64 shadow-inner"
                 value={doctorSearch}
                 onFocus={() => setShowDoctorDropdown(true)}
                 onChange={(e) => setDoctorSearch(e.target.value)}
                 onBlur={() => setTimeout(() => setShowDoctorDropdown(false), 200)}
               />
               
               {showDoctorDropdown && doctorSearch && (
                 <div className="absolute top-full mt-2 right-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[120] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden max-h-60 overflow-y-auto">
                    {filteredDoctors.map(doc => (
                      <button 
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setViewMode('doctorView');
                          setDoctorSearch("");
                        }}
                        className="w-full text-right p-3 hover:bg-primary-50 transition-colors border-b border-gray-50 flex items-center gap-3"
                      >
                         <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-black text-[10px]">
                            {(isAr ? doc.nameAr : doc.nameEn).charAt(0)}
                         </div>
                         <div className="flex-1 text-right">
                            <p className="text-xs font-black text-gray-800">{isAr ? doc.nameAr : doc.nameEn}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-tighter">{isAr ? doc.specialtyAr : doc.specialtyEn}</p>
                         </div>
                      </button>
                    ))}
                 </div>
               )}
           </div>

           <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-3 rounded-2xl transition-all relative ${isNotificationsOpen ? 'bg-primary-50 text-primary-600 shadow-inner' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                 <Bell size={20} className={pendingCount > 0 ? 'animate-swing' : ''} />
                 {pendingCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{pendingCount}</span>}
              </button>
           </div>
           
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100/50 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
           >
             <Plus size={16} />
             {isAr ? 'حجز موعد جديد' : 'Schedule New'}
           </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden relative">
        {/* Department Selection Sidebar */}
        <div className={`transition-all duration-500 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0 relative ${isNavCollapsed ? 'w-20' : 'w-72'}`}>
           <div className={`p-6 border-b border-gray-50 bg-gray-50/50 flex items-center ${isNavCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!isNavCollapsed && <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{isAr ? 'الأقسام' : 'Departments'}</h3>}
              <button onClick={() => setIsNavCollapsed(!isNavCollapsed)} className="p-1.5 hover:bg-indigo-50 text-indigo-500 rounded-xl transition-colors">
                {isNavCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {depts.map(dept => {
                   const isSelected = String(activeDeptId) === String(dept.id);
                   const deptDocs = doctors.filter(doc => String(doc.deptId) === String(dept.id) || doc.deptAr === dept.nameAr);
                   
                   return (
                      <div key={dept.id} className="space-y-1">
                         <button
                           onClick={() => { setActiveDeptId(dept.id); setViewMode('roster'); setSelectedRosterDay(getTodayNameAr()); }}
                           className={`w-full transition-all duration-300 group flex items-center gap-3 ${isNavCollapsed ? 'justify-center p-2 rounded-xl' : 'p-4 rounded-2xl'} ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' : 'bg-gray-50/50 text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'}`}
                         >
                            <div className={`transition-all duration-300 flex items-center justify-center font-black shrink-0 ${isNavCollapsed ? 'w-10 h-10 rounded-lg text-sm' : 'w-10 h-10 rounded-xl text-base'} ${isSelected ? 'bg-white/20 text-white' : 'bg-white shadow-sm text-indigo-600'}`}>
                               {dept.nameEn?.charAt(0)}
                            </div>
                            {!isNavCollapsed && (
                               <div className={isAr ? 'text-right' : 'text-left'}>
                                  <p className={`text-xs font-black ${isSelected ? 'text-white' : 'text-gray-800'}`}>{isAr ? dept.nameAr : dept.nameEn || 'N/A'}</p>
                                  <p className={`text-[8px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>{deptDocs.length} {isAr ? 'طبيب' : 'Doctors'}</p>
                               </div>
                            )}
                         </button>

                         {isSelected && !isNavCollapsed && deptDocs.length > 0 && (
                            <div className="mr-6 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                               {deptDocs.map(doc => (
                                  <button
                                     key={doc.id}
                                     onClick={() => { setSelectedDoctor(doc); setViewMode('doctorView'); }}
                                     className={`w-full text-right p-3 rounded-xl flex items-center gap-3 group/doc-item transition-all ${selectedDoctor?.id === doc.id ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                  >
                                     <div className={`w-1.5 h-1.5 rounded-full ${selectedDoctor?.id === doc.id ? 'bg-primary-500 scale-125' : 'bg-gray-300 group-hover/doc-item:bg-primary-400'}`} />
                                     <span className="text-[10px] font-black tracking-tight">{isAr ? doc.nameAr : doc.nameEn}</span>
                                  </button>
                               ))}
                            </div>
                         )}
                      </div>
                   );
               })}
           </div>
        </div>

        {/* Dynamic Center View: Roster or Individual Physician */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar pb-10 overflow-x-hidden">
            {viewMode === 'doctorView' && selectedDoctor ? (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-4">
                 <div className="p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-2xl shadow-indigo-200 transform group-hover:rotate-6 transition-all duration-500">
                          👨‍⚕️
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <h3 className="text-2xl font-black text-gray-900 tracking-tight">{isAr ? selectedDoctor.nameAr : selectedDoctor.nameEn}</h3>
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">{isAr ? 'نشط' : 'Active'}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">{isAr ? 'قائمة المرضى ليومنا هذا' : 'Daily Patient Registry'}</p>
                       </div>
                    </div>
                    <button onClick={() => { setViewMode('roster'); setSelectedDoctor(null); }} className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"><X size={20} /></button>
                 </div>
                 
                 <div className="bg-slate-50 border-b border-gray-100 flex flex-wrap gap-2 p-5">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest self-center ml-2 mr-4">{isAr ? 'أيام العمل:' : 'Working Days:'}</span>
                    {(selectedDoctor.day_shifts || []).map((shift: any, idx: number) => (
                       <div key={idx} className={`px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm border transition-transform hover:scale-105 ${
                          shift.type === 'morning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          shift.type === 'evening' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          'bg-white text-slate-600 border-slate-200'
                       }`}>
                          <span className="text-[10px] font-black">{shift.day}</span>
                          <span className="text-[9px] font-bold opacity-70">
                             ({isAr ? (shift.type === 'morning' ? 'صباحي' : shift.type === 'evening' ? 'مسائي' : 'ليلي') : shift.type} - {shift.work_hours || 8}h)
                          </span>
                       </div>
                    ))}
                    {(selectedDoctor.day_shifts || []).length === 0 && (
                       <span className="text-[10px] text-gray-400 font-bold mt-2">{isAr ? 'لم يتم إدراج جدول دوام مفصل' : 'No complex shifts defined'}</span>
                    )}
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                       <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                             <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'المريض' : 'Patient'}</th>
                             <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'رقم الهاتف' : 'Contact'}</th>
                             <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{isAr ? 'التوقيت' : 'Slot'}</th>
                             <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                           {(() => {
                               const docNameAr = selectedDoctor?.nameAr || '';
                               const docNameEn = selectedDoctor?.nameEn || '';
                               const docId = String(selectedDoctor?.id || '');
                               
                               // Filter appointments by exact doctor name (Ar or En) or doctor ID
                               let filteredAppts = appointments.filter(a => 
                                  a.doctor === docNameAr || 
                                  a.doctor === docNameEn || 
                                  String((a as any).doctorId) === docId || 
                                  String((a as any).doctor_id) === docId
                               );
                               
                               if (filteredAppts.length === 0 && selectedDoctor) {
                                  // Use name as a search criteria fallback too
                                  const namePart = (isAr ? docNameAr : docNameEn).split(' ').pop(); // e.g. "Yasser"
                                  filteredAppts = appointments.filter(a => (a.doctor || '').includes(namePart || ''));
                               }

                               if (filteredAppts.length === 0 && selectedDoctor) {
                                  filteredAppts = [
                                     { id: 991, patient: isAr ? 'مريض تجريبي 1' : 'Mock Patient 1', patientEn: 'Mock Patient 1', type: 'استشارة', typeEn: 'Consultation', dayIndex: 1, startHour: 10, duration: 1, color: 'bg-indigo-500', status: 'pending', doctor: isAr ? docNameAr : docNameEn, phone: '01122334455', followUpCount: 0 },
                                     { id: 992, patient: isAr ? 'مريض تجريبي 2' : 'Mock Patient 2', patientEn: 'Mock Patient 2', type: 'متابعة', typeEn: 'Follow-up', dayIndex: 1, startHour: 11, duration: 1, color: 'bg-emerald-500', status: 'confirmed', doctor: isAr ? docNameAr : docNameEn, phone: '01099887766', followUpCount: 1 }
                                  ];
                               }
                               return filteredAppts;
                           })().map((appt: any) => (
                             <tr key={appt.id} className="hover:bg-indigo-50/5 transition-colors group">
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-500 font-black shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                                         {(isAr ? appt.patient : appt.patientEn).charAt(0)}
                                      </div>
                                      <div>
                                         <p className="text-sm font-black text-gray-800">{isAr ? appt.patient : appt.patientEn}</p>
                                         <div className="flex items-center gap-2 mt-0.5">
                                             <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">{isAr ? 'زيارة جديدة' : 'New Visit'}</p>
                                             <div className="relative">
                                                <button 
                                                   className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-black underline decoration-dotted"
                                                   onClick={(e) => {
                                                      const btn = e.currentTarget.getBoundingClientRect();
                                                      // This is a simple logic for the request's searchable dropdown
                                                      setDoctorDropdownSearch(isAr ? selectedDoctor.nameAr : selectedDoctor.nameEn);
                                                      setIsDoctorSearchOpen(true);
                                                   }}
                                                >
                                                   {isAr ? selectedDoctor.nameAr : selectedDoctor.nameEn}
                                                   <ChevronRight size={10} className="transform rotate-90" />
                                                </button>
                                             </div>
                                          </div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-6 text-sm font-black text-slate-600 font-mono tracking-widest">{appt.phone || '0123456789'}</td>
                                <td className="px-10 py-6 text-center">
                                   <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-xs font-black shadow-sm">{formatHour(appt.startHour)}</span>
                                </td>
                                <td className="px-10 py-6">
                                   <div className="flex items-center justify-center gap-3">
                                      <button onClick={() => handleSendMessage(appt, 'active')} className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center justify-center"><CheckCircle2 size={18} /></button>
                                      <button onClick={() => handleSendMessage(appt, 'cancelled')} className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center"><XCircle size={18} /></button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                          {(() => {
                              const docNameAr = selectedDoctor?.nameAr || '';
                              const docNameEn = selectedDoctor?.nameEn || '';
                              const filteredAppts = appointments.filter(a => a.doctor === (isAr ? docNameAr : docNameEn) || a.doctor === docNameAr);
                              return (filteredAppts.length === 0 && !selectedDoctor); 
                           })() && (
                             <tr>
                                <td colSpan={4} className="py-24 text-center">
                                   <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} className="text-slate-300" /></div>
                                   <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? 'لا توجد مواعيد حالية لهذا الطبيب' : 'No clinical appointments for this physician'}</p>
                                </td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-right duration-500 relative">
                 <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-indigo-600 border border-indigo-50"><Users size={24} /></div>
                       <div>
                          <h3 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? `مناوبات قسم ${activeDept?.nameAr || '...'}` : `Weekly Roster: ${activeDept?.nameEn || '...'}`}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{isAr ? 'جدول توزيع الأطباء للأسبوع الحالي' : 'Physician Distribution Current Week'}</p>
                       </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-xs font-black text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                       <Download size={16} />
                       {isAr ? 'تصدير الجدول' : 'Export Table'}
                    </button>
                 </div>
                 
                 {/* Today's Shifts Summary Panel */}
                 <div className="bg-indigo-50/50 p-6 border-b border-indigo-100 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={16} /> 
                          {isAr ? `أطباء مناوبون يوم (${selectedRosterDay})` : `On-Duty on (${DAYS_FULL.find(d => d.labelAr === selectedRosterDay)?.labelEn || selectedRosterDay})`}
                       </h4>
                       <span className="text-[10px] font-bold text-indigo-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {todayStaff.length} {isAr ? 'طبيب' : 'Doctors'}
                       </span>
                    </div>
                    {todayStaff.length > 0 ? (
                       <div className="flex flex-wrap gap-3">
                          {todayStaff.map(doc => {
                             const shift = (doc.day_shifts || []).find((s:any) => s.day === selectedRosterDay || s.day === DAYS_FULL.find(d => d.labelAr === selectedRosterDay)?.labelEn);
                             return (
                                <div key={doc.id} onClick={() => { setSelectedDoctor(doc); setViewMode('doctorView'); }} className="cursor-pointer flex items-center gap-3 bg-white p-3 rounded-2xl border border-indigo-50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[14px] shadow-inner ${shift?.type === 'evening' || shift?.type === 'night' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-amber-100 text-amber-600'}`}>
                                      {shift?.type === 'evening' || shift?.type === 'night' ? '🌙' : '☀️'}
                                   </div>
                                   <div>
                                      <p className="text-xs font-black text-gray-800">{isAr ? doc.nameAr : doc.nameEn}</p>
                                      <p className="text-[9px] font-bold mt-0.5 uppercase tracking-wider text-slate-500">
                                         {isAr ? doc.specialtyAr : doc.specialtyEn} • <span className={shift?.type === 'evening' || shift?.type === 'night' ? 'text-indigo-600' : 'text-amber-600'}>{isAr ? (shift?.type === 'evening' ? 'مسائي' : 'صباحي') : shift?.type}</span> ({shift?.work_hours || 8}h)
                                      </p>
                                   </div>
                                </div>
                             )
                          })}
                       </div>
                    ) : (
                       <div className="p-4 rounded-xl bg-white border border-indigo-50 text-center text-[10px] font-bold text-indigo-400">
                          {isAr ? 'لا يوجد أطباء مناوبون في هذا القسم اليوم' : 'No doctors on duty today for this department'}
                       </div>
                    )}
                 </div>

                 <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                        <thead className="sticky top-0 z-30 bg-white">
                          <tr className="bg-white border-b border-gray-50 shadow-sm">
                             <th className="px-8 py-6 sticky right-0 bg-white z-20 text-[10px] font-black text-indigo-400 uppercase tracking-widest border-l border-gray-50">{isAr ? 'الطبيب' : 'Physician'}</th>
                             {DAYS_FULL.map(day => (
                               <th 
                                  key={day.key} 
                                  onClick={() => setSelectedRosterDay(day.labelAr)}
                                  className={`px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest border-x border-gray-50 cursor-pointer transition-colors ${selectedRosterDay === day.labelAr ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-slate-50 hover:text-indigo-400'}`}
                               >
                                  {isAr ? day.labelAr : day.labelEn}
                               </th>
                             ))}
                          </tr>
                        </thead>
                       <tbody className="divide-y divide-gray-50">
                          {deptDoctors.map(doc => (
                             <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedDoctor(doc); setViewMode('doctorView'); }}>
                                <td className="px-8 py-5 sticky right-0 bg-white group-hover:bg-indigo-50/50 z-10 border-l border-gray-50">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[11px] text-slate-500 shadow-inner group-hover:scale-110 transition-transform">
                                         {(isAr ? doc.nameAr : doc.nameEn).charAt(0)}
                                      </div>
                                      <div>
                                         <p className="text-xs font-black text-gray-800">{isAr ? doc.nameAr : doc.nameEn}</p>
                                         <p className="text-[9px] font-bold text-primary-500 uppercase tracking-tighter">{isAr ? doc.specialtyAr : doc.specialtyEn}</p>
                                      </div>
                                   </div>
                                </td>
                                {DAYS_FULL.map(day => {
                                   const dayName = isAr ? day.labelAr : day.key;
                                   const shift = (doc.day_shifts || []).find((s: any) => s.day === dayName || s.day === day.labelAr || s.day === day.labelEn);
                                   return (
                                     <td key={day.key} className="px-4 py-5 text-center border-x border-gray-50">
                                        {shift ? (
                                          <div className={`mx-auto w-fit px-3 py-1.5 rounded-xl border flex flex-col items-center gap-0.5 shadow-sm transition-all group-hover:scale-105 ${
                                            shift.type === 'morning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            shift.type === 'evening' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                            'bg-slate-50 text-slate-600 border-slate-100'
                                          }`}>
                                             <span className="text-[8px] font-black uppercase tracking-tighter">
                                                {isAr ? (shift.type === 'morning' ? 'صباحي' : shift.type === 'evening' ? 'مسائي' : 'ليل') : shift.type}
                                             </span>
                                             <span className="text-[7px] font-bold opacity-70 italic">{shift.work_hours}h</span>
                                          </div>
                                        ) : (
                                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-auto opacity-30"></div>
                                        )}
                                     </td>
                                   );
                                })}
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
        </div>

        {/* Improved Action Panel with Search Dropdown */}
        <div className="w-80 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8 flex flex-col overflow-hidden relative">
           <div className="space-y-4 shrink-0">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{isAr ? 'الأطباء النشطون' : 'Active Physicians'}</h3>
                  <div className="relative">
                     <button 
                       onClick={() => setShowSidebarSearch(!showSidebarSearch)}
                       className={`w-10 h-10 rounded-xl transition-all shadow-sm flex items-center justify-center ${showSidebarSearch ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                     >
                        <Search size={18} />
                     </button>
                  </div>
               </div>
               
               {showSidebarSearch && (
                  <div className="relative animate-in slide-in-from-top-4 duration-300 z-50">
                     <div className="relative">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                           autoFocus
                           type="text" 
                           placeholder={isAr ? "اكتب اسم الطبيب..." : "Type doctor name..."}
                           className="w-full pr-10 pl-4 py-3 bg-white border-2 border-indigo-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-xl shadow-indigo-100/50 text-right"
                           value={sidebarSearch}
                           onChange={(e) => setSidebarSearch(e.target.value)}
                        />
                     </div>
                     
                     <div className="absolute top-full mt-2 right-0 w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar z-[60]">
                        {sidebarFiltered.length > 0 ? sidebarFiltered.map(doc => (
                           <button
                              key={doc.id}
                              onClick={() => {
                                 setSelectedDoctor(doc);
                                 setViewMode('doctorView');
                                 setShowSidebarSearch(false);
                                 setSidebarSearch("");
                              }}
                              className="w-full p-4 hover:bg-indigo-50 flex items-center gap-3 transition-colors text-right border-b border-gray-50 last:border-0"
                           >
                              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-[11px] shadow-inner shrink-0">
                                 {(isAr ? doc.nameAr : doc.nameEn).charAt(0)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                 <p className="text-xs font-black text-gray-900 truncate">{isAr ? doc.nameAr : doc.nameEn}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">{isAr ? doc.specialtyAr : doc.specialtyEn}</p>
                              </div>
                           </button>
                        )) : (
                           <div className="p-8 text-center bg-gray-50">
                              <SearchCode size={32} className="mx-auto text-gray-200 mb-2" />
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'لا توجد نتائج' : 'No matches'}</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}
           </div>

           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
             {/* List removed per user request. Names should only appear via the search functionality. */}
           </div>
           
           <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 mt-auto flex flex-col shrink-0">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner"><Stethoscope size={24} /></div>
                 <div>
                    <h4 className="text-base font-black tracking-tight">{isAr ? 'المناوبات' : 'Shift Stats'}</h4>
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{isAr ? 'الأسبوع الحالي' : 'Current Week'}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold opacity-70">{isAr ? 'إجمالي الأطباء' : 'Total Docs'}</span>
                    <span className="text-xl font-black">{doctors.length}</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-2/3 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"></div>
                 </div>
                 <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
                    {isAr ? 'تحميل جدول المناوبات' : 'Download Roster'}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
          <div className={`relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6"><Calendar size={24} /></div>
                  <div>
                     <h3 className="text-xl font-black text-gray-800 tracking-tight">{isAr ? 'حجز موعد جديد' : 'New Appointment Request'}</h3>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'أدخل تفاصيل المريض والجدول الزمني' : 'Enter Patient & Schedule Particulars'}</p>
                  </div>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all"><X size={20} /></button>
            </div>

            <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
               <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">{isAr ? 'اسم المريض' : 'Patient Legal Name'}</label>
                     <div className="relative group">
                        <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input className="w-full pr-12 pl-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] text-xs font-black outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" placeholder={isAr ? "أحمد محمد..." : "John Doe..."} />
                     </div>
                  </div>
                  
                  <div className="relative">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">{isAr ? 'اختيار الطبيب' : 'Select Physician'}</label>
                     <div className="relative group">
                        <input 
                           className="w-full pr-12 pl-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] text-xs font-black outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" 
                           placeholder={isAr ? "ابحث عن الطبيب..." : "Physician Lookup..."}
                           value={doctorDropdownSearch}
                           onFocus={() => setIsDoctorSearchOpen(true)}
                           onChange={(e) => setDoctorDropdownSearch(e.target.value)}
                        />
                        <Stethoscope size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        
                        {isDoctorSearchOpen && (
                           <div className="absolute top-full mt-2 right-0 w-full bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-4 duration-300">
                              {doctors.filter(d => (isAr ? d.nameAr : d.nameEn).toLowerCase().includes(doctorDropdownSearch.toLowerCase())).map(doc => (
                                 <button 
                                    key={doc.id}
                                    type="button"
                                    onClick={() => {
                                       setDoctorDropdownSearch(isAr ? doc.nameAr : doc.nameEn);
                                       setIsDoctorSearchOpen(false);
                                    }}
                                    className="w-full p-4 hover:bg-indigo-50 flex items-center gap-3 transition-colors text-right border-b border-gray-50 last:border-0"
                                 >
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-[11px] shadow-inner shrink-0">
                                       {(isAr ? doc.nameAr : doc.nameEn).charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-gray-900">{isAr ? doc.nameAr : doc.nameEn}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{isAr ? doc.specialtyAr : doc.specialtyEn}</p>
                                    </div>
                                 </button>
                              ))}
                              {doctors.filter(d => (isAr ? d.nameAr : d.nameEn).toLowerCase().includes(doctorDropdownSearch.toLowerCase())).length === 0 && (
                                 <div className="p-8 text-center bg-gray-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'لا توجد نتائج' : 'No Physicians Found'}</p>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 px-1">{isAr ? 'التوقيت' : 'Time Slot'}</label>
                     <div className="relative group">
                        <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input type="time" className="w-full pr-12 pl-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] text-xs font-black outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" />
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 p-10 bg-gray-50 -mx-10 -mb-10 border-t border-gray-100">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white text-gray-500 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-100 transition-all">{isAr ? 'إلغاء' : 'Dismiss'}</button>
                  <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transform hover:scale-[1.02] active:scale-95 transition-all">{isAr ? 'تأكيد الحجز' : 'Finalize Appointment'}</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassignment / Global Doctor Search Overlay */}
      {isDoctorSearchOpen && !isAddModalOpen && (
         <div className="fixed inset-0 z-[150] bg-transparent" onClick={() => setIsDoctorSearchOpen(false)} />
      )}

      {/* Notifications Portal */}
      {messageToast && (
        <div className="fixed bottom-10 right-10 z-[300] animate-in slide-in-from-right duration-500">
           <div className={`p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 flex items-center gap-8 ${messageToast.textEn?.includes('reminder') || messageToast.textEn?.includes('confirmed') ? 'bg-emerald-600 border-emerald-500/50' : 'bg-rose-600 border-rose-500/50'} text-white`}>
              <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-4xl shadow-inner group relative">
                 <div className="absolute inset-0 bg-white/10 rounded-3xl animate-ping opacity-20"></div>
                 {messageToast.textEn?.includes('reminder') || messageToast.textEn?.includes('confirmed') ? '✅' : '❌'}
              </div>
              <div>
                 <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] mb-1">{isAr ? 'تم تنفيذ الإجراء بنجاح' : 'Action Processed Successfully'}</p>
                 <h4 className="text-sm font-black leading-tight max-w-xs">{isAr ? messageToast.textAr : messageToast.textEn}</h4>
              </div>
              <button 
                onClick={() => setMessageToast(null)}
                className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
              >
                <X size={20} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

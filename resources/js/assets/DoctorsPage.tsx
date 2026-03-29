import React, { useState, FC } from 'react';
import { 
  Plus, Check, X, Edit3, User, Stethoscope, Clock, Banknote, Search,
  ShieldCheck, Mail, Phone, Calendar, Bell, FileText, Printer, 
  PlusCircle, Trash2, Pill, Activity, History, XCircle, AlertCircle, CheckCircle2, AlertTriangle, RotateCw, Key, FlaskConical, TestTube, Microscope, HeartPulse, Users, LayoutGrid, Settings2, CalendarDays, Hash, Info, CreditCard, Building2, DollarSign, ClipboardList
} from 'lucide-react';

/* ───────── Types ───────── */
export interface DailyShift {
  day: string;
  type: string;
  work_hours: number;
}

export interface Doctor { 
  id: number; 
  nameAr: string; 
  nameEn: string; 
  specialtyAr: string; 
  specialtyEn: string; 
  deptAr: string; 
  deptEn: string; 
  status: 'active' | 'on_leave' | 'resigned'; 
  phone: string; 
  email: string; 
  consultation_fee: number; 
  medical_id: string; 
  work_hours: number; 
  working_days: string[]; 
  shifts?: string[];
  day_shifts?: DailyShift[]; 
  jobTitle?: string;
  jobTitleAr?: string;
  jobTitleEn?: string;
  national_id: string;
  license_number: string;
  practice_cert: string;
  user?: { username: string; email: string };
  staff_id?: string;
  shiftType?: string;
  bank_name?: string;
  bank_account?: string;
  hire_date?: string;
  salary?: number;
}


interface DoctorsPageProps {
  isAr: boolean;
  doctors: any[];
  specialties: any[];
  tx: any;
  setIsAddDoctorModalOpen: (open: boolean) => void;
  isAddDoctorModalOpen: boolean;
  newDoctor: any;
  setNewDoctor: (doc: any) => void;
  handleAddDoctor: (e: React.FormEvent) => void;
  depts?: any[];
  jobTitles?: any[];
  onDeleteDoctor?: (id: number) => void;
  onSendCredentials?: (id: number, password: string, message: string) => Promise<void>;
  hospitalName?: string;
  welcomeEmailTemplate?: string;
  supportEmail?: string;
  initialSearch?: string;
  onRefresh?: () => void;
  employees?: any[];
}

export const DoctorsPage: FC<DoctorsPageProps> = ({
  isAr, doctors, tx, setIsAddDoctorModalOpen, isAddDoctorModalOpen,
  newDoctor, setNewDoctor, handleAddDoctor, depts, specialties, onDeleteDoctor, onSendCredentials, 
  hospitalName = 'Al-Shifa Hospital', welcomeEmailTemplate = '', supportEmail = '', jobTitles, 
  initialSearch = '', onRefresh, employees = []
}) => {
  const [profileTab, setProfileTab] = useState<'appointments' | 'patients'>('appointments');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedProfileDoctor, setSelectedProfileDoctor] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filteredDoctors = doctors.filter(doc => {
    const searchLow = searchTerm.toLowerCase();
    return (
      (doc.nameAr || doc.name || '').toLowerCase().includes(searchLow) ||
      (doc.nameEn || doc.name || '').toLowerCase().includes(searchLow) ||
      (doc.specialtyAr || '').toLowerCase().includes(searchLow) ||
      (doc.medical_id || '').toLowerCase().includes(searchLow)
    );
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
          <div className="px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 bg-white text-primary-600 shadow-sm border border-indigo-50">
            <LayoutGrid size={14} />
            {isAr ? 'قائمة الأطباء' : 'Doctors Roster'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder={isAr ? 'بحث عن طبيب...' : 'Find physician...'}
              className="pr-10 pl-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none ring-4 ring-transparent focus:ring-primary-50 transition-all w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddDoctorModalOpen(true)} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-indigo-100/50 transform hover:scale-[1.02] active:scale-95">
            <PlusCircle size={16} />
            {isAr ? 'إضافة طبيب' : 'Register Doctor'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-cairo">
                  <th className="px-8 py-5 text-right">{isAr ? 'الطبيب' : 'Practitioner'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'التخصص' : 'Specialization'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'القسم' : 'Department'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in duration-500 font-cairo group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 font-black shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-105">
                          {(doc.nameEn || doc.name || 'D').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">{isAr ? doc.nameAr : (doc.nameEn || doc.name)}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{doc.medical_id || `Doc-${1000 + doc.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-slate-200 shadow-sm">{isAr ? doc.specialtyAr : doc.specialtyEn}</span>
                    </td>
                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{isAr ? doc.deptAr : doc.deptEn}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit border shadow-sm ${doc.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {doc.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Idle')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProfileDoctor(doc); setIsProfileModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'الملف الشخصي' : 'Profile'}
                          >
                            <Info size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && selectedProfileDoctor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
           <div className={`relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
              <div className="flex flex-col md:flex-row min-h-[600px]">
                 {/* Sidebar */}
                 <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-3xl bg-primary-600 text-white flex items-center justify-center text-5xl font-black shadow-xl mb-6 transform -rotate-3">
                       {(selectedProfileDoctor.nameEn || selectedProfileDoctor.name || 'D').charAt(0)}
                    </div>
                    <div className="text-center space-y-1 mb-8 w-full">
                       <h2 className="text-xl font-black text-slate-900 leading-tight truncate">{isAr ? selectedProfileDoctor.nameAr : selectedProfileDoctor.nameEn}</h2>
                       <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.2em]">{isAr ? selectedProfileDoctor.specialtyAr : selectedProfileDoctor.specialtyEn}</p>
                       <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold mt-2">
                          <Hash size={12} />
                          <span>{selectedProfileDoctor.medical_id || `Doc-${1000 + selectedProfileDoctor.id}`}</span>
                       </div>
                    </div>

                    <div className="w-full space-y-2 mt-auto">
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Mail size={14}/></div>
                          <div className="overflow-hidden text-right">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'البريد' : 'Email'}</p>
                             <p className="text-[10px] font-black text-slate-800 truncate">{selectedProfileDoctor.email || 'N/A'}</p>
                          </div>
                       </div>
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone size={14}/></div>
                          <div className="text-right">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الهاتف' : 'Phone'}</p>
                             <p className="text-[10px] font-black text-slate-800">{selectedProfileDoctor.phone || 'N/A'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Main Content */}
                 <div className="flex-1 flex flex-col">
                    <div className="p-8 pb-0 flex items-center justify-between">
                       <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
                          <button onClick={() => setProfileTab('appointments')} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${profileTab === 'appointments' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                             {isAr ? 'المواعيد' : 'APPOINTMENTS'}
                          </button>
                          <button onClick={() => setProfileTab('patients')} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${profileTab === 'patients' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                             {isAr ? 'المرضى' : 'PATIENTS'}
                          </button>
                       </div>
                       <button onClick={() => setIsProfileModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all flex items-center justify-center"><X size={20}/></button>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                       {profileTab === 'appointments' && (
                          <div className="space-y-6 animate-in fade-in duration-300">
                             <div className="flex items-center justify-between">
                                <div>
                                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? 'جدول المواعيد اليومي' : 'Daily Appointment Log'}</h3>
                                   <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'قائمة المراجعات والانتظار' : 'List of patients in queue'}</p>
                                </div>
                             </div>

                             <div className="bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden shadow-inner">
                                <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                                   <thead>
                                      <tr className="bg-slate-100/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                         <th className="px-6 py-4">{isAr ? 'الوقت' : 'Time'}</th>
                                         <th className="px-6 py-4">{isAr ? 'المريض' : 'Patient'}</th>
                                         <th className="px-6 py-4">{isAr ? 'الحالة' : 'Status'}</th>
                                      </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-100">
                                      {(selectedProfileDoctor.appointments || []).map((app: any) => (
                                         <tr key={app.id} className="text-[11px] font-bold text-slate-600 hover:bg-white transition-colors">
                                            <td className="px-6 py-4 font-mono">{app.appointment_time}</td>
                                            <td className="px-6 py-4 text-slate-800">{isAr ? app.patient?.nameAr : app.patient?.nameEn || app.patient?.name}</td>
                                            <td className="px-6 py-4">
                                               <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-black ${app.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                  {isAr ? (app.status === 'completed' ? 'مكتمل' : 'انتظار') : app.status}
                                               </span>
                                            </td>
                                         </tr>
                                      ))}
                                      {(selectedProfileDoctor.appointments || []).length === 0 && (
                                         <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-300 font-bold uppercase tracking-widest">{isAr ? 'لا توجد مواعيد حالية' : 'No Current Appointments'}</td>
                                         </tr>
                                      )}
                                   </tbody>
                                </table>
                             </div>
                          </div>
                       )}


                       {profileTab === 'patients' && (
                          <div className="space-y-6 animate-in fade-in duration-300">
                             <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? 'سجل المرضى' : 'Patient Historical Log'}</h3>
                                <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'المرضى الذين تمت معاينتهم' : 'Archive of treated subjects'}</p>
                             </div>

                             <div className="space-y-3">
                                {(selectedProfileDoctor.appointments || [])
                                   .filter((a: any, i: number, self: any[]) => a.patient_id && self.findIndex(t => t.patient_id === a.patient_id) === i)
                                   .map((app: any) => (
                                   <div key={app.patient_id} className="p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black">
                                            {(app.patient?.nameAr || app.patient?.nameEn || app.patient?.name || 'P').charAt(0)}
                                         </div>
                                         <div>
                                            <p className="text-[11px] font-black text-slate-800">{isAr ? app.patient?.nameAr : app.patient?.nameEn || app.patient?.name}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{app.patient?.fileNumber}</p>
                                         </div>
                                      </div>
                                      <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                         <FileText size={14}/>
                                         {isAr ? 'عرض السجل الطبي' : 'Medical Record'}
                                      </button>
                                   </div>
                                ))}
                                {(selectedProfileDoctor.appointments || []).filter((a:any)=>a.patient_id).length === 0 && (
                                   <div className="py-12 text-center text-slate-300 font-bold uppercase tracking-widest">{isAr ? 'لا يوجد مرضى مسجلين' : 'No Patients Recorded'}</div>
                                )}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div onClick={() => setIsAddDoctorModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
          <div className={`relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-6"><Stethoscope size={20} /></div>
                <h3 className="text-xl font-black text-gray-800">{isAr ? 'تسجيل بيانات الطبيب' : 'Register Physician Data'}</h3>
              </div>
              <button onClick={() => setIsAddDoctorModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddDoctor} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">

                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4 border-b border-indigo-50 pb-2"><Info size={14}/> {isAr ? 'المعلومات المهنية' : 'Professional Dossier'}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الاسم الكامل' : 'Legal Full Name'}</label>
                      <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newDoctor.nameAr} onChange={(e) => setNewDoctor({ ...newDoctor, nameAr: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'البريد الإلكتروني' : 'Work Email'}</label>
                        <input type="email" className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'رقم الهاتف' : 'Contact Number'}</label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'التخصص' : 'Medical Specialty'}</label>
                        <select className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner appearance-none" value={newDoctor.specialtyAr} onChange={(e) => setNewDoctor({ ...newDoctor, specialtyAr: e.target.value })} required>
                          <option value="">{isAr ? 'اختر التخصص...' : 'Select Specialty...'}</option>
                          {specialties.map(s => <option key={s.id} value={s.nameAr}>{isAr ? s.nameAr : s.nameEn}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'القسم' : 'Assigned Dept'}</label>
                        <select className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner appearance-none" value={newDoctor.deptId || ''} onChange={(e) => setNewDoctor({ ...newDoctor, deptId: e.target.value })} required>
                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                          {depts?.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1 flex items-center justify-between">
                          <span>{isAr ? 'الرقم الطبي (يتم توليده تلقائياً)' : 'Medical ID (Auto-Generated)'}</span>
                        </label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newDoctor.medical_id || ''} onChange={(e) => setNewDoctor({ ...newDoctor, medical_id: e.target.value })} placeholder={isAr ? "اتركه فارغاً للتوليد التلقائي (مثال: Doc-1001)" : "Leave blank to auto-generate (e.g. Doc-1001)"} />
                      </div>
                    </div>
                  </div>
                </div>

                </div>

                <div className="flex justify-end gap-3 mt-12 bg-gray-50 -mx-8 -mb-8 p-10 border-t border-gray-100">
                  <button type="button" onClick={() => setIsAddDoctorModalOpen(false)} className="px-8 py-3 bg-white text-gray-500 rounded-2xl text-xs font-black border border-gray-200 hover:bg-gray-100 transition-all active:scale-95">{isAr ? 'إلغاء' : 'Dismiss'}</button>
                  <button type="submit" className="px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-primary-100 transition-all transform hover:scale-[1.05] active:scale-95">{isAr ? 'حفظ بيانات الطبيب' : 'Save Physician Data'}</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

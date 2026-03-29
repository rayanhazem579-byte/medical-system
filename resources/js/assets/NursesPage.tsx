import React, { useState, FC } from 'react';
import { 
  Plus, X, Edit3, User, Clock, Search,
  Mail, Phone, Calendar, Trash2, Activity, Info, CreditCard, Building2, ClipboardList, LayoutGrid, Users, Stethoscope, Hash, DollarSign
} from 'lucide-react';

/* ───────── Types ───────── */
export interface DailyShift {
  day: string;
  type: string;
  work_hours: number;
}

export interface Nurse { 
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
  medical_id: string; 
  work_hours: number; 
  working_days: string[]; 
  shifts?: string[];
  day_shifts?: DailyShift[]; 
  job_title?: string;
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


const DAYS_SHORT = [
  { key: 'Monday', labelAr: 'الإثنين', labelEn: 'Mon' },
  { key: 'Tuesday', labelAr: 'الثلاثاء', labelEn: 'Tue' },
  { key: 'Wednesday', labelAr: 'الأربعاء', labelEn: 'Wed' },
  { key: 'Thursday', labelAr: 'الخميس', labelEn: 'Thu' },
  { key: 'Friday', labelAr: 'الجمعة', labelEn: 'Fri' },
  { key: 'Saturday', labelAr: 'السبت', labelEn: 'Sat' },
  { key: 'Sunday', labelAr: 'الأحد', labelEn: 'Sun' }
];

const SHIFT_TYPES = [
  { id: 'morning', labelAr: 'صباحي', icon: <Clock size={12} />, color: 'bg-sky-50 text-sky-600' },
  { id: 'evening', labelAr: 'مسائي', icon: <Activity size={12} />, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'night', labelAr: 'ليلي', icon: <Activity size={12} />, color: 'bg-violet-50 text-violet-600' }
];

interface NursesPageProps {
  isAr: boolean;
  nurses: any[];
  tx: any;
  setIsAddNurseModalOpen: (open: boolean) => void;
  isAddNurseModalOpen: boolean;
  newNurse: any;
  setNewNurse: (nurse: any) => void;
  handleAddNurse: (e: React.FormEvent) => void;
  depts?: any[];
  jobTitles?: any[];
  onDeleteNurse?: (id: number) => void;
  onSendCredentials?: (id: number, password: string, message: string) => Promise<void>;
  hospitalName?: string;
  initialSearch?: string;
  onRefresh?: () => void;
  employees?: any[];
  doctors?: any[];
}

export const NursesPage: FC<NursesPageProps> = ({
  isAr, nurses, tx, setIsAddNurseModalOpen, isAddNurseModalOpen,
  newNurse, setNewNurse, handleAddNurse, depts, onDeleteNurse, onSendCredentials, 
  hospitalName = 'Al-Shifa Hospital', initialSearch = '', onRefresh, employees = [], doctors = []
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedProfileNurse, setSelectedProfileNurse] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filteredNurses = nurses.filter(nurse => {
    const searchLow = searchTerm.toLowerCase();
    return (
      (nurse.nameAr || nurse.name || '').toLowerCase().includes(searchLow) ||
      (nurse.medical_id || '').toLowerCase().includes(searchLow)
    );
  });


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
          <div className="px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 bg-white text-indigo-600 shadow-sm border border-indigo-50">
            <LayoutGrid size={14} />
            {isAr ? 'قائمة الممرضين' : 'Nurses Roster'}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={isAr ? 'بحث عن ممرض...' : 'Find nurse...'}
              className="pr-10 pl-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none ring-4 ring-transparent focus:ring-indigo-50 transition-all w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddNurseModalOpen(true)} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-primary-100/50 transform hover:scale-[1.02] active:scale-95">
            <Plus size={16} />
            {isAr ? 'إضافة ممرض' : 'Add Nurse'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-cairo">
                  <th className="px-8 py-5 text-right">{isAr ? 'الممرض' : 'Nurse'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'القسم' : 'Department'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'المستوى' : 'Title'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredNurses.map((nurse) => (
                  <tr key={nurse.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in duration-500 font-cairo group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 font-black shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-105">
                          {(nurse.nameEn || nurse.name || 'N').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">{isAr ? nurse.nameAr : nurse.nameEn}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{nurse.medical_id || `Nur-${1000 + nurse.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{isAr ? nurse.deptAr : nurse.deptEn}</td>
                    <td className="px-8 py-5 text-center px-1">
                       <span className="text-[10px] font-black text-indigo-600">{nurse.job_title || (isAr ? 'ممرض' : 'Nurse')}</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit border shadow-sm ${nurse.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${nurse.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {nurse.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Idle')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProfileNurse(nurse); setIsProfileModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'الملف الشخصي' : 'Profile'}
                          >
                            <Info size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setNewNurse(nurse); setIsAddNurseModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'تعديل' : 'Edit'}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteNurse?.(nurse.id); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'حذف' : 'Delete'}
                          >
                            <Trash2 size={16} />
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
      {isProfileModalOpen && selectedProfileNurse && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
           <div className={`relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
              <div className="flex flex-col md:flex-row min-h-[500px]">
                 {/* Sidebar */}
                 <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-3xl bg-primary-600 text-white flex items-center justify-center text-5xl font-black shadow-xl mb-6 transform -rotate-3">
                       {(selectedProfileNurse.nameEn || selectedProfileNurse.name || 'N').charAt(0)}
                    </div>
                    <div className="text-center space-y-1 mb-8 w-full">
                       <h2 className="text-xl font-black text-slate-900 leading-tight truncate">{isAr ? selectedProfileNurse.nameAr : selectedProfileNurse.nameEn}</h2>
                       <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.2em]">{isAr ? (selectedProfileNurse.job_title || 'خدمات التمريض') : (selectedProfileNurse.job_title || 'Nursing Services')}</p>
                       <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold mt-2">
                          <Hash size={12} />
                          <span>{selectedProfileNurse.medical_id || `Nur-${1000 + selectedProfileNurse.id}`}</span>
                       </div>
                    </div>

                    <div className="w-full space-y-3">
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Mail size={14}/></div>
                          <div className="overflow-hidden">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'البريد' : 'Email'}</p>
                             <p className="text-[10px] font-black text-slate-800 truncate">{selectedProfileNurse.email || 'N/A'}</p>
                          </div>
                       </div>
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone size={14}/></div>
                          <div>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الهاتف' : 'Phone'}</p>
                             <p className="text-[10px] font-black text-slate-800">{selectedProfileNurse.phone || 'N/A'}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Main Content */}
                 <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><ClipboardList size={16}/></div>
                          <div>
                             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? 'بيانات التعيين' : 'Employment Dossier'}</h3>
                             <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'معلومات القسم والرواتب' : 'Departmental & Salary Details'}</p>
                          </div>
                       </div>
                       <button onClick={() => setIsProfileModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all shadow-sm"><X size={20}/></button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-2 text-slate-400 mb-1 uppercase tracking-widest font-black text-[9px]"><Building2 size={12}/> {isAr ? 'القسم' : 'Department'}</div>
                          <p className="text-xs font-black text-slate-800">{isAr ? selectedProfileNurse.deptAr : selectedProfileNurse.deptEn}</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
                          <div className="flex items-center gap-2 text-emerald-600/60 mb-1 uppercase tracking-widest font-black text-[9px]"><DollarSign size={12}/> {isAr ? 'الراتب' : 'Salary'}</div>
                          <p className="text-xs font-black text-emerald-600 font-mono tracking-widest">{(parseFloat(selectedProfileNurse.salary) || 0).toLocaleString()} $</p>
                       </div>
                    </div>

                    <div className="flex-1">
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Clock size={12}/> {isAr ? 'جدول المناوبات' : 'Shift Schedule'}</h4>
                       <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {DAYS_SHORT.map(day => {
                             const shift = (selectedProfileNurse.day_shifts || []).find((s: any) => s.day === day.key || s.day === day.labelAr);
                             return (
                                <div key={day.key} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all border shadow-sm ${shift ? 'bg-white border-primary-500 scale-105' : 'bg-slate-50/50 border-slate-100 opacity-40'}`}>
                                   <span className="text-[8px] font-black text-slate-400 uppercase">{isAr ? day.labelAr : day.labelEn}</span>
                                   {shift ? (
                                      <>
                                         <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${SHIFT_TYPES.find(t=>t.id===shift.type)?.color || 'bg-slate-100 text-slate-600'}`}>
                                            {SHIFT_TYPES.find(t=>t.id===shift.type)?.icon}
                                         </div>
                                         <span className="text-[8px] font-black text-indigo-600 font-mono">{shift.work_hours}h</span>
                                      </>
                                   ) : (
                                      <div className="w-6 h-6 rounded-lg bg-slate-100/50 border border-dashed border-slate-200" />
                                   )}
                                </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px]">
                       <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
                          <Calendar size={12} />
                          {isAr ? 'تاريخ التعيين:' : 'Joined On:'}
                          <span className="text-slate-800">{selectedProfileNurse.hire_date || '2024-01-01'}</span>
                       </div>
                       <div className={`px-3 py-1 rounded-full font-black uppercase tracking-widest border shadow-sm ${selectedProfileNurse.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                          {selectedProfileNurse.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Idle')}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddNurseModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div onClick={() => setIsAddNurseModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
          <div className={`relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-6"><Users size={20} /></div>
                <h3 className="text-xl font-black text-gray-800">{newNurse.id ? (isAr ? 'تعديل بيانات الممرض' : 'Edit Nurse Details') : (isAr ? 'إضافة ممرض جديد' : 'Onboard New Nurse')}</h3>
              </div>
              <button onClick={() => setIsAddNurseModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddNurse} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <div className="p-4 bg-primary-50 rounded-2xl border-2 border-dashed border-primary-100 mb-6">
                    <label className="text-[10px] font-black text-primary-600 uppercase tracking-widest block mb-2 px-1 flex items-center gap-2">
                      <Users size={14} />
                      {isAr ? 'استيراد من قائمة الموظفين' : 'Import from Staff Roster'}
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-primary-100 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary-50 transition-all appearance-none"
                      onChange={(e) => {
                        const empId = e.target.value;
                        const emp = employees.find(ev => String(ev.id) === String(empId));
                        if (emp) {
                          setNewNurse({
                            ...newNurse,
                            nameAr: emp.nameAr || emp.name,
                            email: emp.email,
                            phone: emp.phone,
                            deptId: emp.department_id || emp.deptId,
                            jobTitleAr: emp.positionAr,
                            day_shifts: emp.day_shifts || []
                          });
                        }
                      }}
                    >
                      <option value="">{isAr ? 'اختر موظفاً للمتابعة...' : 'Select personnel to onboard...'}</option>
                      {employees.filter(e => !nurses.some(d => d.id === e.id)).map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {isAr ? emp.nameAr : emp.nameEn || emp.name} ({isAr ? emp.positionAr : emp.positionEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4 border-b border-indigo-50 pb-2"><Info size={14}/> {isAr ? 'المعلومات المهنية' : 'Staff Profile'}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                      <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newNurse.nameAr} onChange={(e) => setNewNurse({ ...newNurse, nameAr: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                        <input type="email" className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newNurse.email} onChange={(e) => setNewNurse({ ...newNurse, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newNurse.phone} onChange={(e) => setNewNurse({ ...newNurse, phone: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-1">{isAr ? 'القسم' : 'Dept'}</label>
                        <select className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newNurse.deptId || ''} onChange={(e) => setNewNurse({ ...newNurse, deptId: e.target.value })} required>
                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                          {depts?.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 px-1 flex items-center justify-between">
                          <span>{isAr ? 'الرقم الوظيفي (يتم توليده تلقائياً)' : 'Nurse ID (Auto-Generated)'}</span>
                        </label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner" value={newNurse.medical_id || ''} onChange={(e) => setNewNurse({ ...newNurse, medical_id: e.target.value })} placeholder={isAr ? "اتركه فارغاً للتوليد التلقائي (مثال: Nur-1001)" : "Leave blank to auto-generate (e.g. Nur-1001)"} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-3 mt-12 bg-gray-50 -mx-8 -mb-8 p-10 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddNurseModalOpen(false)} className="px-8 py-3 bg-white text-gray-500 rounded-2xl text-xs font-black border border-gray-200"> {isAr ? 'إلغاء' : 'Cancel'} </button>
                <button type="submit" className="px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black shadow-lg"> {newNurse.id ? (isAr ? 'حفظ' : 'Save') : (isAr ? 'اعتماد' : 'Onboard')} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

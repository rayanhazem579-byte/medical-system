import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, Edit3, Trash2, Key, CheckCircle2, 
  XCircle, Filter, ChevronLeft, ChevronRight, MoreVertical,
  Briefcase, Mail, Phone, Calendar, DollarSign, Building2,
  Clock, Hash, GraduationCap, Award, Ban, MapPin, CreditCard,
  User, LayoutGrid, ClipboardList, Info, X
} from 'lucide-react';

interface EmployeesPageProps {
  isAr: boolean;
  employees: any[];
  tx: any;
  isAddEmployeeModalOpen: boolean;
  setIsAddEmployeeModalOpen: (v: boolean) => void;
  newEmployee: any;
  setNewEmployee: (v: any) => void;
  handleAddEmployee: (e: React.FormEvent) => void;
  depts: any[];
  jobTitles: any[];
  onDeleteEmployee?: (id: number) => void;
  onSendCredentials?: (id: number, password: string, message?: string) => void;
  hospitalName?: string;
  welcomeEmailTemplate?: string;
  supportEmail?: string;
}

const DAYS_SHORT = [
  { labelAr: "سبت", labelEn: "Sat", key: 'Sat' },
  { labelAr: "أحد", labelEn: "Sun", key: 'Sun' },
  { labelAr: "اثنين", labelEn: "Mon", key: 'Mon' },
  { labelAr: "ثلاثاء", labelEn: "Tue", key: 'Tue' },
  { labelAr: "أربعاء", labelEn: "Wed", key: 'Wed' },
  { labelAr: "خميس", labelEn: "Thu", key: 'Thu' },
  { labelAr: "جمعة", labelEn: "Fri", key: 'Fri' },
];

const SHIFT_TYPES = [
  { id: 'morning', labelAr: 'صباحي', labelEn: 'Morning', icon: '☀️', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { id: 'evening', labelAr: 'مسائي', labelEn: 'Evening', icon: '🌙', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: '24h', labelAr: '24 ساعة', labelEn: '24 Hours', icon: '⚡', color: 'bg-slate-50 text-slate-600 border-slate-100' }
];

const WORK_HOURS = [6, 8, 10, 12, 24];

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ 
  isAr, employees, tx, isAddEmployeeModalOpen, setIsAddEmployeeModalOpen, 
  newEmployee, setNewEmployee, handleAddEmployee, depts, jobTitles,
  onDeleteEmployee, onSendCredentials, hospitalName, welcomeEmailTemplate, supportEmail
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'schedule'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    (emp.nameAr || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.positionAr || emp.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDay = (day: string) => {
    const currentDays = newEmployee.day_shifts || [];
    const exists = currentDays.find((d: any) => d.day === day);
    if (exists) {
      setNewEmployee({ ...newEmployee, day_shifts: currentDays.filter((d: any) => d.day !== day) });
    } else {
      setNewEmployee({ ...newEmployee, day_shifts: [...currentDays, { day, type: 'morning', work_hours: 8 }] });
    }
  };

  const updateDayShift = (day: string, field: 'type' | 'work_hours', value: any) => {
    const updated = (newEmployee.day_shifts || []).map((d: any) => 
      d.day === day ? { ...d, [field]: value } : d
    );
    setNewEmployee({ ...newEmployee, day_shifts: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
          <button onClick={() => setActiveTab('roster')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'roster' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutGrid size={14} />
            {isAr ? 'قائمة الموظفين' : 'Staff Roster'}
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}>
            <ClipboardList size={14} />
            {isAr ? 'جدول المناوبات' : 'Weekly Schedule'}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder={isAr ? 'بحث عن موظف...' : 'Find personnel...'}
              className="pr-10 pl-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none ring-4 ring-transparent focus:ring-indigo-50 transition-all w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddEmployeeModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-indigo-100/50 transform hover:scale-[1.02] active:scale-95">
            <UserPlus size={16} />
            {isAr ? 'إضافة موظف' : 'Add Employee'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="overflow-x-auto custom-scrollbar">
          {activeTab === 'roster' ? (
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-cairo">
                  <th className="px-8 py-5 text-right">{isAr ? 'الموظف' : 'Staff Member'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'المسمى الوظيفي' : 'Position'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'القسم' : 'Department'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'تاريخ التعيين' : 'Hire Date'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in duration-500 font-cairo group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary-600 font-black shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-105">
                          {(emp.nameAr || emp.name || 'E').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 leading-tight">{isAr ? emp.nameAr : emp.nameEn || emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{emp.staff_id || `EMP-${emp.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-slate-200 shadow-sm">{isAr ? emp.positionAr : emp.positionEn || emp.role}</span>
                    </td>
                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-600">{isAr ? emp.deptAr : emp.deptEn}</td>
                    <td className="px-8 py-5 text-center text-xs font-black text-slate-500 font-mono tracking-widest">{emp.joinDate || emp.hire_date || '2024-01-01'}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit border shadow-sm ${emp.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {emp.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Idle')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProfileEmployee(emp); setIsProfileModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'الملف الشخصي' : 'Profile'}
                          >
                            <Info size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setNewEmployee(emp); setIsAddEmployeeModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'تعديل' : 'Edit'}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteEmployee?.(emp.id); }}
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
          ) : (
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50/50 border-b border-gray-100 font-cairo">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5 text-right">{isAr ? 'الموظف' : 'Staff'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'المنصب' : 'Position'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'أيام المناوبة' : 'Shift Days'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'نوع المناوبة' : 'Shift Type'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'عدد الساعات' : 'Work Hours'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-800">{isAr ? emp.nameAr : emp.nameEn || emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.staff_id || `ID: ${emp.id}`}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="px-3 py-1 bg-white border border-gray-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm">{isAr ? emp.positionAr : emp.positionEn || emp.role}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {emp.day_shifts && Array.isArray(emp.day_shifts) ? emp.day_shifts.map((s: any) => (
                          <span key={s.day} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[8px] font-black border border-indigo-100">{s.day}</span>
                        )) : (isAr ? 'لا يوجد' : 'None')}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex flex-col gap-1 items-center">
                        {emp.day_shifts && Array.isArray(emp.day_shifts) && emp.day_shifts.map((s: any) => (
                           <span key={s.day} className={`px-2 py-0.5 rounded text-[8px] font-black border uppercase ${
                              s.type === 'morning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              s.type === 'evening' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                              'bg-slate-50 text-slate-600 border-slate-100'
                           }`}>
                              {isAr ? (s.type === 'morning' ? 'صباحي' : s.type === 'evening' ? 'مسائي' : 'ليل') : s.type}
                           </span>
                        ))}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex flex-col gap-1 items-center">
                        {emp.day_shifts && Array.isArray(emp.day_shifts) && emp.day_shifts.map((s: any) => (
                           <span key={s.day} className="text-[10px] font-black text-slate-600 font-mono tracking-widest">{s.work_hours}h</span>
                        ))}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedProfileEmployee(emp); setIsProfileModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                            title={isAr ? 'الملف الشخصي' : 'Profile'}
                          >
                            <Info size={16} />
                          </button>
                          <button 
                            onClick={() => { setNewEmployee(emp); setIsAddEmployeeModalOpen(true); }}
                            className="w-10 h-10 rounded-xl bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center"
                          >
                            <Edit3 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && selectedProfileEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
           <div className={`relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary-600 to-indigo-800" />
              
              <div className="relative p-10 pt-20">
                 <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-2xl backdrop-blur-md flex items-center justify-center transition-all shadow-sm">
                    <X size={24} />
                 </button>

                 <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-48 h-48 rounded-[3rem] bg-white shadow-2xl border-8 border-white flex items-center justify-center text-7xl text-primary-600 font-black shrink-0 transform -rotate-3">
                       {(selectedProfileEmployee.nameAr || selectedProfileEmployee.name || 'E').charAt(0)}
                    </div>
                    
                    <div className="flex-1 space-y-6">
                       <div className="space-y-1">
                          <h2 className="text-4xl font-black text-slate-900 leading-tight">{isAr ? selectedProfileEmployee.nameAr : selectedProfileEmployee.nameEn || selectedProfileEmployee.name}</h2>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                             <span className="px-4 py-1.5 bg-primary-100 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest">{isAr ? selectedProfileEmployee.positionAr : selectedProfileEmployee.positionEn || selectedProfileEmployee.role}</span>
                             <span className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest uppercase"><Hash size={14} /> {selectedProfileEmployee.staff_id || `EMP-${selectedProfileEmployee.id}`}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                             <div className="flex items-center gap-3 text-slate-400 mb-2 uppercase tracking-[0.2em] font-black text-[9px]"><Building2 size={12}/> {isAr ? 'القسم' : 'Department'}</div>
                             <p className="text-sm font-black text-slate-800">{isAr ? selectedProfileEmployee.deptAr : selectedProfileEmployee.deptEn}</p>
                          </div>
                          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                             <div className="flex items-center gap-3 text-slate-400 mb-2 uppercase tracking-[0.2em] font-black text-[9px]"><DollarSign size={12}/> {isAr ? 'الراتب' : 'Basic Salary'}</div>
                             <p className="text-sm font-black text-emerald-600 font-mono tracking-widest">{parseFloat(selectedProfileEmployee.salary).toLocaleString() || '0.00'} $</p>
                          </div>
                          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                             <div className="flex items-center gap-3 text-slate-400 mb-2 uppercase tracking-[0.2em] font-black text-[9px]"><Calendar size={12}/> {isAr ? 'تاريخ التعيين' : 'Joining Date'}</div>
                             <p className="text-sm font-black text-slate-800 font-mono tracking-widest">{selectedProfileEmployee.joinDate || selectedProfileEmployee.hire_date || '2024-01-01'}</p>
                          </div>
                       </div>

                       <div className="p-8 rounded-[3rem] bg-indigo-50/50 border-2 border-dashed border-indigo-100">
                          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Clock size={14}/> {isAr ? 'جدول المناوبات الأسبوعي' : 'Weekly Roster Distribution'}</h4>
                          <div className="grid grid-cols-4 md:grid-cols-7 gap-4 text-center">
                             {DAYS_SHORT.map(day => {
                                const shift = (selectedProfileEmployee.day_shifts || []).find((s: any) => s.day === day.key || s.day === day.labelAr);
                                return (
                                  <div key={day.key} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all shadow-sm ${shift ? 'bg-white border-2 border-indigo-500 scale-105' : 'bg-slate-50/50 grayscale opacity-40'}`}>
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? day.labelAr : day.labelEn}</span>
                                     {shift ? (
                                        <>
                                           <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-sm ${SHIFT_TYPES.find(t=>t.id===shift.type)?.color || 'bg-slate-100 text-slate-600'}`}>
                                              {SHIFT_TYPES.find(t=>t.id===shift.type)?.icon}
                                           </div>
                                           <span className="text-[8px] font-black text-indigo-600 font-mono tracking-tighter">{shift.work_hours}h</span>
                                        </>
                                     ) : (
                                        <div className="w-8 h-8 rounded-xl bg-slate-100/50 border border-dashed border-slate-200" />
                                     )}
                                  </div>
                                );
                             })}
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-8 items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Mail size={20}/></div>
                             <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'البريد الإلكتروني' : 'Mail ID'}</p>
                                <p className="text-xs font-black text-slate-800">{selectedProfileEmployee.email || 'N/A'}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Phone size={20}/></div>
                             <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'رقم الهاتف' : 'Contact Number'}</p>
                                <p className="text-xs font-black text-slate-800 font-mono tracking-widest">{selectedProfileEmployee.phone || 'N/A'}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><CreditCard size={20}/></div>
                             <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'بيانات البنك' : 'Banking Info'}</p>
                                <p className="text-xs font-black text-slate-800 truncate max-w-[150px]">{selectedProfileEmployee.bankName || 'N/A'} - {selectedProfileEmployee.bankAccount || 'N/A'}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddEmployeeModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
          <div className={`relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-6"><Edit3 size={20} /></div>
                <h3 className="text-xl font-black text-gray-800">{newEmployee.id ? (isAr ? 'تعديل موظف' : 'Edit Employee') : (isAr ? 'إضافة موظف جديد' : 'New Employee Onboarding')}</h3>
              </div>
              <button onClick={() => setIsAddEmployeeModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4 border-b border-indigo-50 pb-2"><Info size={14}/> {isAr ? 'المعلومات الأساسية' : 'Personal Fundamentals'}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الاسم الكامل' : 'Full Professional Name'}</label>
                      <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.nameAr} onChange={(e) => setNewEmployee({ ...newEmployee, nameAr: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'البريد الإلكتروني' : 'Work Email'}</label>
                        <input type="email" className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'رقم الهاتف' : 'Contact Number'}</label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'القسم' : 'Assigned Dept'}</label>
                        <select className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none" value={newEmployee.deptId || ''} onChange={(e) => setNewEmployee({ ...newEmployee, deptId: e.target.value })} required>
                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                          {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'المسمى الوظيفي' : 'Official Designation'}</label>
                        <select className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none" value={newEmployee.positionAr} onChange={(e) => setNewEmployee({ ...newEmployee, positionAr: e.target.value })}>
                           <option value="">{isAr ? 'اختر مسمى وظيفي...' : 'Select Title...'}</option>
                           {jobTitles.map((jt, idx) => <option key={idx} value={isAr ? jt.titleAr : jt.titleEn}>{isAr ? jt.titleAr : jt.titleEn}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الراتب' : 'Basic Salary ($)'}</label>
                        <input type="number" className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.salary} onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الرقم الوظيفي' : 'System Staff ID'}</label>
                        <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.staffId} onChange={(e) => setNewEmployee({ ...newEmployee, staffId: e.target.value })} placeholder="Auto-generated if empty" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-4 border-b border-emerald-50 pb-2"><Clock size={14}/> {isAr ? 'إدارة المناوبات' : 'Shift & Roster Planning'}</h4>
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={12}/> {isAr ? 'اختر أيام العمل' : 'Select Operational Days'}</p>
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            {DAYS_SHORT.map(day => (
                                <button
                                    key={day.key}
                                    type="button"
                                    onClick={() => toggleDay(isAr ? day.labelAr : day.key)}
                                    className={`w-12 h-12 rounded-2xl text-[10px] font-black transition-all transform active:scale-90 flex items-center justify-center border-2 ${
                                        (newEmployee.day_shifts || []).find((d: any) => d.day === (isAr ? day.labelAr : day.key))
                                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-100'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                                    }`}
                                >
                                    {isAr ? day.labelAr : day.labelEn}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                           {(newEmployee.day_shifts || []).map((ds: any) => (
                             <div 
                                 key={ds.day}
                                 className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4 animate-in slide-in-from-right duration-300"
                             >
                                 <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                         <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{ds.day}</span>
                                     </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{isAr ? 'نوع الفترة' : 'Core Period'}</span>
                                         <div className="flex gap-2">
                                             {SHIFT_TYPES.map(type => (
                                                 <button
                                                     key={type.id}
                                                     type="button"
                                                     onClick={() => updateDayShift(ds.day, 'type', type.id)}
                                                     className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${ds.type === type.id ? type.color : 'bg-slate-50 text-slate-300 filter grayscale opacity-50'}`}
                                                     title={isAr ? type.labelAr : type.labelEn}
                                                 >
                                                     {type.icon}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{isAr ? 'عدد الساعات' : 'Duration (Hrs)'}</span>
                                         <div className="flex flex-wrap gap-1.5">
                                             {WORK_HOURS.map(h => (
                                                 <button
                                                     key={h}
                                                     type="button"
                                                     onClick={() => updateDayShift(ds.day, 'work_hours', h)}
                                                     className={`w-9 h-9 rounded-xl text-[9px] font-black transition-all ${ds.work_hours === h ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                 >
                                                     {h}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                           ))}
                           {(newEmployee.day_shifts || []).length === 0 && (
                             <div className="text-center py-10 opacity-30">
                                <Clock size={32} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'لم يتم اختيار أيام' : 'No Roster Assigned'}</p>
                             </div>
                           )}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-12 bg-gray-50 -mx-8 -mb-8 p-10 border-t border-gray-100">
                  <button type="button" onClick={() => setIsAddEmployeeModalOpen(false)} className="px-8 py-3 bg-white text-gray-500 rounded-2xl text-xs font-black border border-gray-200 hover:bg-gray-100 transition-all active:scale-95">{isAr ? 'إلغاء' : 'Dismiss'}</button>
                  <button type="submit" className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-100 transition-all transform hover:scale-[1.05] active:scale-95">{newEmployee.id ? (isAr ? 'حفظ التعديلات' : 'Commit Changes') : (isAr ? 'اعتماد الموظف' : 'Finalize Onboarding')}</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

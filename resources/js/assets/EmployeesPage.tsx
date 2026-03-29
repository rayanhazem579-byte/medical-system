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


export const EmployeesPage: React.FC<EmployeesPageProps> = ({ 
  isAr, employees, tx, isAddEmployeeModalOpen, setIsAddEmployeeModalOpen, 
  newEmployee, setNewEmployee, handleAddEmployee, depts, jobTitles,
  onDeleteEmployee, onSendCredentials, hospitalName, welcomeEmailTemplate, supportEmail
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'roster' | 'shifts'>('roster');

  const filteredEmployees = employees.filter(emp => 
    (emp.nameAr || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.positionAr || emp.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-2xl w-fit shadow-inner border border-gray-200">
          <button 
            onClick={() => setViewMode('roster')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'roster' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid size={14} />
            {isAr ? 'قائمة الموظفين' : 'Staff Roster'}
          </button>
          <button 
            onClick={() => setViewMode('shifts')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'shifts' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Clock size={14} />
            {isAr ? 'جدول المناوبات' : 'Shift Schedule'}
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
          {viewMode === 'roster' ? (
            <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] font-cairo">
                  <th className="px-8 py-5 text-right">{isAr ? 'اسم الموظف' : 'Employee Name'}</th>
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
                          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{emp.staff_id || `EMP-${1000 + emp.id}`}</p>
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
                    <td className="px-8 py-5 text-right">
                        <p className="text-sm font-black text-slate-800">{isAr ? emp.nameAr : emp.nameEn || emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.staff_id || `EMP-${1000 + emp.id}`}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="px-3 py-1 bg-white border border-gray-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight shadow-sm">{isAr ? emp.positionAr : emp.positionEn || emp.role}</span>
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div onClick={() => setIsProfileModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />
           <div className={`relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
              <div className="flex flex-col md:flex-row min-h-[500px]">
                 {/* Sidebar */}
                 <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-3xl bg-primary-600 text-white flex items-center justify-center text-5xl font-black shadow-xl mb-6 transform -rotate-3">
                       {(selectedProfileEmployee.nameEn || selectedProfileEmployee.name || 'E').charAt(0)}
                    </div>
                    <div className="text-center space-y-1 mb-8 w-full">
                       <h2 className="text-xl font-black text-slate-900 leading-tight truncate">{isAr ? selectedProfileEmployee.nameAr : (selectedProfileEmployee.nameEn || selectedProfileEmployee.name)}</h2>
                       <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.2em]">{isAr ? selectedProfileEmployee.positionAr : (selectedProfileEmployee.positionEn || selectedProfileEmployee.role)}</p>
                       <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold mt-2">
                          <Hash size={12} />
                          <span>{selectedProfileEmployee.staff_id || `EMP-${1000 + selectedProfileEmployee.id}`}</span>
                       </div>
                    </div>

                    <div className="w-full space-y-3">
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Mail size={14}/></div>
                          <div className="overflow-hidden">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'البريد' : 'Email'}</p>
                             <p className="text-[10px] font-black text-slate-800 truncate">{selectedProfileEmployee.email || 'N/A'}</p>
                          </div>
                       </div>
                       <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone size={14}/></div>
                          <div>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'الهاتف' : 'Phone'}</p>
                             <p className="text-[10px] font-black text-slate-800">{selectedProfileEmployee.phone || 'N/A'}</p>
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
                             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? 'بيانات الموظف' : 'Personnel File'}</h3>
                             <p className="text-[10px] text-slate-400 font-bold">{isAr ? 'معلومات الوظيفة والتعيين' : 'Job Role & Appointment Details'}</p>
                          </div>
                       </div>
                       <button onClick={() => setIsProfileModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><X size={20}/></button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-400 mb-1 uppercase tracking-widest font-black text-[9px]"><Building2 size={12}/> {isAr ? 'القسم' : 'Department'}</div>
                            <p className="text-xs font-black text-slate-800">{isAr ? selectedProfileEmployee.deptAr : selectedProfileEmployee.deptEn}</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-400 mb-1 uppercase tracking-widest font-black text-[9px]"><Briefcase size={12}/> {isAr ? 'المسمى الوظيفي' : 'Position'}</div>
                            <p className="text-xs font-black text-slate-800">{isAr ? selectedProfileEmployee.positionAr : (selectedProfileEmployee.positionEn || selectedProfileEmployee.role)}</p>
                         </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                         <div className="flex items-center gap-2 text-slate-400 mb-1 uppercase tracking-widest font-black text-[9px]"><Info size={12}/> {isAr ? 'الحالة الحالية' : 'Current Status'}</div>
                         <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${selectedProfileEmployee.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <p className="text-xs font-black text-slate-800 uppercase">{selectedProfileEmployee.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'متوقف' : 'Idle')}</p>
                         </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-[10px]">
                       <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
                          <Calendar size={12} />
                          {isAr ? 'تاريخ الانضمام:' : 'Joined On:'}
                          <span className="text-slate-800">{selectedProfileEmployee.hire_date || '2024-01-01'}</span>
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
          <div className={`relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in slide-in-from-bottom-4 duration-500 ${isAr ? 'font-cairo' : ''}`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg transform -rotate-6"><Edit3 size={20} /></div>
                <h3 className="text-xl font-black text-gray-800">{newEmployee.id ? (isAr ? 'تعديل بيانات موظف' : 'Edit Employee Details') : (isAr ? 'إضافة موظف جديد' : 'New Employee Onboarding')}</h3>
              </div>
              <button onClick={() => setIsAddEmployeeModalOpen(false)} className="w-10 h-10 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-4 border-b border-indigo-50 pb-2"><Info size={14}/> {isAr ? 'المعلومات المهنية' : 'Professional Dossier'}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'اسم الموظف' : 'Employee Name'}</label>
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
                         {jobTitles.map((jt, idx) => <option key={idx} value={isAr ? jt.nameAr : jt.nameEn}>{isAr ? jt.nameAr : jt.nameEn}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">{isAr ? 'الرقم الوظيفي (Job Number)' : 'Job Number (EMP-1001)'}</label>
                    <input className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-50 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all shadow-inner" value={newEmployee.staffId} onChange={(e) => setNewEmployee({ ...newEmployee, staffId: e.target.value })} placeholder={isAr ? "اتركها فارغة للتوليد التلقائي (مثال: EMP-1001)" : "Leave blank to auto-generate (e.g. EMP-1001)"} />
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

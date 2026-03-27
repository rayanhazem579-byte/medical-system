import React from 'react';
import { 
  Plus, Search, Banknote, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  MoreVertical, Filter, Download, X, Edit3, Trash2
} from 'lucide-react';

/* ───────── Types ───────── */
export interface SalaryRecord {
  id: number;
  employeeId: string;
  employeeNameAr: string;
  employeeNameEn: string;
  role: 'doctor' | 'staff';
  positionAr: string;
  positionEn: string;
  deptAr: string;
  deptEn: string;
  baseSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  riskAllowance: number;
  incentives: number;
  overtime: number;
  commissionRate?: number; // Added for doctors
  totalRevenue?: number; // Added for doctors
  insuranceDeduction: number;
  taxesDeduction: number;
  absenceDeduction: number;
  penaltyDeduction: number;
  netSalary: number;
  status: 'paid' | 'pending';
  month: string;
}

interface SalariesPageProps {
  isAr: boolean;
  salaries: SalaryRecord[];
  tx: any;
  setIsAddSalaryModalOpen: (open: boolean) => void;
  isAddSalaryModalOpen: boolean;
  newSalary: any;
  setNewSalary: (sal: any) => void;
  handleAddSalary: (e: React.FormEvent) => void;
  employees: any[];
  doctors: any[];
  appointments: any[];
}

export const SalariesPage: React.FC<SalariesPageProps> = ({
  isAr, salaries, tx, setIsAddSalaryModalOpen, isAddSalaryModalOpen,
  newSalary, setNewSalary, handleAddSalary, employees, doctors, appointments
}) => {
  const getDoctorRevenue = (docId: string | number) => {
    return appointments
      .filter(a => String(a.doctor_id) === String(docId) && a.status !== 'cancelled')
      .reduce((sum, a) => sum + (Number(a.final_price) || 0), 0);
  };

  const textAlign = isAr ? 'text-right' : 'text-left';
  const [activeView, setActiveView] = React.useState<'history' | 'employees' | 'doctors'>('history');
  const [filterRole, setFilterRole] = React.useState<'all' | 'doctor' | 'staff'>('all');
  
  // Uses the employees and doctors from props instead of mock data

  const handleStaffSelect = (staffId: string) => {
    const selected = employees.find(s => String(s.id) === String(staffId));
    if (selected) {
      setNewSalary({
        ...newSalary,
        employeeId: selected.id,
        employeeNameAr: selected.nameAr,
        employeeNameEn: selected.nameEn,
        role: (selected.role === 'doctor' || selected.role === 'طبيب') ? 'doctor' : 'staff',
        deptAr: selected.deptAr,
        deptEn: selected.deptEn,
        baseSalary: selected.salary || 0,
        commissionRate: selected.commissionRate || 0
      });
    }
  };

  const filteredSalaries = salaries.filter(s => {
    if (filterRole === 'all') return true;
    return s.role === filterRole;
  });

  const totalPaid = salaries.filter(s => s.status === 'paid').reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalPending = salaries.filter(s => s.status === 'pending').reduce((acc, curr) => acc + curr.netSalary, 0);
  const totalDeductions = salaries.reduce((acc, curr) => acc + (
    curr.insuranceDeduction + curr.taxesDeduction + curr.absenceDeduction + curr.penaltyDeduction
  ), 0);

  return (
    <div className="space-y-6">
      
      {/* ─────── Financial Summaries ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500 opacity-50" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp size={14} className="text-primary-500" />
              {isAr ? 'إجمالي الرواتب المصروفة' : 'Total Paid Salaries'}
            </p>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-black text-gray-800">{totalPaid.toLocaleString()}</span>
               <span className="text-xs font-bold text-gray-400">SDG</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs">
               <ArrowUpRight size={14} />
               <span>+12% {isAr ? 'عن الشهر الماضي' : 'vs last month'}</span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500 opacity-50" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              {isAr ? 'رواتب قيد الانتظار' : 'Pending Salaries'}
            </p>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-black text-gray-800">{totalPending.toLocaleString()}</span>
               <span className="text-xs font-bold text-gray-400">SDG</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs">
               <span>{salaries.filter(s => s.status === 'pending').length} {isAr ? 'موظف بانتظار الصرف' : 'employees waiting'}</span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500 opacity-50" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingDown size={14} className="text-red-500" />
              {isAr ? 'إجمالي الاستقطاعات' : 'Total Deductions'}
            </p>
            <div className="flex items-center gap-2">
               <span className="text-2xl font-black text-gray-800">{totalDeductions.toLocaleString()}</span>
               <span className="text-xs font-bold text-gray-400">SDG</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-red-500 text-xs">
               <ArrowDownRight size={14} />
               <span>-5% {isAr ? 'تأخيرات وجزاءات' : 'late penalties'}</span>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Banknote size={24} /></div>
                   <div>
                      <h2 className="text-xl font-black text-gray-800">{isAr ? 'إدارة المستحقات المالية' : 'Financial Payroll Management'}</h2>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{isAr ? 'استعراض وإدارة كشوفات الرواتب' : 'Review and manage payroll statements'}</p>
                   </div>
                </div>
                
                {/* Master Tabs */}
                <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                   <button 
                     onClick={() => setActiveView('history')}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${activeView === 'history' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {isAr ? 'كشوفات الصرف' : 'Payroll History'}
                   </button>
                   <button 
                     onClick={() => setActiveView('employees')}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${activeView === 'employees' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {isAr ? 'جدول الموظفين' : 'Employees Table'}
                   </button>
                   <button 
                     onClick={() => setActiveView('doctors')}
                     className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${activeView === 'doctors' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {isAr ? 'جدول الأطباء' : 'Doctors Table'}
                   </button>
                </div>
             </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all">
                <Download size={16} />
                {isAr ? 'تصدير الكشف' : 'Export Payroll'}
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeView === 'history' ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/30 border-b border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <th className={`${textAlign} px-6 py-5`}>{isAr ? 'الموظف / القسم' : 'Employee / Dept'}</th>
                  <th className={`${textAlign} px-6 py-5`}>{isAr ? 'الدور الوظيفي' : 'Role'}</th>
                  <th className={`${textAlign} px-6 py-5`}>{isAr ? 'الراتب الأساسي' : 'Basic Salary'}</th>
                  <th className={`text-center px-4 py-5`}>{isAr ? 'النسبة' : 'Ratio %'}</th>
                  <th className={`${textAlign} px-4 py-5`}>{isAr ? 'البدلات' : 'Allowances'}</th>
                  <th className={`${textAlign} px-4 py-5 text-rose-400`}>{isAr ? 'الخصومات' : 'Deductions'}</th>
                  <th className={`${textAlign} px-6 py-5`}>{isAr ? 'صافي المرتب' : 'Net Salary'}</th>
                  <th className="text-center px-4 py-5 text-[9px] uppercase">{tx.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSalaries.map((sal) => {
                  const allowances = Number(sal.housingAllowance || 0) + Number(sal.transportAllowance || 0) + Number(sal.riskAllowance || 0) + Number(sal.incentives || 0) + Number(sal.overtime || 0);
                  const deductions = Number(sal.insuranceDeduction || 0) + Number(sal.taxesDeduction || 0) + Number(sal.absenceDeduction || 0) + Number(sal.penaltyDeduction || 0);
                  
                  return (
                  <tr key={sal.id} className="hover:bg-primary-50/5 transition-all group border-b border-slate-50">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${sal.role === 'doctor' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             {sal.employeeNameEn.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-800 leading-tight">{isAr ? sal.employeeNameAr : sal.employeeNameEn}</p>
                             <p className="text-[10px] font-bold text-gray-400 mt-0.5">{isAr ? sal.deptAr : sal.deptEn}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${sal.role === 'doctor' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{isAr ? (sal.role === 'doctor' ? 'طبيب' : 'موظف') : sal.role}</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-black text-gray-800">{sal.baseSalary?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-5 text-center">
                       {sal.role === 'doctor' ? (
                         <span className="text-xs font-black text-indigo-600">%{sal.commissionRate}</span>
                       ) : (
                         <span className="text-gray-300 text-xs font-bold">—</span>
                       )}
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-xs font-black text-emerald-600">+{allowances.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-5">
                       <span className="text-xs font-black text-rose-500">-{deductions.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <span className="text-xs font-black text-gray-900 bg-primary-50 px-2 py-1 rounded inline-block border border-primary-100">{sal.netSalary.toLocaleString()} <span className="text-[9px] opacity-60">SDG</span></span>
                          <span className={`text-[8px] font-bold mt-1 inline-block ${sal.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {sal.status === 'paid' ? (isAr ? '● تم الصرف' : '● PAID') : (isAr ? '● بانتظار الاعتماد' : '● PENDING')}
                          </span>
                       </div>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <div className="flex justify-center gap-1">
                         <button 
                           onClick={() => {
                             setNewSalary(sal);
                             setIsAddSalaryModalOpen(true);
                           }}
                           className="w-7 h-7 flex items-center justify-center rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm cursor-pointer"
                         ><Edit3 size={12} /></button>
                         <button className="w-7 h-7 flex items-center justify-center rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm cursor-pointer"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
             <table className="w-full">
              <thead>
                <tr className="bg-gray-50/30 border-b border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                  <th className={`${textAlign} px-8 py-5 text-[10px]`}>{isAr ? 'الموظف' : 'Employee'}</th>
                  <th className={`${textAlign} px-8 py-5 text-[10px]`}>{isAr ? 'القسم' : 'Dept'}</th>
                  <th className={`${textAlign} px-8 py-5 text-[10px]`}>{isAr ? 'الدور' : 'Role'}</th>
                  <th className={`${textAlign} px-8 py-5 text-[10px]`}>{isAr ? 'الراتب الأساسي' : 'Base Salary'}</th>
                  <th className="text-center px-8 py-5 text-[10px] uppercase">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(activeView === 'employees' ? employees.filter(e => e.role !== 'doctor' && e.role !== 'طبيب') : employees.filter(e => e.role === 'doctor' || e.role === 'طبيب')).map((emp) => (
                  <tr key={emp.id} className="hover:bg-primary-50/5 transition-all group">
                    <td className="px-8 py-5">
                       <p className="text-sm font-black text-gray-800 leading-tight">{isAr ? emp.nameAr : emp.nameEn}</p>
                       <p className="text-[10px] text-gray-400">#{emp.staff_id}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-bold text-gray-500">{isAr ? emp.deptAr : emp.deptEn}</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${emp.role === 'doctor' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isAr ? (emp.role === 'doctor' ? 'طبيب' : emp.role) : emp.role}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-black text-primary-600">{emp.salary?.toLocaleString() || 0} SDG</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <button 
                         onClick={() => {
                            handleStaffSelect(emp.id);
                            setIsAddSalaryModalOpen(true);
                         }}
                         className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-black uppercase hover:bg-primary-600 hover:text-white transition-all border border-primary-100 shadow-sm"
                       >
                          {isAr ? 'إصدار راتب' : 'Issue Payroll'}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isAddSalaryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><DollarSign size={24} /></div>
                 <h3 className="text-2xl font-black">{isAr ? 'إضافة مسيرة راتب' : 'Create Payroll Record'}</h3>
              </div>
              <button onClick={() => setIsAddSalaryModalOpen(false)} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full cursor-pointer"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddSalary} className="p-10 space-y-10 text-right overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                 {/* Basic Info */}
                 <div className="col-span-2 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
                    <h4 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.2em] border-b border-primary-100 pb-3 mb-4">{isAr ? 'البيانات الأساسية' : 'Basic Information'}</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'بيانات الموظف / الطبيب' : 'Employee / Doctor Data'}</label>
                           {newSalary.employeeId ? (
                              <div className="p-4 bg-primary-50 rounded-2xl border-2 border-primary-100 flex items-center justify-between">
                                 <div>
                                    <p className="text-sm font-black text-primary-700">{isAr ? newSalary.employeeNameAr : newSalary.employeeNameEn}</p>
                                    <p className="text-[10px] text-primary-400 font-bold uppercase">ID: {newSalary.employeeId}</p>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${newSalary.role === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                       {isAr ? (newSalary.role === 'doctor' ? 'طبيب' : 'موظف') : newSalary.role}
                                    </span>
                                    <button 
                                      type="button" 
                                      onClick={() => setNewSalary({...newSalary, employeeId: '', employeeNameAr: '', employeeNameEn: '', role: '', deptAr: '', deptEn: ''})}
                                      className="p-1 hover:text-red-500 transition-colors"
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              <select 
                                required 
                                value={newSalary.employeeId} 
                                onChange={e => handleStaffSelect(e.target.value)}
                                className="w-full bg-white border-2 border-primary-100 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm focus:border-primary-400 outline-none transition-all appearance-none cursor-pointer"
                              >
                                <option value="">{isAr ? '--- اختر من القائمة ---' : '--- Choose from list ---'}</option>
                                {employees.map(s => (
                                  <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.nameEn} ({s.staff_id})</option>
                                ))}
                              </select>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'القسم' : 'Dept'}</label>
                           <input disabled type="text" value={isAr ? newSalary.deptAr : newSalary.deptEn} className="w-full bg-gray-100 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-500 outline-none" />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'الدور الوظيفي' : 'Role'}</label>
                           <input disabled type="text" value={isAr ? (newSalary.role === 'doctor' ? 'طبيب' : 'موظف') : newSalary.role} className="w-full bg-gray-100 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-500 outline-none" />
                        </div>
                     </div>
                 </div>

                 {/* Income Details */}
                 <div className="col-span-2 p-6 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 space-y-6">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-emerald-100 pb-3 mb-4">{isAr ? 'تفاصيل الدخل' : 'Income Details'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'المرتب الأساسي' : 'Base Salary'}</label>
                          <input required type="number" value={newSalary.baseSalary} onChange={e => setNewSalary({...newSalary, baseSalary: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm focus:border-emerald-400 outline-none transition-all" />
                       </div>
                       {newSalary.role === 'doctor' && (
                          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 animate-in slide-in-from-right-2 duration-300">
                             <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 block">{isAr ? 'النسبة / العمولة (%)' : 'Ratio / Commission %'}</label>
                             <input type="number" value={newSalary.commissionRate} onChange={e => setNewSalary({...newSalary, commissionRate: e.target.value})} className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 outline-none shadow-inner" placeholder="E.g. 5" />
                              <div className="mt-2 text-[9px] text-indigo-400 font-bold italic">{isAr ? '💡 يتم تطبيق النسبة على إجمالي الإيرادات المولدة' : '💡 Applied on total generated revenue'}</div>
                          </div>
                       )}
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'بدل سكن' : 'Housing'}</label>
                          <input type="number" value={newSalary.housingAllowance} onChange={e => setNewSalary({...newSalary, housingAllowance: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'بدل انتقالات' : 'Transport'}</label>
                          <input type="number" value={newSalary.transportAllowance} onChange={e => setNewSalary({...newSalary, transportAllowance: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'بدل مخاطر/عدوى' : 'Risk/Infection'}</label>
                          <input type="number" value={newSalary.riskAllowance} onChange={e => setNewSalary({...newSalary, riskAllowance: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block">{isAr ? 'حوافز' : 'Incentives'}</label>
                          <input type="number" value={newSalary.incentives} onChange={e => setNewSalary({...newSalary, incentives: e.target.value})} className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-5 py-3 text-sm font-black outline-none" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 block">{isAr ? 'ساعات إضافي' : 'Overtime'}</label>
                          <input type="number" value={newSalary.overtime} onChange={e => setNewSalary({...newSalary, overtime: e.target.value})} className="w-full bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-5 py-3 text-sm font-black outline-none" />
                       </div>
                    </div>
                 </div>

                 {/* Deductions Details */}
                 <div className="col-span-2 p-6 bg-rose-50/30 rounded-[2rem] border border-rose-100 space-y-6">
                    <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.2em] border-b border-rose-100 pb-3 mb-4">{isAr ? 'الخصومات' : 'Deductions Detail'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'تأمينات' : 'Insurance'}</label>
                          <input type="number" value={newSalary.insuranceDeduction} onChange={e => setNewSalary({...newSalary, insuranceDeduction: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">{isAr ? 'ضرائب' : 'Taxes'}</label>
                          <input type="number" value={newSalary.taxesDeduction} onChange={e => setNewSalary({...newSalary, taxesDeduction: e.target.value})} className="w-full bg-white border-2 border-white rounded-2xl px-5 py-3 text-sm font-black shadow-sm" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 block">{isAr ? 'غياب' : 'Absence'}</label>
                          <input type="number" value={newSalary.absenceDeduction} onChange={e => setNewSalary({...newSalary, absenceDeduction: e.target.value})} className="w-full bg-rose-50 border-2 border-rose-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 block">{isAr ? 'جزاءات' : 'Penalties'}</label>
                          <input type="number" value={newSalary.penaltyDeduction} onChange={e => setNewSalary({...newSalary, penaltyDeduction: e.target.value})} className="w-full bg-rose-50 border-2 border-rose-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none" />
                       </div>
                    </div>
                 </div>

                 {/* Net Salary Calculation Preview */}
                 <div className="col-span-2 p-8 bg-gradient-to-br from-gray-900 to-indigo-900 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><DollarSign size={80} /></div>
                    <div className="relative z-10 flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-2">{isAr ? 'صافي المستحق' : 'Net Amount'}</p>
                          <h2 className="text-4xl font-black">
                             {(
                               Number(newSalary.baseSalary || 0) + 
                               Number(newSalary.housingAllowance || 0) + 
                               Number(newSalary.transportAllowance || 0) + 
                               Number(newSalary.riskAllowance || 0) + 
                               Number(newSalary.incentives || 0) + 
                               Number(newSalary.overtime || 0) +
                               (newSalary.role === 'doctor' ? (Number(newSalary.commissionRate || 0) / 100 * getDoctorRevenue(newSalary.employeeId)) : 0) -
                               (Number(newSalary.insuranceDeduction || 0) + 
                                Number(newSalary.taxesDeduction || 0) + 
                                Number(newSalary.absenceDeduction || 0) + 
                                Number(newSalary.penaltyDeduction || 0))
                             ).toLocaleString()}
                             <span className="text-sm font-bold text-indigo-300 ml-2">SDG</span>
                          </h2>
                          <p className="text-[9px] text-indigo-200 mt-4 italic">
                             {isAr ? '💡 المرتب = الأساسي + البدلات + الحوافز + الإضافي (+ النسبة للأطباء) − الخصومات' : '💡 Net = Base + Allowances + Incentives + OT (+ Ratio for Docs) - Deductions'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-100 shadow-sm bg-white sticky bottom-0 -mx-10 px-10 pb-2">
                <button type="button" onClick={() => setIsAddSalaryModalOpen(false)} className="px-10 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button type="submit" className="px-14 py-4 text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl hover:shadow-2xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all shadow-xl cursor-pointer">
                   {isAr ? 'اعتماد وصرف' : 'Approve & Pay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

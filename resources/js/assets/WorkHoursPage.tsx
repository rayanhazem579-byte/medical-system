import React, { useState } from 'react';
import { 
  Clock, Plus, Search, Filter, Download, 
  Edit3, Building2, Users, Activity, XCircle, Check
} from 'lucide-react';

interface WorkHoursPageProps {
  isAr: boolean;
  tx: any;
  depts: any[];
  employees: any[];
  doctors: any[];
  onRefresh?: () => void;
}

export const WorkHoursPage: React.FC<WorkHoursPageProps> = ({ isAr, tx, depts = [], employees = [], doctors = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [newShift, setNewShift] = useState({
    deptId: '',
    morningStart: '08:00',
    morningEnd: '14:00',
    eveningStart: '14:00',
    eveningEnd: '20:00',
    is24h: false
  });

  const staffByDept = (depts || []).map(d => {
    // Correctly matching by ID or Arabic/English name (as fallback)
    const deptDoctors = (doctors || []).filter(doc => 
      doc && (
        String(doc.deptId) === String(d.id) || 
        (doc.deptAr && doc.deptAr === d.nameAr) || 
        (doc.deptEn && doc.deptEn === d.nameEn)
      )
    );
    const deptEmployees = (employees || []).filter(emp => 
      emp && (
        String(emp.department_id) === String(d.id) || 
        (emp.deptAr && emp.deptAr === d.nameAr) || 
        (emp.deptEn && emp.deptEn === d.nameEn)
      )
    );

    const parseShifts = (raw: any) => {
      if (!raw) return [];
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch(e) { return []; }
      }
      return Array.isArray(raw) ? raw : [];
    };

    const processStaff = (s: any) => {
      const name = isAr ? (s.nameAr || s.name || 'موظف') : (s.nameEn || s.name || 'Staff');
      return {
        id: s.id,
        name: name,
        role: s.positionEn || (s.specialtyEn ? (isAr ? 'طبيب' : 'Doctor') : (isAr ? 'موظف' : 'Staff')),
        avatar: s.image,
        shifts: parseShifts(s.shifts),
        dayShifts: parseShifts(s.day_shifts),
        shiftType: s.shiftType || 'morning',
        workHours: s.workHours || { start: '08:00', end: '16:00' }
      };
    };

    return {
      ...d,
      id: d.id,
      nameAr: d.nameAr || d.name || 'قسم غير مسمى',
      nameEn: d.nameEn || d.name || 'Unnamed Dept',
      staffCount: deptDoctors.length + deptEmployees.length,
      morningStart: d.morning_start || '08:00',
      morningEnd: d.morning_end || '14:00',
      eveningStart: d.evening_start || '14:00',
      eveningEnd: d.evening_end || '20:00',
      is24h: !!d.is_24h,
      deptDoctors: deptDoctors.map(processStaff),
      deptEmployees: deptEmployees.map(processStaff)
    };
  });

  const filteredShifts = staffByDept.filter(s => 
    (isAr ? s.nameAr : s.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/departments/${newShift.deptId}/shifts`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          morning_start: newShift.morningStart,
          morning_end: newShift.morningEnd,
          evening_start: newShift.eveningStart,
          evening_end: newShift.eveningEnd,
          is_24h: newShift.is24h
        })
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
        setIsEditModalOpen(false);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-cairo" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               <Clock size={32} />
            </div>
            <div className="text-right">
               <h1 className="text-2xl font-black text-gray-800 tracking-tight">{isAr ? 'جدول ساعات العمل' : 'Work Hours Management'}</h1>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isAr ? 'الأقسام والدوامات ومعدلات العمل' : 'Departments, Shifts & Work Rates'}
               </p>
            </div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
           <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 size={24} />
           </div>
           <div className="relative flex-1 max-w-md">
             <Search size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} />
             <input 
               type="text"
               placeholder={isAr ? 'البحث عن قسم...' : 'Search department...'}
               className={`w-full ${isAr ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 transition-all text-xs font-bold`}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-xs font-black">
            <Download size={18} />
            {isAr ? 'تصدير سياسات الدوام' : 'Export Shift Policies'}
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
        {filteredShifts.map((shift) => (
          <div key={shift.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-50/20 border border-indigo-100/50 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500">
            <div className="p-8 pb-6 border-b border-indigo-50 bg-gradient-to-br from-indigo-50/30 to-white flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-all duration-500">
                  <Building2 size={28} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black text-gray-800 leading-none">{isAr ? shift.nameAr : shift.nameEn}</h3>
                  <p className="text-[10px] font-black text-indigo-400 mt-2 uppercase tracking-widest">{shift.code || `DEPT-${shift.id}`}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setNewShift({
                    deptId: shift.id.toString(),
                    morningStart: shift.morningStart,
                    morningEnd: shift.morningEnd,
                    eveningStart: shift.eveningStart,
                    eveningEnd: shift.eveningEnd,
                    is24h: shift.is24h
                  });
                  setSelectedShift(shift);
                  setIsEditModalOpen(true);
                }}
                className="w-10 h-10 rounded-xl bg-white text-indigo-400 border border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center shadow-sm"
              >
                <Edit3 size={18} />
              </button>
            </div>

            <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-4">
              {shift.is24h ? (
                <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-[9px] font-black flex items-center gap-2 animate-in slide-in-from-left duration-500">
                  <Activity size={14} className="animate-pulse" />
                  {isAr ? 'دوام كامل (24 ساعة)' : 'Operational 24/7'}
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-[9px] font-black flex items-center gap-2">
                    <Clock size={12} className="text-indigo-400" />
                    {isAr ? 'صباحي:' : 'AM:'} {shift.morningStart} - {shift.morningEnd}
                  </div>
                  <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-[9px] font-black flex items-center gap-2">
                    <Clock size={12} className="text-emerald-400" />
                    {isAr ? 'مسائي:' : 'PM:'} {shift.eveningStart} - {shift.eveningEnd}
                  </div>
                </>
              )}
            </div>

            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{isAr ? 'جدول الكادر الطبي والإداري' : 'Staff Individual Roster'}</h4>
                <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-black border border-gray-100">{shift.staffCount} {isAr ? 'موظف' : 'Staff'}</span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {shift.deptDoctors.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-all group/staff">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                        {(doc.name || '?').charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-800">{doc.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{doc.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border ${
                        doc.shiftType === 'morning' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        doc.shiftType === 'evening' ? 'bg-green-50 text-green-600 border-green-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {doc.shiftType === 'morning' ? (isAr ? 'صباحي' : 'AM') :
                          doc.shiftType === 'evening' ? (isAr ? 'مسائي' : 'PM') : (isAr ? '24 ساعة' : '24H')}
                      </span>
                      <span className="text-[11px] font-black text-primary-600">{doc.workHours?.start} - {doc.workHours?.end}</span>
                    </div>
                  </div>
                ))}
                
                {shift.deptEmployees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white transition-all group/staff">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                        {(emp.name || '?').charAt(0)}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-800">{emp.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{emp.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border ${
                        emp.shiftType === 'morning' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {emp.shiftType === 'morning' ? (isAr ? 'صباحي' : 'AM') : (isAr ? 'مسائي' : 'PM')}
                      </span>
                      <span className="text-[11px] font-black text-orange-600">{emp.workHours?.start} - {emp.workHours?.end}</span>
                    </div>
                  </div>
                ))}
                
                {(shift.deptDoctors.length + shift.deptEmployees.length) === 0 && (
                  <div className="py-10 text-center text-gray-300">
                    <Users size={32} className="mx-auto opacity-20 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'لا يوجد موظفون مسجلون' : 'No Staff Registered'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredShifts.length === 0 && (
           <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{isAr ? 'لم يتم العثور على أقسام' : 'No Departments Found'}</p>
           </div>
        )}
      </div>

      {isEditModalOpen && selectedShift && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-primary-700 text-white flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                       <Clock size={24} />
                    </div>
                    <div className="text-right">
                       <h3 className="text-xl font-black">{isAr ? selectedShift.nameAr : selectedShift.nameEn}</h3>
                       <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{isAr ? 'تعديل سياسة الدوام' : 'Edit Shift Policy'}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition"><XCircle size={22} /></button>
              </div>

              <form onSubmit={handleUpdateShift} className="p-8 space-y-6 text-right" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-700">{isAr ? 'تعمل على مدار 24 ساعة؟' : '24-Hour Operation?'}</span>
                      <div className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${newShift.is24h ? 'bg-amber-500' : 'bg-gray-200'}`} onClick={() => setNewShift({...newShift, is24h: !newShift.is24h})}>
                         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${newShift.is24h ? (isAr ? 'left-7' : 'right-7') : (isAr ? 'left-1' : 'right-1')}`}></div>
                      </div>
                   </div>
                   <p className="text-[9px] font-bold text-amber-600/70 leading-relaxed text-right">
                      {isAr ? 'عند التفعيل، سيتم اعتبار القسم متاحاً للعمل ليل نهار بشكل متواصل' : 'When enabled, the department will be considered operational around the clock.'}
                   </p>
                </div>

                {!newShift.is24h && (
                  <div className="space-y-4">
                    <div className="space-y-3 pb-4 border-b border-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الدوام الصباحي' : 'Morning Shift'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-300 uppercase px-1">{isAr ? 'من' : 'From'}</label>
                            <input type="time" value={newShift.morningStart} onChange={e => setNewShift({...newShift, morningStart: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-indigo-50" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-300 uppercase px-1">{isAr ? 'إلى' : 'To'}</label>
                            <input type="time" value={newShift.morningEnd} onChange={e => setNewShift({...newShift, morningEnd: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-indigo-50" />
                         </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الدوام المسائي' : 'Evening Shift'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-300 uppercase px-1">{isAr ? 'من' : 'From'}</label>
                            <input type="time" value={newShift.eveningStart} onChange={e => setNewShift({...newShift, eveningStart: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-emerald-50" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-300 uppercase px-1">{isAr ? 'إلى' : 'To'}</label>
                            <input type="time" value={newShift.eveningEnd} onChange={e => setNewShift({...newShift, eveningEnd: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-emerald-50" />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                     <Check size={18}/>
                     {isAr ? 'حفظ التحديثات' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-8 bg-gray-50 text-gray-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                     {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

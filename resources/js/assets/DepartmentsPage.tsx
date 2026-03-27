import React from 'react';
import { 
  Building2, CheckCircle2, Users, Search, Plus, Filter, Download, 
  Eye, Edit3, Ban, MoreVertical, X, Hash, MapPin, AlignLeft, Image as ImageIcon,
  Activity, Trash2, Clock, Check
} from 'lucide-react';

/* ───────── Types ───────── */
export interface Department { 
  id: number; 
  code?: string;
  nameAr: string; 
  nameEn: string; 
  headAr: string; 
  headEn: string; 
  headAvatar: string; 
  doctorCount: number; 
  status: 'active' | 'inactive'; 
  established: string; 
  locationAr: string; 
  locationEn: string;
  phone?: string;
  email?: string;
  description?: string;
  image_url?: string;
  morning_start?: string;
  morning_end?: string;
  evening_start?: string;
  evening_end?: string;
  staffCount?: number;
  is_24h?: boolean;
}

interface DepartmentsPageProps {
  isAr: boolean;
  tx: any;
  depts: Department[];
  filterStatus: 'all' | 'active' | 'inactive';
  setFilterStatus: (status: 'all' | 'active' | 'inactive') => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setIsAddModalOpen: (open: boolean) => void;
  actionMenuId: number | null;
  setActionMenuId: (id: number | null) => void;
  isAddModalOpen: boolean;
  newDept: any;
  setNewDept: (dept: any) => void;
  handleAddDept: (e: React.FormEvent, customData?: any) => void;
  onUploadImage: (id: number, file: File) => void;
  handleDeleteDept: (id: number) => void;
}

const avatarColors = [
  'from-sky-400 to-blue-500', 'from-emerald-400 to-green-500', 'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500', 'from-rose-400 to-pink-500', 'from-teal-400 to-cyan-500',
];

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  isAr, tx, depts, filterStatus, setFilterStatus, 
  currentPage, setCurrentPage, setIsAddModalOpen, actionMenuId, setActionMenuId,
  isAddModalOpen, newDept, setNewDept, handleAddDept, onUploadImage, handleDeleteDept
}) => {
  const [viewMode, setViewMode] = React.useState<'list' | 'hours'>('list');
  const [referenceTime, setReferenceTime] = React.useState('08:00');
  const [shiftTemplates, setShiftTemplates] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('hospital_shift_templates');
    return saved ? JSON.parse(saved) : [
      { id: 1, hrs: 6, labelAr: '6 ساعات', labelEn: '6 Hours', start: '08:00', end: '14:00', isRecommended: false },
      { id: 2, hrs: 8, labelAr: '8 ساعات', labelEn: '8 Hours', start: '08:00', end: '16:00', isRecommended: true },
      { id: 3, hrs: 10, labelAr: '10 ساعات', labelEn: '10 Hours', start: '08:00', end: '18:00', isRecommended: false },
      { id: 4, hrs: 12, labelAr: '12 ساعة', labelEn: '12 Hours', start: '08:00', end: '20:00', isRecommended: false },
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('hospital_shift_templates', JSON.stringify(shiftTemplates));
  }, [shiftTemplates]);

  const [templateEditId, setTemplateEditId] = React.useState<number | null>(null);
  const [newTemplate, setNewTemplate] = React.useState<any>(null);
  const itemsPerPage = 7;
  const filteredDepts = depts.filter(d => filterStatus === 'all' ? true : d.status === filterStatus);
  const totalPages = Math.ceil(filteredDepts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepts = filteredDepts.slice(startIndex, startIndex + itemsPerPage);

  const textAlign = isAr ? 'text-right' : 'text-left';
  const filterIconPos = isAr ? 'right-3' : 'left-3';
  const filterPadding = isAr ? 'pr-9 px-4' : 'pl-9 px-4';

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedDeptId, setSelectedDeptId] = React.useState<number | null>(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = React.useState(false);
  const [shiftData, setShiftData] = React.useState({
     id: 0,
     morning_start: '08:00',
     morning_end: '14:00',
     evening_start: '14:00',
     evening_end: '20:00',
     is_24h: false
  });

  const handleImageClick = (id: number) => {
    setSelectedDeptId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDeptId) {
      onUploadImage(selectedDeptId, file);
    }
  };

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    const result = Math.floor(diff / 60);
    return result < 0 ? result + 24 : result; // Handle midnight wrap
  };

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800">{tx.deptList}</h2>
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-lg">{filteredDepts.length} {tx.deptUnit}</span>
            </div>
            
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                const lastNum = depts.reduce((max, d) => {
                  const match = d.code?.match(/DEPT-(\d+)/);
                  return match ? Math.max(max, parseInt(match[1])) : max;
                }, 0);
                const nextNum = lastNum + 1;
                setNewDept({ 
                  code: `DEPT-${nextNum}`, 
                  nameAr: '', 
                  nameEn: '', 
                  headAr: '', 
                  headEn: '', 
                  count: '', 
                  locationAr: '', 
                  locationEn: '', 
                  status: 'active', 
                  description: '', 
                  phone: '', 
                  email: '',
                  morning_start: '08:00',
                  morning_end: '14:00',
                  evening_start: '14:00',
                  evening_end: '20:00',
                  is_24h: false
                });
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
            >
              <Plus size={16} />
              {isAr ? 'إضافة قسم جديد' : 'Add New Dept'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {viewMode === 'list' ? (
            <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>كود القسم</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{tx.colDeptName}</th>
                <th className={`${textAlign} text-xs font-semibold text-gray-400 uppercase px-6 py-3.5`}>{tx.colHead}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{tx.colLocation}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{tx.colStatus}</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase px-6 py-3.5">{tx.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedDepts.map((dept, idx) => (
                <tr key={dept.id} className="hover:bg-primary-50/30 transition-colors duration-150">
                   <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-md">{dept.code || `D-${dept.id}`}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {dept.image_url ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-shimmer">
                          <img src={dept.image_url} alt={dept.nameEn} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm animate-shimmer`}>
                          {isAr ? dept.nameAr.charAt(0) : dept.nameEn.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-800">{isAr ? dept.nameAr : dept.nameEn}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{isAr ? dept.headAr : dept.headEn}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-500">{dept.email}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-500">{dept.phone}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-500">{isAr ? dept.locationAr : dept.locationEn}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${dept.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {dept.status === 'active' ? tx.active : tx.inactive}
                    </span>
                  </td>
                   <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <button onClick={() => { setNewDept({...dept, deptId: dept.id}); setIsAddModalOpen(true); }} className="p-2 text-gray-400 hover:text-primary-500 transition-colors" title={isAr ? 'تعديل البيانات' : 'Edit Data'}><Edit3 size={16} /></button>
                       <button onClick={() => handleDeleteDept(dept.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title={isAr ? 'حذف القسم' : 'Delete Department'}><Ban size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Shift Duration Reference Guide */}
               <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-primary-700 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-100 flex flex-col xl:flex-row items-center justify-between gap-10 border-b-8 border-indigo-900/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                  <div className="z-10 space-y-4 max-w-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-xl shadow-inner border border-white/20">
                           <Clock size={28} className="text-white animate-pulse" />
                        </div>
                           <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-black tracking-tight">{isAr ? 'دليل الورديات القياسي' : 'Standard Shift Guide'}</h3>
                              <button 
                                 onClick={() => setNewTemplate({ id: Date.now(), hrs: 8, labelAr: 'وردية جديدة', labelEn: 'New Shift', start: '08:00', end: '16:00', isRecommended: false })}
                                 className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-emerald-500 transition-all text-white border border-white/20 shadow-lg"
                                 title={isAr ? 'إضافة وردية قياسية' : 'Add Standard Shift'}
                              >
                                 <Plus size={16} />
                              </button>
                           </div>
                           <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'مرجع حساب الساعات' : 'Shift Calculation Reference'}</p>
                     </div>
                     <p className="text-indigo-50/80 text-xs font-bold font-cairo leading-relaxed">
                        {isAr 
                           ? 'هذا الجدول يوضح أوقات الانتهاء القياسية بناءً على وقت البدء الافتراضي (08:00 صباحاً). استخدمه لتنسيق دوام الأقسام بشكل موحد.' 
                           : 'This guide visualizes standard shift end times based on a 08:00 AM start. Use it to maintain consistent scheduling across all departments.'}
                     </p>
                  </div>

                  <div className="z-10 bg-black/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex-1 w-full max-w-3xl shadow-inner">
                     <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                        <thead>
                           <tr className="text-[10px] font-black text-indigo-200 uppercase tracking-widest border-b border-white/10">
                              <th className="pb-4 text-right px-4">{isAr ? 'نوع الوردية' : 'Shift Type'}</th>
                              <th className="pb-4 text-center px-4">{isAr ? 'وقت البدء' : 'Start'}</th>
                              <th className="pb-4 text-center px-4">{isAr ? 'وقت الانتهاء' : 'End'}</th>
                              <th className="pb-4 text-center px-4">{isAr ? 'مدة الدوام' : 'Duration'}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {(newTemplate || templateEditId) && (
                              <tr className="bg-white/10 backdrop-blur-md">
                                 <td colSpan={4} className="p-4">
                                    <div className="flex items-center gap-4">
                                       <input 
                                          type="text" 
                                          placeholder={isAr ? 'الاسم' : 'Name'}
                                          value={isAr ? (newTemplate || shiftTemplates.find(t => t.id === templateEditId)).labelAr : (newTemplate || shiftTemplates.find(t => t.id === templateEditId)).labelEn}
                                          onChange={(e) => {
                                             const update = isAr ? {labelAr: e.target.value} : {labelEn: e.target.value};
                                             if (newTemplate) setNewTemplate({...newTemplate, ...update});
                                             else setShiftTemplates(prev => prev.map(t => t.id === templateEditId ? {...t, ...update} : t));
                                          }}
                                          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-black outline-none focus:ring-2 focus:ring-indigo-400"
                                       />
                                       <input 
                                          type="time" 
                                          value={(newTemplate || shiftTemplates.find(t => t.id === templateEditId)).start}
                                          onChange={(e) => {
                                             const update = {start: e.target.value};
                                             if (newTemplate) setNewTemplate({...newTemplate, ...update});
                                             else setShiftTemplates(prev => prev.map(t => t.id === templateEditId ? {...t, ...update} : t));
                                          }}
                                          className="w-24 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-black outline-none"
                                       />
                                       <input 
                                          type="time" 
                                          value={(newTemplate || shiftTemplates.find(t => t.id === templateEditId)).end}
                                          onChange={(e) => {
                                             const update = {end: e.target.value};
                                             if (newTemplate) setNewTemplate({...newTemplate, ...update});
                                             else setShiftTemplates(prev => prev.map(t => t.id === templateEditId ? {...t, ...update} : t));
                                          }}
                                          className="w-24 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-xs font-black outline-none"
                                       />
                                       <div className="flex gap-2">
                                          <button 
                                             onClick={() => {
                                                if (newTemplate) setShiftTemplates(prev => [...prev, newTemplate]);
                                                setNewTemplate(null);
                                                setTemplateEditId(null);
                                             }}
                                             className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg"
                                          >
                                             <Check size={16} />
                                          </button>
                                          <button 
                                             onClick={() => { setNewTemplate(null); setTemplateEditId(null); }}
                                             className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg"
                                          >
                                             <X size={16} />
                                          </button>
                                       </div>
                                    </div>
                                 </td>
                              </tr>
                           )}
                           {shiftTemplates.map(template => {
                              const hrs = calculateDuration(template.start, template.end);
                              return (
                                 <tr key={template.id} className="group/row hover:bg-white/5 transition-all duration-300">
                                    <td className="py-4 px-4 text-sm font-black text-white flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${template.isRecommended ? 'from-emerald-400 to-teal-500 shadow-emerald-500/20' : 'from-indigo-400 to-primary-500 shadow-indigo-500/20'} flex items-center justify-center text-[10px] shadow-lg group-hover/row:scale-110 transition-transform`}>
                                          {hrs}
                                       </div>
                                       <div>
                                          <p className="leading-none">{isAr ? template.labelAr : template.labelEn}</p>
                                          <p className="text-[9px] text-white/40 mt-1 uppercase font-bold tracking-tighter">{hrs} {isAr ? 'ساعات' : 'Hours'}</p>
                                       </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                       <span className="bg-white/10 px-4 py-1.5 rounded-xl text-[11px] font-black text-indigo-50 border border-white/10">{template.start}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                       <span className="bg-emerald-400/20 px-4 py-1.5 rounded-xl text-[11px] font-black text-emerald-400 border border-emerald-400/20">{template.end}</span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                       <div className="flex items-center justify-center gap-2 transition-opacity">
                                          <button 
                                             onClick={() => setTemplateEditId(template.id)}
                                             className="w-8 h-8 rounded-xl bg-white/10 hover:bg-sky-500 transition-all text-white flex items-center justify-center border border-white/10"
                                          >
                                             <Edit3 size={14} />
                                          </button>
                                          <button 
                                             onClick={() => setShiftTemplates(prev => prev.filter(t => t.id !== template.id))}
                                             className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-500 transition-all text-white flex items-center justify-center border border-white/10"
                                          >
                                             <Trash2 size={14} />
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden mt-6">
                  <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50/50 uppercase tracking-widest text-[10px] font-black text-gray-400">
                  <th className="px-8 py-5 text-right">{isAr ? 'إدارة القسم' : 'Dept Management'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الدوام الصباحي' : 'Morning Shift'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الدوام المسائي' : 'Evening Shift'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'الحالة التشغيلية' : 'Ops Status'}</th>
                  <th className="px-8 py-5 text-center">{isAr ? 'تعديل' : 'Modify'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedDepts.map(dept => (
                  <tr key={dept.id} className="hover:bg-indigo-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform">
                            {(isAr ? dept.nameAr : dept.nameEn)?.charAt(0) || '?'}
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-800">{isAr ? dept.nameAr || '---' : dept.nameEn || '---'}</p>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{dept.code || 'CODE'}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100/50 text-xs font-black shadow-sm">{dept.morning_start || '08:00'} - {dept.morning_end || '14:00'}</span>
                        <div className="flex gap-1 justify-center mt-1">
                          {[6, 8, 10, 12].map(hrs => (
                             <button 
                               key={hrs} 
                               onClick={() => {
                                 const startStr = dept.morning_start || '08:00';
                                 const [h, m] = startStr.split(':').map(Number);
                                 const newEnd = `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                 handleAddDept(null as any, { 
                                   ...dept, 
                                   name_ar: dept.nameAr, name_en: dept.nameEn,
                                   morning_start: startStr, morning_end: newEnd,
                                   id: dept.id 
                                 });
                               }}
                               className={`px-1.5 py-0.5 rounded text-[7px] font-black transition-all ${calculateDuration(dept.morning_start, dept.morning_end) === hrs ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600'}`}
                             >
                               {hrs}h
                             </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100/50 text-xs font-black shadow-sm">{dept.evening_start || '14:00'} - {dept.evening_end || '20:00'}</span>
                        <div className="flex gap-1 justify-center mt-1">
                          {[6, 8, 10, 12].map(hrs => (
                             <button 
                               key={hrs} 
                               onClick={() => {
                                 const startStr = dept.evening_start || '14:00';
                                 const [h, m] = startStr.split(':').map(Number);
                                 const newEnd = `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                 handleAddDept(null as any, { 
                                   ...dept, 
                                   name_ar: dept.nameAr, name_en: dept.nameEn,
                                   evening_start: startStr, evening_end: newEnd,
                                   id: dept.id 
                                 });
                               }}
                               className={`px-1.5 py-0.5 rounded text-[7px] font-black transition-all ${calculateDuration(dept.evening_start, dept.evening_end) === hrs ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600'}`}
                             >
                               {hrs}h
                             </button>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-xs">
                       <div className="flex flex-col items-center gap-1.5">
                          {dept.is_24h && (
                             <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[8px] font-black uppercase tracking-tighter animate-pulse">24H Continuous</span>
                          )}
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${dept.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {dept.status === 'active' ? tx.active : tx.inactive}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="flex items-center justify-center gap-2">
                          <button 
                             onClick={() => {
                                setShiftData({
                                   id: dept.id,
                                   morning_start: dept.morning_start || '08:00',
                                   morning_end: dept.morning_end || '14:00',
                                   evening_start: dept.evening_start || '14:00',
                                   evening_end: dept.evening_end || '20:00',
                                   is_24h: dept.is_24h || false
                                });
                                setIsShiftModalOpen(true);
                             }}
                             className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center justify-center active:scale-90"
                             title={isAr ? 'إدارة الورديات' : 'Manage Shifts'}
                          >
                             <Activity size={16} />
                          </button>
                          <button 
                             onClick={() => { setNewDept({...dept, deptId: dept.id}); setIsAddModalOpen(true); }} 
                             className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-slate-400 hover:text-sky-600 hover:border-sky-200 transition-all shadow-sm flex items-center justify-center active:scale-90"
                             title={isAr ? 'تعديل البيانات' : 'Edit Data'}
                          >
                             <Edit3 size={16} />
                          </button>
                          <button 
                             onClick={() => handleDeleteDept(dept.id)} 
                             className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm flex items-center justify-center active:scale-90"
                             title={isAr ? 'حذف القسم' : 'Delete Department'}
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
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-600 to-sky-600 text-white shrink-0">
              <div>
                <h3 className="text-2xl font-black">{newDept.id || (newDept as any).deptId ? (isAr ? 'تعديل بيانات القسم' : 'Edit Department') : (isAr ? 'إضافة قسم جديد' : 'New Department')}</h3>
                <p className="text-white/70 text-xs mt-1 font-bold italic">Smart Infrastructure Management</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddDept} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">كود القسم</label>
                       <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={16} />
                          <input required value={newDept.code} onChange={e => setNewDept({...newDept, code: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder="DEPT-101" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'اسم القسم' : 'Dept Name'}</label>
                       <input required value={newDept.nameAr} onChange={e => setNewDept({...newDept, nameAr: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder={isAr ? 'مثال: القلب' : 'e.g. Cardiology'} />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'رئيس القسم' : 'Dept Head'}</label>
                    <div className="relative">
                       <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={16} />
                       <input required value={newDept.headAr} onChange={e => setNewDept({...newDept, headAr: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder={isAr ? 'د. محمد علي' : 'Dr. Smith'} />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الموقع' : 'Location'}</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={16} />
                       <input required value={newDept.locationAr} onChange={e => setNewDept({...newDept, locationAr: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder={isAr ? 'الجناح الشمالي - الطابق 2' : 'North Wing - 2nd Floor'} />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                       <input required type="email" value={newDept.email} onChange={e => setNewDept({...newDept, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder="dept@alshifa.com" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                       <input required type="text" value={newDept.phone} onChange={e => setNewDept({...newDept, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none" placeholder="0123456789" />
                    </div>
                 </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الوصف' : 'Description'}</label>
                    <div className="relative">
                       <AlignLeft className="absolute left-4 top-4 text-primary-500" size={16} />
                       <textarea value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none h-32 shadow-inner resize-none" placeholder={isAr ? 'نبذة عن تخصص القسم...' : 'Dept overview...'} />
                    </div>
                  </div>



                  <div className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-gray-50">
                     <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all">{isAr ? 'إلغاء' : 'Cancel'}</button>
                     <button type="submit" className="bg-primary-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all">{isAr ? 'حفظ البيانات' : 'Save Details'}</button>
                  </div>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Shift Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[340px] overflow-hidden animate-in zoom-in-95">
              <div className="p-5 bg-gradient-to-br from-indigo-600 to-primary-700 text-white flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                       <Activity size={20} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black">{isAr ? 'إدارة الورديات' : 'Shift Manager'}</h3>
                       <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest leading-none mt-0.5">{isAr ? 'تحديث ساعات العمل' : 'Update work hours'}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsShiftModalOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors cursor-pointer"><X size={16} /></button>
              </div>

              <div className="p-5 space-y-5">
                 {/* 24H Toggle - Tighter */}
                 <div className="flex items-center justify-between bg-amber-50/50 p-3 rounded-2xl border border-amber-100/30">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black text-[10px]">24</div>
                       <div>
                          <p className="text-[10px] font-black text-amber-900 leading-none">{isAr ? 'نظام 24 ساعة' : '24h System'}</p>
                       </div>
                    </div>
                    <button 
                       type="button"
                       onClick={() => setShiftData({...shiftData, is_24h: !shiftData.is_24h})}
                       className={`w-10 h-5 rounded-full transition-all relative ${shiftData.is_24h ? 'bg-amber-500 shadow-lg shadow-amber-100' : 'bg-gray-200'}`}
                    >
                       <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${shiftData.is_24h ? 'right-5.5' : 'right-0.5'}`}></div>
                    </button>
                 </div>

                 {!shiftData.is_24h && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                       {/* Morning Shift */}
                       <div className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                             <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-indigo-500 rounded-full"></div>
                                <label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? 'الصباحي' : 'Morning'}</label>
                             </div>
                             <span className="text-[9px] font-black text-indigo-500">{calculateDuration(shiftData.morning_start, shiftData.morning_end)}h</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                             <input type="time" value={shiftData.morning_start} onChange={e => setShiftData({...shiftData, morning_start: e.target.value})} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-100 transition-all" />
                             <input type="time" value={shiftData.morning_end} onChange={e => setShiftData({...shiftData, morning_end: e.target.value})} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[10px] outline-none focus:ring-2 focus:ring-indigo-100 transition-all" />
                          </div>

                          <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/20 space-y-3">
                             <input 
                                type="range" min="1" max="12" 
                                value={calculateDuration(shiftData.morning_start, shiftData.morning_end)}
                                onChange={(e) => {
                                   const hrs = parseInt(e.target.value);
                                   const [h, m] = shiftData.morning_start.split(':').map(Number);
                                   setShiftData({...shiftData, morning_end: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                }}
                                className="w-full h-1 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                             />
                             <div className="flex gap-1.5">
                                {[6, 8, 10, 12].map(hrs => (
                                   <button 
                                      key={hrs} type="button"
                                      onClick={() => {
                                         const [h, m] = shiftData.morning_start.split(':').map(Number);
                                         setShiftData({...shiftData, morning_end: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                      }}
                                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${calculateDuration(shiftData.morning_start, shiftData.morning_end) === hrs ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-indigo-600 border border-gray-100'}`}
                                   >
                                      {hrs}h
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Evening Shift */}
                       <div className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                             <div className="flex items-center gap-2">
                                <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                                <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{isAr ? 'المسائي' : 'Evening'}</label>
                             </div>
                             <span className="text-[9px] font-black text-emerald-500">{calculateDuration(shiftData.evening_start, shiftData.evening_end)}h</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                             <input type="time" value={shiftData.evening_start} onChange={e => setShiftData({...shiftData, evening_start: e.target.value})} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[10px] outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
                             <input type="time" value={shiftData.evening_end} onChange={e => setShiftData({...shiftData, evening_end: e.target.value})} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl font-bold text-[10px] outline-none focus:ring-2 focus:ring-emerald-100 transition-all" />
                          </div>

                          <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/20 space-y-3">
                             <input 
                                type="range" min="1" max="12" 
                                value={calculateDuration(shiftData.evening_start, shiftData.evening_end)}
                                onChange={(e) => {
                                   const hrs = parseInt(e.target.value);
                                   const [h, m] = shiftData.evening_start.split(':').map(Number);
                                   setShiftData({...shiftData, evening_end: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                }}
                                className="w-full h-1 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                             />
                             <div className="flex gap-1.5">
                                {[6, 8, 10, 12].map(hrs => (
                                   <button 
                                      key={hrs} type="button"
                                      onClick={() => {
                                         const [h, m] = shiftData.evening_start.split(':').map(Number);
                                         setShiftData({...shiftData, evening_end: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                      }}
                                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${calculateDuration(shiftData.evening_start, shiftData.evening_end) === hrs ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-white text-emerald-600 border border-gray-100'}`}
                                   >
                                      {hrs}h
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 <div className="flex gap-2 pt-2">
                    <button 
                       type="button"
                       onClick={() => {
                          const dept = depts.find(d => d.id === shiftData.id);
                          if (dept || shiftData.id === 0) {
                             const fakeEvent = { preventDefault: () => {} } as any;
                             const updatedDept = dept ? {
                                ...dept,
                                ...shiftData,
                                deptId: shiftData.id
                             } : {
                                ...shiftData,
                                deptId: 0,
                                code: 'SYSTEM-DEFAULT',
                                nameAr: 'General',
                                nameEn: 'General',
                                headAr: 'N/A',
                                headEn: 'N/A',
                                locationAr: 'N/A',
                                locationEn: 'N/A',
                                email: 'system@hospital.com',
                                phone: '000',
                                status: 'active'
                             };
                             setNewDept(updatedDept);
                             setTimeout(() => handleAddDept(fakeEvent), 0);
                             setIsShiftModalOpen(false);
                          }
                       }}
                       className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-50 hover:bg-primary-700 transition-all cursor-pointer"
                    >
                       {isAr ? 'حفظ' : 'Save'}
                    </button>
                    <button onClick={() => setIsShiftModalOpen(false)} className="px-6 bg-gray-50 text-gray-400 py-3 rounded-xl text-[10px] font-black hover:bg-gray-100 transition-all cursor-pointer">{isAr ? 'إغلاق' : 'Close'}</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

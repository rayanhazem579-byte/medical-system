import React, { useState } from 'react';
import { 
  Plus, Check, X, Search, Briefcase, 
  ChevronRight, Edit3, Trash2,
  Filter, Download, Users, XCircle, Activity, Mail, Clock
} from 'lucide-react';

interface JobTitle {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

interface JobTitlesPageProps {
  isAr: boolean;
  tx: any;
  employees: any[];
  doctors: any[];
  jobTitles: JobTitle[];
  setJobTitles: React.Dispatch<React.SetStateAction<JobTitle[]>>;
  onRefresh?: () => void;
  onNavigateToDoctors?: (filter: string) => void;
}

export const JobTitlesPage: React.FC<JobTitlesPageProps> = ({ isAr, tx, employees, doctors, jobTitles, setJobTitles, onRefresh, onNavigateToDoctors }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [newJobTitle, setNewJobTitle] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    status: 'active'
  });

  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Sync employee counts
  const syncedJobTitles = jobTitles.map(s => {
    const totalEmployees = employees.filter(e => 
        (e.positionAr === s.nameAr) || (e.positionEn === s.nameEn)
    ).length;
    
    // Count doctors specifically
    const doctorCount = doctors.filter(d => 
        (d.jobTitleAr === s.nameAr) || (d.jobTitleEn === s.nameEn)
    ).length;

    return {
      ...s,
      employeeCount: totalEmployees,
      doctorCount: doctorCount
    };
  });

  const filteredJobTitles = syncedJobTitles.filter(s => 
    (isAr ? s.nameAr : s.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJobTitle = async (e: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const method = (isEditMode || customData) ? 'PUT' : 'POST';
    const finalId = customData ? customData.id : editingId;
    const endpoint = (isEditMode || customData) ? `/api/job-titles/${finalId}` : '/api/job-titles';
    
    const dataToSend = customData || {
      name_ar: newJobTitle.nameAr,
      name_en: newJobTitle.nameEn,
      description_ar: newJobTitle.descriptionAr,
      description_en: newJobTitle.descriptionEn,
      status: newJobTitle.status
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (res.ok) {
        if (onRefresh) onRefresh();
        setIsAddModalOpen(false);
        setIsEditMode(false);
        setEditingId(null);
        setNewJobTitle({ 
          nameAr: '', 
          nameEn: '', 
          descriptionAr: '', 
          descriptionEn: '', 
          status: 'active'
        });
      } else {
        alert(isAr ? 'فشل حفظ المسمى الوظيفي' : 'Failed to save job title');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteJobTitle = async (id: number) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المسمى الوظيفي؟' : 'Are you sure you want to delete this job title?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/job-titles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && onRefresh) onRefresh();
      } catch (err) { console.error(err); }
    }
  };

  const openEditModal = (spec: JobTitle) => {
    setNewJobTitle({
      nameAr: spec.nameAr,
      nameEn: spec.nameEn,
      descriptionAr: spec.descriptionAr || '',
      descriptionEn: spec.descriptionEn || '',
      status: spec.status
    });
    setEditingId(spec.id);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 ${isAr ? 'font-arabic' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Premium Gradient Header Overhaul */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-white/10 duration-1000" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-primary-500/20 duration-1000" />
         
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center text-white border border-white/20 shadow-2xl group-hover:scale-105 group-hover:-rotate-3 transition-all duration-700">
               <Briefcase size={40} className="drop-shadow-lg" />
            </div>
            <div className="text-white">
               <h2 className="text-4xl font-black tracking-tighter leading-none mb-3">
                  {isAr ? 'إدارة المسميات والوظائف' : 'Job Titles & Roles'}
               </h2>
               <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  <p className="text-xs font-black opacity-60 uppercase tracking-[0.4em]">
                     {isAr ? 'توصيف الأدوار والهيكل الوظيفي الطبي' : 'Define Clinical roles & Hierarchy'}
                  </p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4 relative z-10">
            <button 
               onClick={() => {
                 setIsEditMode(false);
                 setEditingId(null);
                 setNewJobTitle({ 
                   nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '', status: 'active'
                 });
                 setIsAddModalOpen(true);
               }} 
               className="px-8 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border border-white/10"
            >
               <Plus size={18} />
               {isAr ? 'إضافة مسمى وظيفي' : 'Create Job Role'}
            </button>
         </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredJobTitles.map(spec => (
          <div 
            key={spec.id} 
            className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col items-center text-center gap-4 overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${spec.status === 'active' ? 'bg-primary-500' : 'bg-gray-500'}`}></div>
            
            <div className="absolute top-6 right-6 flex gap-2 z-20">
               <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(spec as any); }}
                  className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                  title={isAr ? 'تعديل' : 'Edit'}
               >
                  <Edit3 size={14} />
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteJobTitle(spec.id); }}
                  className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  title={isAr ? 'حذف' : 'Delete'}
               >
                  <Trash2 size={14} />
               </button>
            </div>

            <div 
              className="cursor-pointer flex flex-col items-center gap-4 w-full"
              onClick={() => { setSelectedJobTitle(spec as any); setIsViewModalOpen(true); }}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${spec.status === 'active' ? 'bg-primary-50 text-primary-600 shadow-primary-100' : 'bg-gray-50 text-gray-400'}`}>
                 <Briefcase size={28} />
              </div>

              <div className="space-y-1 z-10">
                 <h4 className="text-sm font-black text-gray-800 tracking-tight group-hover:text-primary-600 transition-colors">{isAr ? spec.nameAr : spec.nameEn}</h4>
                 <div className="flex flex-col gap-0.5 cursor-pointer hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors group/stats" onClick={(e) => { e.stopPropagation(); onNavigateToDoctors?.(isAr ? spec.nameAr : spec.nameEn); }}>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{spec.employeeCount} {isAr ? 'موظف' : 'Employees'}</p>
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest group-hover/stats:scale-110 transition-transform">
                      {(spec as any).doctorCount} {isAr ? 'طبيب' : 'Doctors'}
                    </p>
                 </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest z-10 ${spec.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                {isAr ? (spec.status === 'active' ? 'نشط' : 'معطل') : spec.status}
              </div>
            </div>

            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
               <span className="text-[9px] font-black text-primary-500 uppercase tracking-tighter flex items-center gap-1">
                  {isAr ? 'عرض التفاصيل' : 'View Details'} <ChevronRight size={10} />
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add JobTitle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[35px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-sky-100">
            <div className={`p-6 border-b border-sky-50 flex items-center justify-between ${isEditMode ? 'bg-gradient-to-r from-sky-400 to-indigo-500' : 'bg-primary-600'} text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                   {isEditMode ? <Edit3 size={20} /> : <Plus size={20} />}
                </div>
                <h3 className="text-lg font-black tracking-tight">{isEditMode ? (isAr ? 'تعديل مسمى وظيفي' : 'Edit Job Title') : (isAr ? 'إضافة مسمى وظيفي جديد' : 'Add New Job Title')}</h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditMode(false);
                }} 
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-rose-500 transition-all flex items-center justify-center cursor-pointer"
              >
                <XCircle size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleAddJobTitle} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4 text-right">
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'المسمى الوظيفي (عربي)' : 'Title (Arabic)'}</label>
                     <input required type="text" value={newJobTitle.nameAr} onChange={e => setNewJobTitle({...newJobTitle, nameAr: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs" />
                   </div>
                   <div className="space-y-1 text-left">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'Title (English)' : 'Title (English)'}</label>
                     <input required type="text" value={newJobTitle.nameEn} onChange={e => setNewJobTitle({...newJobTitle, nameEn: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الوصف (عربي)' : 'Arabic Description'}</label>
                      <textarea value={newJobTitle.descriptionAr} onChange={e => setNewJobTitle({...newJobTitle, descriptionAr: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs h-24 resize-none" placeholder={isAr ? 'اكتب وصف الوظيفة بالعربي...' : 'Arabic content...'} />
                   </div>
                   <div className="space-y-1 text-left" dir="ltr">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">English Description</label>
                      <textarea value={newJobTitle.descriptionEn} onChange={e => setNewJobTitle({...newJobTitle, descriptionEn: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs h-24 resize-none" placeholder="Write English description here..." />
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الحالة' : 'Status'}</label>
                  <select value={newJobTitle.status} onChange={e => setNewJobTitle({...newJobTitle, status: e.target.value as any})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 font-bold text-xs outline-none">
                    <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                    <option value="inactive">{isAr ? 'معطل' : 'Inactive'}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary-100 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                  {isEditMode ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إضافة المسمى' : 'Save Title')}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 bg-gray-50 text-gray-400 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all cursor-pointer">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedJobTitle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="p-10 bg-gradient-to-br from-gray-900 to-slate-800 text-white relative">
                 <button onClick={() => setIsViewModalOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer"><X size={24}/></button>
                 <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                    <Briefcase size={40} />
                 </div>
                 <h3 className="text-3xl font-black">{isAr ? selectedJobTitle.nameAr : selectedJobTitle.nameEn}</h3>
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 italic">{isAr ? 'تفاصيل المسمى الوظيفي' : 'Job Title Description'}</p>
              </div>
              <div className="p-12 space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <p className="text-sm font-bold text-gray-700 leading-relaxed font-cairo">
                          {isAr ? selectedJobTitle.descriptionAr : selectedJobTitle.descriptionEn}
                       </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                       <div className="flex-1 bg-gray-50 p-4 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الحالة' : 'Status'}</p>
                          <p className={`text-xs font-black mt-1 ${selectedJobTitle.status === 'active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                             {isAr ? (selectedJobTitle.status === 'active' ? 'نشط' : 'معطل') : selectedJobTitle.status}
                          </p>
                       </div>
                       <div className="flex-1 bg-gray-50 p-4 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الموظفون' : 'Employees'}</p>
                          <p className="text-xs font-black mt-1 text-gray-800">{selectedJobTitle.employeeCount}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedJobTitle); }} className="flex-1 bg-primary-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-primary-100/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer">
                       <Edit3 size={18} /> {isAr ? 'تعديل' : 'Edit'}
                    </button>
                    <button onClick={() => { setIsViewModalOpen(false); handleDeleteJobTitle(selectedJobTitle.id); }} className="px-8 bg-rose-50 text-rose-500 py-4 rounded-3xl font-black hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                       <Trash2 size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

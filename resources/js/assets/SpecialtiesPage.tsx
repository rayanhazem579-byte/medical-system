import React, { useState } from 'react';
import { 
  Plus, Check, X, Search, Stethoscope, 
  ChevronRight, MoreVertical, Edit3, Trash2,
  Users, Briefcase, XCircle, Activity, Mail,
  LayoutGrid, LayoutList, Clock, AlertCircle
} from 'lucide-react';

interface Specialty {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  doctorCount: number;
  status: 'active' | 'inactive';
  morningStart?: string;
  morningEnd?: string;
  eveningStart?: string;
  eveningEnd?: string;
  is24h?: boolean;
}

interface SpecialtiesPageProps {
  isAr: boolean;
  tx: any;
  doctors: any[];
  specialties: Specialty[];
  setSpecialties: React.Dispatch<React.SetStateAction<Specialty[]>>;
  onRefresh?: () => void;
  onNavigateToDoctors?: (filter: string) => void;
}

export const SpecialtiesPage: React.FC<SpecialtiesPageProps> = ({ isAr, tx, doctors, specialties, setSpecialties, onRefresh, onNavigateToDoctors }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [newSpecialty, setNewSpecialty] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    status: 'active',
    morningStart: '08:00',
    morningEnd: '14:00',
    eveningStart: '14:00',
    eveningEnd: '20:00',
    is24h: false
  });

  const calculateDuration = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    const result = Math.floor(diff / 60);
    return result < 0 ? result + 24 : result;
  };

  // Sync doctor counts
  const syncedSpecialties = specialties.map(s => ({
    ...s,
    doctorCount: doctors.filter(d => 
        (d.specialtyAr === s.nameAr) || (d.specialtyEn === s.nameEn)
    ).length
  }));

  const filteredSpecialties = syncedSpecialties.filter(s => 
    (isAr ? s.nameAr : s.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSpecialty = async (e: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('token');
    const method = (isEditMode || customData) ? 'PUT' : 'POST';
    const finalId = customData ? customData.id : editingId;
    const endpoint = (isEditMode || customData) ? `/api/specialties/${finalId}` : '/api/specialties';
    
    const dataToSend = customData || {
      name_ar: newSpecialty.nameAr,
      name_en: newSpecialty.nameEn,
      description_ar: newSpecialty.descriptionAr,
      description_en: newSpecialty.descriptionEn,
      status: newSpecialty.status,
      morning_start: newSpecialty.morningStart,
      morning_end: newSpecialty.morningEnd,
      evening_start: newSpecialty.eveningStart,
      evening_end: newSpecialty.eveningEnd,
      is_24h: newSpecialty.is24h
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
        setNewSpecialty({ 
          nameAr: '', 
          nameEn: '', 
          descriptionAr: '', 
          descriptionEn: '', 
          status: 'active',
          morningStart: '08:00',
          morningEnd: '14:00',
          eveningStart: '14:00',
          eveningEnd: '20:00',
          is24h: false
        });
      } else {
        alert(isAr ? 'فشل حفظ التخصص' : 'Failed to save specialty');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteSpecialty = async (id: number) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا التخصص؟' : 'Are you sure you want to delete this specialty?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/specialties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok && onRefresh) onRefresh();
      } catch (err) { console.error(err); }
    }
  };

  const openEditModal = (spec: Specialty) => {
    setNewSpecialty({
      nameAr: spec.nameAr,
      nameEn: spec.nameEn,
      descriptionAr: spec.descriptionAr || '',
      descriptionEn: spec.descriptionEn || '',
      status: spec.status,
      morningStart: spec.morningStart || '08:00',
      morningEnd: spec.morningEnd || '14:00',
      eveningStart: spec.eveningStart || '14:00',
      eveningEnd: spec.eveningEnd || '20:00',
      is24h: spec.is24h || false
    });
    setEditingId(spec.id);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-cairo">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'إجمالي التخصصات' : 'Total Specializations'}</p>
            <h3 className="text-xl font-black text-gray-800">{specialties.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'أطباء نشطون' : 'Active Doctors'}</p>
            <h3 className="text-xl font-black text-gray-800">{doctors.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'متوسط الأطباء/تخصص' : 'Avg Doctors/Spec'}</p>
            <h3 className="text-xl font-black text-gray-800">{(specialties.length > 0 ? doctors.length / specialties.length : 0).toFixed(1)}</h3>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-wrap items-center justify-between gap-4 border border-gray-50">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Search size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} />
            <input 
              type="text"
              placeholder={isAr ? 'البحث عن تخصص...' : 'Search specialty...'}
              className={`w-full ${isAr ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3 bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-primary-50 transition-all text-xs font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 shadow-inner shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:bg-white/50'}`}
            >
              <LayoutGrid size={18}/>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-md ring-1 ring-black/5' : 'text-gray-400 hover:bg-white/50'}`}
            >
              <LayoutList size={18}/>
            </button>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsEditMode(false);
            setEditingId(null);
            setNewSpecialty({ 
              nameAr: '', 
              nameEn: '', 
              descriptionAr: '', 
              descriptionEn: '', 
              status: 'active',
              morningStart: '08:00',
              morningEnd: '14:00',
              eveningStart: '14:00',
              eveningEnd: '20:00',
              is24h: false
            });
            setIsAddModalOpen(true);
          }}
          className="bg-primary-600 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-primary-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest"
        >
          <Plus size={20} />
          {isAr ? 'تخصص جديد' : 'New Specialty'}
        </button>
      </div>

      {/* Specialties List/Grid Rendering */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredSpecialties.map(spec => (
            <div key={spec.id} className="group relative bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden cursor-pointer" onClick={() => { setSelectedSpecialty(spec); setIsViewModalOpen(true); }}>
              <div className={`absolute top-0 left-0 w-1.5 h-full ${spec.status === 'active' ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 text-primary-600 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                  <Stethoscope size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      openEditModal(spec);
                    }}
                    className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSpecialty(spec.id); }}
                    className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <h4 className="text-sm font-black text-gray-800 line-clamp-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{isAr ? spec.nameAr : spec.nameEn}</h4>
                    
                    <div className="flex flex-col gap-1.5 py-3 my-4 border-y border-gray-50/50">
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{isAr ? 'الصباحي' : 'Morning'}</span>
                         <span className="text-[9px] font-black text-gray-500">{spec.morningStart} <span className="text-[7px] text-gray-300 font-bold ml-1">({calculateDuration(spec.morningStart, spec.morningEnd)}h)</span></span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                         <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">{isAr ? 'المسائي' : 'Evening'}</span>
                         <span className="text-[9px] font-black text-gray-500">{spec.eveningStart} <span className="text-[7px] text-gray-300 font-bold ml-1">({calculateDuration(spec.eveningStart, spec.eveningEnd)}h)</span></span>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold line-clamp-2 leading-relaxed h-12">
                      {isAr ? spec.descriptionAr : spec.descriptionEn}
                    </p>
                 </div>

                 <div className="flex items-center justify-between pt-2">
                   <div 
                      className="flex flex-col gap-0.5 cursor-pointer hover:bg-primary-50/50 px-2 py-1 rounded-lg transition-colors group/stats"
                      onClick={(e) => { e.stopPropagation(); onNavigateToDoctors?.(isAr ? spec.nameAr : spec.nameEn); }}
                   >
                      <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none">{isAr ? 'الأطباء' : 'Doctors'}</p>
                      <span className="text-xs font-black text-primary-600 leading-none group-hover/stats:scale-110 transition-transform">{spec.doctorCount}</span>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      {spec.is24h && (
                         <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[7px] font-black uppercase tracking-tighter animate-pulse">24H Ops</span>
                      )}
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${spec.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                        {isAr ? (spec.status === 'active' ? 'نشط' : 'معطل') : spec.status}
                      </div>
                   </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="overflow-x-auto relative">
              <table className="w-full text-right border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className={`px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'التخصص' : 'Specialty'}</th>
                       <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{isAr ? 'الأطباء' : 'Doctors'}</th>
                       <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{isAr ? 'الصباحي' : 'Morning'}</th>
                       <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{isAr ? 'المسائي' : 'Evening'}</th>
                       <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{isAr ? 'الحالة' : 'Status'}</th>
                       <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredSpecialties.map(spec => (
                       <tr key={spec.id} className="hover:bg-primary-50/30 transition-all group/row cursor-pointer" onClick={() => { setSelectedSpecialty(spec); setIsViewModalOpen(true); }}>
                          <td className="px-8 py-5">
                             <div className={`flex items-center gap-4 ${isAr ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-primary-600 shadow-inner group-hover/row:scale-110 transition-transform">
                                   <Stethoscope size={18} />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-800">{isAr ? spec.nameAr : spec.nameEn}</p>
                                   <p className="text-[9px] font-bold text-gray-400 line-clamp-1">{isAr ? spec.descriptionAr : spec.descriptionEn}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-black text-primary-600 shadow-sm">{spec.doctorCount}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-indigo-600">{spec.morningStart} - {spec.morningEnd}</span>
                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{calculateDuration(spec.morningStart, spec.morningEnd)}h</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[10px] font-black text-emerald-600">{spec.eveningStart} - {spec.eveningEnd}</span>
                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{calculateDuration(spec.eveningStart, spec.eveningEnd)}h</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex items-center justify-center gap-2">
                                {spec.is24h && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-200" title="24h Ops" />}
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${spec.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                   {isAr ? (spec.status === 'active' ? 'نشط' : 'معطل') : spec.status}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <button 
                                   onClick={(e) => { e.stopPropagation(); openEditModal(spec); }}
                                   className="w-10 h-10 rounded-xl bg-white text-gray-400 border border-gray-200 hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center justify-center shadow-sm"
                                >
                                   <Edit3 size={16} />
                                </button>
                                <button 
                                   onClick={(e) => { e.stopPropagation(); handleDeleteSpecialty(spec.id); }}
                                   className="w-10 h-10 rounded-xl bg-white text-gray-400 border border-gray-200 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm"
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

      {/* Add/Edit Specialty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[420px] overflow-hidden animate-in zoom-in-95 duration-300 border border-primary-50">
            <div className={`p-6 border-b border-gray-100 flex items-center justify-between ${isEditMode ? 'bg-gradient-to-r from-indigo-500 to-primary-700' : 'bg-primary-600'} text-white`}>
              <div className="flex items-center gap-3">
                {isEditMode ? <Edit3 size={20} /> : <Plus size={20} />}
                <h3 className="text-lg font-black tracking-tight">{isEditMode ? (isAr ? 'تعديل التخصص' : 'Edit Specialty') : (isAr ? 'إضافة تخصص جديد' : 'New Specialty')}</h3>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); }} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-rose-500 transition-all flex items-center justify-center">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleAddSpecialty} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5 text-right">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'التخصص (عربي)' : 'Title (Ar)'}</label>
                     <input required type="text" value={newSpecialty.nameAr} onChange={e => setNewSpecialty({...newSpecialty, nameAr: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs" />
                   </div>
                   <div className="space-y-1.5 text-left">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'Title (En)' : 'Title (En)'}</label>
                     <input required type="text" value={newSpecialty.nameEn} onChange={e => setNewSpecialty({...newSpecialty, nameEn: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs" />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الوصف' : 'Overview'}</label>
                   <textarea value={newSpecialty.descriptionAr} onChange={e => setNewSpecialty({...newSpecialty, descriptionAr: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-50 font-bold text-xs h-32 resize-none" placeholder={isAr ? 'اكتب نبذة عن التخصص...' : 'Short description...'} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{isAr ? 'الحالة' : 'Status'}</label>
                  <select value={newSpecialty.status} onChange={e => setNewSpecialty({...newSpecialty, status: e.target.value as any})} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold text-xs outline-none cursor-pointer">
                    <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                    <option value="inactive">{isAr ? 'معطل' : 'Inactive'}</option>
                  </select>
                </div>

                {/* Integrated Shift Management */}
                <div className="pt-6 border-t border-gray-100 space-y-5">
                   <div className="flex items-center justify-between bg-amber-50/50 p-4 rounded-2xl border border-amber-100/30">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-sm shadow-sm ring-4 ring-white">24</div>
                         <div>
                            <p className="text-xs font-black text-amber-900 leading-none">{isAr ? 'دوام 24 ساعة' : '24h Operations'}</p>
                         </div>
                      </div>
                      <button 
                         type="button"
                         onClick={() => setNewSpecialty({...newSpecialty, is24h: !newSpecialty.is24h})}
                         className={`w-12 h-6 rounded-full transition-all relative ${newSpecialty.is24h ? 'bg-amber-500' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${newSpecialty.is24h ? (isAr ? 'right-7' : 'left-7') : (isAr ? 'right-1' : 'left-1')}`}></div>
                      </button>
                   </div>

                   {!newSpecialty.is24h && (
                      <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                         {/* Morning */}
                         <div className="bg-indigo-50/30 p-5 rounded-[2rem] border border-indigo-100/30 space-y-4">
                            <div className="flex items-center justify-between">
                               <label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{isAr ? 'الدوام الصباحي' : 'Morning Shift'}</label>
                               <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-lg border border-indigo-100 text-indigo-600">{calculateDuration(newSpecialty.morningStart, newSpecialty.morningEnd)}h</span>
                            </div>
                            <div className="flex gap-2">
                               <input type="time" value={newSpecialty.morningStart} onChange={e => setNewSpecialty({...newSpecialty, morningStart: e.target.value})} className="flex-1 bg-white border border-indigo-100/50 rounded-xl p-3 text-[10px] font-bold outline-none" />
                               <input type="time" value={newSpecialty.morningEnd} onChange={e => setNewSpecialty({...newSpecialty, morningEnd: e.target.value})} className="flex-1 bg-white border border-indigo-100/50 rounded-xl p-3 text-[10px] font-bold outline-none" />
                            </div>
                            <div className="flex gap-1">
                               {[6, 8, 10, 12].map(hrs => (
                                  <button key={hrs} type="button" onClick={() => {
                                     const [h, m] = newSpecialty.morningStart.split(':').map(Number);
                                     setNewSpecialty({...newSpecialty, morningEnd: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                  }} className={`flex-1 py-1.5 rounded-lg text-[8px] font-black transition-all ${calculateDuration(newSpecialty.morningStart, newSpecialty.morningEnd) === hrs ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 border border-indigo-100'}`}>{hrs}h</button>
                               ))}
                            </div>
                         </div>

                         {/* Evening */}
                         <div className="bg-emerald-50/30 p-5 rounded-[2rem] border border-emerald-100/30 space-y-4">
                            <div className="flex items-center justify-between">
                               <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{isAr ? 'الدوام المسائي' : 'Evening Shift'}</label>
                               <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded-lg border border-emerald-100 text-emerald-600">{calculateDuration(newSpecialty.eveningStart, newSpecialty.eveningEnd)}h</span>
                            </div>
                            <div className="flex gap-2">
                               <input type="time" value={newSpecialty.eveningStart} onChange={e => setNewSpecialty({...newSpecialty, eveningStart: e.target.value})} className="flex-1 bg-white border border-emerald-100/50 rounded-xl p-3 text-[10px] font-bold outline-none" />
                               <input type="time" value={newSpecialty.eveningEnd} onChange={e => setNewSpecialty({...newSpecialty, eveningEnd: e.target.value})} className="flex-1 bg-white border border-emerald-100/50 rounded-xl p-3 text-[10px] font-bold outline-none" />
                            </div>
                            <div className="flex gap-1">
                               {[6, 8, 10, 12].map(hrs => (
                                  <button key={hrs} type="button" onClick={() => {
                                     const [h, m] = newSpecialty.eveningStart.split(':').map(Number);
                                     setNewSpecialty({...newSpecialty, eveningEnd: `${((h + hrs) % 24).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`});
                                  }} className={`flex-1 py-1.5 rounded-lg text-[8px] font-black transition-all ${calculateDuration(newSpecialty.eveningStart, newSpecialty.eveningEnd) === hrs ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 border border-emerald-100'}`}>{hrs}h</button>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-200 hover:scale-[1.02] active:scale-95 transition-all">
                  {isEditMode ? (isAr ? 'حفظ التعديلات' : 'Apply Changes') : (isAr ? 'إضافة التخصص' : 'Save Specialty')}
                </button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 bg-gray-50 text-gray-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Doctors Modal */}
      {isViewModalOpen && selectedSpecialty && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-primary-50">
              <div className="p-8 bg-gradient-to-br from-primary-600 to-indigo-700 text-white flex justify-between items-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <div className="flex items-center gap-4 z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                       <Stethoscope size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black">{isAr ? selectedSpecialty.nameAr : selectedSpecialty.nameEn}</h3>
                       <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? 'قائمة أطباء التخصص' : 'Specialist Registry'}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsViewModalOpen(false)} className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                    <XCircle size={24} />
                 </button>
              </div>

              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                 {doctors.filter(d => (d.specialtyAr === selectedSpecialty.nameAr) || (d.specialtyEn === selectedSpecialty.nameEn)).length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                       <div className="w-20 h-20 bg-gray-100 text-gray-300 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><Users size={40} /></div>
                       <div className="space-y-1">
                          <p className="text-sm font-black text-gray-500">{isAr ? 'لا يوجد أطباء مسجلين' : 'No Doctors Found'}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'في هذا التخصص حالياً' : 'In this specialization currently'}</p>
                       </div>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 gap-3">
                       {doctors.filter(d => (d.specialtyAr === selectedSpecialty.nameAr) || (d.specialtyEn === selectedSpecialty.nameEn)).map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 group hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 text-primary-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all">
                                   {doc.nameEn.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-sm font-black text-gray-800 tracking-tight">{isAr ? doc.nameAr : doc.nameEn}</p>
                                   <div className="flex items-center gap-4 mt-1">
                                      <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-wider">
                                         <Activity size={10} className="text-primary-400" />
                                         {isAr ? doc.deptAr : doc.deptEn}
                                      </span>
                                      <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 lowercase tracking-tight italic">
                                         <Mail size={10} className="text-indigo-400" />
                                         {doc.email}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-primary-50 group-hover:text-primary-500 flex items-center justify-center transition-all"><ChevronRight size={18} /></button>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
              
              <div className="p-8 bg-white border-t border-gray-50 flex gap-4">
                 <button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedSpecialty); }} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Edit3 size={16} /> {isAr ? 'تعديل التخصص' : 'Edit Specialty'}
                 </button>
                 <button onClick={() => setIsViewModalOpen(false)} className="px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">{isAr ? 'إغلاق' : 'Close'}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Activity, Search, Clock, CheckCircle2, AlertCircle, 
  FileText, Upload, Send, Filter, MoreVertical, X, Eye, 
  Download, ChevronRight, Beaker, Printer, Bell, Globe, Image as ImageIcon, Scan, Layers, RefreshCw, CalendarCheck, Database, UserCheck, Plus, Package, CreditCard, LayoutDashboard, Hospital
} from 'lucide-react';

/* ───────── Types ───────── */
interface RadiologyRequest {
  id: number;
  patient_id: number;
  doctor_id?: number;
  scan_name_ar: string;
  scan_name_en: string;
  notes: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  result_text: string | null;
  result_file_url: string | null;
  created_at: string;
  patient?: any;
  doctor?: any;
  isExternal?: boolean; 
}

interface RadiologyPageProps {
  isAr: boolean;
  tx: any;
  notifications?: any[];
  onToggleLang?: () => void;
}

export const RadiologyPage: React.FC<RadiologyPageProps> = ({ isAr, tx, notifications = [], onToggleLang }) => {
  const [requests, setRequests] = useState<RadiologyRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'external' | 'archive'>('external');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RadiologyRequest | null>(null);
  const [resultText, setResultText] = useState('');
  const [isUploading, setIsUploading] = useState<number | null>(null);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/radiology-requests', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.data || []);
        setRequests(items.map((r: any) => ({
             ...r,
             isExternal: !r.doctor_id 
        })));
      }
    } catch (err) { console.error("Radiology fetch error:", err); }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/radiology-requests/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchRequests();
    } catch (err) { console.error("Update status error:", err); }
  };

  const handleUploadFile = async (id: number, file: File) => {
    setIsUploading(id);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/radiology-requests/${id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        setIsUploading(null);
        fetchRequests();
        alert(isAr ? 'تم رفع صورة الأشعة وإرسالها للطبيب بنجاح' : 'Scan image uploaded and sent to doctor successfully');
      }
    } catch (err) { 
      setIsUploading(null);
      console.error("Upload error:", err); 
    }
  };

  const submitFinalResult = async () => {
    if (!selectedRequest) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/radiology-requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ result_text: resultText, status: 'completed' })
      });
      if (res.ok) {
        setShowResultModal(false);
        setResultText('');
        fetchRequests();
        alert(isAr ? 'تم اعتماد التقرير الطبي للأشعة بنجاح' : 'Radiology medical report finalized and sent');
      }
    } catch (err) { console.error("Final result error:", err); }
  };

  const currentRequests = requests.filter(r => {
      const matchesSearch = (r.patient?.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                            (r.patient?.nameEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (r.scan_name_ar?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      
      if (activeTab === 'external') return matchesSearch && matchesStatus && r.isExternal;
      if (activeTab === 'archive') return matchesSearch && r.status === 'completed';
      return false;
  });

  const internalRequests = requests.filter(r => !r.isExternal);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-inter">
      {/* Executive Command Header */}
      <div className="bg-[#0f172a] rounded-[2.5rem] p-5 shadow-2xl border-b-4 border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-80 h-80 bg-slate-500/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
         <div className="flex items-center gap-7 relative z-10">
            <div className="w-20 h-20 bg-slate-800 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-black/20 transform hover:-translate-y-1 transition-all duration-500 border border-slate-700">
               <Scan size={38} className="text-slate-200" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-white tracking-tight">{isAr ? 'مركز الأشعة والتصوير الطبي' : 'Diagnostic Imaging Hub'}</h1>
               <div className="flex items-center gap-2.5 mt-1">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em]">{isAr ? 'إدارة الطلبات والتقارير الطبية' : 'RADIOLOGY WORKFLOW & ARCHIVE'}</p>
               </div>
            </div>
         </div>

         {/* Navigation System - Simplified */}
         <div className="flex bg-slate-800/50 backdrop-blur-2xl p-2 rounded-[2rem] relative z-10 border border-slate-700/50 shadow-inner">
            {[
               { id: 'external', labelAr: 'طلب فحص خارجي', labelEn: 'Direct Entry', icon: Plus },
               { id: 'archive', labelAr: 'سجل الصور والتقارير', labelEn: 'Diagnostic Archive', icon: Database }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-8 py-4 rounded-[1.5rem] text-[11px] font-black transition-all duration-300 ${activeTab === tab.id ? 'bg-slate-700 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-slate-700/30'}`}
               >
                  <tab.icon size={16} />
                  {isAr ? tab.labelAr : tab.labelEn}
               </button>
            ))}
         </div>

         <div className="flex items-center gap-4 relative z-10">
            <button 
               onClick={() => setShowInternalModal(true)}
               className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-900/20">
               <Hospital size={16} />
               {isAr ? 'طلبات المستشفى' : 'Hospital Orders'}
               {internalRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 bg-white text-indigo-600 rounded-full flex items-center justify-center text-[10px] animate-pulse">
                     {internalRequests.filter(r => r.status === 'pending').length}
                  </span>
               )}
            </button>
            <button onClick={onToggleLang} className="w-12 h-12 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 rounded-2xl transition-all border border-slate-700 flex items-center justify-center shadow-lg"><Globe size={22} /></button>
         </div>
      </div>

      {/* Intelligence Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
         {[
            { label: isAr ? 'انتظار التصوير' : 'AWAITING SCAN', value: requests.filter(r => r.status === 'pending').length, icon: <Clock />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: isAr ? 'قيد العمل' : 'IN PROCESSING', value: requests.filter(r => r.status === 'processing').length, icon: <Activity />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
            { label: isAr ? 'حالات عاجلة' : 'STRICT CRITICAL', value: requests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length, icon: <AlertCircle />, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            { label: isAr ? 'تقارير مكتملة' : 'REPORTS READY', value: requests.filter(r => r.status === 'completed').length, icon: <CheckCircle2 />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
         ].map((stat, i) => (
            <div key={i} className={`bg-white rounded-[2.2rem] p-7 border-2 ${stat.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative`}>
               <div className="flex items-center justify-between relative z-10">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>{stat.icon}</div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                     <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Operational Workspace */}
      <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm min-h-[600px]">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-14">
            <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                  {activeTab === 'external' && (isAr ? 'طلبات الأشعة الخارجية' : 'Direct Radiology Orders')}
                  {activeTab === 'archive' && (isAr ? 'أرشيف الصور والتقارير' : 'Diagnostic History & Archive')}
                  {activeTab === 'archive' && <Database className="text-slate-300" size={28} />}
               </h2>
               <p className="text-xs text-slate-400 font-bold mt-2.5 uppercase tracking-[0.35em]">{isAr ? 'معالجة الصور الطبية وإرسال التقارير' : 'HIGH-RESOLUTION IMAGING & REPORT DELIVERY'}</p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-[320px] group/search">
                  <Search className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-slate-900 transition-colors`} size={18} />
                  <input 
                     type="text" 
                     placeholder={isAr ? 'ابحث باسم المريض أو الفحص...' : 'Search clinical records...'} 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className={`w-full bg-slate-50 border-2 border-slate-50 rounded-[1.2rem] ${isAr ? 'pr-12' : 'pl-12'} py-3.5 text-xs font-black focus:ring-8 focus:ring-slate-50 focus:border-slate-200 outline-none transition-all shadow-inner placeholder:text-slate-300`}
                  />
               </div>
               {activeTab !== 'archive' && (
                  <div className="flex bg-slate-100/50 p-1.5 rounded-[1.2rem] border border-slate-100 shadow-inner">
                     {(['all', 'pending', 'processing', 'completed'] as const).map(f => (
                        <button 
                           key={f}
                           onClick={() => setStatusFilter(f)}
                           className={`px-4 py-2.5 rounded-xl text-[9px] font-black transition-all ${statusFilter === f ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                           {isAr ? (f === 'all' ? 'الكل' : f === 'pending' ? 'انتظار' : f === 'processing' ? 'عمل' : 'مكتمل') : f.toUpperCase()}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Visual Records Library */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {currentRequests.length > 0 ? (
               currentRequests.map(req => (
                  <RequestCard key={req.id} req={req} isAr={isAr} isUploading={isUploading} handleUpdateStatus={handleUpdateStatus} setSelectedRequest={setSelectedRequest} setShowResultModal={setShowResultModal} handleUploadFile={handleUploadFile} />
               ))
            ) : (
               <div className="col-span-2 py-40 text-center space-y-7 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
                  <div className="w-24 h-24 bg-white shadow-2xl rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-50">
                     <Package size={52} />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-slate-300 uppercase tracking-[0.25em]">{isAr ? 'لا توجد سجلات حالية' : 'NO RECORDS FOUND'}</h4>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* MODAL: Internal Hospital Requests */}
      {showInternalModal && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/80 backdrop-blur-3xl p-6">
            <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
               <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center border border-white/30">
                        <Hospital size={32} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight">{isAr ? 'الطلبات الداخلية من الأطباء' : 'Internal Clinical Requests'}</h3>
                        <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-[0.3em]">{isAr ? 'إدارة تصوير مرضى المستشفى والعيادات' : 'HOSPITAL IN-PATIENT IMAGING QUEUE'}</p>
                     </div>
                  </div>
                  <button onClick={() => setShowInternalModal(false)} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10"><X size={28} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {internalRequests.length > 0 ? (
                        internalRequests.map(req => (
                           <RequestCard key={req.id} req={req} isAr={isAr} isUploading={isUploading} handleUpdateStatus={handleUpdateStatus} setSelectedRequest={setSelectedRequest} setShowResultModal={setShowResultModal} handleUploadFile={handleUploadFile} />
                        ))
                     ) : (
                        <div className="col-span-2 py-20 text-center text-slate-300 font-black uppercase tracking-widest">{isAr ? 'لا توجد طلبات داخلية حالياً' : 'No internal clinical requests'}</div>
                     )}
                  </div>
               </div>
               <div className="p-8 bg-white border-t border-slate-100 flex justify-center italic text-xs text-slate-400 font-bold">
                  {isAr ? 'يتم عرض جميع الطلبات الواردة من الطاقم الطبي بالمستشفى هنا' : 'All requests originating from hospital medical staff are displayed here'}
               </div>
            </div>
         </div>
      )}

      {/* Modern High-End Report Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-6">
           <div className="bg-white rounded-[4rem] shadow-[0_48px_128px_rgba(0,0,0,0.4)] w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-xl">
                       <FileText size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{isAr ? 'التقرير الطبي النهائي للأشعة' : 'Final Diagnostic Radiography Report'}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">{isAr ? 'اعتماد النتائج وإرسالها للطبيب المعالج' : 'CLINICAL VALIDATION & TRANSMISSION'}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowResultModal(false)} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10"><X size={28} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-10">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center justify-between border-2 border-slate-100">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center font-black text-xl">
                              {selectedRequest?.patient?.nameEn?.charAt(0)}
                           </div>
                           <div>
                              <p className="text-lg font-black text-slate-800 tracking-tight uppercase">{isAr ? selectedRequest?.patient?.nameAr : selectedRequest?.patient?.nameEn}</p>
                              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{isAr ? selectedRequest?.scan_name_ar : selectedRequest?.scan_name_en}</p>
                           </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? 'التشخيص والنتائج التفصيلية' : 'DIAGNOSTIC FINDINGS'}</label>
                       <textarea 
                          rows={12}
                          value={resultText}
                          onChange={e => setResultText(e.target.value)}
                          className={`w-full bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] p-10 text-base font-black text-slate-800 focus:ring-[15px] focus:ring-slate-50 focus:border-slate-200 outline-none transition-all resize-none shadow-inner placeholder:text-slate-300 leading-relaxed`}
                          placeholder={isAr ? 'اكتب التقارير الطبية والملاحظات التشخيصية هنا...' : 'Identify anomalies, pathologies, and clinical findings here...'}
                       ></textarea>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="w-full aspect-[4/3] bg-slate-900 rounded-[3rem] border-8 border-slate-50 overflow-hidden relative shadow-2xl group flex items-center justify-center">
                       {selectedRequest?.result_file_url ? (
                          <>
                            <img src={selectedRequest?.result_file_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" alt="Scan" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 backdrop-blur-md">
                               <button className="w-16 h-16 bg-white text-slate-900 rounded-3xl shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"><Eye size={32} /></button>
                               <button className="w-16 h-16 bg-white text-slate-900 rounded-3xl shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"><Download size={32} /></button>
                            </div>
                          </>
                       ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900">
                             <ImageIcon size={100} className="mb-6 opacity-30" />
                             <p className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">{isAr ? 'بانتظار رفع الصورة' : 'AWAITING IMAGE UPLOAD'}</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-12 bg-slate-50 border-t border-slate-100 flex gap-6 items-center">
                 <button onClick={() => setShowResultModal(false)} className="flex-1 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.3em] hover:text-rose-500 transition-colors">{isAr ? 'إلغاء الإرسال' : 'ABORT TRANSMISSION'}</button>
                 <button onClick={submitFinalResult} className="flex-[2] bg-slate-900 text-white rounded-[2.2rem] py-6 text-xs font-black shadow-[0_24px_48px_rgba(15,23,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                    <Send size={24} />
                    {isAr ? 'اعتماد وإرسال للطبيب' : 'Validate & Export to Clinician'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

/* ───────── Sub-Components ───────── */
const RequestCard = ({ req, isAr, isUploading, handleUpdateStatus, setSelectedRequest, setShowResultModal, handleUploadFile }: any) => (
   <div className="bg-white border-2 border-slate-50 p-7 rounded-[3rem] hover:shadow-2xl transition-all group/item hover:border-slate-100 relative shadow-sm">
      <div className="flex items-start justify-between">
         <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[1.8rem] border border-slate-100 flex items-center justify-center overflow-hidden group-hover/item:border-slate-900 transition-all shadow-inner">
               {req.result_file_url ? (
                  <img src={req.result_file_url} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" alt="Scan" />
               ) : (
                  <ImageIcon size={32} />
               )}
            </div>
            <div className="space-y-1.5">
               <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover/item:text-slate-950 transition-colors uppercase">{isAr ? req.patient?.nameAr : req.patient?.nameEn}</h4>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-slate-900 text-white px-3 py-0.5 rounded-lg font-black tracking-widest uppercase italic">#ID-{req.patient?.id || '991'}</span>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(req.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-8 bg-slate-900/5 p-6 rounded-[2.2rem] border border-slate-50 group-hover/item:bg-slate-50 transition-all">
         <h3 className="text-lg font-black text-slate-900">{isAr ? req.scan_name_ar : req.scan_name_en}</h3>
         <div className={`mt-3 px-3 py-1 rounded-full text-[9px] font-black inline-block ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isAr ? 
               (req.status === 'pending' ? 'في الانتظار' : req.status === 'processing' ? 'قيد التصوير' : 'النتيجة جاهزة') : 
               req.status.toUpperCase()}
         </div>
      </div>

      <div className="mt-8 flex items-center justify-between pt-7 border-t border-slate-50">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">RT</div>
            <div>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isAr ? (req.isExternal ? 'فحص خارجي' : 'الطبيب المعالج') : (req.isExternal ? 'EXTERNAL SCAN' : 'REQUESTING DOCTOR')}</p>
               <p className="text-xs font-black text-slate-700">{req.isExternal ? (isAr ? 'بدون طبيب' : 'Walk-in') : `Dr. ${req.doctor?.name || 'Staff'}`}</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {req.status === 'pending' && (
               <button onClick={() => handleUpdateStatus(req.id, 'processing')} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:scale-105 transition-all">
                  <Scan size={16}/> {isAr ? 'بدء التصوير' : 'Begin Scan'}
               </button>
            )}
            {req.status === 'processing' && (
               <button onClick={() => { setSelectedRequest(req); setShowResultModal(true); }} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-2xl hover:scale-105 transition-all">
                  <Plus size={16}/> {isAr ? 'إدخال التقرير' : 'Add Report'}
               </button>
            )}

            <label className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all cursor-pointer ${
               isUploading === req.id ? 'bg-slate-100 text-slate-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white'
            }`}>
               <input type="file" className="hidden" disabled={isUploading === req.id} onChange={(e) => e.target.files?.[0] && handleUploadFile(req.id, e.target.files[0])} />
               {isUploading === req.id ? <RefreshCw size={20} className="animate-spin" /> : <Upload size={20} />}
            </label>
            
            {req.status === 'completed' && req.result_file_url && (
               <a href={req.result_file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                  <Eye size={20} />
               </a>
            )}
         </div>
      </div>
   </div>
);

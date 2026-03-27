import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Search, Clock, CheckCircle2, AlertCircle, 
  FileText, Upload, Send, Filter, MoreVertical, X, Eye, 
  Download, ChevronRight, Activity, Beaker, Printer, Bell, Globe, LayoutDashboard, History, Database, UserCheck, Plus, Package, CreditCard, RefreshCw, Hospital, Lightbulb, Info, ExternalLink, Calendar, UserPlus
} from 'lucide-react';

/* ───────── Types ───────── */
interface LabRequest {
  id: number;
  patient_id: number;
  doctor_id?: number;
  test_name_ar: string;
  test_name_en: string;
  amount?: number;
  test_date?: string;
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

interface LaboratoryPageProps {
  isAr: boolean;
  tx: any;
  notifications?: any[];
  onToggleLang?: () => void;
}

export const LaboratoryPage: React.FC<LaboratoryPageProps> = ({ isAr, tx, notifications = [], onToggleLang }) => {
  const [requests, setRequests] = useState<LabRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'external' | 'archive'>('external');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
  const [resultText, setResultText] = useState('');
  const [isUploading, setIsUploading] = useState<number | null>(null);

  // Form State for new external order
  const [newOrder, setNewOrder] = useState({
     patientName: '',
     patientAge: '',
     testId: '',
     testName: '',
     testDate: new Date().toISOString().split('T')[0],
     testCost: 0,
     priority: 'normal' as 'normal' | 'urgent',
     notes: ''
  });
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const [reqRes, testRes] = await Promise.all([
        fetch('/api/lab-requests', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
        fetch('/api/lab-tests', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } })
      ]);
      
      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests((data.data || []).map((r: any) => ({ ...r, isExternal: !r.doctor_id })));
      }
      if (testRes.ok) {
        const testData = await testRes.json();
        setAvailableTests(testData.data || []);
      }
    } catch (err) { console.error("Lab fetch error:", err); }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/lab-requests/${id}`, {
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

  const handleCreateExternalOrder = async () => {
     if (!newOrder.patientName || !newOrder.testName) {
        alert(isAr ? 'يرجى إدخال اسم المريض ونوع الفحص' : 'Please enter patient name and test name');
        return;
     }

     const token = localStorage.getItem('token');
     try {
        const res = await fetch('/api/lab-requests/external', {
           method: 'POST',
           headers: { 
              'Authorization': `Bearer ${token}`, 
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           },
           body: JSON.stringify({
              patient_name: newOrder.patientName,
              patient_age: newOrder.patientAge,
              test_name_ar: newOrder.testName,
              test_name_en: newOrder.testName,
              test_date: newOrder.testDate,
              amount: newOrder.testCost,
              priority: newOrder.priority,
              notes: newOrder.notes,
              status: 'pending'
           })
        });
        if (res.ok) {
           setShowNewOrderModal(false);
           setNewOrder({ patientName: '', patientAge: '', testId: '', testName: '', testDate: new Date().toISOString().split('T')[0], testCost: 0, priority: 'normal', notes: '' });
           fetchRequests();
           alert(isAr ? 'تم تسجيل طلب الفحص بنجاح' : 'Lab order registered successfully');
        }
     } catch (err) { console.error("Create order error:", err); }
  };

  const handleUploadFile = async (id: number, file: File) => {
    setIsUploading(id);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/lab-requests/${id}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        setIsUploading(null);
        fetchRequests();
        alert(isAr ? 'تم رفع النتيجة بنجاح' : 'Result uploaded successfully');
      }
    } catch (err) { 
      setIsUploading(null);
      console.error("Upload error:", err); 
    }
  };

  const currentRequests = requests.filter(r => {
      const matchesSearch = (r.patient?.nameAr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                            (r.patient?.nameEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (r.test_name_ar?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (r.patient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      
      if (activeTab === 'external') return matchesSearch && matchesStatus && r.isExternal;
      if (activeTab === 'archive') return matchesSearch && r.status === 'completed';
      return false;
  });

  const internalRequests = requests.filter(r => !r.isExternal);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-cairo">
      {/* Header */}
      <div className="bg-[#1e1b4b] rounded-[2.5rem] p-4 shadow-2xl border-b-4 border-indigo-500 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="flex items-center gap-6 relative z-10 transition-transform hover:scale-[1.02]">
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-500/20 transform -rotate-6 hover:rotate-0 transition-all duration-500 shadow-inner">
               <Beaker size={32} />
            </div>
            <div>
               <h1 className="text-2xl font-black text-white tracking-tight">{isAr ? 'بوابة المختبر والتحاليل' : 'Advanced Laboratory Hub'}</h1>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-[0.2em]">{isAr ? 'إدارة التحاليل والنتائج المركزية' : 'CENTRAL DIAGNOSTICS & MANAGEMENT'}</p>
               </div>
            </div>
         </div>

         <div className="flex bg-white/5 backdrop-blur-xl p-1.5 rounded-[1.5rem] relative z-10 border border-white/10 shadow-inner">
            {[
               { id: 'external', labelAr: 'طلبات خارجية', labelEn: 'External Requests', icon: Plus },
               { id: 'archive', labelAr: 'سجل المرضى', labelEn: 'Patient Records', icon: Database }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black transition-all duration-300 ${activeTab === tab.id ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-indigo-200/60 hover:text-white hover:bg-white/5'}`}
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
                  <span className="w-5 h-5 bg-white text-indigo-600 rounded-full flex items-center justify-center text-[10px] animate-pulse font-black">
                     {internalRequests.filter(r => r.status === 'pending').length}
                  </span>
               )}
            </button>
            <button onClick={onToggleLang} className="w-11 h-11 bg-white/10 text-indigo-100 hover:text-indigo-400 rounded-2xl transition-all border border-white/10 flex items-center justify-center hover:scale-110 shadow-lg"><Globe size={20} /></button>
         </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
            { label: isAr ? 'انتظار الفحص' : 'QUEUED', value: requests.filter(r => r.status === 'pending').length, icon: <Clock />, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: isAr ? 'قيد العمل' : 'IN ANALYSIS', value: requests.filter(r => r.status === 'processing').length, icon: <Activity />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: isAr ? 'عاجل جداً' : 'URGENT PRIOR', value: requests.filter(r => r.priority === 'urgent' && r.status !== 'completed').length, icon: <AlertCircle />, color: 'text-rose-600', bg: 'bg-rose-50' },
            { label: isAr ? 'نتائج اليوم' : 'DELIVERED', value: requests.filter(r => r.status === 'completed').length, icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' }
         ].map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative border-b-4 border-b-transparent hover:border-b-indigo-500">
               <div className="flex items-center justify-between relative z-10">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 shadow-inner`}>{stat.icon}</div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                     <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Main Area */}
      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm min-h-[500px] group">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
            <div>
               <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                  {activeTab === 'external' && (isAr ? 'طلبات الفحص الخارجية' : 'External Cash Analysis')}
                  {activeTab === 'archive' && (isAr ? 'الأرشيف والملفات الصحية' : 'Diagnostic History & Files')}
               </h2>
               <p className="text-xs text-indigo-500 font-bold mt-2 uppercase tracking-[0.3em]">{isAr ? 'معالجة التحاليل وإرسال التقارير' : 'PRECISION ANALYSIS & REPORT DELIVERY'}</p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-[320px] group/search">
                  <Search className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within/search:text-indigo-600 transition-colors`} size={18} />
                  <input 
                     type="text" 
                     placeholder={isAr ? 'ابحث باسم المريض أو الفحص...' : 'Search clinical records...'} 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className={`w-full bg-indigo-50/30 border-2 border-indigo-50/50 rounded-[1.2rem] ${isAr ? 'pr-12' : 'pl-12'} py-4 text-xs font-black focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all shadow-inner placeholder:text-indigo-200`}
                  />
               </div>
               {activeTab === 'external' && (
                  <button 
                     onClick={() => setShowNewOrderModal(true)}
                     className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                     <UserPlus size={18} />
                     {isAr ? 'طلب فحص خارجي جديد' : 'New External Order'}
                  </button>
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {currentRequests.map(req => (
               <LabRequestCard key={req.id} req={req} isAr={isAr} isUploading={isUploading} handleUpdateStatus={handleUpdateStatus} setSelectedRequest={setSelectedRequest} setShowResultModal={setShowResultModal} handleUploadFile={handleUploadFile} />
            ))}
         </div>
      </div>

      {/* MODAL: New External Order */}
      {showNewOrderModal && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100">
               <div className="p-6 border-b-2 border-amber-200 flex items-center justify-between bg-amber-500 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner">
                        <UserPlus size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-black tracking-tight uppercase">{isAr ? 'إنشاء طلب فحص خارجي' : 'New Lab Order'}</h3>
                        <p className="text-[9px] text-amber-100 font-bold uppercase tracking-[0.4em]">{isAr ? 'تسجيل كاش خارجي مباشر' : 'EXTERNAL CASH INTAKE'}</p>
                     </div>
                  </div>
                  <button onClick={() => setShowNewOrderModal(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md relative z-10"><X size={20} /></button>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                     <div className="col-span-3 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'اسم المريض' : 'Patient Name'}</label>
                        <input 
                           type="text" 
                           value={newOrder.patientName}
                           onChange={e => setNewOrder({...newOrder, patientName: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3.5 text-xs font-black focus:border-amber-200 outline-none transition-all shadow-inner"
                           placeholder="Ex: Ahmed Mohamed"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'العمر' : 'Age'}</label>
                        <input 
                           type="number" 
                           value={newOrder.patientAge}
                           onChange={e => setNewOrder({...newOrder, patientAge: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3.5 text-xs font-black focus:border-amber-200 outline-none transition-all shadow-inner"
                           placeholder="25"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                        <Beaker size={12} className="text-amber-500" />
                        {isAr ? 'الفحص المطلوب' : 'Diagnostic Unit'}
                     </label>
                     <div className="relative group/sel">
                        <select 
                           value={newOrder.testId}
                           onChange={e => {
                              const test = availableTests.find(t => t.id === Number(e.target.value));
                              setNewOrder({
                                 ...newOrder, 
                                 testId: e.target.value, 
                                 testName: test ? (isAr ? (test.name_ar || test.nameAr) : (test.name_en || test.nameEn)) : '',
                                 testCost: test ? test.cost : 0
                              });
                           }}
                           className="w-full bg-white border-2 border-slate-100 hover:border-amber-100 rounded-[1.2rem] px-6 py-4 text-xs font-black text-slate-800 focus:ring-4 focus:ring-amber-50 focus:border-amber-200 outline-none transition-all shadow-inner appearance-none cursor-pointer">
                           <option value="">{isAr ? '-- اختر الفحص من الدليل --' : '-- Select Diagnosis --'}</option>
                           {availableTests.map(t => (
                              <option key={t.id} value={t.id}>{isAr ? (t.name_ar || t.nameAr) : (t.name_en || t.nameEn)}</option>
                           ))}
                        </select>
                        <ChevronRight className={`absolute ${isAr ? 'left-5' : 'right-5'} top-1/2 -translate-y-1/2 text-amber-500 rotate-90 pointer-events-none group-focus-within/sel:rotate-[-90deg] transition-transform`} size={16} />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'الأولوية' : 'Priority'}</label>
                        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                           <button onClick={() => setNewOrder({...newOrder, priority: 'normal'})} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${newOrder.priority === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{isAr ? 'عادي' : 'Normal'}</button>
                           <button onClick={() => setNewOrder({...newOrder, priority: 'urgent'})} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${newOrder.priority === 'urgent' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>{isAr ? 'عاجل' : 'Urgent'}</button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'تاريخ الفحص' : 'Date of Analysis'}</label>
                        <input 
                           type="date" 
                           value={newOrder.testDate}
                           onChange={e => setNewOrder({...newOrder, testDate: e.target.value})}
                           className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-amber-200 transition-all shadow-inner"
                        />
                     </div>
                  </div>

                  <div className="pt-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                        <CreditCard size={12} className="text-amber-500" />
                        {isAr ? 'قيمة الفحص الإجمالية' : 'Standard Diagnostic Fee'}
                     </label>
                     <div className="mt-2 bg-amber-50/50 p-6 rounded-[1.8rem] border border-amber-100 flex items-center justify-between shadow-inner">
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">{isAr ? 'المبلغ المستحق كاش' : 'Cash Due Amount'}</span>
                        <div className="flex items-center gap-1.5">
                           <span className="text-3xl font-black text-amber-600 tracking-tighter">{newOrder.testCost.toLocaleString()}</span>
                           <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">SDG</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button onClick={() => setShowNewOrderModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'إلغاء' : 'Abort'}</button>
                  <button 
                     onClick={handleCreateExternalOrder}
                     className="flex-[2] bg-slate-900 text-white rounded-[1.2rem] py-5 text-[10px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-2 uppercase tracking-[0.3em]">
                     <Send size={18} />
                     {isAr ? 'تأكيد الطلب' : 'Confirm Order'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* MODAL: Internal Orders */}
      {showInternalModal && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center bg-indigo-950/80 backdrop-blur-3xl p-6">
            <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
               <div className="p-10 border-b border-indigo-100 flex items-center justify-between bg-indigo-600 text-white shadow-xl">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-inner">
                        <Hospital size={32} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tight">{isAr ? 'طلبات تحاليل المستشفى' : 'Clinician Lab Requests'}</h3>
                        <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-[0.3em]">{isAr ? 'إدارة تحاليل الأقسام والعيادات الداخلية' : 'HOSPITAL IN-PATIENT LAB QUEUE'}</p>
                     </div>
                  </div>
                  <button onClick={() => setShowInternalModal(false)} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 shadow-inner"><X size={28} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {internalRequests.map(req => (
                        <LabRequestCard key={req.id} req={req} isAr={isAr} isUploading={isUploading} handleUpdateStatus={handleUpdateStatus} setSelectedRequest={setSelectedRequest} setShowResultModal={setShowResultModal} handleUploadFile={handleUploadFile} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Result Entry Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-indigo-950/60 backdrop-blur-xl p-4">
           <div className="bg-white rounded-[3.5rem] shadow-[0_32px_128px_rgba(30,27,75,0.4)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col border border-slate-100">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white shadow-lg">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                       <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">{isAr ? 'تقرير مخبري نهائي' : 'Final Diagnostic Report'}</h3>
                        <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">{isAr ? 'إرسال النتيجة إلى الطبيب المعالج' : 'Transmission to clinician'}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowResultModal(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8 flex-1 overflow-y-auto">
                 <textarea 
                    rows={8}
                    value={resultText}
                    onChange={e => setResultText(e.target.value)}
                    className="w-full bg-slate-50 border-4 border-slate-50 rounded-[2.5rem] p-8 text-base font-black text-gray-800 focus:border-indigo-200 outline-none transition-all shadow-inner resize-none"
                    placeholder="Results and findings..."
                 ></textarea>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const LabRequestCard = ({ req, isAr, isUploading, handleUpdateStatus, setSelectedRequest, setShowResultModal, handleUploadFile }: any) => (
   <div className="bg-white border-2 border-indigo-50/50 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-100/30 transition-all group/item hover:border-indigo-100 shadow-sm relative overflow-hidden">
      <div className="flex items-start justify-between relative z-10">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner font-black uppercase">{req.patient?.nameEn?.charAt(0) || req.patient_name?.charAt(0) || 'P'}</div>
            <div>
               <h4 className="text-base font-black text-slate-800 group-hover/item:text-indigo-600 transition-colors">{isAr ? (req.patient?.nameAr || req.patient_name) : (req.patient?.nameEn || req.patient_name)}</h4>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{isAr ? req.test_name_ar : req.test_name_en}</p>
            </div>
         </div>
         <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{req.priority}</div>
      </div>
      <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-50">
        <div className="flex items-center gap-2">
           <Clock size={14} className="text-slate-300" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'في الانتظار' : 'Pending'}</span>
        </div>
        <div className="flex items-center gap-2">
           {req.status === 'pending' && <button onClick={() => handleUpdateStatus(req.id, 'processing')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase hover:bg-black transition-all">Begin</button>}
           <label className="w-9 h-9 bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white rounded-xl flex items-center justify-center cursor-pointer transition-all border border-slate-100 shadow-inner">
               <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleUploadFile(req.id, e.target.files[0])} />
               <Upload size={16} />
           </label>
        </div>
      </div>
   </div>
);

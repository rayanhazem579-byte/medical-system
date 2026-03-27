import React, { useState, useEffect } from 'react';
import { 
  Users, ClipboardList, Pill, Bell, Activity, Search, 
  ExternalLink, FileText, Trash2, Send, Save, CheckCircle2, 
  Clock, FlaskConical, Stethoscope, X, Eye, AlertCircle, Key, Mail, Globe, KeyRound, Scan, Image as ImageIcon
} from 'lucide-react';

/* ───────── Types ───────── */
export interface Patient {
  id: number;
  nameAr: string;
  nameEn: string;
  medicalId: string;
  age: number;
  gender: 'male' | 'female';
  lastVisit: string;
  status: 'waiting' | 'in-progress' | 'completed';
  diagnosis?: string;
}

export interface LabResult {
  id: number;
  patientId: number;
  testNameAr: string;
  testNameEn: string;
  result: string;
  date: string;
  status: 'normal' | 'abnormal';
}

interface DoctorPortalProps {
  isAr: boolean;
  tx: any;
  onSendPrescription?: (p: any) => void;
  onSendLabRequest?: (l: any) => void;
  onSendRadiologyRequest?: (r: any) => void;
  onAddNotification?: (text: string, type: string) => void;
  doctors?: any[];
  notifications?: any[];
  onToggleLang?: () => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ isAr, tx, onSendPrescription, onSendLabRequest, onSendRadiologyRequest, onAddNotification, notifications: globalNotifications = [], onToggleLang }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isLabRequestModalOpen, setIsLabRequestModalOpen] = useState(false);
  const [isDiagnosisModalOpen, setIsDiagnosisModalOpen] = useState(false);
  const [prescData, setPrescData] = useState({ medication: '', dosage: '', frequency: 'Once daily', instructions: '' });
  const [labReqData, setLabReqData] = useState({ test_name_ar: '', test_name_en: '', notes: '', priority: 'normal' });
  const [radiologyReqData, setRadiologyReqData] = useState({ scan_name_ar: '', scan_name_en: '', notes: '', priority: 'normal' });
  const [diagnosis, setDiagnosis] = useState('');
  const [hasFollowUp, setHasFollowUp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Password Change States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passStep, setPassStep] = useState(1);
  const [passStepCode, setPassStepCode] = useState('');
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'emergency', messageAr: 'استدعاء عاجل من المرضى - قسم الطوارئ', messageEn: 'Urgent summons from patients - Emergency Dept', time: '10:30 AM', active: true },
    { id: 2, type: 'clinic', messageAr: 'مريض جديد بانتظارك في العيادة', messageEn: 'New patient waiting in the clinic', time: '10:45 AM', active: true }
  ]);

  const [patients] = useState<Patient[]>([
    { id: 1, nameAr: 'أحمد محمد علي', nameEn: 'Ahmed Mohammed Ali', medicalId: 'PAT-5532', age: 45, gender: 'male', lastVisit: '2024-03-10', status: 'waiting' },
    { id: 2, nameAr: 'سارة عبد الله', nameEn: 'Sara Abdullah', medicalId: 'PAT-4211', age: 28, gender: 'female', lastVisit: '2024-02-15', status: 'in-progress' },
    { id: 3, nameAr: 'خالد حسن الفاتح', nameEn: 'Khaled Hassan', medicalId: 'PAT-9088', age: 60, gender: 'male', lastVisit: '2024-01-20', status: 'completed' },
  ]);

  const [labResults, setLabResults] = useState<any[]>([]);
  const [radiologyResults, setRadiologyResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      try {
        const [labRes, radRes] = await Promise.all([
          fetch('/api/lab-requests', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } }),
          fetch('/api/radiology-requests', { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } })
        ]);
        
        if (labRes.ok) {
          const labData = await labRes.json();
          setLabResults(labData.data || []);
        }
        if (radRes.ok) {
          const radData = await radRes.json();
          // Radiology might return data.data or just an array depending on pagination
          setRadiologyResults(radData.data || (Array.isArray(radData) ? radData : []));
        }
      } catch (err) { console.error("Fetch errors:", err); }
    };
    fetchResults();
  }, []);

  const handleCancelAll = () => {
    if (confirm(isAr ? 'هل أنت متأكد من إلغاء جميع مواعيد اليوم؟' : 'Are you sure you want to cancel all today\'s appointments?')) {
      onAddNotification?.(isAr ? 'تم إلغاء جميع مواعيد الطبيب لهذا اليوم' : 'All today\'s appointments for the doctor have been cancelled', 'appointment');
      alert(isAr ? 'تم إلغاء المواعيد وإخطار الإدارة' : 'Appointments cancelled and management notified');
    }
  };

  const textAlign = isAr ? 'text-right' : 'text-left';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Portal Header with Bell & Language */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
               <Stethoscope size={28} />
            </div>
            <div>
               <h1 className="text-xl font-black text-gray-800">{isAr ? 'بوابة الطبيب' : 'Doctor Portal'}</h1>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{isAr ? 'لوحة التحكم والعمليات الطبية' : 'Medical Operations & Dashboard'}</p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              onClick={onToggleLang}
              className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-gray-100 flex items-center justify-center shadow-sm"
              title={isAr ? 'تغيير اللغة' : 'Change Language'}
            >
               <Globe size={22} />
            </button>
            <div className="relative">
               <button 
                 onClick={() => setShowNotifications(!showNotifications)}
                 className={`w-12 h-12 rounded-2xl transition-all border border-gray-100 flex items-center justify-center shadow-sm ${showNotifications ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50'}`}>
                  <Bell size={22} />
               </button>
               {globalNotifications.length > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {globalNotifications.length}
                 </span>
               )}

               {showNotifications && (
                 <div className={`absolute top-14 ${isAr ? 'left-0' : 'right-0'} w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[150] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300`}>
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                       <h3 className="text-sm font-black text-gray-800">{isAr ? 'التنبيهات' : 'Notifications'}</h3>
                       <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold">{globalNotifications.length}</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                       {globalNotifications.length > 0 ? (
                         globalNotifications.map((n, i) => (
                           <div key={i} className="p-4 border-b border-gray-50 hover:bg-primary-50/30 transition-all cursor-pointer group">
                             <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                  n.type === 'emergency' ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-600'
                                } group-hover:bg-primary-600 group-hover:text-white`}>
                                   {n.type === 'emergency' ? <AlertCircle size={14} /> : <Bell size={14} />}
                                </div>
                                <div className="flex-1">
                                   <p className="text-xs font-bold text-gray-800 line-clamp-2">{n.text}</p>
                                   <p className="text-[10px] text-gray-400 mt-0.5">{n.time || 'Just now'}</p>
                                </div>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                               <Bell size={20} />
                            </div>
                            <p className="text-xs text-gray-400 font-bold">{isAr ? 'لا توجد تنبيهات جديدة' : 'No new notifications'}</p>
                         </div>
                       )}
                    </div>
                    {globalNotifications.length > 0 && (
                      <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                         <button className="text-[10px] font-black text-primary-600 hover:underline uppercase tracking-widest">{isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}</button>
                      </div>
                    )}
                 </div>
               )}
            </div>
            <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>
            <div className="text-right hidden sm:block">
               <p className="text-xs font-black text-gray-800">Dr. Sami Ahmed</p>
               <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{isAr ? 'متصل الآن' : 'ONLINE NOW'}</p>
            </div>
         </div>
      </div>

      {/* Notifications Bar (Simulated alerts for this demo) */}
      <div className="flex flex-col md:flex-row gap-4">
        {notifications.map(note => (
          <div key={note.id} className={`flex-1 flex items-center justify-between p-4 rounded-2xl border ${note.type === 'emergency' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'} shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${note.type === 'emergency' ? 'bg-red-500' : 'bg-amber-500'} text-white animate-pulse`}>
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">{isAr ? note.messageAr : note.messageEn}</p>
                <p className="text-[11px] opacity-70">{note.time}</p>
              </div>
            </div>
            <button className="text-sm font-bold underline cursor-pointer">{isAr ? 'عرض المواقع' : 'View Location'}</button>
          </div>
        ))}
      </div>

      {/* Main Search and Stats */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
         <div className="flex-1 w-full text-right">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{isAr ? 'البحث في سجلات المرضى' : 'Search All Patient Records'}</label>
            <div className="relative">
               <Search size={20} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-primary-400`} />
               <input type="text" placeholder={isAr ? 'ابحث باسم المريض أو الرقم الطبي...' : 'Search by name or medical ID...'} className={`w-full bg-primary-50/30 border border-primary-100 rounded-2xl ${isAr ? 'pr-14' : 'pl-14'} py-5 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder-gray-400`} />
            </div>
         </div>
         <div className="flex gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 min-w-[120px] text-center">
               <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">{isAr ? 'تم فحصهم' : 'Processed'}</p>
               <p className="text-2xl font-black text-emerald-700">12</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 min-w-[120px] text-center">
               <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">{isAr ? 'في الانتظار' : 'Waiting'}</p>
               <p className="text-2xl font-black text-amber-700">03</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Patients List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{isAr ? 'مرضى اليوم' : "Today's Patients"}</h2>
                  <p className="text-xs text-gray-400">{isAr ? 'قائمة المتابعة اليومية' : 'Daily follow-up list'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-1 rounded-full">{isAr ? '2 متبقين' : '2 remaining'}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className={`${textAlign} px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest`}>{isAr ? 'المريض' : 'Patient'}</th>
                    <th className={`${textAlign} px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest`}>{isAr ? 'الرقم الطبي' : 'Medical ID'}</th>
                    <th className={`${textAlign} px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest`}>{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="text-center px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map(patient => (
                    <tr key={patient.id} className="hover:bg-primary-50/5 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:bg-primary-500 group-hover:text-white transition-all">
                             {patient.nameEn.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-800">{isAr ? patient.nameAr : patient.nameEn}</p>
                             <p className="text-[11px] text-gray-400">{patient.age} {isAr ? 'سنة' : 'yrs'} | {isAr ? (patient.gender === 'male' ? 'ذكر' : 'أنثى') : patient.gender}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-primary-600/70">{patient.medicalId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          patient.status === 'waiting' ? 'bg-amber-50 text-amber-600' : 
                          patient.status === 'in-progress' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            patient.status === 'waiting' ? 'bg-amber-500' : 
                            patient.status === 'in-progress' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`} />
                          {isAr ? 
                            (patient.status === 'waiting' ? 'في الانتظار' : 
                             patient.status === 'in-progress' ? 'قيد الكشف' : 'مكتمل') : 
                            patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setSelectedPatient(patient); setIsRecordModalOpen(true); }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-primary-600 bg-primary-50/50 hover:bg-primary-500 hover:text-white transition-all shadow-sm border border-primary-100/50" title={isAr ? 'السجل الطبي' : 'Medical Record'}>
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedPatient(patient); setIsPrescriptionModalOpen(true); }}
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100/50" title={isAr ? 'وصفة طبية' : 'Prescription'}>
                            <Pill size={18} />
                          </button>
                          <button 
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-amber-600 bg-amber-50/50 hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100/50" title={isAr ? 'تأخير' : 'Delay'}>
                            <Clock size={18} />
                          </button>
                          <button 
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-600 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100/50" title={isAr ? 'إلغاء' : 'Cancel'}>
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Diagnostic Data */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{isAr ? 'بيانات التشخيص من المعمل' : 'Lab Diagnostic Data'}</h2>
                  <p className="text-xs text-gray-400">{isAr ? 'النتائج الواردة حديثاً' : 'Newly received results'}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-primary-500 hover:underline">{isAr ? 'عرض الكل' : 'View All'}</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labResults.slice(0, 4).map(result => (
                <div key={result.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-3 relative overflow-hidden group">
                  <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-1 h-full ${result.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">{isAr ? result.test_name_ar : result.test_name_en}</p>
                    <span className="text-[10px] font-mono text-gray-400">#RES-{result.id}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-xl">
                    <span className="text-xs text-gray-500">{isAr ? 'النتيجة:' : 'Result:'}</span>
                    <span className={`text-sm font-black ${result.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {result.result_text || (isAr ? 'قيد الانتظار' : 'Pending')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{new Date(result.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radiology Diagnostic Data */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Scan size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{isAr ? 'بيانات الأشعة والتصوير' : 'Radiology Diagnostic Data'}</h2>
                  <p className="text-xs text-gray-400">{isAr ? 'الصور والتقارير الواردة' : 'Received scans & reports'}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-primary-500 hover:underline">{isAr ? 'عرض الكل' : 'View All'}</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {radiologyResults.slice(0, 4).map(result => (
                <div key={result.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-3 relative overflow-hidden group">
                  <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-1 h-full ${result.status === 'completed' ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">{isAr ? result.scan_name_ar : result.scan_name_en}</p>
                    <div className="flex items-center gap-2">
                      {result.result_file_url && <ImageIcon size={14} className="text-indigo-500" />}
                      <span className="text-[10px] font-mono text-gray-400">#RAD-{result.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-gray-100 p-2 rounded-xl">
                    <span className="text-xs text-gray-500">{isAr ? 'الحالة:' : 'Status:'}</span>
                    <span className={`text-sm font-black ${result.status === 'completed' ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {result.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'قيد الانتظار' : 'Pending')}
                    </span>
                  </div>
                  {result.status === 'completed' && (
                    <button 
                      onClick={() => result.result_file_url && window.open(result.result_file_url, '_blank')}
                      className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all">
                      {isAr ? 'عرض التقرير والصورة' : 'View Report & Scan'}
                    </button>
                  )}
                </div>
              ))}
              {radiologyResults.length === 0 && (
                <div className="col-span-2 p-8 text-center text-gray-400 text-xs font-bold italic">
                  {isAr ? 'لا توجد نتائج أشعة حالياً' : 'No radiology results found'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Status / Active Patient Call */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Stethoscope size={20} />
                {isAr ? 'الآن في العيادة' : 'Current Active Patient'}
              </h3>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-[11px] opacity-70 mb-1">{isAr ? 'الحالة الحالية' : 'Current Case'}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg">سارة عبد الله</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">PAT-4211</span>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-1.5 px-1">
                         <FlaskConical size={12} />
                         {isAr ? 'طلب فحوصات المعمل' : 'Lab Test Requests'}
                      </label>
                      <div className="flex gap-2">
                         <textarea 
                           rows={3}
                           value={labReqData.notes}
                           onChange={e => setLabReqData({...labReqData, notes: e.target.value})}
                           placeholder={isAr ? 'اكتب كل الفحوصات المطلوبة هنا...' : 'Write all required tests here...'}
                           className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all resize-none font-medium"
                         ></textarea>
                         <button 
                           onClick={() => {
                             if (!labReqData.notes) return;
                             onSendLabRequest?.({ 
                               patient_id: 2, 
                               patient_name: 'سارة عبد الله',
                               test_name_ar: labReqData.notes,
                               test_name_en: labReqData.notes,
                               notes: labReqData.notes,
                               priority: 'normal'
                             });
                             setLabReqData({ test_name_ar: '', test_name_en: '', notes: '', priority: 'normal' });
                           }} 
                           className="bg-white/20 hover:bg-white text-white hover:text-primary-700 p-4 rounded-2xl transition-all self-end shadow-lg flex items-center justify-center border border-white/10"
                         >
                            <Send size={18} />
                         </button>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-1.5 px-1">
                         <Pill size={12} />
                         {isAr ? 'روشتة الصيدلية' : 'Pharmacy Prescription'}
                      </label>
                      <div className="flex gap-2">
                         <textarea 
                           rows={3}
                           value={prescData.medication}
                           onChange={e => setPrescData({...prescData, medication: e.target.value})}
                           placeholder={isAr ? 'اكتب أسماء الأدوية والجرعات...' : 'Write medications and dosages...'}
                           className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all resize-none font-medium"
                         ></textarea>
                         <button 
                           onClick={() => {
                             if (!prescData.medication) return;
                             onSendPrescription?.({
                               patient_id: 2,
                               patient_name: 'سارة عبد الله',
                               medications: [{ name: prescData.medication, dosage: 'ASAP' }],
                               notes: prescData.medication
                             });
                             setPrescData({ medication: '', dosage: '', frequency: 'Once daily', instructions: '' });
                           }}
                           className="bg-white/20 hover:bg-white text-white hover:text-primary-700 p-4 rounded-2xl transition-all self-end shadow-lg flex items-center justify-center border border-white/10"
                         >
                            <Send size={18} />
                         </button>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-1.5 px-1">
                         <Activity size={12} />
                         {isAr ? 'طلب أشعة' : 'Radiology Request'}
                      </label>
                      <div className="flex gap-2">
                         <textarea 
                           rows={3}
                           value={radiologyReqData.notes}
                           onChange={e => setRadiologyReqData({...radiologyReqData, notes: e.target.value})}
                           placeholder={isAr ? 'اكتب نوع الأشعة المطلوبة...' : 'Type of scan required...'}
                           className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:bg-white/20 transition-all resize-none font-medium"
                         ></textarea>
                         <button 
                           onClick={() => {
                             if (!radiologyReqData.notes) return;
                             onSendRadiologyRequest?.({ 
                               patient_id: 2,
                               patient_name: 'سارة عبد الله',
                               scan_name_ar: radiologyReqData.notes,
                               scan_name_en: radiologyReqData.notes,
                               notes: radiologyReqData.notes,
                               priority: 'normal'
                             });
                             setRadiologyReqData({ scan_name_ar: '', scan_name_en: '', notes: '', priority: 'normal' });
                           }} 
                           className="bg-white/20 hover:bg-white text-white hover:text-primary-700 p-4 rounded-2xl transition-all self-end shadow-lg flex items-center justify-center border border-white/10"
                         >
                            <Send size={18} />
                         </button>
                      </div>
                   </div>

                   <div className="flex gap-3 pt-2">
                        <button 
                           onClick={() => { setSelectedPatient(patients[1]); setIsDiagnosisModalOpen(true); }}
                           className="flex-1 bg-white text-primary-700 py-3 rounded-2xl text-xs font-black transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2">
                           <FileText size={16} />
                           {isAr ? 'التشخيص والمتابعة' : 'Diagnosis & Follow-up'}
                        </button>
                        <button className="px-5 bg-rose-500/30 hover:bg-rose-500 text-white py-3 rounded-2xl transition-all shadow-lg border border-white/10" title={isAr ? 'استدعاء طوارئ' : 'Emergency Call'}>
                           <AlertCircle size={20} />
                        </button>
                    </div>
                </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                 <Clock size={16} className="text-primary-500" />
                 {isAr ? 'إدارة الجدول والدوام' : 'Schedule Management'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={handleCancelAll}
                   className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-100 uppercase tracking-tighter">
                    {isAr ? 'إلغاء جميع المواعيد' : 'Cancel All Appts'}
                 </button>
                 <button className="p-3 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black hover:bg-amber-600 hover:text-white transition-all border border-amber-100 uppercase tracking-tighter">
                    {isAr ? 'طلب إجازة / عذر' : 'Request Leave'}
                 </button>
                 <button 
                   onClick={() => setIsPasswordModalOpen(true)}
                   className="col-span-2 p-4 bg-primary-50 text-primary-600 rounded-2xl text-[10px] font-black hover:bg-primary-600 hover:text-white transition-all border border-primary-100 uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                    <Key size={14} />
                    {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                 </button>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4">{isAr ? 'إحصائيات سريعة' : 'Quick Stats'}</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{isAr ? 'تم معاينتهم' : 'Processed'}</span>
                    <span className="text-xs font-bold text-emerald-600">12</span>
                 </div>
                 <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[65%]" />
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{isAr ? 'متوسط الانتظار' : 'Avg Wait'}</span>
                    <span className="text-xs font-bold text-gray-700">15 min</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-600 text-white">
                 <div className="flex items-center gap-3 font-cairo">
                    <KeyRound size={22} />
                    <h3 className="text-lg font-bold">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
                 </div>
                 <button onClick={() => { setIsPasswordModalOpen(false); setPassStep(1); }} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                 {passStep === 1 ? (
                   <div className="space-y-4">
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'كلمة المرور القديمة' : 'Old Password'}</label>
                         <input 
                           type="password" 
                           value={passData.old} 
                           onChange={e => setPassData({...passData, old: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                         <input 
                           type="password" 
                           value={passData.new} 
                           onChange={e => setPassData({...passData, new: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                      <div className="space-y-1.5 text-right font-cairo">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                         <input 
                           type="password" 
                           value={passData.confirm} 
                           onChange={e => setPassData({...passData, confirm: e.target.value})}
                           className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition font-bold" 
                         />
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6 text-center font-cairo">
                      <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                         <Mail size={32} />
                      </div>
                      <div>
                         <h4 className="font-black text-gray-800">{isAr ? 'أدخل رمز التحقق' : 'Enter Verification Code'}</h4>
                         <p className="text-xs text-gray-400 mt-1">{isAr ? 'تم إرسال رمز مكون من رقمين إلى بريدك الإلكتروني' : 'A 2-digit code has been sent to your email'}</p>
                      </div>
                      <input 
                        type="text" 
                        maxLength={2}
                        value={passStepCode}
                        onChange={e => setPassStepCode(e.target.value)}
                        placeholder="00"
                        className="w-full text-center text-3xl font-black tracking-[0.5em] p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-primary-100 transition-all border-dashed border-2" 
                      />
                   </div>
                 )}
              </div>

              <div className="p-8 bg-gray-50 flex gap-4 font-cairo">
                 {passStep === 1 ? (
                   <button 
                     onClick={async () => {
                        if (!passData.old || !passData.new || passData.new !== passData.confirm) return alert(isAr ? 'يرجى ملء البيانات بشكل صحيح' : 'Please fill data correctly');
                        const token = localStorage.getItem('token');
                        try {
                           const res = await fetch('/api/send-password-code', {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ old_password: passData.old, new_password: passData.new })
                           });
                           const data = await res.json();
                           if (res.ok) {
                              setPassStep(2);
                              if (data.debug_code) console.log("Verification Code:", data.debug_code);
                           } else {
                              alert(data.message || 'Error');
                           }
                        } catch (err) { console.error(err); }
                     }}
                     className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all"
                   >
                      {isAr ? 'طلب رمز التحقق' : 'Request Verification Code'}
                   </button>
                 ) : (
                   <button 
                     onClick={async () => {
                        const token = localStorage.getItem('token');
                        try {
                           const res = await fetch('/api/verify-password-code', {
                              method: 'POST',
                              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ code: passStepCode, new_password: passData.new })
                           });
                           const data = await res.json();
                           if (res.ok) {
                              alert(isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
                              setIsPasswordModalOpen(false);
                              setPassStep(1);
                              setPassData({ old: '', new: '', confirm: '' });
                              setPassStepCode('');
                           } else {
                              alert(data.message || 'Error');
                           }
                        } catch (err) { console.error(err); }
                     }}
                     className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all"
                   >
                      {isAr ? 'تأكيد التغيير' : 'Confirm Change'}
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Medical Record Modal */}
      {isRecordModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-600 to-indigo-600 text-white">
                 <div className="flex items-center gap-3">
                    <ClipboardList size={22} />
                    <div>
                      <h3 className="text-lg font-bold">{isAr ? 'السجل الطبي للمريض' : 'Patient Medical Record'}</h3>
                      <p className="text-xs opacity-80">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn} | {selectedPatient.medicalId}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsRecordModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                       <p className="text-[11px] text-gray-400 mb-1">{isAr ? 'تاريخ الحساسية' : 'Allergies'}</p>
                       <p className="text-sm font-bold text-red-600">{isAr ? 'بنسلين' : 'Penicillin'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                       <p className="text-[11px] text-gray-400 mb-1">{isAr ? 'فصيلة الدم' : 'Blood Group'}</p>
                       <p className="text-sm font-bold text-blue-600">O+</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-gray-800 text-sm border-b pb-2">{isAr ? 'الزيارات السابقة' : 'Previous Visits'}</h4>
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border border-gray-100 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary-600">2024-02-{15 + i}</span>
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-lg">Dr. Sami Ahmed</span>
                        </div>
                        <p className="text-sm text-gray-700">{isAr ? 'شكوى من آلام في الصدر وضيق تنفس. تم صرف بخاخ فنتولين.' : 'Chest pain and shortness of breath. Ventolin prescribed.'}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end">
                <button onClick={() => setIsRecordModalOpen(false)} className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all">{isAr ? 'إغلاق' : 'Close'}</button>
              </div>
           </div>
        </div>
      )}

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-600 text-white">
                 <div className="flex items-center gap-3">
                    <Pill size={22} />
                    <h3 className="text-lg font-bold">{isAr ? 'كتابة وصفة طبية' : 'New Prescription'}</h3>
                 </div>
                 <button onClick={() => setIsPrescriptionModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'المريض' : 'Patient'}</label>
                    <input disabled value={isAr ? selectedPatient.nameAr : selectedPatient.nameEn} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'الدواء' : 'Medication'}</label>
                    <div className="relative">
                      <Search size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} />
                      <input type="text" value={prescData.medication} onChange={e => setPrescData({...prescData, medication: e.target.value})} placeholder={isAr ? 'ابحث عن الدواء...' : 'Search medication...'} className={`w-full border border-gray-200 rounded-2xl ${isAr ? 'pr-12' : 'pl-12'} py-4 text-sm focus:ring-4 focus:ring-emerald-100 outline-none transition-all`} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'الجرعة' : 'Dosage'}</label>
                       <input type="text" value={prescData.dosage} onChange={e => setPrescData({...prescData, dosage: e.target.value})} placeholder="500mg" className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-100 outline-none transition-all" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'التكرار' : 'Frequency'}</label>
                       <select value={prescData.frequency} onChange={e => setPrescData({...prescData, frequency: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-100 outline-none transition-all appearance-none bg-white">
                          <option value="Once daily">{isAr ? 'مرة يومياً' : 'Once daily'}</option>
                          <option value="Twice daily">{isAr ? 'مرتين يومياً' : 'Twice daily'}</option>
                          <option value="3 times daily">{isAr ? '3 مرات يومياً' : '3 times daily'}</option>
                       </select>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'تعليمات إضافية' : 'Instructions'}</label>
                    <textarea rows={3} value={prescData.instructions} onChange={e => setPrescData({...prescData, instructions: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none" placeholder={isAr ? 'بعد الأكل...' : 'After meals...'}></textarea>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <button onClick={() => setIsPrescriptionModalOpen(false)} className="px-6 py-4 text-gray-400 font-bold text-sm hover:text-gray-600 transition-all uppercase">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button 
                  onClick={() => {
                    onSendPrescription?.({
                      patient_id: selectedPatient.id,
                      doctor_id: 1, 
                      medicine_name: prescData.medication,
                      dosage: prescData.dosage,
                      frequency: prescData.frequency,
                      notes: prescData.instructions
                    });
                    setIsPrescriptionModalOpen(false);
                    alert(isAr ? 'تم إرسال الوصفة الطبية لصيدلية المستشفى بنجاح' : 'Prescription successfully sent to hospital pharmacy');
                    setPrescData({ medication: '', dosage: '', frequency: 'Once daily', instructions: '' });
                  }} 
                  className="flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-500">
                   <Send size={18} />
                   {isAr ? 'إرسال للصيدلية' : 'Send to Pharmacy'}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Diagnosis Modal */}
      {isDiagnosisModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-600 text-white">
                 <div className="flex items-center gap-3">
                    <FileText size={22} />
                    <h3 className="text-lg font-bold">{isAr ? 'التشخيص السريري' : 'Clinical Diagnosis'}</h3>
                 </div>
                 <button onClick={() => setIsDiagnosisModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'المريض' : 'Patient'}</label>
                    <input disabled value={isAr ? selectedPatient.nameAr : selectedPatient.nameEn} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'التشخيص والتشخيص السريري' : 'Clinical Diagnosis'}</label>
                    <textarea rows={3} value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none font-bold" placeholder={isAr ? 'اكتب التشخيص هنا...' : 'Write diagnosis here...'}></textarea>
                 </div>
                 
                 <div className="flex items-center gap-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
                    <div className="flex items-center gap-2">
                       <input 
                         type="checkbox" 
                         id="followUp" 
                         checked={hasFollowUp} 
                         onChange={e => setHasFollowUp(e.target.checked)}
                         className="w-5 h-5 rounded-lg border-primary-300 text-primary-600 focus:ring-primary-500"
                        />
                       <label htmlFor="followUp" className="text-sm font-black text-primary-900 cursor-pointer">{isAr ? 'يتطلب متابعة' : 'Requires Follow-up'}</label>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <FlaskConical size={12} className="text-purple-500" />
                          {isAr ? 'فحوصات المعمل' : 'Lab Requests'}
                       </label>
                       <textarea 
                         rows={2} 
                         value={labReqData.notes}
                         onChange={e => setLabReqData({...labReqData, notes: e.target.value})}
                         className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-xs focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none italic" 
                         placeholder={isAr ? 'اكتب الفحوصات...' : 'Write tests...'}></textarea>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Pill size={12} className="text-emerald-500" />
                          {isAr ? 'روشتة الصيدلية' : 'Pharmacy Prescription'}
                       </label>
                       <textarea 
                         rows={2} 
                         value={prescData.medication}
                         onChange={e => setPrescData({...prescData, medication: e.target.value})}
                         className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-xs focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none italic" 
                         placeholder={isAr ? 'اكتب الدواء...' : 'Write medication...'}></textarea>
                    </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2">
                   <button 
                     onClick={() => {
                        onSendLabRequest?.({...labReqData, patient_id: selectedPatient.id, notes: labReqData.notes});
                        alert(isAr ? 'تم إرسال الطلب للمعمل' : 'Sent to Lab');
                     }}
                     className="px-4 py-3 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black hover:bg-purple-600 hover:text-white transition-all">
                      {isAr ? 'إرسال للمعمل' : 'Send Lab'}
                   </button>
                   <button 
                     onClick={() => {
                        onSendPrescription?.({...prescData, patient_id: selectedPatient.id, medicine_name: prescData.medication});
                        alert(isAr ? 'تم إرسال الروشتة للصيدلية' : 'Sent to Pharmacy');
                     }}
                     className="px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black hover:bg-emerald-600 hover:text-white transition-all">
                      {isAr ? 'إرسال للصيدلية' : 'Send Pharma'}
                   </button>
                </div>
                <button onClick={() => {
                   setIsDiagnosisModalOpen(false);
                   alert(isAr ? 'تم حفظ بيانات الكشف بنجاح' : 'Diagnosis saved successfully');
                }} className="px-12 py-4 bg-primary-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-100 hover:scale-105 transition-all">
                   {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Lab Request Modal */}
      {isLabRequestModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-purple-600 text-white">
                 <div className="flex items-center gap-3">
                    <FlaskConical size={22} />
                    <h3 className="text-lg font-bold">{isAr ? 'طلب فحوصات معملية' : 'Request Lab Tests'}</h3>
                 </div>
                 <button onClick={() => setIsLabRequestModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'المريض' : 'Patient'}</label>
                    <input disabled value={isAr ? selectedPatient.nameAr : selectedPatient.nameEn} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-500" />
                 </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{isAr ? 'اختر الفحوصات المطلوبة' : 'Select Required Tests'}</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                       {[
                         { ar: 'تحليل دم شامل', en: 'CBC' },
                         { ar: 'وظائف كلى', en: 'Kidney Map' },
                         { ar: 'وظائف كبد', en: 'Liver Function' },
                         { ar: 'دهون الثلاثية', en: 'Lipid Profile' },
                         { ar: 'سكر عشوائي', en: 'Blood Sugar' },
                         { ar: 'تحليل بول', en: 'Urine Analysis' }
                       ].map(test => (
                         <button 
                           key={test.en} 
                           type="button" 
                           onClick={() => setLabReqData({...labReqData, test_name_ar: test.ar, test_name_en: test.en})}
                           className={`p-3 border rounded-xl text-xs font-bold text-center transition-all ${labReqData.test_name_en === test.en ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-100 text-gray-600 hover:bg-purple-50 hover:border-purple-200'}`}>
                            {isAr ? test.ar : test.en}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{isAr ? 'ملاحظات للمختبر' : 'Lab Notes'}</label>
                    <textarea 
                      rows={2} 
                      value={labReqData.notes}
                      onChange={e => setLabReqData({...labReqData, notes: e.target.value})}
                      className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"></textarea>
                  </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <button onClick={() => setIsLabRequestModalOpen(false)} className="text-gray-400 font-bold px-4">{isAr ? 'إلغاء' : 'Cancel'}</button>
                <button onClick={() => {
                   if (!selectedPatient) return;
                   onSendLabRequest?.({
                     patient_id: selectedPatient.id,
                     doctor_id: 1, // Currently hardcoded to 1, should be current doctor id
                     test_name_ar: labReqData.test_name_ar || labReqData.test_name_en,
                     test_name_en: labReqData.test_name_en || labReqData.test_name_ar,
                     notes: labReqData.notes,
                     priority: labReqData.priority
                   });
                   setIsLabRequestModalOpen(false);
                   alert(isAr ? 'تم إرسال الطلب للمعمل' : 'Request sent to Lab');
                }} className="flex items-center gap-2 bg-purple-600 text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-purple-100 hover:scale-105 transition-all">
                   <Send size={18} />
                   {isAr ? 'إرسال للمعمل' : 'Send to Lab'}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

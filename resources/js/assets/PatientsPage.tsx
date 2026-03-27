import React, { useState, useEffect } from 'react';
import { 
  Search, User, Calendar, Phone, Activity, ChevronRight, 
  Filter, Download, FileText, ClipboardList, X, ArrowUpDown, Pill,
  Trash2, Printer, Receipt, Eye, Edit3
} from 'lucide-react';


/* ───────── Types ───────── */
export interface Patient {
  id: number;
  nameAr: string;
  nameEn: string;
  medicalId: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  lastVisit: string;
  bloodGroup: string;
  status: 'active' | 'discharged' | 'emergency' | 'waiting' | 'in-consult' | 'completed';
  drugAllergy?: string;
  chronicDiseases?: string;
  doctorName?: string;
}

interface PatientsPageProps {
  isAr: boolean;
  tx: any;
  doctors: any[];
  onDelete?: (id: number) => void;
  onNavigate?: (page: string) => void;
}

const recordSections = [
  { id: 'personal', labelAr: 'المعلومات الشخصية', labelEn: 'Personal Info' },
  { id: 'clinical', labelAr: 'الحالة السريرية', labelEn: 'Clinical Status' },
  { id: 'history', labelAr: 'التاريخ المرضي', labelEn: 'Medical History' },
  { id: 'treatment', labelAr: 'خطة العلاج', labelEn: 'Treatment Plan' },
  { id: 'laboratory', labelAr: 'الفحوصات والنتائج', labelEn: 'Laboratory Results' }
];

export const PatientsPage: React.FC<PatientsPageProps> = ({ isAr, tx, doctors, onDelete, onNavigate }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeRecordSection, setActiveRecordSection] = useState('personal');

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [labRequests, setLabRequests] = useState<any[]>([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    diagnosis: '',
    treatment: '',
    notes: '',
    doctor_id: '',
    record_date: new Date().toISOString().split('T')[0]
  });

  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/patients', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setPatients(data.data.map((p: any) => ({
          id: p.id,
          nameAr: p.nameAr,
          nameEn: p.name,
          medicalId: p.fileNumber,
          age: p.age,
          gender: (p.genderEn || 'male').toLowerCase() === 'male' ? 'male' : 'female',
          phone: p.phone,
          lastVisit: p.lastVisit,
          bloodGroup: p.bloodType,
          status: p.status === 'waiting' ? 'active' : p.status,
          drugAllergy: p.drugAllergy,
          chronicDiseases: p.chronicDiseases,
          doctorName: p.doctorAr || p.doctorEn || (isAr ? 'غير محدد' : 'Not Specified')
        })));
      }
    } catch (err) { console.error("Patients fetch error:", err); }
  };

  const fetchLabRequests = async (patientId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/lab-requests?patient_id=${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLabRequests(data.data);
      }
    } catch (err) { console.error("Labs fetch error:", err); }
  };

  const fetchMedicalRecords = async (patientId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/medical-records?patient_id=${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMedicalRecords(data.data);
      }
    } catch (err) { console.error("Records fetch error:", err); }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/medical-records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...newRecord,
          patient_id: selectedPatient.id
        })
      });
      if (res.ok) {
        fetchMedicalRecords(selectedPatient.id);
        setIsAddingRecord(false);
        setNewRecord({ diagnosis: '', treatment: '', notes: '', doctor_id: '', record_date: new Date().toISOString().split('T')[0] });
      }
    } catch (err) { console.error("Add record error:", err); }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient && isRecordModalOpen) {
      fetchMedicalRecords(selectedPatient.id);
      fetchLabRequests(selectedPatient.id);
    }
  }, [selectedPatient, isRecordModalOpen]);

  const filteredPatients = patients.filter(p => 
    (p.nameAr || '').includes(searchTerm) || 
    (p.nameEn || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.medicalId || '').includes(searchTerm)
  );

  const textAlign = isAr ? 'text-right' : 'text-left';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search and Filters Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={20} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} />
          <input 
            type="text" 
            placeholder={isAr ? 'البحث عن مريض (الاسم، الرقم الطبي...)' : 'Search patients (Name, Medical ID...)'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-gray-50 border border-gray-100 rounded-2xl ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 text-sm focus:ring-4 focus:ring-primary-100 outline-none transition-all`}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-50 text-gray-600 px-6 py-4 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100">
            <Filter size={18} />
            <span>{isAr ? 'فلاتر' : 'Filters'}</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary-100 transition-all">
            <Download size={18} />
            <span>{isAr ? 'تصدير' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <User size={20} />
             </div>

             <div>
                <h2 className="text-lg font-bold text-gray-800">{isAr ? 'سجلات المرضى (السجل الطبي)' : 'Patient Records (Medical Records)'}</h2>
                <p className="text-xs text-gray-400">{isAr ? 'إدارة وتتبع جميع ملفات المرضى' : 'Manage and track all patient files'}</p>
             </div>
          </div>
          <span className="bg-primary-50 text-primary-600 text-[11px] font-bold px-3 py-1 rounded-full">{filteredPatients.length} {isAr ? 'مرضى' : 'patients'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 px-4 text-center">{isAr ? 'السجل الطبي (MRN)' : 'Medical ID (MRN)'}</th>
                <th className="pb-4 px-4">{isAr ? 'المريض' : 'Patient'}</th>
                <th className="pb-4 px-4">{isAr ? 'تاريخ الزيارة' : 'Visit Date'}</th>
                <th className="pb-4 px-4">{isAr ? 'الهاتف' : 'Phone'}</th>
                <th className="pb-4 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="pb-4 px-4">{isAr ? 'الطبيب' : 'Doctor'}</th>
                <th className="pb-4 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-4 text-center">
                    <div className="inline-block p-3 rounded-2xl bg-gray-100/50 border border-gray-100 group-hover:bg-primary-600 group-hover:text-white transition-all">
                       <p className="text-[11px] font-black tracking-tighter">{patient.medicalId}</p>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                     <p className="text-sm font-black text-gray-800 group-hover:text-primary-600 transition-colors">{isAr ? patient.nameAr : patient.nameEn}</p>
                  </td>
                  <td className="py-6 px-4">
                     <div className="flex items-center gap-2 text-xs font-black text-gray-500">
                        <Calendar size={14} className="text-primary-500" />
                        {patient.lastVisit || (isAr ? 'لا يوجد' : 'None')}
                     </div>
                  </td>
                  <td className="py-6 px-4 text-xs font-black text-gray-600">
                    {patient.phone}
                  </td>
                  <td className="py-6 px-4">
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      patient.status === 'active' || patient.status === 'waiting' ? 'bg-amber-100 text-amber-600' : 
                      patient.status === 'in-consult' ? 'bg-blue-100 text-blue-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {isAr ? (patient.status === 'active' || patient.status === 'waiting' ? 'في الانتظار' : patient.status === 'in-consult' ? 'عند الطبيب' : 'مكتمل') : (patient.status)}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-xs font-black text-gray-800">
                    {patient.doctorName}
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* View Record (Matches the File view in Reception) */}
                      <button 
                         onClick={() => { setSelectedPatient(patient); setIsRecordModalOpen(true); }}
                         className="p-2.5 rounded-xl bg-white border border-gray-100 text-primary-600 hover:bg-primary-50 transition-all shadow-sm flex items-center gap-2 text-[10px] font-black"
                      >
                         <Eye size={14} />
                         {isAr ? 'عرض الملف' : 'View File'}
                      </button>

                      {/* Print */}
                      <button 
                         onClick={() => { setSelectedPatient(patient); setTimeout(() => window.print(), 100); }}
                         className="p-2.5 rounded-xl bg-white border border-gray-100 text-slate-400 hover:bg-slate-50 transition-all shadow-sm"
                         title={isAr ? 'طباعة' : 'Print'}
                      >
                         <Printer size={16} />
                      </button>

                      {/* Delete */}
                      <button 
                         onClick={() => onDelete?.(patient.id)}
                         className="p-2.5 rounded-xl bg-white border border-gray-100 text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
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
        </div>
      </div>

      {/* Record Modal */}
      {isRecordModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-hidden">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-600 to-indigo-600 text-white shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-bold">
                       {selectedPatient.nameEn ? selectedPatient.nameEn.charAt(0) : 'P'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn}</h3>
                      <p className="text-xs opacity-80 flex items-center gap-2">
                        <Activity size={12} />
                        {selectedPatient.medicalId} | {selectedPatient.bloodGroup} | {selectedPatient.age} {isAr ? 'سنة' : 'yrs'}
                      </p>
                    </div>
                 </div>
                 <button onClick={() => setIsRecordModalOpen(false)} className="hover:rotate-90 transition-transform cursor-pointer"><X size={28} /></button>
              </div>

              {/* Modal Navigation */}
              <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                {recordSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveRecordSection(section.id)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      activeRecordSection === section.id
                        ? "bg-primary-600 text-white shadow-md shadow-primary-100"
                        : "bg-white text-gray-500 border border-gray-100 hover:border-primary-300 hover:text-primary-600"
                    }`}
                  >
                    {isAr ? section.labelAr : section.labelEn}
                  </button>
                ))}
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
                 {activeRecordSection === 'personal' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                         <h4 className="text-sm font-bold text-gray-800 border-b pb-2">{isAr ? 'البيانات الأساسية' : 'Basic Info'}</h4>
                         <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'الاسم الكامل' : 'Full Name'}</span><span className="font-bold">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'العمر' : 'Age'}</span><span className="font-bold">{selectedPatient.age}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'الهاتف' : 'Phone'}</span><span className="font-bold">{selectedPatient.phone}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'الجنس' : 'Gender'}</span><span className="font-bold">{isAr ? (selectedPatient.gender === 'male' ? 'ذكر' : 'أنثى') : selectedPatient.gender}</span></div>
                         </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                         <h4 className="text-sm font-bold text-gray-800 border-b pb-2">{isAr ? 'بيانات طبية ثابتة' : 'Fixed Medical Data'}</h4>
                         <div className="space-y-3">
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'فصيلة الدم' : 'Blood Group'}</span><span className="font-bold text-red-600">{selectedPatient.bloodGroup}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'الحساسية' : 'Allergies'}</span><span className="font-bold text-amber-600">Penicillin</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-400">{isAr ? 'الطبيب المعالج' : 'Primary Physician'}</span><span className="font-bold text-primary-600">Dr. Khalid Otaibi</span></div>
                         </div>
                      </div>
                   </div>
                 )}

                 {activeRecordSection === 'clinical' && (
                   <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: 'BP', value: '120/80', unit: 'mmHg', color: 'blue' },
                          { label: 'Pulse', value: '78', unit: 'bpm', color: 'red' },
                          { label: 'O2', value: '98', unit: '%', color: 'emerald' },
                          { label: 'Temp', value: '37.2', unit: '°C', color: 'amber' },
                        ].map((stat, i) => (
                           <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                              <div className={`absolute top-0 right-0 w-1 h-full bg-${stat.color}-500 opacity-20`} />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                              <div className="flex items-end gap-1">
                                 <span className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</span>
                                 <span className="text-[10px] text-gray-400 mb-1">{stat.unit}</span>
                              </div>
                           </div>
                        ))}
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                         <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                           {isAr ? 'يعاني المريض من آلام حادة في المفاصل مع تورم طفيف. تم تشخيص الحالة كبداية التهاب مفاصل روماتويدي.' : 'Patient suffers from acute joint pain with slight swelling. Diagnosed as early rheumatoid arthritis.'}
                         </p>
                      </div>
                   </div>
                 )}

                 {activeRecordSection === 'history' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-800">{isAr ? 'السجل الطبي الكامل' : 'Complete Medical Records'}</h4>
                          <button 
                            onClick={() => setIsAddingRecord(!isAddingRecord)}
                            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all"
                          >
                            {isAddingRecord ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'إضافة سجل جديد' : 'Add New Record')}
                          </button>
                       </div>

                       {isAddingRecord && (
                          <form onSubmit={handleAddRecord} className="bg-primary-50/50 p-6 rounded-3xl border border-primary-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{isAr ? 'التشخيص' : 'Diagnosis'}</label>
                                   <input required value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none" />
                                </div>
                                <div>
                                   <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{isAr ? 'الطبيب' : 'Doctor'}</label>
                                   <select value={newRecord.doctor_id} onChange={e => setNewRecord({...newRecord, doctor_id: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none">
                                      <option value="">{isAr ? 'اختر الطبيب' : 'Select Doctor'}</option>
                                      {doctors.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                                   </select>
                                </div>
                                <div className="col-span-2">
                                   <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{isAr ? 'العلاج / الخطة' : 'Treatment / Plan'}</label>
                                   <textarea value={newRecord.treatment} onChange={e => setNewRecord({...newRecord, treatment: e.target.value})} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none" rows={2} />
                                </div>
                             </div>
                             <div className="flex justify-end">
                                <button type="submit" className="bg-primary-600 text-white px-8 py-2 rounded-xl text-xs font-bold hover:bg-primary-700 transition-all">
                                   {isAr ? 'حفظ السجل' : 'Save Record'}
                                </button>
                             </div>
                          </form>
                       )}

                       <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                          <h4 className="text-sm font-bold text-gray-800 border-b pb-2">{isAr ? 'تاريخ الزيارات والتقارير' : 'Visit History & Reports'}</h4>
                          {medicalRecords.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-8">{isAr ? 'لا توجد سجلات طبية سابقة' : 'No previous medical records found'}</p>
                          ) : (
                            medicalRecords.map((record) => (
                              <div key={record.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
                                      {record.record_date?.split('-')[0] || '2024'}
                                    </div>
                                    <div className="w-0.5 flex-1 bg-gray-100 group-last:bg-transparent" />
                                </div>
                                <div className="pb-6 w-full">
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="text-[10px] font-bold text-primary-500">{record.record_date}</p>
                                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                        Dr. {record.doctor?.name || (isAr ? 'طبيب' : 'Doctor')}
                                      </span>
                                    </div>
                                    <h5 className="text-sm font-black text-gray-800">{record.diagnosis}</h5>
                                    {record.treatment && <p className="text-xs text-emerald-600 mt-1 font-bold">💊 {record.treatment}</p>}
                                    {record.notes && <p className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded-lg">{record.notes}</p>}
                                </div>
                              </div>
                            ))
                          )}
                       </div>
                    </div>
                  )}

                 {activeRecordSection === 'treatment' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                       {['Solpadeine', 'Amoxicillin', 'Panadol'].map((med, i) => (
                          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Pill size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-gray-800">{med}</p>
                                <p className="text-xs text-gray-400">500mg • {isAr ? 'مرتين يومياً' : 'Twice daily'}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  )}

                 {activeRecordSection === 'laboratory' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                       {labRequests.length === 0 ? (
                          <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 italic text-gray-400">
                             {isAr ? 'لا توجد نتائج فحوصات معملية مسجلة' : 'No laboratory results recorded yet'}
                          </div>
                       ) : (
                          labRequests.map(labReq => (
                            <div key={labReq.id} className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-primary-300 flex items-center justify-between transition-all group">
                               <div className="flex items-center gap-4">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${labReq.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                     <Activity size={24} />
                                  </div>
                                  <div>
                                     <p className="font-bold text-gray-800">{isAr ? labReq.test_name_ar : labReq.test_name_en}</p>
                                     <p className="text-xs text-gray-400">{labReq.created_at?.split('T')[0]} | #LAB-{labReq.id}</p>
                                     {labReq.result_text && <p className="text-sm font-bold text-emerald-600 mt-1">{isAr ? 'النتيجة:' : 'Result:'} {labReq.result_text}</p>}
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${labReq.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                     {labReq.status}
                                  </span>
                                  {labReq.result_file_url && (
                                     <a href={labReq.result_file_url} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all">
                                        {isAr ? 'عرض الملف' : 'View File'}
                                     </a>
                                  )}
                               </div>
                            </div>
                          ))
                       )}
                    </div>
                 )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center shrink-0">
                 <button className="flex items-center gap-2 text-primary-500 font-bold text-xs hover:underline">
                    <Download size={14} />
                    {isAr ? 'تحميل الملف الطبي بالكامل' : 'Download Complete Digital Record'}
                 </button>
                 <button onClick={() => setIsRecordModalOpen(false)} className="px-10 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg">{isAr ? 'إغلاق السجل' : 'Close Record'}</button>
              </div>
           </div>
        </div>
      )}
      {/* ───── Print Only Complete Patient Report ───── */}
      {selectedPatient && (
        <div className="hidden print:block fixed inset-0 bg-white z-[999] p-12 text-gray-900 overflow-visible" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="border-b-8 border-primary-600 pb-12 mb-12 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center shadow-xl">
                 <Activity size={48} />
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black mb-2">{isAr ? 'ملف المريض الطبي المتكامل' : 'Comprehensive Medical Dossier'}</h1>
                <p className="text-lg font-bold opacity-60 uppercase tracking-[0.3em]">{isAr ? 'مستشفى الشفاء التخصصي' : 'Al-Shifa Hospital | Specialized Services'}</p>
              </div>
            </div>
            <div className="text-left text-sm font-black opacity-30">
               <p>{isAr ? 'تاريخ التقرير:' : 'Report Date:'} {new Date().toLocaleDateString()}</p>
               <p>{isAr ? 'سجل رقم:' : 'Record ID:'} {selectedPatient.medicalId}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-12 mb-16 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <div className="space-y-6">
               <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{isAr ? 'بيانات المريض الأساسية' : 'Personal Information'}</h3>
               <div className="space-y-4">
                  <p className="text-2xl font-black">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn}</p>
                  <p className="text-sm font-bold opacity-60">{isAr ? `العمر: ${selectedPatient.age} سنة` : `Age: ${selectedPatient.age} Years`}</p>
                  <p className="text-sm font-bold opacity-60 uppercase">{isAr ? `فصيلة الدم: ${selectedPatient.bloodGroup}` : `Blood Type: ${selectedPatient.bloodGroup}`}</p>
               </div>
            </div>
            <div className="col-span-2 space-y-6">
               <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{isAr ? 'التاريخ الطبي والتحذيرات' : 'Medical Warnings & History'}</h3>
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                     <p className="text-[10px] font-black text-rose-600 uppercase mb-2">{isAr ? 'الحساسية الدوائية' : 'Drug Allergies'}</p>
                     <p className="text-sm font-bold text-rose-800">{selectedPatient.drugAllergy || (isAr ? 'لا توجد' : 'None')}</p>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                     <p className="text-[10px] font-black text-amber-600 uppercase mb-2">{isAr ? 'الأمراض المزمنة' : 'Chronic Conditions'}</p>
                     <p className="text-sm font-bold text-amber-800">{selectedPatient.chronicDiseases || (isAr ? 'لا توجد' : 'None')}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-12 mb-16">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest border-r-8 border-primary-600 pr-4">{isAr ? 'سجل الزيارات السريرية' : 'Clinical Visit History'}</h3>
            <div className="space-y-8">
               {medicalRecords.map((record, i) => (
                  <div key={i} className="pb-8 border-b border-gray-100 last:border-0 grid grid-cols-4 gap-8">
                     <div className="text-xs font-black text-gray-400 uppercase">{record.record_date}</div>
                     <div className="col-span-3 space-y-2">
                        <p className="text-lg font-black text-gray-800">{record.diagnosis}</p>
                        <p className="text-sm font-bold text-emerald-600 opacity-80 italic">{isAr ? 'خطة العلاج:' : 'Treatment Plan:'} {record.treatment}</p>
                        <p className="text-xs text-gray-500 bg-gray-50 p-4 rounded-2xl border border-gray-100">{record.notes}</p>
                     </div>
                  </div>
               ))}
               {medicalRecords.length === 0 && <p className="text-center py-12 text-gray-300 font-black italic">{isAr ? 'لا يوجد سجل سريري متاح' : 'No clinical history available'}</p>}
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest border-r-8 border-amber-500 pr-4">{isAr ? 'الفحوصات المخبرية' : 'Laboratory Diagnostics'}</h3>
            <div className="grid grid-cols-2 gap-8">
               {labRequests.filter(l => l.status === 'completed').map((lab, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                     <div className="flex justify-between items-center bg-white p-3 rounded-2xl">
                        <p className="text-xs font-black text-gray-800">{isAr ? lab.test_name_ar : lab.test_name_en}</p>
                        <span className="text-[10px] font-black text-primary-600 opacity-40 uppercase">{lab.created_at?.split('T')[0]}</span>
                     </div>
                     <p className="text-sm font-bold text-gray-600 italic leading-relaxed whitespace-pre-wrap">{lab.result_text}</p>
                  </div>
               ))}
               {labRequests.filter(l => l.status === 'completed').length === 0 && <p className="col-span-2 text-center py-12 text-gray-300 font-black italic">{isAr ? 'لا توجد تقارير مخبرية مكتملة للاطلاع' : 'No completed laboratory reports available'}</p>}
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-gray-100 flex justify-between items-center text-xs font-black opacity-30 uppercase tracking-[0.2em]">
             <div>{isAr ? 'توقيع الطبيب المتابع' : 'Attending Physician Signature'}</div>
             <div className="w-48 h-20 border-b-2 border-dashed border-gray-200" />
             <div className="text-left">
                <p>{isAr ? 'مستشفى الشفاء' : 'AL-SHIFA HOSPITAL'}</p>
                <p>{isAr ? 'قسم السجلات الطبية' : 'MEDICAL RECORDS DEPT'}</p>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

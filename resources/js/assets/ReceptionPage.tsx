import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

// Add Authorization header to all requests
axios.interceptors.request.use(config => {
   const token = localStorage.getItem('token');
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

import {
   Users, UserPlus, Search, Clock, CreditCard, Calendar,
   ChevronRight, MoreVertical, Eye, Edit3, Trash2, CheckCircle2,
   AlertCircle, Filter, Download, Check, XCircle, History, Plus, Globe, Languages, Tag,
   Database, Activity, X, Phone, ArrowLeft, Sun, Moon, Stethoscope, Ambulance,
   User, Mail, MapPin, Hash, Shield, DollarSign, Heart, Baby, LifeBuoy, Scissors, EyeOff, Ghost
} from 'lucide-react';

interface ReceptionPageProps {
   isAr: boolean;
   tx: any;
   depts: any[];
   doctors: any[];
   nurses?: any[];
   services: any[];
   specialties: any[];
   initialTab?: 'waiting' | 'all' | 'pricing';
}

interface PatientRecord {
   id: number;
   name: string;
   nameAr: string;
   fileNumber: string;
   phone: string;
   email?: string;
   address?: string;
   nationalId?: string;
   birthDate?: string;
   lastVisit: string;
   status: 'waiting' | 'in-consult' | 'completed';
   doctorAr: string;
   doctorEn: string;
   deptAr?: string;
   deptEn?: string;
   age: number;
   genderAr: string;
   genderEn: string;
   bloodType: string;
   chronicDiseases?: string;
   drugAllergy?: string;
   maritalStatus?: string;
   medicalHistory?: string;
   previousOperations?: string;
   paymentStatus?: 'paid' | 'unpaid';
   history: any[];
}

export const ReceptionPage: React.FC<ReceptionPageProps> = ({ isAr, tx, depts, doctors: initialDoctors, nurses: initialNurses, services: initialServices, specialties, initialTab }) => {
   const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
   const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
   const [isBookModalOpen, setIsBookModalOpen] = useState(false);
   const [isPatientDetailOpen, setIsPatientDetailOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<'waiting' | 'all' | 'pricing'>(initialTab || 'waiting');
   const [waitingSubTab, setWaitingSubTab] = useState<'waiting' | 'in-consult' | 'completed'>('waiting');
   const [selectedPricingDeptId, setSelectedPricingDeptId] = useState<number | string | null>(null);
   const [pricingSubTab, setPricingSubTab] = useState<'roster' | 'prices'>('roster');

   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isUploading, setIsUploading] = useState(false);

   const [newPatient, setNewPatient] = useState({
      nameEn: '', nameAr: '', nationalId: '', birthDate: '', gender: 'male', maritalStatus: 'single',
      phone: '', address: '', email: '',
      bloodType: 'O+', chronicDiseases: '', drugAllergy: '', medicalHistory: '',
      previousOperations: '',
      departmentId: '', doctorId: '', serviceId: '', specialty: '', selectedService: null as any,
      visitType: 'regular', shift: 'morning'
   });

   const [modalSection, setModalSection] = useState<'personal' | 'contact' | 'medical' | 'booking' | 'professional' | 'schedule'>('personal');

   const [selectedBookingDoctor, setSelectedBookingDoctor] = useState('');
   const [selectedBookingDeptId, setSelectedBookingDeptId] = useState('');
   const [selectedBookingSpecialty, setSelectedBookingSpecialty] = useState('');
   const [selectedBookingService, setSelectedBookingService] = useState<any>(null);
   const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
   const [bookingTime, setBookingTime] = useState('09:00 AM');
   const [bookingNotes, setBookingNotes] = useState('');
   const [bookingMRN, setBookingMRN] = useState('');
   const [bookingVisitType, setBookingVisitType] = useState('regular');
   const [bookingShift, setBookingShift] = useState('morning');
   const [foundPatient, setFoundPatient] = useState<PatientRecord | null>(null);

   const [lastGeneratedID, setLastGeneratedID] = useState<string | null>(null);
   const [showSuccessCard, setShowSuccessCard] = useState(false);
   const [isGeneratingMRN, setIsGeneratingMRN] = useState(false);

   const [patients, setPatients] = useState<PatientRecord[]>([]);
   const [appointments, setAppointments] = useState<any[]>([]);
   const [doctors, setDoctors] = useState<any[]>(initialDoctors || []);
   const [nurses, setNurses] = useState<any[]>(initialNurses || []);
   const [services, setServices] = useState<any[]>(initialServices || []);

   const [patientSearchTerm, setPatientSearchTerm] = useState('');
   const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
   const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);

   const [editingDoctor, setEditingDoctor] = useState<any>(null);
   const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
   const [editingService, setEditingService] = useState<any>(null);
   const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

   const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
   const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

   interface NewService {
      nameAr: string;
      nameEn: string;
      category: string;
      price: string;
      discount: string;
      finalPrice: string;
      status: string;
      departmentId: string;
   }

   const [newService, setNewService] = useState<NewService>({
      nameAr: '', nameEn: '', category: '', price: '', discount: '', finalPrice: '', status: 'active', departmentId: ''
   });
   const [newDoctor, setNewDoctor] = useState({
      nameAr: '', nameEn: '', phone: '', email: '', address: '',
      departmentId: '', specialtyAr: '', specialtyEn: '',
      availability: '', salary: '', grade: 'specialist',
      day_shifts: [] as any[]
   });

   const fetchPatients = async () => {
      try {
         const response = await axios.get('/api/patients');
         if (response.data.success) setPatients(response.data.data);
      } catch (error) { console.error('Failed to fetch patients:', error); }
   };

   const handleEditDoctor = (doc: any) => {
      setEditingDoctor(doc);
      setIsEditDoctorModalOpen(true);
   };

   const handleUpdateDoctor = async () => {
      if (!editingDoctor) return;
      try {
         const resp = await axios.put(`/api/employees/${editingDoctor.id}`, editingDoctor);
         if (resp.data.success) {
            alert(isAr ? 'تم التحديث بنجاح' : 'Doctor Updated Successfully!');
            setIsEditDoctorModalOpen(false);
            fetchDoctors();
         }
      } catch (e) { console.error(e); }
   };

   const handleCreateDoctor = async () => {
      try {
         const resp = await axios.post('/api/employees', { ...newDoctor, role: 'doctor' });
         if (resp.data.success) {
            alert(isAr ? 'تم تسجيل الطبيب بنجاح' : 'Doctor Registered Successfully!');
            setIsAddDoctorModalOpen(false);
            setDoctors([...doctors, resp.data.data]);
            setNewDoctor({
               nameAr: '', nameEn: '', phone: '', email: '', address: '',
               departmentId: '', specialtyAr: '', specialtyEn: '',
               availability: '', salary: '', grade: 'specialist',
               day_shifts: []
            });
         }
      } catch (e) { alert('Registration failed'); }
   };

   const handleEditService = (service: any) => {
      setEditingService({ ...service });
      setIsEditServiceModalOpen(true);
   };

   const handleUpdateService = async () => {
      if (!editingService) return;
      try {
         const response = await axios.put(`/api/services/${editingService.id}`, editingService);
         if (response.data.success) {
            setServices(services.map(s => s.id === editingService.id ? { ...editingService } : s));
            setIsEditServiceModalOpen(false);
            alert(isAr ? 'تم حفظ التعديلات' : 'Saved successfully');
         }
      } catch (error) { alert('Update failed'); }
   };

   const handleCreateService = async () => {
      try {
         const response = await axios.post('/api/services', newService);
         if (response.data.success) {
            setServices([...services, response.data.data]);
            setIsAddServiceModalOpen(false);
            alert(isAr ? 'تمت إضافة الخدمة بنجاح' : 'Service Added Successfully!');
         }
      } catch (error) { alert('Failed to create service'); }
   };

   const handleUpdatePatient = async () => {
      if (!editingPatient) return;
      try {
         const payload = {
            ...editingPatient,
            visit_type: (editingPatient as any).visitType,
            department_id: (editingPatient as any).departmentId,
            doctor_id: (editingPatient as any).doctorId,
            shift: (editingPatient as any).shift
         };
         if (payload.email === '') payload.email = null as any;
         if (payload.birthDate === '') payload.birthDate = null as any;
         if (payload.phone === '') payload.phone = null as any;
         if (payload.nationalId === '') payload.nationalId = null as any;

         const resp = await axios.put(`/api/patients/${editingPatient.id}`, payload);
         if (resp.data.success) {
            setIsEditPatientModalOpen(false);
            fetchPatients();
            alert(isAr ? 'تم التحديث بنجاح' : 'Updated Successfully!');
         }
      } catch (e) { alert('Error updating patient'); }
   };
   const fetchAppointments = async () => {
      try {
         const response = await axios.get('/api/appointments');
         if (response.data.success) setAppointments(response.data.data);
      } catch (error) { console.error('Failed to fetch appointments:', error); }
   };

   const fetchDoctors = async () => {
      try {
         const response = await axios.get('/api/doctors');
         if (response.data.success) {
            setDoctors(response.data.data.map((d: any) => ({
               ...d,
               nameAr: d.nameAr || d.name,
               nameEn: d.nameEn || d.name,
               department_id: d.department_id ? String(d.department_id) : d.departmentId ? String(d.departmentId) : '',
               day_shifts: d.day_shifts && d.day_shifts.length > 0 ? d.day_shifts : (d.manawbats || [])
            })));
         }
      } catch (error) { console.error('Failed to fetch doctors:', error); }
   };

   const fetchServices = async () => {
      try {
         const response = await axios.get('/api/services');
         if (response.data.success) {
            setServices(response.data.data.map((s: any) => ({
               ...s,
               nameAr: s.name_ar || s.name,
               nameEn: s.name_en || s.name,
               classificationAr: s.classification_ar || s.description || 'عام',
               classificationEn: s.classification_en || s.description || 'General',
               price: parseFloat(s.cost || s.price),
               discount: parseFloat(s.discount) || 0,
               finalPrice: parseFloat(s.cost || s.price) - (parseFloat(s.discount) || 0)
            })));
         }
      } catch (error) { console.error('Failed to fetch services:', error); }
   };

   useEffect(() => {
      fetchPatients();
      fetchAppointments();
      fetchDoctors();
      fetchServices();
   }, []);

   useEffect(() => {
      if (isAddPatientModalOpen || isBookModalOpen) {
         fetchDoctors();
         fetchServices();
         setDoctorSearchTerm('');
      }
   }, [isAddPatientModalOpen, isBookModalOpen]);

   const syncOfflinePatients = async () => {
      const offlineDataString = localStorage.getItem('offline_patient_registrations');
      if (!offlineDataString) return;

      let offlineData = [];
      try {
         offlineData = JSON.parse(offlineDataString);
      } catch (e) { return; }

      if (!Array.isArray(offlineData) || offlineData.length === 0) return;

      const itemsToKeep = [];
      let syncedCount = 0;

      for (const item of offlineData) {
         try {
            const response = await axios.post('/api/patients', item.data, {
               headers: { Accept: 'application/json' }
            });
            if (response.data.success) {
               syncedCount++;
            } else {
               itemsToKeep.push(item);
            }
         } catch (error) {
            console.error('Failed to sync offline patient mapped at:', item.timestamp, error);
            itemsToKeep.push(item);
         }
      }

      if (itemsToKeep.length > 0) {
         localStorage.setItem('offline_patient_registrations', JSON.stringify(itemsToKeep));
      } else {
         localStorage.removeItem('offline_patient_registrations');
      }

      if (syncedCount > 0) {
         fetchPatients();
         alert(isAr 
            ? `تمت مزامنة (${syncedCount}) من السجلات المسجلة سابقاً أوفلاين.` 
            : `Successfully synced (${syncedCount}) previously offline records.`);
      }
   };

   useEffect(() => {
      const handleOnline = () => {
         syncOfflinePatients();
      };
      window.addEventListener('online', handleOnline);
      if (navigator.onLine) {
         syncOfflinePatients();
      }
      return () => window.removeEventListener('online', handleOnline);
   }, []);

   const handleCreatePatient = async () => {
      setIsGeneratingMRN(true);
      try {
         const payload = {
            ...newPatient,
            name: newPatient.nameEn || newPatient.nameAr || undefined,
            nameEn: newPatient.nameEn,
            nameAr: newPatient.nameAr,
            genderEn: newPatient.gender,
            visit_type: newPatient.visitType,
            department_id: newPatient.departmentId || undefined,
            doctor_id: newPatient.doctorId || undefined,
            service_id: newPatient.serviceId || undefined,
            price: newPatient.selectedService?.finalPrice || newPatient.selectedService?.price || 0
         };
         if (payload.email === '') payload.email = null as any;
         if (payload.birthDate === '') payload.birthDate = null as any;
         if (payload.phone === '') payload.phone = null as any;
         if (payload.nationalId === '') payload.nationalId = null as any;

         if (!navigator.onLine) {
            const offlineRegistrations = JSON.parse(localStorage.getItem('offline_patient_registrations') || '[]');
            offlineRegistrations.push({
               data: payload,
               timestamp: new Date().toISOString()
            });
            localStorage.setItem('offline_patient_registrations', JSON.stringify(offlineRegistrations));
            
            alert(isAr 
               ? 'يبدو أنك غير متصل بالإنترنت حالياً. تم حفظ بيانات المريض محلياً في المتصفح، وسيتم رفعها تلقائياً إلى الخادم بمجرد عودة الاتصال.' 
               : 'It seems you are currently offline. Patient data has been saved locally in the browser and will be uploaded automatically once the connection is restored.');
            
            setIsAddPatientModalOpen(false);
            setIsGeneratingMRN(false);
            return;
         }

         const response = await axios.post('/api/patients', payload, {
            headers: {
               Accept: 'application/json'
            }
         });
         if (response.data.success) {
            setLastGeneratedID(response.data.data.fileNumber);
            setShowSuccessCard(true);
            setIsAddPatientModalOpen(false);
            fetchPatients();
         }
      } catch (error: any) {
         console.error('Failed to create patient', error);
         const message = error?.response?.data?.message || error?.message || 'Failed to create patient';
         alert(message);
      } finally { setIsGeneratingMRN(false); }
   };

   const handleBookAppointment = async () => {
      if (!foundPatient) return alert('No patient selected');
      try {
         const response = await axios.post('/api/appointments', {
            patient_id: foundPatient.id,
            doctor_id: selectedBookingDoctor,
            service_id: selectedBookingService?.id,
            appointment_date: bookingDate,
            appointment_time: bookingTime,
            visit_type: bookingVisitType,
            shift: bookingShift,
            status: 'waiting'
         });
         if (response.data.success) {
            setIsBookModalOpen(false);
            fetchAppointments();
            setSelectedBookingDoctor('');
            setSelectedBookingDeptId('');
            setSelectedBookingSpecialty('');
            setSelectedBookingService(null);
            alert('Booked!');
         }
      } catch (error) { alert('Booking failed'); }
   };

   const days = [
      { en: 'Sunday', ar: 'الأحد' }, { en: 'Monday', ar: 'الإثنين' }, { en: 'Tuesday', ar: 'الثلاثاء' },
      { en: 'Wednesday', ar: 'الأربعاء' }, { en: 'Thursday', ar: 'الخميس' }, { en: 'Friday', ar: 'الجمعة' },
      { en: 'Saturday', ar: 'السبت' }
   ];

   const weeklySchedule: any[] = [];

   const filteredPatients = patients.filter((p: PatientRecord) =>
      (p.nameAr || '').includes(searchTerm) || (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.fileNumber || '').includes(searchTerm)
   );

   return (
      <div className="space-y-6 animate-in fade-in duration-500 relative" dir={isAr ? 'rtl' : 'ltr'}>
         {/* Premium Header Overhaul */}
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-gradient-to-br from-indigo-900 via-indigo-800 to-primary-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-white/10 duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -ml-32 -mb-32 group-hover:bg-primary-500/20 duration-1000" />
            
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center text-white border border-white/20 shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all duration-700">
                  <Users size={40} className="drop-shadow-lg" />
               </div>
               <div className="text-white">
                  <h2 className="text-4xl font-black tracking-tighter leading-none mb-3">
                     {isAr ? 'الاستقبال وإدارة المراجعين' : 'Reception Dashboard'}
                  </h2>
                  <div className="flex items-center gap-3">
                     <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                     <p className="text-xs font-black opacity-60 uppercase tracking-[0.4em]">
                        {isAr ? 'إدارة المواعيد والأسعار والملفات الطبية' : 'Patient Registration & Roster Flow'}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
               {/* Buttons removed per user request for simplified reception workflow */}
            </div>
         </div>
         {/* Metrics Row */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
               { icon: <Users />, label: isAr ? 'إجمالي المرضى' : 'Total Patients', val: (patients || []).length || 0, color: 'bg-primary-100 text-primary-600' },
               { icon: <Clock />, label: isAr ? 'قيد الانتظار' : 'Waiting', val: (appointments || []).filter(a => (a?.status || '').toLowerCase() === 'waiting').length || 0, color: 'bg-amber-100 text-amber-600' },
               { icon: <CheckCircle2 />, label: isAr ? 'معاينة اليوم' : 'Consulted', val: (appointments || []).filter(a => (a?.status || '').toLowerCase() === 'completed').length || 0, color: 'bg-emerald-100 text-emerald-600' },
               { icon: <CreditCard />, label: isAr ? 'إيرادات اليوم' : 'Revenue', val: '$' + (appointments || []).reduce((s, a) => s + (Number(a?.price || 0)), 0), color: 'bg-blue-100 text-blue-600' }
            ].map((m, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${m.color}`}>{m.icon}</div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.label}</p>
                     <h3 className="text-xl font-black text-gray-800">{m.val}</h3>
                  </div>
               </div>
            ))}
         </div>

         <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[700px]">
            {/* Tabs & Search */}
            <div className="p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-6">
               <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                  {['waiting', 'all', 'pricing'].map(t => (
                     <button
                        key={t}
                        onClick={() => setActiveTab(t as any)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === t ? 'bg-white text-primary-600 shadow-md' : 'text-gray-400'}`}
                     >
                        {isAr ? (t === 'waiting' ? 'المراجعات' : t === 'all' ? 'المرضى' : 'الأسعار') : t.toUpperCase()}
                     </button>
                  ))}
               </div>
               <div className="relative group flex items-center">
                  <Search className="absolute right-4 text-gray-400" size={18} />
                  <input
                     type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                     placeholder={isAr ? 'بحث عن مريض...' : 'Search for patient...'}
                     className="bg-gray-50 border border-gray-200 rounded-2xl px-12 py-3 text-sm font-bold w-[350px] outline-none focus:ring-4 focus:ring-primary-50 text-right"
                     dir={isAr ? 'rtl' : 'ltr'}
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
     {activeTab === 'pricing' ? (
         <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
               <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                  <CreditCard className="text-emerald-500" size={24} />
                  {isAr ? 'قائمة الأسعار وجدول المناوبات' : 'Prices & Shifts Roster'}
               </h4>
               <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                  {['prices', 'roster'].map(sub => (
                     <button key={sub} onClick={() => setPricingSubTab(sub as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all shadow-sm ${pricingSubTab === sub ? 'bg-emerald-600 text-white shadow-emerald-200' : 'text-gray-400 hover:bg-white'}`}>
                        {isAr ? (sub === 'prices' ? 'أسعار الخدمات' : 'جدول المناوبات') : sub.toUpperCase()}
                     </button>
                  ))}
               </div>
            </div>

            {pricingSubTab === 'prices' && (
               <div className="space-y-6">
                  <div className="flex bg-white py-3 px-6 rounded-3xl border border-gray-100 shadow-sm items-center gap-4 max-w-sm">
                     <Filter size={18} className="text-emerald-500" />
                     <select 
                        className="w-full bg-transparent font-bold text-sm outline-none cursor-pointer text-gray-700"
                        value={selectedPricingDeptId || ''} 
                        onChange={e => setSelectedPricingDeptId(e.target.value)}
                     >
                        <option value="">{isAr ? '-- تصفية حسب القسم --' : '-- Filter by Department --'}</option>
                        {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                     </select>
                  </div>
                  <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-xl overflow-x-auto custom-scrollbar">
                  <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                     <thead>
                        <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                           <th className="py-6 px-8">{isAr ? 'اسم الخدمة' : 'Service Name'}</th>
                           <th className="py-6 px-6 font-bold">{isAr ? 'التصنيف' : 'Category'}</th>
                           <th className="py-6 px-6">{isAr ? 'القسم' : 'Department'}</th>
                           <th className="py-6 px-6">{isAr ? 'السعر الأصلي' : 'Standard Rate'}</th>
                           <th className="py-6 px-6">{isAr ? 'الخصم المتاح' : 'Discount'} (%)</th>
                           <th className="py-6 px-8 text-emerald-600 bg-emerald-50/50">{isAr ? 'صافي التكلفة' : 'Final Price'}</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {services.filter(s => !selectedPricingDeptId || String(s.department_id) === String(selectedPricingDeptId)).map(s => {
                           const discountAmount = s.discount || 0;
                           const finalVal = s.price - discountAmount;
                           return (
                              <tr key={s.id} className="hover:bg-gray-50 transition-all group">
                                 <td className="py-5 px-8 font-black text-gray-800">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-colors"><Tag size={14} /></div>
                                       {isAr ? s.nameAr : (s.nameEn || s.name)}
                                    </div>
                                 </td>
                                 <td className="py-5 px-6">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tight">{isAr ? (s.classificationAr || 'طبية') : (s.classificationEn || 'Medical')}</span>
                                 </td>
                                 <td className="py-5 px-6 text-xs text-gray-500 font-bold">{depts.find(d => Number(d.id) === Number(s.department_id))?.nameAr || s.department_id}</td>
                                 <td className="py-5 px-6 text-xs text-gray-400 line-through font-bold">{s.price} SDG</td>
                                 <td className="py-5 px-6 font-black">
                                    <span className={`px-2 py-1 rounded text-[10px] ${discountAmount > 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-gray-50 text-gray-300'}`}>
                                       -{discountAmount} SDG
                                    </span>
                                 </td>
                                 <td className="py-5 px-8 text-sm font-black text-emerald-600 bg-emerald-50/20 group-hover:bg-emerald-50/40 transition-colors">
                                    {finalVal.toFixed(2)} SDG
                                 </td>
                              </tr>
                           );
                        })}
                        {services.length === 0 && (
                           <tr><td colSpan={6} className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest">{isAr ? 'لا توجد خدمات مسجلة' : 'No services available'}</td></tr>
                        )}
                     </tbody>
                  </table>
                  </div>
               </div>
            )}

            {pricingSubTab === 'roster' && (
               <div className="space-y-6">
                  <div className="flex flex-wrap bg-white py-3 px-6 rounded-3xl border border-gray-100 shadow-sm items-center gap-4">
                     <div className="flex-1 flex gap-4 min-w-[200px]">
                        <Filter size={18} className="text-primary-500 mt-1" />
                        <select 
                           className="w-full bg-transparent font-bold text-sm outline-none cursor-pointer text-gray-700"
                           value={selectedPricingDeptId || ''} 
                           onChange={e => setSelectedPricingDeptId(e.target.value)}
                        >
                           <option value="">{isAr ? '-- جميع الأقسام --' : '-- All Departments --'}</option>
                           {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                        </select>
                     </div>
                     <div className="w-px h-6 bg-gray-100 hidden md:block" />
                     <div className="flex-1 flex gap-4 min-w-[200px]">
                        <Languages size={18} className="text-indigo-500 mt-1" />
                        <select 
                           className="w-full bg-transparent font-bold text-sm outline-none cursor-pointer text-gray-700"
                           value={selectedBookingSpecialty || ''} // Using similar state or I should use a new one? I'll use selectedBookingSpecialty just for UI context if I don't want to add more states.
                           onChange={e => setSelectedBookingSpecialty(e.target.value)}
                        >
                           <option value="">{isAr ? '-- جميع التخصصات --' : '-- All Specialties --'}</option>
                           {specialties.map(s => <option key={s.id} value={isAr ? s.nameAr : s.nameEn}>{isAr ? s.nameAr : s.nameEn}</option>)}
                        </select>
                     </div>
                  </div>
                  <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden shadow-xl overflow-x-auto custom-scrollbar">
                     <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                        <thead>
                           <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase">
                              <th className="py-6 px-6 min-w-[200px] border-l border-gray-100">{isAr ? 'اسم الكادر' : 'Staff Name'}</th>
                              <th className="py-6 px-6 min-w-[150px] border-l border-gray-100">{isAr ? 'التخصص' : 'Specialty'}</th>
                              {[
                                 { id: 'sat', ar: 'السبت', en: 'Sat' },
                                 { id: 'sun', ar: 'الأحد', en: 'Sun' },
                                 { id: 'mon', ar: 'الإثنين', en: 'Mon' },
                                 { id: 'tue', ar: 'الثلاثاء', en: 'Tue' },
                                 { id: 'wed', ar: 'الأربعاء', en: 'Wed' },
                                 { id: 'thu', ar: 'الخميس', en: 'Thu' },
                                 { id: 'fri', ar: 'الجمعة', en: 'Fri' }
                              ].map(day => (
                                 <th key={day.id} className="py-6 px-2 text-center border-l border-gray-100 text-indigo-500 hover:bg-indigo-50 transition-colors">{isAr ? day.ar : day.en}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {[...doctors, ...nurses].filter((d: any) => 
                              (!selectedPricingDeptId || String(d.department_id || d.deptId) === String(selectedPricingDeptId)) && 
                              (!selectedBookingSpecialty || d.specialtyAr === selectedBookingSpecialty || d.specialtyEn === selectedBookingSpecialty || d.specialty_ar === selectedBookingSpecialty || d.specialty_en === selectedBookingSpecialty)
                           ).map((d: any) => (
                              <tr key={d.id + '-' + d.role} className="hover:bg-gray-50 transition-colors group">
                                 <td className="py-5 px-6 font-black text-gray-800 border-l border-gray-100">
                                    <div className="flex items-center gap-4">
                                       <div className="w-1.5 h-10 bg-indigo-600 rounded-full shadow-sm" />
                                       <div className="flex flex-col">
                                          <span className="text-sm tracking-tight">{isAr ? d.nameAr : (d.nameEn || d.name)}</span>
                                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                             {isAr ? d.deptAr : (d.deptEn || d.department?.name || 'Hospital')}
                                          </span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-5 px-6 font-bold text-gray-500 text-sm border-l border-gray-50">
                                    <div className="text-emerald-600 font-bold uppercase tracking-widest">{isAr ? (d.specialtyAr || d.job_title || 'ممرض') : (d.specialtyEn || d.jobTitle || d.job_title || 'Nurse')}</div>
                                 </td>
                                 {[ 'sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri' ].map((dayId, idx) => {
                                    const shifts = (d.day_shifts || []).filter((s:any) => s.day?.toLowerCase().startsWith(dayId.substring(0,3)));
                                    return (
                                       <td key={dayId} className={`py-4 px-2 text-center border-l border-gray-50 align-middle ${idx === 6 ? 'border-l-0' : ''}`}>
                                          <div className="flex flex-col gap-1.5 items-center justify-center">
                                             {shifts.length > 0 ? shifts.map((shift: any, i: number) => (
                                                <div key={i} className={`px-2 py-1.5 min-w-[50px] flex flex-col items-center gap-0.5 rounded-lg border shadow-sm transition-transform hover:scale-105 ${shift.type === 'morning' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50' : 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50'}`}>
                                                   <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">
                                                       {isAr ? (shift.type === 'morning' ? 'صباحي' : shift.type === 'evening' ? 'مسائي' : 'ليلي') : shift.type}
                                                   </span>
                                                   <span className="text-[7px] font-bold opacity-70 italic">{shift.work_hours || 8}h</span>
                                                </div>
                                             )) : <span className="text-gray-200 block opacity-50">-</span>}
                                          </div>
                                       </td>
                                    );
                                 })}
                              </tr>
                           ))}
                           {[...doctors, ...nurses].filter((d: any) => !selectedPricingDeptId || String(d.department_id || d.deptId) === String(selectedPricingDeptId)).length === 0 && (
                              <tr><td colSpan={9} className="py-12 text-center text-gray-400 font-bold text-sm tracking-widest">{isAr ? 'لا توجد بيانات متاحة' : 'No data available'}</td></tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      ) : activeTab === 'waiting' ? (
                     <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                           <h4 className="text-xl font-black text-gray-800 flex items-center gap-3"><Clock className="text-amber-500" size={24} />{isAr ? 'إدارة الطابور' : 'Queue Management'}</h4>
                           <div className="flex bg-gray-100 p-1 rounded-2xl">
                              {['waiting', 'in-consult', 'completed'].map(sub => (
                                 <button key={sub} onClick={() => setWaitingSubTab(sub as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${waitingSubTab === sub ? 'bg-primary-600 text-white' : 'text-gray-400'}`}>{isAr ? (sub === 'waiting' ? 'انتظار' : sub === 'in-consult' ? 'مع الطبيب' : 'مكتمل') : sub.toUpperCase()}</button>
                              ))}
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {appointments.filter(a => (a.status || '').toLowerCase() === (waitingSubTab || '').toLowerCase()).map(a => (
                              <div key={a.id} className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-xl border-t-8" style={{ borderTopColor: waitingSubTab === 'waiting' ? '#f59e0b' : waitingSubTab === 'in-consult' ? '#2563eb' : '#10b981' }}>
                                 <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center text-xl font-black text-gray-800">{(a.patientName || 'P').charAt(0)}</div><div><h5 className="font-black text-gray-800">{isAr ? a.patientNameAr : a.patientName}</h5><p className="text-[10px] text-gray-400 font-bold">{a.time}</p></div></div>
                                 <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-[10px]">
                                    <div className="flex justify-between"><span className="text-gray-400 uppercase font-bold">{isAr ? 'الطبيب' : 'Doctor'}</span><span className="font-black text-gray-800">{isAr ? a.doctorAr : a.doctor}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-400 uppercase font-bold">{isAr ? 'الحالة' : 'Status'}</span><span className="font-black text-primary-600 uppercase">{a.status}</span></div>
                                 </div>
                                 <div className="flex gap-2 mt-6">
                                    <button onClick={() => { setSelectedPatient(patients.find(p => p.id === a.patient_id) || null); setIsPatientDetailOpen(true); }} className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-primary-600 hover:text-white transition-all">{isAr ? 'معاينة' : 'View'}</button>
                                    {waitingSubTab !== 'completed' && <button className="flex-1 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-50">{isAr ? 'دخول' : 'Admit'}</button>}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     ) : (
                     <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-[30px] border border-gray-100">
                           <h3 className="text-xl font-black text-gray-800 flex items-center gap-3"><Users className="text-primary-500" size={24} />{isAr ? 'قاعدة بيانات المرضى' : 'Patient Records'}</h3>
                           <div className="flex gap-4">
                              <button onClick={() => setIsBookModalOpen(true)} className="bg-amber-100 text-amber-600 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all"><Calendar size={18} />{isAr ? 'حجز موعد' : 'Book Appointment'}</button>
                              <button onClick={() => {
                                 setNewPatient(prev => ({ ...prev, departmentId: selectedPricingDeptId ? String(selectedPricingDeptId) : '' }));
                                 setIsAddPatientModalOpen(true);
                              }} className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary-100"><UserPlus size={18} />{isAr ? 'تسجيل مريض' : 'Register New'}</button>
                           </div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                              <thead><tr className="text-gray-400 text-[10px] font-black uppercase border-b border-gray-50"><th className="pb-4 px-4 text-center">MRN</th><th className="pb-4 px-4">{isAr ? 'المريض' : 'Patient'}</th><th className="pb-4 px-4">{isAr ? 'الهاتف' : 'Phone'}</th><th className="pb-4 px-4">{isAr ? 'الحالة' : 'Status'}</th><th className="pb-4 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th></tr></thead>
                              <tbody className="divide-y divide-gray-50">
                                 {filteredPatients.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                       <td className="py-6 px-4 text-center"><div className="p-3 bg-gray-100 rounded-2xl font-black text-[11px]">{p.fileNumber}</div></td>
                                       <td className="py-6 px-4"><div><p className="font-black text-gray-800">{isAr ? p.nameAr : p.name}</p><p className="text-[10px] text-gray-400 font-bold">{isAr ? 'آخر زيارة: ' : 'Last visit: '}{p.lastVisit}</p></div></td>
                                       <td className="py-6 px-4 text-xs font-black text-gray-600">{p.phone}</td>
                                       <td className="py-6 px-4"><span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${p.status === 'waiting' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{p.status}</span></td>
                                       <td className="py-6 px-4 flex justify-center gap-2">
                                          <button onClick={() => { setSelectedPatient(p); setIsPatientDetailOpen(true); }} className="p-3 bg-white border border-gray-100 rounded-xl text-primary-600"><Eye size={16} /></button>
                                          <button onClick={() => {
                                             setEditingPatient({
                                                ...p,
                                                departmentId: (p as any).department_id || '',
                                                doctorId: (p as any).doctor_id || '',
                                                visitType: (p as any).visit_type || 'regular',
                                                shift: (p as any).shift || 'morning'
                                             } as any);
                                             setIsEditPatientModalOpen(true);
                                          }} className="p-3 bg-white border border-gray-100 rounded-xl text-amber-600 transition-all hover:bg-amber-50 active:scale-90"><Edit3 size={16} /></button>
                                          <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400"><Trash2 size={16} /></button>
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

            {/* MODALS */}
            {/* Edit Doctor Modal */}
            {isEditDoctorModalOpen && editingDoctor && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsEditDoctorModalOpen(false)} />
                  <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                     <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-primary-600 text-white">
                        <div><h3 className="text-2xl font-black">{isAr ? 'تعديل بيانات الطبيب' : 'Edit Physician Info'}</h3></div>
                        <button onClick={() => setIsEditDoctorModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><X size={20} /></button>
                     </div>
                     <div className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label><input dir="rtl" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={editingDoctor.nameAr} onChange={e => setEditingDoctor({ ...editingDoctor, nameAr: e.target.value })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (En)' : 'Name (En)'}</label><input className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={editingDoctor.nameEn} onChange={e => setEditingDoctor({ ...editingDoctor, nameEn: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'التخصص (ع)' : 'Specialty (Ar)'}</label><input dir="rtl" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={editingDoctor.specialtyAr} onChange={e => setEditingDoctor({ ...editingDoctor, specialtyAr: e.target.value })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'التخصص (En)' : 'Specialty (En)'}</label><input className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={editingDoctor.specialtyEn} onChange={e => setEditingDoctor({ ...editingDoctor, specialtyEn: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'المواعيد' : 'Schedule'}</label><input className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={editingDoctor.availability} onChange={e => setEditingDoctor({ ...editingDoctor, availability: e.target.value })} /></div>
                        <button onClick={handleUpdateDoctor} className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-50">Save Changes</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Edit Patient Modal (Enhanced) */}
            {isEditPatientModalOpen && editingPatient && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                  <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                     {/* Sidebar for Edit */}
                     <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 p-8 flex flex-col gap-2">
                        <div className="mb-8 hidden md:block">
                           <h3 className="text-lg font-black text-gray-800">{isAr ? 'تعديل البيانات' : 'Edit Patient'}</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{editingPatient.fileNumber}</p>
                        </div>
                        {[
                           { id: 'personal', icon: <User size={18} />, labelAr: 'البيانات الشخصية', labelEn: 'Personal Data' },
                           { id: 'contact', icon: <Phone size={18} />, labelAr: 'معلومات الاتصال', labelEn: 'Contact Info' },
                           { id: 'medical', icon: <Shield size={18} />, labelAr: 'البيانات الطبية', labelEn: 'Medical Data' },
                           { id: 'booking', icon: <Calendar size={18} />, labelAr: 'بيانات الحجز', labelEn: 'Booking Info' }
                        ].map(s => (
                           <button
                              key={s.id}
                              onClick={() => setModalSection(s.id as any)}
                              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${modalSection === s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                           >
                              <div className={modalSection === s.id ? 'text-white' : 'text-primary-500'}>{s.icon}</div>
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{isAr ? s.labelAr : s.labelEn}</span>
                           </button>
                        ))}
                     </div>

                     {/* Content Area for Edit */}
                     <div className="flex-1 flex flex-col min-h-0 bg-white">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                           <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                              {modalSection === 'personal' && <User className="text-primary-500" />}
                              {modalSection === 'contact' && <Phone className="text-amber-500" />}
                              {modalSection === 'medical' && <Shield className="text-emerald-500" />}
                              {modalSection === 'booking' && <Calendar className="text-indigo-500" />}
                              {isAr ? (
                                 modalSection === 'personal' ? 'تعديل البيانات الشخصية' :
                                    modalSection === 'contact' ? 'تعديل معلومات الاتصال' :
                                       modalSection === 'medical' ? 'تعديل البيانات الطبية' : 'تعديل بيانات الحجز'
                              ) : (
                                 modalSection === 'personal' ? 'Edit Personal Data' :
                                    modalSection === 'contact' ? 'Edit Contact Info' :
                                       modalSection === 'medical' ? 'Edit Medical Data' : 'Edit Booking Info'
                              )}
                           </h4>
                           <button onClick={() => setIsEditPatientModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                           {modalSection === 'personal' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label>
                                       <input dir="rtl" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={editingPatient.nameAr} onChange={e => setEditingPatient({ ...editingPatient, nameAr: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'Name (En)' : 'Name (En)'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={editingPatient.name} onChange={e => setEditingPatient({ ...editingPatient, name: e.target.value })} />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'رقم الهوية' : 'National ID'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={editingPatient.nationalId} onChange={e => setEditingPatient({ ...editingPatient, nationalId: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الجنس' : 'Gender'}</label>
                                          <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingPatient.genderEn} onChange={e => setEditingPatient({ ...editingPatient, genderEn: e.target.value })}>
                                             <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                                             <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                                          </select>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                                          <input type="date" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingPatient.birthDate} onChange={e => setEditingPatient({ ...editingPatient, birthDate: e.target.value })} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'contact' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                                       <div className="relative">
                                          <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
                                          <input className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-50" value={editingPatient.phone} onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })} />
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                       <div className="relative">
                                          <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
                                          <input className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingPatient.email} onChange={e => setEditingPatient({ ...editingPatient, email: e.target.value })} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'العنوان السكني' : 'Home Address'}</label>
                                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none h-32" value={editingPatient.address} onChange={e => setEditingPatient({ ...editingPatient, address: e.target.value })} />
                                 </div>
                              </div>
                           )}

                           {modalSection === 'medical' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'فصيلة الدم' : 'Blood Group'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" value={editingPatient.bloodType} onChange={e => setEditingPatient({ ...editingPatient, bloodType: e.target.value })}>
                                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'حساسية الأدوية' : 'Drug Allergies'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingPatient.drugAllergy} onChange={e => setEditingPatient({ ...editingPatient, drugAllergy: e.target.value })} />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الأمراض المزمنة' : 'Chronic Diseases'}</label>
                                    <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingPatient.chronicDiseases} onChange={e => setEditingPatient({ ...editingPatient, chronicDiseases: e.target.value })} />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'التاريخ المرضي' : 'Medical History'}</label>
                                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none h-32" value={editingPatient.medicalHistory} onChange={e => setEditingPatient({ ...editingPatient, medicalHistory: e.target.value })} />
                                 </div>
                              </div>
                           )}

                           {modalSection === 'booking' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'القسم المختص' : 'Target Department'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={(editingPatient as any).departmentId} onChange={e => setEditingPatient({ ...editingPatient, departmentId: e.target.value, doctorId: '', specialty: '', shift: '' } as any)}>
                                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                                          {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'التخصص' : 'Specialty'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={(editingPatient as any).specialty || ''} onChange={e => setEditingPatient({ ...editingPatient, specialty: e.target.value, doctorId: '' } as any)}>
                                          <option value="">{isAr ? 'الكل' : 'All Specialties'}</option>
                                          {specialties.map(s => <option key={s.id} value={isAr ? s.nameAr : s.nameEn}>{isAr ? s.nameAr : s.nameEn}</option>)}
                                       </select>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الطبيب المعالج' : 'Assigned Physician'}</label>
                                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={(editingPatient as any).doctorId} onChange={e => setEditingPatient({ ...editingPatient, doctorId: e.target.value } as any)}>
                                       <option value="">{isAr ? 'اختر الطبيب...' : 'Select Doctor...'}</option>
                                       {doctors.filter(d => {
                                          const matchesDept = !(editingPatient as any).departmentId || d.department_id === Number((editingPatient as any).departmentId);
                                          const matchesSpecialty = !(editingPatient as any).specialty || d.specialtyAr === (editingPatient as any).specialty || d.specialtyEn === (editingPatient as any).specialty || d.specialty_ar === (editingPatient as any).specialty || d.specialty_en === (editingPatient as any).specialty;
                                          const matchesShift = !(editingPatient as any).shift || (d.day_shifts || []).some((s: any) => s.type === (editingPatient as any).shift);
                                          return matchesDept && matchesSpecialty && matchesShift;
                                       }).map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : (d.nameEn || d.name)}</option>)}
                                    </select>
                                 </div>

                                 <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'نوع الزيارة' : 'Visit Type'}</label>
                                          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                             {[
                                                { id: 'regular', ar: 'كشف', en: 'Consultation' },
                                                { id: 'follow-up', ar: 'متابعة', en: 'Follow-up' },
                                                { id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                                             ].map(type => (
                                                <button
                                                   key={type.id}
                                                   type="button"
                                                   onClick={() => {
                                                      const isEmerg = type.id === 'emergency';
                                                      const emergencyDept = depts.find(d => d.nameEn?.toLowerCase().includes('emergency') || d.nameAr?.includes('طوارئ'));
                                                      setEditingPatient({
                                                         ...editingPatient,
                                                         visitType: type.id,
                                                         departmentId: isEmerg && emergencyDept ? String(emergencyDept.id) : (editingPatient as any).departmentId
                                                      } as any);
                                                   }}
                                                   className={`flex-1 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest ${(editingPatient as any).visitType === type.id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                   {isAr ? type.ar : type.en}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الموعد (فترة العمل)' : 'Appointment Slot'}</label>
                                          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                             {[
                                                { id: 'morning', ar: 'صباحي', en: 'Morning' },
                                                { id: 'evening', ar: 'مسائي', en: 'Evening' }
                                             ].map(shift => (
                                                <button
                                                   key={shift.id}
                                                   type="button"
                                                   onClick={() => setEditingPatient({ ...editingPatient, shift: shift.id } as any)}
                                                   className={`flex-1 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest ${(editingPatient as any).shift === shift.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                   {isAr ? shift.ar : shift.en}
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                           <div className="flex gap-2">
                              <button
                                 onClick={() => {
                                    const sections = ['personal', 'contact', 'medical', 'booking'];
                                    const idx = sections.indexOf(modalSection);
                                    if (idx > 0) setModalSection(sections[idx - 1] as any);
                                 }}
                                 disabled={modalSection === 'personal'}
                                 className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${modalSection === 'personal' ? 'text-gray-200 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                              >
                                 {isAr ? 'السابق' : 'Back'}
                              </button>
                              <button
                                 onClick={() => {
                                    const sections = ['personal', 'contact', 'medical', 'booking'];
                                    const idx = sections.indexOf(modalSection);
                                    if (idx < sections.length - 1) setModalSection(sections[idx + 1] as any);
                                 }}
                                 disabled={modalSection === 'booking'}
                                 className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${modalSection === 'booking' ? 'text-gray-200 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                              >
                                 {isAr ? 'التالي' : 'Next'}
                              </button>
                           </div>
                           <button
                              onClick={handleUpdatePatient}
                              className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                           >
                              <Check size={16} />
                              {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Edit Service Modal */}
            {isEditServiceModalOpen && editingService && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsEditServiceModalOpen(false)} />
                  <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                     <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-amber-500 text-white">
                        <div><h3 className="text-2xl font-black">{isAr ? 'تعديل بيانات الخدمة' : 'Edit Service details'}</h3></div>
                        <button onClick={() => setIsEditServiceModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><X size={20} /></button>
                     </div>
                     <div className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label><input dir="rtl" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-50" value={editingService.nameAr} onChange={e => setEditingService({ ...editingService, nameAr: e.target.value })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (En)' : 'Name (En)'}</label><input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-50" value={editingService.nameEn} onChange={e => setEditingService({ ...editingService, nameEn: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'التصنيف' : 'Category'}</label><input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingService.category} onChange={e => setEditingService({ ...editingService, category: e.target.value })} /></div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'القسم' : 'Department'}</label>
                              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingService.department_id || editingService.departmentId} onChange={e => setEditingService({ ...editingService, department_id: e.target.value })}>
                                 <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                                 {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                              </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الحالة' : 'Status'}</label>
                              <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={editingService.status} onChange={e => setEditingService({ ...editingService, status: e.target.value })}>
                                 <option value="active">{isAr ? 'نشط' : 'Active'}</option>
                                 <option value="inactive">{isAr ? 'غير نشط' : 'Inactive'}</option>
                              </select>
                           </div>
                           <div className="grid grid-cols-3 gap-2 col-span-1">
                              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'السعر' : 'Price'}</label><input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={editingService.price} onChange={e => setEditingService({ ...editingService, price: e.target.value, finalPrice: Number(e.target.value) - Number(editingService.discount) })} /></div>
                              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الخصم' : 'Discount'}</label><input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={editingService.discount} onChange={e => setEditingService({ ...editingService, discount: e.target.value, finalPrice: Number(editingService.price) - Number(e.target.value) })} /></div>
                              <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'النهائي' : 'Final'}</label><input type="number" className="w-full p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm" value={editingService.finalPrice} readOnly /></div>
                           </div>
                        </div>
                        <button onClick={handleUpdateService} className="w-full py-5 bg-amber-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-50 hover:bg-amber-600 transition-all">Save Changes</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Add Service Modal */}
            {isAddServiceModalOpen && (
               <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                  <div className="absolute inset-0" onClick={() => setIsAddServiceModalOpen(false)} />
                  <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                     <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-emerald-600 text-white">
                        <div><h3 className="text-2xl font-black">{isAr ? 'إضافة خدمة جديدة' : 'Add New Service'}</h3></div>
                        <button onClick={() => setIsAddServiceModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><X size={20} /></button>
                     </div>
                     <div className="p-10 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label><input dir="rtl" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" placeholder="اسم الخدمة..." value={newService.nameAr} onChange={e => setNewService({ ...newService, nameAr: e.target.value })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الاسم (En)' : 'Name (En)'}</label><input className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" placeholder="Service Name..." value={newService.nameEn} onChange={e => setNewService({ ...newService, nameEn: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'التصنيف' : 'Category'}</label><input className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" placeholder="e.g. Lab, Radiology..." value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} /></div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'القسم' : 'Department'}</label>
                              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={newService.departmentId} onChange={e => setNewService({ ...newService, departmentId: e.target.value })}>
                                 <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                                 {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                              </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'السعر' : 'Price'}</label><input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value, finalPrice: String(Number(e.target.value) - Number(newService.discount)) })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الخصم' : 'Discount'}</label><input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={newService.discount} onChange={e => setNewService({ ...newService, discount: e.target.value, finalPrice: String(Number(newService.price) - Number(e.target.value)) })} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'النهائي' : 'Final'}</label><input type="number" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none" value={newService.finalPrice} readOnly /></div>
                        </div>
                        <button onClick={handleCreateService} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-50">Create Service</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Register Patient Modal */}
            {isAddPatientModalOpen && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                  <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                     {/* Sidebar */}
                     <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 p-8 flex flex-col gap-2">
                        <div className="mb-8 hidden md:block">
                           <h3 className="text-lg font-black text-gray-800">{isAr ? 'تسجيل مريض' : 'Register'}</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'ملف جديد' : 'New File'}</p>
                        </div>
                        {[
                           { id: 'personal', icon: <User size={18} />, labelAr: 'البيانات الشخصية', labelEn: 'Personal Data' },
                           { id: 'contact', icon: <Phone size={18} />, labelAr: 'معلومات الاتصال', labelEn: 'Contact Info' },
                           { id: 'booking', icon: <Clock size={18} />, labelAr: 'بيانات الحجز', labelEn: 'Booking Info' },
                           { id: 'medical', icon: <Shield size={18} />, labelAr: 'البيانات الطبية', labelEn: 'Medical Data' }
                        ].map(s => (
                           <button
                              key={s.id}
                              onClick={() => setModalSection(s.id as any)}
                              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${modalSection === s.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                           >
                              <div className={modalSection === s.id ? 'text-white' : 'text-primary-500'}>{s.icon}</div>
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{isAr ? s.labelAr : s.labelEn}</span>
                           </button>
                        ))}
                     </div>

                     {/* Content Area */}
                     <div className="flex-1 flex flex-col min-h-0 bg-white">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                           <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                              {modalSection === 'personal' && <User className="text-primary-500" />}
                              {modalSection === 'contact' && <Phone className="text-amber-500" />}
                              {modalSection === 'booking' && <Clock className="text-indigo-500" />}
                              {modalSection === 'medical' && <Shield className="text-emerald-500" />}
                              {isAr ? (
                                 modalSection === 'personal' ? 'البيانات الشخصية' :
                                    modalSection === 'contact' ? 'معلومات الاتصال' :
                                       modalSection === 'booking' ? 'بيانات الحجز' : 'البيانات الطبية'
                              ) : (
                                 modalSection === 'personal' ? 'Personal Data' :
                                    modalSection === 'contact' ? 'Contact Info' :
                                       modalSection === 'booking' ? 'Booking Info' : 'Medical Data'
                              )}
                           </h4>
                           <button onClick={() => setIsAddPatientModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                           {modalSection === 'personal' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 {/* Patient Global Search for Existent Files */}
                                 <div className="p-6 bg-primary-50 rounded-[2.5rem] border border-primary-100 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-3 mb-2">
                                       <div className="w-10 h-10 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Search size={18} /></div>
                                       <div>
                                          <h4 className="text-sm font-black text-gray-800 leading-none">{isAr ? 'بحث سريع عن مريض مسجل' : 'Quick Data Retrieval'}</h4>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{isAr ? 'استرجع بيانات مريض من القاعدة' : 'Search by Name or Phone'}</p>
                                       </div>
                                    </div>
                                    <div className="relative">
                                       <input 
                                          className={`w-full p-5 ${isAr ? 'pr-14' : 'pl-14'} bg-white border-2 border-primary-100 rounded-[2rem] text-xs font-black focus:border-primary-500 outline-none transition-all shadow-inner placeholder:text-gray-300`} 
                                          value={patientSearchTerm} 
                                          onChange={e => setPatientSearchTerm(e.target.value)} 
                                          placeholder={isAr ? '...ابحث هنا بالاسم، الهاتف، أو الرقم الطبي' : 'Search by name, phone, or MRN...'}
                                       />
                                       <div className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-primary-500`}><Users size={18} /></div>
                                    </div>

                                    {patientSearchTerm.length > 0 && (
                                       <div className="mt-3 p-3 bg-white rounded-[2rem] shadow-2xl border border-primary-50 max-h-[300px] overflow-y-auto custom-scrollbar animate-in slide-in-from-top-4 duration-300 z-[120]">
                                          {patients.filter(p => 
                                             p.nameAr?.toLowerCase().includes(patientSearchTerm.toLowerCase()) || 
                                             p.name?.toLowerCase().includes(patientSearchTerm.toLowerCase()) || 
                                             p.phone?.includes(patientSearchTerm) ||
                                             (p as any).medicalRecordNumber?.includes(patientSearchTerm)
                                          ).length === 0 ? (
                                             <div className="p-6 text-center text-gray-400 font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-2">
                                                <Ghost size={24} className="opacity-20" />
                                                {isAr ? 'لا يوجد تطابق' : 'No Database Match'}
                                             </div>
                                          ) : (
                                             patients.filter(p => 
                                                p.nameAr?.toLowerCase().includes(patientSearchTerm.toLowerCase()) || 
                                                p.name?.toLowerCase().includes(patientSearchTerm.toLowerCase()) || 
                                                p.phone?.includes(patientSearchTerm) ||
                                                (p as any).medicalRecordNumber?.includes(patientSearchTerm)
                                             ).map(p => (
                                                <button 
                                                   key={p.id}
                                                   type="button" 
                                                   onClick={() => {
                                                      setNewPatient({
                                                         ...newPatient,
                                                         nameAr: p.nameAr || p.name,
                                                         nameEn: p.name,
                                                         phone: p.phone,
                                                         email: p.email || '',
                                                         address: p.address || '',
                                                         nationalId: p.nationalId || '',
                                                         birthDate: p.birthDate || '',
                                                         gender: (p as any).genderEn || p.genderEn || 'male',
                                                         bloodType: (p as any).bloodType || 'O+',
                                                         chronicDiseases: (p as any).chronicDiseases || '',
                                                         drugAllergy: (p as any).drugAllergy || '',
                                                         medicalHistory: (p as any).medicalHistory || ''
                                                      });
                                                      setPatientSearchTerm(p.nameAr || p.name);
                                                      setModalSection('booking'); // Advance to booking details as requested
                                                   }}
                                                   className={`w-full ${isAr ? 'text-right' : 'text-left'} p-4 hover:bg-primary-50 rounded-2xl mb-1 transition-all flex items-center justify-between border border-transparent hover:border-primary-100 group/item`}
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-12 h-12 bg-white shadow-inner rounded-xl flex items-center justify-center text-primary-600 font-black group-hover/item:scale-110 transition-transform">{(p.nameAr || p.name || 'P').charAt(0)}</div>
                                                      <div>
                                                         <p className="font-black text-slate-800 text-sm">{p.nameAr || p.name}</p>
                                                         <div className="flex gap-2">
                                                            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{p.phone}</span>
                                                            <span className="text-[9px] text-primary-50 font-black tracking-widest uppercase">File #{(p as any).fileNumber || p.id}</span>
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <ChevronRight size={14} className={isAr ? 'rotate-180 text-primary-300' : 'text-primary-300'} />
                                                </button>
                                             ))
                                          )}
                                       </div>
                                    )}
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label>
                                       <input dir="rtl" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={newPatient.nameAr} onChange={e => setNewPatient({ ...newPatient, nameAr: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'Name (En)' : 'Name (En)'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={newPatient.nameEn} onChange={e => setNewPatient({ ...newPatient, nameEn: e.target.value })} />
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'رقم الهوية' : 'National ID'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50" value={newPatient.nationalId} onChange={e => setNewPatient({ ...newPatient, nationalId: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الجنس' : 'Gender'}</label>
                                          <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}>
                                             <option value="male">{isAr ? 'ذكر' : 'Male'}</option>
                                             <option value="female">{isAr ? 'أنثى' : 'Female'}</option>
                                          </select>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                                          <input type="date" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newPatient.birthDate} onChange={e => setNewPatient({ ...newPatient, birthDate: e.target.value })} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'contact' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                                       <div className="relative">
                                          <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
                                          <input className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-50" value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} />
                                       </div>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                       <div className="relative">
                                          <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
                                          <input className="w-full p-4 pl-12 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'العنوان السكني' : 'Home Address'}</label>
                                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none h-32" value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} />
                                 </div>
                              </div>
                           )}

                           {modalSection === 'booking' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 {/* First Row: Dept & Specialty */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'القسم المختص' : 'Target Department'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50" value={newPatient.departmentId} onChange={e => setNewPatient({ ...newPatient, departmentId: e.target.value, doctorId: '', specialty: '', shift: '' })}>
                                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                                          {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'التخصص' : 'Specialty'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={(newPatient as any).specialty || ''} onChange={e => setNewPatient({ ...newPatient, specialty: e.target.value, doctorId: '' } as any)}>
                                          <option value="">{isAr ? 'الكل' : 'All Specialties'}</option>
                                          {specialties.map(s => <option key={s.id} value={isAr ? s.nameAr : s.nameEn}>{isAr ? s.nameAr : s.nameEn}</option>)}
                                       </select>
                                    </div>
                                 </div>

                                 {/* Second Row: Physician (Searchable) */}
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الطبيب المعالج' : 'Assigned Physician'}</label>
                                    <div className="relative group-search-physician-modern">
                                       <Search className={`absolute ${isAr ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none`} size={14} />
                                       <input
                                          type="text"
                                          className={`w-full p-4 ${isAr ? 'pl-10 text-right' : 'pr-10'} bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-primary-50 transition-all`}
                                          placeholder={isAr ? 'ابحث عن طبيب...' : 'Search for physician...'}
                                          value={doctorSearchTerm}
                                          onChange={e => {
                                             setDoctorSearchTerm(e.target.value);
                                             if (!e.target.value) setNewPatient({ ...newPatient, doctorId: '' });
                                          }}
                                          onFocus={() => { if (!doctorSearchTerm) setDoctorSearchTerm(' '); setTimeout(() => setDoctorSearchTerm(''), 10); }}
                                       />
                                       
                                       {doctorSearchTerm.length > 0 && (
                                          <div className="absolute top-full left-0 right-0 z-[100] mt-2 p-2 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                                             {(() => {
                                                const filteredDocs = doctors.filter(d => {
                                                   const matchSearch = (isAr ? (d.nameAr || d.name) : (d.nameEn || d.name)).toLowerCase().includes(doctorSearchTerm.toLowerCase().trim());
                                                   const matchDept = !newPatient.departmentId || String(d.department_id) === String(newPatient.departmentId);
                                                   const matchSpecialty = !(newPatient as any).specialty || d.specialtyAr === (newPatient as any).specialty || d.specialtyEn === (newPatient as any).specialty || d.specialty_ar === (newPatient as any).specialty || d.specialty_en === (newPatient as any).specialty;
                                                   const matchShift = !newPatient.shift || (d.day_shifts && Array.isArray(d.day_shifts) && d.day_shifts.some((s: any) => {
                                                      const sType = typeof s === 'string' ? s : s.type;
                                                      return sType && sType.toLowerCase() === newPatient.shift.toLowerCase();
                                                   }));
                                                   const matchShiftsArr = !newPatient.shift || (d.shifts && Array.isArray(d.shifts) && d.shifts.some((s: any) => {
                                                      const sType = typeof s === 'string' ? s : s.type;
                                                      return sType && sType.toLowerCase() === newPatient.shift.toLowerCase();
                                                   }));
                                                   
                                                   return matchSearch && matchDept && matchSpecialty && (matchShift || matchShiftsArr);
                                                });

                                                if (filteredDocs.length === 0) {
                                                   return (
                                                      <div className="p-4 text-center text-gray-400 font-bold text-sm">
                                                         {isAr ? 'لا يوجد أطباء متاحين بهذه المواصفات أو في هذه الفترة' : 'No doctors available matching these criteria or shift'}
                                                      </div>
                                                   );
                                                }

                                                return filteredDocs.map(d => (
                                                   <button
                                                      key={d.id}
                                                      type="button"
                                                      onClick={() => {
                                                         setNewPatient({ ...newPatient, doctorId: String(d.id) });
                                                         setDoctorSearchTerm(isAr ? (d.nameAr || d.name) : (d.nameEn || d.name));
                                                      }}
                                                      className={`w-full ${isAr ? 'text-right' : 'text-left'} p-4 hover:bg-primary-50 rounded-2xl transition-all flex items-center justify-between group/doc-find-final mb-1`}
                                                   >
                                                      <div className="flex items-center gap-3">
                                                         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary-600 font-black group-hover:bg-white transition-colors">{(isAr ? (d.nameAr || d.name) : (d.nameEn || d.name)).charAt(0)}</div>
                                                         <div>
                                                            <h6 className="font-extrabold text-gray-800 text-sm group-hover:text-primary-700">{isAr ? (d.nameAr || d.name) : (d.nameEn || d.name)}</h6>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isAr ? (d.specialtyAr || d.specialty_ar) : (d.specialtyEn || d.specialty_en)}</p>
                                                         </div>
                                                      </div>
                                                      <ChevronRight size={14} className={isAr ? 'rotate-180 text-gray-300' : 'text-gray-300'} />
                                                   </button>
                                                ));
                                             })()}
                                          </div>
                                       )}
                                    </div>

                                    {newPatient.doctorId && (
                                       <div className="p-5 bg-primary-50 rounded-[2.5rem] border border-primary-100 flex items-center gap-4 animate-in slide-in-from-right-4 duration-300 mt-2">
                                          <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Stethoscope size={24} /></div>
                                          <div>
                                             <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">{isAr ? 'بيانات الطبيب' : 'Doctor Details'}</p>
                                             <h5 className="font-extrabold text-gray-800 text-sm">
                                                {(() => {
                                                   const doc = doctors.find(d => String(d.id) === String(newPatient.doctorId));
                                                   return doc ? (isAr ? doc.nameAr : (doc.nameEn || doc.name)) : '';
                                                })()}
                                             </h5>
                                             <span className="px-2 py-0.5 bg-white/50 text-primary-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-100 mt-1 inline-block">
                                                {(() => {
                                                   const doc = doctors.find(d => String(d.id) === String(newPatient.doctorId));
                                                   return doc ? (doc.grade || (isAr ? 'أخصائي' : 'Specialist')) : '';
                                                })()}
                                             </span>
                                          </div>
                                       </div>
                                    )}
                                 </div>

                                 {/* Third Row: Service & Shift Side-by-Side */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الخدمة المطلوبة' : 'Service Required'}</label>
                                       <select 
                                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" 
                                          value={newPatient.serviceId}
                                          onChange={e => {
                                             const srv = services.find(s => s.id === Number(e.target.value));
                                             setNewPatient({ ...newPatient, serviceId: e.target.value, selectedService: srv });
                                          }}
                                       >
                                          <option value="">{isAr ? 'اختر الخدمة...' : 'Select Service...'}</option>
                                          {services.filter(s => !newPatient.departmentId || String(s.department_id) === String(newPatient.departmentId)).map(s =>
                                             <option key={s.id} value={s.id}>{isAr ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>
                                          )}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'فترة العمل (الموعد)' : 'Appointment Slot'}</label>
                                       <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                          {[
                                             { id: 'morning', ar: 'صباحي', en: 'Morning' },
                                             { id: 'evening', ar: 'مسائي', en: 'Evening' }
                                          ].map(shift => (
                                             <button
                                                key={shift.id}
                                                type="button"
                                                onClick={() => setNewPatient({ ...newPatient, shift: shift.id, doctorId: '' })}
                                                className={`flex-1 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest ${newPatient.shift === shift.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                             >
                                                {isAr ? shift.ar : shift.en}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 </div>

                                 {newPatient.selectedService && (
                                    <div className="p-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                                       <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
                                          <div>
                                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{isAr ? 'رسوم الخدمة' : 'Service Fee'}</p>
                                             <h4 className="font-black text-gray-800 text-lg">{isAr ? newPatient.selectedService.nameAr : (newPatient.selectedService.nameEn || newPatient.selectedService.name)}</h4>
                                          </div>
                                       </div>
                                       <div className="text-left" dir="ltr">
                                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">{isAr ? 'المجموع' : 'Total'}</p>
                                          <h2 className="text-3xl font-black text-emerald-600 tracking-tighter">{newPatient.selectedService.finalPrice || newPatient.selectedService.price} <span className="text-xs uppercase">SDG</span></h2>
                                       </div>
                                    </div>
                                 )}

                                 {/* Chronic Diseases (requested to be visible in booking section) */}
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{isAr ? 'الأمراض المزمنة' : 'Chronic Diseases'}</label>
                                    <input 
                                       className="w-full p-4 bg-rose-50 border border-rose-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-rose-100" 
                                       value={newPatient.chronicDiseases} 
                                       onChange={e => setNewPatient({ ...newPatient, chronicDiseases: e.target.value })} 
                                       placeholder={isAr ? 'مثال: السكري، الضغط...' : 'e.g. Diabetes, Hypertension...'}
                                    />
                                 </div>

                                 {/* Fourth Row: Visit Type */}
                                 <div className="space-y-4">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'نوع الزيارة' : 'Visit Type'}</label>
                                       <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                          {[
                                             { id: 'regular', ar: 'كشف', en: 'Consultation' },
                                             { id: 'follow-up', ar: 'متابعة', en: 'Follow-up' },
                                             { id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                                          ].map(type => (
                                             <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => {
                                                   const isEmerg = type.id === 'emergency';
                                                   const emergencyDept = depts.find(d => d.nameEn?.toLowerCase().includes('emergency') || d.nameAr?.includes('طوارئ'));
                                                   setNewPatient({
                                                      ...newPatient,
                                                      visitType: type.id,
                                                      departmentId: isEmerg && emergencyDept ? String(emergencyDept.id) : newPatient.departmentId
                                                   });
                                                }}
                                                className={`flex-1 py-3 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest ${newPatient.visitType === type.id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                             >
                                                {isAr ? type.ar : type.en}
                                             </button>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'medical' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'فصيلة الدم' : 'Blood Group'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" value={newPatient.bloodType} onChange={e => setNewPatient({ ...newPatient, bloodType: e.target.value })}>
                                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'حساسية الأدوية' : 'Drug Allergies'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newPatient.drugAllergy} onChange={e => setNewPatient({ ...newPatient, drugAllergy: e.target.value })} />
                                    </div>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الفحوصات السابقة والعلاجات' : 'Previous Diagnostics & Records'}</label>
                                    <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none h-32" value={newPatient.medicalHistory} onChange={e => setNewPatient({ ...newPatient, medicalHistory: e.target.value })} placeholder={isAr ? 'أدخل التاريخ المرضي بالتفصيل...' : 'Enter full medical history...'} />
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                           <div className="flex gap-2">
                              <button
                                 onClick={() => {
                                    const sections = ['personal', 'contact', 'booking', 'medical'];
                                    const idx = sections.indexOf(modalSection);
                                    if (idx > 0) setModalSection(sections[idx - 1] as any);
                                 }}
                                 disabled={modalSection === 'personal'}
                                 className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${modalSection === 'personal' ? 'text-gray-200 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                              >
                                 {isAr ? 'السابق' : 'Back'}
                              </button>
                              <button
                                 onClick={() => {
                                    const sections = ['personal', 'contact', 'booking', 'medical'];
                                    const idx = sections.indexOf(modalSection);
                                    if (idx < sections.length - 1) setModalSection(sections[idx + 1] as any);
                                 }}
                                 disabled={modalSection === 'medical'}
                                 className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${modalSection === 'medical' ? 'text-gray-200 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                              >
                                 {isAr ? 'التالي' : 'Next'}
                              </button>
                           </div>
                           <button
                              onClick={handleCreatePatient}
                              disabled={isGeneratingMRN}
                              className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                           >
                              {isGeneratingMRN ? <Activity className="animate-spin" size={16} /> : <Check size={16} />}
                              {isAr ? 'لحفظ النهائي' : 'Final Submit'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Success Card after Registration */}
            {showSuccessCard && (
               <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-emerald-600/90 backdrop-blur-md">
                  <div className="bg-white rounded-[60px] p-16 text-center shadow-2xl max-w-lg w-full transform animate-in zoom-in-50 duration-500">
                     <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[45px] flex items-center justify-center mx-auto mb-10"><CheckCircle2 size={64} /></div>
                     <h3 className="text-4xl font-black text-gray-800 mb-4">{isAr ? 'تم التسجيل بنجاح' : 'Registration Complete!'}</h3>
                     <p className="text-gray-400 font-bold mb-10">{isAr ? 'تم تعيين رقم ملف طبي جديد للمريض' : 'A new MRN has been assigned for the patient'}</p>
                     <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 mb-10">
                        <p className="text-[10px] font-black text-primary-500 uppercase tracking-[4px]">MRN NUMBER</p>
                        <h2 className="text-5xl font-black text-gray-800 mt-2">{lastGeneratedID}</h2>
                     </div>
                     <button onClick={() => setShowSuccessCard(false)} className="w-full py-6 bg-gray-900 text-white rounded-[30px] font-black text-lg hover:bg-black transition-all">Continue</button>
                  </div>
               </div>
            )}

            {/* Book Appointment Modal */}
            {isBookModalOpen && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                  <div className="relative w-full max-w-2xl bg-white rounded-[50px] shadow-2xl p-12 space-y-8 animate-in slide-in-from-bottom-10">
                     <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-gray-800">{isAr ? 'حجز موعد فحص' : 'Book a Consultation'}</h3>
                        <button onClick={() => setIsBookModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl"><X size={24} /></button>
                     </div>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'البحث بالرقم الطبي أو الاسم' : 'Patient MRN / Name'}</label>
                           <div className="relative">
                              <Search className="absolute right-4 top-4 text-gray-300" size={18} />
                              <input className="w-full p-4 pr-12 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-primary-50 text-sm" placeholder={isAr ? 'أدخل الرقم الطبي...' : 'Search Patient...'} onChange={e => {
                                 const fnd = patients.find(p => p.fileNumber === e.target.value || (p.name || '').includes(e.target.value));
                                 setFoundPatient(fnd || null);
                              }} />
                           </div>
                        </div>
                        {foundPatient && <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-800 font-bold text-xs border border-emerald-100"><CheckCircle2 size={18} /> <span>{isAr ? 'المريض:' : 'Patient:'} {isAr ? foundPatient.nameAr : foundPatient.name} ({foundPatient.fileNumber})</span></div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'القسم' : 'Department'}</label>
                              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingDeptId} onChange={e => {
                                 setSelectedBookingDeptId(e.target.value);
                                 setSelectedBookingDoctor('');
                              }}>
                                 <option value="">{isAr ? 'اختر القسم...' : 'Dept'}</option>
                                 {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'التخصص' : 'Specialty'}</label>
                              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingSpecialty} onChange={e => {
                                 setSelectedBookingSpecialty(e.target.value);
                                 setSelectedBookingDoctor('');
                              }}>
                                 <option value="">{isAr ? 'الكل' : 'All Specialties'}</option>
                                 {specialties.map(s => <option key={s.id} value={isAr ? s.nameAr : s.nameEn}>{isAr ? s.nameAr : s.nameEn}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الطبيب' : 'Physician'}</label>
                              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingDoctor} onChange={e => setSelectedBookingDoctor(e.target.value)}>
                                 <option value="">{isAr ? 'اختر الطبيب...' : 'Doctor'}</option>
                                 {doctors.filter(d => {
                                    const matchesDept = !selectedBookingDeptId || String(d.department_id) === String(selectedBookingDeptId);
                                    const matchesSpecialty = !selectedBookingSpecialty || d.specialtyAr === selectedBookingSpecialty || d.specialtyEn === selectedBookingSpecialty || d.specialty_ar === selectedBookingSpecialty || d.specialty_en === selectedBookingSpecialty;
                                    const matchesShift = !bookingShift || (d.day_shifts || []).some((s: any) => s.type === bookingShift);
                                    return matchesDept && matchesSpecialty && matchesShift;
                                 }).map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : (d.nameEn || d.name)}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الخدمة' : 'Service'}</label>
                              <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none appearance-none outline-none focus:ring-4 focus:ring-primary-50" value={selectedBookingService?.id || ''} onChange={e => {
                                 const srv = services.find(s => s.id === Number(e.target.value));
                                 setSelectedBookingService(srv);
                              }}>
                                 <option value="">{isAr ? 'اختر الخدمة...' : 'Service'}</option>
                                 {services.filter(s => !selectedBookingDeptId || String(s.department_id) === String(selectedBookingDeptId)).map(s => <option key={s.id} value={s.id}>{isAr ? s.nameAr : (s.nameEn || s.name)} ({s.finalPrice || s.price})</option>)}
                              </select>
                              {selectedBookingService && (
                                 <div className="mt-4 p-5 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Activity size={20} /></div>
                                       <div>
                                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 leading-none">{isAr ? 'تفاصيل الخدمة' : 'Service Detail'}</p>
                                          <h6 className="font-bold text-gray-800 text-sm">{isAr ? selectedBookingService.nameAr : selectedBookingService.nameEn}</h6>
                                       </div>
                                    </div>
                                    <div className="text-left" dir="ltr">
                                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none text-right">{isAr ? 'صافي المبلغ' : 'Net Rate'}</p>
                                       <h6 className="text-xl font-black text-emerald-600">{selectedBookingService.finalPrice || selectedBookingService.price} <span className="text-[9px]">SDG</span></h6>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'نوع الزيارة' : 'Visit Type'}</label>
                              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-100">
                                 {[
                                    { id: 'regular', ar: 'كشف', en: 'Consultation' },
                                    { id: 'follow-up', ar: 'متابعة', en: 'Follow-up' },
                                    { id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                                 ].map(t => (
                                    <button key={t.id} type="button" onClick={() => setBookingVisitType(t.id)} className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${bookingVisitType === t.id ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{isAr ? t.ar : t.en}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الفترة' : 'Availability'}</label>
                              <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-100">
                                 {[
                                    { id: 'morning', ar: 'صباحي', en: 'Morning' },
                                    { id: 'evening', ar: 'مسائي', en: 'Evening' }
                                 ].map(s => (
                                    <button key={s.id} type="button" onClick={() => setBookingShift(s.id)} className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${bookingShift === s.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{isAr ? s.ar : s.en}</button>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'تاريخ الحجز' : 'Date'}</label><input type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-primary-50 shadow-inner" value={bookingDate} onChange={e => setBookingDate(e.target.value)} /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الوقت' : 'Time'}</label><input type="time" className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-primary-50 shadow-inner" onChange={e => setBookingTime(e.target.value)} /></div>
                        </div>

                        <div className="pt-4"><button onClick={handleBookAppointment} className="w-full py-6 bg-primary-600 text-white rounded-[30px] font-black text-lg shadow-2xl shadow-primary-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"><Check size={20} /> {isAr ? 'تأكيد الحجز' : 'Finalize Booking'}</button></div>
                     </div>
                  </div>
               </div>
            )}

            {/* Patient Detail Side Panel/Modal */}
            {isPatientDetailOpen && selectedPatient && (
               <div className="fixed inset-0 z-[140] flex items-end sm:items-center justify-end p-0 sm:p-6 bg-gray-900/60 backdrop-blur-md">
                  <div className="absolute inset-0" onClick={() => setIsPatientDetailOpen(false)} />
                  <div className="relative w-full max-w-4xl bg-white h-[95vh] sm:rounded-[60px] shadow-2xl flex flex-col animate-in slide-in-from-right-20 duration-500 overflow-hidden">

                     {/* Profile Header */}
                     <div className="p-10 bg-gradient-to-r from-gray-900 via-indigo-950 to-primary-900 text-white relative">
                        <button onClick={() => setIsPatientDetailOpen(false)} className="absolute top-10 left-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all"><X size={24} /></button>
                        <div className="flex items-center gap-10">
                           <div className="w-32 h-32 bg-white/10 rounded-[45px] border-4 border-white/20 flex items-center justify-center text-5xl font-black">{(selectedPatient.name || 'P').charAt(0)}</div>
                           <div className="space-y-2">
                              <h2 className="text-4xl font-black">{isAr ? selectedPatient.nameAr : selectedPatient.name}</h2>
                              <div className="flex items-center gap-6">
                                 <span className="px-5 py-2 bg-primary-500 rounded-full text-xs font-black uppercase tracking-widest">{selectedPatient.fileNumber}</span>
                                 <span className="text-gray-400 font-bold flex items-center gap-2"><Phone size={16} /> {selectedPatient.phone}</span>
                                 <span className="text-gray-400 font-bold flex items-center gap-2"><MapPin size={16} /> {selectedPatient.address}</span>
                              </div>
                           </div>
                        </div>

                        {/* Visual Stats */}
                        <div className="grid grid-cols-4 gap-4 mt-10">
                           <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                              <p className="text-[10px] font-black text-primary-400 uppercase">Age</p>
                              <h5 className="text-2xl font-black mt-1">{selectedPatient.age} Years</h5>
                           </div>
                           <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                              <p className="text-[10px] font-black text-amber-500 uppercase">Gender</p>
                              <h5 className="text-2xl font-black mt-1">{isAr ? selectedPatient.genderAr : selectedPatient.genderEn}</h5>
                           </div>
                           <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                              <p className="text-[10px] font-black text-rose-500 uppercase">Blood</p>
                              <h5 className="text-2xl font-black mt-1">{selectedPatient.bloodType}</h5>
                           </div>
                           <div className="bg-white/5 p-6 rounded-[35px] border border-white/10">
                              <p className="text-[10px] font-black text-emerald-500 uppercase">Visits</p>
                              <h5 className="text-2xl font-black mt-1">12 Total</h5>
                           </div>
                        </div>
                     </div>

                     {/* Patient Details Content */}
                     <div className="flex-1 p-10 overflow-y-auto space-y-12 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-8">
                              <h4 className="text-xl font-black text-gray-800 flex items-center gap-3 border-r-4 border-primary-500 pr-3">{isAr ? 'التاريخ الطبي' : 'Medical Overview'}</h4>
                              <div className="space-y-4">
                                 <div className="p-6 bg-rose-50 rounded-[35px] border border-rose-100 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center"><AlertCircle size={24} /></div>
                                    <div><p className="text-[10px] font-black text-rose-500 uppercase">Chronic Diseases</p><p className="font-bold text-gray-800 mt-1">{selectedPatient.chronicDiseases || 'NONE RECORDED'}</p></div>
                                 </div>
                                 <div className="p-6 bg-amber-50 rounded-[35px] border border-amber-100 flex items-center gap-6">
                                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center"><Activity size={24} /></div>
                                    <div><p className="text-[10px] font-black text-amber-500 uppercase">Allergies</p><p className="font-bold text-gray-800 mt-1">{selectedPatient.drugAllergy || 'NONE'}</p></div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-xl font-black text-gray-800 flex items-center gap-3 border-r-4 border-indigo-500 pr-3">{isAr ? 'آخر الزيارات' : 'Recent Timeline'}</h4>
                              <div className="space-y-4">
                                 <div className="p-6 bg-gray-50 rounded-[35px] border border-gray-100">
                                    <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-black text-gray-400">24 MAR 2024</span><span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[8px] font-black uppercase">CONSULTATION</span></div>
                                    <h6 className="font-black text-gray-800">Chest Pain & Breathing difficulty</h6>
                                    <p className="text-[11px] text-gray-400 font-medium mt-2">Doctor: {isAr ? selectedPatient.doctorAr : selectedPatient.doctorEn || 'Assigned'}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-10 border-t border-gray-100 bg-gray-50 flex justify-between gap-4">
                        <button className="flex-1 py-5 bg-white border border-gray-200 rounded-[30px] font-black text-xs text-gray-400 flex items-center justify-center gap-3 uppercase tracking-widest"><History size={18} /> Full History</button>
                        <button className="flex-1 py-5 bg-primary-600 text-white rounded-[30px] font-black text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary-50 uppercase tracking-widest"><Plus size={18} /> New Entry</button>
                     </div>
                  </div>
               </div>
            )}

            {/* Register New Doctor Modal */}
            {isAddDoctorModalOpen && (
               <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
                  <div className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                     {/* Sidebar */}
                     <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 p-8 flex flex-col gap-2">
                        <div className="mb-8 hidden md:block">
                           <h3 className="text-lg font-black text-gray-800">{isAr ? 'تسجيل طبيب' : 'Register Doctor'}</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'بيانات مهنية' : 'Professional File'}</p>
                        </div>
                        {[
                           { id: 'personal', icon: <User size={18} />, labelAr: 'البيانات الشخصية', labelEn: 'Personal Data' },
                           { id: 'contact', icon: <Phone size={18} />, labelAr: 'معلومات الاتصال', labelEn: 'Contact Info' },
                           { id: 'professional', icon: <Stethoscope size={18} />, labelAr: 'بيانات الطبيب', labelEn: 'Doctor Info' },
                           { id: 'schedule', icon: <Calendar size={18} />, labelAr: 'المواعيد والحجز', labelEn: 'Schedule' }
                        ].map(s => (
                           <button
                              key={s.id}
                              onClick={() => setModalSection(s.id as any)}
                              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${modalSection === s.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                           >
                              <div className={modalSection === s.id ? 'text-white' : 'text-emerald-500'}>{s.icon}</div>
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{isAr ? s.labelAr : s.labelEn}</span>
                           </button>
                        ))}
                     </div>

                     {/* Content Area */}
                     <div className="flex-1 flex flex-col min-h-0 bg-white">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                           <h4 className="text-xl font-black text-gray-800 flex items-center gap-3">
                              {modalSection === 'personal' && <User className="text-emerald-500" />}
                              {modalSection === 'contact' && <Phone className="text-amber-500" />}
                              {modalSection === 'professional' && <Stethoscope className="text-primary-500" />}
                              {modalSection === 'schedule' && <Calendar className="text-indigo-500" />}
                              {isAr ? (
                                 modalSection === 'personal' ? 'البيانات الشخصية' :
                                    modalSection === 'contact' ? 'معلومات الاتصال' :
                                       modalSection === 'professional' ? 'بيانات الطبيب' : 'المواعيد والحجز'
                              ) : (
                                 modalSection === 'personal' ? 'Personal Data' :
                                    modalSection === 'contact' ? 'Contact Info' :
                                       modalSection === 'professional' ? 'Doctor Info' : 'Schedule info'
                              )}
                           </h4>
                           <button onClick={() => setIsAddDoctorModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                           {modalSection === 'personal' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الاسم (ع)' : 'Name (Ar)'}</label>
                                       <input dir="rtl" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" value={newDoctor.nameAr} onChange={e => setNewDoctor({ ...newDoctor, nameAr: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الاسم (En)' : 'Name (En)'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-emerald-50" value={newDoctor.nameEn} onChange={e => setNewDoctor({ ...newDoctor, nameEn: e.target.value })} />
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'contact' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" placeholder="05x XXX XXXX" value={newDoctor.phone} onChange={e => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                       <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" placeholder="doctor@hospital.com" value={newDoctor.email} onChange={e => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'professional' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'القسم' : 'Department'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newDoctor.departmentId} onChange={e => setNewDoctor({ ...newDoctor, departmentId: e.target.value })}>
                                          <option value="">{isAr ? 'اختر القسم...' : 'Select Dept...'}</option>
                                          {depts.map(d => <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>)}
                                       </select>
                                    </div>
                                    <div className="space-y-2">
                                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الدرجة العلمية' : 'Grade'}</label>
                                       <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newDoctor.grade} onChange={e => setNewDoctor({ ...newDoctor, grade: e.target.value })}>
                                          <option value="specialist">Specialist</option>
                                          <option value="consultant">Consultant</option>
                                          <option value="professor">Professor</option>
                                       </select>
                                    </div>
                                 </div>
                              </div>
                           )}

                           {modalSection === 'schedule' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'جدول المواعيد' : 'Work Schedule'}</label>
                                    <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" placeholder="Daily, Sun, Tue, etc." value={newDoctor.day_shifts?.join(', ') || ''} onChange={e => setNewDoctor({ ...newDoctor, day_shifts: e.target.value.split(',').map(s => s.trim()) })} />
                                 </div>
                              </div>
                           )}
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                           <div className="flex gap-2">
                              <button onClick={() => {
                                 const sections = ['personal', 'contact', 'professional', 'schedule'];
                                 const idx = sections.indexOf(modalSection);
                                 if (idx > 0) setModalSection(sections[idx - 1] as any);
                              }} disabled={modalSection === 'personal'} className="px-6 py-3 rounded-xl font-black text-[10px] uppercase text-gray-400 bg-white border border-gray-200">Back</button>
                           </div>
                           <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-50 hover:scale-105 active:scale-95 transition-all" onClick={handleCreateDoctor}>
                              {isAr ? 'حفظ البيانات' : 'Register Doctor'}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

         </div>
         );
};

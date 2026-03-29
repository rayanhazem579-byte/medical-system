import React, { useState, useEffect } from 'react';
import { 
  Activity, MapPin, Clock, Phone, Shield, 
  Edit3, Plus, Ambulance, Users,
  CheckCircle2, AlertCircle, Search,
  TrendingUp, Navigation, MoreVertical, X,
  AlertTriangle, Wrench, Building2, ClipboardList,
  Truck, LifeBuoy, Zap, Droplets,
  Heart, ChevronRight, ChevronLeft,
  LayoutDashboard, FlaskConical
} from 'lucide-react';

/* ───────── Types ───────── */
interface AmbulanceVehicle {
  id: string;
  regNumber: string;
  type: 'emergency' | 'basic' | 'intensive' | 'transport';
  status: 'available' | 'active' | 'maintenance' | 'offline';
  model: string;
  year: number;
  equipment: string[];
  fuel: number;
  oxygenLevel: number;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedCrew?: string[]; // IDs
}

interface CrewMember {
  id: string;
  nameAr: string;
  nameEn: string;
  role: 'driver' | 'paramedic' | 'nurse' | 'doctor';
  status: 'active' | 'on-break' | 'off-duty';
  phone: string;
  shift: string;
  assignedVehicle?: string; // ID
}

interface DispatchRecord {
  id: string;
  patientNameAr: string;
  patientNameEn: string;
  caseTypeAr: string;
  caseTypeEn: string;
  locationAr: string;
  locationEn: string;
  status: 'dispatched' | 'en-route' | 'on-site' | 'transporting' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  vehicleId: string;
  dispatchTime: string;
  arrivalTime?: string;
  destinationHospital?: string;
  procedures: string[];
}

interface Hospital {
  id: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  distance: string;
  departments: string[];
}

interface AmbulancePageProps {
  isAr: boolean;
}

export const AmbulancePage: React.FC<AmbulancePageProps> = ({ isAr }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'crew' | 'dispatches' | 'hospitals' | 'maintenance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fleet State
  const [vehicles, setVehicles] = useState<AmbulanceVehicle[]>([
    { id: 'AMB-001', regNumber: 'EK 9982', type: 'intensive', status: 'available', model: 'Mercedes Sprinter', year: 2023, equipment: ['Oxygen', 'Defibrillator', 'Ventilator'], fuel: 85, oxygenLevel: 95, lastMaintenance: '2024-03-01', nextMaintenance: '2024-06-01' },
    { id: 'AMB-002', regNumber: 'TX 1234', type: 'emergency', status: 'active', model: 'Ford Transit', year: 2022, equipment: ['Oxygen', 'First Aid Kit'], fuel: 40, oxygenLevel: 80, lastMaintenance: '2024-02-15', nextMaintenance: '2024-05-15' },
    { id: 'AMB-003', regNumber: 'KH 4455', type: 'basic', status: 'maintenance', model: 'GMC Savana', year: 2021, equipment: ['Stretcher', 'Oxygen'], fuel: 10, oxygenLevel: 20, lastMaintenance: '2024-01-10', nextMaintenance: '2024-04-10' },
  ]);

  // Crew State
  const [crew, setCrew] = useState<CrewMember[]>([
    { id: 'CRW-1', nameAr: 'أحمد علي', nameEn: 'Ahmed Ali', role: 'driver', status: 'active', phone: '0123456789', shift: 'Morning', assignedVehicle: 'AMB-001' },
    { id: 'CRW-2', nameAr: 'ياسر محمد', nameEn: 'Yaser Mohamed', role: 'paramedic', status: 'active', phone: '0122223333', shift: 'Morning', assignedVehicle: 'AMB-001' },
    { id: 'CRW-3', nameAr: 'خالد يوسف', nameEn: 'Khalid Youssef', role: 'nurse', status: 'on-break', phone: '0111112222', shift: 'Night', assignedVehicle: 'AMB-002' },
  ]);

  // Dispatches State
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([
    { id: 'DSP-9921', patientNameAr: 'محمد حسن', patientNameEn: 'Mohamed Hassan', caseTypeAr: 'إصابة عمل', caseTypeEn: 'Work Injury', locationAr: 'المنطقة الصناعية', locationEn: 'Industrial Zone', status: 'en-route', priority: 'high', vehicleId: 'AMB-002', dispatchTime: '10:15 AM', procedures: ['First Aid', 'Oxygen'] },
    { id: 'DSP-9922', patientNameAr: 'سارة أحمد', patientNameEn: 'Sara Ahmed', caseTypeAr: 'حالة ولادة', caseTypeEn: 'Maternity', locationAr: 'حي الصفاء', locationEn: 'Al Safa District', status: 'completed', priority: 'medium', vehicleId: 'AMB-001', dispatchTime: '08:30 AM', arrivalTime: '08:45 AM', destinationHospital: 'Ryan General Hospital', procedures: ['Monitoring'] },
  ]);

  // Hospitals State
  const [hospitals, setHospitals] = useState<Hospital[]>([
    { id: 'HSP-1', nameAr: 'مستشفى ريان العام', nameEn: 'Ryan General Hospital', addressAr: 'شارع النيل، الخرطوم', addressEn: 'Nile St, Khartoum', phone: '0183123456', distance: '5km', departments: ['Emergency', 'Surgery', 'Maternity'] },
    { id: 'HSP-2', nameAr: 'مركز القلب التخصصي', nameEn: 'Specialized Heart Center', addressAr: 'حي الرياض، الخرطوم', addressEn: 'Riyadh, Khartoum', phone: '0183778899', distance: '12km', departments: ['Cardiology', 'ICU'] },
  ]);

  // Modals
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<any>({
    regNumber: '', type: 'emergency', model: '', year: new Date().getFullYear(),
    equipment: [], fuel: 100, oxygenLevel: 100,
    assignedCrew: []
  });
  
  const [addStep, setAddStep] = useState(1);

  // Stats Helper
  const getStats = () => [
    { labelAr: 'إجمالي الأسطول', labelEn: 'Total Fleet', value: vehicles.length, icon: <Ambulance size={20} />, color: 'bg-indigo-500', lightColor: 'bg-indigo-50' },
    { labelAr: 'متاح الآن', labelEn: 'Available', value: vehicles.filter(v => v.status === 'available').length, icon: <Activity size={20} />, color: 'bg-emerald-500', lightColor: 'bg-emerald-50' },
    { labelAr: 'بلاغات نشطة', labelEn: 'Active Dispatches', value: dispatches.filter(d => d.status !== 'completed' && d.status !== 'cancelled').length, icon: <LifeBuoy size={20} />, color: 'bg-rose-500', lightColor: 'bg-rose-50' },
    { labelAr: 'الطاقة البشرية', labelEn: 'Crew Active', value: crew.filter(c => c.status === 'active').length, icon: <Users size={20} />, color: 'bg-amber-500', lightColor: 'bg-amber-50' },
  ];

  /* ───────── Render Helpers ───────── */
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 overflow-hidden">
      {/* Header Grid */}
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3.5rem] shadow-sm border border-white/50 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-40">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-rose-200 transform -rotate-12 transition-all hover:rotate-0 duration-500 hover:scale-110">
               <Ambulance size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                 {isAr ? 'مركز عمليات الإسعاف' : 'Emergency Operations Center'}
               </h1>
               <div className="flex items-center gap-2 mt-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   {isAr ? 'نظام الاستجابة المتكاملة' : 'Integrated Response System v4.0'}
                 </p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder={isAr ? 'البحث عن مركبة أو بلاغ...' : 'Track vehicle or incident...'} 
                 className="pr-12 pl-6 py-4 bg-slate-50 border-2 border-transparent rounded-3xl text-xs font-black outline-none focus:bg-white focus:border-rose-100 transition-all w-72 shadow-inner"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs hover:bg-black transition-all shadow-2xl active:scale-95 transform hover:scale-[1.02]">
               <Zap size={18} className="text-amber-400" />
               <span>{isAr ? 'بلاغ طارئ' : 'Post Emergency'}</span>
            </button>
         </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-[2rem] w-fit shadow-inner border border-slate-200/60 mx-auto">
        {[
          { id: 'overview', icon: <LayoutDashboard size={14} />, labelAr: 'نظرة عامة', labelEn: 'Overview' },
          { id: 'fleet', icon: <Truck size={14} />, labelAr: 'الأسطول', labelEn: 'Fleet' },
          { id: 'crew', icon: <Users size={14} />, labelAr: 'الطاقم', labelEn: 'Crew' },
          { id: 'dispatches', icon: <Activity size={14} />, labelAr: 'البلاغات', labelEn: 'Dispatches' },
          { id: 'hospitals', icon: <Building2 size={14} />, labelAr: 'المستشفيات', labelEn: 'Hospitals' },
          { id: 'maintenance', icon: <Wrench size={14} />, labelAr: 'الصيانة', labelEn: 'Maintenance' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? 'bg-white text-rose-600 shadow-md transform scale-105 border border-rose-50' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
        {getStats().map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-32 h-32 ${stat.lightColor} rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700 opacity-40`}></div>
             <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-14 h-14 ${stat.lightColor} ${stat.color.replace('bg-', 'text-')} rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                   {stat.icon}
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:text-rose-500 transition-colors">
                   <TrendingUp size={18} />
                </div>
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none relative z-10">{isAr ? stat.labelAr : stat.labelEn}</p>
             <h4 className="text-4xl font-black text-slate-800 mt-3 tracking-tight relative z-10">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="px-2">
        {activeTab === 'overview' && <OverviewTab isAr={isAr} dispatches={dispatches} vehicles={vehicles} />}
        {activeTab === 'fleet' && <FleetTab isAr={isAr} vehicles={vehicles} setIsAddVehicleModalOpen={setIsAddVehicleModalOpen} />}
        {activeTab === 'crew' && <CrewTab isAr={isAr} crew={crew} />}
        {activeTab === 'dispatches' && <DispatchesTab isAr={isAr} dispatches={dispatches} />}
        {activeTab === 'hospitals' && <HospitalsTab isAr={isAr} hospitals={hospitals} />}
        {activeTab === 'maintenance' && <MaintenanceTab isAr={isAr} vehicles={vehicles} />}
      </div>

      {/* Add Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <AddVehicleModal 
          isAr={isAr} 
          onClose={() => setIsAddVehicleModalOpen(false)} 
          onSave={(v: any) => {
            setVehicles([...vehicles, { ...v, id: `AMB-00${vehicles.length + 1}` }]);
            setIsAddVehicleModalOpen(false);
          }}
          crew={crew}
        />
      )}
    </div>
  );
};

const OverviewTab = ({ isAr, dispatches, vehicles }: any) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
     <div className="xl:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-rose-600 rounded-full"></div>
              <div>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'البلاغات النشطة' : 'Live Incident Board'}</h2>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'متابعة حية للاستجابات الميدانية' : 'Real-time response tracking'}</p>
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {dispatches.filter((d:any) => d.status !== 'completed').map((d: any) => (
             <div key={d.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group relative">
                <div className="absolute top-8 right-8 flex gap-2">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                      d.priority === 'critical' ? 'bg-rose-600 text-white animate-pulse' :
                      d.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                      'bg-emerald-100 text-emerald-600'
                   }`}>
                      {isAr ? d.priority : d.priority}
                   </span>
                </div>
                
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-500">
                      <AlertCircle size={32} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800">{d.id}</h4>
                      <p className="text-xs font-bold text-slate-400">{d.dispatchTime}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                      <MapPin size={18} className="text-rose-500 mt-1" />
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'موقع البلاغ' : 'Location'}</p>
                         <p className="text-xs font-black text-slate-700 leading-relaxed">{isAr ? d.locationAr : d.locationEn}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <Ambulance size={16} className="text-slate-300" />
                         <span className="text-xs font-black text-slate-500">{d.vehicleId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                         <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{isAr ? 'في الطريق' : d.status}</span>
                      </div>
                   </div>
                </div>

                <button className="w-full mt-10 bg-slate-900 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 transform active:scale-95 transition-all text-center">
                   {isAr ? 'لوحة تحكم الحالة' : 'Dispatch Control'}
                </button>
             </div>
           ))}
        </div>
     </div>

     <div className="space-y-10">
        <div className="bg-slate-900 rounded-[3.5rem] shadow-2xl p-10 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 rounded-full -mr-32 -mt-32 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <h3 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
              <Navigation size={24} className="text-rose-500 animate-pulse" />
              {isAr ? 'الرادار الميداني' : 'Field Radar'}
           </h3>
           
           <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                       <Ambulance size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-white">AMB-001</p>
                       <p className="text-[10px] font-bold text-white/50">{isAr ? 'على أهبة الاستعداد' : 'Ready'}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                       <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-400">95% O2</span>
                 </div>
              </div>
           </div>

           <button className="w-full mt-12 bg-rose-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/50 hover:bg-rose-700 transition-all transform active:scale-95">
              {isAr ? 'فتح الخريطة الكاملة' : 'Expand Radar View'}
           </button>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <Heart size={20} className="text-rose-500" />
              {isAr ? 'بروتوكولات الطوارئ' : 'Emergency Protocols'}
           </h3>
           <div className="space-y-4">
              {[
                { labelAr: 'السكتة القلبية', labelEn: 'Cardiac arrest (CPR)', id: 'CPR' },
                { labelAr: 'إصابات الحوادث', labelEn: 'Trauma protocol', id: 'TRM' },
                { labelAr: 'حالات التسمم', labelEn: 'Tox/OD response', id: 'TOX' },
              ].map(p => (
                <div key={p.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-rose-50 hover:border-rose-100 transition-all group cursor-pointer">
                   <span className="text-xs font-black text-slate-600 group-hover:text-rose-600">{isAr ? p.labelAr : p.labelEn}</span>
                   <ChevronRight size={16} className="text-slate-300 group-hover:text-rose-400" />
                </div>
              ))}
           </div>
        </div>
     </div>
  </div>
);

const FleetTab = ({ isAr, vehicles, setIsAddVehicleModalOpen }: any) => (
  <div className="space-y-8">
     <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-10 bg-rose-600 rounded-full"></div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'إدارة أسطول المركبات' : 'Fleet Management Hub'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'متابعة حالة وتجهيزات جميع مركبات الإسعاف' : 'Vehicle conditions and medical inventory'}</p>
           </div>
        </div>
        <button onClick={() => setIsAddVehicleModalOpen(true)} className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 transform active:scale-95">
           <Plus size={20} />
           <span>{isAr ? 'إضافة مركبة إسعاف' : 'Register New Vehicle'}</span>
        </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {vehicles.map((v: any) => (
          <div key={v.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col h-full">
             <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                   <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                      v.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                      v.status === 'active' ? 'bg-rose-50 text-rose-600' :
                      v.status === 'maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                   }`}>
                      <Truck size={36} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800">{v.id}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{v.model} ({v.year})</p>
                   </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 cursor-pointer transition-colors"><MoreVertical size={20}/></div>
             </div>

             <div className="flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         <Zap size={10} className="text-amber-500" /> {isAr ? 'الوقود' : 'Fuel'}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${v.fuel > 70 ? 'bg-emerald-500' : v.fuel > 30 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${v.fuel}%` }}></div>
                         </div>
                         <span className="text-xs font-black text-slate-800">{v.fuel}%</span>
                      </div>
                   </div>
                   <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         <Droplets size={10} className="text-blue-500" /> {isAr ? 'الأكسجين' : 'O2 Levels'}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${v.oxygenLevel > 70 ? 'bg-blue-500' : 'bg-rose-500'}`} style={{ width: `${v.oxygenLevel}%` }}></div>
                         </div>
                         <span className="text-xs font-black text-slate-800">{v.oxygenLevel}%</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">{isAr ? 'التجهيزات الطبية' : 'Medical Equipment'}</p>
                   <div className="flex flex-wrap gap-2">
                      {v.equipment.map((item: string, i: number) => (
                        <span key={i} className="px-5 py-2 bg-white text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-tight border border-slate-100 shadow-sm flex items-center gap-2 group-hover:border-rose-100 group-hover:bg-rose-50/30 transition-all">
                           <CheckCircle2 size={10} className="text-emerald-500" />
                           {item}
                        </span>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? 'الصيانة القادمة' : 'Service Due'}</p>
                   <p className="text-xs font-black text-slate-800 font-mono italic tracking-tight">{v.nextMaintenance}</p>
                </div>
                <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                   v.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                   v.status === 'active' ? 'bg-rose-500 text-white border-rose-600' :
                   'bg-amber-100 text-amber-600 border-amber-200'
                }`}>
                   {v.status}
                </div>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const CrewTab = ({ isAr, crew }: any) => (
  <div className="space-y-10">
     <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'إدارة الطواقم والمناوبات' : 'Personnel & Roster Management'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'توزيع المسعفين والسائقين على المركبات' : 'Paramedic and driver assignments'}</p>
           </div>
        </div>
        <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-xs hover:bg-black transition-all shadow-xl active:scale-95">
           <Plus size={18} />
           <span>{isAr ? 'إضافة مسعف جديد' : 'Onboard New Crew'}</span>
        </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {crew.map((member: any) => (
          <div key={member.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-indigo-600 font-black text-3xl mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                   {member.nameAr.charAt(0)}
                </div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight">{isAr ? member.nameAr : member.nameEn}</h4>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">{isAr ? (member.role === 'driver' ? 'سائق إسعاف' : 'مسعف طوارئ') : member.role}</p>
             </div>

             <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} className="text-indigo-400" /> {isAr ? 'المناوبة' : 'Shift'}
                   </div>
                   <span className="text-xs font-black text-slate-700">{member.shift}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Truck size={12} className="text-slate-400" /> {isAr ? 'المركبة' : 'Vehicle'}
                   </div>
                   <span className="text-xs font-black text-rose-600 italic tracking-tighter">{member.assignedVehicle || '—'}</span>
                </div>
             </div>

             <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
                <button className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100"><Phone size={16}/></button>
                <button className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-500 transition-all border border-transparent hover:border-indigo-100"><Edit3 size={16}/></button>
                <button className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all border border-transparent"><Shield size={16}/></button>
             </div>

             <div className={`absolute top-6 left-6 w-3 h-3 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
          </div>
        ))}
     </div>
  </div>
);

const DispatchesTab = ({ isAr, dispatches }: any) => (
  <div className="space-y-8">
     <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-10 bg-rose-600 rounded-full"></div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'سجل البلاغات والتدخلات' : 'Emergency Dispatch Logs'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'أرشيف كامل لجميع حالات الإسعاف المستلمة' : 'Complete history of field response'}</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white text-slate-600 px-6 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              {isAr ? 'تصدير التقارير' : 'Export Logs'}
           </button>
        </div>
     </div>

     <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
           <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 <th className="px-10 py-8">{isAr ? 'رقم البلاغ' : 'Incident ID'}</th>
                 <th className="px-10 py-8">{isAr ? 'الحالة والمريض' : 'Patient & Case'}</th>
                 <th className="px-10 py-8">{isAr ? 'الموقع' : 'Location'}</th>
                 <th className="px-10 py-8">{isAr ? 'المركبة' : 'Vehicle'}</th>
                 <th className="px-10 py-8">{isAr ? 'الحالة' : 'Status'}</th>
                 <th className="px-10 py-8 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {dispatches.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-all group">
                   <td className="px-10 py-8">
                      <span className="text-xs font-black text-slate-800 font-mono italic">{d.id}</span>
                   </td>
                   <td className="px-10 py-8">
                      <div>
                         <p className="text-sm font-black text-slate-800">{isAr ? d.patientNameAr : d.patientNameEn}</p>
                         <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">{isAr ? d.caseTypeAr : d.caseTypeEn}</p>
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                         <MapPin size={12} className="text-slate-300" />
                         <span className="text-xs font-bold text-slate-500">{isAr ? d.locationAr : d.locationEn}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black tracking-tighter">{d.vehicleId}</span>
                   </td>
                   <td className="px-10 py-8">
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit border shadow-sm ${
                         d.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${d.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                         {isAr ? (d.status === 'completed' ? 'مكتمل' : 'نشط') : d.status}
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-all active:scale-95 shadow-sm"><ClipboardList size={16}/></button>
                         <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center transition-all active:scale-95 shadow-sm"><Navigation size={16}/></button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

const HospitalsTab = ({ isAr, hospitals }: any) => (
  <div className="space-y-8">
     <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-10 bg-emerald-600 rounded-full"></div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'شبكة المستشفيات والمراكز' : 'Hospital & Medical Network'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'إدارة وجهات نقل الحالات الطارئة' : 'Emergency destination management'}</p>
           </div>
        </div>
        <button className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-[2rem] font-black text-xs hover:bg-emerald-700 transition-all shadow-xl active:scale-95">
           <Plus size={18} />
           <span>{isAr ? 'إضافة مستشفى جديد' : 'Link New Hospital'}</span>
        </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hospitals.map((h: any) => (
          <div key={h.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-40"></div>
             
             <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                   <Building2 size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-slate-800 tracking-tight">{isAr ? h.nameAr : h.nameEn}</h4>
                   <div className="flex items-center gap-2 mt-1">
                      <MapPin size={12} className="text-slate-300" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? h.addressAr : h.addressEn} ({h.distance})</p>
                   </div>
                </div>
             </div>

             <div className="space-y-6 relative z-10">
                <div className="flex flex-wrap gap-2">
                   {h.departments.map((dept: string, i: number) => (
                      <span key={i} className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-tight border border-slate-100 transition-all group-hover:bg-white group-hover:border-emerald-100 group-hover:text-emerald-600">{dept}</span>
                   ))}
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <Phone size={14} className="text-emerald-500" />
                   <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">{h.phone}</span>
                </div>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100">
                   {isAr ? 'اتجاهات' : 'Get Directions'}
                </button>
             </div>
          </div>
        ))}
     </div>
  </div>
);

const MaintenanceTab = ({ isAr, vehicles }: any) => (
  <div className="space-y-10">
     <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
           <div className="w-2 h-10 bg-amber-500 rounded-full"></div>
           <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isAr ? 'سجل الصيانة والمعدات' : 'Service & Equipment Logs'}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isAr ? 'جدولة ومتابعة الحالة الفنية للمركبات والأجهزة' : 'Technical audits and periodic checks'}</p>
           </div>
        </div>
        <button className="flex items-center gap-3 bg-amber-500 text-white px-8 py-4 rounded-[2rem] font-black text-xs hover:bg-amber-600 transition-all shadow-xl active:scale-95">
           <Wrench size={18} />
           <span>{isAr ? 'سجل فحص جديد' : 'Log Technical Audit'}</span>
        </button>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <Truck size={20} className="text-amber-500" />
              {isAr ? 'حالة الأسطول الميكانيكية' : 'Vehicle Mechanical Health'}
           </h3>
           <div className="space-y-4">
              {vehicles.map((v: any) => (
                 <div key={v.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-amber-100 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-amber-600 transition-colors">
                          <Ambulance size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800">{v.id}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'آخر صيانة: ' : 'Last: '} {v.lastMaintenance}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{isAr ? 'الموعد القادم' : 'Due In'}</p>
                       <p className="text-xs font-black text-slate-500 font-mono tracking-tighter">{v.nextMaintenance}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <FlaskConical size={20} className="text-indigo-500" />
              {isAr ? 'فحص المعدات الطبية' : 'Medical Equipment Calibration'}
           </h3>
           <div className="space-y-4">
              {[
                 { vehicle: 'AMB-001', equip: 'Defibrillator', status: 'OK', date: '2024-03-20' },
                 { vehicle: 'AMB-001', equip: 'Ventilator', status: 'Calibration Req', date: '2024-03-15' },
                 { vehicle: 'AMB-002', equip: 'Portable Oxygen', status: 'Refilled', date: '2024-03-22' },
              ].map((eq, i) => (
                 <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-indigo-100 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-indigo-600 transition-colors">
                          <Zap size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-800">{eq.equip}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">({eq.vehicle}) • {eq.date}</p>
                       </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       eq.status.includes('Req') ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                       {eq.status}
                    </span>
                 </div>
              ))}
           </div>
        </div>
     </div>
  </div>
);

const AddVehicleModal = ({ isAr, onClose, onSave, crew }: any) => {
   const [step, setStep] = useState(1);
   const [formData, setFormData] = useState({
      regNumber: '',
      type: 'emergency',
      model: '',
      year: 2024,
      equipment: [] as string[],
      assignedCrew: [] as string[],
      nextMaintenance: ''
   });

   const standardEquipment = ['Oxygen', 'First Aid Kit', 'Stretcher', 'Defibrillator', 'Ventilator', 'Suction Unit', 'Spinal Board'];

   const handleToggleEquip = (item: string) => {
      setFormData(prev => ({
         ...prev,
         equipment: prev.equipment.includes(item) 
            ? prev.equipment.filter(i => i !== item) 
            : [...prev.equipment, item]
      }));
   };

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
         <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
         
         <div className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-500 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-rose-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-rose-100">
                     <Plus size={28} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        {isAr ? 'تسجيل مركبة إسعاف جديدة' : 'Register New Ambulance'}
                     </h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {isAr ? `الخطوة ${step} من 4` : `Step ${step} of 4`} — {
                           step === 1 ? (isAr ? 'البيانات الأساسية' : 'Primary Info') :
                           step === 2 ? (isAr ? 'التجهيزات الطبية' : 'Medical Assets') :
                           step === 3 ? (isAr ? 'الطاقم المخصص' : 'Crew Assignment') :
                           (isAr ? 'جدولة الصيانة' : 'Service Schedule')
                        }
                     </p>
                  </div>
               </div>
               <button onClick={onClose} className="w-12 h-12 bg-white text-slate-300 rounded-2xl flex items-center justify-center hover:text-rose-500 hover:rotate-90 transition-all border border-slate-100 shadow-sm">
                  <X size={20} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               {step === 1 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{isAr ? 'رقم اللوحة' : 'Plate Number'}</label>
                           <input 
                              type="text" 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-100 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black outline-none transition-all"
                              placeholder="e.g. EK 9982"
                              value={formData.regNumber}
                              onChange={e => setFormData({...formData, regNumber: e.target.value})}
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{isAr ? 'النوع' : 'Vehicle Class'}</label>
                           <select 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-100 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black outline-none transition-all appearance-none cursor-pointer"
                              value={formData.type}
                              onChange={e => setFormData({...formData, type: e.target.value as any})}
                           >
                              <option value="emergency">{isAr ? 'حالات طارئة' : 'Emergency Response'}</option>
                              <option value="intensive">{isAr ? 'عناية مكثفة' : 'ICU Unit'}</option>
                              <option value="basic">{isAr ? 'خدمة أساسية' : 'Basic Support'}</option>
                              <option value="transport">{isAr ? 'نقل مرضى' : 'Patient Transport'}</option>
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{isAr ? 'الموديل' : 'Manufacturer/Model'}</label>
                           <input 
                              type="text" 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-100 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black outline-none transition-all"
                              placeholder="e.g. Mercedes Sprinter"
                              value={formData.model}
                              onChange={e => setFormData({...formData, model: e.target.value})}
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{isAr ? 'سنة الصنع' : 'Manufacturing Year'}</label>
                           <input 
                              type="number" 
                              className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-100 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black outline-none transition-all"
                              value={formData.year}
                              onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                           />
                        </div>
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                     <p className="text-xs font-black text-slate-500 leading-relaxed mb-6">
                        {isAr ? 'يرجى تحديد كافة الأجهزة والمعدات المتوفرة على متن المركبة حالياً:' : 'Please select all medical assets currently assigned and verified on this vehicle:'}
                     </p>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {standardEquipment.map(item => (
                           <button 
                              key={item}
                              onClick={() => handleToggleEquip(item)}
                              className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                                 formData.equipment.includes(item) 
                                 ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                 : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                              }`}
                           >
                              <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                 formData.equipment.includes(item) ? 'bg-rose-600 text-white' : 'bg-slate-50 text-transparent'
                              }`}>
                                 <CheckCircle2 size={14} />
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                     <div className="space-y-4">
                        {crew.filter((c:any) => c.status === 'active').map((member: any) => (
                           <div 
                              key={member.id}
                              onClick={() => {
                                 const exists = formData.assignedCrew.includes(member.id);
                                 setFormData({...formData, assignedCrew: exists ? formData.assignedCrew.filter(id => id !== member.id) : [...formData.assignedCrew, member.id]});
                              }}
                              className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                                 formData.assignedCrew.includes(member.id) 
                                 ? 'bg-indigo-50 border-indigo-200' 
                                 : 'bg-white border-slate-100'
                              }`}
                           >
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                                    {member.nameAr.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800">{isAr ? member.nameAr : member.nameEn}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? member.role : member.role} • {member.shift}</p>
                                 </div>
                              </div>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                 formData.assignedCrew.includes(member.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-transparent'
                              }`}>
                                 <Users size={18} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {step === 4 && (
                  <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                     <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-start gap-6">
                        <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100">
                           <AlertTriangle size={20} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-amber-800">{isAr ? 'تنبيه جدولة الصيانة' : 'Initial Maintenance Alert'}</h4>
                           <p className="text-xs font-bold text-amber-600 mt-2 leading-relaxed">
                              {isAr ? 'سيتم وضع المركبة في نظام التنبيه المبكر. يرجى تحديد تاريخ أول فحص فني شامل للمركبة لضمان السلامة الميدانية.' : 'The vehicle will be enrolled in the early-warning system. Please define the first comprehensive technical audit date.'}
                           </p>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{isAr ? 'تاريخ أول فحص فني' : 'First Service Date'}</label>
                        <input 
                           type="date" 
                           className="w-full bg-slate-50 border-2 border-transparent focus:border-amber-100 focus:bg-white rounded-3xl px-8 py-5 text-sm font-black outline-none transition-all"
                           value={formData.nextMaintenance}
                           onChange={e => setFormData({...formData, nextMaintenance: e.target.value})}
                        />
                     </div>
                  </div>
               )}
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-50 bg-slate-50/10 flex items-center justify-between">
               <button 
                  onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-slate-600 rounded-[2rem] font-black text-xs border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
               >
                  <ChevronLeft size={18} className={isAr ? 'rotate-180' : ''} />
                  <span>{step === 1 ? (isAr ? 'إلغاء' : 'Cancel') : (isAr ? 'رجوع' : 'Back')}</span>
               </button>

               <button 
                  onClick={() => {
                     if (step < 4) setStep(step + 1);
                     else onSave(formData);
                  }}
                  className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-200"
               >
                  <span>{step === 4 ? (isAr ? 'حفظ البيانات وتسجيل المركبة' : 'Complete Registration') : (isAr ? 'الخطوة التالية' : 'Next Phase')}</span>
                  <ChevronRight size={18} className={isAr ? 'rotate-180' : ''} />
               </button>
            </div>
         </div>
      </div>
   );
};


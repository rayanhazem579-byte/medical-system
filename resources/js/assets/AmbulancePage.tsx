import React, { useState } from 'react';
import { 
  Activity, MapPin, Clock, Phone, Shield, 
  Trash2, Edit3, Plus, Ambulance, Users,
  CheckCircle2, AlertCircle, Search, Filter,
  TrendingUp, Navigation, MoreVertical, X,
  AlertTriangle
} from 'lucide-react';

interface AmbulancePageProps {
  isAr: boolean;
}

export const AmbulancePage: React.FC<AmbulancePageProps> = ({ isAr }) => {
  const [activeView, setActiveView] = useState<'fleet' | 'dispatches'>('fleet');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { labelAr: 'إجمالي المركبات', labelEn: 'Total Fleet', value: '12', icon: <Ambulance size={20} />, color: 'bg-blue-500', lightColor: 'bg-blue-50' },
    { labelAr: 'في الخدمة الآن', labelEn: 'Active Now', value: '8', icon: <Activity size={20} />, color: 'bg-emerald-500', lightColor: 'bg-emerald-50' },
    { labelAr: 'مكالمات الطوارئ', labelEn: 'Emergency Calls', value: '3', icon: <AlertCircle size={20} />, color: 'bg-rose-500', lightColor: 'bg-rose-50' },
    { labelAr: 'متوسط الاستجابة', labelEn: 'Avg Response', value: '8m', icon: <Clock size={20} />, color: 'bg-amber-500', lightColor: 'bg-amber-50' },
  ];

  const fleet = [
    { id: 'AMB-001', model: 'Mercedes Sprinter', driverAr: 'أحمد علي', driverEn: 'Ahmed Ali', status: 'available', locationAr: 'الفرع الرئيسي', locationEn: 'Main Branch', fuel: '85%' },
    { id: 'AMB-002', model: 'Ford Transit', driverAr: 'ياسر محمد', driverEn: 'Yaser Mohamed', status: 'en-route', locationAr: 'شارع النيل', locationEn: 'Nile Street', fuel: '40%' },
    { id: 'AMB-003', model: 'Mercedes Sprinter', driverAr: 'خالد يوسف', driverEn: 'Khalid Youssef', status: 'maintenance', locationAr: 'الورشة المركزية', locationEn: 'Central Workshop', fuel: '10%' },
    { id: 'AMB-004', model: 'GMC Savana', driverAr: 'سامي فؤاد', driverEn: 'Sami Fouad', status: 'dispatched', locationAr: 'المنطقة الصناعية', locationEn: 'Industrial Zone', fuel: '92%' },
  ];

  const dispatches = [
    { id: 'DSP-9921', patientAr: 'محمد حسن', patientEn: 'Mohamed Hassan', typeAr: 'إصابة عمل', typeEn: 'Work Injury', locationAr: 'مصنع الخليج', locationEn: 'Gulf Factory', time: '10:15 AM', status: 'active', priority: 'high' },
    { id: 'DSP-9922', patientAr: 'سارة أحمد', patientEn: 'Sara Ahmed', typeAr: 'حالة ولادة', typeEn: 'Maternity', locationAr: 'حي الصفاء', locationEn: 'Al Safa District', time: '10:30 AM', status: 'completed', priority: 'medium' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header with Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-sm border border-white/40 flex flex-wrap items-center justify-between gap-6 sticky top-0 z-30">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-200 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
               <Ambulance size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-gray-800 tracking-tight leading-none">
                 {isAr ? 'إدارة الإسعاف والطوارئ' : 'Ambulance & Emergency Dispatch'}
               </h1>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
                 {isAr ? 'نظام التتبع والاستجابة السريعة' : 'Fleet Tracking & Rapid Response System'}
               </p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="relative group">
               <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder={isAr ? 'بحث عن مركبة...' : 'Track vehicle...'} 
                 className="pr-12 pl-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl text-xs font-black outline-none focus:bg-white focus:border-rose-100 transition-all w-64 shadow-inner"
               />
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl active:scale-95">
               <Plus size={18} />
               <span>{isAr ? 'بلاغ جديد' : 'New Dispatch'}</span>
            </button>
         </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-24 h-24 ${stat.lightColor} rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700 opacity-50`}></div>
             <div className="flex items-center justify-between mb-5 relative z-10">
                <div className={`w-12 h-12 ${stat.lightColor} ${stat.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                   {stat.icon}
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-gray-400 group-hover:text-rose-500 transition-colors">
                   <TrendingUp size={16} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">{isAr ? stat.labelAr : stat.labelEn}</p>
             <h4 className="text-3xl font-black text-gray-800 mt-2 tracking-tight relative z-10">{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Fleet List (Main) */}
        <div className="xl:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
                 <h2 className="text-xl font-black text-gray-800">{isAr ? 'حالة الأسطول' : 'Fleet Status Overview'}</h2>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
                 <button onClick={() => setActiveView('fleet')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'fleet' ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{isAr ? 'المركبات' : 'Vehicles'}</button>
                 <button onClick={() => setActiveView('dispatches')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'dispatches' ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{isAr ? 'البلاغات' : 'Dispatches'}</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeView === 'fleet' ? fleet.map((v, idx) => (
                <div key={v.id} className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                           v.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                           v.status === 'en-route' ? 'bg-amber-50 text-amber-600' :
                           v.status === 'dispatched' ? 'bg-rose-50 text-rose-600' :
                           'bg-slate-50 text-slate-600'
                         }`}>
                            <Ambulance size={28} />
                         </div>
                         <div>
                            <h5 className="text-sm font-black text-gray-800 tracking-tight">{v.id}</h5>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{v.model}</p>
                         </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-xl text-gray-300 hover:text-gray-600 cursor-pointer transition-colors"><MoreVertical size={16}/></div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-colors group-hover:bg-white/50 group-hover:border-rose-100">
                         <div className="flex items-center gap-3">
                            <Users size={16} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">{isAr ? v.driverAr : v.driverEn}</span>
                         </div>
                         <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                           v.status === 'available' ? 'bg-emerald-500 text-white shadow-emerald-100' :
                           v.status === 'maintenance' ? 'bg-slate-400 text-white shadow-slate-100' :
                           'bg-rose-500 text-white shadow-rose-100 animate-pulse'
                         }`}>
                            {isAr ? (v.status === 'available' ? 'متاح' : v.status === 'en-route' ? 'في الطريق' : v.status === 'maintenance' ? 'صيانة' : 'تلبية بلاغ') : v.status}
                         </div>
                      </div>

                      <div className="flex items-center justify-between px-2">
                         <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-rose-400" />
                            <span className="text-[10px] font-black text-gray-400 tracking-tight truncate max-w-[120px]">{isAr ? v.locationAr : v.locationEn}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className={`h-full ${parseInt(v.fuel) > 70 ? 'bg-emerald-500' : parseInt(v.fuel) > 30 ? 'bg-amber-500' : 'bg-rose-500'} transition-all duration-1000`} style={{ width: v.fuel }}></div>
                            </div>
                            <span className="text-[9px] font-black text-gray-400">{v.fuel}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-8 flex gap-3">
                      <button className="flex-1 py-3 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-2xl transition-all flex items-center justify-center gap-2">
                         <Navigation size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'تتبع' : 'Track'}</span>
                      </button>
                      <button className="flex-1 py-3 bg-gray-50 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all flex items-center justify-center gap-2">
                         <Edit3 size={14} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'تعديل' : 'Edit'}</span>
                      </button>
                   </div>
                </div>
              )) : dispatches.map((d, idx) => (
                <div key={d.id} className="bg-white p-7 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><AlertCircle size={20}/></div>
                         <div>
                            <h5 className="text-sm font-black text-gray-800">{d.id}</h5>
                            <p className="text-[10px] font-bold text-gray-400">{d.time}</p>
                         </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        d.priority === 'high' ? 'bg-rose-600 text-white shadow-rose-100' : 'bg-emerald-500 text-white shadow-emerald-100'
                      }`}>
                         {isAr ? (d.priority === 'high' ? 'عالي الخطورة' : 'متوسط') : d.priority}
                      </span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 transition-all group-hover:bg-white group-hover:border-indigo-100">
                         <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'المريض' : 'Patient'}</span>
                            <span className="text-xs font-black text-gray-800">{isAr ? d.patientAr : d.patientEn}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الحالة' : 'Complaint'}</span>
                            <span className="text-xs font-bold text-rose-500">{isAr ? d.typeAr : d.typeEn}</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 px-2 text-[10px] font-bold text-gray-400">
                         <MapPin size={14} className="text-rose-400" />
                         <span>{isAr ? d.locationAr : d.locationEn}</span>
                      </div>
                   </div>

                   <button className="w-full mt-8 bg-rose-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-100 transform active:scale-95 transition-all">
                      {isAr ? 'تفاصيل البلاغ' : 'View Full Report'}
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Right Sidebar: Dispatch Map / Active Calls */}
        <div className="space-y-8">
           {/* Mini Map Placeholder */}
           <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden group">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                 <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{isAr ? 'التتبع المباشر' : 'Live Tracking'}</h3>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                 </div>
              </div>
              <div className="h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="w-full h-full border border-dashed border-gray-400 scale-[2]"></div>
                 </div>
                 <div className="relative z-10 flex flex-col items-center gap-3 text-gray-400">
                    <Navigation size={48} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'جاري تحميل الخريطة...' : 'Loading Radar...'}</span>
                 </div>
                 
                 {/* Mock Vehicle Pins */}
                 <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-white rounded-xl shadow-2xl flex items-center justify-center text-rose-600 animate-bounce duration-1000 border-2 border-rose-100"><Ambulance size={14}/></div>
                 <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-white rounded-xl shadow-2xl flex items-center justify-center text-emerald-600 animate-bounce duration-700 border-2 border-emerald-100"><Ambulance size={14}/></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-900 to-indigo-950 text-white">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{isAr ? 'دقة نظام GPS' : 'GPS Precision'}</span>
                    <span className="text-[10px] font-black text-emerald-400">98.5%</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 </div>
              </div>
           </div>

           {/* Quick Actions / Tips */}
           <div className="bg-rose-50/50 p-8 rounded-[3rem] border-2 border-dashed border-rose-100 space-y-6">
              <div className="flex items-center gap-3 text-rose-600">
                 <AlertTriangle size={24} />
                 <h3 className="font-black text-sm">{isAr ? 'بروتوكول الطوارئ' : 'Emergency Protocol'}</h3>
              </div>
              <p className="text-xs font-bold text-rose-400 leading-relaxed italic">{isAr ? 'يرجى التأكد من توفر طاقم كامل في كل مركبة مُبلغة بحالة طوارئ من الفئة (A).' : 'Ensure full medical crew availability before dispatching to Category (A) emergencies.'}</p>
              <div className="space-y-3">
                 <button className="w-full py-4 bg-white text-rose-600 rounded-2xl text-[11px] font-black shadow-sm border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">
                   {isAr ? 'قائمة تفقد المركبة' : 'Vehicle Checklist'}
                 </button>
                 <button className="w-full py-4 bg-white text-rose-600 rounded-2xl text-[11px] font-black shadow-sm border border-rose-100 hover:bg-rose-600 hover:text-white transition-all">
                   {isAr ? 'تحديث المناوبات' : 'Update Crew Shifts'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

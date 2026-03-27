import React from 'react';
import { 
  Users, DollarSign, TrendingUp, AlertCircle, Clock, 
  Pill, UserX, ArrowUpRight, ArrowDownRight, Bell,
  Calendar, ChevronRight, Activity, Mail, Phone, Truck,
  Building2, MessageSquare
} from 'lucide-react';

interface DashboardPageProps {
  isAr: boolean;
  tx: any;
  medicines: any[];
  doctors: any[];
  apiStats?: any;
  settings?: any;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ isAr, tx, medicines, doctors, apiStats, settings }) => {
  // Use API stats if available, otherwise fallback to mock
  const statsArray = Array.isArray(apiStats) ? apiStats : (apiStats?.stats || []);
  const stats = statsArray.length > 0 ? statsArray : [
    {
      id: 1,
      titleAr: 'إجمالي المرضى',
      titleEn: 'Total Patients',
      value: '---',
      trend: '+0.0%',
      trendUp: true,
      periodAr: 'مقارنة بالشهر الماضي',
      periodEn: 'vs last month',
      icon: <Users size={24} />,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50'
    },
    {
      id: 2,
      titleAr: 'الدخل الشهري',
      titleEn: 'Monthly Income',
      value: '$0',
      trend: '+0.0%',
      trendUp: true,
      periodAr: 'مقارنة بالشهر الماضي',
      periodEn: 'vs last month',
      icon: <DollarSign size={24} />,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50'
    },
    {
      id: 3,
      titleAr: 'الدخل السنوي',
      titleEn: 'Annual Income',
      value: '$0',
      trend: '+0.0%',
      trendUp: true,
      periodAr: 'مقارنة بالعام الماضي',
      periodEn: 'vs last year',
      icon: <TrendingUp size={24} />,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50'
    },
    {
      id: 4,
      titleAr: 'الحالات النشطة',
      titleEn: 'Active Cases',
      value: '84',
      trend: '+12%',
      trendUp: true,
      periodAr: 'في الوقت الحالي',
      periodEn: 'currently active',
      icon: <Activity size={24} />,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50'
    },
    {
      id: 5,
      titleAr: 'الموردين',
      titleEn: 'Suppliers',
      value: '18',
      trend: '+2',
      trendUp: true,
      periodAr: 'شركة مسجلة',
      periodEn: 'registered vendors',
      icon: <Truck size={24} />,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50'
    }
  ];

  // Map icons and colors back to API stats if they come from backend (since backend doesn't send React components)
  const finalStats = stats.map((s: any) => {
    if (!s.icon) {
      const template = [
        { icon: <Users size={24} />, color: 'bg-blue-500', lightColor: 'bg-blue-50' },
        { icon: <DollarSign size={24} />, color: 'bg-emerald-500', lightColor: 'bg-emerald-50' },
        { icon: <TrendingUp size={24} />, color: 'bg-purple-500', lightColor: 'bg-purple-50' },
        { icon: <Activity size={24} />, color: 'bg-amber-500', lightColor: 'bg-amber-50' },
        { icon: <Truck size={24} />, color: 'bg-indigo-500', lightColor: 'bg-indigo-50' }
      ][(s.id - 1) % 5];
      return { ...s, ...template };
    }
    return s;
  });

  const outOfStock = medicines.filter(m => m.stock === 0 || m.status === 'out');
  const lowStock = medicines.filter(m => m.status === 'low');
  const expiredMedicines = medicines.filter(m => new Date(m.expiryDate).getTime() <= Date.now());
  
  // Mocking late doctors
  const lateDoctors = [
    { id: 1, nameAr: 'د. أحمد محمود', nameEn: 'Dr. Ahmed Mahmoud', time: '15 min', avatar: 'AM' },
    { id: 2, nameAr: 'د. ليلى محمد', nameEn: 'Dr. Layla Mohammed', time: '30 min', avatar: 'LM' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hospital Identity & Contact Info (Added as requested) */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Building2 size={26} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{isAr ? 'اسم المستشفى' : 'Hospital Name'}</h4>
                 <p className="text-sm font-black text-gray-800 leading-tight">{isAr ? settings.hospitalNameAr : settings.hospitalNameEn}</p>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Mail size={26} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{isAr ? 'البريد الرسمي' : 'Official Email'}</h4>
                 <p className="text-xs font-black text-gray-800 leading-tight truncate max-w-[150px]">{settings.hospitalEmail}</p>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Phone size={26} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{isAr ? 'هاتف الطوارئ' : 'Emergency Line'}</h4>
                 <p className="text-xs font-black text-gray-800 leading-tight">{settings.hospitalPhone}</p>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <MessageSquare size={26} />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{isAr ? 'دعم الواتساب' : 'WhatsApp Support'}</h4>
                 <p className="text-xs font-black text-gray-800 leading-tight">{settings.whatsapp}</p>
              </div>
           </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {finalStats.map((stat: any, index: number) => (
          <div 
            key={stat.id} 
            className="glass-card glass-card-hover rounded-2xl p-6 transition-all duration-300 group overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Decorative Shimmer/Gloss effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl ${stat.lightColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-sm border border-white/50`}>
                <div className={`${stat.color.replace('bg-', 'text-')}`}>
                  {stat.icon}
                </div>
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'} bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-50`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1 relative z-10 uppercase tracking-wider">
              {isAr ? stat.titleAr : stat.titleEn}
            </h3>
            <p className="text-2xl font-black text-gray-800 tracking-tight relative z-10">{stat.value}</p>
            {stat.periodEn && (
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 relative z-10 tracking-widest">
                {isAr ? stat.periodAr : stat.periodEn}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Stock & Low Stock Medicines */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-red-50/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100/50 flex items-center justify-center text-rose-500 shadow-inner">
                <AlertCircle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-800">
                  {isAr ? 'أدوية منتهية الصلاحية' : 'Expired Medicines'}
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  {isAr ? 'تحتاج إلى سحب فوري من المخزن' : 'Requires immediate withdrawal from stock'}
                </p>
              </div>
            </div>
            <span className="bg-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-rose-200">
              {expiredMedicines.length}
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {expiredMedicines.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-rose-500 shadow-sm"><Pill size={16} /></div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{isAr ? med.nameAr : med.nameEn}</h4>
                      <p className="text-[10px] text-rose-600 font-black">{isAr ? 'منتهي بتاريخ: ' : 'Expired on: '} {med.expiryDate}</p>
                    </div>
                  </div>
                </div>
              ))}
              {expiredMedicines.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  {isAr ? 'لا توجد أدوية منتهية الصلاحية' : 'No expired medicines found'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Late Doctors */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <div className="p-6 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-500 shadow-inner">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-800">
                  {isAr ? 'تتبع تأخر الأطباء' : 'Doctor Delay Tracking'}
                </h2>
                <p className="text-xs text-gray-400 font-medium">
                  {isAr ? 'الأطباء المتأخرون عن المواعيد' : 'Doctors late for their schedule'}
                </p>
              </div>
            </div>
            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-amber-200">
              {lateDoctors.length}
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lateDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100/50 bg-gray-50/30 hover:bg-white hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-100">
                        {doc.avatar}
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-800">{isAr ? doc.nameAr : doc.nameEn}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'استشاري جراحة' : 'Surgery Consultant'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-amber-600 font-black bg-amber-100/50 px-3 py-1.5 rounded-xl border border-amber-200/50 shadow-sm transition-transform group-hover:scale-105">
                      <Clock size={14} className="animate-pulse" />
                      <span className="text-xs">{isAr ? 'متأخر' : 'Late'} {doc.time}</span>
                    </div>
                    <span className="text-[9px] text-gray-300 font-bold">{isAr ? 'الموعد: ٠٨:٠٠ ص' : 'Appt: 08:00 AM'}</span>
                  </div>
                </div>
              ))}
              {lateDoctors.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm italic">
                  {isAr ? 'جميع الأطباء ملتزمون بالجدول' : 'All doctors are on schedule'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
        <div className="p-6 border-b border-gray-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100/50 flex items-center justify-center text-primary-500 shadow-inner">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800">{isAr ? 'التنبيهات العاجلة' : 'Urgent Notifications'}</h2>
          </div>
          <button className="text-[11px] font-black text-gray-400 hover:text-primary-500 transition-colors">
            {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group p-5 rounded-2xl border border-amber-100/50 bg-amber-50/20 flex gap-4 hover:bg-amber-50/40 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/20 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="text-amber-600 bg-white p-2.5 rounded-xl shadow-sm h-fit relative z-10"><Clock size={20} /></div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-gray-800">{isAr ? 'أطباء متأخرون' : 'Late Doctors Alert'}</h4>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">{isAr ? `يوجد عدد ${lateDoctors.length} أطباء متأخرين عن جداولهم الزمنية اليوم` : `There are ${lateDoctors.length} doctors currently late for their shifts`}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{isAr ? 'تحديث فوري' : 'Live Update'}</span>
                <button className="text-[10px] font-black text-amber-700 underline underline-offset-4">{isAr ? 'متابعة' : 'Follow up'}</button>
              </div>
            </div>
          </div>
          <div className="group p-5 rounded-2xl border border-red-100/50 bg-red-50/20 flex gap-4 hover:bg-red-50/40 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/20 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="text-red-600 bg-white p-2.5 rounded-xl shadow-sm h-fit relative z-10"><Pill size={20} /></div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-gray-800">{isAr ? 'تحذير انتهاء صلاحية' : 'Medicine Expiry Alert'}</h4>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">{isAr ? `تنبيه: يوجد عدد ${expiredMedicines.length} أدوية منتهية الصلاحية تتطلب التخلص الآمن` : `Warning: ${expiredMedicines.length} medicines have expired and require safe disposal`}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{isAr ? 'عاجل جداً' : 'High Priority'}</span>
                <button className="text-[10px] font-black text-red-700 underline underline-offset-4">{isAr ? 'معالجة' : 'Handle Now'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Contact Quick View */}
      {settings && (
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden mt-8 relative group">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 rotate-3 transition-transform group-hover:rotate-12">
                    <Truck size={32} className="text-white" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black tracking-tight">{isAr ? 'الموردين والشركاء' : 'Suppliers & Partners'}</h2>
                    <p className="text-primary-100 text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">{isAr ? 'إدارة التوريد والمخزون المركزي' : 'Supply chain & central warehouse management'}</p>
                 </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-glow"></div>
                       <span className="text-xs font-bold">{isAr ? `شركة توريد ${i}` : `Supplier Corp ${i}`}</span>
                    </div>
                 ))}
                 <button className="bg-white text-primary-600 px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-primary-50 transition-all">{isAr ? 'عرض الكل' : 'View All'}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

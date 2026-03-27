import React, { useState, useEffect } from 'react';
import { 
  Beaker, FlaskConical, Banknote, History, 
  Settings2, BarChart3, Plus, Search, 
  AlertTriangle, CheckCircle2, TrendingUp, 
  TrendingDown, Layers, Globe, Bell, MoreVertical, 
  Edit3, Trash2, LayoutDashboard, Database, Activity, UserCheck, DollarSign, Calculator, Printer, ExternalLink, X, Send, Save, CreditCard, Building2, UserPlus, Info, Microscope, Dna
} from 'lucide-react';

/* ───────── Types ───────── */
export interface LabTest {
  id: number;
  nameAr: string;
  nameEn: string;
  categoryAr: string; 
  categoryEn: string;
  sampleTypeAr: string; 
  sampleTypeEn: string;
  aimAr: string; 
  aimEn: string;
  cost: number;
  isActive: boolean;
}

export interface LabTransaction {
  id: number;
  patientName: string;
  testNameAr: string;
  testNameEn: string;
  amount: number;
  date: string;
  isExternal: boolean;
  paymentStatus: 'paid' | 'pending';
}

interface LaboratoryManagementProps {
  isAr: boolean;
  onToggleLang?: () => void;
  notifications?: any[];
}

const ManagementStat: React.FC<any> = ({ isAr, titleAr, titleEn, value, icon, color, subtitleAr, subtitleEn }) => (
  <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
     <div className="flex items-center gap-5 relative z-10 transition-transform group-hover:translate-x-1">
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center transition-all group-hover:scale-105 shadow-inner`}>
           {icon && React.cloneElement(icon as React.ReactElement<any>, { className: `w-5 h-5 ${color.replace('bg-', 'text-')}`, strokeWidth: 3 })}
        </div>
        <div>
           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{isAr ? titleAr : titleEn}</p>
           <h3 className="text-xl font-black text-gray-800 tracking-tight leading-none mb-1">{value}</h3>
           <p className="text-[8px] text-gray-400 font-bold opacity-70 italic">{isAr ? subtitleAr : subtitleEn}</p>
        </div>
     </div>
     <div className={`absolute -right-4 -bottom-4 w-20 h-20 ${color} opacity-[0.03] rounded-full group-hover:scale-125 transition-transform duration-1000`}></div>
  </div>
);

export const LaboratoryManagementPage: React.FC<LaboratoryManagementProps> = ({
  isAr, onToggleLang, notifications = []
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'ledger'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showTestModal, setShowTestModal] = useState(false);
    const [editingTest, setEditingTest] = useState<LabTest | null>(null);
    const [ledgerFilter, setLedgerFilter] = useState<'all' | 'internal' | 'external'>('all');

    const [tests, setTests] = useState<LabTest[]>([
       { id: 1, nameAr: 'صورة دم كاملة', nameEn: 'CBC (Complete Blood Count)', categoryAr: 'دمويات', categoryEn: 'Hematology', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'قياس كريات الدم الحمراء والبيضاء، الصفائح، الهيموغلوبين؛ كشف فقر الدم والعدوى', aimEn: 'Measures RBC, WBC, Platelets, Hgb; detects anemia, infection, and clotting issues', cost: 1500, isActive: true },
       { id: 2, nameAr: 'وظائف الكبد', nameEn: 'Liver Function (ALT, AST)', categoryAr: 'كيمياء', categoryEn: 'Biochemistry', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'تقييم صحة الكبد والكشف عن التلف أو الالتهاب', aimEn: 'Evaluates liver health and detects damage or inflammation', cost: 3500, isActive: true },
       { id: 3, nameAr: 'وظائف الكلى', nameEn: 'Kidney Function (Creatinine)', categoryAr: 'كيمياء', categoryEn: 'Biochemistry', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'معرفة أداء الكلى وكشف الفشل الكلوي', aimEn: 'Assesses kidney performance and detects failure', cost: 2500, isActive: true },
       { id: 4, nameAr: 'السكر', nameEn: 'Glucose', categoryAr: 'كيمياء', categoryEn: 'Biochemistry', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'تشخيص ومتابعة مرض السكري', aimEn: 'Diagnosis and monitoring of Diabetes', cost: 800, isActive: true },
       { id: 5, nameAr: 'الدهون', nameEn: 'Lipid Profile', categoryAr: 'كيمياء', categoryEn: 'Biochemistry', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'تقييم صحة القلب والشرايين وخطر الأمراض القلبية', aimEn: 'Evaluates heart health and cardiovascular risk', cost: 4500, isActive: true },
       { id: 6, nameAr: 'فحوصات الهرمونات', nameEn: 'Hormonal Tests (TSH, T3, T4)', categoryAr: 'غدد', categoryEn: 'Endocrinology', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'تقييم وظائف الغدد الصماء', aimEn: 'Evaluates endocrine gland functions', cost: 6000, isActive: true },
       { id: 7, nameAr: 'فحوصات مناعية', nameEn: 'Immune Tests (CRP, Antibodies)', categoryAr: 'مناعة', categoryEn: 'Immunology', sampleTypeAr: 'دم', sampleTypeEn: 'Blood', aimAr: 'كشف الالتهابات أو المناعة الذاتية', aimEn: 'Detects inflammation or autoimmune conditions', cost: 3200, isActive: true },
       { id: 8, nameAr: 'تحليل البول الشامل', nameEn: 'Urinalysis', categoryAr: 'عام', categoryEn: 'General', sampleTypeAr: 'بول', sampleTypeEn: 'Urine', aimAr: 'فحص البروتين والسكر والدم؛ تقييم صحة الكلى والمسالك', aimEn: 'Checks protein, sugar, blood; evaluates kidney and urinary health', cost: 600, isActive: true },
       { id: 9, nameAr: 'مزرعة بول', nameEn: 'Urine Culture', categoryAr: 'أحياء دقيقة', categoryEn: 'Microbiology', sampleTypeAr: 'بول', sampleTypeEn: 'Urine', aimAr: 'تحديد نوع البكتيريا لمعرفة المضاد المناسب', aimEn: 'Identifies bacteria type for antibiotic matching', cost: 2800, isActive: true },
       { id: 10, nameAr: 'تحليل براز', nameEn: 'Stool Test', categoryAr: 'طفيليات', categoryEn: 'Parasitology', sampleTypeAr: 'براز', sampleTypeEn: 'Stool', aimAr: 'الكشف عن الطفيليات والبكتيريا والدم الخفي', aimEn: 'Detects parasites, bacteria, and occult blood', cost: 700, isActive: true },
       { id: 11, nameAr: 'تحليل السائل الشوكي', nameEn: 'CSF Analysis', categoryAr: 'سوائل', categoryEn: 'Fluids', sampleTypeAr: 'سائل شوكي', sampleTypeEn: 'CSF', aimAr: 'تشخيص الالتهابات العصبية والأمراض الدماغية', aimEn: 'Diagnoses neurological infections and brain diseases', cost: 8500, isActive: true },
       { id: 12, nameAr: 'تحليل سوائل الجسد', nameEn: 'Fluid Analysis', categoryAr: 'سوائل', categoryEn: 'Fluids', sampleTypeAr: 'سوائل جسدية', sampleTypeEn: 'Body Fluids', aimAr: 'تقييم الالتهاب أو العدوى في سوائل الجسم', aimEn: 'Evaluates inflammation or infection in collected fluids', cost: 4200, isActive: true },
       { id: 13, nameAr: 'التحليل الجزيئي PCR', nameEn: 'Molecular Analysis (PCR)', categoryAr: 'جزيئي', categoryEn: 'Molecular', sampleTypeAr: 'دم/أخرى', sampleTypeEn: 'Blood/Other', aimAr: 'الكشف عن الفيروسات أو البكتيريا بدقة عالية', aimEn: 'High-precision virus or bacteria detection', cost: 12000, isActive: true },
       { id: 14, nameAr: 'الفحوصات الجينية', nameEn: 'Genetic Tests', categoryAr: 'وراثة', categoryEn: 'Genetics', sampleTypeAr: 'دم/أخرى', sampleTypeEn: 'Blood/Other', aimAr: 'كشف الطفرات أو الأمراض الوراثية', aimEn: 'Detects mutations or hereditary diseases', cost: 18000, isActive: true },
    ]);

    const [transactions, setTransactions] = useState<LabTransaction[]>([
       { id: 1, patientName: 'أحمد علي حسن', testNameAr: 'صورة دم كاملة', testNameEn: 'CBC', amount: 1500, date: '2026-03-24', isExternal: true, paymentStatus: 'paid' },
       { id: 2, patientName: 'سارة محمود', testNameAr: 'وظائف كبد', testNameEn: 'Liver Function Tests', amount: 3500, date: '2026-03-24', isExternal: true, paymentStatus: 'paid' },
       { id: 3, patientName: 'محمد خالد', testNameAr: 'سكر صائم', testNameEn: 'FBS', amount: 800, date: '2026-03-23', isExternal: true, paymentStatus: 'paid' },
       { id: 4, patientName: 'فاطمة إبراهيم', testNameAr: 'CBC', testNameEn: 'CBC', amount: 1500, date: '2026-03-24', isExternal: false, paymentStatus: 'paid' },
       { id: 5, patientName: 'عمر ياسر', testNameAr: 'تحليل بول', testNameEn: 'Urine', amount: 500, date: '2026-03-24', isExternal: false, paymentStatus: 'paid' }
    ]);

    const tabs = [
      { id: 'overview', nameAr: 'الإحصائيات', nameEn: 'Insights', icon: LayoutDashboard },
      { id: 'tests', nameAr: 'دليل الفحوصات', nameEn: 'Directory', icon: Beaker },
      { id: 'ledger', nameAr: 'السجلات المالية', nameEn: 'Ledger', icon: DollarSign },
    ];

    const handleDeleteTest = (id: number) => {
       if (confirm(isAr ? 'هل أنت متأكد من حذف هذا الفحص؟' : 'Permanent remove this diagnostic?')) {
          setTests(tests.filter(t => t.id !== id));
       }
    };

    const externalRev = transactions.filter(t => t.isExternal).reduce((sum, t) => sum + t.amount, 0);
    const internalRev = transactions.filter(t => !t.isExternal).reduce((sum, t) => sum + t.amount, 0);

    const filteredTransactions = transactions.filter(tx => {
       const matchesSearch = tx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tx.testNameEn.toLowerCase().includes(searchTerm.toLowerCase());
       const matchesLedgerType = ledgerFilter === 'all' || (ledgerFilter === 'external' ? tx.isExternal : !tx.isExternal);
       return matchesSearch && matchesLedgerType;
    });

    const filteredTests = tests.filter(t => 
        t.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categoryEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.sampleTypeEn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-cairo">
         {/* Management Header */}
         <div className="bg-[#0f172a] rounded-[2.5rem] p-4 shadow-2xl border-b-4 border-indigo-500 flex flex-col xl:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex items-center gap-6 relative z-10 transition-transform hover:scale-[1.01]">
               <div className="w-16 h-16 bg-white shrink-0 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-500/20 transform -rotate-3 hover:rotate-0 transition-transform border border-indigo-100 shadow-inner">
                  <Settings2 size={32} strokeWidth={2.5}/>
               </div>
               <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">{isAr ? 'إدارة التحاليل والمختبرات' : 'Scientific Lab Operations'}</h1>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{isAr ? 'وحدة الرقابة الإحصائية والمالية المركزية' : 'CENTRAL STATISTICAL & FINANCIAL CONTROL HUB'}</p>
               </div>
            </div>

            <div className="flex bg-white/5 backdrop-blur-xl p-1.5 rounded-[1.5rem] relative z-10 border border-white/10 shadow-inner overflow-x-auto">
               {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                     <tab.icon size={16} />
                     {isAr ? tab.nameAr : tab.nameEn}
                  </button>
               ))}
            </div>

             {/* High-precision header without redundant toggles */}
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ManagementStat isAr={isAr} titleAr="إيرادات المشتركين" titleEn="Public Revenue" value={`${externalRev.toLocaleString()} SDG`} icon={<UserPlus />} color="bg-emerald-500" subtitleAr="مرضى الكاش والزيارات الخارجية" subtitleEn="Cash Walk-ins & Direct Sales" />
            <ManagementStat isAr={isAr} titleAr="إيرادات المؤسسة" titleEn="Institutional Revenue" value={`${internalRev.toLocaleString()} SDG`} icon={<Building2 />} color="bg-blue-500" subtitleAr="الأقسام والعيادات الداخلية" subtitleEn="Clinical & Ward Transfers" />
            <ManagementStat isAr={isAr} titleAr="دليل الفحوصات" titleEn="Directory Units" value={tests.length} icon={<Microscope />} color="bg-indigo-500" subtitleAr="إجمالي الفحوصات المتاحة" subtitleEn="Diagnostic units in catalog" />
            <ManagementStat isAr={isAr} titleAr="كفاءة العمليات" titleEn="Global Growth" value="12.5%" icon={<TrendingUp />} color="bg-slate-900" subtitleAr="زيادة النشاط السنوية" subtitleEn="Year-on-year performance growth" />
         </div>

         {/* Content Area */}
         <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-sm min-h-[600px] overflow-hidden group relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner group-hover:rotate-12 transition-transform">
                     {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 32 })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isAr ? tabs.find(t => t.id === activeTab)?.nameAr : tabs.find(t => t.id === activeTab)?.nameEn}</h2>
                    <p className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-[0.3em]">{isAr ? 'الرقابة الدقيقة على البيانات التشغيلية' : `EXECUTIVE ${activeTab.toUpperCase()} ENGINE`}</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full lg:w-auto mt-6 lg:mt-0">
                  <div className="relative flex-1 lg:w-96 group/search">
                     <Search className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-600 transition-colors`} size={20} />
                     <input 
                       type="text" 
                       placeholder={isAr ? 'ابحث عن فحص أو مريض...' : 'Identify diagnostics or benchmarks...'}
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                       className={`w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-[1.2rem] ${isAr ? 'pr-14' : 'pl-14'} py-5 text-xs font-black outline-none transition-all shadow-inner placeholder:text-slate-300`}
                     />
                  </div>
                  {activeTab === 'tests' && (
                     <button 
                        onClick={() => { setEditingTest(null); setShowTestModal(true); }}
                        className="flex items-center gap-3 bg-[#0f172a] text-white px-10 py-5 rounded-[1.2rem] text-[11px] font-black shadow-xl shadow-indigo-100 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border border-slate-700">
                        <Plus size={20} />
                        {isAr ? 'تعريف فحص جديد' : 'Architect New Unit'}
                     </button>
                  )}
               </div>
            </div>

            {/* Tab Views */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full"></div>
                        <div className="flex items-center justify-between relative z-10">
                           <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase">{isAr ? 'فحوصات الطلب العالي هيماتولوجي' : 'STRATEGIC HEMATOLOGY DEMAND'}</h4>
                           <TrendingUp className="text-emerald-500" size={24} />
                        </div>
                        <div className="space-y-8 relative z-10">
                           {[
                              { label: isAr ? 'صورة دم كاملة' : 'CBC (Hematology)', count: 450, color: 'bg-indigo-600', total: 600 },
                              { label: isAr ? 'وظائف الكبد' : 'Liver Functions', count: 320, color: 'bg-indigo-500', total: 600 },
                              { label: isAr ? 'التحليل الجزيئي PCR' : 'PCR Molecular', count: 180, color: 'bg-indigo-400', total: 600 }
                           ].map((item, i) => (
                              <div key={i} className="space-y-3">
                                 <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                                    <span>{item.label}</span>
                                    <span className="text-indigo-600">{(item.count/item.total*100).toFixed(0)}% Production</span>
                                 </div>
                                 <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                    <div className={`h-full ${item.color} shadow-lg shadow-indigo-500/20`} style={{ width: `${(item.count/item.total)*100}%` }}></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group/card flex flex-col justify-between min-h-[400px]">
                           <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 opacity-[0.03] rounded-full -mr-40 -mt-40 blur-3xl"></div>
                           <div className="relative z-10">
                              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-8 backdrop-blur-md transition-transform group-hover/card:scale-110">
                                 <Dna size={30} className="text-indigo-400" />
                              </div>
                              <h3 className="text-3xl font-black mb-8 leading-tight max-w-sm">{isAr ? 'ذكاء التشخيص والنمو الوراثي' : 'Genetic & Molecular Intelligence Growth'}</h3>
                              <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-md">{isAr ? 'تم تحليل حركة الفحوصات الجينية، لوحظ تزايد ملحوظ في الطلبات الخارجية بنسبة 22٪ الشهر الماضي.' : 'Genetic diagnostics movement confirms a 22% spike in external requests. High-precision units are performing at peak revenue capacity.'}</p>
                           </div>
                           <Globe size={300} className="absolute right-[-20%] bottom-[-20%] text-white/5 opacity-20 group-hover/card:rotate-45 transition-transform duration-[4000ms]" />
                           <button className="relative z-10 w-fit bg-white/5 hover:bg-indigo-600 text-white px-10 py-4 rounded-[1.2rem] text-[10px] font-black backdrop-blur-md transition-all border border-white/10 uppercase tracking-[0.2em] shadow-2xl">{isAr ? 'تحميل تقارير الذكاء' : 'EXPORT INTEL DATA'}</button>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'tests' && (
                  <div className="overflow-x-auto rounded-[3.5rem] border-2 border-slate-50 shadow-inner bg-white min-w-full">
                     <table className="w-full text-right" dir={isAr ? 'rtl' : 'ltr'}>
                        <thead>
                           <tr className="bg-indigo-50/30 border-b-2 border-indigo-100">
                              <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الفحص والتصنيف' : 'DIAGNOSTIC UNIT'}</th>
                              <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'نوع العينة' : 'SAMPLE TYPE'}</th>
                              <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الهدف الإكلينيكي' : 'CLINICAL OBJECTIVE'}</th>
                              <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'التكلفة بالعملة' : 'OPERATIONAL FEE'}</th>
                              <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'إجراءات' : 'CONTROL'}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 p-4">
                           {filteredTests.map(test => (
                              <tr key={test.id} className="hover:bg-indigo-50/20 transition-all group/row">
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                       <div className="w-14 h-14 bg-white text-indigo-400 rounded-2xl flex items-center justify-center group-hover/row:bg-slate-900 group-hover/row:text-white transition-all shadow-sm border border-slate-100 border-b-4 border-b-indigo-100 group-hover/row:border-b-indigo-500"><FlaskConical size={26} /></div>
                                       <div>
                                          <p className="text-base font-black text-slate-800 tracking-tight">{isAr ? test.nameAr : test.nameEn}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? test.categoryAr : test.categoryEn}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? test.sampleTypeAr : test.sampleTypeEn}</span>
                                 </td>
                                 <td className="px-10 py-8 max-w-sm">
                                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic line-clamp-2">
                                        "{isAr ? test.aimAr : test.aimEn}"
                                    </p>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-indigo-700">{test.cost.toLocaleString()} <small className="text-[9px] opacity-70">SDG</small></span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-2 lg:opacity-0 group-hover/row:opacity-100 transition-all justify-end">
                                       <button onClick={() => { setEditingTest(test); setShowTestModal(true); }} className="p-3.5 bg-indigo-50 text-indigo-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Edit3 size={18} /></button>
                                       <button onClick={() => handleDeleteTest(test.id)} className="p-3.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                                       <button className="p-3.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><MoreVertical size={18} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}

               {activeTab === 'ledger' && (
                  <div className="space-y-10 animate-in slide-in-from-top-6 duration-700">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {[
                             { labelAr: 'الإيرادات التشغيلية', labelEn: 'GROSS AUDIT', val: (externalRev + internalRev).toLocaleString(), col: 'text-indigo-600', icon: <DollarSign />, bg: 'bg-indigo-50' },
                             { labelAr: 'متحصلات الكاش', labelEn: 'CASH LIQUIDITY', val: externalRev.toLocaleString(), col: 'text-emerald-600', icon: <Banknote />, bg: 'bg-emerald-50' },
                             { labelAr: 'حسابات العقود', labelEn: 'CONTRACTUALS', val: internalRev.toLocaleString(), col: 'text-blue-600', icon: <History />, bg: 'bg-blue-50' }
                         ].map((s, i) => (
                             <div key={i} className={`p-10 rounded-[3rem] border-2 border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/l-card`}>
                                 <div className={`w-14 h-14 ${s.bg} ${s.col} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover/l-card:rotate-12 transition-transform`}>{s.icon}</div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{isAr ? s.labelAr : s.labelEn}</p>
                                 <p className={`text-3xl font-black ${s.col} tracking-tight`}>{s.val} <small className="text-xs opacity-50 font-black">SDG</small></p>
                             </div>
                         ))}
                     </div>

                     <div className="overflow-x-auto rounded-[3.5rem] border-2 border-slate-900 bg-slate-900 shadow-2xl relative">
                        <table className="w-full text-right bg-white">
                           <thead>
                              <tr className="bg-[#0f172a] border-none">
                                 <th className="px-10 py-8 text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em]">{isAr ? 'سجل العمليات والتدفق' : 'TRANSACTIONAL SOVEREIGNTY'}</th>
                                 <th className="px-10 py-8 text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em]">{isAr ? 'المرجع' : 'LEDGER REF'}</th>
                                 <th className="px-10 py-8 text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em]">{isAr ? 'القيمة' : 'UNIT REVENUE'}</th>
                                 <th className="px-10 py-8 text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em]">{isAr ? 'المنشأ' : 'ORIGIN'}</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                               {filteredTransactions.map(tx => (
                                   <tr key={tx.id} className="hover:bg-indigo-50/20 transition-colors group/row-l">
                                       <td className="px-10 py-8">
                                           <div className="flex items-center gap-5">
                                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${tx.isExternal ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{tx.patientName.charAt(0)}</div>
                                               <div>
                                                   <p className="text-base font-black text-slate-800 tracking-tight">{tx.patientName}</p>
                                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{isAr ? tx.testNameAr : tx.testNameEn}</p>
                                               </div>
                                           </div>
                                       </td>
                                       <td className="px-10 py-8 text-[11px] font-mono text-slate-400 font-bold">{tx.isExternal ? 'EXT-L-2026' : 'INT-H-1044'}</td>
                                       <td className="px-10 py-8 font-black text-sm text-indigo-700 tabular-nums">{tx.amount.toLocaleString()} <span className="text-[10px] text-slate-300">SDG</span></td>
                                       <td className="px-10 py-8">
                                           <span className={`px-5 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest border ${tx.isExternal ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                               {isAr ? (tx.isExternal ? 'خارجي مباشر' : 'تحويل داخلي') : (tx.isExternal ? 'DIRECT WALK-IN' : 'CLINICAL TRANSFER')}
                                           </span>
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

         {/* MODAL: Test Configuration - Premium Version */}
         {showTestModal && (
            <div className="fixed inset-0 z-[700] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-3xl p-4">
               <div className="bg-white rounded-[3rem] shadow-[0_40px_120px_-15px_rgba(0,0,0,0.4)] w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100">
                  <div className="p-8 border-b-2 border-indigo-200 flex items-center justify-between bg-indigo-600 text-white shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                     <div className="flex items-center gap-6 relative z-10">
                        <div className="w-12 h-12 bg-white shrink-0 text-indigo-600 rounded-[1rem] flex items-center justify-center shadow-2xl transform -rotate-6 shadow-inner">
                           {editingTest ? <Edit3 size={24} /> : <Plus size={24} />}
                        </div>
                        <div>
                           <h3 className="text-xl font-black tracking-tight uppercase">{isAr ? (editingTest ? 'تعديل الفحص' : 'إضافة فحص') : (editingTest ? 'Edit Unit' : 'Add Unit')}</h3>
                           <p className="text-[9px] text-indigo-100 font-bold uppercase tracking-[0.4em]">{isAr ? 'ضبط الأسعار والبروتوكول' : 'NOMENCLATURE & REVENUE'}</p>
                        </div>
                     </div>
                     <button onClick={() => setShowTestModal(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"><X size={20} /></button>
                  </div>
                  
                  <div className="p-8 space-y-6 flex-1 overflow-y-auto bg-slate-50/30">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'الاسم باللغة العربية' : 'Arabic Name'}</label>
                        <input defaultValue={editingTest?.nameAr} className="w-full bg-white border-2 border-slate-100 rounded-[1.2rem] px-6 py-4 text-xs font-black focus:border-indigo-300 outline-none transition-all shadow-inner" placeholder="مثال: وظائف كلى" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'الاسم باللغة الإنجليزية' : 'English Name'}</label>
                        <input defaultValue={editingTest?.nameEn} className="w-full bg-white border-2 border-slate-100 rounded-[1.2rem] px-6 py-4 text-xs font-black focus:border-indigo-300 outline-none transition-all shadow-inner" placeholder="e.g. Kidney Function" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'نوع العينة' : 'SAMPLE'}</label>
                            <select defaultValue={editingTest?.sampleTypeEn} className="w-full bg-white border-2 border-slate-100 rounded-[1.2rem] px-6 py-4 text-[11px] font-black outline-none transition-all appearance-none cursor-pointer">
                                <option value="Blood">Blood / دم</option>
                                <option value="Urine">Urine / بول</option>
                                <option value="Stool">Stool / براز</option>
                                <option value="CSF">CSF / سائل شوكي</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'التصنيف' : 'AREA'}</label>
                            <input defaultValue={editingTest?.categoryEn} className="w-full bg-white border-2 border-slate-100 rounded-[1.2rem] px-6 py-4 text-[11px] font-black outline-none transition-all" placeholder="Biochemistry" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'الهدف الإكلينيكي' : 'OBJECTIVE'}</label>
                        <textarea defaultValue={editingTest?.aimEn} rows={2} className="w-full bg-white border-2 border-slate-100 rounded-[1.2rem] px-6 py-4 text-[11px] font-black outline-none transition-all shadow-inner resize-none" placeholder="Clinical purpose..."></textarea>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{isAr ? 'التكلفة بالعملة (SDG)' : 'STANDARD FEE'}</label>
                        <div className="relative group">
                           <DollarSign size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400" />
                           <input type="number" defaultValue={editingTest?.cost} className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] pl-14 pr-6 py-5 text-xl font-black text-indigo-700 outline-none transition-all shadow-inner" />
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                     <button onClick={() => setShowTestModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'إلغاء' : 'Abort'}</button>
                     <button className="flex-[2] bg-slate-900 text-white rounded-[1.2rem] py-4 text-[10px] font-black shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
                        <Save size={18} />
                        {isAr ? 'حفظ' : 'Commit'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
    );
};

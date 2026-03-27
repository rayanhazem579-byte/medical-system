import React, { useState } from 'react';
import { SuppliersPage, Supplier } from './SuppliersPage';
import { 
  Package, Truck, Banknote, ShoppingCart, 
  Settings2, BarChart3, Plus, Search, 
  AlertTriangle, CheckCircle2, History,
  TrendingUp, TrendingDown, Layers, Globe, Bell, Pill, MoreVertical, Edit3, Trash2, LayoutDashboard, Database,
  FileText, UserPlus, ClipboardList, Send, Beaker, Calendar, UserCheck, X, Share2, Activity
} from 'lucide-react';

/* ───────── Types ───────── */
export interface Medicine {
  id: number;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  stock: number;
  minStock: number;
  price: number; 
  purchasePrice?: number;
  expiryDate: string;
  status: 'available' | 'low' | 'out';
  image_url?: string;
  barcode?: string;
  batchNumber?: string;
  shapeAr?: string;
  shapeEn?: string;
}

interface DosageForm {
    id: number;
    ar: string;
    en: string;
    sizes: string[]; // e.g. ["500mg", "1000mg"]
}

interface PharmacyManagementProps {
  isAr: boolean;
  medicines: Medicine[];
  prescriptions?: any[];
  transactions?: any[];
  onToggleLang?: () => void;
  onAddMedicine: (med: any) => Promise<void>;
  onUpdateMedicine: (med: any) => Promise<void>;
  onDeleteMedicine: (id: number) => Promise<void>;
  onUpdateStock: (id: number, qty: number) => void;
  notifications?: any[];
}

const ManagementStat: React.FC<any> = ({ isAr, titleAr, titleEn, value, trend, icon, color }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative border-b-4 border-b-transparent hover:border-b-emerald-500">
     <div className="flex items-center justify-between relative z-10">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 shadow-inner`}>
           {icon && React.cloneElement(icon as React.ReactElement<any>, { className: color.replace('bg-', 'text-') })}
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? titleAr : titleEn}</p>
           <h3 className="text-2xl font-black text-gray-800 tracking-tight">{value}</h3>
           {trend && <span className={`text-[10px] font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>}
        </div>
     </div>
     <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
  </div>
);

export const PharmacyManagementPage: React.FC<PharmacyManagementProps> = ({
  isAr, medicines, prescriptions: initialPrescriptions = [], transactions = [], 
  onToggleLang, onAddMedicine, onUpdateMedicine, onDeleteMedicine, onUpdateStock, notifications = []
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales' | 'alerts' | 'purchases' | 'shapes' | 'suppliers'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showShapeModal, setShowShapeModal] = useState(false);
    const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
    const [dosageForms, setDosageForms] = useState<DosageForm[]>([
        { id: 1, ar: 'أقراص', en: 'Tablets', sizes: ['500mg', '1000mg', '250mg'] },
        { id: 2, ar: 'كبسولات', en: 'Capsules', sizes: ['500mg', '250mg'] },
        { id: 3, ar: 'شراب', en: 'Syrup', sizes: ['120mg/5ml', '250mg/5ml', '100ml'] },
        { id: 4, ar: 'حقن', en: 'Injection', sizes: ['1g', '500mg', 'Vial', 'Ampoule'] },
        { id: 5, ar: 'مرهم', en: 'Ointment', sizes: ['20g', '50g'] },
    ]);
    const [editingShape, setEditingShape] = useState<DosageForm | null>(null);
    const [newShape, setNewShape] = useState({ ar: '', en: '', sizes: '' });
    const [showAlertSettingModal, setShowAlertSettingModal] = useState(false);
    const [minStockGlobal, setMinStockGlobal] = useState(10);
    const [expiryThresholdMonths, setExpiryThresholdMonths] = useState(3);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestData, setRequestData] = useState({ supplierId: '', medicineId: '', quantity: 1, notes: '' });

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/pharmacy-suppliers', {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data.data);
            }
        } catch (err) { console.error("Failed to fetch suppliers:", err); }
    };

    React.useEffect(() => {
        if (activeTab === 'purchases' || activeTab === 'suppliers') {
            fetchSuppliers();
        }
    }, [activeTab]);

    const tabs = [
      { id: 'overview', nameAr: 'نظرة عامة', nameEn: 'Intel', icon: LayoutDashboard },
      { id: 'inventory', nameAr: 'المخزن', nameEn: 'Inventory', icon: Package },
      { id: 'sales', nameAr: 'المبيعات', nameEn: 'Sales', icon: History },
      { id: 'alerts', nameAr: 'التنبيهات', nameEn: 'Alerts', icon: AlertTriangle },
      { id: 'purchases', nameAr: 'المشتريات', nameEn: 'Purchases', icon: Truck },
      { id: 'shapes', nameAr: 'الأشكال', nameEn: 'Forms', icon: Layers },
      { id: 'suppliers', nameAr: 'إدارة الموردين', nameEn: 'Suppliers', icon: UserCheck },
    ];

    const [newMed, setNewMed] = useState<any>({
        nameAr: '', nameEn: '', categoryAr: 'Medicine', categoryEn: 'Medicine',
        stock: 0, minStock: 10, price: 0, purchasePrice: 0,
        expiryDate: '', barcode: '', shapeAr: '', shapeEn: 'Tablets', strength: '',
        scientificNameAr: '', scientificNameEn: '',
        manufacturerAr: '', manufacturerEn: '',
        batchNumber: '', supplierName: '', location: '',
        isRefrigerated: false, isFastMoving: false
    });
    const [isEditing, setIsEditing] = useState(false);

    const resetNewMed = () => {
        setNewMed({
            nameAr: '', nameEn: '', categoryAr: 'Medicine', categoryEn: 'Medicine',
            stock: 0, minStock: 10, price: 0, purchasePrice: 0,
            expiryDate: '', barcode: '', shapeAr: '', shapeEn: 'Tablets', strength: '',
            scientificNameAr: '', scientificNameEn: '',
            manufacturerAr: '', manufacturerEn: '',
            batchNumber: '', supplierName: '', location: '',
            isRefrigerated: false, isFastMoving: false
        });
        setIsEditing(false);
    };

    const handleEditClick = (m: Medicine) => {
        setNewMed({
            id: m.id,
            nameAr: m.nameAr,
            nameEn: m.nameEn,
            categoryAr: m.categoryAr,
            categoryEn: m.categoryEn,
            stock: m.stock,
            minStock: m.minStock,
            price: m.price,
            purchasePrice: m.purchasePrice || 0,
            expiryDate: m.expiryDate || '',
            barcode: m.barcode || '',
            shapeAr: m.shapeAr || '',
            shapeEn: m.shapeEn || 'Tablets',
            strength: (m as any).concentration || '',
            scientificNameAr: (m as any).scientificNameAr || '',
            scientificNameEn: (m as any).scientificNameEn || '',
            manufacturerAr: (m as any).manufacturerAr || '',
            manufacturerEn: (m as any).manufacturerEn || '',
            batchNumber: m.batchNumber || '',
            supplierName: (m as any).supplierName || '',
            location: (m as any).location || '',
            isRefrigerated: (m as any).isRefrigerated || false,
            isFastMoving: (m as any).isFastMoving || false
        });
        setIsEditing(true);
        setShowAddModal(true);
    };

    const handleDeletePrescription = (id: number) => {
        if (confirm(isAr ? 'هل أنت متأكد من حذف هذه الوصفة؟' : 'Are you sure you want to delete this prescription?')) {
            setPrescriptions(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleAddOrUpdateShape = () => {
        if (!newShape.ar || !newShape.en) return;
        const processedSizes = newShape.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
        
        if (editingShape) {
            setDosageForms(prev => prev.map(s => s.id === editingShape.id ? { ...s, ar: newShape.ar, en: newShape.en, sizes: processedSizes } : s));
        } else {
            setDosageForms(prev => [...prev, { id: Date.now(), ar: newShape.ar, en: newShape.en, sizes: processedSizes }]);
        }
        
        setNewShape({ ar: '', en: '', sizes: '' });
        setEditingShape(null);
        setShowShapeModal(false);
    };

    const handleDeleteShape = (id: number) => {
        if (confirm(isAr ? 'حذف هذا الشكل الدوائي نهائياً؟' : 'Permanent remove this dosage form?')) {
            setDosageForms(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-cairo">
         {/* Internal Navigation Header */}
         <div className="bg-[#0f172a] rounded-[2.5rem] p-4 shadow-2xl border-b-4 border-emerald-500 flex flex-col xl:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex items-center gap-6 relative z-10 transition-transform hover:scale-[1.02]">
               <div className="w-14 h-14 bg-emerald-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-emerald-500/20 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Settings2 size={28} />
               </div>
               <div>
                  <h1 className="text-xl font-black text-white tracking-tight">{isAr ? 'إدارة العمليات الصيدلانية' : 'Pharmacy Core Intelligence'}</h1>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{isAr ? 'التحكم المركزي في المخزون والمبيعات' : 'CENTRAL STOCK & REVENUE CONTROL'}</p>
               </div>
            </div>

            <div className="flex flex-wrap justify-center bg-white/5 backdrop-blur-md p-1.5 rounded-2xl relative z-10 border border-white/10 shadow-inner">
               {tabs.map(tab => (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                     <tab.icon size={14} />
                     {isAr ? tab.nameAr : tab.nameEn}
                  </button>
               ))}
            </div>
             {/* Controls removed as requested */}
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ManagementStat isAr={isAr} titleAr="القيمة الإجمالية" titleEn="Gross Value" value="1.4M SDG" trend={8.4} icon={<Banknote />} color="bg-emerald-500" />
            <ManagementStat isAr={isAr} titleAr="أصناف المخزن" titleEn="Store Items" value={medicines.length} trend={2.1} icon={<Layers />} color="bg-blue-500" />
            <ManagementStat isAr={isAr} titleAr="طلبات الموردين" titleEn="Supply Orders" value="12" trend={-4.5} icon={<Truck />} color="bg-amber-500" />
         </div>

         {/* Content Area */}
         <div className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm min-h-[600px] overflow-hidden group">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner group-hover:rotate-12 transition-transform">
                     {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { size: 28 })}
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-gray-800 tracking-tight">{isAr ? tabs.find(t => t.id === activeTab)?.nameAr : tabs.find(t => t.id === activeTab)?.nameEn}</h2>
                     <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-[0.3em]">{isAr ? 'الدقة في المراجعة والتحكم' : `PRECISION ${activeTab.toUpperCase()} PROTOCOL`}</p>
                  </div>
               </div>

               <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-80 group/search">
                     <Search className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-emerald-500 transition-colors`} size={20} />
                     <input 
                       type="text" 
                       placeholder={isAr ? 'بحث سريع...' : 'Quick search...'}
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                       className={`w-full bg-gray-50 border-2 border-transparent focus:border-emerald-100 rounded-[1.2rem] ${isAr ? 'pr-14' : 'pl-14'} py-4 text-xs font-bold outline-none transition-all shadow-inner placeholder:text-slate-300`}
                     />
                  </div>
                  {activeTab === 'inventory' && (
                     <button onClick={() => { resetNewMed(); setShowAddModal(true); }} className="flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-[1.2rem] text-[11px] font-black shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.02] transition-all uppercase tracking-widest">
                        <Plus size={18} />
                        {isAr ? 'إضافة دواء' : 'Add Medicine'}
                     </button>
                  )}
                  {activeTab === 'shapes' && (
                     <button onClick={() => { setEditingShape(null); setNewShape({ ar: '', en: '', sizes: '' }); setShowShapeModal(true); }} className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-[1.2rem] text-[11px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] transition-all uppercase tracking-widest">
                        <Plus size={18} />
                        {isAr ? 'إضافة شكل جديد' : 'New Dosage Form'}
                     </button>
                  )}
                  {activeTab === 'alerts' && (
                     <button onClick={() => setShowAlertSettingModal(true)} className="flex items-center gap-3 bg-rose-500 text-white px-8 py-4 rounded-[1.2rem] text-[11px] font-black shadow-xl shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] transition-all uppercase tracking-widest">
                        <Settings2 size={18} />
                        {isAr ? 'إعدادات التنبيهات' : 'Alert Settings'}
                     </button>
                  )}
               </div>
            </div>

            {/* Tab-Specific Views */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="space-y-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100 font-cairo">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <AlertTriangle className="text-rose-500" size={20} />
                              <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase">{isAr ? 'تنبيهات المخزون الحساسة' : 'CRITICAL STOCK ALERT'}</h4>
                           </div>
                           <span className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm">{medicines.filter(m => m.stock <= m.minStock).length}</span>
                        </div>
                        <div className="space-y-4">
                           {medicines.filter(m => m.stock <= m.minStock).slice(0, 5).map(m => (
                              <div key={m.id} className="bg-white p-5 rounded-[1.5rem] flex items-center justify-between border border-gray-100 hover:border-rose-100 hover:shadow-lg transition-all group/item">
                                 <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-rose-50 text-rose-500 rounded-[1rem] flex items-center justify-center border border-rose-100 transition-transform group-hover/item:rotate-6"><AlertTriangle size={20} /></div>
                                    <div>
                                       <p className="text-xs font-black text-gray-800">{isAr ? m.nameAr : m.nameEn}</p>
                                       <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">{isAr ? 'الكمية' : 'STOCK'}: {m.stock} Units</p>
                                    </div>
                                 </div>
                                 <button className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">{isAr ? 'طلب مورد' : 'ORDER'}</button>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-[#0f172a] p-10 rounded-[3rem] text-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] relative overflow-hidden group/card flex flex-col justify-between min-h-[350px]">
                           <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 opacity-[0.03] rounded-full -mr-40 -mt-40 blur-3xl"></div>
                           <div className="relative z-10">
                              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md group-hover/card:scale-110 transition-transform flex items-center justify-center text-emerald-400"><TrendingUp size={24} /></div>
                              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 opacity-60">{isAr ? 'ذكاء المبيعات الرقمي' : 'SALES INTELLIGENCE'}</h4>
                              <h3 className="text-3xl font-black mb-6 leading-tight max-w-xs">{isAr ? 'تحليل مسار المبيعات والنمو الصيدلاني' : 'Digital Pathway Growth Analysis'}</h3>
                           </div>
                           <BarChart3 className="absolute right-[-10%] bottom-[-10%] w-64 h-64 text-emerald-500 opacity-5 group-hover/card:scale-125 transition-transform duration-[2000ms]" />
                           <button className="relative z-10 w-fit bg-emerald-500 text-white px-8 py-3 rounded-[1rem] text-[10px] font-black transition-all hover:bg-emerald-600 uppercase tracking-[0.2em] shadow-2xl">{isAr ? 'تحميل التقرير الكامل' : 'EXPORT FULL STATS'}</button>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'inventory' && (
                  <div className="overflow-x-auto rounded-[2.5rem] border-2 border-slate-50 shadow-inner bg-white">
                     <table className="w-full text-right font-cairo">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الهوية والمنتج' : 'PRODUCT IDENTITY'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'مستوى المخزن' : 'STOCK FLOW'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'التكلفة / البيع' : 'PRICING'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الحالة التشغيلية' : 'OPERATIONAL STATUS'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الإجراءات' : 'CONTROL'}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {medicines.map(m => (
                              <tr key={m.id} className="hover:bg-slate-50/50 transition-all group/row">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 bg-white text-slate-300 rounded-2xl flex items-center justify-center group-hover/row:bg-emerald-500 group-hover/row:text-white transition-all shadow-sm border border-slate-100 group-hover/row:rotate-6 shadow-inner overflow-hidden">
                                          {m.image_url ? (
                                             <img src={m.image_url} alt={m.nameEn} className="w-full h-full object-cover" />
                                          ) : (
                                             <Pill size={22} />
                                          )}
                                       </div>
                                       <div>
                                          <p className="text-sm font-black text-slate-800 tracking-tight">{isAr ? m.nameAr : m.nameEn}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{m.categoryEn} • {m.shapeEn || 'Generic'}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden shadow-inner">
                                          <div className={`h-full ${m.stock > m.minStock ? 'bg-emerald-400' : 'bg-rose-400'} shadow-[0_0_10px_rgba(52,211,153,0.5)]`} style={{ width: `${Math.min((m.stock / (m.minStock * 3)) * 100, 100)}%` }}></div>
                                       </div>
                                       <span className="text-xs font-black text-slate-600">{m.stock} Units</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-emerald-600">{m.price} <small className="text-[9px] opacity-70 italic">SDG</small></span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-sm transition-transform group-hover/row:scale-105 ${
                                       m.stock <= 0 ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                       m.stock <= m.minStock ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                       'bg-emerald-50 text-emerald-500 border-emerald-100'
                                    }`}>
                                       {isAr ? (m.stock <= 0 ? 'نفذ' : m.stock <= m.minStock ? 'منخفض الكفاءة' : 'متوفر') : (m.stock <= 0 ? 'Depleted' : m.stock <= m.minStock ? 'Low Stock' : 'Optimized')}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6 text-left font-sans">
                                    <div className="flex items-center gap-2 lg:opacity-0 group-hover/row:opacity-100 transition-all justify-end">
                                       <button onClick={() => handleEditClick(m)} className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                                       <button onClick={() => onDeleteMedicine(m.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}



               {activeTab === 'shapes' && (
                  <div className="overflow-x-auto rounded-[2.5rem] border-2 border-slate-50 shadow-inner bg-white">
                     <table className="w-full text-right font-cairo">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الشكل الدوائي' : 'DOSAGE FORMAT'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الأحجام والتراكيز' : 'SIZES & STRENGTHS'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{isAr ? 'الحالة' : 'STATUS'}</th>
                              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-left">{isAr ? 'تحكم' : 'ACTION'}</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {dosageForms.map(s => (
                              <tr key={s.id} className="hover:bg-slate-50 transition-all group/row">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 bg-white text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner border border-slate-100 group-hover/row:scale-110 transition-transform"><Layers size={22} /></div>
                                       <div>
                                          <p className="text-sm font-black text-slate-800">{isAr ? s.ar : s.en}</p>
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Dosage Form Registry</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex flex-wrap gap-2">
                                       {s.sizes.map((sz, idx) => (
                                          <span key={idx} className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-black border border-slate-200 transition-colors hover:bg-emerald-500 hover:text-white lowercase">{sz}</span>
                                       ))}
                                       {s.sizes.length === 0 && <span className="text-[10px] text-slate-300 font-bold italic">{isAr ? 'لا توجد أحجام' : 'No sizes defined'}</span>}
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="flex items-center gap-2">
                                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                       <span className="text-[10px] font-black text-slate-400 uppercase">{isAr ? 'نشط' : 'Active'}</span>
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 justify-end">
                                       <button onClick={() => { setEditingShape(s); setNewShape({ ar: s.ar, en: s.en, sizes: s.sizes.join(', ') }); setShowShapeModal(true); }} className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={16} /></button>
                                       <button onClick={() => handleDeleteShape(s.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}

               {activeTab === 'alerts' && (
                  <div className="space-y-6 font-cairo">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Low Stock Alerts */}
                        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 shadow-inner">
                           <h3 className="text-xl font-black text-amber-800 tracking-tight flex items-center gap-3 mb-6">
                              <AlertTriangle size={24} className="text-amber-500" />
                              {isAr ? 'أدوية قريبة من النفاذ' : 'Low Stock Items'}
                           </h3>
                           <div className="space-y-4">
                              {medicines.filter(m => m.stock <= minStockGlobal).map(m => (
                                 <div key={'stk-'+m.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-amber-50 shadow-sm">
                                    <div>
                                       <p className="text-sm font-black text-slate-800">{isAr ? m.nameAr : m.nameEn}</p>
                                       <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">الكمية المتوفرة: {m.stock}</p>
                                    </div>
                                    <span className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm">الحد ({minStockGlobal})</span>
                                 </div>
                              ))}
                              {medicines.filter(m => m.stock <= minStockGlobal).length === 0 && (
                                 <p className="text-center text-xs font-bold text-amber-500/50 py-4">{isAr ? 'ليس هنالك أي نقص' : 'Stocks are healthy'}</p>
                              )}
                           </div>
                        </div>

                        {/* Expiry Alerts */}
                        <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 shadow-inner">
                           <h3 className="text-xl font-black text-rose-800 tracking-tight flex items-center gap-3 mb-6">
                              <Bell size={24} className="text-rose-500" />
                              {isAr ? 'أدوية قريبة الانتهاء' : 'Expiring Soon'}
                           </h3>
                           <div className="space-y-4">
                              {medicines.filter(m => {
                                 if(!m.expiryDate) return false;
                                 const exp = new Date(m.expiryDate);
                                 const now = new Date();
                                 const diffMonths = (exp.getFullYear() - now.getFullYear()) * 12 + (exp.getMonth() - now.getMonth());
                                 return diffMonths <= expiryThresholdMonths;
                              }).map(m => (
                                 <div key={'exp-'+m.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-rose-50 shadow-sm">
                                    <div>
                                       <p className="text-sm font-black text-slate-800">{isAr ? m.nameAr : m.nameEn}</p>
                                       <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">{m.expiryDate}</p>
                                    </div>
                                    <span className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm">{isAr ? 'قريب الانتهاء' : 'Expiring'}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}
                {activeTab === 'purchases' && (
                   <div className="font-cairo space-y-8 animate-in fade-in duration-500">
                      <div className="flex items-center justify-between mb-8 overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-10 text-white shadow-2xl relative">
                         <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500 opacity-5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                         <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{isAr ? 'إدارة المشتريات والطلبات' : 'Supply Chain Intel'}</h3>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em]">{isAr ? 'تتبع طلبات المواد والأدوية من الموردين' : 'PROCUREMENT & REPLENISHMENT PROTOCOL'}</p>
                         </div>
                         <button 
                            onClick={() => setShowRequestModal(true)}
                            className="relative z-10 flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-[1.2rem] text-[11px] font-black shadow-xl shadow-emerald-900/20 hover:bg-emerald-600 hover:scale-[1.05] transition-all uppercase tracking-widest"
                         >
                            <Plus size={18} />
                            {isAr ? 'طلب من مورد' : 'Request from Supplier'}
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {/* Active Requisition Card 1 (Mock) */}
                         <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-700/5 relative overflow-hidden group/order">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] rounded-full -mr-12 -mt-12 blur-2xl group-hover/order:scale-150 transition-transform"></div>
                            <div className="flex items-center justify-between mb-6">
                               <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl border border-emerald-100"><Truck size={20} /></div>
                               <span className="bg-amber-100 text-amber-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{isAr ? 'قيد المعالجة' : 'Pending'}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mb-1">{isAr ? 'شركة الحكمة للأدوية' : 'Hikma Pharma'}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">REQ-99201 • 30 Nov 2024</p>
                            
                            <div className="space-y-3 mb-6">
                               <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                  <span>{isAr ? 'باندول إكسترا 500' : 'Panadol Extra'}</span>
                                  <span>x100</span>
                               </div>
                               <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                  <span>{isAr ? 'أموكسيسيلين 250' : 'Amoxicillin'}</span>
                                  <span>x50</span>
                               </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                               <span className="text-xs font-black text-emerald-600">84,000 SDG</span>
                               <button className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{isAr ? 'عرض التفاصيل' : 'Details'}</button>
                            </div>
                         </div>

                         {/* Completed Card (Mock) */}
                         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group/order opacity-80 hover:opacity-100 transition-all">
                            <div className="flex items-center justify-between mb-6">
                               <div className="p-3 bg-slate-50 text-slate-400 rounded-xl"><History size={20} /></div>
                               <span className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">{isAr ? 'تم الاستلام' : 'Delivered'}</span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mb-1">{isAr ? 'مجموعة صيدليات المنهل' : 'Al Manhal Group'}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">REQ-99188 • 25 Nov 2024</p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                               <span className="text-xs font-black text-slate-400">120,500 SDG</span>
                               <CheckCircle2 className="text-emerald-500" size={16} />
                            </div>
                         </div>

                         <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/10 transition-all" onClick={() => setShowRequestModal(true)}>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-emerald-500 transition-colors mb-4"><Plus size={24} /></div>
                            <h4 className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 uppercase tracking-[0.2em]">{isAr ? 'إنشاء طلب إمداد جديد' : 'PROMPT NEW REQUISITION'}</h4>
                         </div>
                      </div>
                   </div>
                )}

               {activeTab === 'suppliers' && (
                  <div className="bg-white rounded-[2.5rem] p-1 animate-in fade-in duration-500 min-h-[500px]">
                     <SuppliersPage isAr={isAr} tx={{}} />
                  </div>
               )}
            </div>
         </div>

         {/* MODAL: Request from Supplier */}
         {showRequestModal && (
             <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-3xl p-6">
                 <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100 font-cairo">
                     <div className="p-6 border-b-2 border-emerald-100 flex items-center justify-between bg-[#0f172a] text-white shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-emerald-500 border border-emerald-400 rounded-xl flex items-center justify-center shadow-lg"><Truck size={20} /></div>
                            <div>
                               <h3 className="text-lg font-black tracking-tight uppercase">{isAr ? 'طلب شراء جديد' : 'Requisition'}</h3>
                               <p className="text-[8px] text-emerald-400 font-bold tracking-[0.2em] uppercase">{isAr ? 'تأمين المخزون' : 'RESTOCK'}</p>
                            </div>
                         </div>
                         <button onClick={() => setShowRequestModal(false)} className="w-8 h-8 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all border border-white/10"><X size={18} /></button>
                     </div>
                     <div className="p-6 space-y-5 bg-slate-50/20">
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <UserCheck size={14} className="text-emerald-500" />
                                {isAr ? 'المورد المختار' : 'SELECT SUPPLIER'}
                             </label>
                             <select 
                                value={requestData.supplierId} 
                                onChange={e => setRequestData({...requestData, supplierId: e.target.value})}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner cursor-pointer appearance-none"
                             >
                                <option value="">{isAr ? '-- اختر مورد معتمد --' : '-- Select Vendor --'}</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.supplier_id})</option>)}
                             </select>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <Package size={14} className="text-emerald-500" />
                                {isAr ? 'الصنف الدوائي المطلوب' : 'TARGET MEDICINE'}
                             </label>
                             <select 
                                value={requestData.medicineId} 
                                onChange={e => setRequestData({...requestData, medicineId: e.target.value})}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner cursor-pointer appearance-none"
                             >
                                <option value="">{isAr ? '-- اختر الدواء من قائمة المخزن --' : '-- Select Item --'}</option>
                                {medicines.map(m => <option key={m.id} value={m.id}>{isAr ? m.nameAr : m.nameEn} - ({m.barcode})</option>)}
                             </select>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" />
                                {isAr ? 'الكمية المطلوبة (وحدة)' : 'ORDER QUANTITY'}
                             </label>
                             <input 
                                type="number" 
                                value={requestData.quantity} 
                                onChange={e => setRequestData({...requestData, quantity: Number(e.target.value)})}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner"
                                min="1"
                             />
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'ملاحظات إضافية' : 'PROCUREMENT NOTES'}</label>
                             <textarea 
                                value={requestData.notes} 
                                onChange={e => setRequestData({...requestData, notes: e.target.value})}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner resize-none min-h-[60px]"
                                placeholder={isAr ? 'أضف أي تفاصيل خاصة بالطلب...' : 'Enter requisition details...'}
                             />
                         </div>
                     </div>
                     <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 shadow-inner">
                         <button onClick={() => setShowRequestModal(false)} className="flex-1 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">{isAr ? 'إلغاء' : 'Abort'}</button>
                         <button 
                            onClick={async () => {
                               alert(isAr ? 'جاري إرسال الطلب للمورد...' : 'Transmitting requisition to vendor...');
                               setShowRequestModal(false);
                            }}
                            className="flex-[2] bg-emerald-600 text-white rounded-[1rem] py-3.5 text-[10px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                         >
                            <CheckCircle2 size={16} />
                            {isAr ? 'إرسال طلب الشراء' : 'Transmit Requisition'}
                         </button>
                     </div>
                 </div>
             </div>
         )}

         {showAlertSettingModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100 font-cairo">
                    <div className="p-6 border-b-2 border-rose-100 flex items-center justify-between bg-[#0f172a] text-white shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-10 h-10 bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-500 shadow-inner"><Settings2 size={22} /></div>
                           <div>
                              <h3 className="text-lg font-black tracking-tight uppercase">{isAr ? 'إعدادات التنبيهات' : 'Alert Configuration'}</h3>
                              <p className="text-[9px] text-rose-400 font-bold tracking-[0.3em] uppercase">{isAr ? 'تخصيص مؤشرات النواقص والصلاحية' : 'Threshold Customizations'}</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAlertSettingModal(false)} className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"><X size={20} /></button>
                    </div>
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block">{isAr ? 'أقل كمية للدواء (حد النواقص)' : 'MINIMUM STOCK THRESHOLD'}</label>
                            <div className="relative">
                               <input type="number" value={minStockGlobal} onChange={e => setMinStockGlobal(Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-rose-300 outline-none transition-all shadow-inner" min="1" />
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-bold uppercase tracking-widest">Units</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 block">{isAr ? 'التنبيه قبل الانتهاء بـ' : 'EXPIRY ALERT THRESHOLD'}</label>
                            <select value={expiryThresholdMonths} onChange={e => setExpiryThresholdMonths(Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-rose-300 outline-none transition-all shadow-inner appearance-none cursor-pointer">
                               <option value={1}>{isAr ? 'شهر واحد' : '1 Month'}</option>
                               <option value={2}>{isAr ? 'شهران' : '2 Months'}</option>
                               <option value={3}>{isAr ? 'ثلاثة أشهر' : '3 Months'}</option>
                               <option value={4}>{isAr ? 'أربعة أشهر' : '4 Months'}</option>
                               <option value={6}>{isAr ? 'ستة أشهر' : '6 Months'}</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shadow-inner">
                        <button onClick={() => setShowAlertSettingModal(false)} className="flex-[2] bg-[#0f172a] hover:bg-black text-white rounded-xl py-4 text-[10px] font-black shadow-xl shadow-slate-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                           <CheckCircle2 size={16} />
                           {isAr ? 'حفظ التنبيهات' : 'Save Config'}
                        </button>
                    </div>
                </div>
            </div>
         )}

         {/* MODAL: New/Edit Shape */}
         {showShapeModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100">
                    <div className="p-6 border-b-2 border-emerald-100 flex items-center justify-between bg-emerald-600 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner"><Layers size={22} /></div>
                           <div>
                              <h3 className="text-lg font-black tracking-tight uppercase">{editingShape ? (isAr ? 'تحديث الشكل' : 'Update Shape') : (isAr ? 'شكل دوائي جديد' : 'New Dosage Form')}</h3>
                              <p className="text-[9px] text-emerald-100 font-bold tracking-[0.3em] uppercase">{isAr ? 'توسيع خيارات الأحجام والتراكيز' : 'EXPAND SIZES & STRENGTHS'}</p>
                           </div>
                        </div>
                        <button onClick={() => setShowShapeModal(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><X size={20} /></button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الاسم بالعربية' : 'NAME ARABIC'}</label>
                               <input value={newShape.ar} onChange={e => setNewShape({...newShape, ar: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3.5 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="مثال: بخاخ..." />
                           </div>
                           <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الاسم بالإنجليزية' : 'NAME ENGLISH'}</label>
                               <input value={newShape.en} onChange={e => setNewShape({...newShape, en: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-3.5 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="Ex: Spray..." />
                           </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الأحجام والتراكيز (مفصولة بفواصل)' : 'SIZES & STRENGTHS (COMMA SEPARATED)'}</label>
                            <textarea value={newShape.sizes} onChange={e => setNewShape({...newShape, sizes: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-xs font-black focus:border-emerald-200 outline-none transition-all shadow-inner resize-none" rows={4} placeholder="500mg, 1000mg, 5ml, Vial..." />
                            <p className="text-[8px] text-slate-300 font-bold italic lowercase pl-2">* separate each size with a comma (e.g. 500mg, 5ml, vial)</p>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shadow-inner">
                        <button onClick={() => setShowShapeModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'إلغاء' : 'Abort'}</button>
                        <button onClick={handleAddOrUpdateShape} className="flex-[2] bg-emerald-600 text-white rounded-xl py-4 text-[10px] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                           <CheckCircle2 size={16} />
                           {editingShape ? (isAr ? 'تحديث البيانات' : 'Update Shape') : (isAr ? 'تأكيد وحفظ' : 'Confirm & Save')}
                        </button>
                    </div>
                </div>
            </div>
         )}

         {/* ADD MEDICINE MODAL */}
         {showAddModal && (
             <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/80 backdrop-blur-3xl p-6">
                 <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100">
                    <div className="p-8 border-b-2 border-emerald-200 flex items-center justify-between bg-emerald-500 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-6 relative z-10 transition-transform hover:scale-[1.02]">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md shadow-inner transform -rotate-3 transition-transform hover:rotate-0">
                                {isEditing ? <Edit3 size={32} /> : <Plus size={32} />}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">{isEditing ? (isAr ? 'تعديل بيانات الدواء' : 'Edit Medicine Details') : (isAr ? 'إضافة دواء للمستودع' : 'New Inventory Entry')}</h3>
                                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-[0.3em]">{isAr ? 'تحديث أو تسجيل صنف دوائي لمخازن المؤسسة' : 'PRECISION STOCK CATALOGING PROTOCOL'}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10"><X size={26} /></button>
                    </div>

                    <div className="p-10 space-y-8 flex-1 overflow-y-auto max-h-[70vh] bg-slate-50/20">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'اسم الدواء (AR)' : 'MEDICINE NAME (AR)'}</label>
                                <input value={newMed.nameAr} onChange={e => setNewMed({...newMed, nameAr: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="باندول إكسترا..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'اسم الدواء (EN)' : 'MEDICINE NAME (EN)'}</label>
                                <input value={newMed.nameEn} onChange={e => setNewMed({...newMed, nameEn: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="Panadol Extra..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الشكل الدوائي' : 'DOSAGE FORM'}</label>
                                <select value={newMed.shapeEn} onChange={e => setNewMed({...newMed, shapeEn: e.target.value, shapeAr: dosageForms.find(s => s.en === e.target.value)?.ar || ''})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all appearance-none cursor-pointer shadow-inner">
                                    <option value="">{isAr ? '-- اختر الشكل --' : '-- Select Form --'}</option>
                                    {dosageForms.map((s) => <option key={s.id} value={s.en}>{isAr ? s.ar : s.en}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'التركيز / الحجم المطلوب' : 'TARGET STRENGTH / SIZE'}</label>
                                <select value={newMed.strength} onChange={e => setNewMed({...newMed, strength: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all appearance-none cursor-pointer shadow-inner disabled:opacity-50" disabled={!newMed.shapeEn}>
                                    <option value="">{isAr ? '-- اختر التركيز --' : '-- Select Strength --'}</option>
                                    {dosageForms.find(s => s.en === newMed.shapeEn)?.sizes.map((sz, i) => (
                                       <option key={i} value={sz}>{sz}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'القسم / الفئة' : 'CATEGORY'}</label>
                                <input value={newMed.categoryAr} onChange={e => setNewMed({...newMed, categoryAr: e.target.value, categoryEn: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder={isAr ? 'أدوية...' : 'Medicine...'} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'كود الباركود' : 'SKU / BARCODE'}</label>
                                <input value={newMed.barcode} onChange={e => setNewMed({...newMed, barcode: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner font-sans" placeholder="729000..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'رقم التشغيلة' : 'BATCH NO.'}</label>
                                <input value={newMed.batchNumber} onChange={e => setNewMed({...newMed, batchNumber: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner font-sans" placeholder="B-2024..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'تاريخ الانتهاء' : 'EXPIRY'}</label>
                                <input type="date" value={newMed.expiryDate} onChange={e => setNewMed({...newMed, expiryDate: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الاسم العلمي' : 'SCIENTIFIC NAME'}</label>
                                <input value={newMed.scientificNameAr} onChange={e => setNewMed({...newMed, scientificNameAr: e.target.value, scientificNameEn: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="Paracetamol..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'المصنع' : 'MANUFACTURER'}</label>
                                <input value={newMed.manufacturerAr} onChange={e => setNewMed({...newMed, manufacturerAr: e.target.value, manufacturerEn: e.target.value})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" placeholder="PFIZER..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'سعر الشراء' : 'BUY PRICE'}</label>
                                <input type="number" value={newMed.purchasePrice} onChange={e => setNewMed({...newMed, purchasePrice: Number(e.target.value)})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all text-slate-600 shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'سعر البيع' : 'SELL PRICE'}</label>
                                <input type="number" value={newMed.price} onChange={e => setNewMed({...newMed, price: Number(e.target.value)})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all text-emerald-600 shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الكمية' : 'STOCK'}</label>
                                <input type="number" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: Number(e.target.value)})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'الحد الأدنى' : 'MIN. STOCK'}</label>
                                <input type="number" value={newMed.minStock} onChange={e => setNewMed({...newMed, minStock: Number(e.target.value)})} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black focus:border-emerald-200 outline-none transition-all shadow-inner" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{isAr ? 'صورة المنتج' : 'PRODUCT IMAGE'}</label>
                            <div className="relative group/img h-32 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center transition-all hover:border-emerald-300">
                                <input type="file" onChange={e => setNewMed({...newMed, image: e.target.files?.[0]})} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className="text-center flex flex-col items-center gap-2">
                                   <Plus size={24} className="text-slate-300 group-hover/img:text-emerald-500 transition-colors" />
                                   <p className="text-[9px] font-black text-slate-400 group-hover/img:text-emerald-600 transition-colors uppercase tracking-widest">
                                      {newMed.image ? (newMed.image.name) : (isAr ? 'اسحب الصورة هنا أو اضغط للرفع' : 'DROP IMAGE HERE OR CLICK TO UPLOAD')}
                                   </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shadow-inner">
                        <button onClick={() => setShowAddModal(false)} className="flex-1 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">{isAr ? 'إلغاء' : 'Abort'}</button>
                        <button 
                            onClick={async () => { 
                                if (isEditing) {
                                    await onUpdateMedicine(newMed);
                                } else {
                                    await onAddMedicine(newMed); 
                                }
                                setShowAddModal(false); 
                            }}
                            className="flex-[2] bg-[#0f172a] text-white rounded-[1.5rem] py-5 text-[11px] font-black shadow-2xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em]">
                            <CheckCircle2 size={18} />
                            {isEditing ? (isAr ? 'تحديث البيانات' : 'Update Medicine') : (isAr ? 'حفظ الصنف بالدليل' : 'Save Prescription Item')}
                        </button>
                    </div>
                 </div>
             </div>
         )}
      </div>
    );
};

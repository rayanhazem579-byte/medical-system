import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Pill, AlertTriangle, Package, 
  DollarSign, Edit3, Trash2, X,
  CheckCircle2, Activity, Banknote, Truck, Globe, MessageSquare, RefreshCw, ClipboardList, ShoppingCart, BarChart3, Settings2, Bell, Printer, Clock, LayoutDashboard
} from 'lucide-react';

/* ───────── Types ───────── */
export interface Medicine {
  id: number;
  nameAr: string;
  nameEn: string;
  scientificNameAr?: string;
  scientificNameEn?: string;
  manufacturerAr?: string;
  manufacturerEn?: string;
  categoryAr: string;
  categoryEn: string;
  dosageFormAr?: string;
  dosageFormEn?: string;
  concentration?: string;
  batchNumber?: string;
  barcode?: string;
  location?: string;
  stock: number;
  minStock: number;
  price: number; 
  purchasePrice?: number;
  expiryDate: string;
  supplierName?: string;
  isRefrigerated?: boolean;
  isFastMoving?: boolean;
  status: 'available' | 'low' | 'out';
  image_url?: string;
}

interface PharmacyTransaction {
  id: number;
  medicine_id: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  balance_after: number;
  transaction_date: string;
  supplier_name?: string;
  notes?: string;
  medicine?: Medicine;
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
  price: number;
  dosageForm: string;
  concentration: string;
}

interface PharmacyPageProps {
  isAr: boolean;
  medicines: Medicine[];
  transactions?: PharmacyTransaction[];
  tx: any;
  setIsAddMedicineModalOpen: (open: boolean) => void;
  isAddMedicineModalOpen: boolean;
  newMedicine: any;
  setNewMedicine: (med: any) => void;
  handleAddMedicine: (e: React.FormEvent) => void;
  onUploadImage: (id: number, file: File) => void;
  onDeleteMedicine?: (id: number) => void;
  onEditMedicine?: (med: Medicine) => void;
  prescriptions: any[];
  onDispense: (id: number) => void;
  variant?: 'management' | 'dispensing';
  notifications?: any[];
  onToggleLang?: () => void;
}

const StatCard: React.FC<any> = ({ isAr, titleAr, titleEn, value, icon, iconBg, iconColor, valueColor = 'text-gray-800', gradientFrom, subtitleAr, subtitleEn }) => (
  <div className="glass-card glass-card-hover p-4 rounded-2xl relative overflow-hidden group border border-white/40 shadow-sm transition-all duration-300">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} to-transparent opacity-30`}></div>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">{isAr ? titleAr : titleEn}</p>
    <div className="flex items-center justify-between relative z-10">
       <div className="flex flex-col">
          <span className={`text-xl font-black tracking-tight ${valueColor}`}>{value}</span>
          {(subtitleAr || subtitleEn) && <span className="text-[8px] font-bold text-gray-400 mt-1">{isAr ? subtitleAr : subtitleEn}</span>}
       </div>
       <div className={`p-2 ${iconBg} ${iconColor} rounded-lg group-hover:scale-110 transition-transform duration-300 border border-white/50 shadow-sm`}>{icon}</div>
    </div>
  </div>
);

export const PharmacyPage: React.FC<PharmacyPageProps> = ({
  isAr, medicines, transactions = [], setIsAddMedicineModalOpen, 
  prescriptions = [], onDispense, onToggleLang, onUploadImage, onDeleteMedicine, onEditMedicine,
  notifications = []
}) => {
    const [pharmaForms] = useState<any[]>([
      { id: 1, nameAr: 'أقراص', nameEn: 'Tablets' },
      { id: 2, nameAr: 'شراب', nameEn: 'Syrup' },
      { id: 3, nameAr: 'حقن', nameEn: 'Injections' },
      { id: 4, nameAr: 'كبسولات', nameEn: 'Capsules' },
      { id: 5, nameAr: 'نقاط', nameEn: 'Drops' },
      { id: 6, nameAr: 'مراهم', nameEn: 'Ointment' },
    ]);
    
    // Dispensing States
    const [isDispensingModalOpen, setIsDispensingModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
    const [matchedMedicine, setMatchedMedicine] = useState<Medicine | null>(null);
    const [dispensingQuantity, setDispensingQuantity] = useState<number>(1);
    const [dispensingCost, setDispensingCost] = useState<number>(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSaleData, setLastSaleData] = useState<any>(null);
    const [isProcessingSale, setIsProcessingSale] = useState(false);
    const [saleSearchTerm, setSaleSearchTerm] = useState('');
    const [dispensingDosageForm, setDispensingDosageForm] = useState('');
    const [dispensingConcentration, setDispensingConcentration] = useState('');
    const [dispensingCart, setDispensingCart] = useState<CartItem[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    const pharmacyNotifications = notifications.filter(n => n.type === 'prescription');

    const addToCart = () => {
      if (!matchedMedicine || dispensingQuantity <= 0) return;
      const newItem: CartItem = {
        medicine: matchedMedicine,
        quantity: dispensingQuantity,
        price: dispensingCost,
        dosageForm: dispensingDosageForm,
        concentration: dispensingConcentration
      };
      setDispensingCart([...dispensingCart, newItem]);
      // Reset selection for next medicine
      setMatchedMedicine(null);
      setSaleSearchTerm('');
      setDispensingQuantity(1);
      setDispensingCost(0);
    };

    const removeFromCart = (index: number) => {
      setDispensingCart(dispensingCart.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-cairo">
         {/* Header */}
         <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-200 transform -rotate-3 hover:rotate-0 transition-transform">
                  <Pill size={32} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-gray-800 tracking-tight">{isAr ? 'بوابة الصيدلية الذكية' : 'Smart Pharmacy Portal'}</h1>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">{isAr ? 'إدارة الأدوية والوصفات الطبية' : 'Unified Inventory & Sales Management'}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={onToggleLang} className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all border border-gray-100 flex items-center justify-center shadow-sm">
                  <Globe size={22} />
               </button>
               <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className={`w-12 h-12 rounded-2xl transition-all border border-gray-100 flex items-center justify-center shadow-sm ${showNotifications ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}>
                     <Bell size={22} />
                  </button>
                  {pharmacyNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                       {pharmacyNotifications.length}
                    </span>
                  )}
               </div>
               <div className="h-10 w-[1px] bg-gray-100 mx-2"></div>
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-gray-800">{isAr ? 'أمين الصيدلية' : 'Pharmacist'}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">{isAr ? 'متصل الآن' : 'Status: Online'}</p>
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard isAr={isAr} titleAr="إجمالي الأدوية" titleEn="Total Medicines" value={medicines.length} icon={<Package size={20} />} iconBg="bg-blue-50" iconColor="text-blue-600" gradientFrom="from-blue-500" />
            <StatCard isAr={isAr} titleAr="أدوية منخفضة" titleEn="Low Stock" value={medicines.filter(m => m.stock <= m.minStock && m.stock > 0).length} icon={<AlertTriangle size={20} />} iconBg="bg-amber-50" iconColor="text-amber-600" gradientFrom="from-amber-500" />
            <StatCard isAr={isAr} titleAr="نفذ المخزون" titleEn="Out of Stock" value={medicines.filter(m => m.stock === 0).length} icon={<X size={20} />} iconBg="bg-rose-50" iconColor="text-rose-600" gradientFrom="from-rose-500" />
            <StatCard isAr={isAr} titleAr="وصفات معلقة" titleEn="Pending Rx" value={prescriptions.length} icon={<ClipboardList size={20} />} iconBg="bg-emerald-50" iconColor="text-emerald-600" gradientFrom="from-emerald-500" />
         </div>

         {/* Content Area */}
         <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 min-h-[600px] relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
               <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">{isAr ? 'مركز عمليات الصيدلية' : 'Pharmacy Operations Center'}</h2>
                  <p className="text-sm text-gray-400 font-bold mt-1">{isAr ? 'إدارة الطلبات والوصفات الطبية' : 'Manage Orders & Prescriptions'}</p>
               </div>

               <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-80">
                     <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`} size={20} />
                     <input 
                       type="text" 
                       placeholder={isAr ? 'البحث السريع...' : 'Quick Search...'}
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                       className={`w-full bg-gray-50 border-gray-200 rounded-[1.5rem] ${isAr ? 'pr-14' : 'pl-14'} py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all`}
                     />
                  </div>
                  <button onClick={() => setIsAddMedicineModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] text-sm font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-all">
                     <Plus size={20} />
                     {isAr ? 'دواء جديد' : 'New Medicine'}
                  </button>
               </div>
            </div>

            <div className="space-y-12 animate-in zoom-in-95 duration-700">
               <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 font-black text-xs">
                     <Clock size={16} />
                     {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group relative bg-[#0f172a] p-12 rounded-[4rem] text-white shadow-2xl shadow-slate-200 hover:shadow-slate-400 transition-all duration-500 overflow-hidden border-4 border-transparent hover:border-emerald-500">
                     <div className="relative z-10 flex flex-col items-center text-center gap-8">
                        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:rotate-12 duration-500">
                           <ClipboardList size={44} />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-white mb-2">{isAr ? 'طلبات المستشفى (الداخلية)' : 'Hospital Orders (Internal)'}</h4>
                           <p className="text-sm text-slate-400 font-bold tracking-tight">{isAr ? 'صرف وصفات الأطباء المسجلة في النظام' : 'Dispense prescriptions logged by hospital doctors'}</p>
                        </div>
                        <button 
                          onClick={() => document.getElementById('pending-rx-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="w-full bg-emerald-500 text-white py-6 rounded-[1.5rem] font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                           {isAr ? 'عرض الوصفات المعلقة' : 'View Pending Rx'}
                           {prescriptions.length > 0 && <span className="bg-white text-emerald-600 px-2 py-0.5 rounded-full text-[10px] animate-pulse">{prescriptions.length}</span>}
                        </button>
                     </div>
                     <Activity size={200} className="absolute -right-20 -bottom-20 text-white/5 opacity-20 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-1000" />
                  </div>

                  <div className="group relative bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-100 hover:border-emerald-300 hover:shadow-emerald-100 transition-all duration-500 overflow-hidden">
                     <div className="relative z-10 flex flex-col items-center text-center gap-8">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-rotate-12 duration-500">
                           <ShoppingCart size={44} />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-gray-800 mb-2">{isAr ? 'الطلبات الخارجية (مباشرة)' : 'External Orders (Direct)'}</h4>
                           <p className="text-sm text-gray-400 font-bold tracking-tight">{isAr ? 'بيع مباشر لعملاء من خارج المستشفى' : 'Direct sale for walk-in or external customers'}</p>
                        </div>
                        <button 
                          onClick={() => {
                             setSelectedPrescription({ id: 'CASH', medicine_name: isAr ? 'بيع نقدي مباشر' : 'Direct Cash Sale', patient_id: 'CASH', notes: '-' });
                             setMatchedMedicine(null);
                             setDispensingQuantity(1);
                             setDispensingCost(0);
                             setSaleSearchTerm('');
                             setDispensingDosageForm('');
                             setDispensingConcentration('');
                             setDispensingCart([]);
                             setIsDispensingModalOpen(true);
                          }}
                          className="w-full bg-[#0f172a] text-white py-6 rounded-[1.5rem] font-black text-sm shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                           <Plus size={20} />
                           {isAr ? 'بدء فاتورة بيع جديدة' : 'Start New Sale'}
                        </button>
                     </div>
                     <Globe size={200} className="absolute -right-20 -bottom-20 text-gray-50 group-hover:scale-110 group-hover:text-emerald-50 transition-all duration-1000" />
                  </div>
               </div>

               <div id="pending-rx-section" className="bg-gray-50/50 rounded-[3rem] p-8 border border-gray-100 space-y-12">
                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em]">{isAr ? 'الوصفات الطبية المعلقة' : 'Pending Prescriptions'}</h4>
                     {prescriptions.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {prescriptions.map(presc => (
                              <div key={presc.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-300 hover:shadow-xl transition-all group relative overflow-hidden">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                       {presc.id}
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-gray-800 mb-2">{isAr ? 'وصفة للمريض' : 'Rx for Patient'} #{presc.patient_id}</p>
                                       <div className="flex flex-wrap gap-2">
                                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">{presc.medicine_name}</span>
                                          <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">{presc.dosage} | {presc.frequency}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <button 
                                   onClick={() => {
                                      setSelectedPrescription(presc);
                                      const autoMatch = medicines.find(m => (isAr ? m.nameAr : m.nameEn).toLowerCase().includes(presc.medicine_name.toLowerCase()));
                                      setMatchedMedicine(autoMatch || null);
                                      setDispensingQuantity(1);
                                      setDispensingCost(autoMatch?.price || 0);
                                      setDispensingDosageForm(isAr ? (autoMatch?.dosageFormAr || '') : (autoMatch?.dosageFormEn || ''));
                                      setDispensingConcentration(autoMatch?.concentration || '');
                                      setSaleSearchTerm(presc.medicine_name);
                                      setDispensingCart([]);
                                      setIsDispensingModalOpen(true);
                                   }}
                                   className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-xs font-black shadow-lg shadow-emerald-50 hover:scale-[1.02] transition-all flex items-center gap-3"
                                 >
                                    <CheckCircle2 size={18} />
                                    {isAr ? 'صرف الفاتورة' : 'Dispense & Receipt'}
                                 </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="py-24 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                           <ClipboardList size={48} className="mx-auto text-gray-100" />
                           <h4 className="text-lg font-black text-gray-200">{isAr ? 'لا توجد وصفات طبية حالياً' : 'No prescriptions found'}</h4>
                        </div>
                     )}
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em]">{isAr ? 'آخر العمليات' : 'Recent Activity'}</h4>
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {transactions.slice(0, 4).map(tx => (
                           <div key={tx.id} className="bg-white p-5 rounded-3xl border border-gray-50 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === 'out' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                    {tx.type === 'out' ? <ShoppingCart size={18} /> : <Truck size={18} />}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-gray-800">{isAr ? tx.medicine?.nameAr : tx.medicine?.nameEn}</p>
                                    <p className="text-[9px] text-gray-400 font-bold">{tx.transaction_date}</p>
                                 </div>
                              </div>
                              <span className={`text-xs font-black ${tx.type === 'out' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                 {tx.type === 'out' ? '-' : '+'}{tx.quantity}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Dispensing Modal */}
         {isDispensingModalOpen && selectedPrescription && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 font-cairo border border-gray-100">
                 <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-emerald-50/20">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                          <ShoppingCart size={20} />
                       </div>
                       <div>
                          <h3 className="text-sm font-black text-gray-800">{isAr ? 'صرف دواء جديد' : 'New Dispensing'}</h3>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{selectedPrescription.id === 'CASH' ? (isAr ? 'بيع نقدي' : 'Cash Sale') : (isAr ? `وصفة #${selectedPrescription.id}` : `Rx #${selectedPrescription.id}`)}</p>
                       </div>
                    </div>
                    <button onClick={() => setIsDispensingModalOpen(false)} className="w-8 h-8 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-lg flex items-center justify-center transition-all border border-gray-100 shadow-sm"><X size={16} /></button>
                 </div>

                 <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Cart Display */}
                    {dispensingCart.length > 0 && (
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">{isAr ? 'الأدوية المضافة للفاتورة' : 'ADDED TO BILL'}</label>
                          <div className="space-y-2">
                             {dispensingCart.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-100">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 border border-gray-100 font-bold text-[10px]">x{item.quantity}</div>
                                      <div>
                                         <p className="text-xs font-black text-gray-800">{isAr ? item.medicine.nameAr : item.medicine.nameEn}</p>
                                         <p className="text-[8px] text-gray-400 font-bold uppercase">{item.dosageForm} | {item.concentration}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <span className="text-xs font-black text-emerald-600">{item.price} SDG</span>
                                      <button onClick={() => removeFromCart(idx)} className="text-rose-400 hover:text-rose-600 transition-colors"><X size={14} /></button>
                                   </div>
                                </div>
                             ))}
                          </div>
                          <div className="flex justify-between items-center px-2 py-2 border-t border-gray-100">
                             <span className="text-[10px] font-black text-gray-400 uppercase">{isAr ? 'الإجمالي الكلي' : 'GRAND TOTAL'}</span>
                             <span className="text-lg font-black text-emerald-600">{dispensingCart.reduce((sum, item) => sum + item.price, 0)} SDG</span>
                          </div>
                       </div>
                    )}

                    {/* Search Bar */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">{isAr ? 'ابحث عن الدواء في المخزون' : 'SEARCH PHARMACY INVENTORY'}</label>
                       <div className="relative group">
                          <Search size={18} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:scale-110 transition-transform`} />
                          <input 
                             type="text"
                             autoFocus
                             placeholder={isAr ? 'بداية كتابة اسم الدواء أو الباركود...' : 'Start typing name or barcode...'}
                             value={saleSearchTerm}
                             onChange={(e) => {
                                setSaleSearchTerm(e.target.value);
                                setMatchedMedicine(null); // Clear previous selection when typing
                             }}
                             className="w-full bg-emerald-50/30 border-2 border-emerald-100/50 rounded-2xl px-12 py-5 text-sm font-black focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 outline-none transition-all shadow-inner"
                          />
                       </div>
                       
                       {saleSearchTerm && !matchedMedicine && (
                          <div className="max-h-48 overflow-y-auto bg-white border-2 border-emerald-50 rounded-2xl mt-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 divide-y divide-gray-50 overflow-hidden">
                             {medicines
                                .filter(m => (isAr ? m.nameAr : m.nameEn).toLowerCase().includes(saleSearchTerm.toLowerCase()) || (m.barcode || '').includes(saleSearchTerm))
                                .map(m => (
                                   <button 
                                      key={m.id}
                                      onClick={() => {
                                         setMatchedMedicine(m);
                                         setDispensingQuantity(1);
                                         setDispensingCost(m.price);
                                         setDispensingDosageForm(isAr ? (m.dosageFormAr || '') : (m.dosageFormEn || ''));
                                         setDispensingConcentration(m.concentration || '');
                                         setSaleSearchTerm(isAr ? m.nameAr : m.nameEn);
                                      }}
                                      disabled={m.stock <= 0}
                                      className="w-full px-5 py-4 text-left hover:bg-emerald-50 flex items-center justify-between transition-colors disabled:opacity-50 group/item"
                                   >
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-50 shadow-sm group-hover/item:rotate-12 transition-transform">
                                            <Pill size={18} />
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-800">{isAr ? m.nameAr : m.nameEn}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">{m.categoryEn} • {m.stock} {isAr ? 'عبوة متاحة' : 'Units Available'}</span>
                                         </div>
                                      </div>
                                      <div className="text-right">
                                         <span className="text-xs font-black text-emerald-600">{m.price} SDG</span>
                                         <p className="text-[8px] text-gray-400 uppercase font-black">{isAr ? 'السعر للوحدة' : 'PER UNIT'}</p>
                                      </div>
                                   </button>
                                ))
                             }
                             {medicines.filter(m => (isAr ? m.nameAr : m.nameEn).toLowerCase().includes(saleSearchTerm.toLowerCase()) || (m.barcode || '').includes(saleSearchTerm)).length === 0 && (
                                <div className="p-8 text-center space-y-2">
                                   <X size={32} className="mx-auto text-rose-200" />
                                   <p className="text-xs font-black text-gray-300 uppercase">{isAr ? 'لم يعثر على نتائج' : 'No matches found'}</p>
                                </div>
                             )}
                          </div>
                       )}
                    </div>

                    {matchedMedicine && (
                       <div className="space-y-4 animate-in fade-in slide-in-from-top-3 duration-500">
                          <div className="bg-emerald-600 p-5 rounded-2xl text-white shadow-lg shadow-emerald-100 flex items-center justify-between relative overflow-hidden group">
                             <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-xl">
                                   {isAr ? matchedMedicine.nameAr[0] : matchedMedicine.nameEn[0]}
                                </div>
                                <div>
                                   <p className="text-sm font-black">{isAr ? matchedMedicine.nameAr : matchedMedicine.nameEn}</p>
                                   <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                                      <p className="text-[10px] text-emerald-100 font-black uppercase tracking-wider">{isAr ? 'تم الاختيار من المخزون' : 'SELECTED FROM STOCK'}</p>
                                   </div>
                                </div>
                             </div>
                             <CheckCircle2 size={32} className="text-white/20 relative z-10" />
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">{isAr ? 'الكمية' : 'QUANTITY'}</label>
                                <input type="number" min="1" max={matchedMedicine.stock} value={dispensingQuantity}
                                   onChange={(e) => {
                                      const v = parseInt(e.target.value) || 0;
                                      setDispensingQuantity(v);
                                      setDispensingCost(v * (matchedMedicine?.price || 0));
                                   }}
                                   className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-black text-gray-800 outline-none focus:border-emerald-200 transition-all font-sans"
                                />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">{isAr ? 'سعر البيع' : 'SALE PRICE'}</label>
                                <input type="number" value={dispensingCost} onChange={(e) => setDispensingCost(parseFloat(e.target.value))}
                                   className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-black text-emerald-700 outline-none focus:border-emerald-300 transition-all font-sans"
                                />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">{isAr ? 'التركيز' : 'CONC.'}</label>
                                <input type="text" value={dispensingConcentration} onChange={(e) => setDispensingConcentration(e.target.value)}
                                   className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-black text-gray-800 outline-none focus:border-emerald-200 transition-all"
                                />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">{isAr ? 'الشكل' : 'FORM'}</label>
                                <select value={dispensingDosageForm} onChange={(e) => setDispensingDosageForm(e.target.value)} 
                                   className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-black text-gray-800 outline-none focus:border-emerald-200 transition-all appearance-none"
                                >
                                   {pharmaForms.map(f => <option key={f.id} value={isAr ? f.nameAr : f.nameEn}>{isAr ? f.nameAr : f.nameEn}</option>)}
                                </select>
                             </div>
                          </div>
                          <button onClick={addToCart} className="w-full py-4 bg-emerald-50 border-2 border-emerald-600 text-emerald-600 rounded-2xl text-xs font-black shadow-lg shadow-emerald-50 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
                             <Plus size={18} /> {isAr ? 'إضافة دواء جديد للفاتورة' : 'Add Another Medicine'}
                          </button>
                       </div>
                    )}
                 </div>

                 <div className="p-8 pt-4 space-y-4 bg-gray-50/50 border-t border-gray-100">
                    <div className="flex items-center justify-between px-2">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'عدد الأدوية' : 'TOTAL ITEMS'}</span>
                          <span className="text-sm font-black text-gray-800">{dispensingCart.length} {isAr ? 'أدوية' : 'Items'}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isAr ? 'الإجمالي الكلي' : 'GRAND TOTAL'}</span>
                          <p className="text-xl font-black text-emerald-600">{dispensingCart.reduce((sum, item) => sum + item.price, 0)} <span className="text-xs opacity-60">SDG</span></p>
                       </div>
                    </div>
                    <button 
                      disabled={dispensingCart.length === 0 || isProcessingSale}
                      onClick={async () => {
                         setIsProcessingSale(true);
                         const token = localStorage.getItem('token');
                         try {
                            const payload = {
                               items: dispensingCart.map(item => ({
                                  medicine_id: item.medicine.id,
                                  quantity: item.quantity,
                                  price: item.price
                               })),
                               prescription_id: selectedPrescription.id !== 'CASH' ? selectedPrescription.id : null,
                               patient_id: selectedPrescription.patient_id
                            };

                            const res = await fetch('/api/pharmacy/dispense', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                               body: JSON.stringify(payload)
                            });
                            
                            const result = await res.json();
                            if (res.ok) {
                               setLastSaleData({ 
                                  items: result.items, 
                                  grandTotal: dispensingCart.reduce((sum, i) => sum + i.price, 0),
                                  transaction_id: Math.random().toString(36).substr(2, 9), 
                                  date: new Date().toLocaleString(), 
                                  patient_id: selectedPrescription.patient_id
                               });
                               if (selectedPrescription.id !== 'CASH') onDispense(selectedPrescription.id);
                               setIsDispensingModalOpen(false); 
                               setShowReceipt(true);
                            }
                         } finally { setIsProcessingSale(false); }
                      }}
                      className="w-full h-18 bg-emerald-600 text-white rounded-[1.5rem] text-sm font-black shadow-2xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {isProcessingSale ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Printer size={20} />}
                       {isAr ? 'إصدار الفاتورة النهائية وصرف الأدوية' : 'Finalize & Issue Receipt'}
                    </button>
                 </div>
              </div>
           </div>
         )}

         {/* Receipt Modal */}
         {showReceipt && lastSaleData && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/80 backdrop-blur-2xl p-4">
              <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-lg p-12 space-y-10 animate-in zoom-in-95 duration-700 font-cairo">
                 <div className="text-center space-y-3">
                    <Banknote size={40} className="mx-auto text-emerald-600" />
                    <h3 className="text-2xl font-black text-gray-800">Pharmacy Services Invoice</h3>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">MODERN SPECIALTY HOSPITAL</p>
                    <div className="flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                       <span>ID: {lastSaleData.transaction_id}</span>
                       <span>•</span>
                       <span>{lastSaleData.date}</span>
                    </div>
                 </div>
                 
                 <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-4 border border-gray-100 max-h-[40vh] overflow-y-auto">
                    {lastSaleData.items.map((item: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div>
                             <p className="text-sm font-black text-gray-800 mb-1">{isAr ? item.nameAr : item.nameEn}</p>
                             <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{item.dosageFormEn} | {item.concentration} | x{item.quantity}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-gray-800">{item.price} <span className="text-[10px] opacity-40">SDG</span></p>
                          </div>
                       </div>
                    ))}
                    
                    <div className="pt-6 mt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center text-2xl font-black">
                       <span className="text-[11px] text-gray-400 uppercase">GRAND TOTAL</span>
                       <span>{lastSaleData.grandTotal} <span className="text-xs opacity-40">SDG</span></span>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex-[2] h-16 bg-gray-900 text-white rounded-3xl text-sm font-black shadow-2xl flex items-center justify-center gap-3">
                       <Printer size={20} /> Print Invoice
                    </button>
                    <button onClick={() => setShowReceipt(false)} className="flex-1 h-16 bg-emerald-50 text-emerald-600 rounded-3xl text-sm font-black">Close</button>
                 </div>
              </div>
           </div>
         )}
      </div>
    );
};

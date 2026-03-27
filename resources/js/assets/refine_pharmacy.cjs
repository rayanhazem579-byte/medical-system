const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\PharmacyManagementPage.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Import SuppliersPage
if (!content.includes('import { SuppliersPage }')) {
    content = content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState } from 'react';\nimport { SuppliersPage } from './SuppliersPage';"
    );
}

// 2. Add alerts and suppliers to activeTab state
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales' | 'purchases' | 'shapes'>('overview');",
    "const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'sales' | 'alerts' | 'purchases' | 'shapes' | 'suppliers'>('overview');"
);

// Add missing states
if (!content.includes('const [showAlertSettingModal, setShowAlertSettingModal] = useState(false);')) {
    content = content.replace(
    "const [newShape, setNewShape] = useState({ ar: '', en: '', sizes: '' });",
    "const [newShape, setNewShape] = useState({ ar: '', en: '', sizes: '' });\n    const [showAlertSettingModal, setShowAlertSettingModal] = useState(false);\n    const [minStockGlobal, setMinStockGlobal] = useState(10);\n    const [expiryThresholdMonths, setExpiryThresholdMonths] = useState(3);"
    );
}

// 3. Update tabs array
content = content.replace(
    /const tabs = \[\s+{\s*id:\s*'overview',.*?],\s*}/s, // this won't work simply
    'const tabs'
);
const tabsRegex = /const tabs = \[([\s\S]*?)\];/;
const newTabsArray = `const tabs = [
      { id: 'overview', nameAr: 'نظرة عامة', nameEn: 'Intel', icon: LayoutDashboard },
      { id: 'inventory', nameAr: 'المخزن', nameEn: 'Inventory', icon: Package },
      { id: 'sales', nameAr: 'المبيعات', nameEn: 'Sales', icon: History },
      { id: 'alerts', nameAr: 'التنبيهات', nameEn: 'Alerts', icon: AlertTriangle },
      { id: 'purchases', nameAr: 'المشتريات', nameEn: 'Purchases', icon: Truck },
      { id: 'shapes', nameAr: 'الأشكال', nameEn: 'Forms', icon: Layers },
      { id: 'suppliers', nameAr: 'إدارة الموردين', nameEn: 'Suppliers', icon: UserCheck },
    ];`;
content = content.replace(tabsRegex, newTabsArray);

// Add Top button for Alerts module
const alertsButtonPattern = /\{activeTab === 'shapes' && \([\s\S]*?\}\)/;
const newButtons = `{activeTab === 'shapes' && (
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
                  )}`;
content = content.replace(alertsButtonPattern, newButtons);


// Wait, what if we just inject the Views directly before {showShapeModal && (
const viewsToInsert = `
               {activeTab === 'suppliers' && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-4 animate-in fade-in duration-500 min-h-[500px]">
                     <SuppliersPage isAr={isAr} tx={{}} />
                  </div>
               )}

               {activeTab === 'alerts' && (
                  <div className="space-y-6 font-cairo">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Low Stock Alerts */}
                        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 shadow-inner">
                           <h3 className="text-xl font-black text-amber-800 tracking-tight flex items-center gap-3 mb-6">
                              <AlertTriangle size={24} className="text-amber-500" />
                              {isAr ? 'أدوية شارفت على النفاذ' : 'Low Stock Items'}
                           </h3>
                           <div className="space-y-4">
                              {medicines.filter(m => m.stock <= minStockGlobal).map(m => (
                                 <div key={'stk-'+m.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-amber-50 shadow-sm">
                                    <div>
                                       <p className="text-sm font-black text-slate-800">{isAr ? m.nameAr : m.nameEn}</p>
                                       <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">الكمية المتوفرة: {m.stock}</p>
                                    </div>
                                    <span className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm">تجاوزت الحد ({minStockGlobal})</span>
                                 </div>
                              ))}
                              {medicines.filter(m => m.stock <= minStockGlobal).length === 0 && (
                                 <p className="text-center text-xs font-bold text-amber-500/50 py-4">{isAr ? 'لا يوجد نواقص حالياً' : 'All stocks are healthy'}</p>
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
`;
// find where shape tab view ends and inject these views
content = content.replace(
    "               {activeTab === 'shapes' && (",
    viewsToInsert + "\n               {activeTab === 'shapes' && ("
);


// 5. Add settings modal
const settingsModal = `
         {showAlertSettingModal && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-2xl p-6">
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100 font-cairo">
                    <div className="p-6 border-b-2 border-rose-100 flex items-center justify-between bg-rose-600 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner"><Settings2 size={22} /></div>
                           <div>
                              <h3 className="text-lg font-black tracking-tight uppercase">{isAr ? 'إعدادات التنبيهات' : 'Alert Configuration'}</h3>
                              <p className="text-[9px] text-rose-100 font-bold tracking-[0.3em] uppercase">{isAr ? 'تخصيص مؤشرات النواقص والصلاحية' : 'Threshold Customizations'}</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAlertSettingModal(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/10"><X size={20} /></button>
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
                        <button onClick={() => setShowAlertSettingModal(false)} className="flex-[2] bg-rose-600 text-white rounded-xl py-4 text-[10px] font-black shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                           <CheckCircle2 size={16} />
                           {isAr ? 'حفظ الإعدادات' : 'Save Config'}
                        </button>
                    </div>
                </div>
            </div>
         )}
         {/* MODAL: New/Edit Shape */}
`;
content = content.replace("{/* MODAL: New/Edit Shape */}", settingsModal);

fs.writeFileSync(targetFile, content);

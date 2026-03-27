const fs = require('fs');
const path = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx';

if (!fs.existsSync(path)) {
    console.error('File not found');
    process.exit(1);
}

let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');
let newLines = [];
let skipMode = false;

// ... (logic)
console.log('Starting surgery...');
let pricingIdx = -1;
let waitingIdx = -1;

for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes("activeTab === 'pricing' ? (")) {
       pricingIdx = i;
   }
   if (lines[i].includes("activeTab === 'waiting' ? (")) {
       waitingIdx = i;
       break;
   }
}

if (pricingIdx === -1 || waitingIdx === -1) {
    console.error('Markers not found');
    process.exit(1);
}

// Rebuild content
newLines = lines.slice(0, pricingIdx + 1);

// Add NEW Pricing Content
newLines.push('            <div className="space-y-12 animate-in fade-in duration-500">');
newLines.push('               <div className="flex flex-wrap items-center justify-between gap-6 p-4 bg-gray-50/50 rounded-[40px] border border-gray-100">');
newLines.push('                  <div className="space-y-1">');
newLines.push('                     <h4 className="text-xl font-black text-gray-800 flex items-center gap-3"><DollarSign className="text-emerald-500" size={24}/>{isArLocal ? "كتالوج الخدمات والتعريفة الطبية" : "Service Catalogue & Tariff"}</h4>');
newLines.push('                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase">{isArLocal ? "قائمة الأسعار المعتمدة للعيادات والمختبرات" : "Board-Approved Standard Pricing for Clinical Operations"}</p>');
newLines.push('                  </div>');
newLines.push('                  <div className="flex items-center gap-4">');
newLines.push('                     <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-[2rem] border border-emerald-100 flex items-center gap-3">');
newLines.push('                        <Database size={16}/>');
newLines.push('                        <span className="text-xs font-black uppercase tracking-tighter">{(services || []).length} {isArLocal ? "خدمة مفعلة" : "Catalogued"}</span>');
newLines.push('                     </div>');
newLines.push('                     <button onClick={() => setIsAddServiceModalOpen(true)} className="px-8 py-3 bg-emerald-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">');
newLines.push('                        <Plus size={16}/>');
newLines.push('                        {isArLocal ? "إضافة خدمة" : "Add Service"}');
newLines.push('                     </button>');
newLines.push('                  </div>');
newLines.push('               </div>');
newLines.push('               <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto custom-scrollbar">');
// ... Table will be missing here in this simplified version, I MUST include it to be stable.
newLines.push('                  <table className="w-full text-right" dir={isArLocal ? "rtl" : "ltr"}>');
newLines.push('                     <thead>');
newLines.push('                        <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest">');
newLines.push('                           <th className="p-6">{isArLocal ? "كود" : "Code"}</th><th className="p-6">{isArLocal ? "الخدمة الطبية" : "Service"}</th><th className="p-6">{isArLocal ? "القسم" : "Dept"}</th><th className="p-6">{isArLocal ? "السعر" : "Base"}</th><th className="p-6 text-emerald-600 font-black">{isArLocal ? "الإجمالي" : "Total"}</th><th className="p-6 text-center">{isArLocal ? "إجراءات" : "Ops"}</th>');
newLines.push('                        </tr>');
newLines.push('                     </thead>');
newLines.push('                     <tbody className="divide-y divide-gray-50">');
newLines.push('                        {(services || []).filter(s => !selectedPricingDeptId || (s?.department_id && String(s.department_id) === String(selectedPricingDeptId))).map(s => (');
newLines.push('                           <tr key={s.id} className="hover:bg-gray-50/70 transition-colors group">');
newLines.push('                              <td className="p-6"><div className="p-2.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 w-fit">SER-{s.id}</div></td>');
newLines.push('                              <td className="p-6"><p className="text-sm font-black text-gray-800">{isArLocal ? (s.nameAr || s.name) : (s.nameEn || s.name)}</p></td>');
newLines.push('                              <td className="p-6 text-sm font-black text-gray-600">{s.price || s.cost} <span className="text-[8px]">EGP</span></td>');
newLines.push('                              <td className="p-6 text-sm font-black text-emerald-600">{s.finalPrice || s.price} <span className="text-[8px]">EGP</span></td>');
newLines.push('                              <td className="p-6 text-center"><div className="flex justify-center gap-2"><button onClick={() => handleEditService(s)} className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm active:scale-90"><Edit3 size={14}/></button></div></td>');
newLines.push('                           </tr>');
newLines.push('                        ))}');
newLines.push('                     </tbody>');
newLines.push('                  </table>');
newLines.push('               </div>');
newLines.push('            </div>');
newLines.push('         ) : activeTab === "waiting" ? (');

// Merge with after-waiting block
newLines = newLines.concat(lines.slice(waitingIdx + 1));

fs.writeFileSync(path, newLines.join("\n"), 'utf8');
console.log('Surgery successful.');

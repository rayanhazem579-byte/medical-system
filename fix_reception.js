const fs = require('fs');
const path = 'c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx';
let content = fs.readFileSync(path, 'utf8');

console.log('Original length:', content.length);

// Fix 1: Add Service Modal truncation
// Specifically looking for:
// <div className="space-y-2">
// {isAddPatientModalOpen && (
const brokenPart1 = /<div className="space-y-2">\s+\{isAddPatientModalOpen && \(/;
const fixedPart1 = `<div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">{isArLocal ? 'القسم' : 'Department'}</label>
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none" value={newService.departmentId} onChange={e => setNewService({...newService, departmentId: e.target.value})}>
                       <option value="">{isArLocal ? 'اختر القسم...' : 'Select Dept...'}</option>
                       {depts.map(d => <option key={d.id} value={d.id}>{isArLocal ? d.nameAr : d.nameEn}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">{isArLocal ? 'السعر' : 'Price'}</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value, finalPrice: String(Number(e.target.value) - Number(newService.discount))})}/>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">{isArLocal ? 'الخصم' : 'Discount'}</label>
                      <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={newService.discount} onChange={e => setNewService({...newService, discount: e.target.value, finalPrice: String(Number(newService.price) - Number(e.target.value))})}/>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase">{isArLocal ? 'النهائي' : 'Final'}</label>
                      <input type="number" className="w-full p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm" value={newService.finalPrice} readOnly/>
                   </div>
                </div>
                <button onClick={handleCreateService} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-50 hover:bg-emerald-700 transition-all">Add Service</button>
              </div>
            </div>
         </div>
       )}

       {isAddPatientModalOpen && (`;

if (brokenPart1.test(content)) {
    console.log('Found and fixing broken part 1 (Add Service Modal)');
    content = content.replace(brokenPart1, fixedPart1);
} else {
    console.log('Broken part 1 not found');
}

// Fix 2: Booking Visit Types corruption
// Looking for: emerge {[
const brokenPart2 = /\{ id: 'emerge\s+\{\[\s+\{ id: 'regular'[^\]]+\]\.map/;
const fixedPart2 = `{ id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                           ].map`;

if (brokenPart2.test(content)) {
    console.log('Found and fixing broken part 2 (Visit Types)');
    content = content.replace(brokenPart2, fixedPart2);
} else {
    console.log('Broken part 2 not found by regex, trying fallback matching');
    // Fallback: match the specific line 1275-1282 duplication
    const fallbackTarget = /\[\s+\{ id: 'regular'[^\]]+emerge[^\]]+\]\.map/;
    content = content.replace(fallbackTarget, `[
                             { id: 'regular', ar: 'كشف', en: 'Consultation' },
                             { id: 'follow-up', ar: 'متابعة', en: 'Follow-up' },
                             { id: 'emergency', ar: 'طوارئ', en: 'Emergency' }
                           ].map`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('File updated successfully');

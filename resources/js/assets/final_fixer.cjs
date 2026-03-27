const fs = require('fs');
const path = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(path, 'utf8');

// Fix the specific broken strings and character encoding
// 1. Fix sub-tab switcher
c = c.replace(/className=\{\u000Clex items-center gap-3 px-8 py-3 rounded-\[25px\] text-\[10px\] font-black transition-all \}/g, 
    "className={`flex items-center gap-3 px-8 py-3 rounded-[25px] text-[10px] font-black transition-all ${pricingSubTab === sub.id ? 'bg-white text-primary-600 shadow-xl shadow-primary-50' : 'text-gray-400 hover:text-gray-600'}`}");

// 2. Fix All Depts Button
c = c.replace(/className=\{\u000Clex items-center gap-3 px-6 py-3 rounded-2xl text-\[10px\] font-black transition-all \}/g,
    "className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${selectedPricingDeptId === null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-50 hover:border-indigo-100'}`}");

// 3. Fix Individual Dept Buttons (was previously broken to null)
// We look for the one following <Stethoscope
c = c.replace(/className=\{`flex items-center gap-3 px-6 py-3 rounded-2xl text-\[10px\] font-black transition-all \$\{selectedPricingDeptId === null \? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-50 hover:border-indigo-100'}`\}\s+>\s+<Stethoscope/g,
    "className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${selectedPricingDeptId === d.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-100'}`}>\n                               <Stethoscope");

// 4. Fix Roster Span
c = c.replace(/className=\{px-4 py-1.5 rounded-full text-\[9px\] font-black uppercase tracking-tighter \}/g,
    "className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${s.type === 'morning' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}");

// 5. Cleanup any remaining form feeds just in case
c = c.replace(/\u000C/g, '');

fs.writeFileSync(path, c);
console.log('ReceptionPage.tsx cleaned and stabilized.');

const fs = require('fs');
let content = fs.readFileSync('c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx', 'utf8');

// 1. Fix the Registration/Booking overlap at line 1216-1224
const corruptedBlock = /onClick\(\(\) => \{\s+const sections = \['personal', 'contact', 'booking', 'medical'\];\s+const idx = sections\.indexOf\(modalSection\);\s+if \(idx > 0\) setModalSection\(sections\[idx-1\] as any\);\s+\}\}\s+disabled=\{modalSection === 'personal'\}\s+className=\{`px-6 py-3 rounded-xl font-black text-\[10px                <h3 className="text-3xl font-black text-gray-800">\{isArLocal \? 'حجز موعد فحص' : 'Book a Consultation'\}<\/h3>\s+<button onClick=\{\(\) => setIsBookModalOpen\(false\)\} className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl"><X size=\{24\}\/><\/button>\s+<\/div>\s+<div className="space-y-6">\s+<div className="space-y-2">\s+<label className="text-\[10px\] font-black text-gray-400 uppercase tracking-widest">\{isArLocal \? 'البحث بالرقم الطبي أو الاسم' : 'Patient MRN \/ Name'\}<\/label>\s+<div className="relative">\s+<Search className="absolute right-4 top-4 text-gray-300" size=\{18\}\/>\s+<input className="w-full p-4 pr-12 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-primary-50 text-sm" placeholder=\{isArLocal \? 'أدخل الرقم الطبي\.\.\.' : 'Search Patient\.\.\.'\} onChange=\{e => \{\s+>\s+\{isArLocal \? 'Ø§Ù„ØªØ§Ù„ÙŠ' : 'Next'\}\s+<\/button>\s+<\/div>/g;

const repairedBlock = `onClick={() => {
                           const sections = ['personal', 'contact', 'booking', 'medical'];
                           const idx = sections.indexOf(modalSection);
                           if (idx > 0) setModalSection(sections[idx-1] as any);
                        }}
                        disabled={modalSection === 'personal'}
                        className={'px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ' + (modalSection === 'personal' ? 'text-gray-200 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-100')}
                     >
                        {isArLocal ? 'السابق' : 'Back'}
                     </button>
                     <button 
                        onClick={() => {
                           const sections = ['personal', 'contact', 'booking', 'medical'];
                           const idx = sections.indexOf(modalSection);
                           if (idx < sections.length - 1) setModalSection(sections[idx+1] as any);
                        }}
                        className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-white border border-gray-200 text-gray-400 hover:bg-gray-100"
                     >
                        {isArLocal ? 'التالي' : 'Next'}
                     </button>
                  </div>
                  <button 
                     onClick={handleCreatePatient}
                     disabled={isGeneratingMRN}
                     className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                     {isGeneratingMRN ? <Activity className="animate-spin" size={16}/> : <Check size={16}/>}
                     {isArLocal ? 'حفظ النهائي' : 'Final Submit'}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm">
           <div className="relative w-full max-w-2xl bg-white rounded-[50px] shadow-2xl p-12 space-y-8 animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-black text-gray-800">{isArLocal ? 'حجز موعد فحص' : 'Book a Consultation'}</h3>
                <button onClick={() => setIsBookModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl"><X size={24}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{isArLocal ? 'البحث بالرقم الطبي أو الاسم' : 'Patient MRN / Name'}</label>
                   <div className="relative">
                     <Search className="absolute right-4 top-4 text-gray-300" size={18}/>
                     <input className="w-full p-4 pr-12 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-primary-50 text-sm" placeholder={isArLocal ? 'أدخل الرقم الطبي...' : 'Search Patient...'} onChange={e => {
                        const fnd = patients.find(p => p.fileNumber === e.target.value || (p.name || '').includes(e.target.value));
                        setFoundPatient(fnd || null);
                     }}/>
                   </div>
                 </div>`;

content = content.replace(corruptedBlock, repairedBlock);

// 2. Clear known remaining mangled strings
const replacements = {
    'Ø§Ù„ØªØ§Ù„ÙŠ': 'التالي',
    'Ø§Ù„Ø³Ø§Ø¨Ù‚': 'السابق',
    'Ø­Ù Ø¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª': 'حفظ التعديلات',
    'ØªØ¹Ø¯ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø®Ø¯Ù…Ø©': 'تعديل بيانات الخدمة',
    'Ø§Ø³Ù… Ø§Ù„Ø®Ø¯Ù…Ø©\.\.\.': 'اسم الخدمة...',
    'Ø¥Ø¶Ø§Ù Ø© Ø®Ø¯Ù…Ø© Ø¬Ø¯ÙŠØ¯Ø©': 'إضافة خدمة جديدة'
};

for (const [key, val] of Object.entries(replacements)) {
    content = content.replace(new RegExp(key, 'g'), val);
}

fs.writeFileSync('c:/xampp/htdocs/my-first-app/backend/resources/js/assets/ReceptionPage.tsx', content);
console.log('Repair Complete');

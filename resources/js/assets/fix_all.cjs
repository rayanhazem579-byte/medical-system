const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

const fixes = {
  841: "                                  <label className=\"text-[10px] font-black text-gray-400 uppercase tracking-widest\">{modalIsAr ? 'تاريخ الميلاد' : 'Birth Date'}</label>",
  1389: "                              <p className=\"text-[10px] font-black text-gray-400 uppercase tracking-widest\">{isAr ? 'إجمالي المرضى' : 'Total Registered'}</p>",
  1425: "                              <p className=\"text-[10px] font-black text-gray-400 uppercase tracking-widest\">{isAr ? 'في الانتظار' : 'Waiting List'}</p>",
  1433: "                              <p className=\"text-[10px] font-black text-gray-400 uppercase tracking-widest\">{isAr ? 'تمت المعاينة' : 'Consulted Today'}</p>",
  1618: "                                    {isAr ? 'آخر زيارة:' : 'Last visit:'} {p.lastVisit}",
  1626: "                                      <span className=\"hidden sm:inline\">{isUploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع ملف المرضى' : 'Upload Template')}</span>",
  1634: "                                      <span className=\"hidden sm:inline\">{isAr ? 'تحميل قالب المرضى' : 'Download Template'}</span>",
  1639: "                                      <span className=\"hidden sm:inline\">{isAr ? 'تسجيل ملف مريض جديد' : 'Register New Patient File'}</span>",
  1652: "                                    <p className=\"text-[10px] text-gray-400 font-bold uppercase tracking-widest\">{isAr ? 'البحث بالاسم أو السجل الطبي...' : 'Search Name or Medical ID...'}</p>",
};

for (const [num, text] of Object.entries(fixes)) {
  const idx = parseInt(num) - 1;
  if (lines[idx]) {
     // Preserving indent if possible
     lines[idx] = text;
  }
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Final fixes for syntax errors applied.');

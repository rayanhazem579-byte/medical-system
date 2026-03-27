const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

const fixes = {
  1626: "                       <span className=\"hidden sm:inline\">{isUploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع ملف المرضى' : 'Upload Template')}</span>",
  707: "                                   {isAr ? (p.status === 'waiting' ? 'في الانتظار' : p.status === 'in-consult' ? 'عند الطبيب' : 'مكتمل') : p.status}",
  572: "                                     <span className=\"text-gray-400 font-bold uppercase tracking-widest\">{isAr ? 'الحالة الحالية' : 'Current Status'}</span>",
  841: "                                  <label className=\"text-[10px] font-black text-gray-400 uppercase tracking-widest\">{modalIsAr ? 'تاريخ الميلاد' : 'Birth Date'}</label>",
};

for (const [num, text] of Object.entries(fixes)) {
  const idx = parseInt(num) - 1;
  if(lines[idx]) lines[idx] = text;
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Final syntax surgery applied.');

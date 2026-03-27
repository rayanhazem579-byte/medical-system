const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

const toDelete = [
  "isAr ? 'آخر زيارة:' : 'Last visit:'",
  "isUploading ? (isAr ? 'جاري الرفع...'",
  "isAr ? 'تحميل قالب المرضى' : 'Download Template'",
  "isAr ? 'تسجيل ملف مريض جديد' : 'Register New Patient File'",
  "isAr ? 'البحث بالاسم أو السجل الطبي...'",
];

// We only want to delete them if they are in the wrong place (near the end)
let newLines = [];
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let isBad = false;
  if (i > 1500) {
    for (let bad of toDelete) {
      if (line.includes(bad)) {
        isBad = true;
        break;
      }
    }
  }
  if (!isBad) {
    newLines.push(line);
  }
}

fs.writeFileSync(f, newLines.join('\n'), 'utf8');
console.log('Cleanup rogue lines done.');

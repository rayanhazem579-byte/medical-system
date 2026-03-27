const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(f, 'utf8');

const mapping = {
  'Upload Template': 'رفع ملف المرضى',
  'Download Template': 'تحميل قالب المرضى',
  "Today's Schedule": 'جدول المراجعات',
};

for (const [en, ar] of Object.entries(mapping)) {
  // Use a very flexible regex that matches even if ':' or '+' is missing
  const regex = new RegExp(`isAr \\? '[^']+'\\s*'${en}'`, 'g');
  console.log('Replacing', en);
  c = c.replace(regex, `isAr ? '${ar}' : '${en}'`);
}

fs.writeFileSync(f, c, 'utf8');
console.log('Global colon repair done.');

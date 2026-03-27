const fs = require('fs');
const path = require('path');

const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix mangled Arabic strings (common UTF-8 misinterpretations)
content = content.replace(/Ø¢Ø®Ø± Ø²ÙŠØ§Ø±Ø©:/g, 'آخر زيارة:');
content = content.replace(/Ù ÙŠ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±/g, 'في الانتظار');
content = content.replace(/Ø¹Ù†Ø¯ Ø§Ù„Ø·Ø¨ÙŠØ¨/g, 'عند الطبيب');
content = content.replace(/Ù…ÙƒØªÙ…Ù„/g, 'مكتمل');
content = content.replace(/Ø¹Ø±Ø¶ Ø§Ù„Ù…Ù„Ù /g, 'عرض الملف');

// Ensure handleUpdatePatient is correctly wired to the button at line 720 (approx)
// And onChange handlers are added to inputs

// Note: I'll use regex for surgical replacement where possible to avoid space-matching issues
content = content.replace(
  /defaultValue=\{isAr \? p\.nameAr : p\.name\}/,
  'defaultValue={isAr ? p.nameAr : p.name}\n                                             onChange={(e) => setTempEditData({ ...tempEditData, [isAr ? "nameAr" : "name"]: e.target.value })}'
);

content = content.replace(
  /defaultValue=\{p\.phone\}/,
  'defaultValue={p.phone}\n                                       onChange={(e) => setTempEditData({ ...tempEditData, phone: e.target.value })}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed encoding and injected onChange handlers.');

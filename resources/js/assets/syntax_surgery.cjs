const fs = require('fs');
const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The most robust way: split by 'Current Status' and look for preceding '{isAr ?'
let sections = content.split("'Current Status'}</span>");
for (let i = 0; i < sections.length - 1; i++) {
  let lastOpenIdx = sections[i].lastIndexOf('{isAr ?');
  if (lastOpenIdx !== -1) {
    sections[i] = sections[i].substring(0, lastOpenIdx) + "{isAr ? 'الحالة الحالية'";
  }
}
content = sections.join("'Current Status'}</span>");

// Same for other problematic ones
const fixSection = (content, enLabel, arLabel) => {
  let parts = content.split(`'${enLabel}'`);
  for (let i = 0; i < parts.length - 1; i++) {
    let lastOpenIdx = parts[i].lastIndexOf('?');
    if (lastOpenIdx !== -1) {
       // Look for the last 'isAr' or 'modalIsAr'
       let startIdx = parts[i].substring(0, lastOpenIdx).lastIndexOf(' ');
       parts[i] = parts[i].substring(0, lastOpenIdx + 1) + ` '${arLabel}' : `;
    }
  }
  return parts.join(`'${enLabel}'`);
};

content = fixSection(content, 'Total Registered', 'إجمالي المرضى');
content = fixSection(content, 'Waiting List', 'في الانتظار');
content = fixSection(content, 'Consulted Today', 'تمت المعاينة');
content = fixSection(content, 'Daily Revenue', 'مدفوعات اليوم');
content = fixSection(content, 'Doctor', 'الطبيب');
content = fixSection(content, 'Service Fee', 'تكلفة الخدمة');
content = fixSection(content, 'Full Catalog', 'القائمة الكاملة');
content = fixSection(content, 'Medical Service Pricing', 'قائمة أسعار الخدمات');
content = fixSection(content, 'Available', 'متاح');
content = fixSection(content, 'Insurance OK', 'يغطي التأمين');
content = fixSection(content, 'Cash or Card', 'نقداً أو بالبطاقة');
content = fixSection(content, 'Todays Doctors & Daily Schedule', 'أطباء اليوم والجدول اليومي');
content = fixSection(content, 'Show Schedule', 'عرض الجدول');
content = fixSection(content, 'Waiting', 'في الانتظار');
content = fixSection(content, 'With Doctor', 'عند الطبيب');
content = fixSection(content, 'Completed', 'مكتمل');
content = fixSection(content, 'Actions', 'إجراءات');
content = fixSection(content, 'View', 'معاينة');

fs.writeFileSync(filePath, content, 'utf8');
console.log('ReceptionPage syntax surgery complete.');

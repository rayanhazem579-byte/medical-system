const fs = require('fs');
const file = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\DoctorsPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Unified Save Payload
content = content.replace(
  /working_days: editDoc.workingDays,/g,
  `name: editDoc.nameAr || editDoc.nameEn,
        email: editDoc.email,
        phone: editDoc.phone,
        medical_id: editDoc.medicalId,
        work_hours: editDoc.workHours,
        working_days: editDoc.workingDays,`
);

// 2. Off-day UI (X instead of Plus)
content = content.replace(
  /opacity-5 group-hover\/cell:opacity-60 transition-all transform hover:scale-125/g,
  'flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner group-hover/cell:bg-rose-50 transition-all'
);
content = content.replace(
  /<Plus size=\{16\} className="text-primary-600" strokeWidth=\{3\} \/>/g,
  '<X size={20} className="text-gray-200 group-hover/cell:text-rose-500" />'
);

// 3. Update Button Text
content = content.replace(
  /\{isAr \? 'تعديل البيانات' : 'Update Physician'\}/g,
  "{isAr ? 'حفظ وتأكيد التعديلات' : 'Save & Confirm Changes'}"
);

fs.writeFileSync(file, content);
console.log('Doctors roster and profile sync finalized.');

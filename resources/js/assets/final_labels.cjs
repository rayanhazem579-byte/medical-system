const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(f, 'utf8');

const mapping = {
  'Total Registered': 'إجمالي المرضى',
  'Waiting List': 'في الانتظار',
  'Consulted Today': 'تمت المعاينة',
  'Daily Revenue': 'مدفوعات اليوم',
  "Today's Schedule": 'جدول المراجعات',
  'Patient Database': 'قاعدة البيانات',
  'Services & Pricing': 'الخدمات والأسعار',
  'Register New Patient File': 'تسجيل ملف مريض جديد',
  'Search Name or Medical ID...': 'البحث بالاسم أو السجل الطبي...',
  'Full Catalog': 'القائمة الكاملة',
  'Medical Service Pricing': 'قائمة أسعار الخدمات',
  'Available': 'متاح',
  'Insurance OK': 'يغطي التأمين',
  'Cash or Card': 'نقداً أو بالبطاقة',
  'Todays Doctors & Daily Schedule': 'أطباء اليوم والجدول اليومي',
  'Show Schedule': 'عرض الجدول',
  'Waiting': 'في الانتظار',
  'With Doctor': 'عند الطبيب',
  'Completed': 'مكتمل',
  'Actions': 'إجراءات',
  'View': 'معاينة',
  'Admit': 'دخول',
  'Finish': 'إنهاء',
  'Medical ID (MRN)': 'السجل الطبي (MRN)',
  'Patient': 'المريض',
  'Phone': 'الهاتف',
  'Status': 'الحالة',
  'Doctor': 'الطبيب',
  'Actions': 'إجراءات',
  'Patient Registration': 'تسجيل مريض',
  'Issue New Medical File': 'إصدار ملف طبي جديد',
  'Personal Info': 'البيانات الشخصية',
  'Contact Info': 'بيانات التواصل',
  'Medical History': 'البيانات الطبية',
  'Booking Info': 'بيانات الحجز',
  'Full Name (Arabic)': 'الاسم بالكامل (بالعربية)',
  'Full Name (English)': 'الاسم بالكامل (بالإنجليزية)',
  'National ID': 'رقم الهوية / الإقامة',
  'Birth Date': 'تاريخ الميلاد',
  'Gender': 'النوع',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'Primary Phone Number': 'رقم الهاتف الأساسي',
  'Email Address': 'البريد الإلكتروني',
  'Detailed Current Address': 'العنوان الحالي بالتفصيل',
  'Blood Group': 'فصيلة الدم',
  'Chronic Diseases': 'أمراض مزمنة',
  'Drug Allergies': 'حساسية الأدوية',
  'Medical History Notes': 'السجل الطبي والملاحظات',
  'Clinical Specialty': 'التخصص الطبي',
  'Select Specialized Physician': 'اختيار الطبيب',
  'Appointment Shift': 'الفترة الزمنية',
  'Morning': 'صباحي',
  'Evening': 'مسائي',
  'Ready to Register': 'جاهز للتسجيل',
};

// Replace {isAr ? '...' : 'Label'} or {(isAr|modalIsAr) ? '...' : 'Label'}
for (const [en, ar] of Object.entries(mapping)) {
  const regex = new RegExp(`\{(isAr|modalIsAr) \\? [^:]+ : '${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\}`, 'g');
  c = c.replace(regex, `{$1 ? '${ar}' : '${en}'}`);
}

// Special case for line 707
c = c.replace(/isAr \? \(p\.status === 'waiting' \? '.*?' : p\.status === 'in-consult' \? '.*?' : '.*?'\) : p\.status/g, "isAr ? (p.status === 'waiting' ? 'في الانتظار' : p.status === 'in-consult' ? 'عند الطبيب' : 'مكتمل') : p.status");

fs.writeFileSync(f, c, 'utf8');
console.log('Restored all labels to clean state.');

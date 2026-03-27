const fs = require('fs');
const f = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage.tsx';
let c = fs.readFileSync(f, 'utf8');

const mapping = {
  // Page 1
  'Total Registered': 'إجمالي المرضى',
  'Waiting List': 'في الانتظار',
  'Consulted Today': 'تمت المعاينة Today', // Manual fix just in case
  'Daily Revenue': 'مدفوعات اليوم',
  "Today's Schedule": 'جدول المراجعات اليومي',
  'Patient Database': 'قاعدة البيانات المستشفى',
  'Services & Pricing': 'الخدمات والأسعار',
  'Register New Patient File': 'تسجيل ملف مريض جديد',
  
  // Tab pricing
  'Medical Service Pricing': 'قائمة أسعار الخدمات الطبية',
  'Full Catalog': 'القائمة الكاملة',
  'Available': 'متاح',
  'Insurance OK': 'يغطي التأمين',
  'Cash or Card': 'الدفع نقدي أو بالبطاقة',
  'Todays Doctors & Daily Schedule': 'أطباء اليوم والجدول اليومي',
  'Show Schedule': 'عرض الجدول',
  'Doctors Weekly Staff Schedule': 'جدول العمل الأسبوعي للأطباء',
  
  // Patient flow
  'Patient Flow Management': 'إدارة تدفق المرضى',
  'Waiting': 'في الانتظار',
  'With Doctor': 'مع الطبيب',
  'Completed': 'مكتمل',
  'Doctor': 'الطبيب الطبيب المختص', // Match current mangled
  'Service Fee': 'تكلفة الخدمة',
  'Current Status': 'الحالة الحالية المرضية',
  'View': 'معاينة الملف',
  'Admit': 'دخول',
  'Finish': 'إنهاء الزيارة',
  'No cases found in this section': 'لا توجد سجلات حالياً في هذا القسم',
  
  // Table
  'Medical ID (MRN)': 'السجل الطبي (MRN)',
  'Patient': 'المريض',
  'Phone': 'الهاتف',
  'Status': 'الحالة',
  'Actions': 'إجراءات',
  'View File': 'عرض الملف الطبي',
  
  // Modal Registration
  'Patient Registration': 'تسجيل مريض جديد',
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
  'Email Address': 'البريد الإلكتروني للارسال',
  'Detailed Current Address': 'العنوان الحالي بالتفصيل',
  'Blood Group': 'فصيلة الدم',
  'Chronic Diseases': 'أمراض مزمنة',
  'Drug Allergies': 'حساسية الأدوية',
  'Medical History Notes': 'السجل الطبي والملاحظات',
  'Clinical Specialty': 'التخصص الطبي',
  'Select Specialized Physician': 'اختيار الطبيب المتخصص',
  'Appointment Shift': 'اختيار الفترة الزمنية',
  'Morning': 'فترة صباحية',
  'Evening': 'فترة مسائية',
  'Ready to Register': 'جاهز للتسجيل',
  'Confirm New Patient File Issuance': 'تأكيد إصدار ملف المريض الجديد',
  'Issue Medical Record': 'إصدار الرقم الطبي الموحد',
  'Registration Successful': 'تم التسجيل بنجاح في النظام',
  'Print ID Card': 'طباعة بطاقة المريض',
  'Done': 'تم الانتهاء',
  'Print ID Card': 'طباعة بطاقة المريض',
  'Pay Now': 'تسديد الآن',
  'Category': 'التصنيف القسمي',
  'Save Changes': 'حفظ التعديلات الحالية',
};

// Use RegExp for better matching
for (const [en, ar] of Object.entries(mapping)) {
  const safeEn = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`isAr \\? '[^']+' : '${safeEn}'`, 'g');
  const regex2 = new RegExp(`modalIsAr \\? '[^']+' : '${safeEn}'`, 'g');
  c = c.replace(regex, `isAr ? '${ar}' : '${en}'`);
  c = c.replace(regex2, `modalIsAr ? '${ar}' : '${en}'`);
}

fs.writeFileSync(f, c, 'utf8');
console.log('Arabic restoration complete.');

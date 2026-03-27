const fs = require('fs');
const filePath = 'c:\\xampp\\htdocs\\my-first-app\\backend\\resources\\js\\assets\\ReceptionPage_tmp.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // Header Cards
  { regex: /isAr \? 'إجما ` المرضى' : 'Total Registered'/g, replacement: "isAr ? 'إجمالي المرضى' : 'Total Registered'" },
  { regex: /isAr \? 'ف` الانتظار' : 'Waiting List'/g, replacement: "isAr ? 'في الانتظار' : 'Waiting List'" },
  { regex: /isAr \? 'تمتلالمعا`نة' : 'Consulted Today'/g, replacement: "isAr ? 'تمت المعاينة' : 'Consulted Today'" },
  { regex: /isAr \? 'مدفوعاتلا `وم' : 'Daily Revenue'/g, replacement: "isAr ? 'مدفوعات اليوم' : 'Daily Revenue'" },
  
  // Tabs
  { regex: /isAr \? 'جدو  المراجعات' : "Today's Schedule"/g, replacement: "isAr ? 'جدول المراجعات' : \"Today's Schedule\"" },
  { regex: /isAr \? 'قاعدةلالب`انات' : "Patient Database"/g, replacement: "isAr ? 'قاعدة البيانات' : \"Patient Database\"" },
  { regex: /isAr \? 'الخدماتلوالأسعار' : "Services م Pricing"/g, replacement: "isAr ? 'الخدمات والأسعار' : \"Services & Pricing\"" },
  { regex: /isAr \? 'تسج`  ملف مر`ض جد`د' : 'Register New Patient File'/g, replacement: "isAr ? 'تسجيل ملف مريض جديد' : 'Register New Patient File'" },
  { regex: /isAr \? 'البحث بالاسم أو السج  الطب`\.\.\.' : 'Search Name or Medical ID\.\.\.'/g, replacement: "isAr ? 'البحث بالاسم أو السجل الطبي...' : 'Search Name or Medical ID...'" },
  
  // Pricing Section
  { regex: /isAr \? 'القائمةلالكاملة' : 'Full Catalog'/g, replacement: "isAr ? 'القائمة الكاملة' : 'Full Catalog'" },
  { regex: /isAr \? 'قائمةلأسعارلالخدماتلالطب`ة' : 'Medical Service Pricing'/g, replacement: "isAr ? 'قائمة أسعار الخدمات الطبية' : 'Medical Service Pricing'" },
  { regex: /isAr \? 'متاح' : 'Available'/g, replacement: "isAr ? 'متاح' : 'Available'" },
  { regex: /isAr \? '`غط` التأم`ن' : 'Insurance OK'/g, replacement: "isAr ? 'يغطي التأمين' : 'Insurance OK'" },
  { regex: /isAr \? 'ا  دفع     دا 9 أ   بطا  ة' : 'Cash or Card'/g, replacement: "isAr ? 'الدفع نقداً أو بالبطاقة' : 'Cash or Card'" },
  { regex: /isAr \? 'أطباءلا `وملوالجدو  ا `وم`' : 'Todays Doctors م Daily Schedule'/g, replacement: "isAr ? 'أطباء اليوم والجدول اليومي' : 'Todays Doctors & Daily Schedule'" },
  { regex: /isAr \? 'عرضلالجدو ' : 'Show Schedule'/g, replacement: "isAr ? 'عرض الجدول' : 'Show Schedule'" },
  { regex: /isAr \? 'جدو  الدواملالأسبوع`   أطباء' : 'Doctors Weekly Staff Schedule'/g, replacement: "isAr ? 'جدول الدوام الأسبوعي للأطباء' : 'Doctors Weekly Staff Schedule'" },
  
  // Flow Management
  { regex: /isAr \? 'إدارة تدفق المرضى' : 'Patient Flow Management'/g, replacement: "isAr ? 'إدارة تدفق المرضى' : 'Patient Flow Management'" },
  { regex: /isAr \? 'ف` الانتظار' : 'Waiting'/g, replacement: "isAr ? 'في الانتظار' : 'Waiting'" },
  { regex: /isAr \? 'عند الطب`ب' : 'With Doctor'/g, replacement: "isAr ? 'عند الطبيب' : 'With Doctor'" },
  { regex: /isAr \? 'مكتم ' : 'Completed'/g, replacement: "isAr ? 'مكتمل' : 'Completed'" },
  { regex: /isAr \? 'معا`نة' : 'View'/g, replacement: "isAr ? 'معاينة' : 'View'" },
  { regex: /isAr \? 'دخو ' : 'Admit'/g, replacement: "isAr ? 'دخول' : 'Admit'" },
  { regex: /isAr \? 'إن!اء' : 'Finish'/g, replacement: "isAr ? 'إنهاء' : 'Finish'" },
  
  // Patient Table
  { regex: /isAr \? 'السج  الطب` \(MRN\)' : 'Medical ID \(MRN\)'/g, replacement: "isAr ? 'السجل الطبي (MRN)' : 'Medical ID (MRN)'" },
  { regex: /isAr \? 'المر`ض' : 'Patient'/g, replacement: "isAr ? 'المريض' : 'Patient'" },
  { regex: /isAr \? 'ا !اتف' : 'Phone'/g, replacement: "isAr ? 'الهاتف' : 'Phone'" },
  { regex: /isAr \? 'الحالة' : 'Status'/g, replacement: "isAr ? 'الحالة' : 'Status'" },
  { regex: /isAr \? 'الطب`ب' : 'Doctor'/g, replacement: "isAr ? 'الطبيب' : 'Doctor'" },
  { regex: /isAr \? 'إجراءات' : 'Actions'/g, replacement: "isAr ? 'إجراءات' : 'Actions'" },
  { regex: /isAr \? 'عرضلالملف' : 'View File'/g, replacement: "isAr ? 'عرض الملف' : 'View File'" },
  
  // Modal Sidebar
  { regex: /modalIsAr \? 'تسج `    مر `ض' : 'Patient Registration'/g, replacement: "modalIsAr ? 'تسجيل مريض' : 'Patient Registration'" },
  { regex: /modalIsAr \? 'إصدار  م  فلطب ` جد `د' : 'Issue New Medical File'/g, replacement: "modalIsAr ? 'إصدار ملف طبي جديد' : 'Issue New Medical File'" },
  { regex: /modalIsAr \? 'Switch to English' : 'تح   `       عرب `ة'/g, replacement: "modalIsAr ? 'Switch to English' : 'تحويل إلى العربية'" },
  
  // Modal Form
  { regex: /modalIsAr \? 'الاسم بالكام  \(بالعرب`ة\)' : 'Full Name \(Arabic\)'/g, replacement: "modalIsAr ? 'الاسم بالكامل (بالعربية)' : 'Full Name (Arabic)'" },
  { regex: /placeholder="أدخ   ا  اس ملرباع `\.\.\."/g, replacement: "placeholder=\"أدخل الاسم رباعي...\"" },
  { regex: /modalIsAr \? 'الاسم بالكام  \(بالإنج `ز`ة\)' : 'Full Name \(English\)'/g, replacement: "modalIsAr ? 'الاسم بالكامل (بالإنجليزية)' : 'Full Name (English)'" },
  { regex: /modalIsAr \? 'رقملا !و`ة \/ الإقامة' : 'National ID'/g, replacement: "modalIsAr ? 'رقم الهوية / الإقامة' : 'National ID'" },
  { regex: /modalIsAr \? '\*1J\. 'DEJD'\/' : 'Birth Date'/g, replacement: "modalIsAr ? 'تاريخ الميلاد' : 'Birth Date'" },
  { regex: /modalIsAr \? 'النوع' : 'Gender'/g, replacement: "modalIsAr ? 'النوع' : 'Gender'" },
  { regex: /modalIsAr \? 'ذكر' : 'Male'/g, replacement: "modalIsAr ? 'ذكر' : 'Male'" },
  { regex: /modalIsAr \? 'أنثى' : 'Female'/g, replacement: "modalIsAr ? 'أنثى' : 'Female'" },
  
  // Complex Lines (Ternary nesting)
  { regex: /isAr \? \(p\.status === 'waiting' \? 'ف ` ا  ا  تظار' : p\.status === 'in-consult' \? '9F\/ 'D7\(J\(' : 'EC\*ED'\) : p\.status/g, replacement: "isAr ? (p.status === 'waiting' ? 'في الانتظار' : p.status === 'in-consult' ? 'عند الطبيب' : 'مكتمل') : p.status" },
  
  // File start diamond fix
  { regex: /^import/g, replacement: "import" },
  
  // Misc
  { regex: /isAr \? `ت ملرفعلا   م  ف!   جاح: \$\{successCount\}, Errors: \$\{errorCount\}`/g, replacement: "isAr ? `تم رفع الملف بنجاح: ${successCount}, أخطاء: ${errorCount}`" },
  { regex: /isAr \? 'آخرلز`ارة:' : 'Last visit:'/g, replacement: "isAr ? 'آخر زيارة:' : 'Last visit:'" },
];

for (const fix of replacements) {
  content = content.replace(fix.regex, fix.replacement);
}

// Global mop-up for remaining solo diamonds/mangles in common words if regex missed some
content = content.replace(/ا بيالاتلا شخصية/g, 'البيانات الشخصية');
content = content.replace(/بيالاتلا تاص /g, 'بيانات التواصل');
content = content.replace(/ا بيالاتلا طبية/g, 'البيانات الطبية');
content = content.replace(/بيالاتلا حجز/g, 'بيانات الحجز');

fs.writeFileSync(filePath, content, 'utf8');
console.log('ReceptionPage repaired successfully.');

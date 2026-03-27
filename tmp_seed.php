<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\JobTitle;
use App\Models\Specialty;

$titles = [
    ['name_ar' => 'استقبال', 'name_en' => 'Reception', 'description_ar' => 'إدارة خدمات الاستقبال والترحيب', 'description_en' => 'Front desk and greeting services', 'status' => 'active'],
    ['name_ar' => 'صيدلي', 'name_en' => 'Pharmacist', 'description_ar' => 'صرف الأدوية وإدارة الصيدلية', 'description_en' => 'Medication dispensing and pharmacy management', 'status' => 'active'],
    ['name_ar' => 'معامل', 'name_en' => 'Laboratory', 'description_ar' => 'إجراء الفحوصات والتحاليل المخبرية', 'description_en' => 'Laboratory testing and analysis', 'status' => 'active'],
    ['name_ar' => 'مسؤول مواعيد', 'name_en' => 'Appointments Specialist', 'description_ar' => 'مسؤول عن جدولة مواعيد الأطباء', 'description_en' => 'Responsible for scheduling doctor appointments', 'status' => 'active'],
    ['name_ar' => 'طبيب', 'name_en' => 'Doctor', 'description_ar' => 'تقديم الرعاية الطبية والتشخيص', 'description_en' => 'Medical care and diagnosis', 'status' => 'active'],
];

foreach ($titles as $title) {
    JobTitle::updateOrCreate(['name_en' => $title['name_en']], $title);
}

$specialties = [
    ['name_ar' => 'أمراض القلب', 'name_en' => 'Cardiology', 'description_ar' => 'قسم أمراض القلب والأوعية الدموية', 'description_en' => 'Cardiology and Cardiovascular diseases', 'status' => 'active'],
    ['name_ar' => 'الجراحة', 'name_en' => 'Surgery', 'description_ar' => 'عمليات جراحية متقدمة ومنظار', 'description_en' => 'Advanced surgical procedures and endoscopies', 'status' => 'active'],
    ['name_ar' => 'الباطنية', 'name_en' => 'Internal Medicine', 'description_ar' => 'تشخيص وعلاج الأمراض الباطنية المزمنة', 'description_en' => 'Diagnosis and treatment of internal diseases', 'status' => 'active'],
    ['name_ar' => 'الأمراض الجلدية', 'name_en' => 'Dermatology', 'description_ar' => 'قسم الأمراض الجلدية والتجميل', 'description_en' => 'Dermatology and Aesthetics', 'status' => 'active'],
    ['name_ar' => 'طب الأطفال', 'name_en' => 'Pediatrics', 'description_ar' => 'قسم صحة الطفل والأطفال', 'description_en' => 'Child Health and Pediatrics', 'status' => 'active'],
];

foreach ($specialties as $spec) {
    Specialty::updateOrCreate(['name_en' => $spec['name_en']], $spec);
}

echo "Seeded successfully!";

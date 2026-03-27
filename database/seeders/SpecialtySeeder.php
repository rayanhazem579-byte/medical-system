<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialties = [
            [
                'name_ar' => 'أمراض القلب',
                'name_en' => 'Cardiology',
                'description_ar' => 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
                'description_en' => 'Diagnosis and treatment of heart conditions',
                'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name_ar' => 'الجراحة العامة',
                'name_en' => 'General Surgery',
                'description_ar' => 'كافة خدمات الجراحة العامة والمناظير',
                'description_en' => 'Comprehensive general surgical services',
                'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name_ar' => 'الباطنية',
                'name_en' => 'Internal Medicine',
                'description_ar' => 'تشخيص وعلاج الأمراض الباطنية المزمنة',
                'description_en' => 'Diagnosis and treatment of internal diseases',
                'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name_ar' => 'الجلدية',
                'name_en' => 'Dermatology',
                'description_ar' => 'علاج الأمراض الجلدية والليزر',
                'description_en' => 'Dermatological and laser treatments',
                'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name_ar' => 'الطب العام',
                'name_en' => 'General Medicine',
                'description_ar' => 'الرعاية الطبية الأولية والفحوصات',
                'description_en' => 'Primary medical care and checkups',
                'status' => 'active',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ];

        foreach ($specialties as $spec) {
            DB::table('specialties')->updateOrInsert(
                ['name_en' => $spec['name_en']],
                $spec
            );
        }
    }
}

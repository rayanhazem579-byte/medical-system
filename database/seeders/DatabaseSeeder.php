<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Service;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with Hospital Data.
     */
    public function run(): void
    {
        // 0. Create Root/Admin User
        User::updateOrCreate(
            ['username' => 'root'],
            [
                'name' => 'مدير النظام',
                'email' => 'admin@alshifa.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin'
            ]
        );

        // 1. Create Specialties (Requested)
        \App\Models\Specialty::updateOrCreate(['name_en' => 'Cardiology'], ['name_ar' => 'القلب', 'description_ar' => 'أمراض القلب والشرايين', 'status' => 'active']);
        \App\Models\Specialty::updateOrCreate(['name_en' => 'Pediatrics'], ['name_ar' => 'الأطفال', 'description_ar' => 'رعاية الأطفال والرضع', 'status' => 'active']);
        \App\Models\Specialty::updateOrCreate(['name_en' => 'Surgery'], ['name_ar' => 'الجراحة', 'description_ar' => 'قسم العمليات الجراحية', 'status' => 'active']);
        \App\Models\Specialty::updateOrCreate(['name_en' => 'General Medicine'], ['name_ar' => 'البشري', 'description_ar' => 'العيادة العامة والطب البشري', 'status' => 'active']);
        \App\Models\Specialty::updateOrCreate(['name_en' => 'Orthopedics'], ['name_ar' => 'جراحة العظام', 'description_ar' => 'علاج العظام والكسور', 'status' => 'active']);

        // 2. Create Departments
        $cardiology = Department::create([
            'name' => 'قسم القلب',
            'head_doctor' => 'د. محمود سمير',
            'location' => 'الطابق الثالث - جناح A',
            'description' => 'متخصص في تشخيص وعلاج أمراض القلب والأوعية الدموية.'
        ]);

        $pediatrics = Department::create([
            'name' => 'قسم الأطفال',
            'head_doctor' => 'د. سارة عمار',
            'location' => 'الطابق الثاني - جناح B',
            'description' => 'رعاية شاملة للأطفال منذ الولادة وحتى المراهقة.'
        ]);

        $surgery = Department::create([
            'name' => 'قسم الجراحة العامة',
            'head_doctor' => 'د. خالد إبراهيم',
            'location' => 'الطابق الأول - جناح C',
            'description' => 'إجراء كافة العمليات الجراحية الدقيقة.'
        ]);

        // 2. Create Services
        Service::create(['name' => 'تخطيط القلب (ECG)', 'description' => 'فحص كهرباء القلب', 'cost' => 150.00, 'department_id' => $cardiology->id]);
        Service::create(['name' => 'كشف أطفال عام', 'description' => 'فحص دوري للأطفال', 'cost' => 100.00, 'department_id' => $pediatrics->id]);
        Service::create(['name' => 'استشارة جراحية', 'description' => 'معاينة ما قبل العملية', 'cost' => 250.00, 'department_id' => $surgery->id]);

        // 3. Create Employees and their User Accounts
        $employeesData = [
            [
                'name' => 'د. ياسر علي',
                'staff_id' => 'EMP-1001',
                'role' => 'doctor',
                'salary' => 15000,
                'hire_date' => '2022-01-10',
                'department_id' => $cardiology->id,
                'email' => 'yasser@alshifa.com'
            ],
            [
                'name' => 'سارة محمد',
                'staff_id' => 'EMP-1002',
                'role' => 'nurse',
                'salary' => 7000,
                'hire_date' => '2023-05-15',
                'department_id' => $pediatrics->id,
                'email' => 'sara@alshifa.com'
            ],
            [
                'name' => 'أحمد حسن',
                'staff_id' => 'EMP-1003',
                'role' => 'receptionist',
                'salary' => 5000,
                'hire_date' => '2024-02-01',
                'department_id' => $surgery->id,
                'email' => 'ahmed@alshifa.com'
            ]
        ];

        foreach ($employeesData as $data) {
            $emp = Employee::create([
                'name' => $data['name'],
                'staff_id' => $data['staff_id'],
                'role' => $data['role'],
                'salary' => $data['salary'],
                'hire_date' => $data['hire_date'],
                'department_id' => $data['department_id']
            ]);

            // Create User account for every employee
            User::create([
                'name' => $data['name'],
                'username' => $data['staff_id'], // Their staff code is their username
                'email' => $data['email'],
                'password' => Hash::make('password123'),
                'role' => $data['role']
            ]);
        }

        // 4. Create Patients
        Patient::create(['name' => 'مريم يوسف', 'condition' => 'مستقر', 'room' => '105', 'doctor_name' => 'د. محمود سمير', 'status' => 'تحت الملاحظة', 'priority' => 'Normal']);
        Patient::create(['name' => 'عمر خالد', 'condition' => 'حرج', 'room' => '202', 'doctor_name' => 'د. ياسر علي', 'status' => 'في العناية', 'priority' => 'High']);
    }
}

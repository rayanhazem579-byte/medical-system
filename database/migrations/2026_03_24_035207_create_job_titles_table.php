<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_titles', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        \Illuminate\Support\Facades\DB::table('job_titles')->insert([
            ['name_ar' => 'الاستقبال', 'name_en' => 'Reception', 'description_ar' => 'إدارة خدمات الاستقبال والترحيب', 'description_en' => 'Front desk and greeting services', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name_ar' => 'صيدلي', 'name_en' => 'Pharmacist', 'description_ar' => 'صرف الأدوية وإدارة الصيدلية', 'description_en' => 'Medication dispensing and pharmacy management', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name_ar' => 'معامل', 'name_en' => 'Laboratory', 'description_ar' => 'إجراء الفحوصات والتحاليل المخبرية', 'description_en' => 'Laboratory testing and analysis', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name_ar' => 'مسؤول مواعيد', 'name_en' => 'Appointments Specialist', 'description_ar' => 'جدولة وتنسيق مواعيد المرضى', 'description_en' => 'Scheduling and coordinating patient appointments', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['name_ar' => 'طبيب', 'name_en' => 'Doctor', 'description_ar' => 'تقديم الرعاية الطبية والتشخيص', 'description_en' => 'Medical care and diagnosis', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_titles');
    }
};

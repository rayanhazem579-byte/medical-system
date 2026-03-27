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
        if (!Schema::hasTable('specialties')) {
            Schema::create('specialties', function (Blueprint $table) {
                $table->id();
                $table->string('name_ar');
                $table->string('name_en');
                $table->text('description_ar')->nullable();
                $table->text('description_en')->nullable();
                $table->string('status')->default('active');
                $table->timestamps();
            });

            \Illuminate\Support\Facades\DB::table('specialties')->insert([
                ['name_ar' => 'أمراض القلب', 'name_en' => 'Cardiology', 'description_ar' => 'قسم أمراض القلب والأوعية الدموية', 'description_en' => 'Cardiology and Cardiovascular diseases', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
                ['name_ar' => 'الأمراض الجلدية', 'name_en' => 'Dermatology', 'description_ar' => 'قسم الأمراض الجلدية والتجميل', 'description_en' => 'Dermatology and Aesthetics', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
                ['name_ar' => 'طب الأطفال', 'name_en' => 'Pediatrics', 'description_ar' => 'قسم صحة الطفل والأطفال', 'description_en' => 'Child Health and Pediatrics', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};

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
        Schema::table('employees', function (Blueprint $table) {
            $table->string('specialty_ar')->nullable()->after('role');
            $table->string('specialty_en')->nullable()->after('specialty_ar');
            $table->string('medical_id')->nullable()->after('staff_id');
            $table->decimal('consultation_fee', 10, 2)->nullable()->after('salary');
            $table->string('phone')->nullable()->after('email');
            $table->json('work_hours')->nullable()->after('hire_date');
            $table->json('working_days')->nullable()->after('work_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn(['specialty_ar', 'specialty_en', 'medical_id', 'consultation_fee', 'phone', 'work_hours', 'working_days']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('patients', function (Blueprint $table) {
            if (!Schema::hasColumn('patients', 'name_ar')) $table->string('name_ar')->nullable();
            if (!Schema::hasColumn('patients', 'file_number')) $table->string('file_number')->unique()->nullable();
            if (!Schema::hasColumn('patients', 'national_id')) $table->string('national_id')->nullable();
            if (!Schema::hasColumn('patients', 'birth_date')) $table->date('birth_date')->nullable();
            if (!Schema::hasColumn('patients', 'age')) $table->integer('age')->nullable();
            if (!Schema::hasColumn('patients', 'gender_en')) $table->string('gender_en')->nullable();
            if (!Schema::hasColumn('patients', 'gender_ar')) $table->string('gender_ar')->nullable();
            if (!Schema::hasColumn('patients', 'blood_type')) $table->string('blood_type')->nullable();
            if (!Schema::hasColumn('patients', 'phone')) $table->string('phone')->nullable();
            if (!Schema::hasColumn('patients', 'address')) $table->text('address')->nullable();
            if (!Schema::hasColumn('patients', 'email')) $table->string('email')->nullable();
            if (!Schema::hasColumn('patients', 'chronic_diseases')) $table->text('chronic_diseases')->nullable();
            if (!Schema::hasColumn('patients', 'drug_allergy')) $table->text('drug_allergy')->nullable();
            if (!Schema::hasColumn('patients', 'last_visit')) $table->date('last_visit')->nullable();
            if (!Schema::hasColumn('patients', 'doctor_name_ar')) $table->string('doctor_name_ar')->nullable();
            if (!Schema::hasColumn('patients', 'dept_ar')) $table->string('dept_ar')->nullable();
            if (!Schema::hasColumn('patients', 'dept_en')) $table->string('dept_en')->nullable();
            if (!Schema::hasColumn('patients', 'payment_status')) $table->string('payment_status')->default('unpaid');
        });
    }

    public function down(): void {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'file_number', 'national_id', 'birth_date', 'age', 'gender_en', 'gender_ar', 'blood_type', 'phone', 'address', 'email', 'chronic_diseases', 'drug_allergy', 'last_visit', 'doctor_name_ar', 'dept_ar', 'dept_en', 'payment_status']);
        });
    }
};

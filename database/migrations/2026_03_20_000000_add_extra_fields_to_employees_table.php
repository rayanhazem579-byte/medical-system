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
            $table->string('job_title')->nullable()->after('role');
            $table->string('status')->default('active')->after('job_title');
            $table->json('shifts')->nullable()->after('working_days');
            $table->string('national_id')->nullable();
            $table->string('license_number')->nullable();
            $table->string('practice_cert')->nullable();
            $table->date('dob')->nullable();
            $table->string('gender')->nullable();
            $table->string('address')->nullable();
            $table->string('degree')->nullable();
            $table->integer('exp_years')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'job_title', 'status', 'shifts', 'national_id', 
                'license_number', 'practice_cert', 'dob', 
                'gender', 'address', 'degree', 'exp_years'
            ]);
        });
    }
};

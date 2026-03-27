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
        if (!Schema::hasTable('lab_requests')) {
            Schema::create('lab_requests', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('patient_id');
                $table->unsignedBigInteger('doctor_id');
                $table->string('test_name_ar')->nullable();
                $table->string('test_name_en')->nullable();
                $table->text('notes')->nullable();
                $table->string('status')->default('pending'); // pending, processing, completed, cancelled
                $table->string('priority')->default('normal'); // normal, urgent
                $table->text('result_text')->nullable();
                $table->string('result_file_url')->nullable();
                $table->timestamps();

                $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
                $table->foreign('doctor_id')->references('id')->on('employees')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_requests');
    }
};

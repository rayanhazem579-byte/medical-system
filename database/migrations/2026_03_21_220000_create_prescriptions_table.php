<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('prescriptions')) {
            Schema::create('prescriptions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
                $table->foreignId('doctor_id')->constrained('employees')->onDelete('cascade');
                $table->string('medicine_name'); // General name or ID link
                $table->string('dosage');
                $table->string('frequency');
                $table->text('notes')->nullable();
                $table->enum('status', ['pending', 'dispensed', 'cancelled'])->default('pending');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};

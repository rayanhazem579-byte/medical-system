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
        // 4. Patients Table
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('condition')->nullable();
            $table->string('room')->nullable();
            $table->string('doctor_name')->nullable();
            $table->string('status')->default('Admitted');
            $table->string('priority')->default('Normal');
            $table->timestamps();
        });


        // 5. Pharmacy Stock Table
        Schema::create('pharmacy_inventory', function (Blueprint $table) {
            $table->id();
            $table->string('medicine_name');
            $table->integer('stock_quantity')->default(0);
            $table->date('expiry_date')->nullable();
            $table->string('category')->nullable(); // e.g., Antibiotic, Painkiller
            $table->timestamps();
        });

        // 6. Payroll Table (Linked to Employees)
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('status')->default('Paid'); // Paid, Pending
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('pharmacy_inventory');
        Schema::dropIfExists('patients');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('services');
        Schema::dropIfExists('departments');
    }
};

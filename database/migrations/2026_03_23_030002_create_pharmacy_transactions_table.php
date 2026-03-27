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
        Schema::create('pharmacy_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('pharmacy_inventories')->onDelete('cascade');
            $table->enum('type', ['in', 'out', 'adjustment'])->comment('Inbound, Outbound, or Manual Adjustment');
            $table->integer('quantity');
            $table->integer('balance_after');
            $table->datetime('transaction_date');
            $table->string('supplier_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_transactions');
    }
};

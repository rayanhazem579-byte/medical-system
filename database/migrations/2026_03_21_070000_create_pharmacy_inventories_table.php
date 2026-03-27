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
        Schema::create('pharmacy_inventories', function (Blueprint $row) {
            $row->id();
            $row->string('medicine_name');
            $row->integer('stock_quantity')->default(0);
            $row->date('expiry_date')->nullable();
            $row->string('category')->nullable();
            $row->decimal('price', 10, 2)->default(0.00);
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_inventories');
    }
};

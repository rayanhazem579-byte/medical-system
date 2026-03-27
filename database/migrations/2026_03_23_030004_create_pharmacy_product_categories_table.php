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
        Schema::create('pharmacy_product_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('name_ar')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed default categories
        \Illuminate\Support\Facades\DB::table('pharmacy_product_categories')->insert([
            ['name' => 'Human Medicines', 'name_ar' => 'أدوية بشرية', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Cosmetics', 'name_ar' => 'مستحضرات تجميل', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nutritional Supplements', 'name_ar' => 'مكملات غذائية', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Medical Supplies', 'name_ar' => 'مستلزمات طبية', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_product_categories');
    }
};

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
        Schema::table('pharmacy_inventories', function (Blueprint $table) {
            $table->string('scientific_name_ar')->nullable()->after('medicine_name_en');
            $table->string('scientific_name_en')->nullable()->after('scientific_name_ar');
            $table->string('dosage_form_ar')->nullable()->after('scientific_name_en');
            $table->string('dosage_form_en')->nullable()->after('dosage_form_ar');
            $table->string('concentration')->nullable()->after('dosage_form_en');
            $table->string('manufacturer_ar')->nullable()->after('concentration');
            $table->string('manufacturer_en')->nullable()->after('manufacturer_ar');
            $table->string('barcode')->nullable()->after('manufacturer_en');
            $table->integer('min_stock')->default(10)->after('stock_quantity');
            $table->decimal('purchase_price', 10, 2)->nullable()->after('price');
            $table->string('batch_number')->nullable()->after('expiry_date');
            $table->boolean('is_refrigerated')->default(false)->after('image_url');
            $table->string('location')->nullable()->after('is_refrigerated');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacy_inventories', function (Blueprint $table) {
            $table->dropColumn([
                'scientific_name_ar',
                'scientific_name_en',
                'dosage_form_ar',
                'dosage_form_en',
                'concentration',
                'manufacturer_ar',
                'manufacturer_en',
                'barcode',
                'min_stock',
                'purchase_price',
                'batch_number',
                'is_refrigerated',
                'location'
            ]);
        });
    }
};

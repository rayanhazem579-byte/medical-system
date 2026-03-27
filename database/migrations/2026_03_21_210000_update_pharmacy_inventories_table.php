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
            // Check existence for safety
            if (!Schema::hasColumn('pharmacy_inventories', 'medicine_name_ar')) {
                if (Schema::hasColumn('pharmacy_inventories', 'medicine_name')) {
                    $table->renameColumn('medicine_name', 'medicine_name_ar');
                } else {
                    $table->string('medicine_name_ar')->nullable();
                }
            }

            if (!Schema::hasColumn('pharmacy_inventories', 'medicine_name_en')) {
                $table->string('medicine_name_en')->nullable()->after('medicine_name_ar');
            }

            if (!Schema::hasColumn('pharmacy_inventories', 'category_ar')) {
                if (Schema::hasColumn('pharmacy_inventories', 'category')) {
                    $table->renameColumn('category', 'category_ar');
                } else {
                    $table->string('category_ar')->nullable();
                }
            }

            if (!Schema::hasColumn('pharmacy_inventories', 'category_en')) {
                $table->string('category_en')->nullable()->after('category_ar');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pharmacy_inventories', function (Blueprint $table) {
            // Drop new columns or rename back
            $table->dropColumn(['medicine_name_en', 'category_en']);
            $table->renameColumn('medicine_name_ar', 'medicine_name');
            $table->renameColumn('category_ar', 'category');
        });
    }
};

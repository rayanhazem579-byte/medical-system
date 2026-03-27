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
        Schema::table('specialties', function (Blueprint $table) {
            if (!Schema::hasColumn('specialties', 'name_ar')) {
                $table->string('name_ar')->after('id');
            }
            if (!Schema::hasColumn('specialties', 'name_en')) {
                $table->string('name_en')->after('name_ar');
            }
            if (!Schema::hasColumn('specialties', 'description_ar')) {
                $table->text('description_ar')->nullable()->after('name_en');
            }
            if (!Schema::hasColumn('specialties', 'description_en')) {
                $table->text('description_en')->nullable()->after('description_ar');
            }
            if (!Schema::hasColumn('specialties', 'status')) {
                $table->string('status')->default('active')->after('description_en');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('specialties', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'name_en', 'description_ar', 'description_en', 'status']);
        });
    }
};

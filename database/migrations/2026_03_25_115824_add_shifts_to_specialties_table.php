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
            $table->string('morning_start')->nullable();
            $table->string('morning_end')->nullable();
            $table->string('evening_start')->nullable();
            $table->string('evening_end')->nullable();
            $table->boolean('is_24h')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('specialties', function (Blueprint $table) {
            //
        });
    }
};

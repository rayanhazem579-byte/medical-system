<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pharma_forms', function (Blueprint $row) {
            $row->id();
            $row->string('name_ar');
            $row->string('name_en');
            $row->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharma_forms');
    }
};

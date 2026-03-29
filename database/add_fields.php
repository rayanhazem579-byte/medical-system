<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

Schema::table('patients', function (Blueprint $table) {
    if (!Schema::hasColumn('patients', 'marital_status')) {
        $table->string('marital_status')->nullable();
    }
    if (!Schema::hasColumn('patients', 'medical_history')) {
        $table->text('medical_history')->nullable();
    }
});
echo "Fields added successfully!\n";

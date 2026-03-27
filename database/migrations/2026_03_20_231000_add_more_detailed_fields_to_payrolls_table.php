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
        Schema::table('payrolls', function (Blueprint $table) {
            $table->decimal('risk_allowance', 12, 2)->default(0)->after('incentives');
            $table->decimal('overtime', 12, 2)->default(0)->after('risk_allowance');
            $table->decimal('penalty_deduction', 12, 2)->default(0)->after('absence_deduction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn(['risk_allowance', 'overtime', 'penalty_deduction']);
        });
    }
};

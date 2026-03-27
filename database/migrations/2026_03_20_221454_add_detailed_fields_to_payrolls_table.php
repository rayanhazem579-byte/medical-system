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
            $table->decimal('basic_salary', 12, 2)->default(0)->after('amount');
            $table->decimal('housing_allowance', 12, 2)->default(0)->after('basic_salary');
            $table->decimal('transport_allowance', 12, 2)->default(0)->after('housing_allowance');
            $table->decimal('incentives', 12, 2)->default(0)->after('transport_allowance');
            $table->decimal('insurance_deduction', 12, 2)->default(0)->after('incentives');
            $table->decimal('taxes_deduction', 12, 2)->default(0)->after('insurance_deduction');
            $table->decimal('absence_deduction', 12, 2)->default(0)->after('taxes_deduction');
            $table->string('month')->nullable()->after('absence_deduction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropColumn([
                'basic_salary', 'housing_allowance', 'transport_allowance', 
                'incentives', 'insurance_deduction', 'taxes_deduction', 
                'absence_deduction', 'month'
            ]);
        });
    }
};

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
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'description_ar')) {
                $table->string('description_ar')->nullable()->after('id');
            }
            if (!Schema::hasColumn('transactions', 'description_en')) {
                $table->string('description_en')->nullable()->after('description_ar');
            }
            if (!Schema::hasColumn('transactions', 'amount')) {
                $table->decimal('amount', 15, 2)->default(0)->after('description_en');
            }
            if (!Schema::hasColumn('transactions', 'type')) {
                $table->enum('type', ['income', 'expense'])->default('income')->after('amount');
            }
            if (!Schema::hasColumn('transactions', 'category_ar')) {
                $table->string('category_ar')->nullable()->after('type');
            }
            if (!Schema::hasColumn('transactions', 'category_en')) {
                $table->string('category_en')->nullable()->after('category_ar');
            }
            if (!Schema::hasColumn('transactions', 'transaction_date')) {
                $table->date('transaction_date')->nullable()->after('category_en');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['description_ar', 'description_en', 'amount', 'type', 'category_ar', 'category_en', 'transaction_date']);
        });
    }
};

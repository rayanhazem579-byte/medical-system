<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Service;
use App\Models\PharmacyInventory;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get statistics for the dashboard.
     */
    public function getStats()
    {
        $now = \Carbon\Carbon::now();
        $today = $now->toDateString();
        
        $thisMonthStart = $now->copy()->startOfMonth();
        $prevMonthStart = $now->copy()->subMonth()->startOfMonth();
        $prevMonthEnd = $now->copy()->subMonth()->endOfMonth();
        
        $thisYearStart = $now->copy()->startOfYear();
        $prevYearStart = $now->copy()->subYear()->startOfYear();
        $prevYearEnd = $now->copy()->subYear()->endOfYear();

        // 1. Patients Growth (This Month vs Last Month)
        $totalPatients = Patient::count();
        $newPatientsThisMonth = Patient::whereDate('created_at', '>=', $thisMonthStart)->count();
        $newPatientsLastMonth = Patient::whereBetween('created_at', [$prevMonthStart, $prevMonthEnd])->count();
        $patientsTrend = $newPatientsLastMonth > 0 ? (($newPatientsThisMonth - $newPatientsLastMonth) / $newPatientsLastMonth) * 100 : ($newPatientsThisMonth > 0 ? 100 : 0);

        // 2. Today's Revenue calculation
        $todayRevenue = \App\Models\Appointment::whereDate('appointment_date', $today)
            ->where('status', '!=', 'cancelled')
            ->sum('final_price');

        // 3. Monthly Income & Trend (Comparative)
        $monthlyIncome = \App\Models\Appointment::whereDate('appointment_date', '>=', $thisMonthStart)
            ->where('status', '!=', 'cancelled')
            ->sum('final_price');
        $prevMonthlyIncome = \App\Models\Appointment::whereBetween('appointment_date', [$prevMonthStart, $prevMonthEnd])
            ->where('status', '!=', 'cancelled')
            ->sum('final_price');
        $monthlyTrend = $prevMonthlyIncome > 0 ? (($monthlyIncome - $prevMonthlyIncome) / $prevMonthlyIncome) * 100 : ($monthlyIncome > 0 ? 100 : 0);

        // 4. Annual Income & Trend (Comparative)
        $annualIncome = \App\Models\Appointment::whereDate('appointment_date', '>=', $thisYearStart)
            ->where('status', '!=', 'cancelled')
            ->sum('final_price');
        $prevAnnualIncome = \App\Models\Appointment::whereBetween('appointment_date', [$prevYearStart, $prevYearEnd])
            ->where('status', '!=', 'cancelled')
            ->sum('final_price');
        $annualTrend = $prevAnnualIncome > 0 ? (($annualIncome - $prevAnnualIncome) / $prevAnnualIncome) * 100 : ($annualIncome > 0 ? 100 : 0);

        // Active cases today
        $activeCases = Patient::whereIn('status', ['waiting', 'in-consult', 'emergency', 'active'])->count();

        // Stock alerts
        $outOfStock = PharmacyInventory::count() > 0 ? PharmacyInventory::where('stock_quantity', 0)->count() : 0;
        $lowStock = PharmacyInventory::count() > 0 ? PharmacyInventory::where('stock_quantity', '>', 0)->where('stock_quantity', '<=', 10)->count() : 0;

        $totalEmployees = Employee::count();
        $totalDepartments = Department::count();
        $totalServices = Service::count();

        $formatTrend = function($val) {
            return ($val >= 0 ? '+' : '') . number_format($val, 1) . '%';
        };

        return response()->json([
            'stats' => [
                [
                    'id' => 1,
                    'titleAr' => 'إجمالي المرضى',
                    'titleEn' => 'Total Patients',
                    'value' => number_format($totalPatients),
                    'trend' => $formatTrend($patientsTrend),
                    'trendUp' => $patientsTrend >= 0,
                    'periodAr' => 'مقارنة بالشهر الماضي',
                    'periodEn' => 'vs last month'
                ],
                [
                    'id' => 2,
                    'titleAr' => 'الدخل الشهري',
                    'titleEn' => 'Monthly Income',
                    'value' => '$' . number_format($monthlyIncome, 0),
                    'trend' => $formatTrend($monthlyTrend),
                    'trendUp' => $monthlyTrend >= 0,
                    'periodAr' => 'مقارنة بالشهر الماضي',
                    'periodEn' => 'vs last month'
                ],
                [
                    'id' => 3,
                    'titleAr' => 'الدخل السنوي',
                    'titleEn' => 'Annual Income',
                    'value' => '$' . number_format($annualIncome, 0),
                    'trend' => $formatTrend($annualTrend),
                    'trendUp' => $annualTrend >= 0,
                    'periodAr' => 'مقارنة بالعام الماضي',
                    'periodEn' => 'vs last year'
                ],
                [
                    'id' => 4,
                    'titleAr' => 'الحالات النشطة',
                    'titleEn' => 'Active Cases',
                    'value' => (string)$activeCases,
                    'trend' => '+0.0%',
                    'trendUp' => true,
                    'periodAr' => 'في الوقت الحالي',
                    'periodEn' => 'currently active'
                ]
            ],
            'counts' => [
                'patients' => $totalPatients,
                'employees' => $totalEmployees,
                'departments' => $totalDepartments,
                'services' => $totalServices,
                'outOfStock' => $outOfStock,
                'lowStock' => $lowStock,
                'todayRevenue' => $todayRevenue,
                'monthlyIncome' => $monthlyIncome,
                'annualIncome' => $annualIncome,
                'prevMonthlyIncome' => $prevMonthlyIncome,
                'prevAnnualIncome' => $prevAnnualIncome,
            ]
        ]);
    }
}

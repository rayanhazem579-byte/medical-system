<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'amount', 'payment_date', 'status', 'basic_salary', 
        'housing_allowance', 'transport_allowance', 'risk_allowance', 'incentives', 
        'overtime', 'commission_rate', 'insurance_deduction', 'taxes_deduction', 
        'absence_deduction', 'penalty_deduction', 'net_salary', 'month'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

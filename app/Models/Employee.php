<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'staff_id', 'medical_id', 'role', 'specialty_ar', 'specialty_en',
        'email', 'phone', 'salary', 'commission_rate', 'consultation_fee', 'hire_date', 'department_id',
        'work_hours', 'working_days', 'job_title', 'status', 'shifts', 'day_shifts', 'shift_type',
        'national_id', 'license_number', 'practice_cert', 'dob', 'gender', 
        'address', 'degree', 'exp_years', 'bank_name', 'bank_account'
    ];

    protected $casts = [
        'work_hours' => 'integer',
        'working_days' => 'array',
        'shifts' => 'array',
        'day_shifts' => 'array',
        'consultation_fee' => 'float',
        'salary' => 'float',
        'commission_rate' => 'float'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function manawbats()
    {
        return $this->hasMany(Manawbat::class);
    }
}

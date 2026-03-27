<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ar',
        'file_number',
        'national_id',
        'birth_date',
        'age',
        'gender_en',
        'gender_ar',
        'blood_type',
        'phone',
        'address',
        'email',
        'chronic_diseases',
        'drug_allergy',
        'last_visit',
        'condition', 
        'room', 
        'doctor_name',
        'doctor_name_ar',
        'dept_ar',
        'dept_en',
        'status',
        'priority',
        'payment_status',
        'marital_status',
        'medical_history',
        'previous_operations'
    ];

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }
}

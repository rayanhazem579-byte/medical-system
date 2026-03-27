<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'status',
        'morning_start',
        'morning_end',
        'evening_start',
        'evening_end',
        'is_24h'
    ];

    protected $casts = [
        'is_24h' => 'boolean'
    ];
}

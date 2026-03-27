<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Manawbat extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'day', 'type', 'start', 'end'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}

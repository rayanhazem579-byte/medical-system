<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'head_doctor', 'location', 'phone', 'email', 'description', 'status'];

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}

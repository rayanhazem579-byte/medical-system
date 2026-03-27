<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacySupplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'name',
        'responsible_person',
        'phone',
        'email',
        'address',
        'product_types',
        'lead_time',
        'payment_method',
        'payment_terms',
        'status',
        'notes'
    ];
}

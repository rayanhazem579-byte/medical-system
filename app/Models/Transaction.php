<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'description_ar', 'description_en', 'amount', 'type', 'category_ar', 'category_en', 'transaction_date'
    ];
}

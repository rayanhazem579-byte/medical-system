<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_id',
        'type',
        'quantity',
        'balance_after',
        'transaction_date',
        'supplier_name',
        'notes'
    ];

    public function medicine()
    {
        return $this->belongsTo(PharmacyInventory::class, 'medicine_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacyInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'medicine_name_ar', 
        'medicine_name_en', 
        'scientific_name_ar',
        'scientific_name_en',
        'dosage_form_ar',
        'dosage_form_en',
        'concentration',
        'manufacturer_ar',
        'manufacturer_en',
        'barcode',
        'stock_quantity', 
        'min_stock',
        'price', 
        'purchase_price',
        'expiry_date', 
        'batch_number',
        'category_ar', 
        'category_en', 
        'image_url',
        'is_refrigerated',
        'location'
    ];
}

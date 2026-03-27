<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PharmacyInventory;
use Illuminate\Support\Facades\Log;

class PharmacyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $medicines = PharmacyInventory::all();
            
            $mapped = $medicines->map(function($m) {
                return [
                    'id' => $m->id,
                    'nameAr' => $m->medicine_name_ar,
                    'nameEn' => $m->medicine_name_en,
                    'scientificNameAr' => $m->scientific_name_ar,
                    'scientificNameEn' => $m->scientific_name_en,
                    'dosageFormAr' => $m->dosage_form_ar,
                    'dosageFormEn' => $m->dosage_form_en,
                    'concentration' => $m->concentration,
                    'manufacturerAr' => $m->manufacturer_ar,
                    'manufacturerEn' => $m->manufacturer_en,
                    'barcode' => $m->barcode,
                    'categoryAr' => $m->category_ar ?? 'عام',
                    'categoryEn' => $m->category_en ?? 'General',
                    'stock' => (int)$m->stock_quantity,
                    'minStock' => (int)$m->min_stock,
                    'price' => (float)$m->price,
                    'purchasePrice' => (float)$m->purchase_price,
                    'expiryDate' => $m->expiry_date,
                    'batchNumber' => $m->batch_number,
                    'image_url' => $m->image_url,
                    'isRefrigerated' => (bool)$m->is_refrigerated,
                    'location' => $m->location,
                    'status' => $m->stock_quantity == 0 ? 'out' : ($m->stock_quantity <= ($m->min_stock ?? 10) ? 'low' : 'available')
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $mapped
            ]);
        } catch (\Exception $e) {
            Log::error('Pharmacy index error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = [
                'medicine_name_ar' => $request->nameAr,
                'medicine_name_en' => $request->nameEn ?? $request->nameAr,
                'scientific_name_ar' => $request->scientificNameAr,
                'scientific_name_en' => $request->scientificNameEn,
                'dosage_form_ar' => $request->dosageFormAr,
                'dosage_form_en' => $request->dosageFormEn,
                'concentration' => $request->concentration,
                'manufacturer_ar' => $request->manufacturerAr,
                'manufacturer_en' => $request->manufacturerEn,
                'barcode' => $request->barcode,
                'category_ar' => $request->categoryAr,
                'category_en' => $request->categoryEn ?? $request->categoryAr,
                'stock_quantity' => $request->stock ?? 0,
                'min_stock' => $request->minStock ?? 10,
                'price' => $request->price,
                'purchase_price' => $request->purchasePrice,
                'expiry_date' => $request->expiryDate,
                'batch_number' => $request->batchNumber,
                'is_refrigerated' => $request->isRefrigerated ?? false,
                'location' => $request->location,
            ];

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $name = time().'.'.$image->getClientOriginalExtension();
                $image->move(public_path('/uploads/pharmacy'), $name);
                $data['image_url'] = '/uploads/pharmacy/'.$name;
            }

            $medicine = PharmacyInventory::create($data);

            // Record initial transaction
            if ($medicine->stock_quantity > 0) {
                \App\Models\PharmacyTransaction::create([
                    'medicine_id' => $medicine->id,
                    'type' => 'in',
                    'quantity' => $medicine->stock_quantity,
                    'balance_after' => $medicine->stock_quantity,
                    'transaction_date' => now(),
                    'supplier_name' => $request->supplierName ?? 'Initial Stock',
                    'notes' => 'Opening balance'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $medicine,
                'message' => 'Medicine added successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Pharmacy store error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $medicine = PharmacyInventory::findOrFail($id);
            $oldStock = $medicine->stock_quantity;

            $map = [
                'nameAr' => 'medicine_name_ar',
                'nameEn' => 'medicine_name_en',
                'scientificNameAr' => 'scientific_name_ar',
                'scientificNameEn' => 'scientific_name_en',
                'dosageFormAr' => 'dosage_form_ar',
                'dosageFormEn' => 'dosage_form_en',
                'concentration' => 'concentration',
                'manufacturerAr' => 'manufacturer_ar',
                'manufacturerEn' => 'manufacturer_en',
                'barcode' => 'barcode',
                'categoryAr' => 'category_ar',
                'categoryEn' => 'category_en',
                'stock' => 'stock_quantity',
                'minStock' => 'min_stock',
                'price' => 'price',
                'purchasePrice' => 'purchase_price',
                'expiryDate' => 'expiry_date',
                'batchNumber' => 'batch_number',
                'isRefrigerated' => 'is_refrigerated',
                'location' => 'location'
            ];

            foreach ($map as $reqKey => $dbKey) {
                if ($request->has($reqKey)) {
                    $medicine->$dbKey = $request->$reqKey;
                }
            }

            $medicine->save();

            // Record transaction if stock changed
            if ($request->has('stock') && $request->stock != $oldStock) {
                $diff = $request->stock - $oldStock;
                \App\Models\PharmacyTransaction::create([
                    'medicine_id' => $medicine->id,
                    'type' => $diff > 0 ? 'in' : 'out',
                    'quantity' => abs($diff),
                    'balance_after' => $medicine->stock_quantity,
                    'transaction_date' => now(),
                    'notes' => 'Manual stock update'
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $medicine,
                'message' => 'Medicine updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function transactions()
    {
        try {
            $transactions = \App\Models\PharmacyTransaction::with('medicine')->latest()->get();
            return response()->json([
                'success' => true,
                'data' => $transactions
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $medicine = PharmacyInventory::findOrFail($id);
            $medicine->delete();
            return response()->json(['success' => true, 'message' => 'Medicine deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function uploadImage(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $item = PharmacyInventory::findOrFail($id);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = time().'.'.$image->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/pharmacy');
            $image->move($destinationPath, $name);
            
            $item->image_url = '/uploads/pharmacy/'.$name;
            $item->save();

            return response()->json([
                'message' => 'Image uploaded successfully',
                'image_url' => $item->image_url
            ]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }
    public function dispense(Request $request)
    {
        try {
            $request->validate([
                'items' => 'required|array|min:1',
                'items.*.medicine_id' => 'required|exists:pharmacy_inventories,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'prescription_id' => 'nullable|integer',
                'patient_id' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            return \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
                $processedItems = [];
                
                foreach ($request->items as $item) {
                    $medicine = PharmacyInventory::findOrFail($item['medicine_id']);

                    if ($medicine->stock_quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for " . $medicine->medicine_name_en);
                    }

                    $medicine->stock_quantity -= $item['quantity'];
                    $medicine->save();

                    \App\Models\PharmacyTransaction::create([
                        'medicine_id' => $medicine->id,
                        'type' => 'out',
                        'quantity' => $item['quantity'],
                        'balance_after' => $medicine->stock_quantity,
                        'transaction_date' => now(),
                        'notes' => $request->notes ?? ($request->prescription_id ? 'Prescription Dispensing' : 'Cash Sale Item')
                    ]);

                    $processedItems[] = [
                        'id' => $medicine->id,
                        'nameAr' => $medicine->medicine_name_ar,
                        'nameEn' => $medicine->medicine_name_en,
                        'quantity' => $item['quantity'],
                        'price' => (float)$item['price'],
                        'dosageFormAr' => $medicine->dosage_form_ar,
                        'dosageFormEn' => $medicine->dosage_form_en,
                        'concentration' => $medicine->concentration
                    ];
                }

                if ($request->prescription_id) {
                    \App\Models\Prescription::where('id', $request->prescription_id)->update(['status' => 'completed']);
                }

                return response()->json([
                    'success' => true,
                    'items' => $processedItems,
                    'message' => 'Medications dispensed successfully'
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Pharmacy dispense error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}

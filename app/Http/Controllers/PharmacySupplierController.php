<?php

namespace App\Http\Controllers;

use App\Models\PharmacySupplier;
use Illuminate\Http\Request;

class PharmacySupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $suppliers = PharmacySupplier::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_id' => 'required|string|max:255|unique:pharmacy_suppliers,supplier_id',
            'responsible_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'product_types' => 'nullable|string',
            'lead_time' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        $supplier = PharmacySupplier::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Supplier created successfully',
            'data' => $supplier
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PharmacySupplier $supplier)
    {
        return response()->json([
            'success' => true,
            'data' => $supplier
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $supplier = PharmacySupplier::findOrFail($id);
        
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'supplier_id' => 'sometimes|required|string|max:255|unique:pharmacy_suppliers,supplier_id,' . $supplier->id,
            'responsible_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'product_types' => 'nullable|string',
            'lead_time' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'payment_terms' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'notes' => 'nullable|string'
        ]);

        $supplier->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Supplier updated successfully',
            'data' => $supplier
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $supplier = PharmacySupplier::findOrFail($id);
        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ]);
    }

    /**
     * Remove multiple resources from storage.
     */
    public function deleteBatch(Request $request)
    {
        $ids = $request->ids;
        if (!is_array($ids) || empty($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'No IDs provided'
            ], 400);
        }

        PharmacySupplier::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Suppliers deleted successfully'
        ]);
    }
}

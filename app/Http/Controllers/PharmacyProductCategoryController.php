<?php

namespace App\Http\Controllers;

use App\Models\PharmacyProductCategory;
use Illuminate\Http\Request;

class PharmacyProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = PharmacyProductCategory::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:pharmacy_product_categories,name',
            'name_ar' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        $category = PharmacyProductCategory::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PharmacyProductCategory $category)
    {
        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = PharmacyProductCategory::findOrFail($id);
        
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:pharmacy_product_categories,name,' . $category->id,
            'name_ar' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        $category->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = PharmacyProductCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}

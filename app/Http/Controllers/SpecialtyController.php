<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialtyController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Specialty::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'morning_start' => 'nullable|string',
            'morning_end' => 'nullable|string',
            'evening_start' => 'nullable|string',
            'evening_end' => 'nullable|string',
            'is_24h' => 'nullable|boolean'
        ]);

        $specialty = Specialty::create($validated);

        return response()->json([
            'success' => true,
            'data' => $specialty
        ], 201);
    }

    public function show($id)
    {
        $specialty = Specialty::find($id);
        if (!$specialty) return response()->json(['success' => false, 'message' => 'Specialty not found'], 404);
        return response()->json(['success' => true, 'data' => $specialty]);
    }

    public function update(Request $request, $id)
    {
        $specialty = Specialty::find($id);
        if (!$specialty) return response()->json(['success' => false, 'message' => 'Specialty not found'], 404);

        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'morning_start' => 'nullable|string',
            'morning_end' => 'nullable|string',
            'evening_start' => 'nullable|string',
            'evening_end' => 'nullable|string',
            'is_24h' => 'nullable|boolean'
        ]);

        \Illuminate\Support\Facades\Log::info("Updating Specialty ID: {$id}", $validated);
        $specialty->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث التخصص بنجاح',
            'data' => $specialty
        ]);
    }

    public function destroy($id)
    {
        $specialty = Specialty::find($id);
        if (!$specialty) return response()->json(['success' => false, 'message' => 'Specialty not found'], 404);
        $specialty->delete();
        return response()->json(['success' => true, 'message' => 'Specialty deleted']);
    }
}

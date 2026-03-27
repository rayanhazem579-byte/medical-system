<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = MedicalRecord::with(['doctor', 'patient']);
        
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:employees,id',
            'diagnosis' => 'required|string',
            'treatment' => 'nullable|string',
            'notes' => 'nullable|string',
            'record_date' => 'nullable|date',
        ]);

        $record = MedicalRecord::create($validated);

        return response()->json([
            'success' => true,
            'data' => $record,
            'message' => 'Medical record created successfully'
        ]);
    }

    public function show($id)
    {
        $record = MedicalRecord::with(['doctor', 'patient'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $record]);
    }

    public function update(Request $request, $id)
    {
        $record = MedicalRecord::findOrFail($id);
        
        $validated = $request->validate([
            'diagnosis' => 'sometimes|string',
            'treatment' => 'sometimes|string',
            'notes' => 'sometimes|string',
        ]);

        $record->update($validated);

        return response()->json(['success' => true, 'data' => $record]);
    }

    public function destroy($id)
    {
        $record = MedicalRecord::findOrFail($id);
        $record->delete();
        return response()->json(['success' => true, 'message' => 'Medical record deleted']);
    }
}

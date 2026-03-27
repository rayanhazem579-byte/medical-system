<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prescription;
use App\Models\PharmacyInventory;
use Illuminate\Support\Facades\Log;

class PrescriptionController extends Controller
{
    public function index()
    {
        try {
            $prescriptions = Prescription::with(['patient', 'doctor'])
                ->where('status', 'pending')
                ->get();

            $mapped = $prescriptions->map(function($p) {
                return [
                    'id' => $p->id,
                    'patientId' => $p->patient->patient_id ?? 'P-'.$p->patient_id,
                    'patientName' => $p->patient->full_name_ar ?? $p->patient->full_name,
                    'medication' => $p->medicine_name,
                    'dosage' => $p->dosage,
                    'frequency' => $p->frequency,
                    'doctorName' => $p->doctor->name_ar ?? $p->doctor->name,
                    'date' => $p->created_at->format('Y-m-d H:i'),
                    'status' => $p->status
                ];
            });

            return response()->json(['success' => true, 'data' => $mapped]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:employees,id',
            'medicine_name' => 'required|string',
            'dosage' => 'required|string',
            'frequency' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $prescription = Prescription::create($validated);
            return response()->json(['success' => true, 'data' => $prescription]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $prescription = Prescription::findOrFail($id);
            $oldStatus = $prescription->status;
            $newStatus = $request->status;

            $prescription->update(['status' => $newStatus]);

            // If dispensed, decrease stock
            if ($newStatus === 'dispensed' && $oldStatus !== 'dispensed') {
                // Try to find medicine by name (Ar or En)
                $medicine = PharmacyInventory::where('medicine_name_ar', $prescription->medicine_name)
                    ->orWhere('medicine_name_en', $prescription->medicine_name)
                    ->first();

                if ($medicine) {
                    $medicine->stock_quantity = max(0, $medicine->stock_quantity - 1);
                    $medicine->save();
                }
            }

            return response()->json(['success' => true, 'message' => 'Prescription updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}

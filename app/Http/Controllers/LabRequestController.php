<?php

namespace App\Http\Controllers;

use App\Models\LabRequest;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = LabRequest::with(['patient', 'doctor'])->orderBy('created_at', 'desc');
        
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
            return response()->json([
                'success' => true,
                'data' => $query->get()
            ]);
        }

        return $query->paginate(15);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:employees,id',
            'test_name_ar' => 'required|string',
            'test_name_en' => 'required|string',
            'notes' => 'nullable|string',
            'priority' => 'nullable|string|in:normal,urgent',
        ]);

        $labRequest = LabRequest::create($data);

        return response()->json([
            'success' => true,
            'data' => $labRequest
        ]);
    }

    public function update(Request $request, $id)
    {
        $labRequest = LabRequest::findOrFail($id);
        
        $data = $request->validate([
            'status' => 'nullable|string|in:pending,processing,completed,cancelled',
            'result_text' => 'nullable|string',
            'result_file_url' => 'nullable|string',
        ]);

        $labRequest->update($data);

        // If completed, automatically create a medical record for the patient
        if ($labRequest->status === 'completed') {
            MedicalRecord::create([
                'patient_id' => $labRequest->patient_id,
                'doctor_id' => $labRequest->doctor_id,
                'diagnosis' => 'Lab Result: ' . ($labRequest->test_name_en ?? $labRequest->test_name_ar),
                'treatment' => 'Result: ' . $labRequest->result_text . ($labRequest->result_file_url ? ' (File attached)' : ''),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $labRequest
        ]);
    }

    public function uploadResult(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $name = 'lab_result_' . time() . '_' . $id . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/lab_results');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $name);
            $fileUrl = '/uploads/lab_results/' . $name;

            $labReq = LabRequest::findOrFail($id);
            $labReq->update(['result_file_url' => $fileUrl]);

            return response()->json([
                'success' => true,
                'file_url' => $fileUrl
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
}

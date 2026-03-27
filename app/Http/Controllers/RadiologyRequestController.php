<?php

namespace App\Http\Controllers;

use App\Models\RadiologyRequest;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class RadiologyRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = RadiologyRequest::with(['patient', 'doctor'])->orderBy('created_at', 'desc');
        
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
            'scan_name_ar' => 'required|string',
            'scan_name_en' => 'required|string',
            'notes' => 'nullable|string',
            'priority' => 'nullable|string|in:normal,urgent',
        ]);

        $radiologyRequest = RadiologyRequest::create($data);

        return response()->json([
            'success' => true,
            'data' => $radiologyRequest
        ]);
    }

    public function update(Request $request, $id)
    {
        $radiologyRequest = RadiologyRequest::findOrFail($id);
        
        $data = $request->validate([
            'status' => 'nullable|string|in:pending,processing,completed,cancelled',
            'result_text' => 'nullable|string',
            'result_file_url' => 'nullable|string',
        ]);

        $radiologyRequest->update($data);

        // If completed, automatically create a medical record for the patient
        if ($radiologyRequest->status === 'completed') {
            MedicalRecord::create([
                'patient_id' => $radiologyRequest->patient_id,
                'doctor_id' => $radiologyRequest->doctor_id,
                'diagnosis' => 'Radiology Scan Result: ' . ($radiologyRequest->scan_name_en ?? $radiologyRequest->scan_name_ar),
                'treatment' => 'Result: ' . $radiologyRequest->result_text . ($radiologyRequest->result_file_url ? ' (File attached)' : ''),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $radiologyRequest
        ]);
    }

    public function uploadResult(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $name = 'radiology_result_' . time() . '_' . $id . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/radiology_results');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $name);
            $fileUrl = '/uploads/radiology_results/' . $name;

            $radiologyReq = RadiologyRequest::findOrFail($id);
            $radiologyReq->update(['result_file_url' => $fileUrl]);

            return response()->json([
                'success' => true,
                'file_url' => $fileUrl
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }
    public function finalizeRadiology(Request $request, $id)
    {
        $radiologyReq = RadiologyRequest::findOrFail($id);
        
        $request->validate([
            'result_text' => 'required|string',
        ]);

        $radiologyReq->update([
            'result_text' => $request->result_text,
            'status' => 'completed'
        ]);

        // Automatically create medical record entry
        MedicalRecord::create([
            'patient_id' => $radiologyReq->patient_id,
            'doctor_id' => $radiologyReq->doctor_id,
            'diagnosis' => 'Radiology Result: ' . ($radiologyReq->scan_name_en ?? $radiologyReq->scan_name_ar),
            'treatment' => 'Report: ' . $radiologyReq->result_text . ($radiologyReq->result_file_url ? ' (File attached: ' . $radiologyReq->result_file_url . ')' : ''),
        ]);

        return response()->json([
            'success' => true,
            'data' => $radiologyReq
        ]);
    }
}

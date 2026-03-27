<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PatientController extends Controller
{
    /**
     * Display a listing of the patients.
     * Ordered by MRN as requested.
     */
    public function index()
    {
        // Sort by file_number (MRN) DESC to show newest first
        $patients = Patient::orderBy('file_number', 'desc')->get();
        Log::info('Fetched ' . $patients->count() . ' patients from DB');
        
        // Map database snake_case to frontend camelCase
        $mappedData = $patients->map(function ($patient) {
            return [
                "id" => $patient->id,
                "name" => $patient->name,
                "nameAr" => $patient->name_ar,
                "fileNumber" => $patient->file_number,
                "nationalId" => $patient->national_id,
                "birthDate" => $patient->birth_date,
                "age" => $patient->age,
                "genderEn" => $patient->gender_en,
                "genderAr" => $patient->gender_ar,
                "bloodType" => $patient->blood_type,
                "phone" => $patient->phone,
                "address" => $patient->address,
                "email" => $patient->email,
                "chronicDiseases" => $patient->chronic_diseases,
                "drugAllergy" => $patient->drug_allergy,
                "lastVisit" => $patient->last_visit,
                "status" => $patient->status,
                "paymentStatus" => $patient->payment_status,
                "doctorEn" => $patient->doctor_name,
                "doctorAr" => $patient->doctor_name_ar ?? 'غير محدد',
                "deptAr" => $patient->dept_ar,
                "deptEn" => $patient->dept_en,
                "maritalStatus" => $patient->marital_status,
                "medicalHistory" => $patient->medical_history,
                "previousOperations" => $patient->previous_operations,
                "history" => []
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $mappedData,
            'count' => $patients->count()
        ]);
    }

    /**
     * Store a newly created patient record.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'nullable|string',
                'nameAr' => 'nullable|string',
                'nationalId' => 'nullable|string',
                'birthDate' => 'nullable|string',
                'age' => 'nullable|integer',
                'genderEn' => 'nullable|string',
                'genderAr' => 'nullable|string',
                'bloodType' => 'nullable|string',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'email' => 'nullable|email',
                'chronicDiseases' => 'nullable|string',
                'drugAllergy' => 'nullable|string',
                'lastVisit' => 'nullable|string',
                'status' => 'nullable|string',
                'paymentStatus' => 'nullable|string',
                'doctorEn' => 'nullable|string',
                'doctorAr' => 'nullable|string',
                'deptAr' => 'nullable|string',
                'deptEn' => 'nullable|string',
                "maritalStatus" => 'nullable|string',
                "medicalHistory" => 'nullable|string',
                "previousOperations" => 'nullable|string',
            ]);

            // Auto-generate MRN (file_number)
            $currentYear = date('Y');
            $count = Patient::whereYear('created_at', $currentYear)->count() + 1;
            $newMRN = $count . '-' . $currentYear;

            // Ensure uniqueness
            while (Patient::where('file_number', $newMRN)->exists()) {
                $count++;
                $newMRN = $count . '-' . $currentYear;
            }

            $patient = Patient::create([
                'name' => $data['name'] ?? 'N/A',
                'name_ar' => $data['nameAr'],
                'file_number' => $newMRN,
                'national_id' => $data['nationalId'],
                'birth_date' => $data['birthDate'],
                'age' => $data['age'],
                'gender_en' => $data['genderEn'],
                'gender_ar' => $data['genderAr'],
                'blood_type' => $data['bloodType'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'email' => $data['email'],
                'chronic_diseases' => $data['chronicDiseases'],
                'drug_allergy' => $data['drugAllergy'],
                'last_visit' => $data['lastVisit'],
                'status' => $data['status'] ?? 'waiting',
                'payment_status' => $data['paymentStatus'] ?? 'unpaid',
                'doctor_name' => $data['doctorEn'],
                'doctor_name_ar' => $data['doctorAr'],
                'dept_ar' => $data['deptAr'],
                'dept_en' => $data['deptEn'],
                "marital_status" => $data['maritalStatus'],
                "medical_history" => $data['medicalHistory'],
                "previous_operations" => $data['previousOperations'],
            ]);

            // Automatically create appointment if doctor or service picked
            $docId = $request->doctorId ?? $request->doctor_id;
            $srvId = $request->serviceId ?? $request->service_id;

            if ($docId || $srvId) {
                $price = $request->servicePrice ?? $request->price ?? 0;
                
                // Optional: Fallback to actual service cost if price is not provided but service_id is
                if ($price == 0 && $srvId) {
                    $service = \App\Models\Service::find($srvId);
                    if ($service) {
                        $price = $service->cost;
                    }
                }

                Appointment::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $docId,
                    'service_id' => $srvId,
                    'appointment_date' => $request->appointmentDate ?? Carbon::now()->toDateString(),
                    'appointment_time' => Carbon::now()->format('H:i'),
                    'price' => $price,
                    'discount' => 0,
                    'final_price' => $price,
                    'status' => 'waiting',
                ]);
                Log::debug('Auto Appointment Created for Patient: ' . $patient->id . ' | Price: ' . $price . ' | Service: ' . ($srvId ?? 'N/A'));
            }

            Log::debug('Patient Created: ' . $patient->id . ' with MRN: ' . $newMRN);

            return response()->json([
                'success' => true,
                'message' => 'Patient created successfully',
                'data' => $patient,
                'new_mrn' => $newMRN
            ], 201);

        } catch (\Exception $e) {
            Log::error('Patient Store Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create patient: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $patient]);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        $data = $request->validate([
            'name' => 'nullable|string',
            'nameAr' => 'nullable|string',
            'nationalId' => 'nullable|string',
            'birthDate' => 'nullable|string',
            'age' => 'nullable|integer',
            'genderEn' => 'nullable|string',
            'genderAr' => 'nullable|string',
            'bloodType' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'email' => 'nullable|email',
            'chronicDiseases' => 'nullable|string',
            'drugAllergy' => 'nullable|string',
            'maritalStatus' => 'nullable|string',
            'medicalHistory' => 'nullable|string',
            'previousOperations' => 'nullable|string',
            'status' => 'nullable|string',
            'paymentStatus' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        if (isset($data['nameAr'])) $updateData['name_ar'] = $data['nameAr'];
        if (isset($data['nationalId'])) $updateData['national_id'] = $data['nationalId'];
        if (isset($data['birthDate'])) $updateData['birth_date'] = $data['birthDate'];
        if (isset($data['age'])) $updateData['age'] = $data['age'];
        if (isset($data['genderEn'])) $updateData['gender_en'] = $data['genderEn'];
        if (isset($data['genderAr'])) $updateData['gender_ar'] = $data['genderAr'];
        if (isset($data['bloodType'])) $updateData['blood_type'] = $data['bloodType'];
        if (isset($data['phone'])) $updateData['phone'] = $data['phone'];
        if (isset($data['address'])) $updateData['address'] = $data['address'];
        if (isset($data['email'])) $updateData['email'] = $data['email'];
        if (isset($data['chronicDiseases'])) $updateData['chronic_diseases'] = $data['chronicDiseases'];
        if (isset($data['drugAllergy'])) $updateData['drug_allergy'] = $data['drugAllergy'];
        if (isset($data['maritalStatus'])) $updateData['marital_status'] = $data['maritalStatus'];
        if (isset($data['medicalHistory'])) $updateData['medical_history'] = $data['medicalHistory'];
        if (isset($data['previousOperations'])) $updateData['previous_operations'] = $data['previousOperations'];
        if (isset($data['status'])) $updateData['status'] = $data['status'];
        if (isset($data['paymentStatus'])) $updateData['payment_status'] = $data['paymentStatus'];

        $patient->update($updateData);
        
        return response()->json(['success' => true, 'message' => 'Patient updated', 'data' => $patient]);
    }

    public function destroy($id)
    {
        $patient = Patient::find($id);
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        $patient->delete();
        return response()->json(['success' => true, 'message' => 'Patient deleted']);
    }

    /**
     * Clear all patients and appointments.
     */
    public function truncate()
    {
        try {
            // Disable foreign key checks for truncation
            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            
            \App\Models\Appointment::truncate();
            \App\Models\MedicalRecord::truncate();
            \App\Models\Patient::truncate();
            
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

            return response()->json(['success' => true, 'message' => 'Database cleared successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
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
        DB::beginTransaction();
        try {
            $input = $request->all();
            foreach ($input as $key => $value) {
                if (is_string($value) && trim($value) === '') {
                    $input[$key] = null;
                }
            }
            $input = $request->all();
            foreach ($input as $key => $value) {
                if (is_string($value) && trim($value) === '') {
                    $input[$key] = null;
                }
            }

            $data = \Illuminate\Support\Facades\Validator::make($input, [
                'name' => 'nullable|string',
                'nameEn' => 'nullable|string',
                'nameAr' => 'nullable|string',
                'nationalId' => 'nullable|string',
                'birthDate' => 'nullable|date',
                'age' => 'nullable|integer',
                'gender' => 'nullable|string',
                'genderEn' => 'nullable|string',
                'genderAr' => 'nullable|string',
                'bloodType' => 'nullable|string',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'email' => 'nullable|email',
                'chronicDiseases' => 'nullable|string',
                'drugAllergy' => 'nullable|string',
                'lastVisit' => 'nullable|date',
                'status' => 'nullable|string',
                'paymentStatus' => 'nullable|string',
                'doctorEn' => 'nullable|string',
                'doctorAr' => 'nullable|string',
                'deptAr' => 'nullable|string',
                'deptEn' => 'nullable|string',
                "maritalStatus" => 'nullable|string',
                "medicalHistory" => 'nullable|string',
                "previousOperations" => 'nullable|string',
            ])->validate();

            // Auto-generate MRN (file_number)
            $currentYear = date('Y');
            $count = Patient::whereYear('created_at', $currentYear)->count() + 1;
            $newMRN = $count . '-' . $currentYear;

            // Ensure uniqueness
            while (Patient::where('file_number', $newMRN)->exists()) {
                $count++;
                $newMRN = $count . '-' . $currentYear;
            }

            $patientName = $data['name'] ?? $data['nameEn'] ?? $data['nameAr'] ?? 'N/A';
            $patientGenderEn = $data['genderEn'] ?? $data['gender'] ?? null;
            $patientGenderAr = $data['genderAr'] ?? null;

            $patient = Patient::create([
                'name' => $patientName,
                'name_ar' => $data['nameAr'] ?? null,
                'file_number' => $newMRN,
                'national_id' => $data['nationalId'] ?? null,
                'birth_date' => $data['birthDate'] ?? null,
                'age' => $data['age'] ?? null,
                'gender_en' => $patientGenderEn,
                'gender_ar' => $patientGenderAr,
                'blood_type' => $data['bloodType'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'email' => $data['email'] ?? null,
                'chronic_diseases' => $data['chronicDiseases'] ?? null,
                'drug_allergy' => $data['drugAllergy'] ?? null,
                'last_visit' => $data['lastVisit'] ?? null,
                'status' => $data['status'] ?? 'waiting',
                'payment_status' => $data['paymentStatus'] ?? 'unpaid',
                'doctor_name' => $data['doctorEn'] ?? null,
                'doctor_name_ar' => $data['doctorAr'] ?? null,
                'dept_ar' => $data['deptAr'] ?? null,
                'dept_en' => $data['deptEn'] ?? null,
                "marital_status" => $data['maritalStatus'] ?? null,
                "medical_history" => $data['medicalHistory'] ?? null,
                "previous_operations" => $data['previousOperations'] ?? null,
            ]);

            // Automatically create appointment if doctor or service picked
            $docId = $request->input('doctor_id') ?: $request->input('doctorId');
            $srvId = $request->input('service_id') ?: $request->input('serviceId');
            $docId = $docId !== '' ? (int) $docId : null;
            $srvId = $srvId !== '' ? (int) $srvId : null;

            if ($docId || $srvId) {
                $price = $request->input('price') ?? $request->input('servicePrice') ?? 0;
                if (is_string($price)) {
                    $price = floatval($price);
                }

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
                    'appointment_date' => $request->input('appointment_date') ?? $request->input('appointmentDate') ?? Carbon::now()->toDateString(),
                    'appointment_time' => $request->input('appointment_time') ?? $request->input('appointmentTime') ?? Carbon::now()->format('H:i'),
                    'shift' => $request->input('shift') ?? $request->shift ?? 'morning',
                    'status' => 'waiting',
                    'price' => $price,
                    'discount' => 0,
                    'final_price' => $price,
                ]);
                Log::debug('Auto Appointment Created for Patient: ' . $patient->id . ' | Price: ' . $price . ' | Service: ' . ($srvId ?? 'N/A'));
            }

            Log::debug('Patient Created: ' . $patient->id . ' with MRN: ' . $newMRN);

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Patient created successfully',
                'data' => $patient,
                'new_mrn' => $newMRN
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Patient Validation Error: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation Error: ' . implode(', ', $e->validator->errors()->all())
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
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

        $input = $request->all();
        foreach ($input as $key => $value) {
            if (is_string($value) && trim($value) === '') {
                $input[$key] = null;
            }
        }
        $input = $request->all();
        foreach ($input as $key => $value) {
            if (is_string($value) && trim($value) === '') {
                $input[$key] = null;
            }
        }

        $data = \Illuminate\Support\Facades\Validator::make($input, [
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
        ])->validate();

        $updateData = [];
        if (isset($data['name']))
            $updateData['name'] = $data['name'];
        if (isset($data['nameAr']))
            $updateData['name_ar'] = $data['nameAr'];
        if (isset($data['nationalId']))
            $updateData['national_id'] = $data['nationalId'];
        if (isset($data['birthDate']))
            $updateData['birth_date'] = $data['birthDate'];
        if (isset($data['age']))
            $updateData['age'] = $data['age'];
        if (isset($data['genderEn']))
            $updateData['gender_en'] = $data['genderEn'];
        if (isset($data['genderAr']))
            $updateData['gender_ar'] = $data['genderAr'];
        if (isset($data['bloodType']))
            $updateData['blood_type'] = $data['bloodType'];
        if (isset($data['phone']))
            $updateData['phone'] = $data['phone'];
        if (isset($data['address']))
            $updateData['address'] = $data['address'];
        if (isset($data['email']))
            $updateData['email'] = $data['email'];
        if (isset($data['chronicDiseases']))
            $updateData['chronic_diseases'] = $data['chronicDiseases'];
        if (isset($data['drugAllergy']))
            $updateData['drug_allergy'] = $data['drugAllergy'];
        if (isset($data['maritalStatus']))
            $updateData['marital_status'] = $data['maritalStatus'];
        if (isset($data['medicalHistory']))
            $updateData['medical_history'] = $data['medicalHistory'];
        if (isset($data['previousOperations']))
            $updateData['previous_operations'] = $data['previousOperations'];
        if (isset($data['status']))
            $updateData['status'] = $data['status'];
        if (isset($data['paymentStatus']))
            $updateData['payment_status'] = $data['paymentStatus'];

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

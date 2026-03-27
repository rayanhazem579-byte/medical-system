<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index()
    {
        // Get appointments for today
        $today = Carbon::today()->toDateString();
        $appointments = Appointment::with(['patient', 'doctor', 'service'])
            ->whereDate('appointment_date', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        $mapped = $appointments->map(function ($app) {
            return [
                'id' => $app->id,
                'patientId' => $app->patient_id,
                'patientName' => $app->patient->name ?? 'N/A',
                'patientNameAr' => $app->patient->name_ar ?? 'N/A',
                'service' => $app->service->name ?? 'N/A',
                'serviceAr' => $app->service->name_ar ?? 'N/A',
                'doctor' => $app->doctor->name ?? 'N/A',
                'doctorAr' => $app->doctor->name_ar ?? 'N/A',
                'time' => $app->appointment_time ?? $app->created_at->format('H:i'),
                'date' => $app->appointment_date,
                'status' => ucfirst($app->status),
                'price' => (float)$app->final_price,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $mapped
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:employees,id',
            'service_id' => 'nullable|exists:services,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'nullable',
            'price' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'final_price' => 'nullable|numeric',
            'status' => 'nullable|string'
        ]);

        $appointment = Appointment::create([
            'patient_id' => $data['patient_id'],
            'doctor_id' => $data['doctor_id'],
            'service_id' => $data['service_id'],
            'appointment_date' => $data['appointment_date'],
            'appointment_time' => $data['appointment_time'] ?? Carbon::now()->format('H:i'),
            'price' => $data['price'] ?? 0,
            'discount' => $data['discount'] ?? 0,
            'final_price' => $data['final_price'] ?? ($data['price'] ?? 0),
            'status' => $data['status'] ?? 'waiting',
        ]);

        return response()->json([
            'success' => true,
            'data' => $appointment
        ], 201);
    }
    public function update(Request $request, $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['success' => false, 'message' => 'Appointment not found'], 404);
        }

        $data = $request->validate([
            'status' => 'sometimes|string|in:waiting,in-consult,completed,cancelled,delayed',
            'appointment_time' => 'sometimes|nullable',
            'notes' => 'sometimes|nullable|string'
        ]);

        $appointment->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully',
            'data' => $appointment
        ]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['success' => false, 'message' => 'Appointment not found'], 404);
        }

        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully'
        ]);
    }
}

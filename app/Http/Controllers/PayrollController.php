<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /**
     * Display a listing of payroll records.
     */
    public function index()
    {
        $records = Payroll::with('employee.department')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $records
        ]);
    }

    /**
     * Store a newly created payroll record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'basic_salary' => 'required|numeric',
            'housing_allowance' => 'nullable|numeric',
            'transport_allowance' => 'nullable|numeric',
            'risk_allowance' => 'nullable|numeric',
            'incentives' => 'nullable|numeric',
            'overtime' => 'nullable|numeric',
            'commission_rate' => 'nullable|numeric',
            'insurance_deduction' => 'nullable|numeric',
            'taxes_deduction' => 'nullable|numeric',
            'absence_deduction' => 'nullable|numeric',
            'penalty_deduction' => 'nullable|numeric',
            'net_salary' => 'required|numeric',
            'month' => 'required|string',
            'payment_date' => 'nullable|date',
            'status' => 'nullable|string|in:paid,pending',
        ]);

        // Default values
        $validated['amount'] = $validated['net_salary'];
        $validated['payment_date'] = $validated['payment_date'] ?? now();
        $validated['status'] = $validated['status'] ?? 'pending';

        $record = Payroll::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Payroll record created successfully',
            'data' => $record->load('employee')
        ], 201);
    }

    /**
     * Update the specified payroll record.
     */
    public function update(Request $request, $id)
    {
        $record = Payroll::find($id);

        if (!$record) {
            return response()->json(['success' => false, 'message' => 'Record not found'], 404);
        }

        $validated = $request->validate([
            'basic_salary' => 'sometimes|numeric',
            'housing_allowance' => 'nullable|numeric',
            'transport_allowance' => 'nullable|numeric',
            'risk_allowance' => 'nullable|numeric',
            'incentives' => 'nullable|numeric',
            'overtime' => 'nullable|numeric',
            'commission_rate' => 'nullable|numeric',
            'insurance_deduction' => 'nullable|numeric',
            'taxes_deduction' => 'nullable|numeric',
            'absence_deduction' => 'nullable|numeric',
            'penalty_deduction' => 'nullable|numeric',
            'net_salary' => 'sometimes|numeric',
            'month' => 'sometimes|string',
            'status' => 'sometimes|string|in:paid,pending',
        ]);

        if (isset($validated['net_salary'])) {
            $validated['amount'] = $validated['net_salary'];
        }

        $record->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Payroll record updated',
            'data' => $record->load('employee')
        ]);
    }

    /**
     * Remove the specified payroll record.
     */
    public function destroy($id)
    {
        $record = Payroll::find($id);

        if (!$record) {
            return response()->json(['success' => false, 'message' => 'Record not found'], 404);
        }

        $record->delete();

        return response()->json(['success' => true, 'message' => 'Record deleted']);
    }
}

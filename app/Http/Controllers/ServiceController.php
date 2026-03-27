<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index()
    {
        $services = Service::with('department')->get();
        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric',
            'department_id' => 'required|exists:departments,id',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service added successfully',
            'data' => $service
        ], 201);
    }

    /**
     * Display the specified service.
     */
    public function show($id)
    {
        $service = Service::with('department')->find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $service]);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, $id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'sometimes|required|numeric',
            'department_id' => 'sometimes|required|exists:departments,id',
        ]);

        $service->update($validated);

        return response()->json(['success' => true, 'message' => 'Service updated', 'data' => $service]);
    }

    /**
     * Remove the specified service.
     */
    public function destroy($id)
    {
        $service = Service::find($id);

        if (!$service) {
            return response()->json(['success' => false, 'message' => 'Service not found'], 404);
        }

        $service->delete();

        return response()->json(['success' => true, 'message' => 'Service deleted']);
    }
}

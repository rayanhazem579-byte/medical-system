<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index()
    {
        $departments = Department::withCount('employees')->get();
        return response()->json([
            'success' => true,
            'data' => $departments
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'head_doctor' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $department = Department::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully',
            'data' => $department
        ], 201);
    }

    /**
     * Display the specified department.
     */
    public function show($id)
    {
        $department = Department::with(['employees', 'services'])->find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Department not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $department]);
    }

    /**
     * Update the specified department.
     */
    public function update(Request $request, $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Department not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'head_doctor' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'description' => 'nullable|string',
        ]);

        $department->update($validated);

        return response()->json(['success' => true, 'message' => 'Department updated', 'data' => $department]);
    }

    /**
     * Remove the specified department.
     */
    public function destroy($id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Department not found'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Department deleted']);
    }

    /**
     * Upload an image for the department.
     */
    public function uploadImage(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $name = 'dept_' . $id . '_' . time() . '.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('/uploads/departments');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $image->move($destinationPath, $name);
            $imageUrl = '/uploads/departments/' . $name;
            
            $department->update(['image_url' => $imageUrl]);

            return response()->json([
                'success' => true,
                'image_url' => $imageUrl,
                'message' => 'Image uploaded successfully'
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No image uploaded'], 400);
    }
}

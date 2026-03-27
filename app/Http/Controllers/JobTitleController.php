<?php

namespace App\Http\Controllers;

use App\Models\JobTitle;
use Illuminate\Http\Request;

class JobTitleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => JobTitle::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        $jobTitle = JobTitle::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تمت إضافة المسمى الوظيفي بنجاح',
            'data' => $jobTitle
        ], 201);
    }

    public function update(Request $request, JobTitle $jobTitle)
    {
        $validated = $request->validate([
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        $jobTitle->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المسمى الوظيفي بنجاح',
            'data' => $jobTitle
        ]);
    }

    public function destroy(JobTitle $jobTitle)
    {
        $jobTitle->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المسمى الوظيفي بنجاح'
        ]);
    }
}

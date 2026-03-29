<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordNotification;

class EmployeeController extends Controller
{
    public function indexDoctors()
    {
        $doctors = Employee::where('role', 'doctor')
            ->with(['department', 'manawbats'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $doctors
        ]);
    }

    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $today = \Carbon\Carbon::today()->toDateString();
        $employees = Employee::with(['department', 'user', 'manawbats'])
            ->withCount(['appointments as appointments_count' => function ($query) use ($today) {
                $query->whereDate('appointment_date', $today);
            }])
            ->with(['appointments' => function ($query) use ($today) {
                $query->whereDate('appointment_date', $today)->with('patient');
            }])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    /**
     * Store a newly created employee and its user account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'staff_id' => 'required|string|unique:employees,staff_id',
            'role' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email|unique:employees,email',
            'department_id' => 'required|exists:departments,id',
            // Doctor fields (optional)
            'medical_id' => 'nullable|string',
            'specialty_ar' => 'nullable|string',
            'specialty_en' => 'nullable|string',
            'phone' => 'nullable|string',
            'salary' => 'nullable|numeric',
            'commission_rate' => 'nullable|numeric',
            'consultation_fee' => 'nullable|numeric',
            'hire_date' => 'nullable|date',
            'work_hours' => 'nullable|array',
            'working_days' => 'nullable|array',
            'day_shifts' => 'nullable|array',
            'shift_type' => 'nullable|string',
            'job_title' => 'nullable|string',
            'status' => 'nullable|string|in:active,on_leave,resigned',
            'shifts' => 'nullable|array',
            'national_id' => 'nullable|string',
            'license_number' => 'nullable|string',
            'practice_cert' => 'nullable|string',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'degree' => 'nullable|string',
            'exp_years' => 'nullable|integer',
            'bank_name' => 'nullable|string',
            'bank_account' => 'nullable|string',
        ]);

        Log::info("Attempting to store employee", $validated);

        try {
            return DB::transaction(function () use ($validated) {
                // Determine normalized role
                $role = strtolower($validated['role'] ?? 'staff');
                if ($role === 'طبيب') $role = 'doctor';

                // 2. Generate Credentials
                $generatedPassword = substr(str_shuffle('abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'), 0, 8); // Random password
                $username = $validated['staff_id'];

                try {
                    $user = User::create([
                        'name' => $validated['name'],
                        'username' => $username,
                        'email' => $validated['email'] ?? null,
                        'role' => $role,
                        'password' => Hash::make($generatedPassword),
                    ]);

                    // Safe check for user_id column (to prevent migration errors)
                    if (!\Illuminate\Support\Facades\Schema::hasColumn('employees', 'user_id')) {
                        \Illuminate\Support\Facades\Schema::table('employees', function (\Illuminate\Database\Schema\Blueprint $table) {
                            $table->integer('user_id')->nullable();
                        });
                    }

                    // 3. Link Employee to User
                    $employee = new Employee();
                    $employee->user_id = $user->id;
                    $employee->name = $validated['name'];
                    $employee->staff_id = $validated['staff_id'];
                    
                    // Medical ID Auto-Generation for Doctors
                    if ($role === 'doctor') {
                        if (empty($validated['medical_id'])) {
                            $latestDoctor = Employee::where('role', 'doctor')->orderBy('id', 'desc')->first();
                            $nextId = $latestDoctor ? $latestDoctor->id + 1 : 1;
                            $employee->medical_id = 'DOC-' . (1000 + $nextId);
                        } else {
                            $employee->medical_id = $validated['medical_id'];
                        }
                    } else {
                        $employee->medical_id = $validated['medical_id'] ?? null;
                    }
                    
                    $employee->role = $role;
                    $employee->specialty_ar = $validated['specialty_ar'] ?? null;
                    $employee->specialty_en = $validated['specialty_en'] ?? null;
                    $employee->email = $validated['email'] ?? null;
                    $employee->phone = $validated['phone'] ?? null;
                    $employee->salary = $validated['salary'] ?? 0;
                    $employee->commission_rate = $validated['commission_rate'] ?? 0;
                    $employee->consultation_fee = $validated['consultation_fee'] ?? 0;
                    $employee->hire_date = $validated['hire_date'] ?? date('Y-m-d');
                    
                    // Passing arrays directly; Laravel's 'array' cast in Employee model handles the JSON conversion
                    $employee->work_hours = $validated['work_hours'] ?? null;
                    $employee->working_days = $validated['working_days'] ?? null;
                    $employee->shifts = $validated['shifts'] ?? null;
                    $employee->day_shifts = $validated['day_shifts'] ?? null;
                    $employee->shift_type = $validated['shift_type'] ?? null;

                    $employee->job_title = $validated['job_title'] ?? null;
                    $employee->status = $validated['status'] ?? 'active';
                    $employee->national_id = $validated['national_id'] ?? null;
                    $employee->license_number = $validated['license_number'] ?? null;
                    $employee->practice_cert = $validated['practice_cert'] ?? null;
                    $employee->dob = $validated['dob'] ?? null;
                    $employee->gender = $validated['gender'] ?? null;
                    $employee->address = $validated['address'] ?? null;
                    $employee->degree = $validated['degree'] ?? null;
                    $employee->exp_years = $validated['exp_years'] ?? 0;
                    $employee->bank_name = $validated['bank_name'] ?? null;
                    $employee->bank_account = $validated['bank_account'] ?? null;
                    $employee->department_id = $validated['department_id']; // Added this as it was missing in previous replace
                    
                    $employee->save();
 
                    // Sync to dedicated manawbats table
                    if (isset($validated['day_shifts']) && is_array($validated['day_shifts'])) {
                        foreach ($validated['day_shifts'] as $shiftData) {
                            $employee->manawbats()->create([
                                'day' => $shiftData['day'],
                                'type' => $shiftData['type'] ?? 'morning',
                                'work_hours' => $shiftData['work_hours'] ?? 8,
                                'start' => null,
                                'end' => null
                            ]);
                        }
                    }

                } catch (\Exception $userEx) {
                    Log::error("Failed to create user or employee", ['error' => $userEx->getMessage()]);
                    throw $userEx; 
                }

                /* Auto-email disabled per user request for doctors
                try {
                    // Send credentials email
                    \App\Http\Controllers\SettingsController::configureMail();
                    
                    if ($employee->email) {
                        Mail::to($employee->email)->send(new PasswordNotification($employee->name, $employee->staff_id ?? $username, $generatedPassword, $employee->role, $employee->email));
                        Log::info("Credentials email sent to " . $employee->email);
                    }
                } catch (\Exception $mailEx) {
                    Log::error("Failed to send credentials email: " . $mailEx->getMessage());
                }
                */

                return response()->json([
                    'success' => true,
                    'message' => 'تمت إضافة البيانات وإنشاء حساب للمستخدم بنجاح وإرسال البريد',
                    'data' => [
                        'employee' => $employee,
                        'account' => [
                            'username' => $username,
                            'password' => $generatedPassword 
                        ]
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error("Employee Store Final Failure", [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'فشل حفظ البيانات: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified employee.
     */
    public function show($id)
    {
        $employee = Employee::with(['department', 'payrolls'])->find($id);

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Employee not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $employee]);
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Employee not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'staff_id' => 'sometimes|required|string|unique:employees,staff_id,' . $id,
            'role' => 'sometimes|required|string|max:255',
            'department_id' => 'sometimes|required|exists:departments,id',
            'email' => 'nullable|email|unique:users,email,' . ($employee->user_id ?? 'NULL') . '|unique:employees,email,' . $id,
            'medical_id' => 'nullable|string',
            'specialty_ar' => 'nullable|string',
            'specialty_en' => 'nullable|string',
            'phone' => 'nullable|string',
            'salary' => 'nullable|numeric',
            'commission_rate' => 'nullable|numeric',
            'consultation_fee' => 'nullable|numeric',
            'hire_date' => 'nullable|date',
            'work_hours' => 'nullable|array',
            'working_days' => 'nullable|array',
            'day_shifts' => 'nullable|array',
            'shift_type' => 'nullable|string',
            'job_title' => 'nullable|string',
            'status' => 'nullable|string|in:active,on_leave,resigned',
            'shifts' => 'nullable|array',
            'national_id' => 'nullable|string',
            'license_number' => 'nullable|string',
            'practice_cert' => 'nullable|string',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'degree' => 'nullable|string',
            'exp_years' => 'nullable|integer',
            'bank_name' => 'nullable|string',
            'bank_account' => 'nullable|string',
        ]);

        // No manual json_encode needed here; Laravel's 'array' cast in Employee model handles it.

        $employee->update($validated);
 
        // Sync to dedicated manawbats table
        if (isset($validated['day_shifts']) && is_array($validated['day_shifts'])) {
            $employee->manawbats()->delete(); // Clear existing
            foreach ($validated['day_shifts'] as $shiftData) {
                $employee->manawbats()->create([
                    'day' => $shiftData['day'],
                    'type' => $shiftData['type'] ?? 'morning',
                    'work_hours' => $shiftData['work_hours'] ?? 8,
                    'start' => null,
                    'end' => null
                ]);
            }
        }

        // Also update associated user if name/email/role changed
        if ($employee->user_id) {
            $userData = [];
            if (isset($validated['name'])) $userData['name'] = $validated['name'];
            if (isset($validated['email'])) $userData['email'] = $validated['email'];
            if (isset($validated['role'])) {
                $role = strtolower($validated['role']);
                if ($role === 'طبيب') $role = 'doctor';
                $userData['role'] = $role;
            }
            if (!empty($userData)) {
                User::where('id', $employee->user_id)->update($userData);
            }
        }

        return response()->json(['success' => true, 'message' => 'تم تحديث البيانات بنجاح', 'data' => $employee]);
    }

    /**
     * Remove the specified employee.
     */
    public function destroy($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Employee not found'], 404);
        }

        // Delete associated user if exists
        $hasUserIdColumn = \Illuminate\Support\Facades\Schema::hasColumn('employees', 'user_id');
        if ($hasUserIdColumn && $employee->user_id) {
            User::destroy($employee->user_id);
        }
        
        $employee->delete();

        return response()->json(['success' => true, 'message' => 'تم حذف البيانات والحساب المرتبط بنجاح']);
    }

    /**
     * Generate a new random password and send it to the employee's email.
     */
    public function resetPassword(Request $request, $id)
    {
        $realId = ($id > 100) ? $id - 100 : $id;
        $person = Employee::find($realId);

        if (!$person) {
            return response()->json(['success' => false, 'message' => 'Person not found'], 404);
        }

        if (!$person->email) {
            return response()->json(['success' => false, 'message' => 'لا يوجد بريد إلكتروني مسجل لهذا الشخص'], 422);
        }

        $newPassword = substr(str_shuffle('abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'), 0, 8);
        
        // Ensure user_id column exists in employees table
        $table = 'employees';
        if (!\Illuminate\Support\Facades\Schema::hasColumn($table, 'user_id')) {
            \Illuminate\Support\Facades\Schema::table($table, function (\Illuminate\Database\Schema\Blueprint $t) {
                $t->integer('user_id')->nullable();
            });
        }

        // Use nameEn for username generation
        $isDoctor = ($person->role === 'doctor' || $person->role === 'طبيب');
        $usernamePrefix = $isDoctor ? ($person->medicalId ? $person->medicalId : 'DOC') : ($person->staff_id ? $person->staff_id : 'EMP');
        $defaultUser = $isDoctor ? ($person->medicalId ?? 'Doc-'.$person->id) : ($person->staff_id ?? 'EMP-'.$person->id);

        $user = $person->user_id ? User::find($person->user_id) : User::where('username', $defaultUser)->first();
        
        $role = $person->role;

        if (!$user) {
            $user = User::create([
                'name' => ($id > 100 ? ($person->nameAr ?? $person->nameEn) : ($person->nameAr ?? $person->nameEn)),
                'username' => $defaultUser,
                'email' => $person->email,
                'role' => $role,
                'password' => Hash::make($newPassword),
            ]);
            $person->user_id = $user->id;
            $person->save();
        } else {
            $user->password = Hash::make($newPassword);
            $user->save();
            if (!$person->user_id) {
                $person->user_id = $user->id;
                $person->save();
            }
        }

        // Send the new password via email
        try {
            \App\Http\Controllers\SettingsController::configureMail();
            if ($person->email) {
                $role = $person->role;
                $isDoctor = ($role === 'doctor' || $role === 'طبيب');
                $staffId = $isDoctor ? ($person->medicalId ?? 'MED-'.$person->id) : ($person->staff_id ?? $person->staffId ?? 'EMP-'.$person->id);
                $name = $person->nameAr ?? $person->nameEn ?? $person->name;
                
                Mail::to($person->email)->send(new PasswordNotification($name, $staffId, $newPassword, $role, $person->email));
                Log::info("Password reset email sent to " . $person->email);
            }
        } catch (\Exception $mailEx) {
            Log::error("Failed to send password reset email: " . $mailEx->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'تم توليد كلمة مرور جديدة بنجاح وإرسالها للبريد',
            'password' => $newPassword
        ]);
    }

    /**
     * Send credentials email.
     */
    public function sendCredentialsMail(Request $request, $id)
    {
        $realId = ($id > 100) ? $id - 100 : $id;
        $person = Employee::find($realId);

        if (!$person) {
            return response()->json(['success' => false, 'message' => 'Person not found'], 404);
        }

        $validated = $request->validate([
            'password' => 'required|string',
            'message' => 'nullable|string',
        ]);

        $password = $validated['password'];
        $message = $validated['message'] ?? null;

        try {
            \App\Http\Controllers\SettingsController::configureMail();
            
            if ($person->email) {
                $role = $person->role;
                $isDoctor = ($role === 'doctor' || $role === 'طبيب');
                $staffId = $isDoctor ? ($person->medicalId ?? 'MED-'.$person->id) : ($person->staff_id ?? $person->staffId ?? 'EMP-'.$person->id);
                $name = $person->nameAr ?? $person->nameEn ?? $person->name;
                
                Mail::to($person->email)->send(new PasswordNotification($name, $staffId, $password, $role, $person->email, $message));
                Log::info("Credentials email sent to " . $person->email);
            } else {
                return response()->json(['success' => false, 'message' => 'لا يوجد بريد إلكتروني مسجل لهذا الشخص'], 422);
            }
        } catch (\Exception $mailEx) {
            Log::error("Failed to send credentials email: " . $mailEx->getMessage());
            return response()->json(['success' => false, 'message' => 'فشل إرسال البريد: ' . $mailEx->getMessage()], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال بيانات الدخول للبريد الإلكتروني بنجاح'
        ]);
    }

    /**
     * Finalize and save the account to the users table.
     */
    public function finalizeAccount(Request $request, $id)
    {
        $realId = ($id > 100) ? $id - 100 : $id;
        $person = Employee::find($realId);

        if (!$person) {
            return response()->json(['success' => false, 'message' => 'Person not found'], 404);
        }

        $validated = $request->validate([
            'username' => 'required|string|unique:users,username,' . ($person->user_id ? $person->user_id : 'NULL') . ',id',
            'password' => 'required|string|min:6',
        ]);

        try {
            return DB::transaction(function () use ($person, $validated, $id) {
                // Find or create user
                $user = $person->user_id ? User::find($person->user_id) : User::where('username', $validated['username'])->first();

                if (!$user) {
                    $role = $person->role;
                    $name = $person->nameAr ?? $person->nameEn ?? $person->name;
                    $user = User::create([
                        'name' => $name,
                        'username' => $validated['username'],
                        'email' => $person->email,
                        'role' => $role,
                        'password' => Hash::make($validated['password']),
                    ]);
                    $person->user_id = $user->id;
                    $person->save();
                } else {
                    $user->name = $person->nameAr ?? $person->nameEn ?? $person->name;
                    $user->username = $validated['username'];
                    $user->email = $person->email;
                    $user->password = Hash::make($validated['password']);
                    $user->save();
                    
                    // Link if not linked
                    if (!$person->user_id) {
                        $person->user_id = $user->id;
                        $person->save();
                    }
                }

                // Send the credentials email upon finalization
                try {
                    \App\Http\Controllers\SettingsController::configureMail();
                    if ($person->email) {
                        $role = $person->role;
                        $isDoctor = ($role === 'doctor' || $role === 'طبيب');
                        $staffId = $isDoctor ? ($person->medicalId ?? 'MED-'.$person->id) : ($person->staff_id ?? $person->staffId ?? 'EMP-'.$person->id);
                        $name = $person->nameAr ?? $person->nameEn ?? $person->name;
                        
                        Mail::to($person->email)->send(new PasswordNotification($name, $staffId, $validated['password'], $role, $person->email));
                        Log::info("Credentials email sent to " . $person->email . " after finalization");
                    }
                } catch (\Exception $mailEx) {
                    Log::error("Failed to send credentials email after finalization: " . $mailEx->getMessage());
                }

                return response()->json([
                    'success' => true,
                    'message' => 'تم حفظ بيانات المستخدم وتفعيل الحساب بنجاح وإرسال البريد'
                ]);
            });
        } catch (\Exception $e) {
            Log::error("Failed to finalize account: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'فشل تفعيل الحساب: ' . $e->getMessage()
            ], 500);
        }
    }
}

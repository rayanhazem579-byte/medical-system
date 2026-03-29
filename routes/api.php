<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ServiceController;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PharmacyController;
use App\Http\Controllers\PharmacySupplierController;
use App\Http\Controllers\PharmacyProductCategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/admins', [AuthController::class, 'listAdmins']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    
    Route::delete('/patients/clear-all', [PatientController::class, 'truncate']);
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);

    // System Resource Routes
    Route::apiResource('departments', DepartmentController::class);
    Route::post('/pharmacy/{id}/image', [PharmacyController::class, 'uploadImage']);
Route::post('/departments/{id}/image', [DepartmentController::class, 'uploadImage']);
    Route::get('/doctors', [EmployeeController::class, 'indexDoctors']);
    Route::apiResource('employees', EmployeeController::class);
    Route::post('/employees/{id}/reset-password', [EmployeeController::class, 'resetPassword']);
    Route::post('/employees/{id}/send-credentials', [EmployeeController::class, 'sendCredentialsMail']);
    Route::post('/employees/{id}/finalize-account', [EmployeeController::class, 'finalizeAccount']);
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('payrolls', \App\Http\Controllers\PayrollController::class);
    
    // System Settings
    Route::get('/settings', [\App\Http\Controllers\SettingsController::class, 'index']);
    Route::put('/settings', [\App\Http\Controllers\SettingsController::class, 'update']);
    Route::post('/settings/logo', [\App\Http\Controllers\SettingsController::class, 'uploadLogo']);

    Route::post('/settings/test-email', [\App\Http\Controllers\SettingsController::class, 'testEmail']);
    // Pharmacy
    Route::get('/pharmacy/transactions', [PharmacyController::class, 'transactions']);
    Route::delete('/pharmacy-suppliers/batch', [PharmacySupplierController::class, 'deleteBatch']);
    Route::apiResource('pharmacy-suppliers', PharmacySupplierController::class);
    Route::apiResource('pharmacy-product-categories', PharmacyProductCategoryController::class);
    Route::post('/pharmacy/dispense', [PharmacyController::class, 'dispense']);
    Route::apiResource('pharmacy', PharmacyController::class);
    Route::post('/send-password-code', [AuthController::class, 'sendPasswordChangeCode']);
    Route::post('/verify-password-code', [AuthController::class, 'verifyPasswordChangeCode']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::apiResource('medical-records', MedicalRecordController::class);
    Route::apiResource('specialties', \App\Http\Controllers\SpecialtyController::class);
    Route::apiResource('job-titles', \App\Http\Controllers\JobTitleController::class);

    // Lab Requests
    Route::get('/lab-requests', [\App\Http\Controllers\LabRequestController::class, 'index']);
    Route::post('/lab-requests', [\App\Http\Controllers\LabRequestController::class, 'store']);
    Route::put('/lab-requests/{id}', [\App\Http\Controllers\LabRequestController::class, 'update']);
    Route::post('/lab-requests/{id}/upload', [\App\Http\Controllers\LabRequestController::class, 'uploadResult']);

    // Radiology Requests
    Route::get('/radiology-requests', [\App\Http\Controllers\RadiologyRequestController::class, 'index']);
    Route::post('/radiology-requests', [\App\Http\Controllers\RadiologyRequestController::class, 'store']);
    Route::put('/radiology-requests/{id}', [\App\Http\Controllers\RadiologyRequestController::class, 'update']);
    Route::post('/radiology-requests/{id}/upload', [\App\Http\Controllers\RadiologyRequestController::class, 'uploadResult']);
    Route::post('/radiology-requests/{id}/finalize', [\App\Http\Controllers\RadiologyRequestController::class, 'finalizeRadiology']);

    // Transactions / Finance
    Route::get('/transactions', [\App\Http\Controllers\FinanceController::class, 'index']);
    Route::post('/transactions', [\App\Http\Controllers\FinanceController::class, 'store']);
    Route::delete('/transactions/{id}', [\App\Http\Controllers\FinanceController::class, 'destroy']);

    // Prescriptions
    Route::get('/prescriptions', [\App\Http\Controllers\PrescriptionController::class, 'index']);
    Route::post('/prescriptions', [\App\Http\Controllers\PrescriptionController::class, 'store']);
    Route::put('/prescriptions/{id}', [\App\Http\Controllers\PrescriptionController::class, 'update']);

    // Invoices
    Route::get('/invoices', [\App\Http\Controllers\InvoiceController::class, 'index']);
    Route::post('/invoices', [\App\Http\Controllers\InvoiceController::class, 'store']);
    Route::post('/invoices/{id}/pay', [\App\Http\Controllers\InvoiceController::class, 'pay']);
    Route::delete('/invoices/{id}', [\App\Http\Controllers\InvoiceController::class, 'destroy']);
});


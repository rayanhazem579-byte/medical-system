<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    // Auto-create root user
    \App\Models\User::firstOrCreate(
        ['username' => 'root'],
        [
            'name' => 'Root Admin',
            'email' => 'admin@alshifa.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin'
        ]
    );

    // Auto-create a default department so adding employees/services doesn't fail
    \App\Models\Department::firstOrCreate(
        ['id' => 1],
        [
            'name' => 'General Medicine',
            'code' => 'GEN-01',
            'head_doctor' => 'Dr. Khalid',
            'location' => 'Block A, Floor 1',
            'status' => 'active'
        ]
    );

    return view('welcome');
});

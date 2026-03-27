<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

try {
    $e = new Employee();
    $e->name = 'test-doc-99';
    $e->staff_id = 'STF-T99';
    $e->role = 'doctor';
    $e->department_id = 1;
    $e->working_days = json_encode(['Monday']);
    $e->work_hours = json_encode(['start' => '08:00', 'end' => '17:00']);
    $e->save();
    echo "SUCCESS\n";
} catch (\Exception $ex) {
    echo "ERROR: " . $ex->getMessage() . "\n";
    echo "FILE: " . $ex->getFile() . " LINE: " . $ex->getLine() . "\n";
}

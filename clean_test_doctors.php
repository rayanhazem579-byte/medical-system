<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$names = ['rayan', 'mohammed', 'haitham', 'okgf', 'kgf', 'okjf', 'ريان', 'محمد', 'هيثم', 'ريام', 'rayam'];

$query = \App\Models\Employee::where('role', 'doctor');

$query->where(function($q) use ($names) {
    foreach ($names as $n) {
        $q->orWhere('name_ar', 'LIKE', "%$n%")
          ->orWhere('name_en', 'LIKE', "%$n%")
          ->orWhere('name', 'LIKE', "%$n%");
    }
});

$deleted = $query->delete();
echo "Deleted " . $deleted . " test doctors successfully.\n";

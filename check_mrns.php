<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$patients = \App\Models\Patient::select('id', 'name', 'file_number')->latest()->limit(10)->get();
foreach ($patients as $p) {
    echo "ID: {$p->id}, Name: {$p->name}, MRN: {$p->file_number}\n";
}

<?php
$lines = file('storage/logs/laravel.log');
$errorLines = [];
// Iterate backwards to find the last "[2026-" timestamp
for ($i = count($lines) - 1; $i >= 0; $i--) {
    $errorLines[] = $lines[$i];
    if (preg_match('/^\[202\d-/', $lines[$i])) {
        break;
    }
}
$errorLines = array_reverse($errorLines);
// Print just the first 10 lines of the error to avoid clutter
$output = implode("", array_slice($errorLines, 0, 10));
echo "LAST ERROR:\n";
echo $output;

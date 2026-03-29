<?php
$ch = curl_init('http://127.0.0.1:8000/api/patients');
$payload = json_encode(['name' => 'Test Patient', 'email' => '']);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
echo "RESPONSE:\n";
echo $response;
if (curl_error($ch)) echo "\nERROR: " . curl_error($ch);
curl_close($ch);

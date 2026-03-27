<?php
$host = '127.0.0.1';
$port = '5432';
$dbname = 'medicasystem';
$user = 'postgres';
$pass = 123456;

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "✅ Success! Connection established.\n";
}
catch (PDOException $e) {
    echo "❌ Failed to connect: " . $e->getMessage() . "\n";

    // Attempting to connect to default 'postgres' database if 'medicasystem' doesn't exist
    try {
        $dsn_fallback = "pgsql:host=$host;port=$port;dbname=postgres";
        $pdo_fallback = new PDO($dsn_fallback, $user, $pass);
        echo "💡 Tip: Connected to 'postgres' DB, but 'medicasystem' might not exist.\n";
    }
    catch (PDOException $e_fallback) {
        echo "⛔ Critical: Password authentication failed even for default DB.\n";
    }
}

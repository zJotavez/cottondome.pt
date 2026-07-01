<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$allowed = ['company_name','tagline','phone','whatsapp','email','address','working_hours_week','working_hours_sat','nif'];
foreach ($allowed as $key) {
    if (isset($body[$key])) $data['settings'][$key] = trim($body[$key]);
}
writeData($data);
jsonResponse(true, null, '');

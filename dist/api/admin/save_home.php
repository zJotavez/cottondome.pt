<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$allowed = ['hero_title','hero_subtitle','hero_cta','hero_image'];
foreach ($allowed as $key) {
    if (isset($body[$key])) $data['home'][$key] = $body[$key];
}
writeData($data);
jsonResponse(true, null, '');

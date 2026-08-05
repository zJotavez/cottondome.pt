<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$allowed = ['title','description','mission','vision','values','years','clients','projects','image','video'];
foreach ($allowed as $key) {
    if (isset($body[$key])) $data['about'][$key] = $body[$key];
}
writeData($data, true);
logChange('Sobre Nós', 'Atualizou as informações institucionais da página Sobre.');
jsonResponse(true, null, '');

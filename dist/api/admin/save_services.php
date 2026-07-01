<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$id = intval($body['id'] ?? 0);
$services = $data['services'] ?? [];
$found = false;
foreach ($services as &$svc) {
    if ($svc['id'] === $id) {
        foreach (['title','slug','icon','active','description'] as $k) {
            if (isset($body[$k])) $svc[$k] = $body[$k];
        }
        $found = true;
        break;
    }
}
if (!$found && $id === 0) {
    $newId = count($services) > 0 ? max(array_column($services,'id')) + 1 : 1;
    $services[] = ['id'=>$newId,'title'=>$body['title']??'Novo Serviço','slug'=>$body['slug']??'novo','icon'=>$body['icon']??'shield','active'=>true];
}
$data['services'] = array_values($services);
writeData($data);
jsonResponse(true, null, '');

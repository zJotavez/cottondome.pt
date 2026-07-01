<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$suppliers = $data['suppliers'] ?? [];
$action = $body['action'] ?? 'save';
$id = intval($body['id'] ?? 0);

if ($action === 'delete') {
    $suppliers = array_values(array_filter($suppliers, fn($s) => intval($s['id']) !== $id));
    $data['suppliers'] = $suppliers;
    writeData($data);
    jsonResponse(true, null, 'Fornecedor eliminado com sucesso.');
}

if ($action === 'save') {
    $found = false;
    foreach ($suppliers as &$sup) {
        if (intval($sup['id']) === $id) {
            foreach (['name', 'logo_url', 'website_url', 'order_index'] as $k) {
                if (isset($body[$k])) $sup[$k] = $body[$k];
            }
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        $newId = count($suppliers) > 0 ? max(array_map('intval', array_column($suppliers, 'id'))) + 1 : 1;
        $suppliers[] = [
            'id' => $newId,
            'name' => $body['name'] ?? '',
            'logo_url' => $body['logo_url'] ?? '',
            'website_url' => $body['website_url'] ?? '',
            'order_index' => intval($body['order_index'] ?? 0)
        ];
    }
    
    $data['suppliers'] = array_values($suppliers);
    writeData($data);
    jsonResponse(true, null, 'Fornecedor gravado com sucesso.');
}

jsonResponse(false, null, 'Ação inválida.');

<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$gallery = $data['gallery'] ?? [];
$action = $body['action'] ?? 'save';
$id = intval($body['id'] ?? 0);

if ($action === 'delete') {
    $gallery = array_values(array_filter($gallery, fn($g) => intval($g['id']) !== $id));
    $data['gallery'] = $gallery;
    writeData($data);
    jsonResponse(true, null, 'Item de galeria eliminado com sucesso.');
}

if ($action === 'save') {
    $found = false;
    foreach ($gallery as &$item) {
        if (intval($item['id']) === $id) {
            foreach (['title', 'image_url', 'category', 'description', 'order_index'] as $k) {
                if (isset($body[$k])) $item[$k] = $body[$k];
            }
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        $newId = count($gallery) > 0 ? max(array_map('intval', array_column($gallery, 'id'))) + 1 : 1;
        $gallery[] = [
            'id' => $newId,
            'title' => $body['title'] ?? '',
            'image_url' => $body['image_url'] ?? '',
            'category' => $body['category'] ?? '',
            'description' => $body['description'] ?? '',
            'order_index' => intval($body['order_index'] ?? 0)
        ];
    }
    
    $data['gallery'] = array_values($gallery);
    writeData($data);
    jsonResponse(true, null, 'Item de galeria gravado com sucesso.');
}

jsonResponse(false, null, 'Ação inválida.');

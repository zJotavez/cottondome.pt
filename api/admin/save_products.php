<?php
/**
 * Cotton Dome LDA - Save Products API
 */

require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$products = $data['products'] ?? [];
$action = $body['action'] ?? 'save';
$id = $body['id'] ?? '';

if ($action === 'delete') {
    if (!empty($id)) {
        $products = array_values(array_filter($products, fn($p) => $p['id'] !== $id));
        $data['products'] = $products;
        writeData($data, true);
        logChange('Produtos', 'Eliminou o produto ID: ' . $id);
        jsonResponse(true, null, 'Produto eliminado com sucesso.');
    }
    jsonResponse(false, null, 'ID inválido.');
}

if ($action === 'save') {
    $found = false;
    foreach ($products as &$prod) {
        if ($prod['id'] === $id) {
            foreach ([
                'name', 'model', 'category', 'brand', 'short_description', 'description', 
                'image', 'gallery', 'video', 'features', 'benefits', 'service_id', 
                'display_order', 'is_active', 'is_featured'
            ] as $k) {
                if (isset($body[$k])) {
                    if ($k === 'is_active' || $k === 'is_featured' || $k === 'display_order') {
                        $prod[$k] = intval($body[$k]);
                    } elseif ($k === 'features' || $k === 'benefits' || $k === 'gallery') {
                        $prod[$k] = is_array($body[$k]) ? $body[$k] : [];
                    } else {
                        $prod[$k] = $body[$k];
                    }
                }
            }
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        $newId = !empty($body['id']) ? preg_replace('/[^a-z0-9_-]/', '', strtolower($body['id'])) : 'prod_' . time();
        $products[] = [
            'id' => $newId,
            'name' => $body['name'] ?? '',
            'model' => $body['model'] ?? '',
            'category' => $body['category'] ?? '',
            'brand' => $body['brand'] ?? '',
            'short_description' => $body['short_description'] ?? '',
            'description' => $body['description'] ?? '',
            'image' => $body['image'] ?? '',
            'gallery' => is_array($body['gallery'] ?? null) ? $body['gallery'] : [],
            'video' => $body['video'] ?? '',
            'features' => is_array($body['features'] ?? null) ? $body['features'] : [],
            'benefits' => is_array($body['benefits'] ?? null) ? $body['benefits'] : [],
            'service_id' => $body['service_id'] ?? '',
            'display_order' => intval($body['display_order'] ?? 0),
            'is_active' => intval($body['is_active'] ?? 1),
            'is_featured' => intval($body['is_featured'] ?? 0)
        ];
        $id = $newId;
    }
    
    $data['products'] = array_values($products);
    writeData($data, true);
    logChange('Produtos', 'Gravou o produto: ' . ($body['name'] ?? ''));
    jsonResponse(true, ['id' => $id], 'Produto gravado com sucesso.');
}

jsonResponse(false, null, 'Ação inválida.');

<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$id = intval($body['id'] ?? 0);
$services = $data['services'] ?? [];
$action = $body['action'] ?? 'save';

if ($action === 'delete') {
    if ($id > 0) {
        $services = array_values(array_filter($services, fn($s) => intval($s['id']) !== $id));
        $data['services'] = $services;
        
        // Remove também a página do serviço
        if (isset($data['service_pages'])) {
            $data['service_pages'] = array_values(array_filter($data['service_pages'], fn($p) => intval($p['service_id']) !== $id));
        }
        
        writeData($data, true);
        logChange('Serviços', 'Eliminou o serviço ID ' . $id);
        jsonResponse(true, null, 'Serviço eliminado com sucesso.');
    }
    jsonResponse(false, null, 'ID inválido.');
}

if ($action === 'save') {
    $found = false;
    foreach ($services as &$svc) {
        if (intval($svc['id']) === $id) {
            foreach (['title','slug','icon','image','video','is_active','display_order','slogan','short_description','description'] as $k) {
                if (isset($body[$k])) {
                    if ($k === 'is_active' || $k === 'display_order') {
                        $svc[$k] = intval($body[$k]);
                    } else {
                        $svc[$k] = $body[$k];
                    }
                }
            }
            $found = true;
            break;
        }
    }
    if (!$found) {
        $newId = count($services) > 0 ? max(array_map('intval', array_column($services, 'id'))) + 1 : 1;
        $services[] = [
            'id' => $newId,
            'title' => $body['title'] ?? 'Novo Serviço',
            'slug' => $body['slug'] ?? 'novo-servico',
            'icon' => $body['icon'] ?? 'Shield',
            'image' => $body['image'] ?? '',
            'video' => $body['video'] ?? '',
            'is_active' => intval($body['is_active'] ?? 1),
            'display_order' => intval($body['display_order'] ?? 0),
            'slogan' => $body['slogan'] ?? '',
            'short_description' => $body['short_description'] ?? '',
            'description' => $body['description'] ?? ''
        ];
        $id = $newId;
    }
    $data['services'] = array_values($services);
    writeData($data, true);
    logChange('Serviços', 'Salvou as informações do serviço: ' . ($body['title'] ?? 'Novo Serviço'));
    jsonResponse(true, ['id' => $id], 'Serviço gravado com sucesso.');
}

jsonResponse(false, null, 'Ação inválida.');

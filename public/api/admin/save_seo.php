<?php
require_once __DIR__ . '/../../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData();
$seo = $data['seo'] ?? [];
$pageName = trim($body['page'] ?? '');

if (!$pageName) {
    jsonResponse(false, null, 'Página em falta.');
}

$found = false;
foreach ($seo as &$item) {
    if ($item['page'] === $pageName) {
        foreach (['title', 'description', 'keywords'] as $k) {
            if (isset($body[$k])) $item[$k] = trim($body[$k]);
        }
        $found = true;
        break;
    }
}

if (!$found) {
    $seo[] = [
        'page' => $pageName,
        'title' => trim($body['title'] ?? ''),
        'description' => trim($body['description'] ?? ''),
        'keywords' => trim($body['keywords'] ?? '')
    ];
}

$data['seo'] = array_values($seo);
writeData($data);
jsonResponse(true, null, 'SEO gravado com sucesso.');

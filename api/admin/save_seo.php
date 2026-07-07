<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$seo = $data['seo'] ?? [];
$pageName = trim($body['page'] ?? '');

if (!$pageName) {
    jsonResponse(false, null, 'Página em falta.');
}

$found = false;
foreach ($seo as &$item) {
    if ($item['page'] === $pageName) {
        foreach (['title', 'description', 'keywords', 'og_image', 'canonical_url'] as $k) {
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
        'keywords' => trim($body['keywords'] ?? ''),
        'og_image' => trim($body['og_image'] ?? ''),
        'canonical_url' => trim($body['canonical_url'] ?? '')
    ];
}

$data['seo'] = array_values($seo);
writeData($data, true);
logChange('SEO', 'Atualizou as metatags SEO para a página: ' . $pageName);
jsonResponse(true, null, 'SEO gravado com sucesso.');

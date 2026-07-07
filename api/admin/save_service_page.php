<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true); // Lê do Rascunho

$service_id = intval($body['service_id'] ?? 0);
if (!$service_id) {
    jsonResponse(false, null, 'ID do serviço em falta.');
}

$pages = $data['service_pages'] ?? [];
$found = false;

foreach ($pages as &$page) {
    if (intval($page['service_id']) === $service_id) {
        foreach ([
            'page_title', 'impact_phrase', 'full_description', 'applications',
            'related_products', 'benefits', 'work_process', 'gallery_images', 'final_cta_title',
            'final_cta_text', 'seo_title', 'seo_description', 'seo_keywords'
        ] as $k) {
            if (isset($body[$k])) $page[$k] = $body[$k];
        }
        $found = true;
        break;
    }
}

if (!$found) {
    $pages[] = [
        'service_id' => $service_id,
        'page_title' => $body['page_title'] ?? '',
        'impact_phrase' => $body['impact_phrase'] ?? '',
        'full_description' => $body['full_description'] ?? '',
        'applications' => $body['applications'] ?? [],
        'related_products' => $body['related_products'] ?? [],
        'benefits' => $body['benefits'] ?? [],
        'work_process' => $body['work_process'] ?? [],
        'gallery_images' => $body['gallery_images'] ?? [],
        'final_cta_title' => $body['final_cta_title'] ?? '',
        'final_cta_text' => $body['final_cta_text'] ?? '',
        'seo_title' => $body['seo_title'] ?? '',
        'seo_description' => $body['seo_description'] ?? '',
        'seo_keywords' => $body['seo_keywords'] ?? ''
    ];
}

$data['service_pages'] = array_values($pages);
writeData($data, true); // Grava no Rascunho
logChange('Serviços', 'Atualizou os detalhes da página de conteúdo do serviço ID ' . $service_id);
jsonResponse(true, null, 'Conteúdo da página de serviço gravado com sucesso.');

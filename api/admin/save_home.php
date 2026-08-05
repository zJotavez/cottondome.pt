<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$allowed = [
    'hero_title', 'hero_subtitle', 'hero_cta', 'hero_image', 'hero_video', 
    'hero_video_fallback', 'hero_video_active', 'hero_align', 
    'primary_button_text', 'primary_button_link', 
    'secondary_button_text', 'secondary_button_link',
    'pilares', 'how_we_work', 'cta_final'
];
foreach ($allowed as $key) {
    if (isset($body[$key])) $data['home'][$key] = $body[$key];
}
writeData($data, true);
logChange('Página Inicial', 'Atualizou o conteúdo da Página Inicial.');
jsonResponse(true, null, '');

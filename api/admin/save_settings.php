<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();
$body = json_decode(file_get_contents('php://input'), true) ?: [];
$data = readData(true);
$allowed = [
    'company_name', 'companyName', 'tagline', 'slogan', 'phone', 'whatsapp', 'email', 'address',
    'working_hours_week', 'working_hours_sat', 'nif', 'footer_text', 
    'social_instagram', 'social_facebook', 'social_linkedin', 'social_youtube',
    'logo', 'logo_alt', 'favicon', 'copyright_text', 'map_iframe',
    'contact_title', 'contact_subtitle', 'contact_desc', 'contact_btn_text'
];
foreach ($allowed as $key) {
    if (isset($body[$key])) $data['settings'][$key] = $body[$key];
}
writeData($data, true);
logChange('Configurações', 'Atualizou as configurações gerais/contactos do site.');
jsonResponse(true, null, '');

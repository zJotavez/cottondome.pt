<?php
/**
 * Cotton Dome LDA - Save Site Settings API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$company_name = trim($input['company_name'] ?? '');
$slogan = trim($input['slogan'] ?? '');
$phone = trim($input['phone'] ?? '');
$whatsapp = trim($input['whatsapp'] ?? '');
$email = trim($input['email'] ?? '');
$address = trim($input['address'] ?? '');
$working_hours_week = trim($input['working_hours_week'] ?? '');
$working_hours_sat = trim($input['working_hours_sat'] ?? '');
$footer_text = trim($input['footer_text'] ?? '');
$social_instagram = trim($input['social_instagram'] ?? '');
$social_facebook = trim($input['social_facebook'] ?? '');
$social_linkedin = trim($input['social_linkedin'] ?? '');

if (empty($company_name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O nome da empresa é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if row exists
    $check = $pdo->query("SELECT id FROM site_settings LIMIT 1");
    $exists = $check->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("
            UPDATE site_settings 
            SET company_name = :company_name, slogan = :slogan, phone = :phone, whatsapp = :whatsapp, 
                email = :email, address = :address, working_hours_week = :working_hours_week, 
                working_hours_sat = :working_hours_sat, footer_text = :footer_text, 
                social_instagram = :social_instagram, social_facebook = :social_facebook, social_linkedin = :social_linkedin
            WHERE id = :id
        ");
        $stmt->execute([
            'company_name' => $company_name,
            'slogan' => $slogan,
            'phone' => $phone,
            'whatsapp' => $whatsapp,
            'email' => $email,
            'address' => $address,
            'working_hours_week' => $working_hours_week,
            'working_hours_sat' => $working_hours_sat,
            'footer_text' => $footer_text,
            'social_instagram' => $social_instagram,
            'social_facebook' => $social_facebook,
            'social_linkedin' => $social_linkedin,
            'id' => $exists
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO site_settings (company_name, slogan, phone, whatsapp, email, address, working_hours_week, working_hours_sat, footer_text, social_instagram, social_facebook, social_linkedin)
            VALUES (:company_name, :slogan, :phone, :whatsapp, :email, :address, :working_hours_week, :working_hours_sat, :footer_text, :social_instagram, :social_facebook, :social_linkedin)
        ");
        $stmt->execute([
            'company_name' => $company_name,
            'slogan' => $slogan,
            'phone' => $phone,
            'whatsapp' => $whatsapp,
            'email' => $email,
            'address' => $address,
            'working_hours_week' => $working_hours_week,
            'working_hours_sat' => $working_hours_sat,
            'footer_text' => $footer_text,
            'social_instagram' => $social_instagram,
            'social_facebook' => $social_facebook,
            'social_linkedin' => $social_linkedin
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Configurações guardadas com sucesso.'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar configurações: ' . $e->getMessage()]);
}

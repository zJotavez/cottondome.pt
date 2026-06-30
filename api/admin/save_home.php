<?php
/**
 * Cotton Dome LDA - Save Home Content API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$hero_title = trim($input['hero_title'] ?? '');
$hero_subtitle = trim($input['hero_subtitle'] ?? '');
$hero_image = trim($input['hero_image'] ?? '');
$hero_video = trim($input['hero_video'] ?? '');
$primary_button_text = trim($input['primary_button_text'] ?? '');
$primary_button_link = trim($input['primary_button_link'] ?? '');
$secondary_button_text = trim($input['secondary_button_text'] ?? '');
$secondary_button_link = trim($input['secondary_button_link'] ?? '');

if (empty($hero_title)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O título principal do Hero é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if row exists
    $check = $pdo->query("SELECT id FROM home_content LIMIT 1");
    $exists = $check->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("
            UPDATE home_content 
            SET hero_title = :hero_title, hero_subtitle = :hero_subtitle, hero_image = :hero_image, 
                hero_video = :hero_video, primary_button_text = :primary_button_text, 
                primary_button_link = :primary_button_link, secondary_button_text = :secondary_button_text, 
                secondary_button_link = :secondary_button_link
            WHERE id = :id
        ");
        $stmt->execute([
            'hero_title' => $hero_title,
            'hero_subtitle' => $hero_subtitle,
            'hero_image' => $hero_image,
            'hero_video' => $hero_video,
            'primary_button_text' => $primary_button_text,
            'primary_button_link' => $primary_button_link,
            'secondary_button_text' => $secondary_button_text,
            'secondary_button_link' => $secondary_button_link,
            'id' => $exists
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO home_content (hero_title, hero_subtitle, hero_image, hero_video, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
            VALUES (:hero_title, :hero_subtitle, :hero_image, :hero_video, :primary_button_text, :primary_button_link, :secondary_button_text, :secondary_button_link)
        ");
        $stmt->execute([
            'hero_title' => $hero_title,
            'hero_subtitle' => $hero_subtitle,
            'hero_image' => $hero_image,
            'hero_video' => $hero_video,
            'primary_button_text' => $primary_button_text,
            'primary_button_link' => $primary_button_link,
            'secondary_button_text' => $secondary_button_text,
            'secondary_button_link' => $secondary_button_link
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Conteúdo da Home guardado com sucesso.'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar conteúdo da Home: ' . $e->getMessage()]);
}

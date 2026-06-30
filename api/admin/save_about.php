<?php
/**
 * Cotton Dome LDA - Save About Content API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$title = trim($input['title'] ?? '');
$description = trim($input['description'] ?? '');
$mission = trim($input['mission'] ?? '');
$vision = trim($input['vision'] ?? '');
$values = trim($input['values'] ?? '');
$image = trim($input['image'] ?? '');
$video = trim($input['video'] ?? '');

if (empty($title)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O título institucional é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if row exists
    $check = $pdo->query("SELECT id FROM about_content LIMIT 1");
    $exists = $check->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("
            UPDATE about_content 
            SET title = :title, description = :description, mission = :mission, 
                vision = :vision, `values` = :values, image = :image, video = :video
            WHERE id = :id
        ");
        $stmt->execute([
            'title' => $title,
            'description' => $description,
            'mission' => $mission,
            'vision' => $vision,
            'values' => $values,
            'image' => $image,
            'video' => $video,
            'id' => $exists
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO about_content (title, description, mission, vision, `values`, image, video)
            VALUES (:title, :description, :mission, :vision, :values, :image, :video)
        ");
        $stmt->execute([
            'title' => $title,
            'description' => $description,
            'mission' => $mission,
            'vision' => $vision,
            'values' => $values,
            'image' => $image,
            'video' => $video
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Seção Sobre guardada com sucesso.'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar seção Sobre: ' . $e->getMessage()]);
}

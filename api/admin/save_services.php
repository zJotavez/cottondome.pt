<?php
/**
 * Cotton Dome LDA - Save Services API (Upsert)
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = isset($input['id']) ? intval($input['id']) : null;
$title = trim($input['title'] ?? '');
$slug = trim($input['slug'] ?? '');
$short_description = trim($input['short_description'] ?? '');
$icon = trim($input['icon'] ?? 'Camera');
$image = trim($input['image'] ?? '');
$video = trim($input['video'] ?? '');
$is_active = isset($input['is_active']) ? intval($input['is_active']) : 1;
$display_order = isset($input['display_order']) ? intval($input['display_order']) : 0;

if (empty($title) || empty($slug)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Título e URL Amigável (slug) são obrigatórios.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Format slug to url friendly format
$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(str_replace(' ', '-', $slug)));

try {
    if ($id) {
        // Update
        $stmt = $pdo->prepare("
            UPDATE services 
            SET title = :title, slug = :slug, short_description = :short_description, 
                icon = :icon, image = :image, video = :video, is_active = :is_active, 
                display_order = :display_order
            WHERE id = :id
        ");
        $stmt->execute([
            'title' => $title,
            'slug' => $slug,
            'short_description' => $short_description,
            'icon' => $icon,
            'image' => $image,
            'video' => $video,
            'is_active' => $is_active,
            'display_order' => $display_order,
            'id' => $id
        ]);
        $message = 'Serviço atualizado com sucesso.';
    } else {
        // Check duplicate slug
        $check = $pdo->prepare("SELECT id FROM services WHERE slug = :slug");
        $check->execute(['slug' => $slug]);
        if ($check->fetchColumn()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Já existe um serviço com este slug.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Insert
        $stmt = $pdo->prepare("
            INSERT INTO services (title, slug, short_description, icon, image, video, is_active, display_order)
            VALUES (:title, :slug, :short_description, :icon, :image, :video, :is_active, :display_order)
        ");
        $stmt->execute([
            'title' => $title,
            'slug' => $slug,
            'short_description' => $short_description,
            'icon' => $icon,
            'image' => $image,
            'video' => $video,
            'is_active' => $is_active,
            'display_order' => $display_order
        ]);
        $id = $pdo->lastInsertId();
        
        // Also create a default empty service page entry for this service
        $pageStmt = $pdo->prepare("
            INSERT INTO service_pages (service_id, page_title, impact_phrase, full_description, seo_title)
            VALUES (:service_id, :page_title, :impact_phrase, :full_description, :seo_title)
        ");
        $pageStmt->execute([
            'service_id' => $id,
            'page_title' => $title,
            'impact_phrase' => 'Solução de excelência em ' . $title,
            'full_description' => 'A Cotton Dome LDA oferece soluções completas de ' . $title . '.',
            'seo_title' => $title . ' | Cotton Dome LDA'
        ]);

        $message = 'Serviço e página correspondente criados com sucesso.';
    }

    echo json_encode(['success' => true, 'message' => $message, 'id' => $id], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar serviço: ' . $e->getMessage()]);
}

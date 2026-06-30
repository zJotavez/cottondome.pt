<?php
/**
 * Cotton Dome LDA - Save SEO Settings API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$page_slug = trim($input['page_slug'] ?? '');
$seo_title = trim($input['seo_title'] ?? '');
$seo_description = trim($input['seo_description'] ?? '');
$seo_keywords = trim($input['seo_keywords'] ?? '');
$og_image = trim($input['og_image'] ?? '');
$favicon = trim($input['favicon'] ?? '');

if (empty($page_slug)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O caminho da página (slug) é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if row exists for page_slug
    $check = $pdo->prepare("SELECT id FROM seo_settings WHERE page_slug = :page_slug LIMIT 1");
    $check->execute(['page_slug' => $page_slug]);
    $exists = $check->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("
            UPDATE seo_settings 
            SET seo_title = :seo_title, seo_description = :seo_description, seo_keywords = :seo_keywords, 
                og_image = :og_image, favicon = :favicon
            WHERE id = :id
        ");
        $stmt->execute([
            'seo_title' => $seo_title,
            'seo_description' => $seo_description,
            'seo_keywords' => $seo_keywords,
            'og_image' => $og_image,
            'favicon' => $favicon,
            'id' => $exists
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO seo_settings (page_slug, seo_title, seo_description, seo_keywords, og_image, favicon)
            VALUES (:page_slug, :seo_title, :seo_description, :seo_keywords, :og_image, :favicon)
        ");
        $stmt->execute([
            'page_slug' => $page_slug,
            'seo_title' => $seo_title,
            'seo_description' => $seo_description,
            'seo_keywords' => $seo_keywords,
            'og_image' => $og_image,
            'favicon' => $favicon
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'SEO guardado com sucesso.'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar SEO: ' . $e->getMessage()]);
}

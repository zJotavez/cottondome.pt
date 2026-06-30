<?php
/**
 * Cotton Dome LDA - Save Service Page Details API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$service_id = isset($input['service_id']) ? intval($input['service_id']) : null;
$page_title = trim($input['page_title'] ?? '');
$impact_phrase = trim($input['impact_phrase'] ?? '');
$full_description = trim($input['full_description'] ?? '');

// These are expected as arrays from React, we will encode them to JSON
$applications = isset($input['applications']) ? json_encode($input['applications'], JSON_UNESCAPED_UNICODE) : '[]';
$related_products = isset($input['related_products']) ? json_encode($input['related_products'], JSON_UNESCAPED_UNICODE) : '[]';
$benefits = isset($input['benefits']) ? json_encode($input['benefits'], JSON_UNESCAPED_UNICODE) : '[]';
$work_process = isset($input['work_process']) ? json_encode($input['work_process'], JSON_UNESCAPED_UNICODE) : '[]';

$final_cta_title = trim($input['final_cta_title'] ?? '');
$final_cta_text = trim($input['final_cta_text'] ?? '');
$seo_title = trim($input['seo_title'] ?? '');
$seo_description = trim($input['seo_description'] ?? '');
$seo_keywords = trim($input['seo_keywords'] ?? '');

if (!$service_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O ID do serviço é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Check if service page entry already exists
    $check = $pdo->prepare("SELECT id FROM service_pages WHERE service_id = :service_id LIMIT 1");
    $check->execute(['service_id' => $service_id]);
    $exists = $check->fetchColumn();

    if ($exists) {
        $stmt = $pdo->prepare("
            UPDATE service_pages 
            SET page_title = :page_title, impact_phrase = :impact_phrase, full_description = :full_description, 
                applications = :applications, related_products = :related_products, benefits = :benefits, 
                work_process = :work_process, final_cta_title = :final_cta_title, final_cta_text = :final_cta_text, 
                seo_title = :seo_title, seo_description = :seo_description, seo_keywords = :seo_keywords
            WHERE service_id = :service_id
        ");
        $stmt->execute([
            'page_title' => $page_title,
            'impact_phrase' => $impact_phrase,
            'full_description' => $full_description,
            'applications' => $applications,
            'related_products' => $related_products,
            'benefits' => $benefits,
            'work_process' => $work_process,
            'final_cta_title' => $final_cta_title,
            'final_cta_text' => $final_cta_text,
            'seo_title' => $seo_title,
            'seo_description' => $seo_description,
            'seo_keywords' => $seo_keywords,
            'service_id' => $service_id
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO service_pages (service_id, page_title, impact_phrase, full_description, applications, related_products, benefits, work_process, final_cta_title, final_cta_text, seo_title, seo_description, seo_keywords)
            VALUES (:service_id, :page_title, :impact_phrase, :full_description, :applications, :related_products, :benefits, :work_process, :final_cta_title, :final_cta_text, :seo_title, :seo_description, :seo_keywords)
        ");
        $stmt->execute([
            'service_id' => $service_id,
            'page_title' => $page_title,
            'impact_phrase' => $impact_phrase,
            'full_description' => $full_description,
            'applications' => $applications,
            'related_products' => $related_products,
            'benefits' => $benefits,
            'work_process' => $work_process,
            'final_cta_title' => $final_cta_title,
            'final_cta_text' => $final_cta_text,
            'seo_title' => $seo_title,
            'seo_description' => $seo_description,
            'seo_keywords' => $seo_keywords
        ]);
    }

    // Also let's update corresponding page slug SEO settings if needed, or keep it linked to path `/servicos/[slug]`
    $slugStmt = $pdo->prepare("SELECT slug FROM services WHERE id = :id LIMIT 1");
    $slugStmt->execute(['id' => $service_id]);
    $slug = $slugStmt->fetchColumn();

    if ($slug) {
        $pageSlug = '/servicos/' . $slug;
        $checkSeo = $pdo->prepare("SELECT id FROM seo_settings WHERE page_slug = :slug LIMIT 1");
        $checkSeo->execute(['slug' => $pageSlug]);
        $seoExists = $checkSeo->fetchColumn();

        if ($seoExists) {
            $updateSeo = $pdo->prepare("
                UPDATE seo_settings 
                SET seo_title = :title, seo_description = :desc, seo_keywords = :keys
                WHERE page_slug = :slug
            ");
            $updateSeo->execute([
                'title' => $seo_title,
                'desc' => $seo_description,
                'keys' => $seo_keywords,
                'slug' => $pageSlug
            ]);
        } else {
            $insertSeo = $pdo->prepare("
                INSERT INTO seo_settings (page_slug, seo_title, seo_description, seo_keywords)
                VALUES (:slug, :title, :desc, :keys)
            ");
            $insertSeo->execute([
                'slug' => $pageSlug,
                'title' => $seo_title,
                'desc' => $seo_description,
                'keys' => $seo_keywords
            ]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Página do serviço guardada com sucesso.'], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar detalhes da página: ' . $e->getMessage()]);
}

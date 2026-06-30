<?php
/**
 * Cotton Dome LDA - Get Site Content API
 */

// Enable CORS for local dev environment testing
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

try {
    // 1. Fetch site settings
    $settingsStmt = $pdo->query("SELECT * FROM site_settings LIMIT 1");
    $settings = $settingsStmt->fetch();
    if (!$settings) {
        $settings = [];
    }

    // 2. Fetch home content
    $homeStmt = $pdo->query("SELECT * FROM home_content LIMIT 1");
    $home = $homeStmt->fetch();
    if (!$home) {
        $home = [];
    }

    // 3. Fetch about content
    $aboutStmt = $pdo->query("SELECT * FROM about_content LIMIT 1");
    $about = $aboutStmt->fetch();
    if (!$about) {
        $about = [];
    }

    // 4. Fetch services (ordered)
    $servicesStmt = $pdo->query("SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
    $services = $servicesStmt->fetchAll();

    // 5. Fetch service pages details
    $servicePagesStmt = $pdo->query("SELECT * FROM service_pages");
    $rawServicePages = $servicePagesStmt->fetchAll();
    
    // Parse service pages JSON strings (applications, related_products, benefits, work_process)
    $servicePages = [];
    foreach ($rawServicePages as $page) {
        $page['applications'] = json_decode($page['applications'] ?? '[]', true);
        $page['related_products'] = json_decode($page['related_products'] ?? '[]', true);
        $page['benefits'] = json_decode($page['benefits'] ?? '[]', true);
        $page['work_process'] = json_decode($page['work_process'] ?? '[]', true);
        $servicePages[] = $page;
    }

    // 6. Fetch suppliers (ordered)
    $suppliersStmt = $pdo->query("SELECT * FROM suppliers WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
    $suppliers = $suppliersStmt->fetchAll();

    // 7. Fetch gallery (ordered)
    $galleryStmt = $pdo->query("SELECT * FROM gallery WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
    $gallery = $galleryStmt->fetchAll();

    // 8. Fetch SEO settings
    $seoStmt = $pdo->query("SELECT * FROM seo_settings");
    $seo = $seoStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'settings' => $settings,
            'home' => $home,
            'about' => $about,
            'services' => $services,
            'servicePages' => $servicePages,
            'suppliers' => $suppliers,
            'gallery' => $gallery,
            'seo' => $seo
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load site content: ' . $e->getMessage()
    ]);
}

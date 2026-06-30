<?php
/**
 * Cotton Dome LDA - Server-Side SEO & Router Injection Entrypoint
 */

// 1. Initialize database connection
require_once __DIR__ . '/api/config.php';

// 2. Parse request URI to match seo_settings page_slug
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Clean up trailing slash unless it's just "/"
if ($requestUri !== '/' && substr($requestUri, -1) === '/') {
    $requestUri = rtrim($requestUri, '/');
}

// 3. Fallback/Default values (Home SEO)
$seoTitle = "Cotton Dome LDA | Segurança, CCTV, Controlo de Acessos e Automatismos";
$seoDesc = "Soluções inteligentes em segurança eletrónica, CCTV, videovigilância, controlo de acessos, intrusão, deteção de incêndio, automatismos, redes, telecomunicações e portões de segurança.";
$seoKeys = "Cotton Dome LDA, segurança eletrónica, CCTV, videovigilância, controlo de acessos, automatismos, portões automáticos, deteção de incêndio, sistemas de alarme, redes, telecomunicações, Portugal";
$ogImage = "images/logo.png";
$favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4AF37'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.11v4.71c0 4.22-2.77 8.3-7 9.5-4.23-1.2-7-5.28-7-9.5V6.29l7-3.11z'/%3E%3Cpath d='M12 6.5l-4 3.5h3v6h2v-6h3z' opacity='0.3'/%3E%3C/svg%3E";

try {
    // 4. Fetch general settings (for favicon fallback)
    $settingsStmt = $pdo->query("SELECT company_name FROM site_settings LIMIT 1");
    $settings = $settingsStmt->fetch();
    $companyName = ($settings) ? $settings['company_name'] : 'Cotton Dome LDA';

    // 5. Query matching SEO settings for the current path
    $seoStmt = $pdo->prepare("SELECT * FROM seo_settings WHERE page_slug = :slug LIMIT 1");
    $seoStmt->execute(['slug' => $requestUri]);
    $seoData = $seoStmt->fetch();

    if ($seoData) {
        if (!empty($seoData['seo_title'])) $seoTitle = $seoData['seo_title'];
        if (!empty($seoData['seo_description'])) $seoDesc = $seoData['seo_description'];
        if (!empty($seoData['seo_keywords'])) $seoKeys = $seoData['seo_keywords'];
        if (!empty($seoData['og_image'])) $ogImage = $seoData['og_image'];
        if (!empty($seoData['favicon'])) $favicon = $seoData['favicon'];
    } else {
        // Try fallback for sub-pages if exact match is not found
        // E.g. check if it starts with /servicos/
        if (strpos($requestUri, '/servicos/') === 0) {
            // Find service slug
            $serviceSlug = str_replace('/servicos/', '', $requestUri);
            $serviceStmt = $pdo->prepare("
                SELECT sp.* FROM service_pages sp
                JOIN services s ON s.id = sp.service_id
                WHERE s.slug = :slug LIMIT 1
            ");
            $serviceStmt->execute(['slug' => $serviceSlug]);
            $servicePage = $serviceStmt->fetch();

            if ($servicePage) {
                if (!empty($servicePage['seo_title'])) $seoTitle = $servicePage['seo_title'];
                if (!empty($servicePage['seo_description'])) $seoDesc = $servicePage['seo_description'];
                if (!empty($servicePage['seo_keywords'])) $seoKeys = $servicePage['seo_keywords'];
                // Get service image for OG
                $imgStmt = $pdo->prepare("SELECT image FROM services WHERE slug = :slug LIMIT 1");
                $imgStmt->execute(['slug' => $serviceSlug]);
                $serviceImg = $imgStmt->fetchColumn();
                if ($serviceImg) $ogImage = $serviceImg;
            }
        }
    }
} catch (Exception $e) {
    // Fail silently, use fallbacks
}

// Ensure OG Image is absolute or absolute path relative to domain
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
if (strpos($ogImage, 'http') !== 0 && !empty($ogImage)) {
    $ogImage = $protocol . $host . '/' . ltrim($ogImage, '/');
}

// 6. Find compiled index.html file
$htmlFile = __DIR__ . '/index.html'; // In production (at root)
if (!file_exists($htmlFile)) {
    $htmlFile = __DIR__ . '/dist/index.html'; // Local Vite build testing
}

if (!file_exists($htmlFile)) {
    // If React app is not compiled yet, show a clean message
    http_response_code(503);
    echo "<h3>Website em Manutenção / Atualização</h3><p>O site está a ser compilado. Por favor, volte a tentar em instantes.</p>";
    exit;
}

$html = file_get_contents($htmlFile);

// 7. Inject SEO Metadata using Regular Expressions
// Inject Title
$html = preg_replace('/<title>.*?<\/title>/si', "<title>" . htmlspecialchars($seoTitle) . "</title>", $html);

// Inject Meta Description
if (preg_match('/<meta[^>]*name=["\']description["\'][^>]*>/i', $html)) {
    $html = preg_replace('/(<meta[^>]*name=["\']description["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoDesc) . "$2", $html);
} else {
    $html = str_replace('</head>', '<meta name="description" content="' . htmlspecialchars($seoDesc) . '" />' . "\n</head>", $html);
}

// Inject Meta Keywords
if (preg_match('/<meta[^>]*name=["\']keywords["\'][^>]*>/i', $html)) {
    $html = preg_replace('/(<meta[^>]*name=["\']keywords["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoKeys) . "$2", $html);
} else {
    $html = str_replace('</head>', '<meta name="keywords" content="' . htmlspecialchars($seoKeys) . '" />' . "\n</head>", $html);
}

// Inject Open Graph Title
$html = preg_replace('/(<meta[^>]*property=["\']og:title["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoTitle) . "$2", $html);

// Inject Open Graph Description
$html = preg_replace('/(<meta[^>]*property=["\']og:description["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoDesc) . "$2", $html);

// Inject Open Graph Image
$html = preg_replace('/(<meta[^>]*property=["\']og:image["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($ogImage) . "$2", $html);

// Inject Twitter Title
$html = preg_replace('/(<meta[^>]*property=["\']twitter:title["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoTitle) . "$2", $html);

// Inject Twitter Description
$html = preg_replace('/(<meta[^>]*property=["\']twitter:description["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($seoDesc) . "$2", $html);

// Inject Twitter Image
$html = preg_replace('/(<meta[^>]*property=["\']twitter:image["\'][^>]*content=)(["\'])(.*?)\2/i', "$1$2" . htmlspecialchars($ogImage) . "$2", $html);

// Inject Favicon
if (!empty($favicon)) {
    // Replace SVG favicon
    $html = preg_replace('/<link[^>]*rel=["\']icon["\'][^>]*type=["\']image\/svg\+xml["\'][^>]*href=(["\'])(.*?)\1/i', '<link rel="icon" type="image/svg+xml" href="' . htmlspecialchars($favicon) . '"', $html);
}

// 8. Serve the dynamically updated HTML
echo $html;

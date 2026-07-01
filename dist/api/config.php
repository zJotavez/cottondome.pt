<?php
/**
 * Cotton Dome LDA — Configuração central (sem base de dados, usa JSON)
 */

// Sessão segura
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
    }
    session_start();
}

// CORS para o React
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Pasta onde os dados JSON são guardados
define('DATA_DIR', __DIR__ . '/data/');

// Criar pasta de dados se não existir
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Carregar credenciais (do credentials.json ou padrão)
$credFile = DATA_DIR . 'credentials.json';
$adminUser = 'suporte@domme.pt';
$adminPassHash = password_hash('#CD2026lda', PASSWORD_DEFAULT);

if (file_exists($credFile)) {
    $creds = json_decode(file_get_contents($credFile), true);
    if (!empty($creds['username'])) {
        $adminUser = $creds['username'];
    }
    if (!empty($creds['password_hash'])) {
        $adminPassHash = $creds['password_hash'];
    }
}

define('ADMIN_USERNAME', $adminUser);
define('ADMIN_PASSWORD_HASH', $adminPassHash);

// Ficheiro principal de conteúdo do site
define('DATA_FILE', DATA_DIR . 'site_data.json');

// Ficheiro de mensagens de contacto
define('MESSAGES_FILE', DATA_DIR . 'messages.json');

// Pasta de uploads
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('UPLOADS_URL', '/uploads/');

if (!is_dir(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readData(): array {
    if (!file_exists(DATA_FILE)) return getDefaultData();
    $raw = file_get_contents(DATA_FILE);
    $data = json_decode($raw, true);
    return $data ?: getDefaultData();
}

function writeData(array $data): bool {
    return file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}

function readMessages(): array {
    if (!file_exists(MESSAGES_FILE)) return [];
    return json_decode(file_get_contents(MESSAGES_FILE), true) ?: [];
}

function writeMessages(array $messages): bool {
    return file_put_contents(MESSAGES_FILE, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}

function jsonResponse(bool $success, $data = null, string $error = ''): void {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => $success, 'data' => $data, 'error' => $error]);
    exit;
}

function requireAuth(): void {
    if (empty($_SESSION['admin_logged_in'])) {
        http_response_code(401);
        jsonResponse(false, null, 'Não autenticado.');
    }
}

// ── Dados padrão do site ─────────────────────────────────────────────────────

function getDefaultData(): array {
    return [
        'settings' => [
            'company_name'        => 'Cotton Dome LDA',
            'tagline'             => 'Soluções de Segurança Profissional',
            'phone'               => '+351 918 880 788',
            'whatsapp'            => '+351918880788',
            'email'               => 'suporte@domme.pt',
            'address'             => 'Norte e Centro de Portugal',
            'working_hours_week'  => 'Segunda a Sexta: 09h00 – 18h00',
            'working_hours_sat'   => 'Sábado: 09h00 – 13h00',
            'nif'                 => '517 557 026',
        ],
        'home' => [
            'hero_title'    => 'Segurança que não compromete.',
            'hero_subtitle' => 'Sistemas integrados de proteção para residências e empresas em todo o Norte e Centro de Portugal.',
            'hero_cta'      => 'Solicitar Orçamento',
        ],
        'about' => [
            'title'       => 'Sobre a Cotton Dome',
            'description' => 'A Cotton Dome LDA é uma empresa portuguesa especializada em soluções de segurança eletrónica.',
            'mission'     => 'Proteger o que mais importa com tecnologia de excelência.',
            'years'       => '10+',
            'clients'     => '500+',
            'projects'    => '1000+',
        ],
        'services' => [
            ['id' => 1, 'title' => 'Alarme & Intrusão',      'slug' => 'alarme-intrusao',    'icon' => 'shield',    'active' => true],
            ['id' => 2, 'title' => 'Controlo de Acessos',    'slug' => 'controle-acesso',    'icon' => 'key',       'active' => true],
            ['id' => 3, 'title' => 'Videovigilância CCTV',   'slug' => 'cctv',               'icon' => 'camera',    'active' => true],
            ['id' => 4, 'title' => 'Redes Estruturadas',     'slug' => 'redes-estruturadas', 'icon' => 'network',   'active' => true],
            ['id' => 5, 'title' => 'UPS & Energia',          'slug' => 'ups-energia',        'icon' => 'zap',       'active' => true],
            ['id' => 6, 'title' => 'Deteção de Incêndio',    'slug' => 'incendio',           'icon' => 'flame',     'active' => true],
        ],
        'service_pages' => [],
        'suppliers'     => [],
        'gallery'       => [],
        'seo'           => [
            ['page' => 'home',    'title' => 'Cotton Dome LDA | Segurança Profissional', 'description' => 'Sistemas de segurança eletrônica para residências e empresas.', 'keywords' => 'segurança, alarmes, CCTV, Portugal'],
            ['page' => 'about',   'title' => 'Sobre Nós | Cotton Dome LDA',             'description' => 'Conheça a Cotton Dome LDA.', 'keywords' => 'Cotton Dome, segurança eletrônica'],
            ['page' => 'contact', 'title' => 'Contacto | Cotton Dome LDA',              'description' => 'Entre em contacto connosco.', 'keywords' => 'contacto, orçamento, segurança'],
        ],
    ];
}

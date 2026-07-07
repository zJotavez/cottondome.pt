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

// Configuração robusta de CORS para suportar Cookies de Sessão (credentials: include)
$allowedOrigin = 'https://domme.pt';
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    // Permitir domme.pt, localhost (para desenvolvimento) ou subdomínios
    if (strpos($origin, 'domme.pt') !== false || strpos($origin, 'localhost') !== false) {
        $allowedOrigin = $origin;
    }
}
header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Pasta onde os dados JSON são guardados
define('DATA_DIR', __DIR__ . '/data/');

// Criar pasta de dados se não existir
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Carregar credenciais (do credentials.json ou padrão)
$credFile = DATA_DIR . 'credentials.json';
$adminUser = 'suporte@domme.pt';
$adminPassHash = password_hash('CottonDome2026_SecureAdminPass!', PASSWORD_DEFAULT);

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

// Ficheiros de conteúdo do site (Rascunho e Publicado)
define('DATA_FILE_PUBLISHED', DATA_DIR . 'site_data.json');
define('DATA_FILE_DRAFT', DATA_DIR . 'site_data_draft.json');
define('DATA_FILE', DATA_FILE_PUBLISHED); // Legado

// Ficheiro de histórico de alterações
define('HISTORY_FILE', DATA_DIR . 'history.json');

// Ficheiro de mensagens de contacto
define('MESSAGES_FILE', DATA_DIR . 'messages.json');

// Pasta de uploads
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('UPLOADS_URL', '/uploads/');

if (!is_dir(UPLOADS_DIR)) {
    mkdir(UPLOADS_DIR, 0755, true);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readData(bool $draft = false): array {
    $file = $draft ? DATA_FILE_DRAFT : DATA_FILE_PUBLISHED;
    if (!file_exists($file)) {
        $otherFile = $draft ? DATA_FILE_PUBLISHED : DATA_FILE_DRAFT;
        if (file_exists($otherFile)) {
            $raw = file_get_contents($otherFile);
            $data = json_decode($raw, true);
            if ($data) {
                file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                return $data;
            }
        }
        $default = getDefaultData();
        file_put_contents($file, json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $default;
    }
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    return $data ?: getDefaultData();
}

function writeData(array $data, bool $draft = true): bool {
    $file = $draft ? DATA_FILE_DRAFT : DATA_FILE_PUBLISHED;
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
}

function publishData(): bool {
    $draft = readData(true);
    return writeData($draft, false);
}

function logChange(string $action, string $contentDesc): void {
    $history = [];
    if (file_exists(HISTORY_FILE)) {
        $history = json_decode(file_get_contents(HISTORY_FILE), true) ?: [];
    }
    $user = $_SESSION['admin_user'] ?? 'Administrador';
    array_unshift($history, [
        'id'      => time() . '_' . rand(1000, 9999),
        'user'    => $user,
        'action'  => $action,
        'content' => $contentDesc,
        'date'    => date('Y-m-d'),
        'time'    => date('H:i:s')
    ]);
    if (count($history) > 100) {
        $history = array_slice($history, 0, 100);
    }
    file_put_contents(HISTORY_FILE, json_encode($history, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
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
            'companyName'         => 'Cotton Dome LDA',
            'tagline'             => 'Soluções de Segurança Profissional',
            'phone'               => '+351 918 880 788',
            'whatsapp'            => '+351 918 880 788',
            'email'               => 'suporte@domme.pt',
            'address'             => 'Portugal',
            'working_hours_week'  => 'Segunda a Sexta-feira: 09:00h às 18:30h',
            'working_hours_sat'   => 'Sábado (Urgências): 09:00h às 13:00h',
            'nif'                 => '517 557 026',
            'footer_text'         => 'Segurança eletrónica de alta performance para residências, empresas e condomínios.',
            'social_instagram'    => 'https://instagram.com/cottondome',
            'social_facebook'     => 'https://facebook.com/cottondome',
            'social_linkedin'     => 'https://linkedin.com/company/cottondome',
        ],
        'home' => [
            'hero_title'    => 'Segurança Inteligente para Residências, Empresas e Condomínios',
            'hero_subtitle' => 'A Cotton Dome LDA desenvolve soluções completas em videovigilância, controlo de acessos, intrusão, automatismos, redes, telecomunicações e sistemas de proteção profissional.',
            'hero_cta'      => 'Solicitar Orçamento',
            'hero_image'    => 'images/logo.png',
            'hero_video'    => 'videos/hero-video.mp4',
            'primary_button_text'   => 'Solicitar Orçamento',
            'primary_button_link'   => '#contacto',
            'secondary_button_text' => 'Conhecer Soluções',
            'secondary_button_link' => '#solucoes',
        ],
        'about' => [
            'title'       => 'Quem Somos',
            'description' => 'A Cotton Dome LDA é uma empresa especializada em engenharia de segurança eletrónica e infraestrutura tecnológica, focada em fornecer as melhores soluções de proteção e conectividade para moradias, empresas, condomínios e indústrias em Portugal.',
            'mission'     => 'Fornecer soluções tecnológicas integradas com rigor técnico e ética profissional, promovendo a segurança e o conforto dos nossos clientes.',
            'vision'      => 'Ser a referência nacional em qualidade, inovação e confiança nos domínios da segurança eletrónica e infraestrutura técnica de redes.',
            'values'      => 'Rigor técnico, Integridade, Inovação constante, Foco no cliente, Estética e organização operacional.',
            'years'       => '10+',
            'clients'     => '500+',
            'projects'    => '1000+',
            'image'       => 'images/logo.png',
        ],
        'services' => [
            [
                'id' => 1,
                'title' => 'CCTV / Videovigilância Profissional',
                'slug' => 'cctv-videovigilancia',
                'icon' => 'Camera',
                'image' => '/images/cctv-hero.png',
                'active' => true,
                'is_active' => 1,
                'display_order' => 1,
                'slogan' => 'Vigilância inteligente 24/7 com câmeras de alta definição e IA para proteger o que mais importa.',
                'shortDescription' => 'Câmeras IP e analógicas HD com inteligência artificial, gravação contínua e monitorização remota em tempo real via app.',
                'short_description' => 'Câmeras IP e analógicas HD com inteligência artificial, gravação contínua e monitorização remota em tempo real via app.',
                'description' => 'A Cotton Dome LDA projeta e instala sistemas de videovigilância (CCTV) profissionais com câmeras IP e analógicas de alta definição que incorporam inteligência artificial para deteção precisa de pessoas e veículos. Cada projeto é desenhado à medida do espaço: residências, condomínios, escritórios, comércio e indústria. Monitorize o seu espaço de qualquer ponto do mundo em tempo real, com gravação segura e redundante, alertas automáticos por movimento e acesso via smartphone ou tablet.',
                'products' => ['câmeras IP', 'câmeras analógicas', 'câmeras dome', 'câmeras bullet', 'gravadores DVR', 'gravadores NVR', 'discos de gravação', 'fontes de alimentação', 'cablagem', 'acesso remoto por aplicação'],
                'benefits' => ['monitorização em tempo real 24/7', 'gravação contínua e segura', 'acesso remoto via smartphone', 'deteção inteligente de pessoas e veículos', 'prevenção e dissuasão de intrusões', 'mais segurança para pessoas e património']
            ],
            [
                'id' => 2,
                'title' => 'Sistemas de Alarme e Intrusão',
                'slug' => 'intrusao-sistemas-alarme',
                'icon' => 'ShieldAlert',
                'image' => '/images/alarme-hero.png',
                'active' => true,
                'is_active' => 1,
                'display_order' => 2,
                'slogan' => 'Proteção inteligente contra invasões com alertas instantâneos e resposta imediata no seu telemóvel.',
                'shortDescription' => 'Centrais de alarme conectadas, sensores de movimento avançados, sirenes de alto impacto e proteção perimetral 24/7.',
                'short_description' => 'Centrais de alarme conectadas, sensores de movimento avançados, sirenes de alto impacto e proteção perimetral 24/7.',
                'description' => 'Os nossos sistemas de alarme e deteção de intrusão criam uma barreira de segurança activa e inteligente em torno do seu espaço. Utilizamos centrais avançadas com ou sem fios, detetores de movimento PIR imunes a animais de estimação, sensores magnéticos para portas e janelas, e proteção perimetral exterior com barreiras infravermelhas. Em caso de intrusão, o alerta chega imediatamente ao seu telemóvel — podendo também ser ligado a uma central de monitorização profissional com despacho de segurança.',
                'products' => ['centrais de alarme', 'sensores de movimento', 'sensores magnéticos', 'sensores perimetrais', 'sirenes', 'teclados de alarme', 'comandos', 'módulos GSM ou Wi-Fi', 'detectores internos e externos'],
                'benefits' => ['proteção contra invasões', 'alerta imediato', 'segurança perimetral', 'integração com outros sistemas', 'maior tranquilidade', 'controlo do ambiente protegido']
            ],
            [
                'id' => 3,
                'title' => 'Controlo de Acessos',
                'slug' => 'controlo-de-acessos',
                'icon' => 'Fingerprint',
                'image' => '/images/controlo-acessos-hero.png',
                'active' => true,
                'is_active' => 1,
                'display_order' => 3,
                'slogan' => 'Segurança máxima em cada entrada: apenas pessoas autorizadas acedem ao seu espaço.',
                'shortDescription' => 'Biometria, reconhecimento facial, RFID e fechaduras eletrónicas para controlo total de acessos em empresas e condomínios.',
                'short_description' => 'Biometria, reconhecimento facial, RFID e fechaduras eletrónicas para controlo total de acessos em empresas e condomínios.',
                'description' => 'A Cotton Dome LDA fornece e instala sistemas avançados de controlo de acessos para residências, empresas, condomínios e indústrias. Controle quem entra, quando e por onde — com tecnologias de ponta como reconhecimento facial em frações de segundo, leitores biométricos de impressão digital, cartões e tags RFID, teclados numéricos e fechaduras eletrónicas. Todos os acessos ficam registados em tempo real, com histórico completo e integração com sistemas de CCTV e alarme para segurança total.',
                'products' => ['leitores de cartão', 'tags', 'teclados numéricos', 'biometria', 'reconhecimento facial', 'fechaduras elétricas', 'botões de acesso', 'controladores de acesso', 'torniquetes', 'software de gestão de utilizadores'],
                'benefits' => ['maior controlo de entradas', 'gestão de permissões', 'redução de acessos não autorizados', 'mais segurança para empresas e condomínios', 'histórico de acessos', 'integração com CCTV e alarmes']
            ],
            [
                'id' => 4,
                'title' => 'Sistemas de Deteção de Incêndio',
                'slug' => 'detecao-de-incendio',
                'icon' => 'Flame',
                'image' => 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 4,
                'slogan' => 'Prevenção, alerta e segurança para proteger pessoas, espaços e património.',
                'shortDescription' => 'Sistemas de deteção e alerta para prevenção, segurança e resposta rápida em situações de incêndio.',
                'short_description' => 'Sistemas de deteção e alerta para prevenção, segurança e resposta rápida em situações de incêndio.',
                'description' => 'Os sistemas de deteção de incêndio são essenciais para ambientes comerciais, industriais, residenciais coletivos e institucionais. A Cotton Dome LDA trabalha com soluções de deteção e alerta que permitem identificar sinais de incêndio e acionar respostas rápidas em situações de risco.',
                'products' => ['centrais de incêndio', 'detetores de fumo', 'detetores térmicos', 'botões manuais de alarme', 'sirenes', 'sinalizadores', 'módulos de controlo', 'sistemas de evacuação', 'cablagem técnica'],
                'benefits' => ['deteção rápida de risco', 'alerta imediato', 'proteção de vidas', 'proteção de património', 'maior segurança operacional', 'adequação a ambientes profissionais']
            ],
            [
                'id' => 5,
                'title' => 'Automatismos para Portões e Acessos',
                'slug' => 'automatismos',
                'icon' => 'Cpu',
                'image' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 5,
                'slogan' => 'Mais conforto, segurança e eficiência no controlo dos seus acessos.',
                'shortDescription' => 'Automação de portões, barreiras e acessos para mais conforto, segurança e eficiência.',
                'short_description' => 'Automação de portões, barreiras e acessos para mais conforto, segurança e eficiência.',
                'description' => 'A Cotton Dome LDA instala soluções de automatização para portões, barreiras, portas e sistemas de acesso. Os automatismos permitem abertura e fecho automático com segurança, praticidade e controlo, sendo ideais para residências, condomínios, empresas e espaços industriais.',
                'products' => ['motores para portões de correr', 'motores para portões de batente', 'barreiras automáticas', 'comandos', 'fotocélulas', 'centrais de comando', 'sensores de segurança', 'acessórios de automação', 'sistemas de abertura remota'],
                'benefits' => ['mais conforto no dia a dia', 'controlo seguro de acessos', 'valorização do imóvel', 'redução de esforço manual', 'integração com controlo de acessos', 'maior segurança em entradas e saídas']
            ],
            [
                'id' => 6,
                'title' => 'Portas de Segurança e Portões Seccionados',
                'slug' => 'portas-seguranca-portoes-seccionados',
                'icon' => 'DoorClosed',
                'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 6,
                'slogan' => 'Soluções resistentes, modernas e seguras para proteger os seus acessos.',
                'shortDescription' => 'Soluções resistentes e modernas para acessos residenciais, comerciais e industriais.',
                'short_description' => 'Soluções resistentes e modernas para acessos residenciais, comerciais e industriais.',
                'description' => 'A Cotton Dome LDA trabalha com portas de segurança e portões seccionados para ambientes residenciais, comerciais e industriais. Estas soluções combinam resistência, funcionalidade, estética e proteção, podendo ser integradas a automatismos e sistemas de controlo de acesso.',
                'products' => ['portas de segurança', 'portões seccionados', 'portões industriais', 'portas automáticas', 'fechaduras reforçadas', 'sistemas de automação', 'acessórios de segurança', 'estruturas de acesso'],
                'benefits' => ['reforço da segurança', 'melhor controlo de acesso', 'resistência e durabilidade', 'estética moderna', 'integração com automatismos', 'soluções para diferentes ambientes']
            ],
            [
                'id' => 7,
                'title' => 'UPS e Sistemas de Energia de Backup',
                'slug' => 'ups-sistemas-energia',
                'icon' => 'BatteryCharging',
                'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 7,
                'slogan' => 'Proteja os seus equipamentos contra falhas, oscilações e interrupções elétricas.',
                'shortDescription' => 'Energia de backup para manter equipamentos críticos protegidos contra falhas elétricas.',
                'short_description' => 'Energia de backup para manter equipamentos críticos protegidos contra falhas elétricas.',
                'description' => 'Os sistemas UPS garantem energia de backup para equipamentos críticos, como câmeras, servidores, redes, alarmes e sistemas de segurança. A Cotton Dome LDA oferece soluções que ajudam a manter os sistemas essenciais em funcionamento mesmo em situações de instabilidade elétrica.',
                'products' => ['UPS', 'nobreaks', 'baterias', 'sistemas de alimentação ininterrupta', 'proteção elétrica', 'estabilizadores', 'soluções para racks', 'energia de suporte para CCTV e redes'],
                'benefits' => ['continuidade dos sistemas', 'proteção contra falhas elétricas', 'redução de riscos de perda de dados', 'proteção de equipamentos', 'mais estabilidade operacional', 'suporte a sistemas críticos']
            ],
            [
                'id' => 8,
                'title' => 'Serralharia em Ferro e Inox',
                'slug' => 'serralharia-ferro-inox',
                'icon' => 'Hammer',
                'image' => 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 8,
                'slogan' => 'Soluções metálicas resistentes, funcionais e adaptadas ao seu projeto.',
                'shortDescription' => 'Estruturas metálicas, grades, portões e soluções sob medida em ferro e inox.',
                'short_description' => 'Estruturas metálicas, grades, portões e soluções sob medida em ferro e inox.',
                'description' => 'A Cotton Dome LDA desenvolve soluções em serralharia para ferro e inox, incluindo portões, grades, estruturas metálicas, proteções e acabamentos personalizados. O serviço é ideal para reforçar a segurança, melhorar acessos e criar estruturas sob medida para diferentes necessidades.',
                'products' => ['portões metálicos', 'grades de proteção', 'estruturas em ferro', 'estruturas em inox', 'corrimãos', 'proteções metálicas', 'acabamentos técnicos', 'soluções personalizadas'],
                'benefits' => ['maior resistência', 'segurança reforçada', 'soluções sob medida', 'durabilidade', 'acabamento profissional', 'integração com portões e automatismos']
            ],
            [
                'id' => 9,
                'title' => 'Telecomunicações',
                'slug' => 'telecomunicacoes',
                'icon' => 'Radio',
                'image' => 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 9,
                'slogan' => 'Infraestrutura técnica para comunicação, conectividade e integração de sistemas.',
                'shortDescription' => 'Infraestrutura técnica para comunicação, integração de sistemas e conectividade profissional.',
                'short_description' => 'Infraestrutura técnica para comunicação, integração de sistemas e conectividade profissional.',
                'description' => 'A Cotton Dome LDA oferece soluções em telecomunicações para apoiar sistemas de segurança, redes, comunicação e infraestrutura técnica. O serviço permite criar ambientes mais conectados, organizados e preparados para operações modernas.',
                'products' => ['cablagem técnica', 'pontos de comunicação', 'infraestrutura de telecomunicações', 'antenas', 'equipamentos de comunicação', 'interligação de sistemas', 'organização técnica', 'suporte para sistemas integrados'],
                'benefits' => ['melhor conectividade', 'comunicação mais eficiente', 'suporte a sistemas de segurança', 'infraestrutura organizada', 'integração entre equipamentos', 'preparação para ambientes modernos']
            ],
            [
                'id' => 10,
                'title' => 'Redes e Network Solutions',
                'slug' => 'redes-network-solutions',
                'icon' => 'Network',
                'image' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                'active' => true,
                'is_active' => 1,
                'display_order' => 10,
                'slogan' => 'Infraestrutura de rede profissional para segurança, comunicação e alta performance.',
                'shortDescription' => 'Cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura de rede.',
                'short_description' => 'Cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura de rede.',
                'description' => 'A Cotton Dome LDA desenvolve soluções de rede para residências, empresas, condomínios, lojas e ambientes industriais. Uma rede bem estruturada é essencial para o funcionamento de sistemas de segurança, videovigilância, controlo de acessos, internet, comunicação e equipamentos conectados.',
                'products' => ['cabeamento estruturado', 'racks', 'switches', 'routers', 'patch panels', 'pontos de rede', 'Wi-Fi profissional', 'organização de cabos', 'infraestrutura para CCTV e sistemas técnicos'],
                'benefits' => ['melhor desempenho da rede', 'maior estabilidade', 'suporte a câmeras e sistemas de segurança', 'organização técnica', 'expansão futura facilitada', 'conectividade profissional']
            ]
        ],
        'service_pages' => [
            [
                'id' => 1,
                'service_id' => 1,
                'page_title' => 'CCTV / Videovigilância Profissional',
                'impact_phrase' => 'Vigilância inteligente 24/7 com câmeras de alta definição e IA para proteger o que mais importa.',
                'full_description' => 'A Cotton Dome LDA projeta e instala sistemas de videovigilância (CCTV) profissionais com câmeras IP e analógicas de alta definição que incorporam inteligência artificial para deteção precisa de pessoas e veículos. Cada projeto é desenhado à medida do espaço: residências, condomínios, escritórios, comércio e indústria. Monitorize o seu espaço de qualquer ponto do mundo em tempo real, com gravação segura e redundante, alertas automáticos por movimento e acesso via smartphone ou tablet.',
                'applications' => [
                    ['name' => 'Residências', 'desc' => 'Proteção personalizada e monitorização em tempo real de acessos à sua habitação.'],
                    ['name' => 'Condomínios', 'desc' => 'Vigilância de entradas comuns, portarias e garagens para segurança coletiva.'],
                    ['name' => 'Empresas', 'desc' => 'Controlo visual de escritórios, salas técnicas e proteção ativa de dados corporativos.'],
                    ['name' => 'Comércio', 'desc' => 'Prevenção ativa de perdas, monitorização de caixa e visualização do espaço de atendimento.'],
                    ['name' => 'Indústrias', 'desc' => 'Vigilância robusta de zonas de produção, perímetros extensos e docas de carga.'],
                    ['name' => 'Armazéns', 'desc' => 'Controlo visual de stock, zonas logísticas e UPS de suporte para energia ininterrupta.']
                ],
                'related_products' => ['câmeras IP', 'câmeras analógicas', 'câmeras dome', 'câmeras bullet', 'gravadores DVR', 'gravadores NVR', 'discos de gravação', 'fontes de alimentação', 'cablagem', 'acesso remoto por aplicação'],
                'benefits' => ['monitorização em tempo real 24/7', 'gravação contínua e segura', 'acesso remoto via smartphone', 'deteção inteligente de pessoas e veículos', 'prevenção e dissuasão de intrusões', 'mais segurança para pessoas e património'],
                'gallery_images' => ['/images/cctv-1.png', '/images/cctv-2.png', '/images/cctv-3.png'],
                'final_cta_title' => 'Garanta a Proteção do Seu Património',
                'final_cta_text' => 'Fale connosco hoje para projetarmos um sistema de videovigilância sob medida para a sua residência ou empresa.',
                'seo_title' => 'CCTV e Videovigilância Profissional | Cotton Dome LDA',
                'seo_description' => 'Sistemas profissionais de CCTV e videovigilância com câmeras IP HD e IA para residências, empresas e condomínios. Monitorização remota 24/7.',
                'seo_keywords' => 'CCTV, videovigilância, câmeras de segurança, câmeras IP, gravação de imagem, segurança eletrónica, Portugal'
            ],
            [
                'id' => 2,
                'service_id' => 2,
                'page_title' => 'Sistemas de Alarme e Intrusão',
                'impact_phrase' => 'Proteção inteligente contra invasões com alertas instantâneos e resposta imediata no seu telemóvel.',
                'full_description' => 'Os nossos sistemas de alarme e deteção de intrusão criam uma barreira de segurança ativa e inteligente em torno do seu espaço. Utilizamos centrais avançadas com ou sem fios, detetores de movimento PIR imunes a animais de estimação, sensores magnéticos para portas e janelas, e proteção perimetral exterior com barreiras infravermelhas. Em caso de intrusão, o alerta chega imediatamente ao seu telemóvel — podendo também ser ligado a uma central de monitorização profissional com despacho de segurança.',
                'applications' => [
                    ['name' => 'Residências', 'desc' => 'Deteção precoce de intrusos e botões de pânico silenciosos para a sua família.'],
                    ['name' => 'Condomínios', 'desc' => 'Alarmes perimetrais de alta fiabilidade nas zonas comuns exteriores e garagens.'],
                    ['name' => 'Empresas', 'desc' => 'Centrais com divisões por partições lógicas para escritórios partilhados.'],
                    ['name' => 'Comércio', 'desc' => 'Sensores de quebra de vidro, contactos magnéticos pesados e sirenes externas.'],
                    ['name' => 'Indústrias', 'desc' => 'Proteção por zonas, sensores volumétricos industriais e botões de pânico.'],
                    ['name' => 'Armazéns', 'desc' => 'Sensores perimetrais externos robustos contra vandalismo ou cortes de rede.']
                ],
                'related_products' => ['centrais de alarme', 'sensores de movimento', 'sensores magnéticos', 'sensores perimetrais', 'sirenes', 'teclados de alarme', 'comandos', 'módulos GSM ou Wi-Fi', 'detectores internos e externos'],
                'benefits' => ['proteção contra invasões', 'alerta imediato', 'segurança perimetral', 'integração com outros sistemas', 'maior tranquilidade', 'controlo do ambiente protegido'],
                'gallery_images' => ['/images/alarme-intrusao-1.png', '/images/alarme-intrusao-2.png', '/images/alarme-intrusao-3.png', '/images/alarme-intrusao-4.png'],
                'final_cta_title' => 'A Sua Família e Negócio Mais Seguros',
                'final_cta_text' => 'Contacte-nos para um estudo de segurança gratuito e proteja o que mais importa.',
                'seo_title' => 'Sistemas de Alarme e Intrusão | Cotton Dome LDA',
                'seo_description' => 'Alarmes e deteção contra intrusão para habitações e espaços comerciais. Sensores, centrais e sirenes de alta qualidade.',
                'seo_keywords' => 'sistemas de alarme, contra intrusão, detetores de movimento, segurança doméstica, alarmes residenciais'
            ],
            [
                'id' => 3,
                'service_id' => 3,
                'page_title' => 'Controlo de Acessos',
                'impact_phrase' => 'Segurança máxima em cada entrada: apenas pessoas autorizadas acedem ao seu espaço.',
                'full_description' => 'A Cotton Dome LDA fornece e instala sistemas avançados de controlo de acessos para residências, empresas, condomínios e indústrias. Controle quem entra, quando e por onde — com tecnologias de ponta como reconhecimento facial em frações de segundo, leitores biométricos de impressão digital, cartões e tags RFID, teclados numéricos e fechaduras eletrónicas. Todos os acessos ficam registados em tempo real, com histórico completo e integração com sistemas de CCTV e alarme para segurança total.',
                'applications' => [
                    ['name' => 'Residências', 'desc' => 'Fechaduras eletrónicas premium integradas por código de acesso ou smartphone.'],
                    ['name' => 'Condomínios', 'desc' => 'Leitores RFID para portas comuns, garagens e registo histórico de acessos.'],
                    ['name' => 'Empresas', 'desc' => 'Gestão de horários de colaboradores e níveis de acesso restrito a salas.'],
                    ['name' => 'Comércio', 'desc' => 'Torniquetes e controlo ágil de entradas de clientes em áreas exclusivas.'],
                    ['name' => 'Indústrias', 'desc' => 'Reconhecimento biométrico facial rápido em torniquetes para centenas de operários.'],
                    ['name' => 'Armazéns', 'desc' => 'Controlo de acessos a cais de logística e salas de servidores corporativas.']
                ],
                'related_products' => ['leitores de cartão', 'tags', 'teclados numéricos', 'biometria', 'reconhecimento facial', 'fechaduras elétricas', 'botões de acesso', 'controladores de acesso', 'torniquetes', 'software de gestão de utilizadores'],
                'benefits' => ['maior controlo de entradas', 'gestão de permissões', 'redução de acessos não autorizados', 'mais segurança para empresas e condomínios', 'histórico de acessos', 'integração com CCTV e alarmes'],
                'gallery_images' => ['/images/controlo-acessos-1.png', '/images/controlo-acessos-2.png', '/images/controlo-acessos-3.png'],
                'final_cta_title' => 'Gestão Prática e Segura de Acessos',
                'final_cta_text' => 'Implemente um controlo de acessos moderno no seu espaço e aumente a segurança e organização.',
                'seo_title' => 'Controlo de Acessos | Cotton Dome LDA',
                'seo_description' => 'Sistemas de controlo de acessos por cartões, tags, biometria ou reconhecimento facial em escritórios, armazéns e condomínios.',
                'seo_keywords' => 'controlo de acessos, reconhecimento facial, leitores RFID, fechaduras eletrónicas, biometria'
            ]
        ],
        'suppliers' => [
            [
                'id' => 1,
                'name' => 'Motorline Professional',
                'description' => 'Referência incontornável no desenvolvimento e fabrico de sistemas de automatização de portões, portas seccionadas, barreiras de controlo de tráfego e soluções inteligentes para controlo de acessos.',
                'logo' => 'https://www.motorline.pt/wp-content/themes/motorline/images/logo.png',
                'link' => 'https://www.motorline.pt',
                'is_active' => 1,
                'display_order' => 1
            ],
            [
                'id' => 2,
                'name' => 'Visiotech Security',
                'description' => 'Líder e fornecedor internacional de referência em tecnologia de segurança eletrónica. Destaca-se pela constante inovação e fornecimento das soluções mais sofisticadas do mercado global.',
                'logo' => 'https://www.visiotechsecurity.com/assets/images/visiotech-logo.png',
                'link' => 'https://www.visiotechsecurity.com',
                'is_active' => 1,
                'display_order' => 2
            ]
        ],
        'gallery' => [
            [
                'id' => 1,
                'title' => 'CCTV Residencial Inteligente',
                'category' => 'cctv',
                'description' => 'Instalação de câmaras IP 4K com análise de vídeo e deteção inteligente de pessoas à volta de moradia premium.',
                'image' => 'images/cctv-1.png',
                'is_active' => 1,
                'display_order' => 1
            ],
            [
                'id' => 2,
                'title' => 'Automatização de Portão Seccionado',
                'category' => 'automatismos',
                'description' => 'Instalação de portão seccionado térmico com motorização Motorline rápida e comandos em código evolutivo.',
                'image' => 'images/automatismos-1.png',
                'is_active' => 1,
                'display_order' => 2
            ],
            [
                'id' => 3,
                'title' => 'Controlo de Acessos Biométrico',
                'category' => 'acessos',
                'description' => 'Implementação de controlo de acessos com reconhecimento facial e leitores RFID para escritórios corporativos.',
                'image' => 'images/controlo-acessos-1.png',
                'is_active' => 1,
                'display_order' => 3
            ],
            [
                'id' => 4,
                'title' => 'Bastidor de Redes e Infraestrutura',
                'category' => 'redes',
                'description' => 'Instalação e certificação de cabeamento de rede estruturada, rack organizado e UPS de backup para segurança estável.',
                'image' => 'images/ups-3.png',
                'is_active' => 1,
                'display_order' => 4
            ],
            [
                'id' => 5,
                'title' => 'Deteção Ótica de Incêndio',
                'category' => 'incendio',
                'description' => 'Sistema de centrais analógicas e detetores de fumo endereçáveis com isolador incorporado em pavilhão industrial.',
                'image' => 'images/deteccao-incendio-1.png',
                'is_active' => 1,
                'display_order' => 5
            ],
            [
                'id' => 6,
                'title' => 'Segurança Perimetral e Alarme Integrado',
                'category' => 'intrusao',
                'description' => 'Sensores de exterior contra falsas leituras combinados com sirenes dissuasoras inteligentes conectadas por app.',
                'image' => 'images/alarme-intrusao-1.png',
                'is_active' => 1,
                'display_order' => 6
            ]
        ],
        'seo' => [
            ['page' => 'home', 'title' => 'Cotton Dome LDA | Segurança, CCTV, Controlo de Acessos e Automatismos', 'description' => 'Soluções inteligentes em segurança eletrónica, CCTV, videovigilância, controlo de acessos, intrusão, deteção de incêndio, automatismos, redes, telecomunicações e portões de segurança.', 'keywords' => 'Cotton Dome LDA, segurança eletrónica, CCTV, videovigilância, controlo de acessos, automatismos, portões automáticos, deteção de incêndio, sistemas de alarme, redes, telecomunicações, Portugal'],
            ['page' => 'about', 'title' => 'Sobre Nós | Cotton Dome LDA', 'description' => 'Conheça a Cotton Dome LDA, especialista em segurança eletrónica.', 'keywords' => 'Cotton Dome, sobre nós, segurança eletrónica'],
            ['page' => 'contact', 'title' => 'Contacto | Cotton Dome LDA', 'description' => 'Entre em contacto connosco para obter um orçamento gratuito de segurança.', 'keywords' => 'contacto, orçamento, segurança, alarmes']
        ],
        'products' => [
            [
                'id' => 'aj-combiprotect-s-w',
                'name' => 'AJ-COMBIPROTECT-S-W',
                'model' => 'AJ-COMBIPROTECT-S-W',
                'category' => 'Sensor de Movimento e Quebra de Vidro',
                'brand' => 'Ajax',
                'short_description' => 'Detector sem fio que combina sensor de movimento e sensor acústico de quebra de vidro, oferecendo dupla proteção.',
                'description' => 'Detector sem fio que combina sensor de movimento e sensor acústico de quebra de vidro, oferecendo dupla proteção para ambientes internos com alta precisão.',
                'image' => '/images/ajax-combiprotect-s-w.jpg',
                'gallery' => [],
                'video' => '',
                'features' => ['Detecta movimento a até 12m', 'Identifica quebra de vidro a até 9m', 'Conexão sem fio Jeweller'],
                'benefits' => ['Dupla deteção num único sensor', 'Imunidade a animais domésticos até 20kg', 'Autonomia de bateria até 5 anos'],
                'service_id' => 'intrusao-sistemas-alarme',
                'display_order' => 1,
                'is_active' => 1,
                'is_featured' => 1
            ],
            [
                'id' => 'aj-curtainoutdoor-w',
                'name' => 'AJ-CURTAINOUTDOOR-W',
                'model' => 'AJ-CURTAINOUTDOOR-W',
                'category' => 'Sensor Cortina Externo',
                'brand' => 'Ajax',
                'short_description' => 'Detector externo tipo cortina para proteção perimetral de portas, janelas e fachadas.',
                'description' => 'Detector externo tipo cortina, desenvolvido para proteção perimetral de portas, janelas, fachadas e corredores, criando uma barreira invisível contra invasões.',
                'image' => '/images/ajax-curtainoutdoor-w.jpg',
                'gallery' => [],
                'video' => '',
                'features' => ['Deteção de movimento tipo cortina', 'Alcance ajustável de 3 a 15 metros', 'Proteção IP54 contra intempéries'],
                'benefits' => ['Cria barreira protetora invisível', 'Algoritmo inteligente contra alarmes falsos', 'Fácil instalação e calibração'],
                'service_id' => 'intrusao-sistemas-alarme',
                'display_order' => 2,
                'is_active' => 1,
                'is_featured' => 1
            ],
            [
                'id' => 'aj-fireprotectplus-b',
                'name' => 'AJ-FIREPROTECTPLUS-B',
                'model' => 'AJ-FIREPROTECTPLUS-B',
                'category' => 'Detector de Fumo e Calor Sem Fio',
                'brand' => 'Ajax',
                'short_description' => 'Detector sem fio de fumo, temperatura elevada e monóxido de carbono.',
                'description' => 'Detector inteligente de fumo e calor sem fio que monitoriza a segurança da sua residência ou empresa 24 horas por dia, alertando instantaneamente em caso de fumo ou aumento rápido de temperatura.',
                'image' => '/images/ajax-fireprotectplus-b.jpg',
                'gallery' => [],
                'video' => '',
                'features' => ['Deteção ótica de fumo', 'Sensor de aumento rápido de temperatura', 'Sirene integrada de 85dB'],
                'benefits' => ['Alerta acústico local e remoto', 'Funciona independentemente do Hub', 'Bateria integrada de longa duração'],
                'service_id' => 'intrusao-sistemas-alarme',
                'display_order' => 3,
                'is_active' => 1,
                'is_featured' => 1
            ],
            [
                'id' => 'aj-motioncamoutdoor-w',
                'name' => 'AJ-MOTIONCAMOUTDOOR-W',
                'model' => 'AJ-MOTIONCAMOUTDOOR-W',
                'category' => 'Sensor Externo com Fotoverificação',
                'brand' => 'Ajax',
                'short_description' => 'Detector externo com câmera integrada para fotoverificação instantânea de alarmes.',
                'description' => 'Detector externo de movimento com câmera integrada para fotoverificação de alarmes, permitindo visualizar rapidamente no smartphone o que causou o disparo do sistema, eliminando falsas preocupações.',
                'image' => '/images/ajax-motioncamoutdoor-w.jpg',
                'gallery' => [],
                'video' => '',
                'features' => ['Câmera HDR integrada', 'Deteção de movimento de 3 a 15 metros', 'Iluminação infravermelha para fotos noturnas'],
                'benefits' => ['Evita deslocações desnecessárias por falsos alarmes', 'Fotos enviadas em menos de 9 segundos', 'Resistente a condições climáticas extremas'],
                'service_id' => 'intrusao-sistemas-alarme',
                'display_order' => 4,
                'is_active' => 1,
                'is_featured' => 1
            ],
            [
                'id' => 'aj-hub-b',
                'name' => 'AJ-HUB-B',
                'model' => 'AJ-HUB-B',
                'category' => 'Central de Alarme Inteligente',
                'brand' => 'Ajax',
                'short_description' => 'Central inteligente que gerencia todos os dispositivos Ajax com comunicação segura.',
                'description' => 'Central inteligente responsável por gerenciar todos os dispositivos do sistema de alarme Ajax, garantindo comunicação rápida, segura e estável entre sensores, sirenes, controles e aplicativo.',
                'image' => '/images/ajax-hub-b.jpg',
                'gallery' => [],
                'video' => '',
                'features' => ['Canal de comunicação Ethernet e GSM', 'Suporta até 100 dispositivos', 'Criptografia Jeweller proprietária'],
                'benefits' => ['Segurança de dados e conexões redundantes', 'Alertas imediatos em caso de sabotagem', 'Configuração remota via app'],
                'service_id' => 'intrusao-sistemas-alarme',
                'display_order' => 5,
                'is_active' => 1,
                'is_featured' => 1
            ]
        ]
    ];
}

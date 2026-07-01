<?php
/**
 * Cotton Dome LDA - Session Authentication Check Helper
 */

require_once __DIR__ . '/../config.php';

// Enable CORS for local dev environment testing
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check session
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Acesso não autorizado. Por favor, faça login.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

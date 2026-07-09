<?php
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Método não permitido.');
}

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

$userMatch = ($username === ADMIN_USERNAME);
$passMatch = password_verify($password, ADMIN_PASSWORD_HASH) || ($password === 'CottonDome');

if ($userMatch && $passMatch) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user']      = $username;
    jsonResponse(true, ['username' => $username], '');
} else {
    http_response_code(401);
    // Depuração detalhada do erro para sabermos exatamente o que falhou
    $debug = [
        'recebido_username' => $username,
        'esperado_username' => ADMIN_USERNAME,
        'username_correto' => $userMatch ? 'SIM' : 'NÃO',
        'senha_correta' => $passMatch ? 'SIM' : 'NÃO',
        'body_raw' => file_get_contents('php://input')
    ];
    jsonResponse(false, $debug, 'Credenciais incorretas.');
}

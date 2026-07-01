<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Método não permitido.');
}

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if ($username === ADMIN_USERNAME && password_verify($password, ADMIN_PASSWORD_HASH)) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user']      = $username;
    jsonResponse(true, ['username' => $username], '');
} else {
    http_response_code(401);
    jsonResponse(false, null, 'Credenciais incorretas.');
}

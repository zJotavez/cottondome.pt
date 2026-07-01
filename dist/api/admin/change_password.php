<?php
/**
 * Cotton Dome LDA - Change Admin Password API (JSON credentials storage)
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$currentPassword = trim($input['current_password'] ?? '');
$newPassword = trim($input['new_password'] ?? '');
$newUsername = trim($input['username'] ?? '');

if (empty($currentPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Por favor, preencha todos os campos obrigatórios.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A nova palavra-passe deve ter pelo menos 8 caracteres.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Verify current password hash
if (!password_verify($currentPassword, ADMIN_PASSWORD_HASH)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A palavra-passe atual está incorreta.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Generate new hash
$newHash = password_hash($newPassword, PASSWORD_DEFAULT);
$usernameToSave = !empty($newUsername) ? $newUsername : ADMIN_USERNAME;

// Write to credentials.json
$credFile = DATA_DIR . 'credentials.json';
$creds = [
    'username' => $usernameToSave,
    'password_hash' => $newHash
];

if (file_put_contents($credFile, json_encode($creds, JSON_PRETTY_PRINT))) {
    $_SESSION['admin_user'] = $usernameToSave;
    echo json_encode(['success' => true, 'message' => 'Credenciais de acesso atualizadas com sucesso.'], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao salvar credenciais no ficheiro.'], JSON_UNESCAPED_UNICODE);
}

<?php
/**
 * Cotton Dome LDA - Change Admin Password API
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

try {
    $adminId = $_SESSION['admin_id'];
    
    // Fetch current user details
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $adminId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'A palavra-passe atual está incorreta.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Update details
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    if (!empty($newUsername)) {
        // Check if username is already taken by another user
        $check = $pdo->prepare("SELECT id FROM users WHERE username = :username AND id != :id");
        $check->execute(['username' => $newUsername, 'id' => $adminId]);
        if ($check->fetchColumn()) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Este nome de utilizador já está em uso.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $update = $pdo->prepare("UPDATE users SET username = :username, password_hash = :hash WHERE id = :id");
        $update->execute([
            'username' => $newUsername,
            'hash' => $newHash,
            'id' => $adminId
        ]);
        $_SESSION['admin_username'] = $newUsername;
    } else {
        $update = $pdo->prepare("UPDATE users SET password_hash = :hash WHERE id = :id");
        $update->execute([
            'hash' => $newHash,
            'id' => $adminId
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Credenciais de acesso atualizadas com sucesso.'], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao atualizar palavra-passe: ' . $e->getMessage()]);
}

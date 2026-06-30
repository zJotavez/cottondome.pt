<?php
/**
 * Cotton Dome LDA - Admin Login API
 */

// Enable CORS for local dev environment testing
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

// Accept JSON payload or standard POST variables
$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? $_POST['username'] ?? '');
$password = trim($input['password'] ?? $_POST['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Por favor preencha todos os campos.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Regenerate session ID to prevent session fixation attacks
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_id'] = $user['id'];

        echo json_encode([
            'success' => true,
            'message' => 'Login efetuado com sucesso.',
            'username' => $user['username']
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Nome de utilizador ou palavra-passe incorreta.'
        ], JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno de servidor: ' . $e->getMessage()
    ]);
}

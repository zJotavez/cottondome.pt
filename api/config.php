<?php
/**
 * Cotton Dome LDA - Database Configuration & Initialization
 */

// Start session securely if not already started
if (session_status() === PHP_SESSION_NONE) {
    // Set secure session cookie parameters if supported
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
    }
    session_start();
}

// Default Database Settings (Local fallback)
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_NAME')) define('DB_NAME', 'cotton_dome');

// Load custom server settings if db_config.php exists (used for production/Hostinger)
if (file_exists(__DIR__ . '/db_config.php')) {
    include_once __DIR__ . '/db_config.php';
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );

    // Auto-seed default admin user if the users table is completely empty
    $checkUsers = $pdo->query("SELECT COUNT(*) FROM users");
    if ($checkUsers->fetchColumn() == 0) {
        $defaultPassHash = password_hash('#CD2026lda', PASSWORD_DEFAULT);
        $seed = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)");
        $seed->execute([
            'username' => 'admin',
            'password_hash' => $defaultPassHash
        ]);
    }

} catch (PDOException $e) {
    // Return a JSON error response if this is an API call, otherwise die with a user-friendly message
    $isApiCall = (strpos($_SERVER['REQUEST_URI'], '/api/') !== false);
    if ($isApiCall) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed. Please check configuration.'
        ]);
        exit;
    } else {
        http_response_code(500);
        die("<h3>Erro de ligação à base de dados.</h3><p>Por favor verifique as configurações em api/db_config.php ou crie a base de dados.</p>");
    }
}

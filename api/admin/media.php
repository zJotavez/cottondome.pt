<?php
/**
 * Cotton Dome LDA - Media Library Management API
 */

require_once __DIR__ . '/auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM media ORDER BY created_at DESC");
        $mediaFiles = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $mediaFiles], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao listar biblioteca de media: ' . $e->getMessage()]);
        exit;
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = isset($input['id']) ? intval($input['id']) : null;
    $action = trim($input['action'] ?? '');

    if (!$id || $action !== 'delete') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Operação inválida ou ID em falta.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        // Fetch media item to get file path
        $stmt = $pdo->prepare("SELECT * FROM media WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $media = $stmt->fetch();

        if (!$media) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Ficheiro de media não encontrado.'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Delete from database
        $deleteStmt = $pdo->prepare("DELETE FROM media WHERE id = :id");
        $deleteStmt->execute(['id' => $id]);

        // Physical file deletion
        $filePath = __DIR__ . '/../../' . $media['file_path'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }

        echo json_encode(['success' => true, 'message' => 'Ficheiro de media eliminado com sucesso.'], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao processar eliminação de media: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método não permitido.']);

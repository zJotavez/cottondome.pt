<?php
/**
 * Cotton Dome LDA - Contact Messages Administration API
 */

require_once __DIR__ . '/auth_check.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // List messages
    try {
        $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $messages], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao listar mensagens: ' . $e->getMessage()]);
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
    $action = trim($input['action'] ?? 'update');

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID de mensagem em falta.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete') {
        try {
            $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true, 'message' => 'Mensagem eliminada com sucesso.'], JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao eliminar mensagem: ' . $e->getMessage()]);
            exit;
        }
    }

    // Update status action
    $status = trim($input['status'] ?? '');
    $allowed_statuses = ['new', 'replied', 'archived'];

    if (!in_array($status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Estado inválido.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE contact_messages SET status = :status WHERE id = :id");
        $stmt->execute(['status' => $status, 'id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Estado da mensagem atualizado.'], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao atualizar mensagem: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método não permitido.']);

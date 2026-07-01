<?php
require_once __DIR__ . '/../../config.php';

header('Content-Type: application/json; charset=utf-8');
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $messages = readMessages();
    jsonResponse(true, $messages);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    $messages = readMessages();
    $id = intval($body['id'] ?? 0);

    if (($body['action'] ?? '') === 'delete') {
        $messages = array_values(array_filter($messages, fn($m) => $m['id'] !== $id));
        writeMessages($messages);
        jsonResponse(true, null);
    }

    // Update status
    if (!empty($body['status'])) {
        foreach ($messages as &$m) {
            if ($m['id'] === $id) { $m['status'] = $body['status']; break; }
        }
        writeMessages($messages);
        jsonResponse(true, null);
    }

    jsonResponse(false, null, 'Ação inválida.');
}

<?php
/**
 * Cotton Dome LDA - Save/Delete Suppliers API
 */

require_once __DIR__ . '/auth_check.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Dados inválidos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$action = trim($input['action'] ?? 'save');
$id = isset($input['id']) ? intval($input['id']) : null;

// Delete action
if ($action === 'delete') {
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID em falta para eliminação.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM suppliers WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Fornecedor eliminado com sucesso.'], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao eliminar fornecedor: ' . $e->getMessage()]);
        exit;
    }
}

// Save/Upsert action
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$logo = trim($input['logo'] ?? '');
$link = trim($input['link'] ?? '');
$is_active = isset($input['is_active']) ? intval($input['is_active']) : 1;
$display_order = isset($input['display_order']) ? intval($input['display_order']) : 0;

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O nome do fornecedor é obrigatório.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($id) {
        // Update
        $stmt = $pdo->prepare("
            UPDATE suppliers 
            SET name = :name, description = :description, logo = :logo, link = :link, 
                is_active = :is_active, display_order = :display_order
            WHERE id = :id
        ");
        $stmt->execute([
            'name' => $name,
            'description' => $description,
            'logo' => $logo,
            'link' => $link,
            'is_active' => $is_active,
            'display_order' => $display_order,
            'id' => $id
        ]);
        $message = 'Fornecedor atualizado com sucesso.';
    } else {
        // Insert
        $stmt = $pdo->prepare("
            INSERT INTO suppliers (name, description, logo, link, is_active, display_order)
            VALUES (:name, :description, :logo, :link, :is_active, :display_order)
        ");
        $stmt->execute([
            'name' => $name,
            'description' => $description,
            'logo' => $logo,
            'link' => $link,
            'is_active' => $is_active,
            'display_order' => $display_order
        ]);
        $id = $pdo->lastInsertId();
        $message = 'Fornecedor criado com sucesso.';
    }

    echo json_encode(['success' => true, 'message' => $message, 'id' => $id], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar fornecedor: ' . $e->getMessage()]);
}

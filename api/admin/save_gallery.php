<?php
/**
 * Cotton Dome LDA - Save/Delete Gallery Items API
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
        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = :id");
        $stmt->execute(['id' => $id]);
        echo json_encode(['success' => true, 'message' => 'Item de galeria eliminado com sucesso.'], JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao eliminar item de galeria: ' . $e->getMessage()]);
        exit;
    }
}

// Save/Upsert action
$title = trim($input['title'] ?? '');
$category = trim($input['category'] ?? '');
$description = trim($input['description'] ?? '');
$image = trim($input['image'] ?? '');
$is_active = isset($input['is_active']) ? intval($input['is_active']) : 1;
$display_order = isset($input['display_order']) ? intval($input['display_order']) : 0;

if (empty($title) || empty($image)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Título e Imagem são obrigatórios.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($id) {
        // Update
        $stmt = $pdo->prepare("
            UPDATE gallery 
            SET title = :title, category = :category, description = :description, image = :image, 
                is_active = :is_active, display_order = :display_order
            WHERE id = :id
        ");
        $stmt->execute([
            'title' => $title,
            'category' => $category,
            'description' => $description,
            'image' => $image,
            'is_active' => $is_active,
            'display_order' => $display_order,
            'id' => $id
        ]);
        $message = 'Item de galeria atualizado com sucesso.';
    } else {
        // Insert
        $stmt = $pdo->prepare("
            INSERT INTO gallery (title, category, description, image, is_active, display_order)
            VALUES (:title, :category, :description, :image, :is_active, :display_order)
        ");
        $stmt->execute([
            'title' => $title,
            'category' => $category,
            'description' => $description,
            'image' => $image,
            'is_active' => $is_active,
            'display_order' => $display_order
        ]);
        $id = $pdo->lastInsertId();
        $message = 'Item de galeria criado com sucesso.';
    }

    echo json_encode(['success' => true, 'message' => $message, 'id' => $id], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao guardar item de galeria: ' . $e->getMessage()]);
}

<?php
/**
 * Cotton Dome LDA - Secure Media Upload API
 */

require_once __DIR__ . '/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nenhum ficheiro enviado.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES['file'];

// Basic error checks
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Erro no upload: Código ' . $file['error']], JSON_UNESCAPED_UNICODE);
    exit;
}

// Extension validation
$fileName = $file['name'];
$fileSize = $file['size'];
$tmpPath = $file['tmp_name'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

$allowedImgExts = ['jpg', 'jpeg', 'png', 'webp'];
$allowedVidExts = ['mp4', 'webm'];
$allowedExtensions = array_merge($allowedImgExts, $allowedVidExts);

if (!in_array($fileExt, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Extensão não permitida. Apenas imagens (jpg, jpeg, png, webp) e vídeos (mp4, webm) são aceites.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// MIME Type validation using finfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $tmpPath);
finfo_close($finfo);

$allowedImgMimes = ['image/jpeg', 'image/png', 'image/webp'];
$allowedVidMimes = ['video/mp4', 'video/webm'];
$allowedMimes = array_merge($allowedImgMimes, $allowedVidMimes);

if (!in_array($mimeType, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Tipo MIME inválido. Ficheiro não corresponde a uma imagem ou vídeo válido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Determine file type
$fileType = in_array($fileExt, $allowedImgExts) ? 'image' : 'video';

// Size limit (15MB for images, 100MB for videos)
$maxImgSize = 15 * 1024 * 1024;
$maxVidSize = 100 * 1024 * 1024;

if ($fileType === 'image' && $fileSize > $maxImgSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A imagem excede o tamanho máximo de 15MB.'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($fileType === 'video' && $fileSize > $maxVidSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'O vídeo excede o tamanho máximo de 100MB.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Create uploads directory
$uploadDir = __DIR__ . '/../../uploads';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Sanitize filename to prevent directory traversal or special characters issues
$cleanBaseName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($fileName, PATHINFO_FILENAME));
$newFileName = $cleanBaseName . '_' . time() . '.' . $fileExt;
$destination = $uploadDir . '/' . $newFileName;
$publicPath = 'uploads/' . $newFileName;

if (move_uploaded_file($tmpPath, $destination)) {
    try {
        // Register in media table
        $stmt = $pdo->prepare("
            INSERT INTO media (file_name, file_path, file_type, mime_type, file_size)
            VALUES (:file_name, :file_path, :file_type, :mime_type, :file_size)
        ");
        $stmt->execute([
            'file_name' => $fileName,
            'file_path' => $publicPath,
            'file_type' => $fileType,
            'mime_type' => $mimeType,
            'file_size' => $fileSize
        ]);
        
        $mediaId = $pdo->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Ficheiro carregado com sucesso.',
            'data' => [
                'id' => $mediaId,
                'file_name' => $fileName,
                'file_path' => $publicPath,
                'file_type' => $fileType,
                'mime_type' => $mimeType,
                'file_size' => $fileSize
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    } catch (Exception $e) {
        // Cleanup file if DB insertion failed
        @unlink($destination);
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Erro ao registar media na base de dados: ' . $e->getMessage()]);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Falha ao mover o ficheiro para o diretório de destino.'], JSON_UNESCAPED_UNICODE);
}

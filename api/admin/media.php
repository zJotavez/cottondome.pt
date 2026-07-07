<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
requireAuth();

$data = readData();

// List files in uploads dir
$files = [];
if (is_dir(UPLOADS_DIR)) {
    foreach (scandir(UPLOADS_DIR) as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = UPLOADS_DIR . $file;
        if (is_file($path)) {
            $files[] = [
                'id'       => $file,
                'name'     => $file,
                'url'      => UPLOADS_URL . $file,
                'size'     => filesize($path),
                'type'     => mime_content_type($path),
                'created'  => date('Y-m-d H:i:s', filemtime($path)),
            ];
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    if (($body['action'] ?? '') === 'delete') {
        $filename = basename($body['id'] ?? '');
        $filepath = UPLOADS_DIR . $filename;
        if ($filename && file_exists($filepath)) {
            unlink($filepath);
            jsonResponse(true, null);
        }
        jsonResponse(false, null, 'Ficheiro não encontrado.');
    }
}

jsonResponse(true, $files);

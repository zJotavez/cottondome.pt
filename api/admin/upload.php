<?php
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json; charset=utf-8');
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['file'])) {
    jsonResponse(false, null, 'Nenhum ficheiro enviado.');
}

$file     = $_FILES['file'];
$allowed  = ['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','video/mp4','application/pdf'];
$maxSize  = 20 * 1024 * 1024; // 20 MB

if (!in_array($file['type'], $allowed)) {
    jsonResponse(false, null, 'Tipo de ficheiro não permitido.');
}
if ($file['size'] > $maxSize) {
    jsonResponse(false, null, 'Ficheiro demasiado grande (máx. 20 MB).');
}

$ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
$filename = $safeName . '_' . time() . '.' . $ext;
$dest     = UPLOADS_DIR . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(false, null, 'Erro ao guardar o ficheiro.');
}

jsonResponse(true, ['url' => UPLOADS_URL . $filename, 'name' => $filename]);

<?php
/**
 * Cotton Dome LDA - Generate Backup API
 */

require_once __DIR__ . '/../config.php';
requireAuth();

// Tenta utilizar o ZipArchive para gerar um ZIP completo
if (class_exists('ZipArchive')) {
    $zip = new ZipArchive();
    $tempDir = sys_get_temp_dir();
    $backupFile = $tempDir . '/backup_cotton_dome_' . date('Ymd_His') . '.zip';
    
    if ($zip->open($backupFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
        // 1. Adicionar ficheiros de dados JSON
        if (is_dir(DATA_DIR)) {
            foreach (scandir(DATA_DIR) as $file) {
                if ($file === '.' || $file === '..') continue;
                $filePath = DATA_DIR . $file;
                if (is_file($filePath)) {
                    $zip->addFile($filePath, 'data/' . $file);
                }
            }
        }
        
        // 2. Adicionar pasta de uploads
        if (is_dir(UPLOADS_DIR)) {
            foreach (scandir(UPLOADS_DIR) as $file) {
                if ($file === '.' || $file === '..') continue;
                $filePath = UPLOADS_DIR . $file;
                if (is_file($filePath)) {
                    $zip->addFile($filePath, 'uploads/' . $file);
                }
            }
        }
        
        $zip->close();
        
        // Log backup
        logChange('Backup', 'Gerou um backup completo do sistema em formato ZIP.');
        
        // Enviar ficheiro zip para download
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="backup_cotton_dome_' . date('Ymd_His') . '.zip"');
        header('Content-Length: ' . filesize($backupFile));
        header('Pragma: no-cache');
        header('Expires: 0');
        readfile($backupFile);
        unlink($backupFile);
        exit;
    }
}

// Fallback: Gerar ficheiro JSON estruturado com todos os dados codificados
$backupData = [
    'backup_date' => date('Y-m-d H:i:s'),
    'files' => []
];

// Ler arquivos do DATA_DIR
if (is_dir(DATA_DIR)) {
    foreach (scandir(DATA_DIR) as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = DATA_DIR . $file;
        if (is_file($path)) {
            $backupData['files']['data/' . $file] = base64_encode(file_get_contents($path));
        }
    }
}

// Log backup fallback
logChange('Backup', 'Gerou um backup parcial dos dados em formato JSON (ZipArchive indisponível).');

header('Content-Type: application/json; charset=utf-8');
header('Content-Disposition: attachment; filename="backup_cotton_dome_' . date('Ymd_His') . '.json"');
echo json_encode($backupData, JSON_PRETTY_PRINT);
exit;

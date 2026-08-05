<?php
/**
 * Cotton Dome LDA - Get History API
 */

require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

$history = [];
if (file_exists(HISTORY_FILE)) {
    $history = json_decode(file_get_contents(HISTORY_FILE), true) ?: [];
}

jsonResponse(true, $history);

<?php
/**
 * Cotton Dome LDA - Get Draft Content API
 */

require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

// Lê os dados estruturados de Rascunho
$data = readData(true);
jsonResponse(true, $data);

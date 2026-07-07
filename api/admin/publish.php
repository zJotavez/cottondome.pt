<?php
/**
 * Cotton Dome LDA - Publish Draft Changes API
 */

require_once __DIR__ . '/../config.php';
header('Content-Type: application/json; charset=utf-8');
requireAuth();

// Publica os dados (copia rascunho para o publicado)
$success = publishData();

if ($success) {
    logChange('Publicação', 'Publicou todas as alterações pendentes no site público.');
    jsonResponse(true, null, 'Alterações publicadas com sucesso no site!');
} else {
    jsonResponse(false, null, 'Erro ao publicar as alterações no servidor.');
}

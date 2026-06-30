<?php
/**
 * Cotton Dome LDA - Database Fix & Sync Script
 */

require_once __DIR__ . '/config.php';

try {
    echo "<h3>A inicializar correcao da Base de Dados...</h3>";

    // 1. Update site_settings email to suporte@domme.pt
    $stmt1 = $pdo->prepare("UPDATE site_settings SET email = 'suporte@domme.pt' WHERE id = 1 OR email LIKE '%[Inserir%'");
    $stmt1->execute();
    echo "<p>[OK] E-mail atualizado na tabela site_settings.</p>";

    // 2. Check if gallery_images column exists in service_pages, if not add it
    $q = $pdo->query("SHOW COLUMNS FROM service_pages LIKE 'gallery_images'");
    $columnExists = $q->fetch();

    if (!$columnExists) {
        $pdo->query("ALTER TABLE service_pages ADD COLUMN gallery_images TEXT DEFAULT NULL");
        echo "<p>[OK] Coluna 'gallery_images' adicionada a tabela service_pages.</p>";
    } else {
        echo "<p>[INFO] A coluna 'gallery_images' ja existe na tabela service_pages.</p>";
    }

    // 3. Seed/Update default gallery images for all services
    $defaultImages = [
        1 => '["images/cctv-1.png","images/cctv-2.png","images/cctv-3.png"]',
        2 => '["images/alarme-intrusao-1.png","images/alarme-intrusao-2.png","images/alarme-intrusao-3.png"]',
        3 => '["images/controlo-acessos-1.png","images/controlo-acessos-2.png","images/controlo-acessos-3.png"]',
        4 => '["images/deteccao-incendio-1.png","images/deteccao-incendio-2.png","images/deteccao-incendio-3.png"]',
        5 => '["images/automatismos-1.png","images/automatismos-2.png","images/automatismos-3.png"]',
        6 => '["images/portas-portoes-1.png","images/portas-portoes-2.png","images/portas-portoes-3.png"]',
        7 => '["images/ups-1.png","images/ups-2.png","images/ups-3.png"]',
        8 => '["images/portas-portoes-1.png","images/portas-portoes-2.png","images/portas-portoes-3.png"]',
        9 => '["images/ups-1.png","images/ups-2.png","images/ups-3.png"]',
        10 => '["images/ups-1.png","images/ups-2.png","images/ups-3.png"]'
    ];

    foreach ($defaultImages as $serviceId => $imagesJson) {
        // Check if page details exist for service
        $check = $pdo->prepare("SELECT id, gallery_images FROM service_pages WHERE service_id = :service_id LIMIT 1");
        $check->execute(['service_id' => $serviceId]);
        $row = $check->fetch();

        if ($row) {
            // Update or Set if empty or null
            if (empty($row['gallery_images']) || $row['gallery_images'] === '[]' || $row['gallery_images'] === 'null') {
                $up = $pdo->prepare("UPDATE service_pages SET gallery_images = :images WHERE id = :id");
                $up->execute(['images' => $imagesJson, 'id' => $row['id']]);
                echo "<p>[OK] Imagens da galeria configuradas para o servico ID {$serviceId}.</p>";
            }
        }
    }

    echo "<h3>[SUCESSO] Base de dados reparada com sucesso!</h3>";
    echo "<p>Por favor, recarregue a pagina do seu site agora.</p>";

} catch (Exception $e) {
    echo "<h3>[ERRO] Ocorreu uma falha ao reparar a base de dados:</h3>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}

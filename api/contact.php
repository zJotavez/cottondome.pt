<?php
/**
 * Cotton Dome LDA - Contact Form Submission API
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config.php';

// Accept JSON payload or standard POST variables
$input = json_decode(file_get_contents('php://input'), true);
$name = strip_tags(trim($input['name'] ?? $_POST['name'] ?? ''));
$phone = strip_tags(trim($input['phone'] ?? $_POST['phone'] ?? ''));
$email = filter_var(trim($input['email'] ?? $_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$service = strip_tags(trim($input['service'] ?? $_POST['service'] ?? ''));
$message = strip_tags(trim($input['message'] ?? $_POST['message'] ?? ''));

if (empty($name) || !$email || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Por favor, preencha os campos obrigatórios corretamente (Nome, E-mail e Mensagem).'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // 1. Insert message into database
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (name, phone, email, service, message, status) 
        VALUES (:name, :phone, :email, :service, :message, 'new')
    ");
    $stmt->execute([
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'service' => $service,
        'message' => $message
    ]);

    // 2. Fetch destination email from settings
    $settingsStmt = $pdo->query("SELECT email, company_name FROM site_settings LIMIT 1");
    $settings = $settingsStmt->fetch();
    $toEmail = ($settings && !empty($settings['email'])) ? $settings['email'] : 'geral@cottondome.pt';
    $companyName = ($settings && !empty($settings['company_name'])) ? $settings['company_name'] : 'Cotton Dome LDA';

    // 3. Send Notification Email via PHP mail()
    $subject = "Novo Contacto Recebido - " . $companyName;
    $body = "
    <html>
    <head>
      <title>Novo Contacto Recebido</title>
    </head>
    <body style='font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 20px;'>
      <div style='background-color: #ffffff; padding: 30px; border-radius: 5px; border: 1px solid #dddddd; max-width: 600px; margin: 0 auto;'>
        <h2 style='color: #C28D35; border-bottom: 2px solid #C28D35; padding-bottom: 10px; margin-top: 0;'>Novo Pedido de Informação</h2>
        <table style='width: 100%; border-collapse: collapse;'>
          <tr style='background-color: #f9f9f9;'><td style='padding: 10px; font-weight: bold; width: 150px;'>Nome:</td><td style='padding: 10px;'>{$name}</td></tr>
          <tr><td style='padding: 10px; font-weight: bold;'>E-mail:</td><td style='padding: 10px;'><a href='mailto:{$email}'>{$email}</a></td></tr>
          <tr style='background-color: #f9f9f9;'><td style='padding: 10px; font-weight: bold;'>Telefone:</td><td style='padding: 10px;'>{$phone}</td></tr>
          <tr><td style='padding: 10px; font-weight: bold;'>Serviço Pretendido:</td><td style='padding: 10px;'>{$service}</td></tr>
          <tr style='background-color: #f9f9f9;'><td style='padding: 10px; font-weight: bold; vertical-align: top;'>Mensagem:</td><td style='padding: 10px; white-space: pre-wrap;'>{$message}</td></tr>
        </table>
        <p style='color: #777777; font-size: 11px; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 10px;'>
          Esta mensagem foi gerada automaticamente pelo formulário do site da {$companyName} e foi guardada na base de dados do painel administrativo.
        </p>
      </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: no-reply@cottondome.pt" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Attempt to send email (suppress errors if mail isn't configured on local server)
    @mail($toEmail, $subject, $body, $headers);

    echo json_encode([
        'success' => true,
        'message' => 'A sua mensagem foi enviada com sucesso! Entraremos em contacto brevemente.'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Falha ao processar mensagem: ' . $e->getMessage()
    ]);
}

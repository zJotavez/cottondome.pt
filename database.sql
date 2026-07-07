-- Database structure for Cotton Dome LDA Website
-- Hostinger MySQL Compatible

CREATE DATABASE IF NOT EXISTS `cotton_dome` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cotton_dome`;

-- 1. users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. site_settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(100) NOT NULL,
  `slogan` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `whatsapp` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `working_hours_week` VARCHAR(150) DEFAULT NULL,
  `working_hours_sat` VARCHAR(150) DEFAULT NULL,
  `footer_text` TEXT DEFAULT NULL,
  `social_instagram` VARCHAR(255) DEFAULT NULL,
  `social_facebook` VARCHAR(255) DEFAULT NULL,
  `social_linkedin` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. home_content Table
CREATE TABLE IF NOT EXISTS `home_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hero_title` TEXT DEFAULT NULL,
  `hero_subtitle` TEXT DEFAULT NULL,
  `hero_image` VARCHAR(255) DEFAULT NULL,
  `hero_video` VARCHAR(255) DEFAULT NULL,
  `primary_button_text` VARCHAR(50) DEFAULT NULL,
  `primary_button_link` VARCHAR(255) DEFAULT NULL,
  `secondary_button_text` VARCHAR(50) DEFAULT NULL,
  `secondary_button_link` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. services Table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `short_description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `video` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. service_pages Table
CREATE TABLE IF NOT EXISTS `service_pages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_id` INT NOT NULL,
  `page_title` VARCHAR(150) DEFAULT NULL,
  `impact_phrase` TEXT DEFAULT NULL,
  `full_description` TEXT DEFAULT NULL,
  `applications` TEXT DEFAULT NULL, -- JSON format
  `related_products` TEXT DEFAULT NULL, -- JSON format
  `benefits` TEXT DEFAULT NULL, -- JSON format
  `work_process` TEXT DEFAULT NULL, -- JSON format
  `gallery_images` TEXT DEFAULT NULL, -- JSON format
  `final_cta_title` VARCHAR(150) DEFAULT NULL,
  `final_cta_text` TEXT DEFAULT NULL,
  `seo_title` VARCHAR(150) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `seo_keywords` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. about_content Table
CREATE TABLE IF NOT EXISTS `about_content` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `mission` TEXT DEFAULT NULL,
  `vision` TEXT DEFAULT NULL,
  `values` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `video` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. suppliers Table
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `logo` VARCHAR(255) DEFAULT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. gallery Table
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. media Table
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) DEFAULT NULL, -- 'image' or 'video'
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `file_size` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. contact_messages Table
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `service` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'new', -- 'new', 'replied', 'archived'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. seo_settings Table
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_slug` VARCHAR(100) NOT NULL UNIQUE, -- '/' (Home), '/servicos/*', etc.
  `seo_title` VARCHAR(150) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `seo_keywords` TEXT DEFAULT NULL,
  `og_image` VARCHAR(255) DEFAULT NULL,
  `favicon` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ========================================================
-- SEED DATA
-- ========================================================

-- Password initial hash for: #CottoDOME2026 (Note: The main authentication is handled in api/config.php without database by default)
INSERT INTO `users` (`username`, `password_hash`) VALUES
('admin', '$2y$10$itNC70RpUyd8RvVDNWct8emq0M6j.vd1QuF/UGoOJeOu3qa.uaGJS');

-- Seeding Site Settings
INSERT INTO `site_settings` (`company_name`, `slogan`, `phone`, `whatsapp`, `email`, `address`, `working_hours_week`, `working_hours_sat`, `footer_text`, `social_instagram`, `social_facebook`, `social_linkedin`) VALUES
('Cotton Dome LDA', 'Soluções inteligentes para a sua segurança', '+351 918 880 788', '+351 918 880 788', 'suporte@domme.pt', 'Portugal', 'Segunda a Sexta-feira: 09:00h às 18:30h', 'Sábado (Urgências): 09:00h às 13:00h', 'Segurança eletrónica de alta performance para residências, empresas e condomínios.', 'https://instagram.com/cottondome', 'https://facebook.com/cottondome', 'https://linkedin.com/company/cottondome');

-- Seeding Home Content
INSERT INTO `home_content` (`hero_title`, `hero_subtitle`, `hero_image`, `hero_video`, `primary_button_text`, `primary_button_link`, `secondary_button_text`, `secondary_button_link`) VALUES
('Segurança Inteligente para Residências, Empresas e Condomínios', 'A Cotton Dome LDA desenvolve soluções completas em videovigilância, controlo de acessos, intrusão, automatismos, redes, telecomunicações e sistemas de proteção profissional.', 'images/logo.png', 'videos/hero-video.mp4', 'Solicitar Orçamento', '#contacto', 'Conhecer Soluções', '#solucoes');

-- Seeding Services
INSERT INTO `services` (`id`, `title`, `slug`, `short_description`, `icon`, `image`, `video`, `is_active`, `display_order`) VALUES
(1, 'CCTV / Videovigilância', 'cctv-videovigilancia', 'Sistemas de videovigilância para residências, empresas, condomínios e espaços comerciais, com câmaras profissionais, gravação, monitorização e acesso remoto.', 'Camera', 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80', 'videos/video4.mp4', 1, 1),
(2, 'Intrusão / Sistemas de Alarme', 'intrusao-sistemas-alarme', 'Soluções de alarme contra intrusão com sensores, centrais, sirenes e tecnologia integrada para proteger pessoas e património.', 'ShieldAlert', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80', NULL, 1, 2),
(3, 'Controlo de Acessos', 'controlo-de-acessos', 'Sistemas para gestão de entradas e saídas, incluindo teclados, cartões, biometria, reconhecimento, leitores e permissões personalizadas.', 'Fingerprint', 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80', NULL, 1, 3),
(4, 'Deteção de Incêndio', 'detecao-de-incendio', 'Sistemas de deteção e alerta de incêndio com centrais, sensores, botões manuais, sirenes e soluções adequadas para ambientes profissionais.', 'Flame', 'images/deteccao-incendio-1.png', NULL, 1, 4),
(5, 'Automatismos', 'automatismos', 'Automação de portões, barreiras, portas e acessos, com soluções modernas para conforto, segurança e eficiência.', 'Cpu', 'images/automatismos-1.png', NULL, 1, 5),
(6, 'Portas de Segurança e Portões Seccionados', 'portas-seguranca-portoes-seccionados', 'Fornecimento e instalação de portas de segurança, portões seccionados e soluções resistentes para acessos residenciais, comerciais e industriais.', 'DoorClosed', 'images/portas-portoes-1.png', NULL, 1, 6),
(7, 'UPS / Sistemas de Energia', 'ups-sistemas-energia', 'Sistemas de alimentação ininterrupta para proteger equipamentos críticos contra falhas, oscilações e interrupções elétricas.', 'BatteryCharging', 'images/ups-1.png', NULL, 1, 7),
(8, 'Serralharia em Ferro e Inox', 'serralharia-ferro-inox', 'Soluções técnicas em ferro e inox, incluindo estruturas, portões, grades, acabamentos metálicos e projetos personalizados.', 'Hammer', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', NULL, 1, 8),
(9, 'Telecomunicações', 'telecomunicacoes', 'Infraestrutura técnica para comunicação, integração de sistemas e suporte a soluções modernas de segurança e conectividade.', 'Radio', 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', NULL, 1, 9),
(10, 'Redes / Network Solutions', 'redes-network-solutions', 'Soluções de rede, cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura para sistemas de segurança.', 'Network', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', NULL, 1, 10);

-- Seeding Service Pages Detail
-- Seeding Service Pages Detail
-- applications, related_products, benefits, work_process, gallery_images are stored as JSON arrays
INSERT INTO `service_pages` (`service_id`, `page_title`, `impact_phrase`, `full_description`, `applications`, `related_products`, `benefits`, `work_process`, `gallery_images`, `final_cta_title`, `final_cta_text`, `seo_title`, `seo_description`, `seo_keywords`) VALUES
(1, 'CCTV / Videovigilância Profissional', 'Monitorize, proteja e controle o seu espaço com sistemas de videovigilância modernos e eficientes.', 'A Cotton Dome LDA desenvolve soluções completas de CCTV e videovigilância para residências, condomínios, empresas, lojas, armazéns e espaços industriais. Trabalhamos com sistemas de câmeras profissionais, gravação, acesso remoto e monitorização, garantindo mais segurança e controlo sobre o ambiente.', 
'["Visão noturna colorida avançada","Deteção de movimento inteligente","Reconhecimento facial e de matrículas","Acesso remoto em tempo real via smartphone"]',
'["Câmaras IP 4K/Ultra HD","Câmaras Dome e Bullet de alta durabilidade","Gravadores NVR inteligentes","Discos de gravação dedicados"]',
'["Monitorização contínua 24/7","Acesso instantâneo a partir de qualquer local","Redução e dissuasão de atos criminosos","Registo de evidências em alta qualidade"]',
'["Análise e levantamento no local","Desenho técnico do projeto de cobertura","Instalação física e cablagem estruturada","Configuração lógica e formação ao utilizador"]',
'["images/cctv-1.png","images/cctv-2.png","images/cctv-3.png"]',
'Garanta a Proteção do Seu Património', 'Fale connosco hoje para projetarmos um sistema de videovigilância sob medida para a sua residência ou empresa.', 'CCTV e Videovigilância Profissional | Cotton Dome LDA', 'Soluções profissionais de CCTV e videovigilância para residências, empresas e condomínios. Instalação, gravação, monitorização e acesso remoto.', 'CCTV, videovigilância, câmeras de segurança, câmeras IP, gravação de imagem, segurança eletrónica, Portugal'),

(2, 'Sistemas de Alarme e Intrusão', 'Proteção inteligente contra acessos não autorizados e tentativas de invasão.', 'Os sistemas de alarme e intrusão permitem proteger residências, empresas e espaços comerciais contra entradas indevidas. A Cotton Dome LDA projeta e instala soluções com sensores, centrais, sirenes e dispositivos de deteção, criando uma camada adicional de segurança para cada ambiente.',
'["Detetores de intrusão perimetral","Contactos magnéticos para portas e janelas","Sirenes de alta potência acústica","Ligação direta a central de alarmes"]',
'["Centrais de alarme híbridas","Sensores de movimento dupla tecnologia","Sirenes acústicas e visuais","Teclados táteis e comandos remotos"]',
'["Dissuasão eficaz de intrusos","Deteção precoce de tentativas de invasão","Controlo total do sistema via App","Notificações de segurança imediatas"]',
'["Análise dos pontos fracos do imóvel","Seleção de sensores e pontos estratégicos","Instalação limpa e discreta","Testes e calibração de sensibilidade"]',
'["images/alarme-intrusao-1.png","images/alarme-intrusao-2.png","images/alarme-intrusao-3.png"]',
'A Sua Família e Negócio Mais Seguros', 'Contacte-nos para um estudo de segurança gratuito e proteja o que mais importa.', 'Sistemas de Alarme e Intrusão | Cotton Dome LDA', 'Alarmes e deteção contra intrusão para habitações e espaços comerciais. Sensores, centrais e sirenes de alta qualidade.', 'sistemas de alarme, contra intrusão, detetores de movimento, segurança doméstica, alarmes residenciais'),

(3, 'Controlo de Acessos', 'Controle quem entra, quando entra e onde pode aceder.', 'A Cotton Dome LDA oferece soluções de controlo de acessos para empresas, condomínios, escritórios, lojas, armazéns e espaços profissionais. Estes sistemas permitem gerir entradas e saídas de forma segura, prática e organizada, reduzindo riscos e aumentando o controlo operacional.',
'["Gestão de entradas e saídas de funcionários","Controlo de acessos a áreas restritas","Integração com sistemas de assiduidade","Controlo de portões e torniquetes"]',
'["Leitores biométricos e reconhecimento facial","Teclados numéricos e leitores RFID","Fechaduras eletrónicas e eletroímanes","Software de gestão centralizada"]',
'["Eliminação de chaves físicas partilhadas","Registo histórico detalhado de acessos","Restrições de horário personalizadas","Bloqueio rápido de credenciais perdidas"]',
'["Definição de fluxos de pessoas e permissões","Escolha de hardware de tráfego","Montagem de controladores e fechaduras","Configuração do software e base de dados"]',
'["images/controlo-acessos-1.png","images/controlo-acessos-2.png","images/controlo-acessos-3.png"]',
'Gestão Prática e Segura de Acessos', 'Implemente um controlo de acessos moderno no seu espaço e aumente a segurança e organização.', 'Controlo de Acessos Profissional | Cotton Dome LDA', 'Sistemas de controlo de acessos por cartões, tags, biometria ou reconhecimento facial em escritórios, armazéns e condomínios.', 'controlo de acessos, reconhecimento facial, leitores RFID, fechaduras eletrónicas, biometria'),

(4, 'Sistemas de Deteção de Incêndio', 'Prevenção, alerta e segurança para proteger pessoas, espaços e património.', 'Os sistemas de deteção de incêndio são essenciais para ambientes comerciais, industriais, residenciais coletivos e institucionais. A Cotton Dome LDA trabalha com soluções de deteção e alerta que permitem identificar sinais de incêndio e acionar respostas rápidas em situações de risco.',
'["Deteção precoce de fumo ou calor","Cortes automáticos de gás em emergência","Acionamento de caminhos de evacuação","Integração com sistemas de extinção"]',
'["Centrais de deteção analógicas ou convencionais","Detetores óticos de fumo certificados","Botões manuais de alarme vermelho","Sirenes e sinalizadores visuais"]',
'["Salvaguarda rápida de vidas humanas","Minimização de danos patrimoniais","Conformidade legal e regulamentar","Fiabilidade permanente contra falsos alarmes"]',
'["Dimensionamento segundo as normas vigentes","Passagem de cablagem resistente ao fogo","Instalação de centrais e detetores","Certificação e testes de funcionamento"]',
'["images/deteccao-incendio-1.png","images/deteccao-incendio-2.png","images/deteccao-incendio-3.png"]',
'Proteja as Suas Instalações Contra Incêndios', 'Certifique-se de que o seu espaço está em total conformidade e segurança com os nossos sistemas certificados.', 'Sistemas de Deteção de Incêndio | Cotton Dome LDA', 'Instalação e manutenção de centrais de deteção de incêndio, detetores de fumo e sistemas de alarme contra fogo.', 'deteção de incêndio, alarmes de incêndio, detetores de fumo, segurança contra fogo, centrais de incêndio'),

(5, 'Automatismos para Portões e Acessos', 'Mais conforto, segurança e eficiência no controlo dos seus acessos.', 'A Cotton Dome LDA instala soluções de automatização para portões, barreiras, portas e sistemas de acesso. Os automatismos permitem abertura e fecho automático com segurança, praticidade e controlo, sendo ideais para residências, condomínios, empresas e espaços industriais.',
'["Automatização de portões residenciais e industriais","Barreiras rápidas para controlo de parques","Portas de vidro automáticas comerciais","Comandos de rádio de código evolutivo"]',
'["Motores para portões de correr e bater","Fotocélulas de segurança ativas","Centrais eletrónicas com antiesmagamento","Pilharetes retráteis de segurança"]',
'["Conforto sem sair do veículo","Aumento da segurança em acessos escuros","Controlo de tráfego rápido e ordenado","Elevada vida útil de funcionamento diário"]',
'["Avaliação mecânica do portão existente","Cálculo do motor e força necessários","Fixação e ligação elétrica dos componentes","Programação de fins de curso e comandos"]',
'["images/automatismos-1.png","images/automatismos-2.png","images/automatismos-3.png"]',
'Conforto e Automatização ao Seu Alcance', 'Torne a entrada da sua casa ou empresa mais cómoda e segura com os nossos automatismos de excelência.', 'Automatismos para Portões e Acessos | Cotton Dome LDA', 'Automatize os seus portões de correr ou bater e barreiras de parque. Motores de alto rendimento com comandos seguros.', 'automatismos, portões automáticos, motores de portão, comandos remotos, barreiras automáticas'),

(6, 'Portas de Segurança e Portões Seccionados', 'Soluções resistentes, modernas e seguras para proteger os seus acessos.', 'A Cotton Dome LDA trabalha com portas de segurança e portões seccionados para ambientes residenciais, comerciais e industriais. Estas soluções combinam resistência, funcionalidade, estética e proteção, podendo ser integradas a automatismos e sistemas de controlo de acesso.',
'["Portas blindadas para apartamentos e moradias","Portões seccionados térmicos de garagem","Portões industriais de alta dimensão","Portas corta-fogo e de emergência"]',
'["Portas acústicas multiponto premium","Painéis duplos com poliuretano injetado","Fechaduras de alta segurança com cilindro","Grelhas e sistemas de isolamento"]',
'["Elevada resistência física contra intrusão","Excelente isolamento térmico e acústico","Design moderno integrado à arquitetura","Funcionamento suave e equilibrado"]',
'["Medição milimétrica das aberturas","Instalação de pré-aros e fixação estrutural","Montagem de painéis, calhas e molas","Verificação e afinação de estanquidade"]',
'["images/portas-portoes-1.png","images/portas-portoes-2.png","images/portas-portoes-3.png"]',
'Barreira Física de Máxima Proteção', 'Invista na proteção física ideal com portas blindadas e portões seccionados de alta qualidade.', 'Portas de Segurança e Portões Seccionados | Cotton Dome LDA', 'Instalação de portas blindadas de alta segurança e portões seccionados térmicos para garagens e instalações industriais.', 'portas de segurança, portas blindadas, portões seccionados, portões de garagem, isolamento térmico'),

(7, 'UPS e Sistemas de Energia de Backup', 'Proteja os seus equipamentos contra falhas, oscilações e interrupções elétricas.', 'Os sistemas UPS garantem energia de backup para equipamentos críticos, como câmeras, servidores, redes, alarmes e sistemas de segurança. A Cotton Dome LDA oferece soluções que ajudam a manter os sistemas essenciais em funcionamento mesmo em situações de instabilidade elétrica.',
'["Backup elétrico para CCTV e alarmes","Alimentação ininterrupta de racks de rede","Proteção de servidores corporativos","Filtros contra picos e quedas de tensão"]',
'["UPS Online Dupla Conversão","Baterias AGM/Gel de descarga lenta","Supressores e descarregadores de sobretensões","Bastidores UPS com bypass manual"]',
'["Funcionamento contínuo da segurança em falhas","Proteção de hardware eletrónico sensível","Prevenção contra perda de dados críticos","Estabilização de corrente pura senoidal"]',
'["Cálculo da carga elétrica total (Watts)","Dimensionamento da autonomia requerida","Instalação física e ligações redundantes","Configuração de alertas e monitorização"]',
'["images/ups-1.png","images/ups-2.png","images/ups-3.png"]',
'Garantia de Energia Sem Interrupções', 'Evite que falhas de eletricidade desliguem o seu sistema de segurança. Instale uma UPS dimensionada.', 'UPS e Energia de Backup | Cotton Dome LDA', 'Sistemas de alimentação ininterrupta UPS profissionais para racks de redes, CCTV e servidores corporativos.', 'UPS, energia de backup, nobreak, picos de tensão, alimentação ininterrupta, baterias'),

(8, 'Serralharia em Ferro e Inox', 'Soluções metálicas resistentes, funcionais e adaptadas ao seu projeto.', 'A Cotton Dome LDA desenvolve soluções em serralharia para ferro e inox, incluindo portões, grades, estruturas metálicas, proteções e acabamentos personalizados. O serviço é ideal para reforçar a segurança, melhorar acessos e criar estruturas sob medida para diferentes necessidades.',
'["Portões metálicos de batente ou correr","Grades de segurança para portas e janelas","Estruturas metálicas de suporte","Corrimãos e guardas de escadas"]',
'["Ferragens de alta qualidade em ferro","Estruturas em aço inoxidável escovado/polido","Soldaduras estruturais certificadas","Tratamentos anticorrosivos por galvanização"]',
'["Elevada resistência mecânica e durabilidade","Design personalizado e adaptado às medidas","Proteção física de janelas e montras comerciais","Acabamentos nobres em aço inox"]',
'["Desenho de pormenor e medições em obra","Corte, quinagem e soldadura em oficina","Tratamento de superfície contra oxidação","Montagem e fixação com ancoragem química"]',
'["images/portas-portoes-1.png","images/portas-portoes-2.png","images/portas-portoes-3.png"]',
'Estruturas Metálicas Sob Medida', 'Desenvolvemos soluções de serralharia robustas e estéticas para a sua proteção.', 'Serralharia em Ferro e Inox | Cotton Dome LDA', 'Fabricação e montagem de portões metálicos, grades de proteção e serralharia por medida em ferro e aço inoxidável.', 'serralharia, ferro, aço inox, portões de ferro, grades de segurança, estruturas metálicas'),

(9, 'Telecomunicações e Intercomunicação', 'Infraestrutura técnica para comunicação, conectividade e integração de sistemas.', 'A Cotton Dome LDA oferece soluções em telecomunicações para apoiar sistemas de segurança, redes, comunicação e infraestrutura técnica. O serviço permite criar ambientes mais conectados, organizados e preparados para operações modernas.',
'["Videoporteiros IP inteligentes para moradias","Sistemas de intercomunicação de condomínios","Redes de distribuição de sinal TV/Cabo","Sistemas de som e sonorização profissional"]',
'["Videoporteiros com desvio de chamada para telemóvel","Monitores táteis interiores de alta definição","Módulos de intercomunicação com teclado/RFID","Distribuidores de sinal coaxial e fibra"]',
'["Atendimento de visitas remotamente via App","Abertura segura de portas à distância","Comunicação clara e sem ruídos de rede","Infraestrutura preparada para novas tecnologias"]',
'["Mapeamento de pontos de intercomunicação","Passagem de cablagem coaxial/par trançado","Instalação de painéis de rua e monitores","Configuração de rede e desvio de chamadas"]',
'["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=600&q=80"]',
'Comunicação Prática e Conectada', 'Modernize o intercomunicador do seu prédio ou moradia e receba chamadas diretamente no telemóvel.', 'Telecomunicações e Intercomunicação | Cotton Dome LDA', 'Instalação de intercomunicadores, videoporteiros IP e infraestrutura para comunicação corporativa e residencial.', 'telecomunicações, videoporteiro, intercomunicação, som profissional, redes coaxiais'),

(10, 'Redes e Network Solutions', 'Infraestrutura de rede profissional para segurança, comunicação e alta performance.', 'A Cotton Dome LDA desenvolve soluções de rede para residências, empresas, condomínios, lojas e ambientes industriais. Uma rede bem estruturada é essencial for o funcionamento de sistemas de segurança, videovigilância, controlo de acessos, internet, comunicação e equipamentos conectados.',
'["Cabeamento estruturado estrutural","Wi-Fi corporativo de alta densidade e cobertura","Organização e reestruturação de Racks","Segurança lógica e segregação de redes (VLANs)"]',
'["Racks e Bastidores organizados","Switches PoE e Routers profissionais","Pontos de acesso Wi-Fi Mesh de teto","Cabos CAT6 e Fibra Ótica certificados"]',
'["Estabilidade máxima para câmaras IP e serviços","Sinal Wi-Fi sem quebras em toda a moradia/empresa","Rack limpo e de fácil manutenção técnica","Segurança de dados com redes de convidados"]',
'["Auditoria e desenho lógico da topologia","Passagem física e crimpagem de tomadas RJ45","Identificação e arrumação de bastidores","Testes de transmissão e certificação de rede"]',
'["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"]',
'Redes Estáveis e Seguras', 'Garanta uma rede estável para os seus computadores e câmeras com cabeamento certificado e Wi-Fi profissional.', 'Redes e Network Solutions | Cotton Dome LDA', 'Desenvolvimento de redes estruturadas, racks integrados, switches PoE e redes Wi-Fi empresariais estáveis.', 'redes, cabeamento estruturado, racks, switches PoE, Wi-Fi profissional, routers, redes corporativas');

-- Seeding About Content
INSERT INTO `about_content` (`title`, `description`, `mission`, `vision`, `values`, `image`, `video`) VALUES
('Quem Somos', 'A Cotton Dome LDA é uma empresa especializada em engenharia de segurança eletrónica e infraestrutura tecnológica, focada em fornecer as melhores soluções de proteção e conectividade para moradias, empresas, condomínios e indústrias em Portugal. Focamo-nos em sistemas avançados de CCTV, alarmes de intrusão, controlo de acessos biométricos, deteção de incêndio, automatismos robustos e redes informáticas de alta performance.', 'Fornecer soluções tecnológicas integradas com rigor técnico e ética profissional, promovendo a segurança e o conforto dos nossos clientes.', 'Ser a referência nacional em qualidade, inovação e confiança nos domínios da segurança eletrónica e infraestrutura técnica de redes.', 'Rigor técnico, Integridade, Inovação constante, Foco no cliente, Estética e organização operacional.', 'images/logo.png', NULL);

-- Seeding Suppliers
INSERT INTO `suppliers` (`name`, `description`, `logo`, `link`, `is_active`, `display_order`) VALUES
('Motorline Professional', 'Referência incontornável no desenvolvimento e fabrico de sistemas de automatização de portões, portas seccionadas, barreiras de controlo de tráfego e soluções inteligentes para controlo de acessos.', 'https://www.motorline.pt/wp-content/themes/motorline/images/logo.png', 'https://www.motorline.pt', 1, 1),
('Visiotech Security', 'Líder e fornecedor internacional de referência em tecnologia de segurança eletrónica. Destaca-se pela constante inovação e fornecimento das soluções mais sofisticadas do mercado global.', 'https://www.visiotechsecurity.com/assets/images/visiotech-logo.png', 'https://www.visiotechsecurity.com', 1, 2);

-- Seeding Gallery
INSERT INTO `gallery` (`title`, `category`, `description`, `image`, `is_active`, `display_order`) VALUES
('CCTV Residencial Inteligente', 'cctv', 'Instalação de câmaras IP 4K com análise de vídeo e deteção inteligente de pessoas à volta de moradia premium.', 'images/cctv-1.png', 1, 1),
('Automatização de Portão Seccionado', 'automatismos', 'Instalação de portão seccionado térmico com motorização Motorline rápida e comandos em código evolutivo.', 'images/automatismos-1.png', 1, 2),
('Controlo de Acessos Biométrico', 'acessos', 'Implementação de controlo de acessos com reconhecimento facial e leitores RFID para escritórios corporativos.', 'images/controlo-acessos-1.png', 1, 3),
('Bastidor de Redes e Infraestrutura', 'redes', 'Instalação e certificação de cabeamento de rede estruturada, rack organizado e UPS de backup para segurança estável.', 'images/ups-3.png', 1, 4),
('Deteção Ótica de Incêndio', 'incendio', 'Sistema de centrais analógicas e detetores de fumo endereçáveis com isolador incorporado em pavilhão industrial.', 'images/deteccao-incendio-1.png', 1, 5),
('Segurança Perimetral e Alarme Integrado', 'intrusao', 'Sensores de exterior contra falsas leituras combinados com sirenes dissuasoras inteligentes conectadas por app.', 'images/alarme-intrusao-1.png', 1, 6);

-- Seeding SEO Settings for Pages
INSERT INTO `seo_settings` (`page_slug`, `seo_title`, `seo_description`, `seo_keywords`, `og_image`, `favicon`) VALUES
('/', 'Cotton Dome LDA | Segurança, CCTV, Controlo de Acessos e Automatismos', 'Soluções inteligentes em segurança eletrónica, CCTV, videovigilância, controlo de acessos, intrusão, deteção de incêndio, automatismos, redes, telecomunicações e portões de segurança.', 'Cotton Dome LDA, segurança eletrónica, CCTV, videovigilância, controlo de acessos, automatismos, portões automáticos, deteção de incêndio, sistemas de alarme, redes, telecomunicações, Portugal', 'images/logo.png', 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 24 24'' fill=''%23D4AF37''%3E%3Cpath d=''M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.11v4.71c0 4.22-2.77 8.3-7 9.5-4.23-1.2-7-5.28-7-9.5V6.29l7-3.11z''/%3E%3Cpath d=''M12 6.5l-4 3.5h3v6h2v-6h3z'' opacity=''0.3''/%3E%3C/svg%3E'),
('/#contacto', 'Solicitar Orçamento | Cotton Dome LDA', 'Obtenha um orçamento gratuito e personalizado para os seus sistemas de segurança e redes informáticas.', 'orçamento segurança, contacto cotton dome, segurança residencial, alarme portugal', 'images/logo.png', NULL),
('/servicos/cctv-videovigilancia', 'CCTV e Videovigilância Profissional | Cotton Dome LDA', 'Soluções profissionais de CCTV e videovigilância para residências, empresas e condomínios. Instalação, gravação, monitorização e acesso remoto.', 'CCTV, videovigilância, câmeras de segurança, câmeras IP, gravação de imagem, segurança eletrónica, Portugal', 'images/cctv-1.png', NULL),
('/servicos/intrusao-sistemas-alarme', 'Sistemas de Alarme e Intrusão | Cotton Dome LDA', 'Alarmes e deteção contra intrusão para habitações e espaços comerciais. Sensores, centrais e sirenes de alta qualidade.', 'sistemas de alarme, contra intrusão, detetores de movimento, segurança doméstica, alarmes residenciais', 'images/alarme-intrusao-1.png', NULL),
('/servicos/controlo-de-acessos', 'Controlo de Acessos Profissional | Cotton Dome LDA', 'Sistemas de controlo de acessos por cartões, tags, biometria ou reconhecimento facial em escritórios, armazéns e condomínios.', 'controlo de acessos, reconhecimento facial, leitores RFID, fechaduras eletrónicas, biometria', 'images/controlo-acessos-1.png', NULL),
('/servicos/detecao-de-incendio', 'Sistemas de Deteção de Incêndio | Cotton Dome LDA', 'Instalação e manutenção de centrais de deteção de incêndio, detetores de fumo e sistemas de alarme contra fogo.', 'deteção de incêndio, alarmes de incêndio, detetores de fumo, segurança contra fogo, centrais de incêndio', 'images/deteccao-incendio-1.png', NULL),
('/servicos/automatismos', 'Automatismos para Portões e Acessos | Cotton Dome LDA', 'Automatize os seus portões de correr ou bater e barreiras de parque. Motores de alto rendimento com comandos seguros.', 'automatismos, portões automáticos, motores de portão, comandos remotos, barreiras automáticas', 'images/automatismos-1.png', NULL),
('/servicos/portas-seguranca-portoes-seccionados', 'Portas de Segurança e Portões Seccionados | Cotton Dome LDA', 'Instalação de portas blindadas de alta segurança e portões seccionados térmicos para garagens e instalações industriais.', 'portas de segurança, portas blindadas, portões seccionados, portões de garagem, isolamento térmico', 'images/portas-portoes-1.png', NULL),
('/servicos/ups-sistemas-energia', 'UPS e Energia de Backup | Cotton Dome LDA', 'Sistemas de alimentação ininterrupta UPS profissionais para racks de redes, CCTV e servidores corporativos.', 'UPS, energia de backup, nobreak, picos de tensão, alimentação ininterrupta, baterias', 'images/ups-1.png', NULL),
('/servicos/serralharia-ferro-inox', 'Serralharia em Ferro e Inox | Cotton Dome LDA', 'Fabricação e montagem de portões metálicos, grades de proteção e serralharia por medida em ferro e aço inoxidável.', 'serralharia, ferro, aço inox, portões de ferro, grades de segurança, estruturas metálicas', 'images/portas-portoes-2.png', NULL),
('/servicos/telecomunicacoes', 'Telecomunicações e Intercomunicação | Cotton Dome LDA', 'Instalação de intercomunicadores, videoporteiros IP e infraestrutura para comunicação corporativa e residencial.', 'telecomunicações, videoporteiro, intercomunicação, som profissional, redes coaxiais', 'images/ups-2.png', NULL),
('/servicos/redes-network-solutions', 'Redes e Network Solutions | Cotton Dome LDA', 'Desenvolvimento de redes estruturadas, racks integrados, switches PoE e redes Wi-Fi empresariais estáveis.', 'redes, cabeamento estruturado, racks, switches PoE, Wi-Fi profissional, routers, redes corporativas', 'images/ups-3.png', NULL);

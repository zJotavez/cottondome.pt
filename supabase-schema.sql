-- ============================================================
-- Cotton Dome LDA — Supabase Schema
-- Cole este SQL no Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id              SERIAL PRIMARY KEY,
  company_name    TEXT DEFAULT 'Cotton Dome LDA',
  slogan          TEXT DEFAULT 'Soluções inteligentes para a sua segurança',
  phone           TEXT DEFAULT '+351 918 880 788',
  whatsapp        TEXT DEFAULT '+351 918 880 788',
  email           TEXT DEFAULT 'suporte@domme.pt',
  address         TEXT DEFAULT 'Portugal',
  working_hours_week TEXT DEFAULT 'Segunda a Sexta-feira: 09:00h às 18:30h',
  working_hours_sat  TEXT DEFAULT 'Sábado (Urgências): 09:00h às 13:00h',
  footer_text     TEXT DEFAULT 'Segurança eletrónica de alta performance.',
  social_instagram TEXT DEFAULT 'https://instagram.com/cottondome',
  social_facebook  TEXT DEFAULT 'https://facebook.com/cottondome',
  social_linkedin  TEXT DEFAULT 'https://linkedin.com/company/cottondome',
  logo            TEXT,
  favicon         TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOME CONTENT
CREATE TABLE IF NOT EXISTS home_content (
  id                    SERIAL PRIMARY KEY,
  hero_title            TEXT DEFAULT 'Segurança Inteligente para Residências, Empresas e Condomínios',
  hero_subtitle         TEXT DEFAULT 'A Cotton Dome LDA desenvolve soluções completas em videovigilância, controlo de acessos, intrusão, automatismos, redes, telecomunicações e sistemas de proteção profissional.',
  hero_image            TEXT DEFAULT 'images/logo.png',
  hero_video            TEXT DEFAULT 'videos/hero-video.mp4',
  primary_button_text   TEXT DEFAULT 'Solicitar Orçamento',
  primary_button_link   TEXT DEFAULT '#contacto',
  secondary_button_text TEXT DEFAULT 'Conhecer Soluções',
  secondary_button_link TEXT DEFAULT '#solucoes',
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id                SERIAL PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  short_description TEXT,
  icon              TEXT,
  image             TEXT,
  video             TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  display_order     INT DEFAULT 0,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE PAGES
CREATE TABLE IF NOT EXISTS service_pages (
  id               SERIAL PRIMARY KEY,
  service_id       INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  page_title       TEXT,
  impact_phrase    TEXT,
  full_description TEXT,
  applications     TEXT,   -- stored as JSON string
  related_products TEXT,   -- stored as JSON string
  benefits         TEXT,   -- stored as JSON string
  work_process     TEXT,   -- stored as JSON string
  gallery_images   TEXT,   -- stored as JSON string
  final_cta_title  TEXT,
  final_cta_text   TEXT,
  seo_title        TEXT,
  seo_description  TEXT,
  seo_keywords     TEXT,
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (service_id)
);

-- 5. ABOUT CONTENT
CREATE TABLE IF NOT EXISTS about_content (
  id          SERIAL PRIMARY KEY,
  title       TEXT DEFAULT 'Quem Somos',
  description TEXT,
  mission     TEXT,
  vision      TEXT,
  values      TEXT,
  image       TEXT DEFAULT 'images/logo.png',
  video       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  logo          TEXT,
  link          TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GALLERY
CREATE TABLE IF NOT EXISTS gallery (
  id            SERIAL PRIMARY KEY,
  title         TEXT,
  category      TEXT,
  description   TEXT,
  image         TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SEO SETTINGS
CREATE TABLE IF NOT EXISTS seo_settings (
  id              SERIAL PRIMARY KEY,
  page_slug       TEXT NOT NULL UNIQUE,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT,
  og_image        TEXT,
  favicon         TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT,
  email      TEXT,
  service    TEXT,
  message    TEXT,
  status     TEXT DEFAULT 'new', -- 'new', 'replied', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE site_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE services            ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery             ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages    ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: site content visible to all
CREATE POLICY "public_read_site_settings"   ON site_settings       FOR SELECT USING (true);
CREATE POLICY "public_read_home"            ON home_content         FOR SELECT USING (true);
CREATE POLICY "public_read_services"        ON services             FOR SELECT USING (true);
CREATE POLICY "public_read_service_pages"   ON service_pages        FOR SELECT USING (true);
CREATE POLICY "public_read_about"           ON about_content        FOR SELECT USING (true);
CREATE POLICY "public_read_suppliers"       ON suppliers            FOR SELECT USING (true);
CREATE POLICY "public_read_gallery"         ON gallery              FOR SELECT USING (true);
CREATE POLICY "public_read_seo"             ON seo_settings         FOR SELECT USING (true);

-- PUBLIC INSERT: contact messages (form submissions)
CREATE POLICY "public_insert_messages"      ON contact_messages     FOR INSERT WITH CHECK (true);

-- ADMIN WRITE: all write ops require authenticated user
CREATE POLICY "admin_write_site_settings"   ON site_settings        FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_home"            ON home_content         FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_services"        ON services             FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_service_pages"   ON service_pages        FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_about"           ON about_content        FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_suppliers"       ON suppliers            FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_gallery"         ON gallery              FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_seo"             ON seo_settings         FOR ALL  USING (auth.role() = 'authenticated');
CREATE POLICY "admin_read_messages"         ON contact_messages     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_messages"        ON contact_messages     FOR ALL  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for Media Library
-- ============================================================
-- Run this separately in Supabase Dashboard > Storage:
-- Create bucket named: "media"
-- Set to PUBLIC
-- ============================================================

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO site_settings (company_name, slogan, phone, whatsapp, email, address, working_hours_week, working_hours_sat, footer_text, social_instagram, social_facebook, social_linkedin)
VALUES ('Cotton Dome LDA', 'Soluções inteligentes para a sua segurança', '+351 918 880 788', '+351 918 880 788', 'suporte@domme.pt', 'Portugal', 'Segunda a Sexta-feira: 09:00h às 18:30h', 'Sábado (Urgências): 09:00h às 13:00h', 'Segurança eletrónica de alta performance para residências, empresas e condomínios.', 'https://instagram.com/cottondome', 'https://facebook.com/cottondome', 'https://linkedin.com/company/cottondome')
ON CONFLICT DO NOTHING;

INSERT INTO home_content (hero_title, hero_subtitle, hero_image, hero_video, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link)
VALUES ('Segurança Inteligente para Residências, Empresas e Condomínios', 'A Cotton Dome LDA desenvolve soluções completas em videovigilância, controlo de acessos, intrusão, automatismos, redes, telecomunicações e sistemas de proteção profissional.', 'images/logo.png', 'videos/hero-video.mp4', 'Solicitar Orçamento', '#contacto', 'Conhecer Soluções', '#solucoes')
ON CONFLICT DO NOTHING;

INSERT INTO about_content (title, description, mission, vision, "values", image)
VALUES ('Quem Somos', 'A Cotton Dome LDA é uma empresa especializada em engenharia de segurança eletrónica e infraestrutura tecnológica, focada em fornecer as melhores soluções de proteção e conectividade para moradias, empresas, condomínios e indústrias em Portugal.', 'Fornecer soluções tecnológicas integradas com rigor técnico e ética profissional, promovendo a segurança e o conforto dos nossos clientes.', 'Ser a referência nacional em qualidade, inovação e confiança nos domínios da segurança eletrónica.', 'Rigor técnico, Integridade, Inovação constante, Foco no cliente, Estética e organização operacional.', 'images/logo.png')
ON CONFLICT DO NOTHING;

INSERT INTO services (id, title, slug, short_description, icon, image, is_active, display_order) VALUES
(1,  'CCTV / Videovigilância',                    'cctv-videovigilancia',                'Sistemas de videovigilância para residências, empresas, condomínios e espaços comerciais.',          'Camera',         'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=1200&q=80', true, 1),
(2,  'Intrusão / Sistemas de Alarme',             'intrusao-sistemas-alarme',            'Soluções de alarme contra intrusão com sensores, centrais, sirenes e tecnologia integrada.',         'ShieldAlert',    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80', true, 2),
(3,  'Controlo de Acessos',                       'controlo-de-acessos',                 'Sistemas para gestão de entradas e saídas, incluindo teclados, cartões e biometria.',                 'Fingerprint',    'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=80', true, 3),
(4,  'Deteção de Incêndio',                       'detecao-de-incendio',                 'Sistemas de deteção e alerta de incêndio com centrais, sensores e sirenes profissionais.',            'Flame',          'images/deteccao-incendio-1.png', true, 4),
(5,  'Automatismos',                              'automatismos',                         'Automação de portões, barreiras, portas e acessos com soluções modernas.',                            'Cpu',            'images/automatismos-1.png', true, 5),
(6,  'Portas de Segurança e Portões Seccionados', 'portas-seguranca-portoes-seccionados', 'Portas de segurança e portões seccionados para residências, comércio e indústria.',                   'DoorClosed',     'images/portas-portoes-1.png', true, 6),
(7,  'UPS / Sistemas de Energia',                 'ups-sistemas-energia',                 'Sistemas de alimentação ininterrupta para proteger equipamentos críticos.',                            'BatteryCharging','images/ups-1.png', true, 7),
(8,  'Serralharia em Ferro e Inox',               'serralharia-ferro-inox',               'Soluções técnicas em ferro e inox: portões, grades, estruturas e projetos personalizados.',           'Hammer',         'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', true, 8),
(9,  'Telecomunicações',                          'telecomunicacoes',                     'Infraestrutura técnica para comunicação, integração de sistemas e conectividade.',                     'Radio',          'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80', true, 9),
(10, 'Redes / Network Solutions',                 'redes-network-solutions',              'Redes, cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura.',                'Network',        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', true, 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO suppliers (name, description, logo, link, is_active, display_order) VALUES
('Motorline Professional', 'Referência incontornável no desenvolvimento e fabrico de sistemas de automatização de portões.', 'https://www.motorline.pt/wp-content/themes/motorline/images/logo.png', 'https://www.motorline.pt', true, 1),
('Visiotech Security', 'Líder e fornecedor internacional de referência em tecnologia de segurança eletrónica.', 'https://www.visiotechsecurity.com/assets/images/visiotech-logo.png', 'https://www.visiotechsecurity.com', true, 2)
ON CONFLICT DO NOTHING;

INSERT INTO gallery (title, category, description, image, is_active, display_order) VALUES
('CCTV Residencial Inteligente', 'cctv', 'Instalação de câmaras IP 4K com análise de vídeo e deteção inteligente.', 'images/cctv-1.png', true, 1),
('Automatização de Portão Seccionado', 'automatismos', 'Instalação de portão seccionado térmico com motorização Motorline.', 'images/automatismos-1.png', true, 2),
('Controlo de Acessos Biométrico', 'acessos', 'Controlo de acessos com reconhecimento facial e leitores RFID.', 'images/controlo-acessos-1.png', true, 3),
('Bastidor de Redes e Infraestrutura', 'redes', 'Cabeamento de rede estruturada, rack organizado e UPS de backup.', 'images/ups-3.png', true, 4),
('Deteção Ótica de Incêndio', 'incendio', 'Centrais analógicas e detetores de fumo endereçáveis em pavilhão industrial.', 'images/deteccao-incendio-1.png', true, 5),
('Segurança Perimetral e Alarme', 'intrusao', 'Sensores de exterior com sirenes dissuasoras inteligentes.', 'images/alarme-intrusao-1.png', true, 6)
ON CONFLICT DO NOTHING;

INSERT INTO seo_settings (page_slug, seo_title, seo_description, seo_keywords) VALUES
('/', 'Cotton Dome LDA | Segurança, CCTV, Controlo de Acessos e Automatismos', 'Soluções inteligentes em segurança eletrónica, CCTV, videovigilância, controlo de acessos, intrusão, deteção de incêndio, automatismos, redes e telecomunicações.', 'Cotton Dome LDA, segurança eletrónica, CCTV, videovigilância, controlo de acessos, automatismos, Portugal'),
('/servicos/cctv-videovigilancia', 'CCTV e Videovigilância Profissional | Cotton Dome LDA', 'Soluções profissionais de CCTV e videovigilância. Instalação, gravação, monitorização e acesso remoto.', 'CCTV, videovigilância, câmeras de segurança, câmeras IP, Portugal'),
('/servicos/intrusao-sistemas-alarme', 'Sistemas de Alarme e Intrusão | Cotton Dome LDA', 'Alarmes e deteção contra intrusão para habitações e espaços comerciais.', 'sistemas de alarme, contra intrusão, detetores de movimento, segurança doméstica'),
('/servicos/controlo-de-acessos', 'Controlo de Acessos Profissional | Cotton Dome LDA', 'Sistemas de controlo de acessos por cartões, biometria ou reconhecimento facial.', 'controlo de acessos, reconhecimento facial, leitores RFID, biometria'),
('/servicos/detecao-de-incendio', 'Sistemas de Deteção de Incêndio | Cotton Dome LDA', 'Instalação de centrais de deteção de incêndio, detetores de fumo e alarmes.', 'deteção de incêndio, alarmes de incêndio, detetores de fumo'),
('/servicos/automatismos', 'Automatismos para Portões e Acessos | Cotton Dome LDA', 'Automatize os seus portões e barreiras com motores de alto rendimento.', 'automatismos, portões automáticos, motores de portão'),
('/servicos/portas-seguranca-portoes-seccionados', 'Portas de Segurança e Portões Seccionados | Cotton Dome LDA', 'Portas blindadas e portões seccionados para garagens e instalações industriais.', 'portas de segurança, portões seccionados, portões de garagem'),
('/servicos/ups-sistemas-energia', 'UPS e Energia de Backup | Cotton Dome LDA', 'Sistemas UPS profissionais para racks de redes, CCTV e servidores.', 'UPS, energia de backup, alimentação ininterrupta, baterias'),
('/servicos/serralharia-ferro-inox', 'Serralharia em Ferro e Inox | Cotton Dome LDA', 'Portões metálicos, grades de proteção e serralharia por medida.', 'serralharia, ferro, aço inox, portões de ferro, grades'),
('/servicos/telecomunicacoes', 'Telecomunicações e Intercomunicação | Cotton Dome LDA', 'Intercomunicadores, videoporteiros IP e infraestrutura de comunicação.', 'telecomunicações, videoporteiro, intercomunicação'),
('/servicos/redes-network-solutions', 'Redes e Network Solutions | Cotton Dome LDA', 'Redes estruturadas, racks, switches PoE e redes Wi-Fi empresariais.', 'redes, cabeamento estruturado, switches PoE, Wi-Fi profissional')
ON CONFLICT (page_slug) DO NOTHING;

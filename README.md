# COTTON DOME LDA | Website Institucional Premium & Painel Administrativo

Este repositório contém a versão completa, otimizada, segura e dinâmica do website institucional da **Cotton Dome LDA**, projetada para produção e hospedagem em servidores de alojamento partilhado Apache/PHP (como a **Hostinger**) com sincronização direta via GitHub.

A aplicação utiliza uma arquitetura híbrida de alto desempenho: **Frontend SPA em React (Vite/TypeScript)** que carrega conteúdos dinamicamente a partir do banco de dados, integrado com um **Motor de Injeção de SEO em PHP**, garantindo indexação e leitura perfeita por robôs de busca (Google, Bing, redes sociais) sem prejudicar a experiência fluida da aplicação.

---

## 🚀 Arquitetura & Segurança

1. **Frontend Dinâmico**: Os blocos visuais, títulos, subtítulos, vídeos de fundo, galeria de projetos, parceiros comerciais, e detalhes de cada serviço são carregados de forma dinâmica na montagem do app React a partir da API `/api/get_content.php`.
2. **Proteção Visual de Conteúdo**: Para evitar a cópia não autorizada de portfólio e textos, o site público implementa restrições completas:
   - Bloqueio de clique direito do rato (context menu).
   - Bloqueio de seleção de textos e imagens por CSS (`user-select: none`).
   - Impedimento de arrastar imagens (`dragstart`).
   - Bloqueio de atalhos do teclado comuns de cópia/inspeção (Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+S, F12, Ctrl+Shift+I).
   - Bloqueio de gestos de zoom em dispositivos móveis (pinch zoom e double-tap zoom).
   *Nota: Todas as restrições são desativadas automaticamente na rota `/admin` para permitir a gestão operacional.*
3. **Painel Administrativo Completo (`/admin`)**: Interface administrativa premium integrada na SPA, permitindo a edição completa do site sem mexer em código (títulos, textos, logs de mensagens, upload de mídia, edição de serviços, fornecedores, SEO, etc.).
4. **Motor SEO em PHP**: As rotas no servidor Apache são geridas por um ficheiro `.htaccess` que direciona todos os pedidos para o `index.php`. Este script interpela o banco de dados e injeta os metadados SEO corretos (títulos, keywords, meta description, imagens Open Graph) no HTML compilado antes de o servir ao utilizador final.

---

## 📂 Estrutura do Projeto

```text
├── api/                    # Backend PHP & Endpoints do Painel Administrativo
│   ├── admin/              # Endpoints administrativos protegidos por sessão
│   ├── config.php          # Configuração global, CORS e sessão segura
│   ├── db_config.php       # Parâmetros de ligação à base de dados MySQL (Git-ignored)
│   ├── db_config.php.template # Modelo para configuração da base de dados
│   ├── get_content.php     # Endpoint público agregador de dados
│   └── contact.php         # Processador do formulário de contacto e envio de e-mails
├── dist/                 # Ficheiros compilados do Frontend React (gerados pelo build)
├── public/                 # Recursos públicos originais (logotipo, imagens locais, vídeos)
├── src/                    # Código-fonte React / TypeScript
│   ├── components/         # Componentes modulares dinâmicos (Hero, About, Solutions, etc.)
│   ├── types.ts            # Interfaces TypeScript espelhando a base de dados
│   └── App.tsx             # Roteador principal, copy-protection e inicialização de dados
├── .htaccess               # Configurações do servidor Apache (URL rewriting, cache, compressão Gzip)
├── index.php               # SEO Router e servidor do shell index.html
├── database.sql            # Script de criação e preenchimento da base de dados MySQL
└── package.json            # Configuração de pacotes e build npm
```

---

## 🛠️ Instalação & Configuração Local

### Pré-requisitos
- Node.js instalado (v18 ou superior)
- Servidor local PHP + MySQL (XAMPP, WampServer ou Laragon)

### Passos:

1. **Instalar as dependências do Frontend**:
   ```bash
   npm install
   ```

2. **Configurar a base de dados local**:
   - Crie uma base de dados MySQL (ex: `cotton_dome`).
   - Importe o ficheiro `database.sql` para a base de dados criada.
   - Navegue para a pasta `api/` e copie o ficheiro `db_config.php.template` criando um novo ficheiro chamado `db_config.php`.
   - Edite o novo `api/db_config.php` com as credenciais do seu servidor local MySQL:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_USER', 'seu_usuario');
     define('DB_PASS', 'sua_senha');
     define('DB_NAME', 'cotton_dome');
     ```

3. **Iniciar a aplicação**:
   - Coloque a pasta do projeto no diretório do seu servidor PHP (ex: `htdocs` ou `www`).
   - Execute o compilador do Frontend em modo desenvolvimento se pretender efetuar alterações:
     ```bash
     npm run dev
     ```

---

## ☁️ Como Deployar na Hostinger

### Passo 1: Compilar o Frontend
No seu computador de desenvolvimento local, execute a build de produção:
```bash
npm run build
```
Isto irá gerar ou atualizar a pasta `dist/` no diretório raiz do seu projeto.

### Passo 2: Criar a Base de Dados na Hostinger
1. Aceda ao painel de controlo da Hostinger (**hPanel**).
2. Vá a **Bases de dados MySQL** e crie uma nova base de dados (ex: `u123456789_cotton`).
3. Crie um utilizador MySQL e associe-o à base de dados com privilégios totais. Anote o nome da base de dados, utilizador e password.
4. Entre no **phpMyAdmin** da base de dados criada.
5. Clique em **Importar** e selecione o ficheiro `database.sql` do seu repositório local. Execute a importação.

### Passo 3: Enviar os Ficheiros para a Hostinger (Via FTP ou Gestor de Ficheiros)
Envie os seguintes ficheiros e pastas diretamente para a pasta pública do seu domínio (geralmente `public_html/`):

1. **Conteúdo da pasta `dist/`**: Copie todos os ficheiros contidos dentro da pasta `dist/` (incluindo a pasta `assets/` e `index.html`) e cole-os no diretório raiz (`public_html/`).
2. **Pasta `api/`**: Copie a pasta `api/` por completo e cole-a no diretório raiz (`public_html/`).
3. **Ficheiro `.htaccess`**: Envie o ficheiro `.htaccess` para a raiz (`public_html/`).
4. **Ficheiro `index.php`**: Envie o ficheiro `index.php` para a raiz (`public_html/`).
5. **Pasta `public/`**: Copie a pasta `public/` para a raiz (`public_html/`) para garantir que recursos estáticos permaneçam no local esperado.
6. **Pasta `uploads/`**: Crie uma pasta vazia chamada `uploads/` na raiz (`public_html/`). Defina as permissões desta pasta no gestor de ficheiros para `755` (ou `777` se necessário) para permitir que o servidor grave ficheiros de imagem e vídeo enviados pelo painel.

### Passo 4: Configurar Ligação de Produção
1. Na pasta `public_html/api/`, crie o ficheiro `db_config.php` (ou edite o existente).
2. Introduza as credenciais da base de dados criada no painel Hostinger:
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'u123456789_nome_usuario');
   define('DB_PASS', 'sua_senha_segura_aqui');
   define('DB_NAME', 'u123456789_nome_base_dados');
   ```

Tudo pronto! O site estará online no seu domínio com ligações dinâmicas e proteção de conteúdo.

---

## 🔐 Credenciais Padrão do Painel de Administração

- **URL de Acesso**: `https://seu-dominio.com/admin`
- **Utilizador**: `admin`
- **Password Inicial**: `#CD2026lda`

> [!IMPORTANT]
> Aceda imediatamente à aba **Alterar Senha** no Painel Administrativo após a primeira instalação para reconfigurar a password padrão por questões de segurança.

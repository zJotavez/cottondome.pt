/**
 * Cotton Dome LDA - Database Layer (PHP + JSON Backend)
 * Conecta o frontend aos endpoints PHP locais baseados em ficheiros JSON.
 */

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Helper para fazer requisições HTTP seguras
async function request(url: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  if (res.status === 401) {
    throw new Error('Não autenticado.');
  }
  if (!res.ok) {
    throw new Error(`Erro de rede: ${res.statusText}`);
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Erro desconhecido.');
  }
  return data;
}

// ─────────────────────────────────────────
// FETCH PUBLIC SITE CONTENT
// ─────────────────────────────────────────
export async function getSiteContent() {
  try {
    const res = await fetch(`${API_BASE}/api/get_content.php`);
    if (!res.ok) throw new Error('Não foi possível obter dados');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[db] getSiteContent error:', err);
    return { success: false, data: null };
  }
}

// ─────────────────────────────────────────
// ADMIN: MESSAGES
// ─────────────────────────────────────────
export async function getMessages() {
  const res = await request(`${API_BASE}/api/admin/messages.php`);
  return res.data || [];
}

export async function updateMessageStatus(id: number, status: string) {
  await request(`${API_BASE}/api/admin/messages.php`, {
    method: 'POST',
    body: JSON.stringify({ id, status }),
  });
}

export async function deleteMessage(id: number) {
  await request(`${API_BASE}/api/admin/messages.php`, {
    method: 'POST',
    body: JSON.stringify({ id, action: 'delete' }),
  });
}

// ─────────────────────────────────────────
// ADMIN: MEDIA
// ─────────────────────────────────────────
export async function getMediaList() {
  const res = await request(`${API_BASE}/api/admin/media.php`);
  return (res.data || []).map((file: any) => ({
    id: file.id,
    file_name: file.name,
    file_path: file.url,
    file_type: file.type?.startsWith('video') ? 'video' : 'image',
    mime_type: file.type,
    file_size: file.size,
    created_at: file.created,
  }));
}

export async function uploadMedia(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/api/admin/upload.php`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Falha no upload do ficheiro.');
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Erro no upload.');
  }
  return data.data.url;
}

export async function deleteMedia(id: string) {
  await request(`${API_BASE}/api/admin/media.php`, {
    method: 'POST',
    body: JSON.stringify({ id, action: 'delete' }),
  });
}

// ─────────────────────────────────────────
// ADMIN: SITE SETTINGS
// ─────────────────────────────────────────
export async function saveSettings(data: any) {
  await request(`${API_BASE}/api/admin/save_settings.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────
// ADMIN: HOME CONTENT
// ─────────────────────────────────────────
export async function saveHome(data: any) {
  await request(`${API_BASE}/api/admin/save_home.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────
// ADMIN: ABOUT CONTENT
// ─────────────────────────────────────────
export async function saveAbout(data: any) {
  await request(`${API_BASE}/api/admin/save_about.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────
// ADMIN: SERVICES
// ─────────────────────────────────────────
export async function saveService(service: any) {
  await request(`${API_BASE}/api/admin/save_services.php`, {
    method: 'POST',
    body: JSON.stringify(service),
  });
}

// ─────────────────────────────────────────
// ADMIN: SERVICE PAGES
// ─────────────────────────────────────────
export async function saveServicePage(data: any) {
  await request(`${API_BASE}/api/admin/save_service_page.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────
// ADMIN: SUPPLIERS
// ─────────────────────────────────────────
export async function saveSupplier(supplier: any) {
  await request(`${API_BASE}/api/admin/save_suppliers.php`, {
    method: 'POST',
    body: JSON.stringify(supplier),
  });
}

// ─────────────────────────────────────────
// ADMIN: GALLERY
// ─────────────────────────────────────────
export async function saveGallery(item: any) {
  await request(`${API_BASE}/api/admin/save_gallery.php`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

// ─────────────────────────────────────────
// ADMIN: SEO SETTINGS
// ─────────────────────────────────────────
export async function saveSeo(item: any) {
  await request(`${API_BASE}/api/admin/save_seo.php`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

// ─────────────────────────────────────────
// CONTACT FORM: Submit message (public)
// ─────────────────────────────────────────
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}) {
  await request(`${API_BASE}/api/contact.php`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─────────────────────────────────────────
// ADMIN: DRAFT & PUBLISH & BACKUP & HISTORY
// ─────────────────────────────────────────
export async function getAdminSiteContent() {
  const res = await request(`${API_BASE}/api/admin/get_draft.php`);
  return res;
}

export async function publishChanges() {
  const res = await request(`${API_BASE}/api/admin/publish.php`);
  return res;
}

export async function getHistory() {
  const res = await request(`${API_BASE}/api/admin/history.php`);
  return res.data || [];
}

export async function saveProduct(product: any) {
  const res = await request(`${API_BASE}/api/admin/save_products.php`, {
    method: 'POST',
    body: JSON.stringify({ ...product, action: 'save' }),
  });
  return res;
}

export async function deleteProduct(id: string | number) {
  const res = await request(`${API_BASE}/api/admin/save_products.php`, {
    method: 'POST',
    body: JSON.stringify({ id, action: 'delete' }),
  });
  return res;
}

export function getBackupUrl() {
  return `${API_BASE}/api/admin/backup.php`;
}

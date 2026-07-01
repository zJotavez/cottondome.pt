/**
 * Cotton Dome LDA - Database Layer (Supabase)
 * Substitui todos os endpoints PHP por queries Supabase diretas.
 */

import { supabase } from './supabase';

// ─────────────────────────────────────────
// FETCH PUBLIC SITE CONTENT
// ─────────────────────────────────────────
export async function getSiteContent() {
  try {
    const [
      { data: settingsArr },
      { data: homeArr },
      { data: aboutArr },
      { data: services },
      { data: rawServicePages },
      { data: suppliers },
      { data: gallery },
      { data: seo },
    ] = await Promise.all([
      supabase.from('site_settings').select('*').limit(1),
      supabase.from('home_content').select('*').limit(1),
      supabase.from('about_content').select('*').limit(1),
      supabase.from('services').select('*').eq('is_active', true).order('display_order').order('id'),
      supabase.from('service_pages').select('*'),
      supabase.from('suppliers').select('*').eq('is_active', true).order('display_order').order('id'),
      supabase.from('gallery').select('*').eq('is_active', true).order('display_order').order('id'),
      supabase.from('seo_settings').select('*'),
    ]);

    // Parse JSON fields in service_pages
    const servicePages = (rawServicePages || []).map((page: any) => ({
      ...page,
      applications: parseJsonField(page.applications),
      related_products: parseJsonField(page.related_products),
      benefits: parseJsonField(page.benefits),
      work_process: parseJsonField(page.work_process),
      gallery_images: parseJsonField(page.gallery_images),
    }));

    return {
      success: true,
      data: {
        settings: settingsArr?.[0] || {},
        home: homeArr?.[0] || {},
        about: aboutArr?.[0] || {},
        services: services || [],
        service_pages: servicePages,
        suppliers: suppliers || [],
        gallery: gallery || [],
        seo: seo || [],
      },
    };
  } catch (err) {
    console.error('[db] getSiteContent error:', err);
    return { success: false, data: null };
  }
}

function parseJsonField(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

// ─────────────────────────────────────────
// ADMIN: MESSAGES
// ─────────────────────────────────────────
export async function getMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateMessageStatus(id: number, status: string) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: number) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────
// ADMIN: MEDIA (Supabase Storage)
// ─────────────────────────────────────────
export async function getMediaList() {
  const { data, error } = await supabase.storage.from('media').list('uploads', {
    limit: 500,
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw error;
  return (data || []).map((file: any) => ({
    id: file.id || file.name,
    file_name: file.name,
    file_path: getPublicUrl(file.name),
    file_type: file.metadata?.mimetype?.startsWith('video') ? 'video' : 'image',
    mime_type: file.metadata?.mimetype,
    file_size: file.metadata?.size,
    created_at: file.created_at,
  }));
}

export function getPublicUrl(fileName: string): string {
  const { data } = supabase.storage.from('media').getPublicUrl(`uploads/${fileName}`);
  return data.publicUrl;
}

export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const safeFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('media')
    .upload(`uploads/${safeFileName}`, file, { upsert: false });
  if (error) throw error;
  return getPublicUrl(safeFileName);
}

export async function deleteMedia(fileName: string) {
  const path = fileName.includes('uploads/') ? fileName : `uploads/${fileName}`;
  const { error } = await supabase.storage.from('media').remove([path]);
  if (error) throw error;
}

// ─────────────────────────────────────────
// ADMIN: SITE SETTINGS
// ─────────────────────────────────────────
export async function saveSettings(data: any) {
  // Upsert: update row id=1, or insert if missing
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...data }, { onConflict: 'id' });
  if (error) throw error;
}

// ─────────────────────────────────────────
// ADMIN: HOME CONTENT
// ─────────────────────────────────────────
export async function saveHome(data: any) {
  const { error } = await supabase
    .from('home_content')
    .upsert({ id: 1, ...data }, { onConflict: 'id' });
  if (error) throw error;
}

// ─────────────────────────────────────────
// ADMIN: ABOUT CONTENT
// ─────────────────────────────────────────
export async function saveAbout(data: any) {
  const { error } = await supabase
    .from('about_content')
    .upsert({ id: 1, ...data }, { onConflict: 'id' });
  if (error) throw error;
}

// ─────────────────────────────────────────
// ADMIN: SERVICES
// ─────────────────────────────────────────
export async function saveService(service: any) {
  const { id, ...rest } = service;
  if (id) {
    const { error } = await supabase.from('services').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('services').insert(rest);
    if (error) throw error;
  }
}

// ─────────────────────────────────────────
// ADMIN: SERVICE PAGES
// ─────────────────────────────────────────
export async function saveServicePage(data: any) {
  const payload = {
    ...data,
    applications: JSON.stringify(data.applications || []),
    related_products: JSON.stringify(data.related_products || []),
    benefits: JSON.stringify(data.benefits || []),
    work_process: JSON.stringify(data.work_process || []),
    gallery_images: JSON.stringify(data.gallery_images || []),
  };
  const { id, ...rest } = payload;
  if (id) {
    const { error } = await supabase.from('service_pages').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('service_pages')
      .upsert(rest, { onConflict: 'service_id' });
    if (error) throw error;
  }
}

// ─────────────────────────────────────────
// ADMIN: SUPPLIERS
// ─────────────────────────────────────────
export async function saveSupplier(supplier: any) {
  const { id, action, ...rest } = supplier;
  if (action === 'delete') {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
  } else if (id) {
    const { error } = await supabase.from('suppliers').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('suppliers').insert(rest);
    if (error) throw error;
  }
}

// ─────────────────────────────────────────
// ADMIN: GALLERY
// ─────────────────────────────────────────
export async function saveGallery(item: any) {
  const { id, action, ...rest } = item;
  if (action === 'delete') {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
  } else if (id) {
    const { error } = await supabase.from('gallery').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('gallery').insert(rest);
    if (error) throw error;
  }
}

// ─────────────────────────────────────────
// ADMIN: SEO SETTINGS
// ─────────────────────────────────────────
export async function saveSeo(item: any) {
  const { id, ...rest } = item;
  if (id) {
    const { error } = await supabase.from('seo_settings').update(rest).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('seo_settings')
      .upsert(rest, { onConflict: 'page_slug' });
    if (error) throw error;
  }
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
  const { error } = await supabase.from('contact_messages').insert({
    ...data,
    status: 'new',
  });
  if (error) throw error;
}

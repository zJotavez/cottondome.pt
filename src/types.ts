export interface Solution {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
}

export interface Environment {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  website: string;
  focus: string[];
}

export interface TimelineStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  image: string;
}

export interface SiteSettings {
  id?: number;
  company_name: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours_week: string;
  working_hours_sat: string;
  footer_text: string;
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  updated_at?: string;
}

export interface HomeContent {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_video: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  updated_at?: string;
}

export interface DbService {
  id?: number;
  title: string;
  slug: string;
  short_description: string;
  icon: string;
  image: string;
  video?: string;
  is_active: number;
  display_order: number;
  updated_at?: string;
}

export interface DbServicePage {
  id?: number;
  service_id: number;
  page_title: string;
  impact_phrase: string;
  full_description: string;
  applications: string[];
  related_products: string[];
  benefits: string[];
  work_process: string[];
  final_cta_title: string;
  final_cta_text: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  updated_at?: string;
}

export interface AboutContent {
  id?: number;
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
  image: string;
  video?: string;
  updated_at?: string;
}

export interface DbSupplier {
  id?: number;
  name: string;
  description: string;
  logo: string;
  link: string;
  is_active: number;
  display_order: number;
  updated_at?: string;
}

export interface DbGallery {
  id?: number;
  title: string;
  category: string;
  description: string;
  image: string;
  is_active: number;
  display_order: number;
  created_at?: string;
}

export interface SeoSetting {
  id?: number;
  page_slug: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image: string;
  favicon: string;
  updated_at?: string;
}

export interface SiteData {
  settings: SiteSettings;
  home: HomeContent;
  about: AboutContent;
  services: DbService[];
  servicePages: DbServicePage[];
  suppliers: DbSupplier[];
  gallery: DbGallery[];
  seo: SeoSetting[];
}


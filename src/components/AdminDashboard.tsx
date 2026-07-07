import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, LayoutDashboard, Settings, Home as HomeIcon, ShieldAlert, Cpu, 
  FileText, Users, Image as ImageIcon, MessageSquare, Globe, LogOut, 
  Plus, Trash2, Edit3, Save, Eye, Check, X, Upload, Copy, RefreshCw, 
  ChevronRight, Menu, HelpCircle, Phone, Mail, MapPin, ExternalLink, 
  List, Shield, Search, Database, CloudLightning, ArrowUp, ArrowDown
} from "lucide-react";
import { LucideIcon } from "./LucideIcon";
import {
  getSiteContent,
  getMessages,
  getMediaList,
  updateMessageStatus,
  deleteMessage,
  uploadMedia,
  deleteMedia,
  saveSettings,
  saveHome,
  saveAbout,
  saveService,
  saveServicePage,
  saveSupplier,
  saveGallery,
  saveSeo,
  // Novas APIs conectadas ao backend
  getAdminSiteContent,
  publishChanges,
  getHistory,
  saveProduct,
  deleteProduct,
  getBackupUrl
} from "../lib/database";
import { DEFAULT_SITE_DATA } from "../lib/defaultData";

// Componentes públicos importados para o modo Preview responsivo
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Pilares } from "./Pilares";
import { Solutions } from "./Solutions";
import { Environments } from "./Environments";
import { Outlet as PromoOutlet } from "./Outlet";
import { HowWeWork } from "./HowWeWork";
import { Projects } from "./Projects";
import { HeroQuote } from "./HeroQuote";
import { About } from "./About";
import { ContactForm } from "./ContactForm";
import { Footer } from "./Footer";
import { ServiceDetail } from "./ServiceDetail";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Função helper para calcular onde cada mídia está sendo usada
function getMediaUsage(fileName: string, siteData: any): string[] {
  const usages: string[] = [];
  if (!siteData) return usages;

  // 1. Settings / Configurações Gerais
  if (siteData.settings) {
    if (siteData.settings.logo === fileName || siteData.settings.logo?.endsWith(fileName)) usages.push("Site / Logotipo Principal");
    if (siteData.settings.logo_alt === fileName || siteData.settings.logo_alt?.endsWith(fileName)) usages.push("Site / Logotipo Alternativo");
    if (siteData.settings.favicon === fileName || siteData.settings.favicon?.endsWith(fileName)) usages.push("Site / Favicon");
  }

  // 2. Home Hero
  if (siteData.home) {
    if (siteData.home.hero_image === fileName || siteData.home.hero_image?.endsWith(fileName)) usages.push("Página Inicial / Hero (Imagem)");
    if (siteData.home.hero_video === fileName || siteData.home.hero_video?.endsWith(fileName)) usages.push("Página Inicial / Hero (Vídeo)");
  }

  // 3. About / Sobre Nós
  if (siteData.about) {
    if (siteData.about.image === fileName || siteData.about.image?.endsWith(fileName)) usages.push("Sobre Nós / Imagem Principal");
    if (siteData.about.video === fileName || siteData.about.video?.endsWith(fileName)) usages.push("Sobre Nós / Vídeo");
  }

  // 4. Services / Serviços
  if (Array.isArray(siteData.services)) {
    siteData.services.forEach((s: any) => {
      if (s.image === fileName || s.image?.endsWith(fileName)) {
        usages.push(`Serviços / ${s.title} (Imagem de Destaque)`);
      }
    });
  }

  // 5. Service Pages / Detalhes de Páginas de Serviços
  if (Array.isArray(siteData.service_pages)) {
    siteData.service_pages.forEach((p: any) => {
      const parent = siteData.services?.find((s: any) => s.id === p.service_id);
      const sName = parent ? parent.title : `Serviço ${p.service_id}`;
      if (p.image === fileName || p.image?.endsWith(fileName)) usages.push(`Página de ${sName} / Imagem Hero`);
      if (p.video === fileName || p.video?.endsWith(fileName)) usages.push(`Página de ${sName} / Vídeo Hero`);
      if (Array.isArray(p.gallery_images)) {
        p.gallery_images.forEach((img: string, i: number) => {
          if (img === fileName || img?.endsWith(fileName)) {
            usages.push(`Página de ${sName} / Imagem da Galeria ${i + 1}`);
          }
        });
      }
    });
  }

  // 6. Products / Produtos
  if (Array.isArray(siteData.products)) {
    siteData.products.forEach((prod: any) => {
      if (prod.image === fileName || prod.image?.endsWith(fileName)) {
        usages.push(`Produtos / ${prod.name} (Imagem Principal)`);
      }
      if (Array.isArray(prod.gallery)) {
        prod.gallery.forEach((img: string, i: number) => {
          if (img === fileName || img?.endsWith(fileName)) {
            usages.push(`Produtos / ${prod.name} / Galeria (Imagem ${i + 1})`);
          }
        });
      }
    });
  }

  // 7. Suppliers / Fornecedores
  if (Array.isArray(siteData.suppliers)) {
    siteData.suppliers.forEach((sup: any) => {
      if (sup.logo === fileName || sup.logo?.endsWith(fileName) || sup.logo_url === fileName || sup.logo_url?.endsWith(fileName)) {
        usages.push(`Fornecedores / ${sup.name} (Logotipo)`);
      }
    });
  }

  // 8. Projects / Galeria
  if (Array.isArray(siteData.gallery)) {
    siteData.gallery.forEach((g: any) => {
      if (g.image === fileName || g.image?.endsWith(fileName) || g.image_url === fileName || g.image_url?.endsWith(fileName)) {
        usages.push(`Projetos & Galeria / ${g.title}`);
      }
    });
  }

  return usages;
}

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("suporte@domme.pt");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs & Nav
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Data
  const [siteData, setSiteData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  
  // Loaders
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Modals / Selected Items
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);
  const [mediaSelectorTarget, setMediaSelectorTarget] = useState<{ form: string; field: string; index?: number } | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile" | null>(null);
  const [previewPath, setPreviewPath] = useState("/");

  // Form States
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [homeForm, setHomeForm] = useState<any>({});
  const [aboutForm, setAboutForm] = useState<any>({});
  
  // Services Forms
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [servicePageForm, setServicePageForm] = useState<any>({});
  const [newServiceModal, setNewServiceModal] = useState(false);

  // Products Forms
  const [productsList, setProductsList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProductModal, setNewProductModal] = useState(false);

  // Suppliers & Gallery & SEO Forms
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [seoList, setSeoList] = useState<any[]>([]);
  const [editingSeo, setEditingSeo] = useState<any>(null);

  // Passwords Form
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Media File Input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Fetch data
  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch site draft content
      const contentRes = await getAdminSiteContent();
      let d = contentRes.success && contentRes.data ? contentRes.data : null;
      if (!d) {
        console.warn("Using fallback static data.");
        d = DEFAULT_SITE_DATA;
      }
      setSiteData(d);
      setSettingsForm(d.settings || {});
      setHomeForm(d.home || {});
      setAboutForm(d.about || {});
      setServicesList(d.services || []);
      setProductsList(d.products || []);
      setSuppliersList(d.suppliers || []);
      setGalleryList(d.gallery || []);
      setSeoList(d.seo || []);

      // 2. Fetch messages & media
      let msgs = [];
      let media = [];
      let history = [];
      try { msgs = await getMessages(); } catch(e) {}
      try { media = await getMediaList(); } catch(e) {}
      try { history = await getHistory(); } catch(e) {}
      setMessages(msgs);
      setMediaList(media);
      setChangeHistory(history);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Error loading admin data", err);
      // Fallback
      setSiteData(DEFAULT_SITE_DATA);
      setSettingsForm(DEFAULT_SITE_DATA.settings || {});
      setHomeForm(DEFAULT_SITE_DATA.home || {});
      setAboutForm(DEFAULT_SITE_DATA.about || {});
      setServicesList(DEFAULT_SITE_DATA.services || []);
      setProductsList(DEFAULT_SITE_DATA.products || []);
      setIsLoggedIn(true);
    } finally {
      setDataLoading(false);
    }
  };

  // Check login on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/auth_check.php`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setIsLoggedIn(true);
            fetchAllData();
            return;
          }
        }
      } catch (e) {}
      setIsLoggedIn(false);
    };
    checkAuth();
  }, []);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`${API_BASE}/api/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Autenticação efetuada com sucesso!");
        setIsLoggedIn(true);
        fetchAllData();
      } else {
        setAuthError(data.error || "Credenciais incorretas.");
      }
    } catch (err) {
      setAuthError("Erro na ligação ao servidor.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout.php`, { credentials: 'include' });
    } catch (e) {}
    setIsLoggedIn(false);
    showAlert("success", "Sessão terminada.");
  };

  // Global Actions
  const handlePublish = async () => {
    setActionLoading("publish");
    try {
      const res = await publishChanges();
      if (res.success) {
        showAlert("success", "Alterações publicadas em produção com sucesso!");
        // reload history
        const h = await getHistory();
        setChangeHistory(h);
      } else {
        showAlert("error", "Erro ao publicar alterações.");
      }
    } catch (err: any) {
      showAlert("error", err.message || "Erro de rede ao publicar.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("settings");
    try {
      await saveSettings(settingsForm);
      showAlert("success", "Configurações guardadas no rascunho!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar configurações.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("home");
    try {
      await saveHome(homeForm);
      showAlert("success", "Dados da Página Inicial guardados no rascunho!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("about");
    try {
      await saveAbout(aboutForm);
      showAlert("success", "Dados institucionais da página Sobre guardados!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar.");
    } finally {
      setActionLoading(null);
    }
  };

  // Services
  const handleEditServiceClick = (svc: any) => {
    setEditingService(svc);
    // Encontrar página de serviço relacionada
    const page = siteData?.service_pages?.find((p: any) => p.service_id === svc.id) || {};
    setServicePageForm({
      page_title: page.page_title || svc.title,
      impact_phrase: page.impact_phrase || svc.slogan || "",
      full_description: page.full_description || svc.description || "",
      applications: Array.isArray(page.applications) ? page.applications : [],
      related_products: Array.isArray(page.related_products) ? page.related_products : [],
      benefits: Array.isArray(page.benefits) ? page.benefits : [],
      work_process: Array.isArray(page.work_process) ? page.work_process : [],
      gallery_images: Array.isArray(page.gallery_images) ? page.gallery_images : [],
      final_cta_title: page.final_cta_title || "",
      final_cta_text: page.final_cta_text || "",
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      seo_keywords: page.seo_keywords || ""
    });
  };

  const handleSaveServiceFull = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setActionLoading("service");
    try {
      // 1. Salvar informações básicas
      const svcRes = await saveService({ ...editingService, action: "save" });
      const currentId = editingService.id || svcRes.data?.id;

      // 2. Salvar página de detalhes do serviço
      if (currentId) {
        await saveServicePage({
          ...servicePageForm,
          service_id: currentId
        });
      }
      
      showAlert("success", "Serviço e página de conteúdo guardados com sucesso!");
      setEditingService(null);
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar serviço.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Tem a certeza que deseja eliminar este serviço e a sua página associada? Todos os produtos vinculados perderão a relação.")) return;
    setActionLoading(`delete_svc_${id}`);
    try {
      await saveService({ id, action: "delete" });
      showAlert("success", "Serviço eliminado!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao eliminar.");
    } finally {
      setActionLoading(null);
    }
  };

  // Products
  const handleEditProductClick = (prod: any) => {
    setEditingProduct({
      id: prod.id,
      name: prod.name,
      model: prod.model || "",
      category: prod.category || "",
      brand: prod.brand || "",
      short_description: prod.short_description || "",
      description: prod.description || "",
      image: prod.image || "",
      gallery: Array.isArray(prod.gallery) ? prod.gallery : [],
      video: prod.video || "",
      features: Array.isArray(prod.features) ? prod.features : [],
      benefits: Array.isArray(prod.benefits) ? prod.benefits : [],
      service_id: prod.service_id || "",
      display_order: prod.display_order || 0,
      is_active: prod.is_active ?? 1,
      is_featured: prod.is_featured ?? 0
    });
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setActionLoading("product");
    try {
      await saveProduct(editingProduct);
      showAlert("success", "Produto guardado no rascunho com sucesso!");
      setEditingProduct(null);
      setNewProductModal(false);
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar produto.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este produto?")) return;
    setActionLoading(`delete_prod_${id}`);
    try {
      await deleteProduct(id);
      showAlert("success", "Produto eliminado!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao eliminar.");
    } finally {
      setActionLoading(null);
    }
  };

  // Media Library Upload/Delete
  const handleUploadMediaFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadProgress("A carregar ficheiro...");
    try {
      const url = await uploadMedia(file);
      showAlert("success", "Upload efetuado com sucesso!");
      const media = await getMediaList();
      setMediaList(media);
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao fazer upload.");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDeleteMediaFile = async (id: string) => {
    const usages = getMediaUsage(id, siteData);
    if (usages.length > 0) {
      if (!confirm(`Este ficheiro está a ser utilizado em:\n- ${usages.join("\n- ")}\n\nTem a certeza que deseja eliminar mesmo assim?`)) {
        return;
      }
    } else {
      if (!confirm("Tem a certeza que deseja eliminar esta mídia do servidor?")) {
        return;
      }
    }
    
    setActionLoading(`delete_media_${id}`);
    try {
      await deleteMedia(id);
      showAlert("success", "Ficheiro eliminado do servidor!");
      const media = await getMediaList();
      setMediaList(media);
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao eliminar ficheiro.");
    } finally {
      setActionLoading(null);
    }
  };

  // Media Selector Helper
  const openMediaSelector = (form: string, field: string, index?: number) => {
    setMediaSelectorTarget({ form, field, index });
    setMediaSelectorOpen(true);
  };

  const selectMediaFromLibrary = (url: string) => {
    if (!mediaSelectorTarget) return;
    const { form, field, index } = mediaSelectorTarget;

    if (form === "settings") {
      setSettingsForm({ ...settingsForm, [field]: url });
    } else if (form === "home") {
      setHomeForm({ ...homeForm, [field]: url });
    } else if (form === "about") {
      setAboutForm({ ...aboutForm, [field]: url });
    } else if (form === "service") {
      setEditingService({ ...editingService, [field]: url });
    } else if (form === "servicePage") {
      if (field === "gallery_images" && typeof index === "number") {
        const copy = [...servicePageForm.gallery_images];
        copy[index] = url;
        setServicePageForm({ ...servicePageForm, gallery_images: copy });
      } else if (field === "gallery_images_add") {
        setServicePageForm({
          ...servicePageForm,
          gallery_images: [...servicePageForm.gallery_images, url]
        });
      } else {
        setServicePageForm({ ...servicePageForm, [field]: url });
      }
    } else if (form === "product") {
      if (field === "gallery" && typeof index === "number") {
        const copy = [...editingProduct.gallery];
        copy[index] = url;
        setEditingProduct({ ...editingProduct, gallery: copy });
      } else if (field === "gallery_add") {
        setEditingProduct({
          ...editingProduct,
          gallery: [...editingProduct.gallery, url]
        });
      } else {
        setEditingProduct({ ...editingProduct, [field]: url });
      }
    } else if (form === "supplier") {
      setEditingSupplier({ ...editingSupplier, [field]: url });
    } else if (form === "galleryItem") {
      setEditingGallery({ ...editingGallery, [field]: url });
    } else if (form === "seo") {
      setEditingSeo({ ...editingSeo, [field]: url });
    }

    setMediaSelectorOpen(false);
    setMediaSelectorTarget(null);
  };

  // Suppliers & Gallery Save/Delete
  const handleSaveSupplierForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    setActionLoading("supplier");
    try {
      await saveSupplier(editingSupplier);
      showAlert("success", "Fornecedor guardado!");
      setEditingSupplier(null);
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar fornecedor.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    if (!confirm("Deseja eliminar este fornecedor?")) return;
    setActionLoading(`delete_sup_${id}`);
    try {
      await saveSupplier({ id, action: "delete" });
      showAlert("success", "Fornecedor eliminado!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao eliminar.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveGalleryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    setActionLoading("gallery");
    try {
      await saveGallery(editingGallery);
      showAlert("success", "Item de galeria guardado!");
      setEditingGallery(null);
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao guardar.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Deseja eliminar este item da galeria?")) return;
    setActionLoading(`delete_gal_${id}`);
    try {
      await saveGallery({ id, action: "delete" });
      showAlert("success", "Item eliminado!");
      fetchAllData();
    } catch (err: any) {
      showAlert("error", err.message || "Erro ao eliminar.");
    } finally {
      setActionLoading(null);
    }
  };

  // Message Actions
  const handleMessageStatus = async (id: number, status: string) => {
    setActionLoading(`msg_status_${id}`);
    try {
      await updateMessageStatus(id, status);
      showAlert("success", "Estado da mensagem atualizado!");
      const msgs = await getMessages();
      setMessages(msgs);
    } catch (e) {
      showAlert("error", "Erro ao atualizar estado.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Deseja eliminar esta mensagem permanentemente?")) return;
    setActionLoading(`msg_delete_${id}`);
    try {
      await deleteMessage(id);
      showAlert("success", "Mensagem eliminada!");
      const msgs = await getMessages();
      setMessages(msgs);
    } catch (e) {
      showAlert("error", "Erro ao eliminar mensagem.");
    } finally {
      setActionLoading(null);
    }
  };

  // Change Password Action
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showAlert("error", "As palavras-passe não coincidem.");
      return;
    }
    setActionLoading("password");
    try {
      const res = await fetch(`${API_BASE}/api/admin/change_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          current_password: currentPassword,
          new_password: newPassword
        }),
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Credenciais de acesso atualizadas com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setNewUsername("");
      } else {
        showAlert("error", data.error || "Erro ao atualizar credenciais.");
      }
    } catch (e) {
      showAlert("error", "Erro de ligação ao servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  // Resolves local/remote media URL for display in admin panel
  const resolveMediaUrl = (url: string | undefined, defaultUrl: string = "/images/logo.png") => {
    if (!url) return defaultUrl;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanUrl = url.replace(/^\//, '');
    if (API_BASE) {
      return `${API_BASE}/${cleanUrl}`;
    }
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}${cleanUrl}`;
  };

  // Render Login Screen if not authenticated
  if (isLoggedIn === false) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 font-sans selection:bg-[#D4AF37] selection:text-black">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#C9A227]/3 blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-[#111] border border-gray-900 rounded-xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-display font-extrabold text-white text-2xl tracking-widest notranslate" translate="no">COTTON DOME</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mt-1">Portal de Gestão de Conteúdo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded text-center">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-2">Utilizador / E-mail</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="suporte@domme.pt"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-2">Palavra-passe</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-xs uppercase tracking-widest py-3.5 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.15)]"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Aceder ao Painel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-900 pt-6">
            <button
              onClick={() => onNavigate("/")}
              className="text-xs text-gray-500 hover:text-white transition cursor-pointer"
            >
              Voltar ao Site Público
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading indicator on first entry
  if (isLoggedIn === null || !siteData) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center font-mono text-[#D4AF37] gap-3">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="text-xs uppercase tracking-widest">A carregar segurança e base de dados...</span>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER MODO PREVIEW INTEGRADO (Desktop / Tablet / Mobile)
  // ─────────────────────────────────────────────────────────────
  if (previewMode !== null) {
    const isMobile = previewMode === "mobile";
    const isTablet = previewMode === "tablet";
    const isDesktop = previewMode === "desktop";

    let frameWidth = "w-full";
    if (isTablet) frameWidth = "max-w-[768px] border-[12px] border-gray-800 rounded-3xl";
    if (isMobile) frameWidth = "max-w-[375px] border-[12px] border-gray-800 rounded-[36px]";

    const mockNavigate = (path: string) => {
      setPreviewPath(path);
    };

    return (
      <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex flex-col relative z-50 selection:bg-[#D4AF37] selection:text-black">
        {/* Preview Control Header */}
        <header className="bg-[#111] border-b border-gray-900 px-6 py-3 flex flex-wrap items-center justify-between gap-4 relative z-55 shadow-md">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-extrabold text-white text-sm tracking-widest uppercase">Cotton Dome</h2>
            <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[9px] font-bold uppercase tracking-wider">
              Preview Mode (Rascunho)
            </span>
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-1 bg-[#161616] p-1 border border-gray-800 rounded-lg">
            <button 
              onClick={() => setPreviewMode("desktop")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${isDesktop ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}
            >
              Desktop
            </button>
            <button 
              onClick={() => setPreviewMode("tablet")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${isTablet ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}
            >
              Tablet
            </button>
            <button 
              onClick={() => setPreviewMode("mobile")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer ${isMobile ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white"}`}
            >
              Mobile
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPreviewPath("/")}
              className="px-3 py-1.5 bg-black/40 border border-gray-800 rounded text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
            >
              Voltar à Home
            </button>
            <button 
              onClick={() => setPreviewMode(null)}
              className="px-4 py-1.5 bg-red-950/60 border border-red-800 hover:bg-red-900 rounded text-xs font-bold uppercase tracking-wider text-red-200 transition cursor-pointer"
            >
              Fechar Preview
            </button>
          </div>
        </header>

        {/* Frame Area */}
        <div className="flex-1 bg-[#050505] p-6 flex items-center justify-center overflow-y-auto">
          <div className={`bg-[#050505] h-full ${frameWidth} transition-all duration-300 shadow-2xl relative overflow-y-auto flex flex-col`} style={{ minHeight: isDesktop ? "auto" : "800px" }}>
            {/* Header público do site */}
            <Header
              logo={siteData.settings?.logo}
              onQuoteClick={() => {
                setPreviewPath("/#contacto");
                setTimeout(() => {
                  const el = document.getElementById("contacto");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              onNavigate={mockNavigate}
              currentPath={previewPath}
              lang="pt" // preview em PT
            />

            {previewPath.startsWith("/servicos/") ? (
              <ServiceDetail 
                slug={previewPath.replace("/servicos/", "")} 
                onNavigate={mockNavigate}
                services={siteData.services}
                pages={siteData.service_pages}
                lang="pt"
                products={siteData.products}
              />
            ) : (
              <main className="flex-1">
                <Hero
                  content={siteData.home}
                  onQuoteClick={() => {
                    const el = document.getElementById("contacto");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  onExploreClick={() => {
                    const el = document.getElementById("solucoes");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  lang="pt"
                />
                
                {/* Pilares */}
                <Pilares lang="pt" />
                
                {/* Serviços listados */}
                <Solutions 
                  onNavigate={mockNavigate}
                  services={siteData.services}
                  lang="pt"
                />
                
                {/* Enquadramentos */}
                <Environments lang="pt" />
                
                {/* Outlet com produtos dinâmicos */}
                <PromoOutlet 
                  onNavigate={mockNavigate}
                  onSelectService={() => {}}
                  lang="pt"
                  products={siteData.products}
                />
                
                {/* Metodologia */}
                <HowWeWork lang="pt" />
                
                {/* Projetos */}
                <Projects 
                  gallery={siteData.gallery}
                  lang="pt"
                />
                
                {/* Slogan */}
                <HeroQuote onTalkClick={() => {}} lang="pt" />
                
                {/* Sobre Nós */}
                <About 
                  content={siteData.about}
                  lang="pt"
                />
                
                {/* Contactos / Formulário */}
                <ContactForm
                  selectedService=""
                  onClearService={() => {}}
                  settings={siteData.settings}
                  services={siteData.services}
                  lang="pt"
                />
              </main>
            )}

            {/* Rodapé público */}
            <Footer 
              onNavigate={mockNavigate}
              settings={siteData.settings}
              lang="pt"
            />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER LAYOUT CENTRAL DO PAINEL ADMINISTRATIVO
  // ─────────────────────────────────────────────────────────────
  
  // Menu tab items definition
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "site", label: "Site / Geral", icon: Settings },
    { id: "home", label: "Página Inicial", icon: HomeIcon },
    { id: "about", label: "Sobre Nós", icon: Users },
    { id: "services", label: "Serviços", icon: Cpu },
    { id: "products", label: "Produtos", icon: Shield },
    { id: "suppliers", label: "Fornecedores", icon: List },
    { id: "gallery", label: "Projetos / Galeria", icon: ImageIcon },
    { id: "contactos", label: "Contactos", icon: Phone },
    { id: "messages", label: "Mensagens", icon: MessageSquare, badge: messages.filter(m => m.status === 'new').length },
    { id: "media", label: "Biblioteca de Mídia", icon: ImageIcon },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "users", label: "Utilizadores", icon: Users },
    { id: "settings", label: "Configurações", icon: Database },
    { id: "history", label: "Histórico", icon: List }
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-gray-300 font-sans flex flex-col lg:flex-row relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* Alert toast notification */}
      {alert && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded border shadow-2xl flex items-center gap-3.5 animate-bounce ${
          alert.type === "success" 
            ? "bg-green-950/90 border-green-800 text-green-200" 
            : "bg-red-950/90 border-red-800 text-red-200"
        }`}>
          {alert.type === "success" ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
          <span className="text-sm font-semibold">{alert.message}</span>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden w-full bg-[#111] border-b border-gray-900 px-6 py-4 flex items-center justify-between relative z-45">
        <h1 className="font-display font-extrabold text-white text-sm tracking-widest notranslate" translate="no">COTTON DOME</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setPreviewMode("desktop")}
            className="p-2 text-gray-400 hover:text-white"
            title="Pré-visualizar Alterações"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 text-[#D4AF37] hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop & Drawer Mobile) */}
      <aside className={`fixed lg:relative top-0 bottom-0 left-0 w-64 bg-[#111] border-r border-gray-900 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-6 border-b border-gray-900 hidden lg:flex flex-col">
          <h1 className="font-display font-extrabold text-white text-base tracking-widest notranslate" translate="no">Cotton Dome</h1>
          <p className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mt-0.5">Truth Engine CMS</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                  setSearchTerm("");
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded font-medium text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[#D4AF37] text-black font-bold" 
                    : "text-gray-400 hover:bg-[#161616] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ${
                    isActive ? "bg-black text-[#D4AF37]" : "bg-red-600 text-white animate-pulse"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-900 bg-black/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">User: <strong className="text-gray-300">admin</strong></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 transition uppercase font-bold text-[9px] tracking-wider cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        ></div>
      )}

      {/* MAIN MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER BAR FOR ACTIONS AND STATUS */}
        <header className="bg-[#111] border-b border-gray-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-30 shadow">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            {dataLoading && (
              <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Atualizar...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Visualizar Site */}
            <a 
              href="/" 
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visualizar Site</span>
            </a>

            {/* Pré-visualizar Rascunho */}
            <button
              onClick={() => setPreviewMode("desktop")}
              className="px-3 py-1.5 bg-[#161616] hover:bg-[#222] border border-[#D4AF37]/35 rounded text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pré-visualizar</span>
            </button>

            {/* Publicar Alterações */}
            <button
              onClick={handlePublish}
              disabled={actionLoading === "publish"}
              className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(212,175,55,0.15)]"
            >
              {actionLoading === "publish" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CloudLightning className="w-3.5 h-3.5" />
              )}
              <span>Publicar Alterações</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 bg-[#080808] p-6 lg:p-10 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Metrics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-[#111] border border-gray-900 p-6 rounded-lg hover:border-[#D4AF37]/30 transition duration-300">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Novas Mensagens</span>
                  <span className="text-3xl font-extrabold text-white">{messages.filter(m => m.status === 'new').length}</span>
                  <span className="block text-[10px] text-gray-400 mt-2">de um total de <strong className="text-gray-300">{messages.length}</strong></span>
                </div>

                <div className="bg-[#111] border border-gray-900 p-6 rounded-lg hover:border-[#D4AF37]/30 transition duration-300">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Serviços Disponíveis</span>
                  <span className="text-3xl font-extrabold text-white">{servicesList.length}</span>
                  <span className="block text-[10px] text-gray-400 mt-2">Ativos no site público: <strong className="text-green-500">{servicesList.filter(s => s.is_active === 1).length}</strong></span>
                </div>

                <div className="bg-[#111] border border-gray-900 p-6 rounded-lg hover:border-[#D4AF37]/30 transition duration-300">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Produtos Cadastrados</span>
                  <span className="text-3xl font-extrabold text-white">{productsList.length}</span>
                  <span className="block text-[10px] text-gray-400 mt-2">Destaques no Outlet: <strong className="text-[#D4AF37]">{productsList.filter(p => p.is_featured === 1).length}</strong></span>
                </div>

                <div className="bg-[#111] border border-gray-900 p-6 rounded-lg hover:border-[#D4AF37]/30 transition duration-300">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Imagens e Vídeos</span>
                  <span className="text-3xl font-extrabold text-white">{mediaList.length}</span>
                  <span className="block text-[10px] text-gray-400 mt-2">Mídias carregadas no servidor</span>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-[#111] border border-gray-900 p-8 rounded-lg">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 border-b border-gray-900 pb-3">Atalhos Rápidos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button onClick={() => setActiveTab("home")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Editar Página Inicial</button>
                  <button onClick={() => { setEditingProduct({ id: "", features: [], benefits: [], gallery: [], is_active: 1, is_featured: 0 }); setNewProductModal(true); setActiveTab("products"); }} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Adicionar Produto</button>
                  <button onClick={() => setActiveTab("services")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Gerir Serviços</button>
                  <button onClick={() => setActiveTab("media")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Carregar Imagem</button>
                  <button onClick={() => setActiveTab("contactos")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Editar Contactos</button>
                  <button onClick={() => setActiveTab("messages")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-gray-300">Ver Mensagens</button>
                  <button onClick={() => setPreviewMode("desktop")} className="p-4 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-center transition cursor-pointer text-xs font-semibold text-[#D4AF37]">Pré-visualizar Site</button>
                  <button onClick={handlePublish} className="p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/35 rounded text-center transition cursor-pointer text-xs font-bold text-[#D4AF37]">Publicar Alterações</button>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="bg-[#111] border border-gray-900 p-8 rounded-lg">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 border-b border-gray-900 pb-3">Atualizações Recentes (Histórico)</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {changeHistory.slice(0, 5).map((log, idx) => (
                      <li key={log.id}>
                        <div className="relative pb-8">
                          {idx !== changeHistory.slice(0, 5).length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-900" aria-hidden="true"></span>
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-[#161616] border border-gray-800 flex items-center justify-center ring-8 ring-[#111]">
                                <RefreshCw className="h-4.5 w-4.5 text-[#D4AF37]" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-xs text-gray-300">
                                  <strong className="text-white font-medium">{log.user}</strong> {log.content}
                                </p>
                              </div>
                              <div className="text-right text-[10px] whitespace-nowrap text-gray-500 font-mono">
                                <span>{log.date} @ {log.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    {changeHistory.length === 0 && (
                      <p className="text-xs text-gray-500 font-mono py-4 text-center">Nenhum registo no histórico de alterações.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SITE / CONFIGURAÇÕES GERAIS */}
          {activeTab === "site" && (
            <form onSubmit={handleSaveSettings} className="space-y-8 bg-[#111] border border-gray-900 p-8 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-2 mb-4">Informações Gerais</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Nome da Empresa</label>
                      <input 
                        type="text" 
                        value={settingsForm.company_name || ""} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Slogan / Tagline</label>
                      <input 
                        type="text" 
                        value={settingsForm.tagline || ""} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">NIF</label>
                      <input 
                        type="text" 
                        value={settingsForm.nif || ""} 
                        onChange={(e) => setSettingsForm({ ...settingsForm, nif: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Favicon (.ico, .png)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={settingsForm.favicon || ""} 
                          onChange={(e) => setSettingsForm({ ...settingsForm, favicon: e.target.value })}
                          className="flex-1 bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                        <button type="button" onClick={() => openMediaSelector("settings", "favicon")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-2 mb-4">Logotipos</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Logotipo Principal</label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            value={settingsForm.logo || ""} 
                            onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                            className="flex-1 bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                          <button type="button" onClick={() => openMediaSelector("settings", "logo")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                        </div>
                        {settingsForm.logo && (
                          <img src={resolveMediaUrl(settingsForm.logo)} alt="Logo" className="h-10 w-auto object-contain bg-black p-1 border border-gray-800" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Logotipo Alternativo</label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            value={settingsForm.logo_alt || ""} 
                            onChange={(e) => setSettingsForm({ ...settingsForm, logo_alt: e.target.value })}
                            className="flex-1 bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                          <button type="button" onClick={() => openMediaSelector("settings", "logo_alt")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                        </div>
                        {settingsForm.logo_alt && (
                          <img src={resolveMediaUrl(settingsForm.logo_alt)} alt="Logo Alt" className="h-10 w-auto object-contain bg-black p-1 border border-gray-800" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-2 mb-4">Redes Sociais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Instagram</label>
                    <input 
                      type="text" 
                      value={settingsForm.social_instagram || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_instagram: e.target.value })}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Facebook</label>
                    <input 
                      type="text" 
                      value={settingsForm.social_facebook || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">LinkedIn</label>
                    <input 
                      type="text" 
                      value={settingsForm.social_linkedin || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_linkedin: e.target.value })}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">YouTube</label>
                    <input 
                      type="text" 
                      value={settingsForm.social_youtube || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_youtube: e.target.value })}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-2 mb-4">Rodapé</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Texto Institucional do Rodapé</label>
                    <textarea 
                      value={settingsForm.footer_text || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                      rows={4}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Texto de Copyright</label>
                    <textarea 
                      value={settingsForm.copyright_text || ""} 
                      onChange={(e) => setSettingsForm({ ...settingsForm, copyright_text: e.target.value })}
                      rows={4}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading === "settings"}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                >
                  {actionLoading === "settings" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Guardar Rascunho</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: PÁGINA INICIAL */}
          {activeTab === "home" && (
            <div className="space-y-8">
              <form onSubmit={handleSaveHome} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-8">
                
                {/* Hero Section */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-2 mb-4">Secção Hero (Destaque Principal)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título Principal</label>
                        <input 
                          type="text" 
                          value={homeForm.hero_title || ""} 
                          onChange={(e) => setHomeForm({ ...homeForm, hero_title: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Subtítulo / Descrição</label>
                        <textarea 
                          value={homeForm.hero_subtitle || ""} 
                          onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle: e.target.value })}
                          rows={4}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Botão Principal</label>
                          <input 
                            type="text" 
                            value={homeForm.primary_button_text || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, primary_button_text: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Link do Botão Principal</label>
                          <input 
                            type="text" 
                            value={homeForm.primary_button_link || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, primary_button_link: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Botão Secundário</label>
                          <input 
                            type="text" 
                            value={homeForm.secondary_button_text || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, secondary_button_text: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Link do Botão Secundário</label>
                          <input 
                            type="text" 
                            value={homeForm.secondary_button_link || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, secondary_button_link: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem de Fundo (ou Fallback)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={homeForm.hero_image || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, hero_image: e.target.value })}
                            className="flex-1 bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                          <button type="button" onClick={() => openMediaSelector("home", "hero_image")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Vídeo de Fundo (.mp4)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={homeForm.hero_video || ""} 
                            onChange={(e) => setHomeForm({ ...homeForm, hero_video: e.target.value })}
                            className="flex-1 bg-[#161616] border border-gray-850 border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                          <button type="button" onClick={() => openMediaSelector("home", "hero_video")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ativar Vídeo</label>
                          <select
                            value={homeForm.hero_video_active !== undefined ? String(homeForm.hero_video_active) : "true"}
                            onChange={(e) => setHomeForm({ ...homeForm, hero_video_active: e.target.value === "true" })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value="true">Sim (Vídeo Ativo)</option>
                            <option value="false">Não (Usar apenas Imagem)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Alinhamento de Conteúdo</label>
                          <select
                            value={homeForm.hero_align || "left"}
                            onChange={(e) => setHomeForm({ ...homeForm, hero_align: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value="left">Esquerda (Padrão)</option>
                            <option value="center">Centralizado</option>
                            <option value="right">Direita</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-950 pt-6">
                  <button
                    type="submit"
                    disabled={actionLoading === "home"}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                  >
                    {actionLoading === "home" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Guardar Rascunho</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SOBRE NÓS */}
          {activeTab === "about" && (
            <form onSubmit={handleSaveAbout} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título da Secção</label>
                    <input 
                      type="text" 
                      value={aboutForm.title || ""} 
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Curta / Apresentação</label>
                    <textarea 
                      value={aboutForm.description || ""} 
                      onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                      rows={5}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Anos Experiência</label>
                      <input 
                        type="text" 
                        value={aboutForm.years || ""} 
                        onChange={(e) => setAboutForm({ ...aboutForm, years: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Clientes Satisfeitos</label>
                      <input 
                        type="text" 
                        value={aboutForm.clients || ""} 
                        onChange={(e) => setAboutForm({ ...aboutForm, clients: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Projetos Executados</label>
                      <input 
                        type="text" 
                        value={aboutForm.projects || ""} 
                        onChange={(e) => setAboutForm({ ...aboutForm, projects: e.target.value })}
                        className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Missão</label>
                    <textarea 
                      value={aboutForm.mission || ""} 
                      onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                      rows={3}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Visão</label>
                    <textarea 
                      value={aboutForm.vision || ""} 
                      onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                      rows={3}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Valores</label>
                    <textarea 
                      value={aboutForm.values || ""} 
                      onChange={(e) => setAboutForm({ ...aboutForm, values: e.target.value })}
                      rows={3}
                      className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem Lateral</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aboutForm.image || ""} 
                        onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                        className="flex-1 bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                      />
                      <button type="button" onClick={() => openMediaSelector("about", "image")} className="px-3 bg-gray-905 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer">Escolher</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading === "about"}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                >
                  {actionLoading === "about" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Guardar Rascunho</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: SERVIÇOS (UNIFICADO) */}
          {activeTab === "services" && (
            <div className="space-y-6">
              
              {!editingService ? (
                <>
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                    <div className="relative max-w-md w-full">
                      <input 
                        type="text" 
                        placeholder="Pesquisar serviços..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-gray-900 rounded pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    </div>
                    <button
                      onClick={() => {
                        setEditingService({ id: 0, title: "", slug: "", icon: "Shield", is_active: 1, display_order: 1 });
                        setServicePageForm({
                          page_title: "", impact_phrase: "", full_description: "",
                          applications: [], related_products: [], benefits: [], work_process: [],
                          gallery_images: [], final_cta_title: "", final_cta_text: "",
                          seo_title: "", seo_description: "", seo_keywords: ""
                        });
                      }}
                      className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Novo Serviço</span>
                    </button>
                  </div>

                  {/* Services List Table */}
                  <div className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-300 font-sans border-collapse">
                        <thead className="bg-[#161616] text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-gray-900">
                          <tr>
                            <th className="p-4">Serviço</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-center">Ícone</th>
                            <th className="p-4 text-center">Ordem</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-950">
                          {servicesList
                            .filter(svc => svc.title.toLowerCase().includes(searchTerm.toLowerCase()) || svc.slug.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((svc) => (
                              <tr key={svc.id} className="hover:bg-[#161616]/40 transition duration-150">
                                <td className="p-4 font-semibold text-white">
                                  <div className="flex items-center gap-3">
                                    {svc.image ? (
                                      <img src={resolveMediaUrl(svc.image)} alt={svc.title} className="w-10 h-10 rounded object-cover border border-gray-800" />
                                    ) : (
                                      <div className="w-10 h-10 bg-black/40 border border-gray-800 flex items-center justify-center rounded"><ImageIcon className="w-4 h-4 text-gray-600" /></div>
                                    )}
                                    <span>{svc.title}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-gray-500 font-mono">{svc.slug}</td>
                                <td className="p-4 text-center font-mono text-gray-400">{svc.icon}</td>
                                <td className="p-4 text-center font-bold text-[#D4AF37]">{svc.display_order ?? 0}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    svc.is_active === 1 || svc.active === true
                                      ? "bg-green-950/40 text-green-400 border border-green-900" 
                                      : "bg-red-950/40 text-red-400 border border-red-900"
                                  }`}>
                                    {svc.is_active === 1 || svc.active === true ? "Ativo" : "Inativo"}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                  <button
                                    onClick={() => handleEditServiceClick(svc)}
                                    className="p-1.5 bg-gray-900 hover:bg-[#D4AF37] hover:text-black rounded border border-gray-800 text-gray-400 transition cursor-pointer"
                                    title="Editar Serviço"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(svc.id)}
                                    disabled={actionLoading === `delete_svc_${svc.id}`}
                                    className="p-1.5 bg-gray-900 hover:bg-red-700 hover:text-white rounded border border-gray-800 text-red-400 transition cursor-pointer"
                                    title="Eliminar Serviço"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                // EDITING / ADDING NEW SERVICE (UNIFIED FORM)
                <form onSubmit={handleSaveServiceFull} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                      {editingService.id === 0 ? "Adicionar Novo Serviço" : `Editar Serviço: ${editingService.title}`}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setEditingService(null)}
                      className="text-gray-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  {/* Service Abas Internas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Básico e Organização */}
                    <div className="space-y-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-[#D4AF37] pl-2 mb-3">Informações Básicas</h4>
                      
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título do Serviço</label>
                        <input 
                          type="text" 
                          required
                          value={editingService.title || ""} 
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Slug da URL</label>
                        <input 
                          type="text" 
                          required
                          value={editingService.slug || ""} 
                          onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ícone Lucide</label>
                          <input 
                            type="text" 
                            value={editingService.icon || "Shield"} 
                            onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ordem Exibição</label>
                          <input 
                            type="number" 
                            value={editingService.display_order ?? 0} 
                            onChange={(e) => setEditingService({ ...editingService, display_order: parseInt(e.target.value) })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem Destaque</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={editingService.image || ""} 
                              onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                              className="flex-1 bg-[#161616] border border-gray-800 rounded px-3 py-2 text-white text-xs focus:outline-none"
                            />
                            <button type="button" onClick={() => openMediaSelector("service", "image")} className="px-2 bg-gray-900 border border-gray-800 text-white rounded text-xs cursor-pointer">Definir</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ativo / Publicado</label>
                          <select 
                            value={editingService.is_active ?? 1} 
                            onChange={(e) => setEditingService({ ...editingService, is_active: parseInt(e.target.value) })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value={1}>Ativo (Exibir no Site)</option>
                            <option value={0}>Inativo (Rascunho oculto)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Curta (Cards da Home)</label>
                        <textarea 
                          value={editingService.short_description || ""} 
                          onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })}
                          rows={3}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Conteúdo de Página */}
                    <div className="space-y-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white border-l-2 border-[#D4AF37] pl-2 mb-3">Conteúdo Detalhado da Página</h4>
                      
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título Completo da Página</label>
                        <input 
                          type="text" 
                          value={servicePageForm.page_title || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, page_title: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Frase de Impacto (Hero)</label>
                        <input 
                          type="text" 
                          value={servicePageForm.impact_phrase || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, impact_phrase: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Completa</label>
                        <textarea 
                          value={servicePageForm.full_description || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, full_description: e.target.value })}
                          rows={6}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA e SEO local do serviço */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-955 pt-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Chamada para Ação (CTA)</h4>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título do CTA</label>
                        <input 
                          type="text" 
                          value={servicePageForm.final_cta_title || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, final_cta_title: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Texto do CTA</label>
                        <textarea 
                          value={servicePageForm.final_cta_text || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, final_cta_text: e.target.value })}
                          rows={2}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">SEO Configurações</h4>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">SEO Title</label>
                        <input 
                          type="text" 
                          value={servicePageForm.seo_title || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, seo_title: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Meta Description</label>
                        <input 
                          type="text" 
                          value={servicePageForm.seo_description || ""} 
                          onChange={(e) => setServicePageForm({ ...servicePageForm, seo_description: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-955 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setEditingService(null)}
                      className="px-5 py-3 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-xs font-bold uppercase text-gray-400 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading === "service"}
                      className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                    >
                      {actionLoading === "service" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Guardar Rascunho</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: PRODUTOS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {!editingProduct ? (
                <>
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-4 font-sans">
                    <div className="relative max-w-md w-full">
                      <input 
                        type="text" 
                        placeholder="Pesquisar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111] border border-gray-900 rounded pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition font-sans"
                      />
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    </div>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: "aj-prod-" + Date.now().toString().slice(-4),
                          name: "",
                          model: "",
                          category: "",
                          brand: "Ajax",
                          short_description: "",
                          description: "",
                          image: "",
                          gallery: [],
                          video: "",
                          features: [],
                          benefits: [],
                          service_id: servicesList[0]?.slug || "",
                          display_order: 1,
                          is_active: 1,
                          is_featured: 0
                        });
                      }}
                      className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Novo Produto</span>
                    </button>
                  </div>

                  {/* Products Grid / Table */}
                  <div className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden font-sans">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-300 border-collapse">
                        <thead className="bg-[#161616] text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-gray-900">
                          <tr>
                            <th className="p-4">Produto</th>
                            <th className="p-4">Modelo</th>
                            <th className="p-4">Marca</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4">Serviço Relacionado</th>
                            <th className="p-4 text-center">Destaque</th>
                            <th className="p-4 text-center">Estado</th>
                            <th className="p-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-955">
                          {productsList
                            .filter(prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.model?.toLowerCase().includes(searchTerm.toLowerCase()) || prod.category?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((prod) => {
                              const relatedSvc = servicesList.find(s => s.id === prod.service_id || s.slug === prod.service_id);
                              return (
                                <tr key={prod.id} className="hover:bg-[#161616]/40 transition duration-150">
                                  <td className="p-4 font-semibold text-white">
                                    <div className="flex items-center gap-3">
                                      {prod.image ? (
                                        <img src={resolveMediaUrl(prod.image)} alt={prod.name} className="w-10 h-10 rounded object-contain bg-black border border-gray-800" />
                                      ) : (
                                        <div className="w-10 h-10 bg-black/40 border border-gray-800 flex items-center justify-center rounded"><ImageIcon className="w-4 h-4 text-gray-600" /></div>
                                      )}
                                      <span>{prod.name}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-gray-400">{prod.model || "-"}</td>
                                  <td className="p-4 text-gray-500 font-mono">{prod.brand || "Ajax"}</td>
                                  <td className="p-4 text-gray-400">{prod.category || "-"}</td>
                                  <td className="p-4 text-[#D4AF37] font-semibold">{relatedSvc ? relatedSvc.title : (prod.service_id || "-")}</td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                      prod.is_featured === 1 
                                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/45" 
                                        : "bg-gray-900 text-gray-500"
                                    }`}>
                                      {prod.is_featured === 1 ? "Outlet" : "Normal"}
                                    </span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      prod.is_active === 1 
                                        ? "bg-green-950/40 text-green-400 border border-green-900" 
                                        : "bg-red-950/40 text-red-400 border border-red-900"
                                    }`}>
                                      {prod.is_active === 1 ? "Ativo" : "Inativo"}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                                    <button
                                      onClick={() => handleEditProductClick(prod)}
                                      className="p-1.5 bg-gray-900 hover:bg-[#D4AF37] hover:text-black rounded border border-gray-800 text-gray-400 transition cursor-pointer"
                                      title="Editar Produto"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(prod.id)}
                                      disabled={actionLoading === `delete_prod_${prod.id}`}
                                      className="p-1.5 bg-gray-900 hover:bg-red-700 hover:text-white rounded border border-gray-800 text-red-400 transition cursor-pointer"
                                      title="Eliminar Produto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                // EDITING / ADDING NEW PRODUCT FORM
                <form onSubmit={handleSaveProductForm} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-6 font-sans">
                  <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                      {newProductModal ? "Adicionar Novo Produto" : `Editar Produto: ${editingProduct.name}`}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)}
                      className="text-gray-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Nome do Produto</label>
                        <input 
                          type="text" 
                          required
                          value={editingProduct.name || ""} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Modelo</label>
                          <input 
                            type="text" 
                            value={editingProduct.model || ""} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Marca</label>
                          <input 
                            type="text" 
                            value={editingProduct.brand || "Ajax"} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Categoria</label>
                          <input 
                            type="text" 
                            value={editingProduct.category || ""} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Serviço Relacionado</label>
                          <select 
                            value={editingProduct.service_id || ""} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, service_id: e.target.value })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value="">Nenhum (Desvinculado)</option>
                            {servicesList.map(s => (
                              <option key={s.id} value={s.slug}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Curta</label>
                        <textarea 
                          value={editingProduct.short_description || ""} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                          rows={3}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem Principal</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={editingProduct.image || ""} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                            className="flex-1 bg-[#161616] border border-gray-800 rounded px-3 py-2 text-white text-xs"
                          />
                          <button type="button" onClick={() => openMediaSelector("product", "image")} className="px-2.5 bg-gray-900 border border-gray-800 text-white rounded text-xs cursor-pointer">Escolher</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ordem Exibição</label>
                          <input 
                            type="number" 
                            value={editingProduct.display_order || 0} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, display_order: parseInt(e.target.value) })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Destaque Outlet</label>
                          <select 
                            value={editingProduct.is_featured ?? 0} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: parseInt(e.target.value) })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value={0}>Não (Normal)</option>
                            <option value={1}>Sim (Exibir Outlet)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Estado</label>
                          <select 
                            value={editingProduct.is_active ?? 1} 
                            onChange={(e) => setEditingProduct({ ...editingProduct, is_active: parseInt(e.target.value) })}
                            className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                          >
                            <option value={1}>Ativo</option>
                            <option value={0}>Inativo</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Completa</label>
                        <textarea 
                          value={editingProduct.description || ""} 
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          rows={4}
                          className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-955 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setEditingProduct(null)}
                      className="px-5 py-3 bg-[#161616] hover:bg-[#222] border border-gray-800 rounded text-xs font-bold uppercase text-gray-400 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading === "product"}
                      className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                    >
                      {actionLoading === "product" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Guardar Rascunho</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 7: FORNECEDORES */}
          {activeTab === "suppliers" && (
            <div className="space-y-6">
              {!editingSupplier ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setEditingSupplier({ id: 0, name: "", logo_url: "", website_url: "", order_index: 1 })}
                      className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Fornecedor</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {suppliersList.map(sup => (
                      <div key={sup.id} className="bg-[#111] border border-gray-900 rounded-lg p-6 flex flex-col justify-between hover:border-[#D4AF37]/35 transition">
                        <div className="flex items-center gap-4 border-b border-gray-955 pb-4 mb-4">
                          <img src={resolveMediaUrl(sup.logo || sup.logo_url)} alt={sup.name} className="w-16 h-16 object-contain bg-black rounded p-2 border border-gray-800" />
                          <div>
                            <h4 className="text-sm font-bold text-white uppercase">{sup.name}</h4>
                            <a href={sup.website_url || sup.link} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-[#D4AF37] hover:underline flex items-center gap-1 mt-1">
                              <span>Website</span> <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Ordem: <strong className="text-gray-300">{sup.order_index ?? 0}</strong></span>
                          <div className="space-x-1">
                            <button onClick={() => setEditingSupplier(sup)} className="p-1.5 bg-gray-900 text-gray-400 hover:text-white rounded border border-gray-800 cursor-pointer">Editar</button>
                            <button onClick={() => handleDeleteSupplier(sup.id)} className="p-1.5 bg-gray-900 text-red-400 hover:text-white hover:bg-red-700 rounded border border-gray-800 cursor-pointer">Eliminar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveSupplierForm} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-6 max-w-xl mx-auto">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] border-b border-gray-900 pb-3">Fornecedor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Nome do Fornecedor</label>
                      <input type="text" required value={editingSupplier.name || ""} onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Logotipo URL</label>
                      <div className="flex gap-2">
                        <input type="text" value={editingSupplier.logo || editingSupplier.logo_url || ""} onChange={(e) => setEditingSupplier({ ...editingSupplier, logo: e.target.value, logo_url: e.target.value })} className="flex-1 bg-[#161616] border border-gray-800 rounded px-3 py-2 text-white text-xs" />
                        <button type="button" onClick={() => openMediaSelector("supplier", "logo")} className="px-2.5 bg-gray-900 border border-gray-800 text-white rounded text-xs cursor-pointer">Escolher</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Website Oficial</label>
                      <input type="url" value={editingSupplier.link || editingSupplier.website_url || ""} onChange={(e) => setEditingSupplier({ ...editingSupplier, link: e.target.value, website_url: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ordem Index</label>
                      <input type="number" value={editingSupplier.order_index ?? editingSupplier.display_order ?? 0} onChange={(e) => setEditingSupplier({ ...editingSupplier, order_index: parseInt(e.target.value) })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-gray-950 pt-4">
                    <button type="button" onClick={() => setEditingSupplier(null)} className="px-4 py-2.5 bg-gray-900 border border-gray-850 rounded text-xs text-gray-400 cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs font-bold uppercase rounded cursor-pointer">Salvar</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 8: GALERIA / PROJETOS */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              {!editingGallery ? (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setEditingGallery({ id: 0, title: "", image_url: "", category: "cctv", description: "", order_index: 1 })}
                      className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {galleryList.map((item) => (
                      <div key={item.id} className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/35 transition">
                        <img src={resolveMediaUrl(item.image || item.image_url)} alt={item.title} className="w-full h-44 object-cover border-b border-gray-955 bg-black" />
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] block mb-1">{item.category}</span>
                            <h4 className="text-sm font-bold text-white uppercase">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-955 mt-4 pt-3">
                            <span>Ordem: {item.order_index ?? 0}</span>
                            <div className="space-x-1">
                              <button onClick={() => setEditingGallery(item)} className="p-1 text-gray-400 hover:text-white cursor-pointer">Editar</button>
                              <button onClick={() => handleDeleteGallery(item.id)} className="p-1 text-red-400 hover:text-red-300 cursor-pointer">Eliminar</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveGalleryForm} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-6 max-w-xl mx-auto">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] border-b border-gray-900 pb-3">Item de Galeria</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Título do Projeto</label>
                      <input type="text" required value={editingGallery.title || ""} onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Categoria (cctv, intrusao, acessos, redes, etc.)</label>
                      <select value={editingGallery.category || "cctv"} onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs">
                        <option value="cctv">Videovigilância</option>
                        <option value="intrusao">Sistemas de Alarme</option>
                        <option value="acessos">Controlo de Acessos</option>
                        <option value="incendio">Deteção de Incêndio</option>
                        <option value="automatismos">Automatismos</option>
                        <option value="redes">Redes Técnicas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem de Capa</label>
                      <div className="flex gap-2">
                        <input type="text" value={editingGallery.image || editingGallery.image_url || ""} onChange={(e) => setEditingGallery({ ...editingGallery, image: e.target.value, image_url: e.target.value })} className="flex-1 bg-[#161616] border border-gray-800 rounded px-3 py-2 text-white text-xs" />
                        <button type="button" onClick={() => openMediaSelector("galleryItem", "image")} className="px-2.5 bg-gray-900 border border-gray-800 text-white rounded text-xs cursor-pointer">Escolher</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Descrição Curta</label>
                      <textarea value={editingGallery.description || ""} onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })} rows={3} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Ordem Index</label>
                      <input type="number" value={editingGallery.order_index ?? 0} onChange={(e) => setEditingGallery({ ...editingGallery, order_index: parseInt(e.target.value) })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-gray-955 pt-4">
                    <button type="button" onClick={() => setEditingGallery(null)} className="px-4 py-2.5 bg-gray-900 border border-gray-855 rounded text-xs text-gray-400 cursor-pointer">Cancelar</button>
                    <button type="submit" className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs font-bold uppercase rounded cursor-pointer">Salvar</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 9: CONTACTOS */}
          {activeTab === "contactos" && (
            <form onSubmit={handleSaveSettings} className="bg-[#111] border border-gray-900 p-8 rounded-lg space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-3">Informações de Contacto Centralizadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Telefone</label>
                    <input type="text" value={settingsForm.phone || ""} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">WhatsApp (Ex: +351 918 880 788)</label>
                    <input type="text" value={settingsForm.whatsapp || ""} onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">E-mail Principal</label>
                    <input type="email" value={settingsForm.email || ""} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Morada Física Completa</label>
                    <input type="text" value={settingsForm.address || ""} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Horário Dias Úteis (Seg-Sex)</label>
                    <input type="text" value={settingsForm.working_hours_week || ""} onChange={(e) => setSettingsForm({ ...settingsForm, working_hours_week: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Horário Sábado</label>
                    <input type="text" value={settingsForm.working_hours_sat || ""} onChange={(e) => setSettingsForm({ ...settingsForm, working_hours_sat: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">URL / Link Iframe do Google Maps</label>
                    <textarea rows={3} value={settingsForm.map_iframe || ""} onChange={(e) => setSettingsForm({ ...settingsForm, map_iframe: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" placeholder="URL do Maps para renderizar o iframe no contacto..." />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-955">
                <button type="submit" className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs font-bold uppercase tracking-widest rounded cursor-pointer transition">Guardar Rascunho</button>
              </div>
            </form>
          )}

          {/* TAB 10: MENSAGENS */}
          {activeTab === "messages" && (
            <div className="space-y-6 font-sans">
              <div className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#161616] text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-gray-900">
                      <tr>
                        <th className="p-4">Remetente</th>
                        <th className="p-4">E-mail / Telefone</th>
                        <th className="p-4">Serviço Pretendido</th>
                        <th className="p-4">Mensagem</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-955">
                      {messages.map((msg) => (
                        <tr key={msg.id} className={`hover:bg-[#161616]/40 transition duration-150 ${msg.status === 'new' ? 'bg-[#D4AF37]/5 font-semibold' : ''}`}>
                          <td className="p-4 text-white">
                            <div>{msg.name}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{msg.created_at || msg.created}</div>
                          </td>
                          <td className="p-4">
                            <div>{msg.email}</div>
                            <div className="text-gray-500 mt-0.5 font-mono">{msg.phone || "-"}</div>
                          </td>
                          <td className="p-4 text-[#D4AF37]">{msg.service || "Geral"}</td>
                          <td className="p-4 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                          <td className="p-4">
                            <select 
                              value={msg.status} 
                              onChange={(e) => handleMessageStatus(msg.id, e.target.value)}
                              className="bg-[#161616] border border-gray-800 rounded px-2.5 py-1 text-xs text-white"
                            >
                              <option value="new">Nova</option>
                              <option value="in_progress">Em Atendimento</option>
                              <option value="replied">Respondida</option>
                              <option value="archived">Arquivada</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            <button onClick={() => alert(msg.message)} className="p-1 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded cursor-pointer">Ver Completa</button>
                            <button onClick={() => handleDeleteMessage(msg.id)} className="p-1 bg-gray-900 border border-gray-800 text-red-400 hover:text-white rounded cursor-pointer">Excluir</button>
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">Nenhuma mensagem recebida até ao momento.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: BIBLIOTECA DE MÍDIA */}
          {activeTab === "media" && (
            <div className="space-y-6">
              
              {/* Media Control Toolbar */}
              <div className="bg-[#111] border border-gray-900 p-6 rounded-lg flex flex-wrap items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleUploadMediaFile} 
                    className="hidden" 
                    accept="image/*,video/*,application/pdf"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadProgress !== null}
                    className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Carregar Novo Ficheiro</span>
                  </button>
                  {uploadProgress && <span className="text-xs text-[#D4AF37] font-mono animate-pulse">{uploadProgress}</span>}
                </div>
                
                <div className="text-xs text-gray-500 font-mono">
                  Suportados: <strong className="text-gray-300">WebP, PNG, JPG, MP4</strong> (Máx. 20MB)
                </div>
              </div>

              {/* Grid of uploaded files */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 font-sans">
                {mediaList.map((file) => {
                  const isVideo = file.file_type === "video";
                  return (
                    <div key={file.id} className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden group flex flex-col justify-between hover:border-[#D4AF37]/35 transition relative">
                      {/* Image / Video preview box */}
                      <div className="h-28 bg-black flex items-center justify-center relative overflow-hidden border-b border-gray-950">
                        {isVideo ? (
                          <video src={resolveMediaUrl(file.file_path)} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={resolveMediaUrl(file.file_path)} alt={file.file_name} className="w-full h-full object-contain p-2" />
                        )}
                        
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => { navigator.clipboard.writeText(file.file_path); showAlert("success", "URL copiada para o clipboard!"); }}
                            className="p-1.5 bg-[#161616] border border-gray-800 rounded hover:text-[#D4AF37] cursor-pointer text-xs"
                            title="Copiar URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMediaFile(file.id)}
                            className="p-1.5 bg-[#161616] border border-gray-800 rounded text-red-500 hover:bg-red-900 cursor-pointer text-xs"
                            title="Eliminar Mídia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* File Details Footer */}
                      <div className="p-3 bg-black/20 text-[10px] font-mono space-y-1">
                        <p className="text-gray-300 font-semibold truncate" title={file.file_name}>{file.file_name}</p>
                        <div className="flex justify-between text-gray-500">
                          <span>{isVideo ? "VÍDEO" : "IMAGEM"}</span>
                          <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {mediaList.length === 0 && (
                  <div className="col-span-full py-16 text-center text-gray-500 font-mono">Nenhum ficheiro encontrado no diretório de uploads.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 12: SEO */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              
              {!editingSeo ? (
                <div className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden font-sans">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161616] text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-gray-900">
                      <tr>
                        <th className="p-4">Identificador da Página</th>
                        <th className="p-4">Meta Title</th>
                        <th className="p-4">Meta Description</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-955">
                      {seoList.map((item) => (
                        <tr key={item.page} className="hover:bg-[#161616]/40 transition">
                          <td className="p-4 font-bold text-[#D4AF37] font-mono">{item.page}</td>
                          <td className="p-4 text-white font-semibold">{item.title}</td>
                          <td className="p-4 text-gray-400 max-w-md truncate">{item.description}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => setEditingSeo(item)} className="px-3 py-1.5 bg-gray-900 border border-gray-850 hover:bg-[#D4AF37] hover:text-black transition rounded cursor-pointer">Editar SEO</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setActionLoading("seo");
                  try {
                    await saveSeo(editingSeo);
                    showAlert("success", "Tags de SEO atualizadas!");
                    setEditingSeo(null);
                    fetchAllData();
                  } catch (err: any) {
                    showAlert("error", err.message || "Erro ao salvar SEO.");
                  } finally {
                    setActionLoading(null);
                  }
                }} className="bg-[#111] border border-gray-900 p-8 rounded-lg max-w-xl mx-auto space-y-4 font-sans">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] border-b border-gray-900 pb-3">Editar SEO: {editingSeo.page}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Meta Title</label>
                      <input type="text" required value={editingSeo.title || ""} onChange={(e) => setEditingSeo({ ...editingSeo, title: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Meta Description</label>
                      <textarea required value={editingSeo.description || ""} onChange={(e) => setEditingSeo({ ...editingSeo, description: e.target.value })} rows={3} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Palavras-chave (Keywords separadas por vírgula)</label>
                      <input type="text" value={editingSeo.keywords || ""} onChange={(e) => setEditingSeo({ ...editingSeo, keywords: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Imagem Open Graph (OG Image)</label>
                      <div className="flex gap-2">
                        <input type="text" value={editingSeo.og_image || ""} onChange={(e) => setEditingSeo({ ...editingSeo, og_image: e.target.value })} className="flex-1 bg-[#161616] border border-gray-800 rounded px-3 py-2 text-white text-xs" />
                        <button type="button" onClick={() => openMediaSelector("seo", "og_image")} className="px-2.5 bg-gray-900 border border-gray-800 text-white rounded text-xs cursor-pointer">Escolher</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">URL Canónica (Canonical URL)</label>
                      <input type="text" value={editingSeo.canonical_url || ""} onChange={(e) => setEditingSeo({ ...editingSeo, canonical_url: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-gray-955 pt-4">
                    <button type="button" onClick={() => setEditingSeo(null)} className="px-4 py-2.5 bg-gray-900 border border-gray-855 rounded text-xs text-gray-400 cursor-pointer">Cancelar</button>
                    <button type="submit" disabled={actionLoading === "seo"} className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase rounded cursor-pointer">Salvar</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 13: UTILIZADORES */}
          {activeTab === "users" && (
            <form onSubmit={handleChangePasswordSubmit} className="bg-[#111] border border-gray-900 p-8 rounded-lg max-w-xl mx-auto space-y-6 font-sans">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-900 pb-3">Credenciais de Acesso ao Painel</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Nome de Utilizador / E-mail</label>
                  <input 
                    type="text" 
                    value={newUsername} 
                    onChange={(e) => setNewUsername(e.target.value)} 
                    placeholder="Deixe em branco para manter o atual" 
                    className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Palavra-passe Atual (Obrigatório para segurança)</label>
                  <input 
                    type="password" 
                    required 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Nova Palavra-passe</label>
                  <input 
                    type="password" 
                    required 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">Confirmar Nova Palavra-passe</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full bg-[#161616] border border-gray-800 rounded px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#D4AF37] transition" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-955">
                <button 
                  type="submit" 
                  disabled={actionLoading === "password"}
                  className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] disabled:bg-gray-800 text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow"
                >
                  {actionLoading === "password" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Alterar Credenciais</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 14: CONFIGURAÇÕES / BACKUP */}
          {activeTab === "settings" && (
            <div className="space-y-6 font-sans max-w-2xl mx-auto">
              <div className="bg-[#111] border border-gray-900 p-8 rounded-lg text-center space-y-6">
                <Database className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Cópia de Segurança Completa</h3>
                  <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto">
                    Gere e descarregue um ficheiro ZIP completo contendo todas as base de dados de conteúdo JSON, o histórico de alterações, as credenciais e a totalidade das mídias enviadas na biblioteca de mídia do site.
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <a
                    href={getBackupUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FFD700] text-black text-xs font-bold uppercase tracking-widest rounded flex items-center gap-2 cursor-pointer transition shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    <span>Gerar e Descarregar Backup</span>
                  </a>
                </div>
              </div>

              {/* Informações técnicas adicionais */}
              <div className="bg-[#111] border border-gray-900 p-6 rounded-lg text-xs space-y-4 text-gray-400">
                <h4 className="font-bold text-white uppercase tracking-wider">Informações do Sistema</h4>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div>Caminho uploads: <strong className="text-gray-300">/uploads/</strong></div>
                  <div>Base de Dados: <strong className="text-gray-300">JSON File-system</strong></div>
                  <div>PHP Versão: <strong className="text-gray-300">PHP 7.4+ compatível</strong></div>
                  <div>Vite Environment: <strong className="text-gray-300">React + TS</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: HISTÓRICO DE ALTERAÇÕES */}
          {activeTab === "history" && (
            <div className="space-y-6 font-sans">
              <div className="bg-[#111] border border-gray-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#161616] text-[10px] uppercase font-mono tracking-wider text-gray-400 border-b border-gray-900">
                      <tr>
                        <th className="p-4">Utilizador</th>
                        <th className="p-4">Secção / Ação</th>
                        <th className="p-4">Descrição da Modificação</th>
                        <th className="p-4 text-right">Data & Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-955">
                      {changeHistory.map((log) => (
                        <tr key={log.id} className="hover:bg-[#161616]/40 transition duration-150">
                          <td className="p-4 font-bold text-white font-mono">{log.user}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800 text-[10px] font-semibold uppercase tracking-wider">
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{log.content}</td>
                          <td className="p-4 text-right font-mono text-gray-500">{log.date} @ {log.time}</td>
                        </tr>
                      ))}
                      {changeHistory.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-500 font-mono">Nenhum registo de alteração encontrado no servidor.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
      // MODAL: SELETOR DE MÍDIA INTEGRADO
      // ───────────────────────────────────────────────────────────── */}
      {mediaSelectorOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/85 font-sans selection:bg-[#D4AF37] selection:text-black">
          <div className="bg-[#111] border border-gray-900 max-w-4xl w-full h-[85vh] rounded-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-[#161616] p-4 border-b border-gray-955 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Selecionar Ficheiro da Biblioteca</span>
              </h3>
              <button 
                onClick={() => { setMediaSelectorOpen(false); setMediaSelectorTarget(null); }}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Upload box inside selector */}
            <div className="p-4 bg-[#161616]/30 border-b border-gray-955 flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500">Escolha uma mídia existente abaixo ou faça upload de uma nova:</span>
              <div>
                <input 
                  type="file" 
                  id="selector_file_upload" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadProgress("A carregar...");
                    try {
                      const url = await uploadMedia(file);
                      showAlert("success", "Mídia carregada!");
                      const media = await getMediaList();
                      setMediaList(media);
                      // Auto-selecionar após carregar
                      selectMediaFromLibrary(url);
                    } catch (err: any) {
                      showAlert("error", err.message || "Erro no upload.");
                    } finally {
                      setUploadProgress(null);
                    }
                  }} 
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("selector_file_upload")?.click()}
                  className="px-3 py-2 bg-gray-900 border border-gray-800 text-white rounded text-xs hover:bg-gray-850 cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar Novo</span>
                </button>
              </div>
            </div>

            {/* Grid of files to select */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaList.map((file) => {
                const isVideo = file.file_type === "video";
                return (
                  <div 
                    key={file.id} 
                    onClick={() => selectMediaFromLibrary(file.file_path)}
                    className="bg-[#161616] border border-gray-955 hover:border-[#D4AF37] cursor-pointer rounded-lg overflow-hidden group flex flex-col justify-between transition-all"
                  >
                    <div className="h-24 bg-black flex items-center justify-center overflow-hidden">
                      {isVideo ? (
                        <video src={resolveMediaUrl(file.file_path)} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={resolveMediaUrl(file.file_path)} alt={file.file_name} className="w-full h-full object-contain p-2" />
                      )}
                    </div>
                    <div className="p-2 text-[9px] font-mono bg-black/40 truncate text-gray-400 text-center">
                      {file.file_name}
                    </div>
                  </div>
                );
              })}
              {mediaList.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-500 font-mono">Nenhum ficheiro carregado.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Icon helper for backup download
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

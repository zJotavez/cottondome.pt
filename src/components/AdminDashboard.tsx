import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, LayoutDashboard, Settings, Home as HomeIcon, ShieldAlert, Cpu, 
  FileText, Users, Image as ImageIcon, MessageSquare, Globe, LogOut, 
  Plus, Trash2, Edit3, Save, Eye, Check, X, Upload, Copy, RefreshCw, 
  ChevronRight, Menu, HelpCircle, Phone, Mail, MapPin, ExternalLink
} from "lucide-react";
import { LucideIcon } from "./LucideIcon";

// Configuration for API URL. Uses VITE_API_URL if set, otherwise empty for relative path
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null means checking
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // General App State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Feedback Messages
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form States (dynamic)
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [homeForm, setHomeForm] = useState<any>({});
  const [aboutForm, setAboutForm] = useState<any>({});
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [servicePageForm, setServicePageForm] = useState<any>({});
  
  // Lists for dynamic arrays inside service page form
  const [appInput, setAppInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [processInput, setProcessInput] = useState("");

  // Suppliers & Gallery List
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [editingGallery, setEditingGallery] = useState<any>(null);

  const [seoList, setSeoList] = useState<any[]>([]);
  const [editingSeo, setEditingSeo] = useState<any>(null);

  // Account Passwords
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Media Library Helper States
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaSelectorTarget, setMediaSelectorTarget] = useState<{ form: string; field: string } | null>(null);
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);

  // Fetch all site content (including public data to populate forms)
  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch site content
      const resContent = await fetch(`${API_BASE}/api/get_content.php`);
      const contentData = await resContent.json();
      if (contentData.success) {
        const d = contentData.data;
        setSiteData(d);
        setSettingsForm(d.settings || {});
        setHomeForm(d.home || {});
        setAboutForm(d.about || {});
        setServicesList(d.services || []);
        setSuppliersList(d.suppliers || []);
        setGalleryList(d.gallery || []);
        setSeoList(d.seo || []);
        
        // Auto select first service for page detail editor
        if (d.services && d.services.length > 0) {
          handleSelectService(d.services[0].id, d.servicePages, d.services[0]);
        }
      }

      // 2. Fetch admin data (messages & media)
      const resMsg = await fetch(`${API_BASE}/api/admin/messages.php`);
      if (resMsg.status === 401) {
        setIsLoggedIn(false);
        setDataLoading(false);
        return;
      }
      const msgData = await resMsg.json();
      if (msgData.success) {
        setMessages(msgData.data || []);
      }

      const resMedia = await fetch(`${API_BASE}/api/admin/media.php`);
      const mediaData = await resMedia.json();
      if (mediaData.success) {
        setMediaList(mediaData.data || []);
      }

      setIsLoggedIn(true);
    } catch (err) {
      console.error("Error fetching admin data", err);
      // If unauthorized, set logged out
      setIsLoggedIn(false);
    } finally {
      setDataLoading(false);
    }
  };

  // Check login status on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Alert handler
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Handles Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setAuthError("Por favor preencha todos os campos.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/api/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        showAlert("success", "Autenticação efetuada com sucesso!");
        fetchAllData();
      } else {
        setAuthError(data.error || "Nome de utilizador ou palavra-passe incorreta.");
      }
    } catch (err) {
      setAuthError("Erro de ligação ao servidor. Tente novamente.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handles Logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout.php`);
    } catch (e) {}
    setIsLoggedIn(false);
    onNavigate("/");
  };

  // Handle service selection to populate service page forms
  const handleSelectService = (id: number, allPages?: any[], serviceObj?: any) => {
    setSelectedServiceId(id);
    const pages = allPages || siteData?.servicePages || [];
    const activePage = pages.find((p: any) => p.service_id === id);
    const currentService = serviceObj || servicesList.find((s: any) => s.id === id);

    if (activePage) {
      setServicePageForm(activePage);
    } else {
      // Empty template
      setServicePageForm({
        service_id: id,
        page_title: currentService?.title || "",
        impact_phrase: "",
        full_description: "",
        applications: [],
        related_products: [],
        benefits: [],
        work_process: [],
        final_cta_title: "",
        final_cta_text: "",
        seo_title: currentService?.title + " | Cotton Dome LDA",
        seo_description: "",
        seo_keywords: ""
      });
    }
  };

  // Form submission helpers
  const saveSection = async (endpoint: string, payload: any) => {
    setActionLoading(endpoint);
    try {
      const res = await fetch(`${API_BASE}/api/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", data.message || "Dados gravados com sucesso!");
        // Refresh
        fetchAllData();
      } else {
        showAlert("error", data.error || "Falha ao gravar dados.");
      }
    } catch (err) {
      showAlert("error", "Erro ao comunicar com o servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    saveSection("save_settings.php", settingsForm);
  };

  // Save Home
  const handleSaveHome = () => {
    saveSection("save_home.php", homeForm);
  };

  // Save About
  const handleSaveAbout = () => {
    saveSection("save_about.php", aboutForm);
  };

  // Save Service General properties
  const handleSaveServiceGeneral = (service: any) => {
    saveSection("save_services.php", service);
  };

  // Save Service Subpage Detail
  const handleSaveServicePage = () => {
    saveSection("save_service_page.php", servicePageForm);
  };

  // Save Supplier
  const handleSaveSupplier = () => {
    saveSection("save_suppliers.php", { ...editingSupplier, action: "save" });
    setEditingSupplier(null);
  };

  // Delete Supplier
  const handleDeleteSupplier = (id: number) => {
    if (confirm("Tem a certeza que deseja remover este fornecedor?")) {
      saveSection("save_suppliers.php", { id, action: "delete" });
    }
  };

  // Save Gallery
  const handleSaveGallery = () => {
    saveSection("save_gallery.php", { ...editingGallery, action: "save" });
    setEditingGallery(null);
  };

  // Delete Gallery
  const handleDeleteGallery = (id: number) => {
    if (confirm("Tem a certeza que deseja remover este item da galeria?")) {
      saveSection("save_gallery.php", { id, action: "delete" });
    }
  };

  // Save SEO Page settings
  const handleSaveSeo = () => {
    saveSection("save_seo.php", editingSeo);
    setEditingSeo(null);
  };

  // Update contact message status
  const handleUpdateMessageStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/messages.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Estado da mensagem atualizado.");
        fetchAllData();
      } else {
        showAlert("error", data.error);
      }
    } catch (e) {
      showAlert("error", "Erro ao ligar ao servidor.");
    }
  };

  // Delete contact message
  const handleDeleteMessage = async (id: number) => {
    if (confirm("Eliminar definitivamente esta mensagem?")) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/messages.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "delete" })
        });
        const data = await res.json();
        if (data.success) {
          showAlert("success", "Mensagem eliminada.");
          fetchAllData();
        } else {
          showAlert("error", data.error);
        }
      } catch (e) {
        showAlert("error", "Erro ao ligar ao servidor.");
      }
    }
  };

  // Handle custom file upload in Media Library
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    setUploadProgress("Carregando...");
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload.php`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Ficheiro carregado com sucesso!");
        fetchAllData();
      } else {
        showAlert("error", data.error || "Erro ao carregar ficheiro.");
      }
    } catch (err) {
      showAlert("error", "Erro ao comunicar com o servidor.");
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete media item
  const handleDeleteMedia = async (id: number) => {
    if (confirm("Eliminar fisicamente este ficheiro? Se estiver a ser usado no site, o link será quebrado.")) {
      try {
        const res = await fetch(`${API_BASE}/api/admin/media.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "delete" })
        });
        const data = await res.json();
        if (data.success) {
          showAlert("success", "Ficheiro eliminado.");
          fetchAllData();
        } else {
          showAlert("error", data.error);
        }
      } catch (e) {
        showAlert("error", "Erro ao ligar ao servidor.");
      }
    }
  };

  // Save administrator password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert("error", "Por favor preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert("error", "A nova palavra-passe e a confirmação não coincidem.");
      return;
    }
    
    setActionLoading("password");
    try {
      const res = await fetch(`${API_BASE}/api/admin/change_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          username: newUsername || null,
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Credenciais de administrador atualizadas com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setNewUsername("");
      } else {
        showAlert("error", data.error || "Senha atual incorreta.");
      }
    } catch (err) {
      showAlert("error", "Erro ao comunicar com o servidor.");
    } finally {
      setActionLoading(null);
    }
  };

  // Helper to open media selector modal for target fields
  const openMediaSelector = (formName: string, fieldName: string) => {
    setMediaSelectorTarget({ form: formName, field: fieldName });
    setMediaSelectorOpen(true);
  };

  // Select media file and inject into target form input
  const selectMediaForTarget = (filePath: string) => {
    if (!mediaSelectorTarget) return;

    const { form, field } = mediaSelectorTarget;

    if (form === "settings") {
      setSettingsForm((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form === "home") {
      setHomeForm((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form === "about") {
      setAboutForm((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form.startsWith("service_")) {
      const idx = parseInt(form.split("_")[1]);
      setServicesList(prev => prev.map((s, i) => i === idx ? { ...s, [field]: filePath } : s));
    } else if (form === "service_page") {
      setServicePageForm((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form === "supplier") {
      setEditingSupplier((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form === "gallery") {
      setEditingGallery((prev: any) => ({ ...prev, [field]: filePath }));
    } else if (form === "seo") {
      setEditingSeo((prev: any) => ({ ...prev, [field]: filePath }));
    }

    setMediaSelectorOpen(false);
    setMediaSelectorTarget(null);
    showAlert("success", `Media vinculada ao campo com sucesso.`);
  };

  // Loading indicator for first load
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center text-white">
        <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500 animate-pulse">A inicializar painel administrativo...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#E2AF55]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#A37125]/5 blur-[150px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-[#111] border border-[#C28D35]/30 p-8 rounded shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-black border border-[#C28D35]/30 rounded-full text-[#C28D35] mb-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white">COTTON DOME</h2>
            <p className="text-xs font-mono uppercase tracking-widest text-[#C28D35] mt-1">Painel Administrativo</p>
          </div>

          {authError && (
            <div className="bg-red-950/60 border border-red-800 text-red-200 text-xs px-4 py-3 rounded mb-5 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-mono mb-2">Utilizador</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono transition duration-300"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-mono mb-2">Palavra-passe</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono transition duration-300"
                placeholder="••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#C28D35] to-[#A37125] hover:brightness-110 disabled:opacity-50 text-black font-bold uppercase tracking-widest text-xs rounded transition duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate("/")}
              className="text-xs text-gray-500 hover:text-white transition duration-300"
            >
              Voltar ao Site Público
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MENU TABS DEFINITION
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "settings", label: "Configurações Gerais", icon: Settings },
    { id: "home", label: "Home / Hero", icon: HomeIcon },
    { id: "services", label: "Serviços", icon: Cpu },
    { id: "servicePages", label: "Páginas dos Serviços", icon: FileText },
    { id: "about", label: "Sobre Nós", icon: Users },
    { id: "suppliers", label: "Fornecedores", icon: Users },
    { id: "gallery", label: "Galeria de Projetos", icon: ImageIcon },
    { id: "messages", label: "Mensagens", icon: MessageSquare, badge: messages.filter(m => m.status === 'new').length },
    { id: "media", label: "Biblioteca de Mídia", icon: ImageIcon },
    { id: "seo", label: "SEO Metatags", icon: Globe },
    { id: "account", label: "Alterar Acesso", icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-gray-300 font-sans flex flex-col lg:flex-row relative">
      
      {/* Visual alerts banner */}
      {alert && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded border shadow-2xl flex items-center gap-3.5 animate-bounce ${
          alert.type === "success" 
            ? "bg-green-950/80 border-green-700 text-green-200" 
            : "bg-red-950/80 border-red-700 text-red-200"
        }`}>
          {alert.type === "success" ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
          <span className="text-sm font-medium">{alert.message}</span>
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className="lg:hidden w-full bg-[#111] border-b border-gray-900 px-4 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <span className="text-[#C28D35] font-bold text-sm uppercase tracking-wider">Cotton Dome</span>
          <span className="px-1.5 py-0.5 rounded bg-[#222] font-mono text-[8px] text-[#C28D35]">ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("/")} 
            className="p-2 text-gray-400 hover:text-white"
            title="Ver Site"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:relative top-0 bottom-0 left-0 w-64 bg-[#111] border-r border-gray-900 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-900 hidden lg:flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-white text-base tracking-widest">COTTON DOME</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#C28D35] uppercase mt-0.5">Truth Engine Admin</p>
          </div>
          <button 
            onClick={() => onNavigate("/")} 
            className="p-1.5 rounded bg-black/40 border border-gray-800 text-gray-400 hover:text-[#C28D35] transition"
            title="Ver Site"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded font-medium text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[#C28D35] text-black font-bold" 
                    : "text-gray-400 hover:bg-black/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                    isActive ? "bg-black text-[#C28D35]" : "bg-red-600 text-white animate-pulse"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-900 bg-black/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-mono">Utilizador: <strong className="text-gray-300">admin</strong></span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition uppercase font-bold text-[10px] tracking-wider cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 bg-[#080808] p-6 lg:p-10 overflow-y-auto">
        
        {/* Dynamic header title */}
        <header className="mb-8 border-b border-gray-900 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider text-white">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Gerencie e atualize o conteúdo do site sem mexer no código.</p>
          </div>
          {dataLoading && (
            <div className="flex items-center gap-2 text-xs text-[#C28D35] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>A atualizar dados...</span>
            </div>
          )}
        </header>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: DASHBOARD */}
        {/* ---------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#111] border border-gray-900 p-6 rounded hover:border-[#C28D35]/30 transition duration-300">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Mensagens Recebidas</span>
                <span className="text-3xl font-extrabold text-white">{messages.length}</span>
                <span className="block text-[10px] text-gray-400 mt-2">
                  <strong className="text-[#C28D35]">{messages.filter(m => m.status === 'new').length}</strong> por responder
                </span>
              </div>

              <div className="bg-[#111] border border-gray-900 p-6 rounded hover:border-[#C28D35]/30 transition duration-300">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Serviços Ativos</span>
                <span className="text-3xl font-extrabold text-white">
                  {servicesList.filter(s => s.is_active === 1).length} / {servicesList.length}
                </span>
                <span className="block text-[10px] text-gray-400 mt-2">Registados na base de dados</span>
              </div>

              <div className="bg-[#111] border border-gray-900 p-6 rounded hover:border-[#C28D35]/30 transition duration-300">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Biblioteca de Mídia</span>
                <span className="text-3xl font-extrabold text-white">{mediaList.length}</span>
                <span className="block text-[10px] text-gray-400 mt-2">Ficheiros carregados no servidor</span>
              </div>

              <div className="bg-[#111] border border-gray-900 p-6 rounded hover:border-[#C28D35]/30 transition duration-300">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block mb-2">Fornecedores</span>
                <span className="text-3xl font-extrabold text-white">
                  {suppliersList.filter(s => s.is_active === 1).length}
                </span>
                <span className="block text-[10px] text-gray-400 mt-2">Ativos no carrossel da home</span>
              </div>
            </div>

            {/* Quick Actions / Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Latest messages block */}
              <div className="lg:col-span-8 bg-[#111] border border-gray-900 p-6 rounded">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Últimas Mensagens</h3>
                  <button 
                    onClick={() => setActiveTab("messages")}
                    className="text-xs text-[#C28D35] hover:text-[#FFD700] uppercase font-bold tracking-wider"
                  >
                    Ver todas
                  </button>
                </div>

                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500 py-6 text-center font-mono">Nenhuma mensagem recebida ainda.</p>
                ) : (
                  <div className="divide-y divide-gray-900">
                    {messages.slice(0, 4).map((msg) => (
                      <div key={msg.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="font-bold text-white block md:inline mr-2">{msg.name}</span>
                          <span className="text-gray-500">({msg.email})</span>
                          <p className="text-gray-400 mt-1 line-clamp-1 italic">"{msg.message}"</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            msg.status === 'new' 
                              ? 'bg-amber-950 border border-amber-800 text-amber-200' 
                              : msg.status === 'replied' 
                                ? 'bg-green-950 border border-green-800 text-green-200' 
                                : 'bg-gray-850 border border-gray-700 text-gray-400'
                          }`}>
                            {msg.status === 'new' ? 'Novo' : msg.status === 'replied' ? 'Respondido' : 'Arquivado'}
                          </span>
                          <span className="text-gray-500 font-mono">{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Server Info block */}
              <div className="lg:col-span-4 bg-[#111] border border-gray-900 p-6 rounded space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-4">
                  Estado do Sistema
                </h3>
                
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base de dados:</span>
                    <span className="text-green-500">LIGADA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hostinger Deploy:</span>
                    <span className="text-gray-300">Compatível</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Upload Folder:</span>
                    <span className="text-gray-300">/uploads</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">PHP Version:</span>
                    <span className="text-gray-300">8.x / 7.4+</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                  <button
                    onClick={fetchAllData}
                    className="w-full py-2 border border-gray-800 hover:border-[#C28D35] text-xs font-mono uppercase tracking-wider rounded transition flex items-center justify-center gap-2 text-white"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sincronizar Conteúdos</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: GENERAL CONFIG */}
        {/* ---------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="bg-[#111] border border-gray-900 p-6 rounded space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Nome da Empresa</label>
                <input
                  type="text"
                  value={settingsForm.company_name || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Slogan / Frase de Impacto</label>
                <input
                  type="text"
                  value={settingsForm.slogan || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Telefone</label>
                <input
                  type="text"
                  value={settingsForm.phone || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">WhatsApp Link Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  placeholder="Ex: +351 918 880 788"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Será higienizado para link api do WhatsApp.</span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">E-mail Destinatário</label>
                <input
                  type="email"
                  value={settingsForm.email || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Instagram URL</label>
                <input
                  type="text"
                  value={settingsForm.social_instagram || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_instagram: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Facebook URL</label>
                <input
                  type="text"
                  value={settingsForm.social_facebook || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  value={settingsForm.social_linkedin || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, social_linkedin: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Horário Semanal</label>
                <input
                  type="text"
                  value={settingsForm.working_hours_week || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, working_hours_week: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Horário Sábado</label>
                <input
                  type="text"
                  value={settingsForm.working_hours_sat || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, working_hours_sat: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Morada / Endereço</label>
              <textarea
                value={settingsForm.address || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                rows={3}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Texto do Rodapé (Footer)</label>
              <textarea
                value={settingsForm.footer_text || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                rows={3}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
              />
            </div>

            <div className="border-t border-gray-800 pt-5 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={actionLoading === "save_settings.php"}
                className="px-6 py-3 bg-[#C28D35] hover:bg-[#FFD700] disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-2 cursor-pointer animate-[pulse_3s_infinite]"
              >
                {actionLoading === "save_settings.php" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Guardar Configurações</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: HOME CONFIG */}
        {/* ---------------------------------------------------- */}
        {activeTab === "home" && (
          <div className="bg-[#111] border border-gray-900 p-6 rounded space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Título do Hero (Home)</label>
              <textarea
                value={homeForm.hero_title || ""}
                onChange={(e) => setHomeForm({ ...homeForm, hero_title: e.target.value })}
                rows={3}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Subtítulo do Hero</label>
              <textarea
                value={homeForm.hero_subtitle || ""}
                onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle: e.target.value })}
                rows={3}
                className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Imagem do Hero (Fallback)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeForm.hero_image || ""}
                    onChange={(e) => setHomeForm({ ...homeForm, hero_image: e.target.value })}
                    className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  />
                  <button 
                    onClick={() => openMediaSelector("home", "hero_image")}
                    className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                  >
                    Selecionar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Vídeo do Hero (Fundo)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeForm.hero_video || ""}
                    onChange={(e) => setHomeForm({ ...homeForm, hero_video: e.target.value })}
                    className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  />
                  <button 
                    onClick={() => openMediaSelector("home", "hero_video")}
                    className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                  >
                    Selecionar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Texto do Botão Principal</label>
                <input
                  type="text"
                  value={homeForm.primary_button_text || ""}
                  onChange={(e) => setHomeForm({ ...homeForm, primary_button_text: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Link do Botão Principal</label>
                <input
                  type="text"
                  value={homeForm.primary_button_link || ""}
                  onChange={(e) => setHomeForm({ ...homeForm, primary_button_link: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  placeholder="#contacto"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Texto do Botão Secundário</label>
                <input
                  type="text"
                  value={homeForm.secondary_button_text || ""}
                  onChange={(e) => setHomeForm({ ...homeForm, secondary_button_text: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Link do Botão Secundário</label>
                <input
                  type="text"
                  value={homeForm.secondary_button_link || ""}
                  onChange={(e) => setHomeForm({ ...homeForm, secondary_button_link: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  placeholder="#solucoes"
                />
              </div>
            </div>

            <div className="border-t border-gray-800 pt-5 flex justify-end">
              <button
                onClick={handleSaveHome}
                disabled={actionLoading === "save_home.php"}
                className="px-6 py-3 bg-[#C28D35] hover:bg-[#FFD700] disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-2 cursor-pointer"
              >
                {actionLoading === "save_home.php" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Guardar Hero / Home</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: SERVICES LIST */}
        {/* ---------------------------------------------------- */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-gray-900 p-6 rounded">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Lista de Serviços da Home</h3>
                <span className="text-xs text-gray-500 font-mono">10 serviços principais</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 uppercase tracking-wider font-mono">
                      <th className="py-3 px-2">Ordem</th>
                      <th className="py-3 px-2">Título</th>
                      <th className="py-3 px-2">Slug</th>
                      <th className="py-3 px-2">Ícone</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-900">
                    {servicesList.map((service, idx) => (
                      <tr key={service.id} className="hover:bg-black/20">
                        <td className="py-4 px-2">
                          <input
                            type="number"
                            value={service.display_order}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setServicesList(prev => prev.map((s, i) => i === idx ? { ...s, display_order: val } : s));
                            }}
                            className="w-12 bg-black border border-gray-800 text-center px-1 py-1 rounded text-white font-mono"
                          />
                        </td>
                        <td className="py-4 px-2 font-bold text-white text-sm">
                          {service.title}
                        </td>
                        <td className="py-4 px-2 text-gray-500 font-mono text-[10px]">
                          /servicos/{service.slug}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1.5">
                            <LucideIcon name={service.icon} className="w-4 h-4 text-[#C28D35]" />
                            <span className="font-mono text-[10px]">{service.icon}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <button
                            onClick={() => {
                              const newActive = service.is_active === 1 ? 0 : 1;
                              setServicesList(prev => prev.map((s, i) => i === idx ? { ...s, is_active: newActive } : s));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              service.is_active === 1 ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"
                            }`}
                          >
                            {service.is_active === 1 ? "Ativo" : "Inativo"}
                          </button>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openMediaSelector(`service_${idx}`, "image")}
                              className="px-2 py-1 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] transition font-mono"
                            >
                              Imagem
                            </button>
                            <button
                              onClick={() => handleSaveServiceGeneral(service)}
                              disabled={actionLoading === "save_services.php"}
                              className="px-3 py-1.5 bg-[#C28D35] hover:bg-[#FFD700] text-black font-bold uppercase rounded text-[10px] tracking-wider transition flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Gravar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: SERVICE PAGE DETAIL */}
        {/* ---------------------------------------------------- */}
        {activeTab === "servicePages" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar list of services to select */}
            <div className="lg:col-span-3 bg-[#111] border border-gray-900 p-4 rounded space-y-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-gray-800 pb-3 mb-3">
                Selecionar Serviço
              </h3>
              <div className="space-y-1">
                {servicesList.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleSelectService(service.id)}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-medium uppercase tracking-wider transition ${
                        isSelected 
                          ? "bg-[#C28D35] text-black font-bold" 
                          : "text-gray-400 hover:bg-black/30 hover:text-white"
                      }`}
                    >
                      {service.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editing Form */}
            <div className="lg:col-span-9 bg-[#111] border border-gray-900 p-6 rounded space-y-6">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-3">
                Editar Subpágina: <span className="text-[#C28D35]">{servicesList.find(s => s.id === selectedServiceId)?.title}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Título do Cabeçalho</label>
                  <input
                    type="text"
                    value={servicePageForm.page_title || ""}
                    onChange={(e) => setServicePageForm({ ...servicePageForm, page_title: e.target.value })}
                    className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Frase de Impacto (Slogan)</label>
                  <input
                    type="text"
                    value={servicePageForm.impact_phrase || ""}
                    onChange={(e) => setServicePageForm({ ...servicePageForm, impact_phrase: e.target.value })}
                    className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Descrição Completa</label>
                  <textarea
                    value={servicePageForm.full_description || ""}
                    onChange={(e) => setServicePageForm({ ...servicePageForm, full_description: e.target.value })}
                    rows={5}
                    className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                  />
                </div>

                {/* Applications list */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Aplicações Técnicas</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={appInput}
                      onChange={(e) => setAppInput(e.target.value)}
                      className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      placeholder="Nova aplicação..."
                    />
                    <button
                      onClick={() => {
                        if (!appInput.trim()) return;
                        const list = servicePageForm.applications || [];
                        setServicePageForm({ ...servicePageForm, applications: [...list, appInput.trim()] });
                        setAppInput("");
                      }}
                      className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 bg-black/40 border border-gray-900 p-3 rounded max-h-40 overflow-y-auto">
                    {(servicePageForm.applications || []).length === 0 && <span className="text-[10px] text-gray-600 italic">Lista vazia.</span>}
                    {(servicePageForm.applications || []).map((app: string, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-xs text-gray-300">
                        <span>• {app}</span>
                        <button
                          onClick={() => {
                            const list = servicePageForm.applications.filter((_: any, i: number) => i !== idx);
                            setServicePageForm({ ...servicePageForm, applications: list });
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits list */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Benefícios Principais</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      placeholder="Novo benefício..."
                    />
                    <button
                      onClick={() => {
                        if (!benefitInput.trim()) return;
                        const list = servicePageForm.benefits || [];
                        setServicePageForm({ ...servicePageForm, benefits: [...list, benefitInput.trim()] });
                        setBenefitInput("");
                      }}
                      className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 bg-black/40 border border-gray-900 p-3 rounded max-h-40 overflow-y-auto">
                    {(servicePageForm.benefits || []).length === 0 && <span className="text-[10px] text-gray-600 italic">Lista vazia.</span>}
                    {(servicePageForm.benefits || []).map((benefit: string, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-xs text-gray-300">
                        <span>• {benefit}</span>
                        <button
                          onClick={() => {
                            const list = servicePageForm.benefits.filter((_: any, i: number) => i !== idx);
                            setServicePageForm({ ...servicePageForm, benefits: list });
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products list */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Produtos Relacionados</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      placeholder="Novo produto..."
                    />
                    <button
                      onClick={() => {
                        if (!productInput.trim()) return;
                        const list = servicePageForm.related_products || [];
                        setServicePageForm({ ...servicePageForm, related_products: [...list, productInput.trim()] });
                        setProductInput("");
                      }}
                      className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 bg-black/40 border border-gray-900 p-3 rounded max-h-40 overflow-y-auto">
                    {(servicePageForm.related_products || []).length === 0 && <span className="text-[10px] text-gray-600 italic">Lista vazia.</span>}
                    {(servicePageForm.related_products || []).map((prod: string, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-xs text-gray-300">
                        <span>• {prod}</span>
                        <button
                          onClick={() => {
                            const list = servicePageForm.related_products.filter((_: any, i: number) => i !== idx);
                            setServicePageForm({ ...servicePageForm, related_products: list });
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work process stages list */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Processo de Trabalho (Fases)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={processInput}
                      onChange={(e) => setProcessInput(e.target.value)}
                      className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      placeholder="Nova fase..."
                    />
                    <button
                      onClick={() => {
                        if (!processInput.trim()) return;
                        const list = servicePageForm.work_process || [];
                        setServicePageForm({ ...servicePageForm, work_process: [...list, processInput.trim()] });
                        setProcessInput("");
                      }}
                      className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                    >
                      +
                    </button>
                  </div>
                  <ul className="space-y-1 bg-black/40 border border-gray-900 p-3 rounded max-h-40 overflow-y-auto">
                    {(servicePageForm.work_process || []).length === 0 && <span className="text-[10px] text-gray-600 italic">Lista vazia.</span>}
                    {(servicePageForm.work_process || []).map((step: string, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-xs text-gray-300">
                        <span>• {step}</span>
                        <button
                          onClick={() => {
                            const list = servicePageForm.work_process.filter((_: any, i: number) => i !== idx);
                            setServicePageForm({ ...servicePageForm, work_process: list });
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2 border-t border-gray-900 pt-5">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-4">Chamada de Ação Final (CTA)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Título do CTA</label>
                      <input
                        type="text"
                        value={servicePageForm.final_cta_title || ""}
                        onChange={(e) => setServicePageForm({ ...servicePageForm, final_cta_title: e.target.value })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Texto de Suporte do CTA</label>
                      <input
                        type="text"
                        value={servicePageForm.final_cta_text || ""}
                        onChange={(e) => setServicePageForm({ ...servicePageForm, final_cta_text: e.target.value })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-gray-900 pt-5">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-4">Otimização SEO da Subpágina</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Meta Title</label>
                      <input
                        type="text"
                        value={servicePageForm.seo_title || ""}
                        onChange={(e) => setServicePageForm({ ...servicePageForm, seo_title: e.target.value })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Meta Keywords</label>
                      <input
                        type="text"
                        value={servicePageForm.seo_keywords || ""}
                        onChange={(e) => setServicePageForm({ ...servicePageForm, seo_keywords: e.target.value })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Meta Description</label>
                      <textarea
                        value={servicePageForm.seo_description || ""}
                        onChange={(e) => setServicePageForm({ ...servicePageForm, seo_description: e.target.value })}
                        rows={2}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-5 flex justify-end">
                <button
                  onClick={handleSaveServicePage}
                  disabled={actionLoading === "save_service_page.php"}
                  className="px-6 py-3 bg-[#C28D35] hover:bg-[#FFD700] disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading === "save_service_page.php" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Guardar Detalhes da Página</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: ABOUT US */}
        {/* ---------------------------------------------------- */}
        {activeTab === "about" && (
          <div className="bg-[#111] border border-gray-900 p-6 rounded space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Título Institucional</label>
                <input
                  type="text"
                  value={aboutForm.title || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Descrição Institucional (Sobre Nós)</label>
                <textarea
                  value={aboutForm.description || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                  rows={6}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Missão</label>
                <textarea
                  value={aboutForm.mission || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                  rows={4}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Visão</label>
                <textarea
                  value={aboutForm.vision || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                  rows={4}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Valores (Separados por vírgula)</label>
                <textarea
                  value={aboutForm.values || ""}
                  onChange={(e) => setAboutForm({ ...aboutForm, values: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white"
                  placeholder="Ex: Rigor técnico, Integridade, Inovação..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Imagem Ilustrativa</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aboutForm.image || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                    className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  />
                  <button 
                    onClick={() => openMediaSelector("about", "image")}
                    className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                  >
                    Selecionar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Vídeo Institucional</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aboutForm.video || ""}
                    onChange={(e) => setAboutForm({ ...aboutForm, video: e.target.value })}
                    className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-3 rounded text-sm text-white font-mono"
                  />
                  <button 
                    onClick={() => openMediaSelector("about", "video")}
                    className="px-3 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-xs transition"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-5 flex justify-end">
              <button
                onClick={handleSaveAbout}
                disabled={actionLoading === "save_about.php"}
                className="px-6 py-3 bg-[#C28D35] hover:bg-[#FFD700] disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-2 cursor-pointer"
              >
                {actionLoading === "save_about.php" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Guardar Conteúdo Sobre</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: SUPPLIERS */}
        {/* ---------------------------------------------------- */}
        {activeTab === "suppliers" && (
          <div className="space-y-6">
            
            {/* Form editor overlay/drawer */}
            {editingSupplier ? (
              <div className="bg-[#111] border border-[#C28D35]/40 p-6 rounded space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest text-[#C28D35]">
                  {editingSupplier.id ? "Editar Fornecedor" : "Adicionar Fornecedor"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Nome do Fornecedor</label>
                    <input
                      type="text"
                      value={editingSupplier.name || ""}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Website Link</label>
                    <input
                      type="text"
                      value={editingSupplier.link || ""}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, link: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Logótipo / Imagem URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingSupplier.logo || ""}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, logo: e.target.value })}
                        className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                        required
                      />
                      <button 
                        onClick={() => openMediaSelector("supplier", "logo")}
                        className="px-2 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] transition"
                      >
                        Mídia
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Descrição</label>
                    <textarea
                      value={editingSupplier.description || ""}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, description: e.target.value })}
                      rows={3}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Ordem</label>
                      <input
                        type="number"
                        value={editingSupplier.display_order || 0}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, display_order: parseInt(e.target.value) })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Estado</label>
                      <select
                        value={editingSupplier.is_active || 1}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, is_active: parseInt(e.target.value) })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      >
                        <option value={1}>Ativo</option>
                        <option value={0}>Inativo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setEditingSupplier(null)}
                    className="px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded text-xs uppercase font-bold tracking-wider transition cursor-pointer text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSupplier}
                    className="px-4 py-2 bg-[#C28D35] hover:bg-[#FFD700] text-black font-bold uppercase rounded text-xs tracking-wider transition flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Gravar Fornecedor</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingSupplier({ name: "", logo: "", link: "", description: "", display_order: 0, is_active: 1 })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#C28D35] to-[#A37125] text-black font-bold uppercase tracking-widest text-xs rounded transition duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Fornecedor</span>
                </button>
              </div>
            )}

            <div className="bg-[#111] border border-gray-900 p-6 rounded">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-4 mb-4">
                Fornecedores e Marcas
              </h3>

              {suppliersList.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center font-mono">Nenhum fornecedor registado.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliersList.map((sup) => (
                    <div key={sup.id} className="bg-black/60 border border-gray-900 p-4 rounded flex flex-col justify-between hover:border-[#C28D35]/30 transition duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-gray-900 pb-2">
                          <span className="font-bold text-white text-xs">{sup.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            sup.is_active === 1 ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"
                          }`}>
                            {sup.is_active === 1 ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <div className="w-full h-16 bg-[#1a1a1a] rounded flex items-center justify-center p-2 mb-3">
                          <img src={sup.logo} alt={sup.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2">{sup.description || "Sem descrição"}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 border-t border-gray-900 pt-3 text-[10px] font-mono">
                        <span className="text-gray-500">Ordem: {sup.display_order}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSupplier(sup)}
                            className="p-1 text-gray-400 hover:text-[#C28D35] transition"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(sup.id)}
                            className="p-1 text-red-500 hover:text-red-400 transition"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 8: GALLERY */}
        {/* ---------------------------------------------------- */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            
            {editingGallery ? (
              <div className="bg-[#111] border border-[#C28D35]/40 p-6 rounded space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest text-[#C28D35]">
                  {editingGallery.id ? "Editar Item de Galeria" : "Adicionar Item de Galeria"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Título do Projeto</label>
                    <input
                      type="text"
                      value={editingGallery.title || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Categoria (Slug do Serviço Relacionado)</label>
                    <select
                      value={editingGallery.category || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                    >
                      <option value="">Geral</option>
                      {servicesList.map(s => (
                        <option key={s.id} value={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Imagem URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingGallery.image || ""}
                        onChange={(e) => setEditingGallery({ ...editingGallery, image: e.target.value })}
                        className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                        required
                      />
                      <button 
                        onClick={() => openMediaSelector("gallery", "image")}
                        className="px-2 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] transition"
                      >
                        Mídia
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Descrição do Projeto</label>
                    <textarea
                      value={editingGallery.description || ""}
                      onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                      rows={3}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Ordem</label>
                      <input
                        type="number"
                        value={editingGallery.display_order || 0}
                        onChange={(e) => setEditingGallery({ ...editingGallery, display_order: parseInt(e.target.value) })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Estado</label>
                      <select
                        value={editingGallery.is_active || 1}
                        onChange={(e) => setEditingGallery({ ...editingGallery, is_active: parseInt(e.target.value) })}
                        className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      >
                        <option value={1}>Ativo</option>
                        <option value={0}>Inativo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setEditingGallery(null)}
                    className="px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded text-xs uppercase font-bold tracking-wider transition cursor-pointer text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveGallery}
                    className="px-4 py-2 bg-[#C28D35] hover:bg-[#FFD700] text-black font-bold uppercase rounded text-xs tracking-wider transition flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Gravar Projeto</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingGallery({ title: "", category: "", image: "", description: "", display_order: 0, is_active: 1 })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#C28D35] to-[#A37125] text-black font-bold uppercase tracking-widest text-xs rounded transition duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Projeto</span>
                </button>
              </div>
            )}

            <div className="bg-[#111] border border-gray-900 p-6 rounded">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-4 mb-4">
                Projetos na Galeria
              </h3>

              {galleryList.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center font-mono">Nenhum projeto registado na galeria.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryList.map((item) => (
                    <div key={item.id} className="bg-black/60 border border-gray-900 p-4 rounded flex flex-col justify-between hover:border-[#C28D35]/30 transition duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-gray-900 pb-2">
                          <span className="font-bold text-white text-xs line-clamp-1">{item.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                            item.is_active === 1 ? "bg-green-950 text-green-300" : "bg-red-950 text-red-300"
                          }`}>
                            {item.is_active === 1 ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <div className="w-full aspect-video bg-[#1a1a1a] rounded overflow-hidden mb-3 relative group">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-[#C28D35]/30 text-[#C28D35] text-[8px] font-mono uppercase rounded">
                            {item.category || "geral"}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2">{item.description || "Sem descrição"}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 border-t border-gray-900 pt-3 text-[10px] font-mono">
                        <span className="text-gray-500">Ordem: {item.display_order}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingGallery(item)}
                            className="p-1 text-gray-400 hover:text-[#C28D35] transition"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1 text-red-500 hover:text-red-400 transition"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: MESSAGES LIST */}
        {/* ---------------------------------------------------- */}
        {activeTab === "messages" && (
          <div className="bg-[#111] border border-gray-900 p-6 rounded space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                Pedidos de Contacto Recebidos
              </h3>
              <span className="text-xs text-gray-500 font-mono">{messages.length} mensagens no total</span>
            </div>

            {messages.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center font-mono">Nenhuma mensagem registada.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`border p-5 rounded hover:border-[#C28D35]/30 transition duration-300 ${
                      msg.status === 'new' 
                        ? 'bg-[#151310]/40 border-amber-900/60' 
                        : 'bg-black/40 border-gray-900'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-900 pb-3 mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{msg.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1 font-mono">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-500" /> {msg.phone || "Sem telefone"}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-500" /> <a href={`mailto:${msg.email}`} className="hover:text-[#C28D35] underline">{msg.email}</a></span>
                          {msg.service && <span className="text-[#C28D35] font-bold">Serviço: {msg.service}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-mono text-[10px]">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <select
                            value={msg.status}
                            onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                            className="bg-black border border-gray-800 text-[10px] font-mono px-2 py-1 rounded text-white focus:outline-none focus:border-[#C28D35]"
                          >
                            <option value="new">Novo</option>
                            <option value="replied">Respondido</option>
                            <option value="archived">Arquivado</option>
                          </select>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-red-500 hover:text-red-400 transition"
                            title="Eliminar Mensagem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-gray-950 p-4 rounded text-xs text-gray-300 leading-relaxed font-sans white-space-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 10: MEDIA LIBRARY */}
        {/* ---------------------------------------------------- */}
        {activeTab === "media" && (
          <div className="space-y-6">
            
            {/* Upload Area */}
            <div className="bg-[#111] border border-gray-900 p-6 rounded space-y-4">
              <h3 className="font-bold text-white text-xs uppercase tracking-widest text-gray-400">
                Carregar Mídia
              </h3>
              
              <div className="border-2 border-dashed border-gray-800 hover:border-[#C28D35]/50 rounded-lg p-8 flex flex-col justify-center items-center text-center transition duration-300">
                <Upload className="w-8 h-8 text-[#C28D35] mb-3 animate-[pulse_2s_infinite]" />
                <p className="text-xs text-gray-400 mb-1">Carregue ficheiros de imagem (jpg, png, webp) ou vídeo (mp4, webm).</p>
                <p className="text-[10px] text-gray-600 mb-4 font-mono">Tamanho máximo: Imagens (15MB), Vídeos (100MB).</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp, video/mp4, video/webm"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress !== null}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-[#C28D35] hover:text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-1.5 cursor-pointer text-white"
                >
                  {uploadProgress ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadProgress}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Escolher Ficheiro</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Media list */}
            <div className="bg-[#111] border border-gray-900 p-6 rounded">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Biblioteca de Arquivos</h3>
                <span className="text-xs text-gray-500 font-mono">{mediaList.length} ficheiros no servidor</span>
              </div>

              {mediaList.length === 0 ? (
                <p className="text-xs text-gray-500 py-8 text-center font-mono">Nenhum ficheiro carregado ainda na pasta /uploads.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mediaList.map((media) => {
                    const isVideo = media.file_type === "video";
                    return (
                      <div key={media.id} className="bg-black border border-gray-900 p-2 rounded flex flex-col justify-between hover:border-[#C28D35]/30 transition group">
                        
                        {/* File preview */}
                        <div className="w-full aspect-square bg-[#0c0c0c] rounded overflow-hidden flex items-center justify-center relative mb-2">
                          {isVideo ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <video src={`${API_BASE}/${media.file_path}`} className="w-full h-full object-cover" muted playsInline />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="px-1.5 py-0.5 bg-black border border-gray-800 rounded font-mono text-[7px] text-[#C28D35] uppercase font-bold">
                                  VÍDEO
                                </span>
                              </div>
                            </div>
                          ) : (
                            <img src={`${API_BASE}/${media.file_path}`} alt={media.file_name} className="w-full h-full object-cover" />
                          )}
                        </div>

                        {/* File info */}
                        <div className="text-[9px] font-mono text-gray-500 space-y-1">
                          <span className="block text-gray-300 line-clamp-1" title={media.file_name}>
                            {media.file_name}
                          </span>
                          <span className="block">{(media.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>

                        {/* Interactive actions */}
                        <div className="flex gap-1.5 border-t border-gray-900 pt-2 mt-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(media.file_path);
                              showAlert("success", "Caminho da mídia copiado!");
                            }}
                            className="flex-1 py-1 bg-gray-900 hover:bg-[#C28D35] hover:text-black rounded text-[9px] font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer text-white"
                            title="Copiar URL Relativa"
                          >
                            <Copy className="w-2.5 h-2.5" />
                            <span>Link</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteMedia(media.id)}
                            className="p-1 text-red-500 hover:text-red-400 hover:bg-red-950/20 rounded transition"
                            title="Eliminar Arquivo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 11: SEO SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            
            {editingSeo ? (
              <div className="bg-[#111] border border-[#C28D35]/40 p-6 rounded space-y-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-widest text-[#C28D35]">
                  Editar Metatags SEO
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Caminho da Página (Slug)</label>
                    <input
                      type="text"
                      value={editingSeo.page_slug || ""}
                      onChange={(e) => setEditingSeo({ ...editingSeo, page_slug: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      placeholder="Ex: / ou /servicos/cctv-videovigilancia"
                      required
                      disabled={editingSeo.id !== undefined}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Título da Página (SEO Title)</label>
                    <input
                      type="text"
                      value={editingSeo.seo_title || ""}
                      onChange={(e) => setEditingSeo({ ...editingSeo, seo_title: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Descrição Curta (Meta Description)</label>
                    <textarea
                      value={editingSeo.seo_description || ""}
                      onChange={(e) => setEditingSeo({ ...editingSeo, seo_description: e.target.value })}
                      rows={3}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Palavras-chave (Meta Keywords - separadas por vírgula)</label>
                    <input
                      type="text"
                      value={editingSeo.seo_keywords || ""}
                      onChange={(e) => setEditingSeo({ ...editingSeo, seo_keywords: e.target.value })}
                      className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Imagem Open Graph (OG Image)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingSeo.og_image || ""}
                        onChange={(e) => setEditingSeo({ ...editingSeo, og_image: e.target.value })}
                        className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      />
                      <button 
                        onClick={() => openMediaSelector("seo", "og_image")}
                        className="px-2 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] transition"
                      >
                        Mídia
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">Favicon (SVG Inline ou URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingSeo.favicon || ""}
                        onChange={(e) => setEditingSeo({ ...editingSeo, favicon: e.target.value })}
                        className="flex-1 bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-3 py-2 rounded text-xs text-white font-mono"
                      />
                      <button 
                        onClick={() => openMediaSelector("seo", "favicon")}
                        className="px-2 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] transition"
                      >
                        Mídia
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => setEditingSeo(null)}
                    className="px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded text-xs uppercase font-bold tracking-wider transition cursor-pointer text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveSeo}
                    className="px-4 py-2 bg-[#C28D35] hover:bg-[#FFD700] text-black font-bold uppercase rounded text-xs tracking-wider transition flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Gravar SEO</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingSeo({ page_slug: "", seo_title: "", seo_description: "", seo_keywords: "", og_image: "", favicon: "" })}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#C28D35] to-[#A37125] text-black font-bold uppercase tracking-widest text-xs rounded transition duration-300 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Perfil SEO</span>
                </button>
              </div>
            )}

            <div className="bg-[#111] border border-gray-900 p-6 rounded">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-4 mb-4">
                Configurações de SEO Registadas
              </h3>

              <div className="space-y-4">
                {seoList.map((seo) => (
                  <div key={seo.id} className="bg-black/60 border border-gray-900 p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-black border border-[#C28D35]/30 text-[#C28D35] text-[9px] font-mono uppercase rounded">
                          {seo.page_slug}
                        </span>
                        <h4 className="font-bold text-white text-xs">{seo.seo_title}</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">{seo.seo_description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingSeo(seo)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-[#C28D35] hover:text-black rounded text-[10px] uppercase font-bold tracking-wider transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 12: CHANGE ACCESS DATA */}
        {/* ---------------------------------------------------- */}
        {activeTab === "account" && (
          <div className="bg-[#111] border border-gray-900 p-6 rounded max-w-xl">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-gray-800 pb-4 mb-6">
              Alterar Credenciais do Administrador
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                  Novo Nome de Utilizador (Opcional)
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2.5 rounded text-xs text-white font-mono"
                  placeholder="admin (deixe em branco para manter)"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                  Palavra-passe Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2.5 rounded text-xs text-white font-mono"
                  placeholder="Sua senha atual"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                  Nova Palavra-passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2.5 rounded text-xs text-white font-mono"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                  Confirmar Nova Palavra-passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#C28D35] focus:outline-none px-4 py-2.5 rounded text-xs text-white font-mono"
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>

              <div className="border-t border-gray-800 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading === "password"}
                  className="px-6 py-3 bg-[#C28D35] hover:bg-[#FFD700] disabled:opacity-50 text-black font-bold uppercase tracking-wider text-xs rounded transition flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading === "password" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Atualizar Acesso</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* MEDIA SELECTOR MODAL */}
      {/* ---------------------------------------------------- */}
      {mediaSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#C28D35]/50 w-full max-w-4xl max-h-[85vh] rounded-lg shadow-2xl flex flex-col p-6 overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Selecionar do Servidor</h3>
                <p className="text-[10px] text-gray-500">Escolha um ficheiro da biblioteca de mídia ou carregue um novo.</p>
              </div>
              <button 
                onClick={() => setMediaSelectorOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload inside Modal */}
            <div className="bg-black/50 border border-gray-900 p-4 rounded mb-4 flex items-center justify-between gap-4">
              <span className="text-[10px] text-gray-400 font-mono">Carregar novo arquivo diretamente:</span>
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="modal-file-upload"
                />
                <button
                  onClick={() => document.getElementById("modal-file-upload")?.click()}
                  disabled={uploadProgress !== null}
                  className="px-3 py-1.5 bg-[#C28D35] hover:bg-[#FFD700] text-black font-bold uppercase rounded text-[10px] tracking-wider transition"
                >
                  {uploadProgress ? "A carregar..." : "Fazer Upload"}
                </button>
              </div>
            </div>

            {/* Media list grid inside Modal */}
            <div className="flex-1 overflow-y-auto min-h-0 py-2">
              {mediaList.length === 0 ? (
                <p className="text-xs text-gray-500 py-10 text-center font-mono">Nenhum ficheiro disponível na biblioteca.</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {mediaList.map((media) => {
                    const isVideo = media.file_type === "video";
                    return (
                      <div 
                        key={media.id} 
                        onClick={() => selectMediaForTarget(media.file_path)}
                        className="bg-black border border-gray-900 p-2 rounded flex flex-col justify-between hover:border-[#C28D35] transition cursor-pointer group text-left"
                      >
                        <div className="w-full aspect-square bg-[#0c0c0c] rounded overflow-hidden flex items-center justify-center relative mb-2">
                          {isVideo ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <video src={`${API_BASE}/${media.file_path}`} className="w-full h-full object-cover" muted />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="px-1 py-0.5 bg-black border border-gray-800 rounded font-mono text-[7px] text-[#C28D35] uppercase font-bold">
                                  VÍDEO
                                </span>
                              </div>
                            </div>
                          ) : (
                            <img src={`${API_BASE}/${media.file_path}`} alt={media.file_name} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="text-[8px] font-mono text-gray-500 space-y-0.5">
                          <span className="block text-gray-300 line-clamp-1 group-hover:text-[#C28D35]" title={media.file_name}>
                            {media.file_name}
                          </span>
                          <span className="block">{(media.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-800 pt-4 mt-4 flex justify-end">
              <button
                onClick={() => setMediaSelectorOpen(false)}
                className="px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded text-xs uppercase font-bold tracking-wider text-white"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

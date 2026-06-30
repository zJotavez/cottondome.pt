import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Pilares } from "./components/Pilares";
import { Solutions } from "./components/Solutions";
import { Environments } from "./components/Environments";
import { Partners } from "./components/Partners";
import { HowWeWork } from "./components/HowWeWork";
import { Projects } from "./components/Projects";
import { HeroQuote } from "./components/HeroQuote";
import { About } from "./components/About";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import { ServiceDetail } from "./components/ServiceDetail";
import { AdminDashboard } from "./components/AdminDashboard";
import { CONTACT_INFO } from "./data";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedService, setSelectedService] = useState("");
  const [dbData, setDbData] = useState<any>(null);

  // Load site settings and content from the database
  useEffect(() => {
    fetch(`${API_BASE}/api/get_content.php`)
      .then((res) => {
        if (!res.ok) throw new Error("Database not seeded or offline");
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          setDbData(res);
        }
      })
      .catch((err) => {
        console.warn("Dynamic content unavailable, falling back to static copy.", err);
      });
  }, []);

  // Listening to popstate events (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Copy protection & zoom blocking on public pages
  useEffect(() => {
    if (currentPath.startsWith("/admin")) {
      // Restore default behavior inside the admin panel
      document.documentElement.style.userSelect = "auto";
      document.body.style.userSelect = "auto";
      return;
    }

    // Apply CSS-level select disable
    document.documentElement.style.userSelect = "none";
    document.body.style.userSelect = "none";

    const preventDefault = (e: Event) => e.preventDefault();

    // Disable right click
    document.addEventListener("contextmenu", preventDefault);

    // Disable image & text drag
    document.addEventListener("dragstart", preventDefault);

    // Disable selection start on non-inputs
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
    };
    document.addEventListener("selectstart", handleSelectStart);

    // Disable copy / cut
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      e.preventDefault();
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);

    // Disable developer hotkeys & inspect tool shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Ctrl+C, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+Shift+I, F12
      if (
        (isCtrl && ["c", "u", "s", "p", "x", "a"].includes(key)) ||
        e.key === "F12" ||
        (isCtrl && e.shiftKey && ["i", "j", "c"].includes(key))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Block mobile pinch zoom gestures
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Block mobile double tap zoom
    let lastTouch = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouch < 300) {
        e.preventDefault();
      }
      lastTouch = now;
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPath]);

  // Client-Side SEO metadata update
  useEffect(() => {
    if (dbData?.seo) {
      const currentSeo = dbData.seo.find((item: any) => item.path === currentPath);
      if (currentSeo) {
        document.title = currentSeo.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", currentSeo.meta_description);
      }
    }
  }, [currentPath, dbData]);

  // Dynamically update favicon if set in settings
  useEffect(() => {
    if (dbData?.settings?.favicon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      const favUrl = dbData.settings.favicon;
      link.href = favUrl.startsWith("http") ? favUrl : `${API_BASE}/${favUrl.replace(/^\//, "")}`;
    }
  }, [dbData]);

  // Navigation controller
  const navigate = (path: string) => {
    // If navigating to home section from another route
    if (path.startsWith("/#")) {
      const id = path.split("#")[1];
      window.history.pushState({}, "", "/");
      setCurrentPath("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return;
    }

    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection("contacto");
  };

  const handleClearService = () => {
    setSelectedService("");
  };

  // 1. CONDITIONAL ROUTING: Admin Panel
  if (currentPath.startsWith("/admin")) {
    return (
      <AdminDashboard onLogout={() => navigate("/")} />
    );
  }

  // Public Layout logic
  const isServicePage = currentPath.startsWith("/servicos/");

  // Resolve Whatsapp Link
  const whatsappVal = dbData?.settings?.whatsapp || CONTACT_INFO.whatsapp;
  const isWhatsappPlaceholder = whatsappVal.includes("[");
  const cleanWhatsappNumber = isWhatsappPlaceholder ? "351918880788" : whatsappVal.replace(/[^\d]/g, "");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanWhatsappNumber}&text=${encodeURIComponent("Olá Cotton Dome, gostaria de obter mais informações.")}`;

  return (
    <div className="min-h-screen bg-[#050505] text-[#CFCFCF] font-sans antialiased selection:bg-[#C28D35] selection:text-[#050505]">
      {/* Dynamic Header */}
      <Header
        logo={dbData?.settings?.logo}
        onQuoteClick={() => {
          if (isServicePage) {
            navigate("/#contacto");
          } else {
            scrollToSection("contacto");
          }
        }}
        onNavigate={navigate}
        currentPath={currentPath}
      />

      {isServicePage ? (
        // Render dynamic service details page
        <ServiceDetail 
          slug={currentPath.replace("/servicos/", "")} 
          onNavigate={navigate}
          services={dbData?.services}
          pages={dbData?.service_pages}
        />
      ) : (
        // Render full home page
        <main>
          {/* First Fold: Hero */}
          <Hero
            content={dbData?.home}
            onQuoteClick={() => scrollToSection("contacto")}
            onExploreClick={() => scrollToSection("solucoes")}
          />

          {/* Value Pillars */}
          <Pilares />

          {/* Services & Solutions Grid */}
          <Solutions 
            onNavigate={navigate}
            services={dbData?.services}
          />

          {/* Bento Grid: Environments Served */}
          <Environments />

          {/* Prestigious Partners */}
          <Partners 
            suppliers={dbData?.suppliers}
          />

          {/* Chronological Workflow */}
          <HowWeWork />

          {/* Gallery of Projects */}
          <Projects 
            gallery={dbData?.gallery}
          />

          {/* Slogan Quote Section */}
          <HeroQuote onTalkClick={() => scrollToSection("contacto")} />

          {/* Institutional About */}
          <About 
            content={dbData?.about}
          />

          {/* Contact Form with auto-filling dropdowns */}
          <ContactForm
            selectedService={selectedService}
            onClearService={handleClearService}
            settings={dbData?.settings}
            services={dbData?.services}
          />
        </main>
      )}

      {/* Dynamic footer info */}
      <Footer 
        onNavigate={navigate}
        settings={dbData?.settings}
      />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-[0_4px_18px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:animate-none"></span>
        <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.45 5.616 1.452 5.563 0 10.09-4.52 10.093-10.078.002-2.693-1.04-5.226-2.93-7.117-1.89-1.89-4.407-2.93-7.102-2.93-5.57 0-10.096 4.519-10.099 10.078-.001 2.05.539 4.05 1.561 5.8l-.96 3.512 3.6-.945zm11.381-4.834c-.312-.156-1.848-.912-2.131-1.015-.282-.104-.489-.156-.691.157-.204.312-.781 1.015-.957 1.218-.175.203-.35.23-.661.073-.312-.156-1.316-.486-2.507-1.55-.926-.826-1.553-1.847-1.734-2.16-.182-.313-.018-.482.138-.636.14-.138.312-.363.469-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.691-1.666-.947-2.28-.248-.599-.501-.518-.69-.527l-.589-.009c-.204 0-.535.077-.816.381-.28.305-1.071 1.047-1.071 2.554 0 1.507 1.096 2.965 1.249 3.172.152.208 2.157 3.295 5.225 4.617.729.314 1.298.502 1.742.643.731.233 1.396.2 1.923.122.587-.088 1.848-.756 2.11-1.448.263-.693.263-1.289.185-1.413-.078-.124-.282-.204-.595-.36z"/>
        </svg>
      </a>
    </div>
  );
}

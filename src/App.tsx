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
import { LanguageSelector } from "./components/LanguageSelector";
import { ChatBot } from "./components/ChatBot";
import { TRANSLATIONS } from "./translations";
import { CONTACT_INFO } from "./data";
import { getSiteContent } from "./lib/database";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedService, setSelectedService] = useState("");
  const [dbData, setDbData] = useState<any>(null);
  const [language, setLanguage] = useState<"pt" | "en" | "fr">(() => {
    const saved = localStorage.getItem("cotton-dome-lang");
    return (saved === "pt" || saved === "en" || saved === "fr") ? saved : "pt";
  });

  const handleLangChange = (lang: "pt" | "en" | "fr") => {
    setLanguage(lang);
    localStorage.setItem("cotton-dome-lang", lang);
  };

  // Load site content from Supabase
  useEffect(() => {
    getSiteContent()
      .then((res) => {
        if (res.success && res.data) {
          setDbData(res.data);
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
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
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
      <AdminDashboard onNavigate={navigate} />
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
        lang={language}
      />

      {isServicePage ? (
        // Render dynamic service details page
        <ServiceDetail 
          slug={currentPath.replace("/servicos/", "")} 
          onNavigate={navigate}
          services={dbData?.services}
          pages={dbData?.service_pages}
          lang={language}
        />
      ) : (
        // Render full home page
        <main>
          {/* First Fold: Hero */}
          <Hero
            content={dbData?.home}
            onQuoteClick={() => scrollToSection("contacto")}
            onExploreClick={() => scrollToSection("solucoes")}
            lang={language}
          />

          {/* Value Pillars */}
          <Pilares lang={language} />

          {/* Services & Solutions Grid */}
          <Solutions 
            onNavigate={navigate}
            services={dbData?.services}
            lang={language}
          />

          {/* Bento Grid: Environments Served */}
          <Environments lang={language} />

          {/* Prestigious Partners */}
          <Partners 
            suppliers={dbData?.suppliers}
            lang={language}
          />

          {/* Chronological Workflow */}
          <HowWeWork lang={language} />

          {/* Gallery of Projects */}
          <Projects 
            gallery={dbData?.gallery}
            lang={language}
          />

          {/* Slogan Quote Section */}
          <HeroQuote onTalkClick={() => scrollToSection("contacto")} lang={language} />

          {/* Institutional About */}
          <About 
            content={dbData?.about}
            lang={language}
          />

          {/* Contact Form with auto-filling dropdowns */}
          <ContactForm
            selectedService={selectedService}
            onClearService={handleClearService}
            settings={dbData?.settings}
            services={dbData?.services}
            lang={language}
          />
        </main>
      )}

      {/* Dynamic footer info */}
      <Footer 
        onNavigate={navigate}
        settings={dbData?.settings}
        lang={language}
      />

      {/* Language Selector Button */}
      <LanguageSelector currentLang={language} onLangChange={handleLangChange} />

      {/* AI ChatBot Assistant */}
      <ChatBot lang={language} />
    </div>
  );
}

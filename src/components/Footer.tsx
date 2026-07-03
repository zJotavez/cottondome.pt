import React from "react";
import { ChevronRight, Phone, MapPin } from "lucide-react";
import { CONTACT_INFO } from "../data";
import { SiteSettings } from "../types";
import { TRANSLATIONS } from "../translations";

interface FooterProps {
  onNavigate: (path: string) => void;
  settings?: SiteSettings;
  lang?: "pt" | "en" | "fr";
}

export function Footer({ onNavigate, settings, lang = "pt" }: FooterProps) {
  const t = TRANSLATIONS[lang];
  const currentYear = 2026;

  const phoneVal = settings?.phone || CONTACT_INFO.phone;
  const emailVal = "suporte@domme.pt";
  const addressVal = settings?.address || CONTACT_INFO.address;
  const logo = settings?.logo;

  const logoSrc = logo && logo !== "" ? (logo.startsWith("http") ? logo : `${import.meta.env.VITE_API_URL || ''}/${logo.replace(/^\//, '')}`) : "/images/logo.png";

  const isPhonePlaceholder = phoneVal.includes("[");
  const phoneHref = isPhonePlaceholder ? "#contacto" : `tel:${phoneVal.replace(/[^\d+]/g, "")}`;

  const quickLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.solutions, href: "#solucoes" },
    { label: lang === "pt" ? "Fornecedores" : lang === "en" ? "Suppliers" : "Fournisseurs", href: "#fornecedores" },
    { label: t.nav.projects, href: "#projetos" },
    { label: lang === "pt" ? "Sobre Nós" : lang === "en" ? "About Us" : "À Propos", href: "#sobre" },
    { label: t.nav.contact, href: "#contacto" },
  ];

  const mainServices = [
    { label: t.services.cctv.title.split(" / ")[0], href: "#solucoes" },
    { label: t.services.intrusao.title, href: "#solucoes" },
    { label: t.services.acessos.title, href: "#solucoes" },
    { label: t.services.incendio.title, href: "#solucoes" },
    { label: t.services.automatismos.title, href: "#solucoes" },
    { label: t.services.redes.title.split(" & ")[0], href: "#solucoes" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate("/" + href);
  };

  const footerDesc = lang === "pt"
    ? "Desenvolvimento e integração de soluções inteligentes premium de segurança eletrónica, automação e infraestrutura de telecomunicações para clientes corporativos e residenciais em Portugal."
    : lang === "en"
    ? "Development and integration of premium smart electronic security solutions, automation and telecommunications infrastructure for corporate and residential clients in Portugal."
    : "Développement et intégration de solutions intelligentes premium de sécurité électronique, d'automatisation et d'infrastructures de télécommunications pour clients corporatifs et résidentiels au Portugal.";

  return (
    <footer className="bg-[#050505] border-t border-[#1e1e1e] pt-16 pb-8 relative overflow-hidden">
      {/* Subtle bottom decorative line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C28D35]/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
          
          {/* Col 1: Brand & Desc */}
          <div className="lg:col-span-4">
            <a 
              href="#home" 
              onClick={(e) => handleLinkClick(e, "#home")}
              className="flex items-center gap-3 mb-6 group"
            >
              <img 
                src={logoSrc} 
                alt="Cotton Dome Logo" 
                className="w-12 h-12 object-contain transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="flex flex-col">
                <span className="text-white font-bold tracking-widest text-lg leading-none uppercase">
                  COTTON DOME
                </span>
                <span className="text-[#C28D35] text-[9px] tracking-[0.25em] font-semibold uppercase mt-1 leading-none">
                  SECURITY SOLUTIONS <span className="text-white bg-[#C28D35]/20 px-1 rounded-[1px] text-[8px] ml-0.5">LDA</span>
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed mb-6">
              {footerDesc}
            </p>
            <span className="text-xs font-mono text-[#C28D35]">
              {t.solutions.title}
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-6">
              {lang === "pt" ? "Navegação" : lang === "en" ? "Navigation" : "Navigation"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="group flex items-center gap-1 text-xs text-gray-400 hover:text-[#C28D35] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C28D35] opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-6">
              {lang === "pt" ? "Soluções Técnicas" : lang === "en" ? "Technical Solutions" : "Solutions Techniques"}
            </h4>
            <ul className="space-y-3">
              {mainServices.map((srv) => (
                <li key={srv.label}>
                  <a
                    href={srv.href}
                    onClick={(e) => handleLinkClick(e, srv.href)}
                    className="group flex items-center gap-1 text-xs text-gray-400 hover:text-[#C28D35] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C28D35] opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0" />
                    <span>{srv.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-6">
              {lang === "pt" ? "Contactos" : "Contacts"}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C28D35] mt-0.5 flex-shrink-0" />
                <a 
                  href={phoneHref} 
                  onClick={(e) => {
                    if (isPhonePlaceholder) handleLinkClick(e, "#contacto");
                  }}
                  className="text-xs text-gray-400 hover:text-white font-mono leading-relaxed"
                >
                  {phoneVal}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C28D35] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-400 leading-relaxed">
                  {addressVal}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom trust bar matching the design theme */}
        <div className="border-t border-[#C28D35]/20 py-6 mt-8 mb-4 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-[#CFCFCF]/50 gap-4">
          <div className="flex flex-wrap gap-6 md:gap-12 justify-center md:justify-start">
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">01.</span> {lang === "pt" ? "Qualidade Superior" : lang === "en" ? "Superior Quality" : "Qualité Supérieure"}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">02.</span> {lang === "pt" ? "Confiança Absoluta" : lang === "en" ? "Absolute Trust" : "Confiance Absolue"}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">03.</span> {lang === "pt" ? "Rigor Técnico" : lang === "en" ? "Technical Rigor" : "Rigueur Technique"}
            </div>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-white/20">Partners: Motorline | Visiotech</span>
          </div>
        </div>

        {/* Bottom copyright disclaimer bar */}
        <div className="border-t border-[#1e1e1e] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={logoSrc} 
              alt="Cotton Dome Logo" 
              className="w-5 h-5 object-contain opacity-40 hover:opacity-100 transition-opacity duration-300" 
            />
            <p className="text-[11px] text-gray-500 font-sans text-center sm:text-left">
              © {currentYear} Cotton Dome LDA. {lang === "pt" ? "Todos os direitos reservados." : lang === "en" ? "All rights reserved." : "Tous droits réservés."}
            </p>
          </div>
          <div className="flex gap-6 text-[10px] text-gray-500 font-sans">
            <span className="hover:text-[#C28D35] cursor-pointer transition-colors">
              {lang === "pt" ? "Termos de Utilização" : lang === "en" ? "Terms of Use" : "Conditions d'Utilisation"}
            </span>
            <span className="hover:text-[#C28D35] cursor-pointer transition-colors">
              {lang === "pt" ? "Política de Privacidade" : lang === "en" ? "Privacy Policy" : "Politique de Confidentialité"}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

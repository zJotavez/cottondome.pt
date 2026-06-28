import React from "react";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO } from "../data";

interface FooterProps {
  onNavigate: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = 2026;

  const isPhonePlaceholder = CONTACT_INFO.phone.includes("[");
  const phoneHref = isPhonePlaceholder ? "#contacto" : `tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, "")}`;

  const isEmailPlaceholder = CONTACT_INFO.email.includes("[");
  const emailHref = isEmailPlaceholder ? "#contacto" : `mailto:${CONTACT_INFO.email}`;

  const quickLinks = [
    { label: "Início", href: "#home" },
    { label: "Soluções", href: "#solucoes" },
    { label: "Fornecedores", href: "#fornecedores" },
    { label: "Projetos", href: "#projetos" },
    { label: "Sobre Nós", href: "#sobre" },
    { label: "Contacto", href: "#contacto" },
  ];

  const mainServices = [
    { label: "Videovigilância (CCTV)", href: "#solucoes" },
    { label: "Sistemas de Alarme", href: "#solucoes" },
    { label: "Controlo de Acessos", href: "#solucoes" },
    { label: "Deteção de Incêndio", href: "#solucoes" },
    { label: "Automatismos", href: "#solucoes" },
    { label: "Redes & Telecomunicações", href: "#solucoes" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate("/" + href);
  };

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
              className="flex items-center gap-2 mb-6 group"
            >
              <img 
                src="/images/logo.png" 
                alt="Cotton Dome Logo" 
                className="w-10 h-10 object-contain" 
              />
              <div className="flex flex-col">
                <span className="font-display text-sm tracking-widest text-white font-bold leading-none">
                  COTTON DOME
                </span>
                <span className="text-[9px] font-sans font-semibold tracking-wider text-[#C28D35] leading-none mt-1">
                  SECURITY SOLUTIONS LDA
                </span>
              </div>
            </a>
            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed mb-6">
              Desenvolvimento e integração de soluções inteligentes premium de segurança eletrónica, automação e infraestrutura de telecomunicações para clientes corporativos e residenciais em Portugal.
            </p>
            <span className="text-xs font-mono text-[#C28D35]">
              Soluções inteligentes para a sua segurança
            </span>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white mb-6">
              Navegação
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
              Soluções Técnicas
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
              Contactos
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
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C28D35] mt-0.5 flex-shrink-0" />
                <a 
                  href={emailHref} 
                  onClick={(e) => {
                    if (isEmailPlaceholder) handleLinkClick(e, "#contacto");
                  }}
                  className="text-xs text-gray-400 hover:text-white leading-relaxed"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C28D35] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-400 leading-relaxed">
                  {CONTACT_INFO.address}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom trust bar matching the design theme */}
        <div className="border-t border-[#C28D35]/20 py-6 mt-8 mb-4 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-[#CFCFCF]/50 gap-4">
          <div className="flex flex-wrap gap-6 md:gap-12 justify-center md:justify-start">
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">01.</span> Qualidade Superior
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">02.</span> Confiança Absoluta
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C28D35]">03.</span> Rigor Técnico
            </div>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-white/20">Partners: Motorline | Visiotech</span>
          </div>
        </div>

        {/* Bottom copyright disclaimer bar */}
        <div className="border-t border-[#1e1e1e] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-gray-500 font-sans text-center sm:text-left">
            © {currentYear} Cotton Dome LDA. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-[10px] text-gray-500 font-sans">
            <span className="hover:text-[#C28D35] cursor-pointer transition-colors">Termos de Utilização</span>
            <span className="hover:text-[#C28D35] cursor-pointer transition-colors">Política de Privacidade</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Phone, ArrowLeft } from "lucide-react";
import { CONTACT_INFO } from "../data";

interface HeaderProps {
  onQuoteClick: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
  logo?: string;
}

export function Header({ onQuoteClick, onNavigate, currentPath, logo }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "#home" },
    { name: "Soluções", href: "#solucoes" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contacto", href: "#contacto" },
  ];

  const mobileNavLinks = [
    { name: "Início", href: "#home" },
    { name: "Soluções", href: "#solucoes" },
    { name: "Projetos", href: "#projetos" },
    { name: "Contacto", href: "#contacto" },
  ];

  const isServicePage = currentPath.startsWith("/servicos/");

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (isServicePage) {
      e.preventDefault();
      onNavigate("/" + href);
    } else {
      // Regular anchor scrolling
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const logoSrc = logo && logo !== "" ? (logo.startsWith("http") ? logo : `${import.meta.env.VITE_API_URL || ''}/${logo.replace(/^\//, '')}`) : "/images/logo.png";

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#222222] py-4 shadow-lg shadow-black/50"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo or Back Button */}
            {isServicePage ? (
              <button
                onClick={() => onNavigate("/")}
                className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-[#C28D35]/50 bg-[#111111]/80 hover:bg-[#111111] text-xs font-display font-bold uppercase tracking-wider text-[#CFCFCF] hover:text-[#C28D35] rounded transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para a Home</span>
              </button>
            ) : (
              <a 
                href="#home" 
                onClick={(e) => handleLinkClick(e, "#home")}
                className="flex items-center gap-3 group"
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
            )}

            {/* Desktop Navigation - Hidden on Service pages */}
            {!isServicePage && (
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-[#CFCFCF] hover:text-[#C28D35] transition-colors duration-300 text-[11px] font-bold uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            )}

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={onQuoteClick}
                className="px-6 py-2.5 btn-gold-premium rounded text-[11px] font-bold uppercase tracking-widest cursor-pointer"
              >
                Solicitar Orçamento
              </button>
            </div>

            {/* Mobile Menu Button - Hidden on Service pages */}
            {!isServicePage && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-md text-[#CFCFCF] hover:text-[#C28D35] focus:outline-none transition-colors"
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer - Optimized navigation and button design */}
      <AnimatePresence>
        {isOpen && !isServicePage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-[#050505]/98 border-b border-[#C28D35]/30 shadow-2xl py-6 px-6 md:hidden flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              {mobileNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="font-display text-xs uppercase tracking-widest text-[#CFCFCF] hover:text-[#C28D35] py-2.5 border-b border-white/5 font-bold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onQuoteClick();
                }}
                className="w-full btn-gold-premium font-display font-extrabold uppercase tracking-widest py-3.5 rounded text-xs text-center cursor-pointer"
              >
                Solicitar Orçamento
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

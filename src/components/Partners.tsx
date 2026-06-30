import React from "react";
import { motion } from "motion/react";
import { PARTNERS } from "../data";
import { ExternalLink, Check } from "lucide-react";
import { DbSupplier } from "../types";

interface PartnersProps {
  suppliers?: DbSupplier[];
}

export function Partners({ suppliers }: PartnersProps) {
  // Use DB suppliers if provided, else fall back to static data
  const activeSuppliers = suppliers && suppliers.length > 0 ? suppliers : PARTNERS;

  // Generic focus points for dynamically added brands
  const getSupplierFocus = (sup: any) => {
    if (sup.focus && Array.isArray(sup.focus)) {
      return sup.focus;
    }
    const nameLower = sup.name.toLowerCase();
    if (nameLower.includes("motorline")) {
      return [
        "Motores de alto rendimento para portões",
        "Barreiras automáticas e pilares retráteis",
        "Sistemas integrados de controlo de acessos"
      ];
    }
    if (nameLower.includes("visiotech")) {
      return [
        "Equipamentos de CCTV e inteligência analítica",
        "Sistemas avançados de deteção de intrusão",
        "Centrais e sensores certificados de incêndio"
      ];
    }
    return [
      "Integração de equipamentos certificados",
      "Soluções de alta fiabilidade operacional",
      "Garantia de conformidade técnica e durabilidade"
    ];
  };

  return (
    <section id="fornecedores" className="py-16 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Decorative background grids */}
      <div className="absolute inset-y-0 right-0 w-1/3 opacity-[0.02] tech-grid pointer-events-none"></div>

      {/* Top infinite marquee banner */}
      <div className="w-full bg-black/60 border-y border-[#C28D35]/15 py-3.5 mb-16 overflow-hidden relative z-10">
        <div className="animate-marquee-ltr flex items-center gap-12 whitespace-nowrap">
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#C28D35]">✦ GARANTIA DE QUALIDADE MÁXIMA</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ FORNECEDORES DE REFERÊNCIA GLOBAL</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#C28D35]">✦ EQUIPAMENTOS 100% HOMOLOGADOS</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ RIGOR TÉCNICO E DE ENGENHARIA</span>
          
          {/* Duplicates */}
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#C28D35]">✦ GARANTIA DE QUALIDADE MÁXIMA</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ FORNECEDORES DE REFERÊNCIA GLOBAL</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#C28D35]">✦ EQUIPAMENTOS 100% HOMOLOGADOS</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ RIGOR TÉCNICO E DE ENGENHARIA</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-3"
          >
            Credibilidade & Parcerias
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            Fornecedores de referência
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            Trabalhamos com produtos e soluções de fornecedores reconhecidos no mercado global.
          </motion.p>
        </div>

        {/* Partners Cards (Desktop Grid) */}
        <div className="hidden md:grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {activeSuppliers.map((partner: any, idx) => {
            const linkUrl = partner.link || partner.website || "#";
            const logoUrl = partner.logo;
            const focusPoints = getSupplierFocus(partner);

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="card-luxury rounded-xl p-8 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Partner Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500 mb-1">
                        FORNECEDOR DE REFERÊNCIA
                      </span>
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-[#E2AF55] transition-colors duration-300">
                        {partner.name}
                      </h3>
                    </div>
                    {linkUrl && linkUrl !== "#" && (
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded bg-[#1A1A1A] hover:bg-[#E2AF55] hover:text-black text-gray-400 border border-white/5 transition-colors duration-300 flex items-center justify-center"
                        aria-label={`Visitar o site da ${partner.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Logo visualization */}
                  {logoUrl && (
                    <div className="w-full h-14 bg-black/45 border border-white/5 rounded-lg flex items-center justify-center p-3 mb-6">
                      <img src={logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain filter brightness-95 group-hover:brightness-100 transition" />
                    </div>
                  )}

                  {/* Partner Description */}
                  <p className="text-xs sm:text-sm text-[#D9D9D9] font-sans leading-relaxed mb-6">
                    {partner.description}
                  </p>

                  {/* Focus List */}
                  <div className="border-t border-[#222222] pt-4 mb-6">
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-3">
                      Soluções de Confiança Integradas:
                    </span>
                    <div className="space-y-2">
                      {focusPoints.map((item: string, itemIdx: number) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E2AF55]"></div>
                          <span className="text-xs text-[#D9D9D9] font-sans">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status footer inside card */}
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/45 px-3 py-2 rounded border border-white/5 font-mono">
                  <Check className="w-3.5 h-3.5 text-[#E2AF55]" />
                  <span>Integração de equipamentos originais certificados</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Partners Carousel (Marquee, hidden on Desktop) */}
        <div className="md:hidden overflow-hidden relative py-4 w-full select-none">
          <div className="animate-marquee-ltr flex gap-4 whitespace-nowrap min-w-full">
            {[...activeSuppliers, ...activeSuppliers].map((partner: any, idx) => {
              const linkUrl = partner.link || partner.website || "#";
              const focusPoints = getSupplierFocus(partner);

              return (
                <div
                  key={`${partner.id}-mobile-${idx}`}
                  className="inline-block card-luxury rounded-xl p-5 w-[270px] shrink-0 whitespace-normal relative group"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500 mb-0.5">
                        FORNECEDOR DE REFERÊNCIA
                      </span>
                      <h3 className="font-display font-bold text-sm text-white group-hover:text-[#E2AF55] transition-colors leading-tight">
                        {partner.name}
                      </h3>
                    </div>
                    {linkUrl && linkUrl !== "#" && (
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded bg-[#1A1A1A] text-gray-400 border border-white/5 flex items-center justify-center"
                        aria-label={`Visitar o site da ${partner.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-[10px] text-[#D9D9D9] font-sans leading-relaxed mb-4 h-[60px] line-clamp-3">
                    {partner.description}
                  </p>

                  <div className="border-t border-[#222222] pt-3 mb-4">
                    <span className="block font-display text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                      Soluções Integradas:
                    </span>
                    <div className="space-y-1.5">
                      {focusPoints.map((item: string, itemIdx: number) => (
                        <div key={itemIdx} className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-[#E2AF55] flex-shrink-0"></div>
                          <span className="text-[10px] text-[#D9D9D9] font-sans truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-gray-500 bg-black/45 px-2 py-1.5 rounded border border-white/5 font-mono">
                    <Check className="w-3 h-3 text-[#E2AF55] flex-shrink-0" />
                    <span className="truncate">Equipamentos originais certificados</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust disclaimer as requested */}
        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-12 font-sans max-w-xl mx-auto italic">
          * A Cotton Dome LDA trabalha com produtos e soluções de fornecedores reconhecidos.
        </p>

      </div>

      {/* Bottom infinite marquee banner */}
      <div className="w-full bg-black/60 border-y border-[#E2AF55]/15 py-3.5 mt-16 overflow-hidden relative z-10">
        <div className="animate-marquee-rtl flex items-center gap-12 whitespace-nowrap">
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ ASSISTÊNCIA TÉCNICA DEDICADA</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#E2AF55]">✦ COMPROMISSO DE RIGOR E FIABILIDADE</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ INSTALAÇÕES SEGURAS E DURADOURAS</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#E2AF55]">✦ SATISFAÇÃO TOTAL DO CLIENTE</span>
          
          {/* Duplicates */}
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ ASSISTÊNCIA TÉCNICA DEDICADA</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#E2AF55]">✦ COMPROMISSO DE RIGOR E FIABILIDADE</span>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-white">✦ INSTALAÇÕES SEGURAS E DURADOURAS</span>
        </div>
      </div>
    </section>
  );
}

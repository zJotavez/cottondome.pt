import React from "react";
import { SERVICES_DATA } from "../servicesData";
import { LucideIcon } from "./LucideIcon";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { DbService } from "../types";
import { TRANSLATIONS } from "../translations";
import { mapSlugToKey } from "../slugUtils";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface SolutionsProps {
  onNavigate: (path: string) => void;
  services?: DbService[];
  lang?: "pt" | "en" | "fr";
}

export function Solutions({ onNavigate, services, lang = "pt" }: SolutionsProps) {
  // Use DB services if provided, else use static fallback data
  const activeServices = services && services.length > 0 ? services : SERVICES_DATA;
  const t = TRANSLATIONS[lang];

  // Resolve media URLs
  const resolveMediaUrl = (url: string | undefined, defaultUrl: string) => {
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

  return (
    <section id="solucoes" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-[#C28D35]/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-[#D09B42]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-3"
          >
            {t.solutions.tag}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            {t.solutions.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            {t.solutions.subtitle}
          </motion.p>
        </div>

        {/* Services Grid (2 columns on Mobile, 3 on Large) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {activeServices.map((sol: any, idx) => {
            const shortDesc = sol.short_description || sol.shortDescription || "";
            const iconName = sol.icon || sol.iconName || "Camera";
            const serviceImg = resolveMediaUrl(sol.image, "");

            // Look up localized text
            const serviceKey = mapSlugToKey(sol.slug);
            const translation = t.services[serviceKey];
            const displayTitle = translation ? translation.title : sol.title;
            const displayDesc = translation ? translation.shortDesc : shortDesc;

            return (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                onClick={() => onNavigate(`/servicos/${sol.slug}`)}
                className="card-luxury rounded-xl p-3 sm:p-6 flex flex-col justify-between h-[165px] sm:h-[210px] group cursor-pointer relative overflow-hidden"
              >
                {/* Card Background Photo */}
                <img
                  src={serviceImg}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500 pointer-events-none z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-[#111111]/80 z-0 pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Header: Icon and Category badge */}
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 group-hover:border-[#E2AF55] flex items-center justify-center text-[#E2AF55] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <LucideIcon name={iconName} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-display font-bold text-xs sm:text-base text-white tracking-wide mb-1 sm:mb-2 group-hover:text-[#E2AF55] transition-colors leading-tight">
                    {displayTitle.includes(" / ") ? displayTitle.split(" / ")[0] : displayTitle}
                  </h3>

                  {/* Short Description */}
                  <p className="text-[10px] sm:text-xs text-[#D9D9D9] font-sans leading-tight sm:leading-normal line-clamp-2">
                    {displayDesc}
                  </p>
                </div>

                {/* Action Button: Saber mais */}
                <div className="relative z-10 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-wider text-[#B8B8B8] group-hover:text-[#E2AF55] transition-colors mt-2 sm:mt-4">
                  <span>{t.solutions.learnMore}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS } from "../data";
import { Shield, Eye } from "lucide-react";
import { DbGallery } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface ProjectsProps {
  gallery?: DbGallery[];
}

export function Projects({ gallery }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Todos os Projetos" },
    { id: "cctv", label: "CCTV" },
    { id: "automatismos", label: "Automatismos" },
    { id: "acessos", label: "Acessos" },
    { id: "redes", label: "Redes" },
    { id: "incendio", label: "Incêndio" },
  ];

  // Use DB gallery if provided, else use static data
  const activeProjects = gallery && gallery.length > 0 ? gallery : PROJECTS;

  const filteredProjects = activeProjects.filter((proj) => {
    return activeFilter === "all" || proj.category === activeFilter;
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "cctv": return "CCTV / Videovigilância";
      case "automatismos": return "Automatismos / Portões";
      case "acessos": return "Controlo de Acessos";
      case "redes": return "Redes & Telecomunicações";
      case "incendio": return "Deteção de Incêndio";
      default: return cat.toUpperCase();
    }
  };

  const resolveImageUrl = (img: string) => {
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
      return img;
    }
    return `${API_BASE}/${img}`;
  };

  return (
    <section id="projetos" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Mesh grid background (tech-grid) */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-40"></div>

      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-[#C28D35]/3 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-3"
          >
            Portefólio de Referência
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            Aplicações e Projetos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            Explore o nível de acabamento técnico e de engenharia que aplicamos em cada instalação real. Cada imagem representa a excelência e o compromisso da Cotton Dome LDA.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded font-display text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-[#C28D35] text-black shadow-lg shadow-[#C28D35]/15"
                  : "bg-[#111111] text-[#CFCFCF] border border-white/5 hover:border-[#C28D35]/40"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid (2 columns on Mobile, 3 on Large) */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj: any, idx) => {
              const categoryLabel = proj.categoryLabel || getCategoryLabel(proj.category);
              const imgUrl = resolveImageUrl(proj.image);

              return (
                <motion.div
                  layout
                  key={proj.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative rounded-xl overflow-hidden card-luxury ${
                    idx % 2 === 0 ? "h-[295px] sm:h-[410px]" : "h-[355px] sm:h-[410px]"
                  }`}
                >
                  {/* Image Wrap */}
                  <div className={`relative w-full overflow-hidden ${
                    idx % 2 === 0 ? "h-[165px] sm:h-[250px]" : "h-[225px] sm:h-[250px]"
                  }`}>
                    {/* Subtle Golden Outline Ring */}
                    <div className="absolute inset-2 border border-[#E2AF55]/10 group-hover:border-[#E2AF55]/35 rounded-lg z-20 pointer-events-none transition-all duration-500"></div>

                    <img
                      src={imgUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover mix-blend-luminosity brightness-75 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-750 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/25 to-transparent z-10"></div>
                    
                    {/* Hover Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/40">
                      <div className="w-10 h-10 rounded-full bg-[#E2AF55] flex items-center justify-center text-black shadow-lg shadow-[#E2AF55]/35">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="h-[130px] sm:h-[160px] p-3 sm:p-5 flex flex-col justify-start gap-0.5 sm:gap-1">
                    <div>
                      <span className="font-mono text-[8px] sm:text-[9px] text-[#E2AF55] uppercase tracking-widest block mb-0.5">
                        {categoryLabel}
                      </span>
                      <h3 className="font-display font-bold text-xs sm:text-base text-white group-hover:text-[#E2AF55] transition-colors duration-300 leading-tight">
                        {proj.title}
                      </h3>
                    </div>
                    <p className="text-[10px] sm:text-xs text-[#D9D9D9] font-sans line-clamp-2 mt-1 leading-normal sm:leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

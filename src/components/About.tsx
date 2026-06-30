import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Cpu, Network, CheckCircle2 } from "lucide-react";
import { AboutContent } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface AboutProps {
  content?: AboutContent;
}

export function About({ content }: AboutProps) {
  const bulletPoints = [
    { text: "Instalações profissionais sob rigorosos critérios de engenharia", icon: <CheckCircle2 className="w-4 h-4 text-[#E2AF55]" /> },
    { text: "Equipamentos de alto padrão tecnológico (Motorline e Visiotech)", icon: <CheckCircle2 className="w-4 h-4 text-[#E2AF55]" /> },
    { text: "Projetos 100% personalizados, ajustados ao seu espaço real", icon: <CheckCircle2 className="w-4 h-4 text-[#E2AF55]" /> },
    { text: "Suporte pós-instalação de alta fiabilidade em território nacional", icon: <CheckCircle2 className="w-4 h-4 text-[#E2AF55]" /> },
  ];

  // Resolve media URLs (check if they are relative DB uploads or absolute links)
  const resolveMediaUrl = (url: string | undefined, defaultUrl: string) => {
    if (!url) return defaultUrl;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${API_BASE}/${url}`;
  };

  const aboutTitle = content?.title || "Sobre a Cotton Dome LDA";
  const aboutDesc = content?.description || "A Cotton Dome LDA atua no desenvolvimento de soluções inteligentes para segurança, automação e infraestrutura técnica. Com foco em qualidade, confiança e profissionalismo, oferecemos serviços em videovigilância, intrusão, controlo de acessos, deteção de incêndio, automatismos, redes, telecomunicações, UPS, serralharia e portões de segurança.";
  const videoSource = resolveMediaUrl(content?.video, `${import.meta.env.BASE_URL}videos/video2.mp4`);
  const imageSource = resolveMediaUrl(content?.image, "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80");

  return (
    <section id="sobre" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        key={videoSource} // Force video reload when source changes
        className="absolute inset-0 w-full h-full object-cover opacity-65"
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-40"></div>

      {/* Left shadow overlay to emphasize text readability */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-black/95 via-black/80 to-transparent pointer-events-none"></div>

      {/* Dark Overlay Gradient to ensure smooth blending and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/85"></div>

      {/* Light glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 rounded-full bg-[#E2AF55]/6 blur-[130px] gold-ambient-light pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Copywriting */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-widest text-[#E2AF55] mb-3"
            >
              A Nossa Empresa
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-6"
            >
              {aboutTitle.includes("Cotton Dome") ? (
                <span>
                  {aboutTitle.split("Cotton Dome")[0]}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C28D35] via-[#E2AF55] to-[#A37125] filter drop-shadow-[0_2px_10px_rgba(226,175,85,0.15)]">Cotton Dome</span>
                  {aboutTitle.split("Cotton Dome")[1]}
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C28D35] via-[#E2AF55] to-[#A37125] filter drop-shadow-[0_2px_10px_rgba(226,175,85,0.15)]">{aboutTitle}</span>
              )}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4 text-sm sm:text-base text-[#D9D9D9] font-sans leading-relaxed mb-8"
            >
              <p>{aboutDesc}</p>
            </motion.div>

            {/* Mission, Vision, Values or Default Bullet list */}
            {content?.mission || content?.vision || content?.values ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#222] pt-6"
              >
                {content.mission && (
                  <div>
                    <span className="block font-mono text-[9px] text-[#E2AF55] uppercase tracking-widest mb-1.5 font-bold">Missão</span>
                    <p className="text-xs text-[#CFCFCF] font-sans leading-relaxed">{content.mission}</p>
                  </div>
                )}
                {content.vision && (
                  <div>
                    <span className="block font-mono text-[9px] text-[#E2AF55] uppercase tracking-widest mb-1.5 font-bold">Visão</span>
                    <p className="text-xs text-[#CFCFCF] font-sans leading-relaxed">{content.vision}</p>
                  </div>
                )}
                {content.values && (
                  <div>
                    <span className="block font-mono text-[9px] text-[#E2AF55] uppercase tracking-widest mb-1.5 font-bold">Valores</span>
                    <p className="text-xs text-[#CFCFCF] font-sans leading-relaxed">{content.values}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#222] pt-6"
              >
                {bulletPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-1 flex-shrink-0">{pt.icon}</div>
                    <span className="text-xs text-[#D9D9D9] font-sans leading-relaxed">{pt.text}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Side: Luxury Graphic Layout */}
          <div className="lg:col-span-6 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2AF55]/30 hover:border-[#E2AF55]/60 transition-colors duration-500 p-1 bg-gradient-to-br from-[#111] to-black shadow-2xl shadow-black/80"
            >
              {/* Inner Border Layer */}
              <div className="absolute inset-2 border border-[#222] rounded-xl overflow-hidden">
                <img
                  src={imageSource}
                  alt="Infraestrutura Técnica Cotton Dome"
                  className="w-full h-full object-cover mix-blend-luminosity brightness-50 contrast-125 hover:scale-105 hover:mix-blend-normal transition-all duration-750 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent pointer-events-none"></div>
 
                {/* Overlapping Tech Badge inside image */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-black/85 backdrop-blur-md rounded-lg border border-[#E2AF55]/40 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#111] border border-[#E2AF55] flex items-center justify-center flex-shrink-0 text-[#E2AF55]">
                    <Cpu className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-[#E2AF55] font-bold">Rigor de Engenharia</span>
                    <span className="block text-xs text-[#D9D9D9] mt-1 font-sans">Cada projeto passa por um rigoroso planeamento técnico antes de iniciar a instalação.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}


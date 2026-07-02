import React from "react";
import { motion } from "motion/react";
import { Tag, ArrowRight, MessageSquare, Shield, HelpCircle, Activity } from "lucide-react";
import { TRANSLATIONS } from "../translations";

interface OutletProps {
  onNavigate: (path: string) => void;
  onSelectService?: (serviceName: string) => void;
  lang?: "pt" | "en" | "fr";
}

export function Outlet({ onNavigate, onSelectService, lang = "pt" }: OutletProps) {
  const t = TRANSLATIONS[lang];

  // Definindo os produtos em promoção com os mesmos textos do productsDict
  const promoProducts = [
    {
      key: "centrais de alarme",
      badgeType: "outlet",
      icon: Shield,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    },
    {
      key: "sensores de movimento",
      badgeType: "promo",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
    },
    {
      key: "sensores perimetrais",
      badgeType: "promo",
      icon: HelpCircle, // Servirá como ícone padrão do sensor de barreira perimetral
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    }
  ];

  const handleRequestQuote = () => {
    if (onSelectService) {
      // Passa o título traduzido do serviço de intrusão para pré-selecionar no formulário
      const serviceTitle = t.services["intrusao"]?.title || "Sistemas de Alarme e Intrusão";
      onSelectService(serviceTitle);
    } else {
      // Fallback: faz scroll simples
      const element = document.getElementById("contacto");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getWhatsAppUrl = (productTitle: string) => {
    const cleanNumber = "351918880788";
    const text = lang === "pt"
      ? `Olá Cotton Dome, vi o produto "${productTitle}" no Outlet e gostaria de solicitar um orçamento.`
      : lang === "en"
      ? `Hello Cotton Dome, I saw the "${productTitle}" product in the Outlet section and would like to request a quote.`
      : `Bonjour Cotton Dome, j'ai vu le produit "${productTitle}" dans la section Outlet et je souhaite obtenir um devis.`;
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="fornecedores" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Elementos decorativos dourados de fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C28D35]/3 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#E2AF55]/2 blur-[140px] pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 opacity-[0.02] tech-grid pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C28D35]/10 border border-[#C28D35]/30 text-[#C28D35] mb-4"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              {t.outlet.tag}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4 uppercase"
          >
            {t.outlet.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            {t.outlet.subtitle}
          </motion.p>
        </div>

        {/* Grid de Cards dos Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {promoProducts.map((prod, idx) => {
            const productTrans = t.productsDict[prod.key];
            if (!productTrans) return null;

            const Icon = prod.icon;
            const badgeText = prod.badgeType === "outlet" ? t.outlet.badgeOutlet : t.outlet.badgePromo;

            return (
              <motion.div
                key={prod.key}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="card-luxury rounded-xl overflow-hidden flex flex-col justify-between group border border-[#222] hover:border-[#E2AF55]/40 transition-all duration-500 min-h-[480px] relative bg-[#111]/45"
              >
                {/* Imagem do Produto com Efeito Zoom */}
                <div className="relative h-48 overflow-hidden border-b border-[#222]">
                  <img
                    src={prod.image}
                    alt={productTrans.title}
                    className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] group-hover:scale-110 group-hover:brightness-[0.8] transition-all duration-700 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
                  
                  {/* Badge de Destaque */}
                  <span className={`absolute top-4 left-4 px-2.5 py-1 rounded font-mono text-[9px] font-extrabold uppercase tracking-widest text-black shadow-md ${
                    prod.badgeType === "outlet" 
                      ? "bg-[#C28D35] border border-[#E2AF55]" 
                      : "bg-[#E2AF55] border border-[#C28D35]"
                  }`}>
                    {badgeText}
                  </span>

                  {/* Ícone sobreposto */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded bg-[#111]/90 border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] shadow-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Conteúdo Informativo */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide mb-3 group-hover:text-[#E2AF55] transition-colors leading-tight uppercase">
                      {productTrans.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D9D9D9] font-sans leading-relaxed mb-6">
                      {productTrans.description}
                    </p>
                  </div>

                  {/* Destaque de Benefício Técnico */}
                  <div className="border-t border-[#222] pt-4 mb-6">
                    <strong className="text-[#E2AF55] font-mono uppercase text-[10px] tracking-wider block mb-1">
                      {lang === "pt" ? "Destaque Técnico" : lang === "en" ? "Technical Highlight" : "Point Technique"}:
                    </strong>
                    <p className="text-xs text-gray-400 font-sans italic">
                      "{productTrans.benefit}"
                    </p>
                  </div>
                </div>

                {/* Botões e Ações de Contacto */}
                <div className="p-6 pt-0 border-t border-[#222]/30 flex flex-col gap-2.5">
                  <div className="flex gap-2">
                    {/* Botão Ver Produto (Navegação para Intrusão) */}
                    <button
                      onClick={() => onNavigate("/servicos/intrusao-sistemas-alarme")}
                      className="flex-1 py-3 px-4 border border-[#222] hover:border-[#E2AF55]/50 bg-[#161616] hover:bg-black text-[10px] text-[#CFCFCF] hover:text-[#E2AF55] rounded font-display font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{t.outlet.viewProduct}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {/* Botão WhatsApp */}
                    <a
                      href={getWhatsAppUrl(productTrans.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] rounded font-display font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.outlet.whatsapp.split(" ")[0]}</span>
                    </a>
                  </div>

                  {/* Botão CTA Principal: Solicitar Orçamento */}
                  <button
                    onClick={handleRequestQuote}
                    className="w-full py-3.5 btn-gold-premium text-black font-display font-extrabold uppercase tracking-widest text-[10px] rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C28D35]/5"
                  >
                    <span>{t.outlet.requestQuote}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

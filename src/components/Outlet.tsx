import React from "react";
import { motion } from "motion/react";
import { Tag, MessageSquare, ShieldCheck, ShoppingCart, Zap, Wifi, Camera } from "lucide-react";
import { TRANSLATIONS } from "../translations";

interface OutletProps {
  onNavigate: (path: string) => void;
  onSelectService?: (serviceName: string) => void;
  lang?: "pt" | "en" | "fr";
}

// ============================================================
// PRODUTOS AJAX PARA O OUTLET / PROMOÇÃO
// ============================================================
const OUTLET_PRODUCTS = [
  {
    id: "aj-combiprotect-s-w",
    badge: "outlet",
    icon: Zap,
    image: "/images/ajax-combiprotect-s-w.jpg",
    category: {
      pt: "Sensor de Movimento e Quebra de Vidro",
      en: "Motion & Glass Break Sensor",
      fr: "Capteur de Mouvement et Bris de Verre",
    },
    name: "AJ-COMBIPROTECT-S-W",
    description: {
      pt: "Detector sem fio que combina sensor de movimento e sensor acústico de quebra de vidro, oferecendo dupla proteção para ambientes internos com alta precisão.",
      en: "Wireless detector combining motion sensor and acoustic glass break sensor, providing dual protection for indoor environments with high precision.",
      fr: "Détecteur sans fil combinant capteur de mouvement et capteur acoustique de bris de verre pour une double protection intérieure.",
    },
    highlight: {
      pt: "Dupla proteção: movimento + quebra de vidro, sem fios e sem falsos alarmes.",
      en: "Dual protection: motion + glass break, wireless and without false alarms.",
      fr: "Double protection: mouvement + bris de verre, sans fil et sans fausses alarmes.",
    },
    benefits: {
      pt: ["Detecta movimento e quebra de vidro", "Tecnologia sem fio Ajax", "Design moderno e discreto", "Reduz falsos alarmes"],
      en: ["Detects motion and glass break", "Ajax wireless technology", "Modern and discreet design", "Reduces false alarms"],
      fr: ["Détecte mouvement et bris de verre", "Technologie sans fil Ajax", "Design moderne et discret", "Réduit les fausses alarmes"],
    },
  },
  {
    id: "aj-curtainoutdoor-w",
    badge: "promo",
    icon: Wifi,
    image: "/images/ajax-curtainoutdoor-w.jpg",
    category: {
      pt: "Sensor Cortina Externo",
      en: "Outdoor Curtain Sensor",
      fr: "Capteur Rideau Extérieur",
    },
    name: "AJ-CURTAINOUTDOOR-W",
    description: {
      pt: "Detector externo tipo cortina para proteção perimetral de portas, janelas e fachadas, criando uma barreira invisível contra invasões.",
      en: "Outdoor curtain detector for perimeter protection of doors, windows and facades, creating an invisible barrier against intrusions.",
      fr: "Détecteur rideau extérieur pour la protection périmétrique des portes, fenêtres et façades, créant une barrière invisible.",
    },
    highlight: {
      pt: "Proteção perimetral profissional para exteriores com alta resistência a intempéries.",
      en: "Professional perimeter protection for exteriors with high weather resistance.",
      fr: "Protection périmétrique professionnelle pour extérieurs avec haute résistance aux intempéries.",
    },
    benefits: {
      pt: ["Proteção perimetral externa", "Alta resistência para exteriores", "Detecção em cortina precisa", "Integração Ajax"],
      en: ["External perimeter protection", "High outdoor resistance", "Precise curtain detection", "Ajax integration"],
      fr: ["Protection périmétrique externe", "Haute résistance extérieure", "Détection rideau précise", "Intégration Ajax"],
    },
  },
  {
    id: "aj-hub-b",
    badge: "outlet",
    icon: ShieldCheck,
    image: "/images/ajax-hub-b.jpg",
    category: {
      pt: "Central de Alarme Inteligente",
      en: "Smart Alarm Hub",
      fr: "Centrale d'Alarme Intelligente",
    },
    name: "AJ-HUB-B",
    description: {
      pt: "Central inteligente que gerencia todos os dispositivos Ajax com comunicação segura, criptografada e notificações em tempo real pelo aplicativo.",
      en: "Smart hub managing all Ajax devices with secure, encrypted communication and real-time notifications via app.",
      fr: "Centrale intelligente gérant tous les dispositifs Ajax avec communication sécurisée, chiffrée et notifications en temps réel.",
    },
    highlight: {
      pt: "Controlo total do sistema via app: segurança, notificações e gestão num só dispositivo.",
      en: "Total system control via app: security, notifications and management in one device.",
      fr: "Contrôle total du système via app: sécurité, notifications et gestion dans un seul dispositif.",
    },
    benefits: {
      pt: ["Comunicação segura e criptografada", "Gestão via aplicativo móvel", "Notificações em tempo real", "Base principal do sistema"],
      en: ["Secure and encrypted communication", "Mobile app management", "Real-time notifications", "Main system base"],
      fr: ["Communication sécurisée et chiffrée", "Gestion via application mobile", "Notifications en temps réel", "Base principale du système"],
    },
  },
  {
    id: "aj-motioncamoutdoor-w",
    badge: "promo",
    icon: Camera,
    image: "/images/ajax-motioncamoutdoor-w.jpg",
    category: {
      pt: "Sensor Externo com Fotoverificação",
      en: "Outdoor Sensor with Photo Verification",
      fr: "Capteur Extérieur avec Photovérification",
    },
    name: "AJ-MOTIONCAMOUTDOOR-W",
    description: {
      pt: "Detector externo com câmera integrada para fotoverificação de alarmes. Veja em tempo real o que causou o disparo do sistema.",
      en: "Outdoor detector with integrated camera for alarm photo verification. See in real time what triggered the system.",
      fr: "Détecteur extérieur avec caméra intégrée pour la photovérification des alarmes. Voyez en temps réel ce qui a déclenché le système.",
    },
    highlight: {
      pt: "Confirmação visual de alarmes com fotoverificação — elimina dúvidas sobre ocorrências reais.",
      en: "Visual alarm confirmation with photo verification — eliminates doubt about real incidents.",
      fr: "Confirmation visuelle des alarmes avec photovérification — élimine les doutes sur les incidents réels.",
    },
    benefits: {
      pt: ["Câmera para fotoverificação", "Confirma ocorrências reais", "Resistente ao exterior", "Registo visual de eventos"],
      en: ["Camera for photo verification", "Confirms real incidents", "Outdoor resistant", "Visual event recording"],
      fr: ["Caméra pour photovérification", "Confirme les incidents réels", "Résistant à l'extérieur", "Enregistrement visuel des événements"],
    },
  },
];

export function Outlet({ onNavigate, onSelectService, lang = "pt" }: OutletProps) {
  const t = TRANSLATIONS[lang];

  const handleRequestQuote = () => {
    if (onSelectService) {
      const serviceTitle = t.services["intrusao"]?.title || "Sistemas de Alarme e Intrusão";
      onSelectService(serviceTitle);
    } else {
      const element = document.getElementById("contacto");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getWhatsAppUrl = (productName: string) => {
    const cleanNumber = "351918880788";
    const text = lang === "pt"
      ? `Olá Cotton Dome, vi o produto "${productName}" no Outlet e gostaria de solicitar um orçamento.`
      : lang === "en"
      ? `Hello Cotton Dome, I saw the "${productName}" product in the Outlet section and would like to request a quote.`
      : `Bonjour Cotton Dome, j'ai vu le produit "${productName}" dans la section Outlet et je souhaite obtenir un devis.`;
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(text)}`;
  };

  // Texts per lang
  const labels = {
    tag: { pt: "Outlet · Promoções", en: "Outlet · Promotions", fr: "Outlet · Promotions" },
    title: { pt: "Produtos em Promoção", en: "Products on Promotion", fr: "Produits en Promotion" },
    subtitle: {
      pt: "Soluções profissionais Ajax Systems com condições especiais. Equipamentos selecionados para proteção residencial e comercial — solicite o seu orçamento e aproveite.",
      en: "Professional Ajax Systems solutions with special conditions. Equipment selected for residential and commercial protection — request your quote and take advantage.",
      fr: "Solutions professionnelles Ajax Systems à des conditions spéciales. Équipements sélectionnés pour la protection résidentielle et commerciale.",
    },
    badgeOutlet: { pt: "Outlet", en: "Outlet", fr: "Outlet" },
    badgePromo: { pt: "Promoção", en: "Promotion", fr: "Promotion" },
    benefits: { pt: "Destaques", en: "Highlights", fr: "Points Forts" },
    highlight: { pt: "Destaque Técnico", en: "Technical Highlight", fr: "Point Technique" },
    requestQuote: { pt: "Solicitar Orçamento", en: "Request Quote", fr: "Demander un Devis" },
    interest: { pt: "Tenho Interesse", en: "I'm Interested", fr: "Je suis Intéressé" },
    viewProduct: { pt: "Ver Produto", en: "View Product", fr: "Voir le Produit" },
    callToAction: {
      pt: "Solicite seu orçamento e aproveite as condições disponíveis",
      en: "Request your quote and take advantage of available conditions",
      fr: "Demandez votre devis et profitez des conditions disponibles",
    },
  };

  return (
    <section id="fornecedores" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Ambient background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C28D35]/3 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#E2AF55]/2 blur-[140px] pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-1/3 opacity-[0.02] tech-grid pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C28D35]/10 border border-[#C28D35]/30 text-[#C28D35] mb-4"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              {labels.tag[lang]}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4 uppercase"
          >
            {labels.title[lang]}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            {labels.subtitle[lang]}
          </motion.p>
        </div>

        {/* Product Cards Grid — 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {OUTLET_PRODUCTS.map((product, idx) => {
            const Icon = product.icon;
            const isOutlet = product.badge === "outlet";
            const badgeText = isOutlet ? labels.badgeOutlet[lang] : labels.badgePromo[lang];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col rounded-xl overflow-hidden border border-[#222] hover:border-[#E2AF55]/40 transition-all duration-500 bg-[#0f0f0f] group"
                style={{ minHeight: "620px" }}
              >
                {/* Product Image */}
                <div className="relative h-52 bg-[#0a0a0a] border-b border-[#1a1a1a] overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />

                  {/* Outlet / Promo badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded font-mono text-[9px] font-extrabold uppercase tracking-widest text-black shadow-md ${
                    isOutlet
                      ? "bg-[#C28D35] border border-[#E2AF55]"
                      : "bg-[#E2AF55] border border-[#C28D35]"
                  }`}>
                    {badgeText}
                  </span>

                  {/* Icon badge */}
                  <div className="absolute bottom-3 right-3 w-9 h-9 rounded bg-[#111]/90 border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] shadow-lg">
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>

                  {/* Bottom fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="flex flex-col flex-grow p-5">
                  {/* Category */}
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#E2AF55] mb-2 font-bold">
                    {product.category[lang]}
                  </span>

                  {/* Product name */}
                  <h3 className="font-display font-extrabold text-sm text-white tracking-wide mb-3 group-hover:text-[#E2AF55] transition-colors uppercase leading-tight">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#CFCFCF] font-sans leading-relaxed mb-4">
                    {product.description[lang]}
                  </p>

                  {/* Benefits list */}
                  <div className="mb-4">
                    <strong className="font-mono text-[9px] uppercase tracking-widest text-[#E2AF55] block mb-2">
                      {labels.benefits[lang]}:
                    </strong>
                    <ul className="space-y-1.5">
                      {product.benefits[lang].map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#E2AF55] mt-0.5 flex-shrink-0 text-xs">✓</span>
                          <span className="text-[10px] text-[#D9D9D9] font-sans leading-tight">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical highlight */}
                  <div className="border-t border-[#1a1a1a] pt-3 mb-4 flex-grow">
                    <strong className="font-mono text-[9px] uppercase tracking-widest text-[#E2AF55] block mb-1.5">
                      {labels.highlight[lang]}:
                    </strong>
                    <p className="text-[10px] text-gray-400 font-sans italic leading-relaxed">
                      "{product.highlight[lang]}"
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 flex flex-col gap-2">
                  {/* View Product */}
                  <button
                    onClick={() => onNavigate("/servicos/intrusao-sistemas-alarme")}
                    className="w-full py-2.5 px-4 border border-[#222] hover:border-[#E2AF55]/50 bg-[#161616] hover:bg-black text-[10px] text-[#CFCFCF] hover:text-[#E2AF55] rounded font-display font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{labels.viewProduct[lang]}</span>
                  </button>

                  {/* WhatsApp — I'm Interested */}
                  <a
                    href={getWhatsAppUrl(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] rounded font-display font-bold uppercase tracking-wider text-[10px] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{labels.interest[lang]}</span>
                  </a>

                  {/* Request Quote — Main CTA */}
                  <button
                    onClick={handleRequestQuote}
                    className="w-full py-3.5 btn-gold-premium text-black font-display font-extrabold uppercase tracking-widest text-[10px] rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C28D35]/5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{labels.requestQuote[lang]}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-gray-500 font-sans mb-4 uppercase tracking-widest font-mono">
            {labels.callToAction[lang]}
          </p>
          <button
            onClick={handleRequestQuote}
            className="inline-flex items-center gap-2 px-8 py-4 btn-gold-premium text-black font-display font-extrabold uppercase tracking-widest text-xs rounded cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{labels.requestQuote[lang]}</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}

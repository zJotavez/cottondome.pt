import React, { useEffect } from "react";
import { SERVICES_DATA } from "../servicesData";
import { ENVIRONMENTS } from "../data";
import { LucideIcon } from "./LucideIcon";
import { ArrowLeft, CheckCircle2, ShieldCheck, HelpCircle, MessageSquare, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { DbService, DbServicePage } from "../types";
import { TRANSLATIONS } from "../translations";
import { mapSlugToKey } from "../slugUtils";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface ServiceDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
  services?: DbService[];
  pages?: DbServicePage[];
  lang?: "pt" | "en" | "fr";
  products?: any[];
}

const mapIdToKey = (id: string | number): "residencias" | "condominios" | "empresas" | "comercio" | "industrias" | "armazens" => {
  const map: Record<string | number, "residencias" | "condominios" | "empresas" | "comercio" | "industrias" | "armazens"> = {
    "residencias": "residencias",
    "condominios": "condominios",
    "empresas": "empresas",
    "comercio": "comercio",
    "industrias": "industrias",
    "armazens": "armazens",
    1: "residencias",
    2: "condominios",
    3: "empresas",
    4: "comercio",
    5: "industrias",
    6: "armazens"
  };
  return map[id] || "residencias";
};

// ============================================================
// DADOS DOS PRODUTOS AJAX PARA INTRUSÃO E SISTEMA DE ALARME
// ============================================================
const AJAX_PRODUCTS = [
  {
    id: "aj-combiprotect-s-w",
    category: { pt: "Sensor de Movimento e Quebra de Vidro", en: "Motion & Glass Break Sensor", fr: "Capteur de Mouvement et Bris de Verre" },
    name: "AJ-COMBIPROTECT-S-W",
    image: "/images/ajax-combiprotect-s-w.jpg",
    badge: "AJAX",
    description: {
      pt: "Detector sem fio que combina sensor de movimento e sensor acústico de quebra de vidro, oferecendo dupla proteção para ambientes internos com alta precisão.",
      en: "Wireless detector combining motion sensor and acoustic glass break sensor, providing dual protection for indoor environments with high precision.",
      fr: "Détecteur sans fil combinant capteur de mouvement et capteur acoustique de bris de verre, offrant une double protection pour les environnements intérieurs.",
    },
    benefits: {
      pt: [
        "Detecta movimento em ambientes internos",
        "Identifica quebra de vidro com alta precisão",
        "Tecnologia sem fio",
        "Ideal para residências, escritórios e lojas",
        "Reduz falsos alarmes",
        "Integração com sistema Ajax",
        "Design moderno e discreto",
      ],
      en: [
        "Detects motion in indoor environments",
        "Identifies glass break with high precision",
        "Wireless technology",
        "Ideal for homes, offices, and stores",
        "Reduces false alarms",
        "Ajax system integration",
        "Modern and discreet design",
      ],
      fr: [
        "Détecte les mouvements en intérieur",
        "Identifie le bris de verre avec haute précision",
        "Technologie sans fil",
        "Idéal pour les résidences, bureaux et commerces",
        "Réduit les fausses alarmes",
        "Intégration avec le système Ajax",
        "Design moderne et discret",
      ],
    },
    application: {
      pt: "Indicado para proteção de salas, recepções, corredores, escritórios, lojas e ambientes comerciais e residenciais que precisam de monitoramento interno eficiente.",
      en: "Recommended for the protection of rooms, receptions, corridors, offices, stores, and commercial or residential environments that need efficient indoor monitoring.",
      fr: "Recommandé pour la protection des salles, réceptions, couloirs, bureaux, magasins et environnements commerciaux ou résidentiels nécessitant une surveillance intérieure efficace.",
    },
  },
  {
    id: "aj-curtainoutdoor-w",
    category: { pt: "Sensor Cortina Externo", en: "Outdoor Curtain Sensor", fr: "Capteur Rideau Extérieur" },
    name: "AJ-CURTAINOUTDOOR-W",
    image: "/images/ajax-curtainoutdoor-w.jpg",
    badge: "AJAX",
    description: {
      pt: "Detector externo tipo cortina, desenvolvido para proteção perimetral de portas, janelas, fachadas e corredores, criando uma barreira invisível contra invasões.",
      en: "Outdoor curtain-type detector designed for perimeter protection of doors, windows, facades, and corridors, creating an invisible barrier against intrusions.",
      fr: "Détecteur extérieur de type rideau conçu pour la protection périmétrique des portes, fenêtres, façades et couloirs, créant une barrière invisible contre les intrusions.",
    },
    benefits: {
      pt: [
        "Proteção perimetral externa",
        "Ideal para portas, janelas e fachadas",
        "Tecnologia sem fio",
        "Alta resistência para uso externo",
        "Detecção precisa em formato de cortina",
        "Redução de falsos alarmes",
        "Integração com sistemas Ajax",
        "Design discreto e profissional",
      ],
      en: [
        "External perimeter protection",
        "Ideal for doors, windows, and facades",
        "Wireless technology",
        "High resistance for outdoor use",
        "Precise curtain-format detection",
        "False alarm reduction",
        "Ajax system integration",
        "Discreet and professional design",
      ],
      fr: [
        "Protection périmétrique externe",
        "Idéal pour portes, fenêtres et façades",
        "Technologie sans fil",
        "Haute résistance pour usage extérieur",
        "Détection précise en format rideau",
        "Réduction des fausses alarmes",
        "Intégration avec les systèmes Ajax",
        "Design discret et professionnel",
      ],
    },
    application: {
      pt: "Indicado para áreas externas, muros, varandas, corredores laterais, fachadas comerciais, entradas residenciais e pontos vulneráveis de acesso.",
      en: "Recommended for outdoor areas, walls, balconies, side corridors, commercial facades, residential entrances, and vulnerable access points.",
      fr: "Recommandé pour les zones extérieures, murs, balcons, couloirs latéraux, façades commerciales, entrées résidentielles et points d'accès vulnérables.",
    },
  },
  {
    id: "aj-hub-b",
    category: { pt: "Central de Alarme Inteligente", en: "Smart Alarm Hub", fr: "Centrale d'Alarme Intelligente" },
    name: "AJ-HUB-B",
    image: "/images/ajax-hub-b.jpg",
    badge: "AJAX",
    description: {
      pt: "Central inteligente responsável por gerenciar todos os dispositivos do sistema de alarme Ajax, garantindo comunicação rápida, segura e estável entre sensores, sirenes, controles e aplicativo.",
      en: "Smart hub responsible for managing all Ajax alarm system devices, ensuring fast, secure, and stable communication between sensors, sirens, controls, and the app.",
      fr: "Centrale intelligente responsable de la gestion de tous les dispositifs du système d'alarme Ajax, garantissant une communication rapide, sécurisée et stable.",
    },
    benefits: {
      pt: [
        "Controla todos os dispositivos do sistema",
        "Comunicação segura e criptografada",
        "Gerenciamento pelo aplicativo",
        "Notificações em tempo real",
        "Compatível com sensores, sirenes e controles Ajax",
        "Conexão estável",
        "Ideal para projetos residenciais e comerciais",
        "Base principal do sistema de alarme",
      ],
      en: [
        "Controls all system devices",
        "Secure and encrypted communication",
        "App management",
        "Real-time notifications",
        "Compatible with Ajax sensors, sirens, and controls",
        "Stable connection",
        "Ideal for residential and commercial projects",
        "Main base of the alarm system",
      ],
      fr: [
        "Contrôle tous les dispositifs du système",
        "Communication sécurisée et chiffrée",
        "Gestion par application",
        "Notifications en temps réel",
        "Compatible avec les capteurs, sirènes et commandes Ajax",
        "Connexion stable",
        "Idéal pour les projets résidentiels et commerciaux",
        "Base principale du système d'alarme",
      ],
    },
    application: {
      pt: "Indicado para residências, empresas, lojas, escritórios, condomínios e ambientes que precisam de uma central confiável para controle completo do sistema de segurança.",
      en: "Recommended for homes, businesses, stores, offices, condominiums, and environments that need a reliable hub for complete security system control.",
      fr: "Recommandé pour les résidences, entreprises, magasins, bureaux, copropriétés et environnements nécessitant une centrale fiable pour le contrôle complet du système de sécurité.",
    },
  },
  {
    id: "aj-motioncamoutdoor-w",
    category: { pt: "Sensor Externo com Fotoverificação", en: "Outdoor Motion Cam with Photo Verification", fr: "Capteur Extérieur avec Photovérification" },
    name: "AJ-MOTIONCAMOUTDOOR-W",
    image: "/images/ajax-motioncamoutdoor-w.jpg",
    badge: "AJAX",
    description: {
      pt: "Detector externo de movimento com câmera integrada para fotoverificação de alarmes, permitindo visualizar rapidamente o que causou o disparo do sistema.",
      en: "Outdoor motion detector with integrated camera for alarm photo verification, allowing you to quickly see what triggered the system.",
      fr: "Détecteur de mouvement extérieur avec caméra intégrée pour la photovérification des alarmes, permettant de visualiser rapidement ce qui a déclenché le système.",
    },
    benefits: {
      pt: [
        "Detecta movimento em áreas externas",
        "Câmera para fotoverificação",
        "Confirma ocorrências reais",
        "Reduz falsos alarmes",
        "Tecnologia sem fio",
        "Resistente para uso externo",
        "Ideal para quintais, fachadas e perímetros",
        "Integração com sistema Ajax",
        "Segurança avançada com registro visual",
      ],
      en: [
        "Detects motion in outdoor areas",
        "Camera for photo verification",
        "Confirms real incidents",
        "Reduces false alarms",
        "Wireless technology",
        "Resistant for outdoor use",
        "Ideal for backyards, facades, and perimeters",
        "Ajax system integration",
        "Advanced security with visual record",
      ],
      fr: [
        "Détecte les mouvements en zones extérieures",
        "Caméra pour photovérification",
        "Confirme les incidents réels",
        "Réduit les fausses alarmes",
        "Technologie sans fil",
        "Résistant pour usage extérieur",
        "Idéal pour jardins, façades et périmètres",
        "Intégration avec le système Ajax",
        "Sécurité avancée avec enregistrement visuel",
      ],
    },
    application: {
      pt: "Indicado para áreas externas, fachadas, garagens, quintais, empresas, entradas principais e locais que precisam de monitoramento com confirmação visual.",
      en: "Recommended for outdoor areas, facades, garages, backyards, businesses, main entrances, and locations that need monitoring with visual confirmation.",
      fr: "Recommandé pour les zones extérieures, façades, garages, jardins, entreprises, entrées principales et lieux nécessitant une surveillance avec confirmation visuelle.",
    },
  },
];

// Mapeamento de imagens para produtos relacionados (Unsplash Premium)
const PRODUCT_IMAGES: Record<string, string> = {
  // CCTV
  "câmaras ip": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
  "câmaras analógicas hd": "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=600&q=80",
  "gravadores nvr": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "gravadores dvr": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "monitores de videovigilância": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
  "discos rígidos para videovigilância": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",
  "cabos de vídeo e conectores": "https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=600&q=80",
  "fontes de alimentação centralizadas": "https://images.unsplash.com/photo-1590486803833-ffc6de08d6f9?auto=format&fit=crop&w=600&q=80",
  "baluns de vídeo": "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=600&q=80",
  "software de monitorização vms": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",

  // INTRUSÃO / ALARMES
  "central de alarme": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
  "sensores de movimento": "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80",
  "contatos magnéticos": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "sirenes": "https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?auto=format&fit=crop&w=600&q=80",
  "teclados de alarme": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=600&q=80",
  "comandos": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  "módulos gsm ou wi-fi": "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80",
  "detectores internos e externos": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",

  // CONTROLO DE ACESSO
  "leitores de cartão": "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80",
  "tags": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  "teclados numéricos": "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
  "biometria": "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=600&q=80",
  "reconhecimento facial": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
  "fechaduras elétricas": "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
  "botões de acesso": "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
  "controladores de acesso": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  "torniquetes": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  "software de gestão de utilizadores": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",

  // DETEÇÃO DE INCÊNDIO
  "centrais de incêndio": "https://images.unsplash.com/photo-1599740831146-809829130b9d?auto=format&fit=crop&w=600&q=80",
  "detetores de fumo": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
  "detetores térmicos": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
  "botões manuais de alarme": "https://images.unsplash.com/photo-1606206591513-adbfdd5a1c71?auto=format&fit=crop&w=600&q=80",
  "sinalizadores": "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&w=600&q=80",
  "módulos de comando e isolamento": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
  "sistemas de retenção eletromagnética": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  "cabos resistentes ao fogo": "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=600&q=80",
  "software de monitorização gráfica": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80",

  // AUTOMATISMOS
  "motores para portões de correr": "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80",
  "motores para portões de batente": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
  "barreiras automáticas": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  "fotocélulas de segurança": "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80",
  "pirilampos de sinalização": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80",
  "receptores e emissores": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
  "cremalheiras": "https://images.unsplash.com/photo-1530124560676-b00131ffc297?auto=format&fit=crop&w=600&q=80",
  "quadros de comando eletrónicos": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",

  // PORTAS E PORTÕES
  "portões seccionados residenciais": "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80",
  "portões seccionados industriais": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  "portas rápidas em pvc": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
  "portas corta-fogo": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  "portas multiusos metálicas": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
  "portões de fole": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
  "grades de enrolar de segurança": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",

  // UPS E ENERGIA
  "ups line-interactive": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  "ups online dupla conversão": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "baterias de chumbo-ácido reguladas": "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&w=600&q=80",
  "baterias de lítio para ups": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80",
  "repartidores de carga": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
  "software de encerramento seguro": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",

  // REDES E COMUNICAÇÕES
  "routers gateway": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "switches managed": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "pontos de acesso wi-fi": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  "cabos ethernet cat6 ou cat6a": "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=600&q=80",
  "fibra ótica": "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=600&q=80",
  "racks murais e de chão": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  "painéis de distribuição": "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80"
};

// Verifica se o serviço atual é intrusão/alarme para exibir os produtos Ajax
const isIntrusaoService = (slug: string) => {
  const s = slug.toLowerCase();
  return s.includes("intrusao") || s.includes("intrusão") || s.includes("alarme") || s.includes("alarm");
};

export function ServiceDetail({ slug, onNavigate, services, pages, lang = "pt", products: dbProducts }: ServiceDetailProps) {
  const t = TRANSLATIONS[lang];

  // Resolve service from DB or static fallback (matching slug or mapped slug)
  const service = services?.find((s) => s.slug === slug || mapSlugToKey(s.slug) === mapSlugToKey(slug)) 
    || SERVICES_DATA.find((s) => s.slug === slug || mapSlugToKey(s.slug) === mapSlugToKey(slug));
  const pageDetails = pages?.find((p) => p.service_id === service?.id);

  // Safe JSON Parsing helper
  const parseJsonArray = (val: any, defaultVal: any[]) => {
    if (!val) return defaultVal;
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  useEffect(() => {
    if (service) {
      const serviceKey = mapSlugToKey(service.slug);
      const serviceTrans = t.services[serviceKey];
      const displayTitle = serviceTrans ? serviceTrans.title : service.title;
      
      const seoTitle = displayTitle + " | Cotton Dome LDA";
      document.title = seoTitle;
      
      // Update SEO Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      const seoDesc = serviceTrans ? serviceTrans.shortDesc : ((service as any).seoDescription || (service as any).short_description || "");
      metaDesc.setAttribute('content', seoDesc);
    }
    // Scroll to top when loading page
    window.scrollTo(0, 0);
  }, [service, t]);

  if (!service) {
    return (
      <main className="min-h-screen bg-[#050505] text-[#D9D9D9] flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#E2AF55]/10 border border-[#E2AF55] flex items-center justify-center text-[#E2AF55] mb-6">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-4">{t.serviceDetail.errorTitle}</h1>
        <p className="text-sm text-gray-400 max-w-md mb-8">
          {t.serviceDetail.errorDesc}
        </p>
        <button
          onClick={() => onNavigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 btn-gold-outline text-xs rounded transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.serviceDetail.backHome}</span>
        </button>
      </main>
    );
  }

  // Resolve service translations
  const serviceKey = mapSlugToKey(service.slug);
  const serviceTrans = t.services[serviceKey];

  const displayTitle = serviceTrans ? serviceTrans.title : service.title;
  const displaySlogan = serviceTrans ? serviceTrans.slogan : (pageDetails?.impact_phrase || (service as any).slogan || "Soluções Técnicas Personalizadas");
  const displayDesc = serviceTrans ? serviceTrans.desc : (pageDetails?.full_description || (service as any).description || "");

  // Resolve benefits (translate if it's the static PT fallback)
  const rawBenefits = parseJsonArray(pageDetails?.benefits, (service as any).benefits || []);
  const benefits = lang === "pt" ? rawBenefits : (serviceTrans ? [serviceTrans.slogan, serviceTrans.shortDesc] : rawBenefits);

  const products = parseJsonArray(pageDetails?.related_products, (service as any).products || []);
  const staticService = SERVICES_DATA.find((s) => s.slug === slug || mapSlugToKey(s.slug) === mapSlugToKey(slug));
  const galleryImages = parseJsonArray(pageDetails?.gallery_images, staticService?.galleryImages || []);

  const workSteps = {
    pt: [
      { num: "01", title: "Análise Técnica", desc: "Avaliamos minuciosamente o espaço físico e compreendemos a sua necessidade de segurança." },
      { num: "02", title: "Escolha da Solução", desc: "Dimensionamos os equipamentos de alta tecnologia mais ajustados à sua realidade." },
      { num: "03", title: "Instalação Profissional", desc: "Executamos a montagem com rigor técnico, organização técnica e respeito estético." },
      { num: "04", title: "Configuração", desc: "Configuramos todos os sistemas e realizamos testes lógicos completos de funcionamento." },
      { num: "05", title: "Suporte e Acompanhamento", desc: "Garantimos assistência técnica dedicada pós-venda para manter a proteção activa." }
    ],
    en: [
      { num: "01", title: "Technical Analysis", desc: "We thoroughly evaluate the physical space and understand your security needs." },
      { num: "02", title: "Solution Choice", desc: "We size the high-tech equipment most adjusted to your reality." },
      { num: "03", title: "Professional Installation", desc: "We perform the assembly with technical rigor, technical organization and aesthetic respect." },
      { num: "04", title: "Configuration", desc: "We configure all systems and perform complete logical tests." },
      { num: "05", title: "Support and Monitoring", desc: "We guarantee dedicated post-sale technical assistance to keep protection active." }
    ],
    fr: [
      { num: "01", title: "Analyse Technique", desc: "Nous évaluons minutieusement l'espace physique et comprenons vos besoins de sécurité." },
      { num: "02", title: "Choix de la Solution", desc: "Nous dimensionnons les équipements de haute technologie les plus adaptés à votre réalité." },
      { num: "03", title: "Installation Professionnelle", desc: "Nous réalisons le montage avec rigueur technique, organisation et respect esthétique." },
      { num: "04", title: "Configuration", desc: "Nous configurons tous les systèmes et effectuons des tests logiques complets." },
      { num: "05", title: "Support et Suivi", desc: "Nous garantissons une assistance technique dédiée après-vente pour maintenir la protection active." }
    ]
  };

  const displayWorkSteps = workSteps[lang] || workSteps.pt;

  const defaultAppLocations = [
    { name: "Residências", desc: "Proteção personalizada e automatismos para o conforto do seu lar." },
    { name: "Condomínios", desc: "Controlo seguro de acessos comuns e vigilância perimetral." },
    { name: "Empresas", desc: "Gestão inteligente de segurança e redes corporativas robustas." },
    { name: "Comércio", desc: "Prevenção de perdas e portas automáticas de alto tráfego." },
    { name: "Indústrias", desc: "Sistemas complexos de deteção e segurança de alta resistência." },
    { name: "Armazéns", desc: "Racks organizados, UPS de backup e proteção perimetral total." }
  ];

  const rawAppLocations = parseJsonArray(pageDetails?.applications, defaultAppLocations);
  
  const displayAppLocations = rawAppLocations.map((loc: any) => {
    // Check if name matches any environment item in data.ts or translations
    const envItem = ENVIRONMENTS.find(e => e.name.toLowerCase() === loc.name.toLowerCase() || e.id.toString() === loc.id?.toString());
    if (envItem) {
      const key = mapIdToKey(envItem.id);
      const itemTranslation = t.environments.items[key];
      return {
        name: itemTranslation ? itemTranslation.name : loc.name,
        desc: itemTranslation ? itemTranslation.desc : loc.desc
      };
    }
    return loc;
  });

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

  const mainImage = resolveMediaUrl(service.image, "");
  const iconName = (service as any).icon || (service as any).iconName || "Camera";

  // WhatsApp helper for Ajax products
  const getProductWhatsApp = (productName: string) => {
    const num = "351918880788";
    const text = lang === "pt"
      ? `Olá Cotton Dome, tenho interesse no produto ${productName}. Gostaria de receber um orçamento.`
      : lang === "en"
      ? `Hello Cotton Dome, I'm interested in the product ${productName}. I'd like to receive a quote.`
      : `Bonjour Cotton Dome, je suis intéressé par le produit ${productName}. Je souhaite recevoir un devis.`;
    return `https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(text)}`;
  };

  // Show Ajax products section only for alarm/intrusion service
  // Se vierem os produtos dinâmicos do banco, filtramos os que têm service_id correspondente ao serviço atual.
  // Caso contrário, se for o serviço de intrusão, usamos AJAX_PRODUCTS como fallback.
  const currentServiceId = service?.id;
  const currentServiceSlug = service?.slug;

  const displayProducts = Array.isArray(dbProducts) && dbProducts.length > 0
    ? dbProducts
        .filter((p: any) => p.is_active === 1 && (p.service_id === currentServiceId || p.service_id === currentServiceSlug || p.service_id?.toString() === currentServiceId?.toString()))
        .map((p: any) => ({
          id: p.id,
          badge: p.brand || "AJAX",
          name: p.name,
          image: p.image,
          category: {
            pt: p.category || "",
            en: p.category || "",
            fr: p.category || ""
          },
          description: {
            pt: p.description || p.short_description || "",
            en: p.description || p.short_description || "",
            fr: p.description || p.short_description || ""
          },
          benefits: {
            pt: p.benefits || [],
            en: p.benefits || [],
            fr: p.benefits || []
          },
          application: {
            pt: p.short_description || "",
            en: p.short_description || "",
            fr: p.short_description || ""
          }
        }))
    : (isIntrusaoService(slug) ? AJAX_PRODUCTS : []);

  const showAjaxProducts = displayProducts.length > 0;

  // Labels per lang
  const labels = {
    ajaxTitle: {
      pt: "Produtos e Soluções para Intrusão e Sistema de Alarme",
      en: "Products & Solutions for Intrusion and Alarm Systems",
      fr: "Produits et Solutions pour Intrusion et Système d'Alarme",
    },
    ajaxSubtitle: {
      pt: "Equipamentos profissionais Ajax Systems selecionados para proteção residencial e comercial de alto desempenho.",
      en: "Professional Ajax Systems equipment selected for high-performance residential and commercial protection.",
      fr: "Équipements professionnels Ajax Systems sélectionnés pour une protection résidentielle et commerciale haute performance.",
    },
    application: { pt: "Aplicação", en: "Application", fr: "Application" },
    benefits: { pt: "Benefícios", en: "Benefits", fr: "Avantages" },
    requestQuote: { pt: "Solicitar Orçamento", en: "Request Quote", fr: "Demander un Devis" },
    interest: { pt: "Tenho Interesse", en: "I'm Interested", fr: "Je suis Intéressé" },
  };

  return (
    <main className="bg-[#050505] text-[#CFCFCF] min-h-screen">
      
      {/* 1. HERO DO SERVIÇO */}
      <section className="relative h-[480px] flex items-center justify-center overflow-hidden border-b border-[#1a1a1a]">
        {/* Background Image */}
        <img
          src={mainImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25] contrast-[1.1] pointer-events-none"
        />

        {/* Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/45 to-[#050505]/85 pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-40"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-lg bg-[#111111]/90 border border-[#E2AF55]/45 flex items-center justify-center text-[#E2AF55] mx-auto mb-6 shadow-lg shadow-[#E2AF55]/10"
          >
            <LucideIcon name={iconName} className="w-6 h-6" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight uppercase mb-4"
          >
            {displayTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-xs sm:text-sm text-[#E2AF55] uppercase tracking-widest max-w-3xl mx-auto mb-8 font-semibold"
          >
            {displaySlogan}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <button
              onClick={() => {
                const element = document.getElementById("contacto-direto");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 btn-gold-premium text-black font-bold uppercase tracking-widest text-xs rounded cursor-pointer"
            >
              {t.serviceDetail.requestBudget}
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. DESCRIÇÃO COMPLETA & BENEFÍCIOS */}
      <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#E2AF55]/6 blur-[120px] gold-ambient-light pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left side: detailed description */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase border-b border-[#222] pb-4 mb-6">
                {t.serviceDetail.aboutService}
              </h2>
              <p className="text-sm sm:text-base text-[#D9D9D9] font-sans leading-relaxed mb-6 font-medium">
                {displayDesc}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                {t.serviceDetail.generalDesc}
              </p>
            </div>

            {/* Right side: Benefits list */}
            <div className="lg:col-span-5 card-luxury p-8 rounded-xl relative group">
              <h2 className="text-base sm:text-lg font-display font-bold text-[#E2AF55] tracking-wider uppercase mb-6">
                {t.serviceDetail.mainBenefits}
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E2AF55] mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-[#D9D9D9] font-sans leading-tight">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APLICAÇÕES */}
      <section className="py-20 bg-[#050505] relative overflow-hidden border-t border-[#1a1a1a]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none filter brightness-75 contrast-125"
          src="/videos/hero-video.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/65 to-[#050505] pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase mb-3">
              {t.serviceDetail.appAreas}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              {t.serviceDetail.appAreasDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAppLocations.map((loc: any, idx: number) => (
              <div
                key={idx}
                className="card-luxury p-6 rounded-xl group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded bg-[#1A1A1A] border border-[#E2AF55]/20 flex items-center justify-center text-[#E2AF55] group-hover:border-[#E2AF55]/50 transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm uppercase text-white tracking-wide group-hover:text-[#E2AF55] transition-colors">
                    {loc.name}
                  </h3>
                </div>
                <p className="text-xs text-[#D9D9D9] font-sans leading-relaxed">
                  {loc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PRODUTOS AJAX — SEÇÃO EXCLUSIVA PARA INTRUSÃO/ALARME       */}
      {/* ============================================================ */}
      {showAjaxProducts && (
        <section className="py-24 bg-[#080808] relative overflow-hidden border-t border-[#1a1a1a]">
          {/* Ambient lights */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#E2AF55]/4 blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#C28D35]/3 blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 tech-grid pointer-events-none opacity-20" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2AF55]/10 border border-[#E2AF55]/30 text-[#E2AF55] mb-5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Ajax Systems</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-4 uppercase"
              >
                {labels.ajaxTitle[lang]}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-sm text-[#CFCFCF] font-sans leading-relaxed"
              >
                {labels.ajaxSubtitle[lang]}
              </motion.p>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col rounded-xl overflow-hidden border border-[#222] hover:border-[#E2AF55]/40 transition-all duration-500 bg-[#0f0f0f] group"
                  style={{ minHeight: "600px" }}
                >
                  {/* Product Image */}
                  <div className="relative h-52 bg-[#0a0a0a] border-b border-[#1a1a1a] overflow-hidden flex items-center justify-center">
                    <img
                      src={resolveMediaUrl(product.image, "/images/logo.png")}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    {/* Ajax badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase tracking-widest text-black bg-[#E2AF55] border border-[#C28D35] shadow">
                      {product.badge}
                    </span>
                    {/* Gold corner accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
                  </div>

                  {/* Content */}
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

                    {/* Benefits */}
                    <div className="mb-4">
                      <strong className="font-mono text-[9px] uppercase tracking-widest text-[#E2AF55] block mb-2">
                        {labels.benefits[lang]}:
                      </strong>
                      <ul className="space-y-1.5">
                        {product.benefits[lang].slice(0, 5).map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#E2AF55] mt-0.5 flex-shrink-0 text-xs">✓</span>
                            <span className="text-[10px] text-[#D9D9D9] font-sans leading-tight">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Application */}
                    <div className="border-t border-[#1a1a1a] pt-3 mb-4 flex-grow">
                      <strong className="font-mono text-[9px] uppercase tracking-widest text-[#E2AF55] block mb-1">
                        {labels.application[lang]}:
                      </strong>
                      <p className="text-[10px] text-gray-400 font-sans leading-relaxed italic">
                        {product.application[lang]}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => {
                          const el = document.getElementById("contacto-direto");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-3 btn-gold-premium text-black font-display font-extrabold uppercase tracking-widest text-[10px] rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{labels.requestQuote[lang]}</span>
                      </button>
                      <a
                        href={getProductWhatsApp(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] rounded font-display font-bold uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{labels.interest[lang]}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4b. PRODUTOS RELACIONADOS (genérico para outros serviços) */}
      {!showAjaxProducts && (
        <section className="py-20 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase mb-3">
                {t.serviceDetail.relatedEquipments}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                {t.serviceDetail.relatedEquipmentsDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {products.map((prod: any, idx: number) => {
                const cleanProdKey = prod.toLowerCase().trim();
                const productTrans = t.productsDict[cleanProdKey];
                const bgImg = PRODUCT_IMAGES[cleanProdKey] || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80";
                
                if (productTrans) {
                  return (
                    <div
                      key={idx}
                      className="card-luxury p-3 sm:p-5 rounded-xl group relative overflow-hidden flex flex-col justify-between border border-[#222] hover:border-[#E2AF55]/40 transition-all duration-300 min-h-[160px] sm:min-h-[185px]"
                    >
                      {/* Background image related to the product */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none filter brightness-75 contrast-125"
                        style={{ backgroundImage: `url(${bgImg})` }}
                      />
                      {/* Subtle bottom gradient to ensure text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent pointer-events-none" />

                      <div className="relative z-10">
                        <h3 className="font-display font-bold text-xs sm:text-sm text-white tracking-wide mb-1 sm:mb-2 group-hover:text-[#E2AF55] transition-colors leading-tight">
                          {productTrans.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-[#CFCFCF] font-sans leading-normal sm:leading-relaxed mb-3 line-clamp-3">
                          {productTrans.description}
                        </p>
                      </div>
                      <div className="mt-auto border-t border-[#222] pt-2 text-[9px] sm:text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors font-mono relative z-10">
                        <strong className="text-[#E2AF55] font-semibold uppercase text-[8px] sm:text-[9px] block mb-0.5">
                          {lang === "pt" ? "Benefício" : lang === "en" ? "Benefit" : "Avantage"}:
                        </strong>
                        {productTrans.benefit}
                      </div>
                    </div>
                  );
                }

                // Fallback
                return (
                  <div
                    key={idx}
                    className="card-luxury p-3 sm:p-5 rounded-xl group flex flex-col items-center justify-center text-center min-h-[60px] sm:min-h-[80px] border border-[#222] relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none"
                      style={{ backgroundImage: `url(${bgImg})` }}
                    />
                    <span className="text-[10px] sm:text-xs text-[#D9D9D9] font-sans font-medium capitalize group-hover:text-white transition-colors relative z-10">
                      {prod}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* 4c. GALERIA VISUAL DO SERVIÇO */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-20 bg-[#050505] relative overflow-hidden border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase mb-3">
                {t.serviceDetail.galleryTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                {t.serviceDetail.galleryDesc}
              </p>
            </div>

            {/* Mobile/Tablet: Infinite Horizontal Marquee */}
            <div className="block lg:hidden overflow-hidden w-full relative py-4">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>
              
              <div className="animate-marquee-ltr flex gap-4">
                {[...galleryImages, ...galleryImages].map((imgUrl: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="relative w-[280px] h-[180px] rounded-xl overflow-hidden card-luxury group flex-shrink-0"
                  >
                    <div className="absolute inset-2 border border-[#E2AF55]/10 rounded-lg z-20 pointer-events-none"></div>
                    <img
                      src={resolveMediaUrl(imgUrl, "")}
                      alt={`Equipamento ${idx + 1}`}
                      className="w-full h-full object-cover mix-blend-luminosity brightness-75 group-hover:mix-blend-normal transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10 opacity-70"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grelha padrão */}
            <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((imgUrl: any, idx: number) => (
                <div 
                  key={idx} 
                  className="relative h-[260px] rounded-xl overflow-hidden card-luxury group cursor-pointer"
                >
                  <div className="absolute inset-2 border border-[#E2AF55]/10 group-hover:border-[#E2AF55]/35 rounded-lg z-20 pointer-events-none transition-all duration-500"></div>
                  <img
                    src={resolveMediaUrl(imgUrl, "")}
                    alt={`Equipamento ou Instalação ${idx + 1} de ${displayTitle}`}
                    className="w-full h-full object-cover mix-blend-luminosity brightness-75 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-770 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. PROCESSO DE TRABALHO */}
      <section className="py-20 bg-[#050505] relative overflow-hidden border-t border-[#1a1a1a]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none filter brightness-75 contrast-125"
          src="/videos/hero-video.mp4"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/65 to-[#050505] pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide uppercase mb-3">
              {t.serviceDetail.processTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              {t.serviceDetail.processDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayWorkSteps.map((step, idx) => (
              <div
                key={idx}
                className="card-luxury p-5 rounded-xl flex flex-col justify-between relative group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-2xl font-extrabold text-[#E2AF55]/20 group-hover:text-[#E2AF55]/45 transition-colors">
                    {step.num}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#E2AF55]"></div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xs uppercase text-white tracking-wider mb-2 group-hover:text-[#E2AF55] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-[#D9D9D9] font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CHAMADA FINAL PARA ORÇAMENTO */}
      <section id="contacto-direto" className="py-28 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
        {/* Background Photo */}
        <img
          src={`${import.meta.env.BASE_URL}images/cctv-camera.png`}
          alt="CCTV Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-75 contrast-[1.1] pointer-events-none"
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mb-4 uppercase text-3d-gold">
            {t.serviceDetail.finalCtaTitle}
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed max-w-2xl mx-auto mb-10 font-semibold drop-shadow-md">
            {t.serviceDetail.finalCtaDesc}
          </p>

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                // Navigate to home and then focus the contact form
                onNavigate("/#contacto");
                // Wait slightly for route transition then scroll
                setTimeout(() => {
                  const element = document.getElementById("contacto");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="px-8 py-4 btn-gold-premium text-black font-bold uppercase tracking-widest text-xs rounded cursor-pointer"
            >
              {t.serviceDetail.finalCtaBtn}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

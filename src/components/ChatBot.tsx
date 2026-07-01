import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, ChevronDown, Minimize2 } from "lucide-react";

interface ChatBotProps {
  lang: "pt" | "en" | "fr";
}

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

// ─── FAQ Knowledge Base ───────────────────────────────────────────────────────
const FAQ: Record<"pt" | "en" | "fr", { triggers: string[]; answer: string }[]> = {
  pt: [
    {
      triggers: ["ola", "olá", "bom dia", "boa tarde", "boa noite", "hello", "oi", "oi!"],
      answer: "Olá! 👋 Sou o assistente virtual da Cotton Dome LDA. Posso ajudá-lo com informações sobre os nossos serviços de segurança, orçamentos e instalações. Como posso ajudar?"
    },
    {
      triggers: ["cctv", "camera", "câmera", "câmara", "videovigilância", "vigilancia", "vigilância"],
      answer: "📷 Os nossos sistemas de **CCTV e Videovigilância** incluem câmeras IP e analógicas de alta definição com IA integrada para deteção de pessoas e veículos. Monitore o seu espaço de qualquer parte do mundo via app móvel. Quer solicitar um orçamento?"
    },
    {
      triggers: ["alarme", "intrusao", "intrusão", "sensor", "sirene", "intruso"],
      answer: "🚨 Os nossos **Sistemas de Alarme e Intrusão** protegem o seu espaço com sensores de movimento, sensores magnéticos, sirenes de alto impacto e centrais conectadas por GSM/Wi-Fi. Receba alertas imediatos no seu telemóvel. Deseja mais informações?"
    },
    {
      triggers: ["acesso", "acessos", "biometria", "facial", "rfid", "cartao", "cartão", "torniquete", "catraca", "fechadura"],
      answer: "🔐 O nosso serviço de **Controlo de Acessos** cobre desde fechaduras eletrónicas até reconhecimento facial, biometria, cartões RFID e torniquetes. Ideal para empresas, condomínios e indústrias. Quer saber mais?"
    },
    {
      triggers: ["incendio", "incêndio", "fogo", "fumo", "detetor", "detector"],
      answer: "🔥 Os nossos **Sistemas de Deteção de Incêndio** incluem detetores óticos de fumo, detetores térmicos, centrais de incêndio e sistemas de evacuação. Cumpre todas as normas europeias de segurança contra incêndio."
    },
    {
      triggers: ["portao", "portão", "automatismo", "automacao", "automação", "motor", "barreira"],
      answer: "🚗 Instalamos **Automatismos para Portões** de correr e batente, barreiras automáticas e sistemas de abertura remota por app. Ideal para residências, condomínios e empresas. Posso agendar uma visita técnica?"
    },
    {
      triggers: ["rede", "redes", "wifi", "wi-fi", "cabo", "cabeamento", "switch", "router"],
      answer: "🌐 As nossas **Soluções de Redes** incluem cabeamento estruturado, racks, switches PoE, routers e Wi-Fi profissional. Essenciais para o funcionamento dos sistemas de segurança e comunicação."
    },
    {
      triggers: ["ups", "energia", "bateria", "backup", "eletricidade", "corrente"],
      answer: "⚡ Os nossos **Sistemas UPS e Energia de Backup** garantem que câmeras, alarmes e redes continuem a funcionar mesmo durante cortes de energia. Proteção total 24/7."
    },
    {
      triggers: ["telecomunicacao", "telecomunicação", "telecomunicacoes", "comunicacao", "comunicação", "intercom"],
      answer: "📡 As nossas **Soluções de Telecomunicações** incluem infraestrutura técnica, pontos de comunicação, antenas e integração de sistemas para ambientes modernos e conectados."
    },
    {
      triggers: ["preco", "preço", "custo", "valor", "orcamento", "orçamento", "quanto custa"],
      answer: "💰 Os nossos preços variam consoante o projeto e as necessidades específicas do cliente. Fazemos **orçamentos gratuitos e personalizados**. Pode contactar-nos pelo WhatsApp (+351 918 880 788) ou preencher o formulário de contacto no site."
    },
    {
      triggers: ["contacto", "contato", "falar", "ligar", "telefone", "whatsapp", "email"],
      answer: "📞 Pode contactar a Cotton Dome LDA:\n\n📱 **Telefone:** +351 918 880 788\n💬 **WhatsApp:** +351 918 880 788\n📧 **Email:** suporte@domme.pt\n\n⏰ Segunda a Sexta: 09h–18h30\nSábado (Urgências): 09h–13h"
    },
    {
      triggers: ["horario", "horário", "funcionamento", "aberto", "trabalho"],
      answer: "⏰ O nosso horário de funcionamento:\n\n🗓️ **Segunda a Sexta-feira:** 09:00h às 18:30h\n🗓️ **Sábado (Urgências):** 09:00h às 13:00h"
    },
    {
      triggers: ["onde", "localizacao", "localização", "portugal", "sede", "morada", "endereco", "endereço"],
      answer: "📍 A Cotton Dome LDA está sediada em **Portugal**, prestando serviços em todo o território nacional. Contacte-nos para agendar uma visita técnica gratuita ao seu espaço."
    },
    {
      triggers: ["garantia", "manutencao", "manutenção", "suporte", "assistencia", "assistência"],
      answer: "🛡️ Todos os nossos projetos incluem **garantia de instalação** e suporte técnico dedicado. Trabalhamos com marcas homologadas e equipamentos com garantia de fábrica. O nosso serviço pós-venda está disponível para qualquer necessidade."
    },
    {
      triggers: ["servico", "serviço", "servicos", "serviços", "solucao", "solução", "o que fazem", "o que fazeis"],
      answer: "🏢 A Cotton Dome LDA oferece soluções completas em:\n\n📷 CCTV e Videovigilância\n🚨 Sistemas de Alarme\n🔐 Controlo de Acessos\n🔥 Deteção de Incêndio\n🚗 Automatismos\n🌐 Redes\n⚡ UPS e Energia\n📡 Telecomunicações\n\nQual serviço lhe interessa?"
    },
    {
      triggers: ["obrigado", "obrigada", "ok", "perfeito", "ótimo", "otimo", "fixe", "muito bem"],
      answer: "😊 Fico feliz em ajudar! Se tiver mais alguma dúvida ou quiser solicitar um orçamento, estou aqui. A Cotton Dome LDA tem toda a atenção para o seu projeto de segurança."
    }
  ],
  en: [
    {
      triggers: ["hello", "hi", "hey", "good morning", "good afternoon"],
      answer: "Hello! 👋 I'm the Cotton Dome LDA virtual assistant. I can help you with information about our security services, quotes and installations. How can I help you?"
    },
    {
      triggers: ["cctv", "camera", "video", "surveillance", "monitoring"],
      answer: "📷 Our **CCTV & Video Surveillance** systems include high-definition IP and analog cameras with AI for detecting people and vehicles. Monitor your space from anywhere via mobile app. Would you like to request a quote?"
    },
    {
      triggers: ["alarm", "intrusion", "sensor", "siren", "motion"],
      answer: "🚨 Our **Alarm & Intrusion Systems** protect your space with motion sensors, magnetic contacts, high-impact sirens and GSM/Wi-Fi connected panels. Receive instant alerts on your phone. Want more information?"
    },
    {
      triggers: ["access", "biometric", "facial", "rfid", "card", "turnstile", "lock"],
      answer: "🔐 Our **Access Control** service covers electronic locks, facial recognition, biometrics, RFID cards and turnstiles. Ideal for businesses, condominiums and industries."
    },
    {
      triggers: ["fire", "smoke", "detection", "detector"],
      answer: "🔥 Our **Fire Detection Systems** include optical smoke detectors, heat detectors, fire panels and evacuation systems. Complies with all European fire safety standards."
    },
    {
      triggers: ["gate", "automation", "motor", "barrier", "automatic"],
      answer: "🚗 We install **Gate Automation** for sliding and swing gates, automatic barriers and remote app opening systems. Ideal for residences, condominiums and businesses."
    },
    {
      triggers: ["network", "wifi", "cable", "cabling", "switch", "router"],
      answer: "🌐 Our **Network Solutions** include structured cabling, racks, PoE switches, routers and professional Wi-Fi. Essential for security and communication systems."
    },
    {
      triggers: ["ups", "energy", "battery", "backup", "power"],
      answer: "⚡ Our **UPS & Backup Energy Systems** ensure cameras, alarms and networks continue working even during power outages. Total 24/7 protection."
    },
    {
      triggers: ["price", "cost", "quote", "budget", "how much"],
      answer: "💰 Our prices vary according to the project and specific client needs. We offer **free personalized quotes**. Contact us via WhatsApp (+351 918 880 788) or fill out the contact form on the website."
    },
    {
      triggers: ["contact", "phone", "whatsapp", "email", "call"],
      answer: "📞 Contact Cotton Dome LDA:\n\n📱 **Phone:** +351 918 880 788\n💬 **WhatsApp:** +351 918 880 788\n📧 **Email:** suporte@domme.pt\n\n⏰ Mon–Fri: 9am–6:30pm\nSaturday (Emergencies): 9am–1pm"
    },
    {
      triggers: ["thank", "thanks", "ok", "great", "perfect", "good"],
      answer: "😊 Happy to help! If you have any more questions or would like to request a quote, I'm here. Cotton Dome LDA is fully dedicated to your security project."
    },
    {
      triggers: ["service", "services", "what do you do", "solutions"],
      answer: "🏢 Cotton Dome LDA offers complete solutions in:\n\n📷 CCTV & Video Surveillance\n🚨 Alarm Systems\n🔐 Access Control\n🔥 Fire Detection\n🚗 Automation\n🌐 Networks\n⚡ UPS & Energy\n📡 Telecoms\n\nWhich service interests you?"
    }
  ],
  fr: [
    {
      triggers: ["bonjour", "bonsoir", "salut", "hello", "bonne journee"],
      answer: "Bonjour! 👋 Je suis l'assistant virtuel de Cotton Dome LDA. Je peux vous aider avec des informations sur nos services de sécurité, devis et installations. Comment puis-je vous aider?"
    },
    {
      triggers: ["cctv", "camera", "vidéo", "surveillance", "monitoring"],
      answer: "📷 Nos systèmes de **CCTV et Vidéosurveillance** comprennent des caméras IP et analogiques haute définition avec IA pour détecter personnes et véhicules. Surveillez votre espace depuis n'importe où via app mobile."
    },
    {
      triggers: ["alarme", "intrusion", "capteur", "sirène", "mouvement"],
      answer: "🚨 Nos **Systèmes d'Alarme et Intrusion** protègent votre espace avec capteurs de mouvement, contacts magnétiques, sirènes haute puissance et centrales connectées GSM/Wi-Fi. Recevez des alertes instantanées sur votre téléphone."
    },
    {
      triggers: ["accès", "acces", "biométrie", "facial", "rfid", "carte", "badge"],
      answer: "🔐 Notre service de **Contrôle d'Accès** couvre les serrures électroniques, la reconnaissance faciale, la biométrie, les cartes RFID et les tourniquets. Idéal pour les entreprises, copropriétés et industries."
    },
    {
      triggers: ["incendie", "fumée", "feu", "détecteur", "detecteur"],
      answer: "🔥 Nos **Systèmes de Détection Incendie** incluent détecteurs optiques de fumée, détecteurs thermiques, centrales incendie et systèmes d'évacuation. Conforme à toutes les normes européennes."
    },
    {
      triggers: ["portail", "barrière", "automatisme", "moteur", "automatique"],
      answer: "🚗 Nous installons des **Automatismes de Portails** coulissants et battants, barrières automatiques et systèmes d'ouverture à distance via app. Idéal pour résidences, copropriétés et entreprises."
    },
    {
      triggers: ["prix", "coût", "devis", "tarif", "combien"],
      answer: "💰 Nos prix varient selon le projet et les besoins spécifiques du client. Nous proposons des **devis gratuits et personnalisés**. Contactez-nous via WhatsApp (+351 918 880 788) ou remplissez le formulaire de contact."
    },
    {
      triggers: ["contact", "téléphone", "whatsapp", "email", "appeler"],
      answer: "📞 Contactez Cotton Dome LDA:\n\n📱 **Téléphone:** +351 918 880 788\n💬 **WhatsApp:** +351 918 880 788\n📧 **Email:** suporte@domme.pt\n\n⏰ Lun–Ven: 9h–18h30\nSamedi (Urgences): 9h–13h"
    },
    {
      triggers: ["merci", "ok", "parfait", "super", "bien"],
      answer: "😊 Heureux de vous aider! Si vous avez d'autres questions ou souhaitez demander un devis, je suis là. Cotton Dome LDA est entièrement dédiée à votre projet de sécurité."
    },
    {
      triggers: ["service", "services", "que faites", "solutions"],
      answer: "🏢 Cotton Dome LDA offre des solutions complètes en:\n\n📷 CCTV & Vidéosurveillance\n🚨 Systèmes d'Alarme\n🔐 Contrôle d'Accès\n🔥 Détection Incendie\n🚗 Automatismes\n🌐 Réseaux\n⚡ UPS & Énergie\n📡 Télécommunications\n\nQuel service vous intéresse?"
    }
  ]
};

const GREETINGS: Record<"pt" | "en" | "fr", string> = {
  pt: "Olá! 👋 Sou o assistente virtual da **Cotton Dome LDA**.\n\nPosso ajudá-lo com informações sobre os nossos serviços de segurança, orçamentos e muito mais. Como posso ajudar?",
  en: "Hello! 👋 I'm the **Cotton Dome LDA** virtual assistant.\n\nI can help you with information about our security services, quotes and much more. How can I help?",
  fr: "Bonjour! 👋 Je suis l'assistant virtuel de **Cotton Dome LDA**.\n\nJe peux vous aider avec des informations sur nos services de sécurité, devis et bien plus encore. Comment puis-je vous aider?"
};

const DEFAULT_ANSWERS: Record<"pt" | "en" | "fr", string> = {
  pt: "Peço desculpa, não compreendi totalmente a sua questão. Posso ajudá-lo com informações sobre os nossos serviços:\n\n📷 CCTV • 🚨 Alarmes • 🔐 Acessos • 🔥 Incêndio • 🚗 Automatismos • 🌐 Redes • ⚡ UPS\n\nOu pode contactar-nos diretamente pelo WhatsApp: **+351 918 880 788**",
  en: "Sorry, I didn't quite understand your question. I can help you with information about our services:\n\n📷 CCTV • 🚨 Alarms • 🔐 Access • 🔥 Fire • 🚗 Automation • 🌐 Networks • ⚡ UPS\n\nOr contact us directly on WhatsApp: **+351 918 880 788**",
  fr: "Désolé, je n'ai pas bien compris votre question. Je peux vous aider avec nos services:\n\n📷 CCTV • 🚨 Alarmes • 🔐 Accès • 🔥 Incendie • 🚗 Automatismes • 🌐 Réseaux • ⚡ UPS\n\nOu contactez-nous directement sur WhatsApp: **+351 918 880 788**"
};

const PLACEHOLDER: Record<"pt" | "en" | "fr", string> = {
  pt: "Escreva a sua mensagem...",
  en: "Write your message...",
  fr: "Écrivez votre message..."
};

const TITLE: Record<"pt" | "en" | "fr", string> = {
  pt: "Assistente Cotton Dome",
  en: "Cotton Dome Assistant",
  fr: "Assistant Cotton Dome"
};

const ONLINE: Record<"pt" | "en" | "fr", string> = {
  pt: "Online · Resposta imediata",
  en: "Online · Instant reply",
  fr: "En ligne · Réponse immédiate"
};

// ─── Bot Logic ────────────────────────────────────────────────────────────────
function getBotAnswer(input: string, lang: "pt" | "en" | "fr"): string {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();

  const faqs = FAQ[lang];
  for (const faq of faqs) {
    if (faq.triggers.some((trigger) => normalized.includes(trigger.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return faq.answer;
    }
  }
  return DEFAULT_ANSWERS[lang];
}

// ─── Render Markdown-like text ────────────────────────────────────────────────
function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} className="font-bold text-[#E2AF55]">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ChatBot({ lang }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(1);

  // Greeting message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: messageIdRef.current++,
          from: "bot",
          text: GREETINGS[lang]
        }
      ]);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: messageIdRef.current++, from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = getBotAnswer(trimmed, lang);
      setMessages((prev) => [...prev, { id: messageIdRef.current++, from: "bot", text: answer }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-[5.5rem] right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir chat de suporte / Open support chat"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#C28D35] to-[#A07020] shadow-[0_4px_20px_rgba(194,141,53,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Ping animation when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#C28D35] opacity-25 animate-ping" />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">1</span>
            </span>
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-[7.5rem] right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.8)] border border-[#2a2a2a] flex flex-col"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#111111] to-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#C28D35] to-[#8A6020] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111111]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none mb-0.5">{TITLE[lang]}</p>
                  <p className="text-emerald-400 text-[10px] font-mono">{ONLINE[lang]}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#888] hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#0a0a0a] px-4 py-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C28D35] to-[#8A6020] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.from === "user"
                        ? "bg-gradient-to-br from-[#C28D35] to-[#A07020] text-white rounded-tr-sm"
                        : "bg-[#181818] text-[#E0E0E0] border border-[#282828] rounded-tl-sm"
                    }`}
                  >
                    {renderText(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C28D35] to-[#8A6020] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#181818] border border-[#282828] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C28D35] opacity-80 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-[#111111] border-t border-[#2a2a2a] px-3 py-3 flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER[lang]}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#C28D35] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] outline-none transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C28D35] to-[#A07020] flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

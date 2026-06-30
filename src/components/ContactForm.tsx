import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageSquare, Check, AlertCircle } from "lucide-react";
import { SOLUTIONS, CONTACT_INFO } from "../data";
import { SiteSettings, DbService } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface ContactFormProps {
  selectedService: string;
  onClearService: () => void;
  settings?: SiteSettings;
  services?: DbService[];
}

export function ContactForm({ selectedService, onClearService, settings, services }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync with selected service from parent
  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, service: selectedService }));
    }
  }, [selectedService]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    fetch(`${API_BASE}/api/contact.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((res) => {
        setIsSubmitting(false);
        if (res.success) {
          setSubmitSuccess(true);
          setFormData({
            name: "",
            phone: "",
            email: "",
            service: "",
            message: "",
          });
          onClearService();
        } else {
          setErrorMessage(res.error || "Erro ao submeter contacto.");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setErrorMessage("Erro ao comunicar com o servidor. Por favor, tente de novo.");
      });
  };

  // Resolve contact settings
  const phoneVal = settings?.phone || CONTACT_INFO.phone;
  const whatsappVal = settings?.whatsapp || CONTACT_INFO.whatsapp;
  const emailVal = settings?.email || CONTACT_INFO.email;
  const addressVal = settings?.address || CONTACT_INFO.address;
  const hoursWeekVal = settings?.working_hours_week || CONTACT_INFO.workingHoursWeek;
  const hoursSatVal = settings?.working_hours_sat || CONTACT_INFO.workingHoursSat;

  // Generate WhatsApp message URL based on current inputs
  const getWhatsAppUrl = () => {
    const isPlaceholder = whatsappVal.includes("[");
    const cleanNumber = isPlaceholder ? "351918880788" : whatsappVal.replace(/[^\d]/g, "");
    const intro = "Olá Cotton Dome, gostaria de solicitar um orçamento para soluções de segurança.";
    const details = formData.name 
      ? `\n\n*Nome:* ${formData.name}${formData.phone ? `\n*Telefone:* ${formData.phone}` : ""}${formData.service ? `\n*Serviço:* ${formData.service}` : ""}${formData.message ? `\n*Mensagem:* ${formData.message}` : ""}`
      : "";
    
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(intro + details)}`;
  };

  const isPhonePlaceholder = phoneVal.includes("[");
  const phoneHref = isPhonePlaceholder ? "#contacto" : `tel:${phoneVal.replace(/[^\d+]/g, "")}`;

  const isEmailPlaceholder = emailVal.includes("[");
  const emailHref = isEmailPlaceholder ? "#contacto" : `mailto:${emailVal}`;

  // Get active solutions to populate dropdown
  const dropdownServices = services && services.length > 0 
    ? services.map(s => ({ id: s.id, title: s.title })) 
    : SOLUTIONS.map(s => ({ id: s.id, title: s.title }));

  return (
    <section id="contacto" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[#1a1a1a]">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#C28D35]/3 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs uppercase tracking-widest text-[#C28D35] mb-3"
          >
            Contacto & Propostas
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            Solicite o seu orçamento
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            A nossa equipa técnica está preparada para analisar o seu caso. Preencha o formulário institucional ou contacte-nos diretamente por telefone ou WhatsApp.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
          
          {/* Left Block: Corporate Contacts info (Second on Mobile, First on Desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-5 card-luxury p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-6">
                Informações de Contacto
              </h3>
              <p className="text-xs sm:text-sm text-[#D9D9D9] font-sans leading-relaxed mb-8">
                Tem dúvidas ou deseja agendar uma visita de análise técnica para a sua residência ou empresa? Utilize os nossos canais oficiais de atendimento rápido.
              </p>

              {/* Contacts Grid */}
              <div className="space-y-6 mb-8">
                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">Telefone</span>
                    <a href={phoneHref} className="block text-sm text-white hover:text-[#E2AF55] font-mono transition-colors mt-0.5">
                      {phoneVal}
                    </a>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Chamada para a rede móvel nacional</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">E-mail</span>
                    <a href={emailHref} className="block text-sm text-white hover:text-[#E2AF55] font-sans transition-colors mt-0.5">
                      {emailVal}
                    </a>
                  </div>
                </div>

                {/* Map location */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">Localização</span>
                    <span className="block text-sm text-white font-sans mt-0.5">
                      {addressVal}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Atendimento em todo o Norte e Centro de Portugal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Hours disclaimer */}
            <div className="border-t border-[#222222] pt-6">
              <span className="block font-mono text-[9px] text-[#E2AF55] uppercase tracking-widest mb-1">
                DISPONIBILIDADE
              </span>
              <span className="block text-xs text-[#D9D9D9] font-sans leading-relaxed">
                {hoursWeekVal}<br />
                {hoursSatVal}
              </span>
            </div>
          </div>

          {/* Right Block: Elegant Form wrapper (First on Mobile, Second on Desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-7 card-luxury p-8 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">
              Formulário de Orçamento
            </h3>

            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {errorMessage && (
                    <div className="p-4 bg-red-950/40 border border-red-500/50 rounded flex gap-2.5 items-center text-red-200 text-xs font-sans">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block font-display text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all"
                        placeholder="Ex: João Silva"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-display text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                        Telefone / Telemóvel *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all"
                        placeholder="Ex: +351 912 345 678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label className="block font-display text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                        Endereço de E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all"
                        placeholder="Ex: joao.silva@empresa.com"
                      />
                    </div>

                    {/* Service selection */}
                    <div>
                      <label className="block font-display text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                        Tipo de Serviço Desejado
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all appearance-none"
                      >
                        <option value="">-- Selecione uma solução --</option>
                        {dropdownServices.map((sol) => (
                          <option key={sol.id} value={sol.title}>
                            {sol.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-display text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                      Detalhes do Projeto / Mensagem
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all resize-none"
                      placeholder="Descreva as suas necessidades de segurança, dimensão do espaço ou dúvidas técnicas..."
                    ></textarea>
                  </div>

                  {/* Submit Button buttons layout */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-gold-premium disabled:opacity-50 font-display font-bold uppercase tracking-wider py-4 px-6 rounded text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>A enviar...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar pedido de orçamento</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border border-[#25D366]/40 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 text-[#25D366] font-display font-bold uppercase tracking-wider py-4 px-6 rounded text-xs flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Falar pelo WhatsApp</span>
                    </a>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#C28D35]/10 border border-[#C28D35] flex items-center justify-center text-[#C28D35] mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-white mb-3">
                    Pedido Enviado com Sucesso!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#CFCFCF] font-sans leading-relaxed max-w-md mb-8">
                    Agradecemos o seu contacto técnico com a Cotton Dome LDA. Um engenheiro de segurança analisará os dados fornecidos e responderá em menos de 24 horas úteis.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="border border-[#222] hover:border-[#C28D35]/50 bg-[#161616] hover:bg-black text-xs text-[#CFCFCF] hover:text-[#C28D35] px-6 py-3 rounded font-display font-semibold uppercase tracking-wider transition-colors"
                  >
                    Enviar Outro Pedido
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}

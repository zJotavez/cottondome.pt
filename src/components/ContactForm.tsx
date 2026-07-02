import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageSquare, Check, AlertCircle } from "lucide-react";
import { SOLUTIONS, CONTACT_INFO } from "../data";
import { SiteSettings, DbService } from "../types";
import { TRANSLATIONS } from "../translations";
import { submitContactMessage } from "../lib/database";
import { mapSlugToKey } from "../slugUtils";

interface ContactFormProps {
  selectedService: string;
  onClearService: () => void;
  settings?: SiteSettings;
  services?: DbService[];
  lang?: "pt" | "en" | "fr";
}

export function ContactForm({ selectedService, onClearService, settings, services, lang = "pt" }: ContactFormProps) {
  const t = TRANSLATIONS[lang];

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
      setErrorMessage(lang === "pt" ? "Por favor, preencha todos os campos obrigatórios (*)." : lang === "en" ? "Please fill in all required fields (*)." : "Veuillez remplir tous les champs obligatoires (*).");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    submitContactMessage(formData)
      .then(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: "", phone: "", email: "", service: "", message: "" });
        onClearService();
      })
      .catch(() => {
        setIsSubmitting(false);
        setErrorMessage(t.contact.form.sendError);
      });
  };

  // Resolve contact settings — email fixo sempre em suporte@domme.pt
  const phoneVal = settings?.phone || CONTACT_INFO.phone;
  const whatsappVal = settings?.whatsapp || CONTACT_INFO.whatsapp;
  const emailVal = "suporte@domme.pt"; // FIXO: não usar settings.email que pode conter placeholder do banco de dados
  const addressVal = settings?.address || CONTACT_INFO.address;
  const hoursWeekVal = settings?.working_hours_week || CONTACT_INFO.workingHoursWeek;
  const hoursSatVal = settings?.working_hours_sat || CONTACT_INFO.workingHoursSat;

  // Generate WhatsApp message URL based on current inputs
  const getWhatsAppUrl = () => {
    const isPlaceholder = whatsappVal.includes("[");
    const cleanNumber = isPlaceholder ? "351918880788" : whatsappVal.replace(/[^\d]/g, "");
    const intro = lang === "pt" 
      ? "Olá Cotton Dome, gostaria de solicitar um orçamento para soluções de segurança."
      : lang === "en"
      ? "Hello Cotton Dome, I would like to request a quote for security solutions."
      : "Bonjour Cotton Dome, je souhaite demander un devis pour des solutions de sécurité.";
    const details = formData.name 
      ? `\n\n*Name:* ${formData.name}${formData.phone ? `\n*Phone:* ${formData.phone}` : ""}${formData.service ? `\n*Service:* ${formData.service}` : ""}${formData.message ? `\n*Message:* ${formData.message}` : ""}`
      : "";
    
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(intro + details)}`;
  };

  const isPhonePlaceholder = phoneVal.includes("[");
  const phoneHref = isPhonePlaceholder ? "#contacto" : `tel:${phoneVal.replace(/[^\d+]/g, "")}`;

  const isEmailPlaceholder = emailVal.includes("[");
  const emailHref = isEmailPlaceholder ? "#contacto" : `mailto:${emailVal}`;

  // Get active solutions to populate dropdown
  const dropdownServices = services && services.length > 0 
    ? services.map(s => {
        const mappedKey = mapSlugToKey(s.slug);
        const localTrans = t.services[mappedKey];
        return { id: s.id, title: localTrans ? localTrans.title : s.title };
      }) 
    : SOLUTIONS.map(s => {
        const mappedKey = mapSlugToKey(s.id);
        const localTrans = t.services[mappedKey];
        return { id: s.id, title: localTrans ? localTrans.title : s.title };
      });

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
            {t.contact.tag}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4"
          >
            {t.contact.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-[#CFCFCF] font-sans leading-relaxed"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
          
          {/* Left Block: Corporate Contacts info */}
          <div className="order-2 lg:order-1 lg:col-span-5 card-luxury p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-6">
                {lang === "pt" ? "Informações de Contacto" : lang === "en" ? "Contact Info" : "Informations de Contact"}
              </h3>
              <p className="text-xs sm:text-sm text-[#D9D9D9] font-sans leading-relaxed mb-8">
                {lang === "pt"
                  ? "Tem dúvidas ou deseja agendar uma visita de análise técnica para a sua residência ou empresa? Utilize os nossos canais oficiais de atendimento rápido."
                  : lang === "en"
                  ? "Do you have questions or want to schedule a technical analysis visit for your home or business? Use our official quick service channels."
                  : "Vous avez des questions ou souhaitez planifier une visite d'analyse technique pour votre domicile ou votre entreprise? Utilisez nos canaux officiels de service rapide."}
              </p>

              {/* Contacts Grid */}
              <div className="space-y-6 mb-8">
                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">{t.contact.info.phone}</span>
                    <a href={phoneHref} className="block text-sm text-white hover:text-[#E2AF55] font-mono transition-colors mt-0.5">
                      {phoneVal}
                    </a>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {lang === "pt" ? "Chamada para a rede móvel nacional" : lang === "en" ? "Call to the national mobile network" : "Appel vers le réseau mobile national"}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">{t.contact.info.email}</span>
                    <a href={emailHref} className="block text-sm text-white hover:text-[#E2AF55] font-mono transition-colors mt-0.5">
                      {emailVal}
                    </a>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {lang === "pt" ? "Resposta em 24h úteis" : lang === "en" ? "Reply within 24 business hours" : "Réponse sous 24h ouvrées"}
                    </span>
                  </div>
                </div>

                {/* Map location */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded bg-[#1A1A1A] border border-[#E2AF55]/25 flex items-center justify-center text-[#E2AF55] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-500 font-bold">{t.contact.info.address}</span>
                    <span className="block text-sm text-white font-sans mt-0.5">
                      {addressVal}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {lang === "pt" ? "Atendimento em todo o Norte e Centro de Portugal" : lang === "en" ? "Service throughout North and Central Portugal" : "Service dans tout le Nord et le Centre du Portugal"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Hours disclaimer */}
            <div className="border-t border-[#222222] pt-6">
              <span className="block font-mono text-[9px] text-[#E2AF55] uppercase tracking-widest mb-1">
                {lang === "pt" ? "DISPONIBILIDADE" : "AVAILABILITY"}
              </span>
              <span className="block text-xs text-[#D9D9D9] font-sans leading-relaxed">
                {hoursWeekVal}<br />
                {hoursSatVal}
              </span>
            </div>
          </div>

          {/* Right Block: Elegant Form wrapper */}
          <div className="order-1 lg:order-2 lg:col-span-7 card-luxury p-8 relative">
            <h3 className="font-display font-bold text-xl text-white mb-6">
              {lang === "pt" ? "Formulário de Orçamento" : lang === "en" ? "Quote Form" : "Formulaire de Devis"}
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
                        {t.contact.form.name} *
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
                        {t.contact.form.phone} *
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
                        {t.contact.form.email} *
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
                        {t.contact.form.service}
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all appearance-none"
                      >
                        <option value="">{t.contact.form.servicePlaceholder}</option>
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
                      {t.contact.form.message}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-[#161616] border border-[#222222] focus:border-[#E2AF55] focus:shadow-[0_0_10px_rgba(226,175,85,0.15)] rounded px-4 py-3 text-xs font-sans text-white focus:outline-none transition-all resize-none"
                      placeholder={lang === "pt" ? "Descreva as suas necessidades de segurança..." : lang === "en" ? "Describe your security needs..." : "Décrivez vos besoins de sécurité..."}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-gold-premium disabled:opacity-50 font-display font-bold uppercase tracking-wider py-4 px-6 rounded text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>{t.contact.form.sending}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{t.contact.form.submit}</span>
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
                      <span>{t.contact.info.whatsapp}</span>
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
                    {lang === "pt" ? "Pedido Enviado com Sucesso!" : lang === "en" ? "Request Sent Successfully!" : "Demande Envoyée avec Succès!"}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#CFCFCF] font-sans leading-relaxed max-w-md mb-8">
                    {t.contact.form.sendSuccess}
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="border border-[#222] hover:border-[#C28D35]/50 bg-[#161616] hover:bg-black text-xs text-[#CFCFCF] hover:text-[#C28D35] px-6 py-3 rounded font-display font-semibold uppercase tracking-wider transition-colors"
                  >
                    {lang === "pt" ? "Enviar Outro Pedido" : lang === "en" ? "Send Another Request" : "Envoyer une autre demande"}
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

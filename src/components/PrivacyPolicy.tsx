import React, { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Lock, Eye, Cookie, Mail, Phone, Globe, FileText } from "lucide-react";

interface PrivacyPolicyProps {
  onNavigate: (path: string) => void;
  lang?: "pt" | "en" | "fr";
}

export function PrivacyPolicy({ onNavigate, lang = "pt" }: PrivacyPolicyProps) {

  useEffect(() => {
    document.title = "Política de Privacidade | Cotton Dome LDA";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Política de Privacidade da Cotton Dome LDA. Saiba como protegemos os seus dados pessoais em conformidade com o RGPD.");
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#050505] text-[#CFCFCF] min-h-screen">

      {/* HERO */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden border-b border-[#1a1a1a]">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#050505] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#C28D35]/4 blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#E2AF55]/3 blur-[140px] pointer-events-none"></div>
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-30"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-xl bg-[#111]/90 border border-[#E2AF55]/40 flex items-center justify-center text-[#E2AF55] mx-auto mb-6 shadow-lg shadow-[#E2AF55]/10"
          >
            <ShieldCheck className="w-7 h-7" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight leading-tight uppercase mb-4"
          >
            Política de Privacidade
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-xs sm:text-sm text-[#E2AF55] uppercase tracking-widest max-w-3xl mx-auto mb-3 font-semibold"
          >
            Cotton Dome LDA
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs text-gray-500 font-mono uppercase tracking-wider"
          >
            Última atualização: 05 de agosto de 2026
          </motion.p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E2AF55]/3 blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm sm:text-base text-[#D9D9D9] font-sans leading-relaxed">
              A Cotton Dome LDA compromete-se a proteger a privacidade dos utilizadores do seu website, clientes e potenciais clientes, garantindo que os dados pessoais são tratados de forma transparente, segura e em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) – Regulamento (UE) 2016/679 e restante legislação aplicável em Portugal.
            </p>
          </motion.div>

          {/* Section 1 */}
          <PolicySection
            number="01"
            title="Responsável pelo Tratamento"
            icon={<FileText className="w-4 h-4" />}
            delay={0}
          >
            <p className="text-sm text-[#D9D9D9] font-sans leading-relaxed mb-3 font-semibold">Cotton Dome LDA</p>
            <ul className="space-y-2 text-sm text-[#CFCFCF] font-sans">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                <span>Website: <a href="https://www.domme.pt" className="text-[#E2AF55] hover:underline">www.domme.pt</a></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                <span>E-mail: <a href="mailto:suporte@domme.pt" className="text-[#E2AF55] hover:underline">suporte@domme.pt</a></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                <span>Telefone: <a href="tel:+351918880788" className="text-[#E2AF55] hover:underline">+351 918 880 788</a></span>
              </li>
            </ul>
          </PolicySection>

          {/* Section 2 */}
          <PolicySection
            number="02"
            title="Dados Pessoais Recolhidos"
            icon={<Eye className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">Podemos recolher os seguintes dados:</p>
            <PolicyList items={[
              "Nome",
              "Endereço de e-mail",
              "Número de telefone",
              "Empresa (quando aplicável)",
              "Conteúdo da mensagem enviada pelo utilizador",
              "Dados fornecidos em formulários de contacto, pedidos de orçamento ou recrutamento",
              "Endereço IP",
              "Informações do navegador e dispositivo",
              "Cookies e tecnologias semelhantes",
            ]} />
          </PolicySection>

          {/* Section 3 */}
          <PolicySection
            number="03"
            title="Finalidade do Tratamento"
            icon={<FileText className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">Os dados pessoais são utilizados para:</p>
            <PolicyList items={[
              "Responder a pedidos de contacto",
              "Elaborar orçamentos",
              "Prestar assistência técnica",
              "Processar candidaturas de recrutamento",
              "Comunicar com clientes",
              "Melhorar os nossos serviços",
              "Cumprir obrigações legais",
              "Garantir a segurança do website",
              "Enviar comunicações comerciais, apenas quando exista consentimento",
            ]} />
          </PolicySection>

          {/* Section 4 */}
          <PolicySection
            number="04"
            title="Fundamento Jurídico"
            icon={<FileText className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">O tratamento dos dados baseia-se em:</p>
            <PolicyList items={[
              "Consentimento do titular",
              "Execução de contrato ou diligências pré-contratuais",
              "Cumprimento de obrigações legais",
              "Interesse legítimo da Cotton Dome LDA",
            ]} />
          </PolicySection>

          {/* Section 5 */}
          <PolicySection
            number="05"
            title="Conservação dos Dados"
            icon={<Lock className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed">
              Os dados serão conservados apenas durante o período necessário para cumprir as finalidades para que foram recolhidos ou enquanto existir obrigação legal de conservação.
            </p>
          </PolicySection>

          {/* Section 6 */}
          <PolicySection
            number="06"
            title="Partilha de Dados"
            icon={<ShieldCheck className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">
              A Cotton Dome LDA <strong className="text-white">não vende nem comercializa dados pessoais</strong>.
            </p>
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">Os dados poderão ser partilhados apenas quando necessário com:</p>
            <PolicyList items={[
              "Prestadores de serviços tecnológicos",
              "Empresas de alojamento web",
              "Plataformas de marketing e comunicação (Meta, Google, Microsoft, entre outras)",
              "Entidades públicas quando exigido por lei",
            ]} />
            <p className="text-xs text-gray-500 font-sans mt-4 italic">
              Todos os parceiros cumprem o RGPD e adotam medidas de segurança adequadas.
            </p>
          </PolicySection>

          {/* Section 7 */}
          <PolicySection
            number="07"
            title="Segurança"
            icon={<Lock className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">
              Aplicamos medidas técnicas e organizativas destinadas a proteger os dados pessoais contra:
            </p>
            <PolicyList items={[
              "Acesso não autorizado",
              "Alteração",
              "Divulgação",
              "Perda",
              "Destruição",
            ]} />
            <p className="text-xs text-gray-500 font-sans mt-4 italic">
              Apesar das medidas implementadas, nenhum sistema é totalmente imune a riscos inerentes à utilização da Internet.
            </p>
          </PolicySection>

          {/* Section 8 */}
          <PolicySection
            number="08"
            title="Direitos dos Titulares"
            icon={<ShieldCheck className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">Nos termos do RGPD, o utilizador pode solicitar:</p>
            <PolicyList items={[
              "Direito de acesso",
              "Direito de retificação",
              "Direito ao apagamento",
              "Direito à limitação do tratamento",
              "Direito de oposição",
              "Direito à portabilidade dos dados",
              "Retirar o consentimento a qualquer momento",
            ]} />
            <div className="mt-5 p-4 rounded-lg bg-[#111] border border-[#E2AF55]/20">
              <p className="text-xs text-[#E2AF55] font-mono uppercase tracking-wider font-bold mb-1">Enviar pedidos para:</p>
              <a href="mailto:suporte@domme.pt" className="text-sm text-white hover:text-[#E2AF55] transition-colors font-semibold">
                suporte@domme.pt
              </a>
            </div>
          </PolicySection>

          {/* Section 9 */}
          <PolicySection
            number="09"
            title="Cookies"
            icon={<Cookie className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">Este website utiliza cookies para:</p>
            <PolicyList items={[
              "Garantir o correto funcionamento do site",
              "Melhorar a experiência de navegação",
              "Analisar estatísticas de utilização",
              "Personalizar conteúdos",
              "Medir o desempenho de campanhas publicitárias",
            ]} />
            <p className="text-xs text-gray-500 font-sans mt-4 italic">
              O utilizador pode configurar ou desativar os cookies através do seu navegador.
            </p>
          </PolicySection>

          {/* Section 10 */}
          <PolicySection
            number="10"
            title="Google Analytics e Meta Pixel"
            icon={<Eye className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">O website poderá utilizar ferramentas como:</p>
            <PolicyList items={[
              "Google Analytics",
              "Meta Pixel (Facebook Pixel)",
              "Google Tag Manager",
            ]} />
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mt-4">
              Estas ferramentas permitem compreender a utilização do website, medir campanhas publicitárias e melhorar a experiência do utilizador.
            </p>
            <p className="text-xs text-gray-500 font-sans mt-3 italic">
              Os dados recolhidos são tratados de acordo com as políticas de privacidade dos respetivos fornecedores.
            </p>
          </PolicySection>

          {/* Section 11 */}
          <PolicySection
            number="11"
            title="Recrutamento"
            icon={<FileText className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-3">
              Quando o utilizador envia uma candidatura, os dados são utilizados exclusivamente para processos de recrutamento.
            </p>
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed">
              Caso não seja selecionado, os dados serão conservados apenas durante o período legalmente permitido ou até solicitação de eliminação pelo candidato.
            </p>
          </PolicySection>

          {/* Section 12 */}
          <PolicySection
            number="12"
            title="Ligações para Websites de Terceiros"
            icon={<Globe className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-3">
              O nosso website pode conter ligações para websites externos.
            </p>
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed">
              A Cotton Dome LDA não é responsável pelas políticas de privacidade nem pelos conteúdos desses websites.
            </p>
          </PolicySection>

          {/* Section 13 */}
          <PolicySection
            number="13"
            title="Alterações à Política de Privacidade"
            icon={<FileText className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-3">
              Reservamo-nos o direito de atualizar esta Política de Privacidade sempre que necessário.
            </p>
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed">
              As alterações entram em vigor imediatamente após a sua publicação nesta página.
            </p>
          </PolicySection>

          {/* Section 14 - Contacts */}
          <PolicySection
            number="14"
            title="Contactos"
            icon={<Mail className="w-4 h-4" />}
            delay={0.05}
          >
            <p className="text-sm text-[#CFCFCF] font-sans leading-relaxed mb-4">
              Para qualquer questão relacionada com a proteção dos seus dados pessoais, contacte-nos através de:
            </p>
            <div className="p-5 rounded-xl bg-[#111] border border-[#E2AF55]/20 space-y-3">
              <p className="text-sm text-white font-display font-bold uppercase tracking-wider">Cotton Dome LDA</p>
              <ul className="space-y-2 text-sm text-[#CFCFCF] font-sans">
                <li className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                  <a href="https://www.domme.pt" className="text-[#E2AF55] hover:underline">www.domme.pt</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                  <a href="mailto:suporte@domme.pt" className="text-[#E2AF55] hover:underline">suporte@domme.pt</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#E2AF55] flex-shrink-0" />
                  <a href="tel:+351918880788" className="text-[#E2AF55] hover:underline">+351 918 880 788</a>
                </li>
              </ul>
            </div>
          </PolicySection>

          {/* Acceptance disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-6 rounded-xl bg-[#0f0f0f] border border-[#E2AF55]/15 text-center"
          >
            <p className="text-sm text-[#D9D9D9] font-sans leading-relaxed">
              Ao utilizar o website <a href="https://www.domme.pt" className="text-[#E2AF55] font-semibold hover:underline">www.domme.pt</a>, o utilizador declara que leu, compreendeu e aceita a presente Política de Privacidade.
            </p>
          </motion.div>

          {/* Back to home button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => onNavigate("/")}
              className="inline-flex items-center gap-2 px-8 py-4 btn-gold-outline text-xs rounded transition-colors cursor-pointer font-display font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar à Página Inicial</span>
            </button>
          </motion.div>

        </div>
      </section>
    </main>
  );
}

/* ============================================
   REUSABLE SUB-COMPONENTS
   ============================================ */

function PolicySection({
  number,
  title,
  icon,
  children,
  delay = 0,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="mb-12 pb-12 border-b border-[#1a1a1a] last:border-b-0"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#111] border border-[#E2AF55]/25 text-[#E2AF55] shadow-sm">
          <span className="font-display text-sm font-extrabold">{number}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#E2AF55]">{icon}</span>
          <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide uppercase">
            {title}
          </h2>
        </div>
      </div>
      <div className="pl-0 sm:pl-[52px]">
        {children}
      </div>
    </motion.div>
  );
}

function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5">
          <span className="text-[#E2AF55] mt-0.5 flex-shrink-0 text-xs font-bold">✓</span>
          <span className="text-sm text-[#D9D9D9] font-sans leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

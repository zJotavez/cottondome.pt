export interface ProductDetail {
  title: string;
  description: string;
  benefit: string;
}

export interface ServiceTranslation {
  title: string;
  slogan: string;
  shortDesc: string;
  desc: string;
}

export interface TranslationDictionary {
  nav: {
    home: string;
    solutions: string;
    equipments: string;
    projects: string;
    contact: string;
    backToHome: string;
    requestQuote: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  pillars: {
    tag: string;
    title: string;
    subtitle: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
  };
  solutions: {
    tag: string;
    title: string;
    subtitle: string;
    learnMore: string;
  };
  equipments: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      cameras: { title: string; desc: string };
      alarmCenters: { title: string; desc: string };
      motionSensors: { title: string; desc: string };
      biometrics: { title: string; desc: string };
      electronicLocks: { title: string; desc: string };
      turnstiles: { title: string; desc: string };
    };
  };
  environments: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      residencias: { name: string; desc: string };
      condominios: { name: string; desc: string };
      empresas: { name: string; desc: string };
      comercio: { name: string; desc: string };
      industrias: { name: string; desc: string };
      armazens: { name: string; desc: string };
    };
  };
  outlet: {
    tag: string;
    title: string;
    subtitle: string;
    viewProduct: string;
    requestQuote: string;
    whatsapp: string;
    badgePromo: string;
    badgeOutlet: string;
  };
  howWeWork: {
    tag: string;
    title: string;
    subtitle: string;
    steps: {
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
    };
  };
  projects: {
    tag: string;
    title: string;
    subtitle: string;
    all: string;
    categories: {
      cctv: string;
      intrusao: string;
      acessos: string;
      incendio: string;
      automatismos: string;
      redes: string;
    };
    items: {
      p1: { title: string; desc: string };
      p2: { title: string; desc: string };
      p3: { title: string; desc: string };
      p4: { title: string; desc: string };
      p5: { title: string; desc: string };
      p6: { title: string; desc: string };
    };
  };
  quoteSection: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    tag: string;
    title: string;
    desc1: string;
    desc2: string;
    mission: string;
    vision: string;
    values: string;
    valuesList: string[];
  };
  contact: {
    tag: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      phone: string;
      email: string;
      service: string;
      servicePlaceholder: string;
      message: string;
      sending: string;
      sendSuccess: string;
      sendError: string;
      submit: string;
    };
    info: {
      phone: string;
      whatsapp: string;
      email: string;
      address: string;
      workingHours: string;
      satHours: string;
    };
  };
  serviceDetail: {
    backHome: string;
    requestBudget: string;
    aboutService: string;
    generalDesc: string;
    mainBenefits: string;
    appAreas: string;
    appAreasDesc: string;
    relatedEquipments: string;
    relatedEquipmentsDesc: string;
    galleryTitle: string;
    galleryDesc: string;
    processTitle: string;
    processDesc: string;
    finalCtaTitle: string;
    finalCtaDesc: string;
    finalCtaBtn: string;
    errorTitle: string;
    errorDesc: string;
  };
  services: Record<string, ServiceTranslation>;
  productsDict: Record<string, ProductDetail>;
}

export const TRANSLATIONS: Record<"pt" | "en" | "fr", TranslationDictionary> = {
  pt: {
    nav: {
      home: "Início",
      solutions: "Soluções",
      equipments: "Equipamentos",
      projects: "Projetos",
      contact: "Contacto",
      backToHome: "Voltar para a Home",
      requestQuote: "Solicitar Orçamento"
    },
    hero: {
      badge: "Cotton Dome Security Solutions",
      title: "Segurança Inteligente para Residências, Empresas e Condomínios",
      subtitle: "A Cotton Dome LDA desenvolve soluções completas em videovigilância, controlo de acessos, intrusão, automatismos, redes, telecomunicações e sistemas de proteção profissional.",
      ctaPrimary: "Solicitar Orçamento",
      ctaSecondary: "Conhecer Soluções"
    },
    pillars: {
      tag: "Porquê Escolher-nos",
      title: "Padrão de Excelência e Confiança",
      subtitle: "Comprometemo-nos com a entrega técnica de projetos impecáveis, prestando um serviço que excede os mais elevados padrões da indústria.",
      p1Title: "Engenharia Técnica",
      p1Desc: "Instalações calculadas ao milímetro, com cablagem técnica oculta, estruturada e calibragem lógica de precisão.",
      p2Title: "Equipamentos de Elite",
      p2Desc: "Trabalhamos exclusivamente com hardware de marcas consagradas, homologado e certificado com garantia.",
      p3Title: "Suporte Permanente",
      p3Desc: "Apoio ao cliente disponível e ágil para garantir que a sua segurança nunca sofra interrupções operacionais."
    },
    solutions: {
      tag: "Serviços Especializados",
      title: "Soluções inteligentes para a sua segurança",
      subtitle: "A Cotton Dome LDA oferece soluções completas em segurança, automação e infraestrutura técnica, adaptadas às necessidades de cada cliente.",
      learnMore: "Saber mais"
    },
    equipments: {
      tag: "Tecnologia de Ponta",
      title: "Equipamentos e Soluções",
      subtitle: "Utilizamos dispositivos de última geração para fornecer estabilidade lógica e barreiras físicas robustas contra qualquer ameaça patrimonial.",
      items: {
        cameras: {
          title: "Câmeras de Segurança",
          desc: "Equipamentos modernos para monitoramento de ambientes internos e externos, garantindo mais segurança e controle em tempo real."
        },
        alarmCenters: {
          title: "Centrais de Alarme",
          desc: "Soluções inteligentes para proteção patrimonial, com sensores integrados e resposta rápida contra invasões."
        },
        motionSensors: {
          title: "Sensores de Presença",
          desc: "Dispositivos que identificam movimentos em áreas estratégicas, aumentando a eficiência da segurança."
        },
        biometrics: {
          title: "Controle Biométrico",
          desc: "Tecnologia para liberação de acesso por impressão digital, trazendo mais segurança e praticidade."
        },
        electronicLocks: {
          title: "Fechaduras Eletrônicas",
          desc: "Soluções modernas para controle de portas, com abertura por senha, cartão, biometria ou aplicativo."
        },
        turnstiles: {
          title: "Catracas de Acesso",
          desc: "Equipamentos ideais para empresas, condomínios e ambientes que precisam controlar o fluxo de pessoas."
        }
      }
    },
    environments: {
      tag: "Áreas de Atuação",
      title: "Soluções dedicadas para cada ambiente",
      subtitle: "Cada espaço exige uma solução específica. A Cotton Dome LDA desenvolve projetos personalizados, combinando tecnologia de ponta, segurança certificada e eficiência operacional para diferentes tipos de ambientes.",
      items: {
        residencias: { name: "Residências", desc: "Proteção completa para a sua habitação, aliando segurança eletrónica, automatismos inteligentes e comodidade digital no seu dia a dia." },
        condominios: { name: "Condomínios", desc: "Soluções integradas de controlo de acessos, videovigilância e automatismos para parques, portarias e áreas comuns residenciais." },
        empresas: { name: "Empresas", desc: "Sistemas de proteção de dados, segurança física dos escritórios, controlo horário dos colaboradores e segurança no acesso." },
        comercio: { name: "Comércio", desc: "Prevenção ativa de perdas com videovigilância 4K, alarmes anti-intrusão, proteção contra incêndio e portas automáticas de vidro." },
        industrias: { name: "Indústrias", desc: "Projetos técnicos robustos para ambientes exigentes, com barreiras rápidas, deteção avançada de incêndios e controlo biométrico." },
        armazens: { name: "Armazéns", desc: "Organização estrutural de redes de comunicações, UPS para racks, videovigilância perimetral e portões seccionados de alta durabilidade." }
      }
    },
    outlet: {
      tag: "Outlet / Promoção",
      title: "Equipamentos em Destaque com Desconto",
      subtitle: "Aproveite as nossas condições especiais em sistemas de intrusão e alarme. Equipamentos de alta segurança com preços sob consulta e instalação profissional incluída.",
      viewProduct: "Ver Produto",
      requestQuote: "Solicitar Orçamento",
      whatsapp: "Falar no WhatsApp",
      badgePromo: "PROMOÇÃO",
      badgeOutlet: "OUTLET"
    },
    howWeWork: {
      tag: "Metodologia",
      title: "Como Nós Trabalhamos",
      subtitle: "Garantimos um acompanhamento de excelência, desde a análise de risco inicial até à manutenção preventiva periódica.",
      steps: {
        step1Title: "Análise Técnica",
        step1Desc: "Entendemos minuciosamente a necessidade do cliente e avaliamos o espaço físico com precisão técnica.",
        step2Title: "Proposta Personalizada",
        step2Desc: "Indicamos as soluções de alta engenharia mais adequadas e dimensionadas ao seu orçamento.",
        step3Title: "Instalação Profissional",
        step3Desc: "Realizamos a montagem física e calibração lógica com rigor, organization e respeito estético.",
        step4Title: "Suporte e Acompanhamento",
        step4Desc: "Prestamos assistência técnica dedicada para garantir a fiabilidade permanente das suas soluções de segurança."
      }
    },
    projects: {
      tag: "Portfólio",
      title: "Projetos Recentes Realizados",
      subtitle: "Conheça alguns dos projetos técnicos implementados com sucesso pela equipa da Cotton Dome LDA.",
      all: "Todos",
      categories: {
        cctv: "Videovigilância",
        intrusao: "Sistemas de Alarme",
        acessos: "Controlo de Acessos",
        incendio: "Deteção de Incêndio",
        automatismos: "Automatismos",
        redes: "Redes Técnicas"
      },
      items: {
        p1: { title: "CCTV Residencial Inteligente", desc: "Instalação de câmaras IP 4K com análise de vídeo e deteção inteligente de pessoas à volta de moradia premium." },
        p2: { title: "Automatização de Portão Seccionado", desc: "Instalação de portão seccionado térmico com motorização Motorline rápida e comandos em código evolutivo." },
        p3: { title: "Controlo de Acessos Biométrico", desc: "Implementação de controlo de acessos com reconhecimento facial e leitores RFID para escritórios corporativos." },
        p4: { title: "Bastidor de Redes e Infraestrutura", desc: "Instalação e certificação de cabeamento de rede estruturada, rack organizado e UPS de backup para segurança estável." },
        p5: { title: "Deteção Ótica de Incêndio", desc: "Sistema de centrais analógicas e detetores de fumo endereçáveis com isolador incorporado em pavilhão industrial." },
        p6: { title: "Segurança Perimetral e Alarme Integrado", desc: "Sensores de exterior contra falsas leituras combinados com sirenes dissuasoras inteligentes conectadas por app." }
      }
    },
    quoteSection: {
      title: "Segurança não é um produto, é um estado de espírito permanente.",
      subtitle: "Projetamos sistemas focados na tranquilidade absoluta da sua habitação ou no controlo operacional da sua empresa.",
      cta: "Falar com Engenheiro"
    },
    about: {
      tag: "Sobre Nós",
      title: "Quem Somos",
      desc1: "A Cotton Dome LDA é uma empresa especializada em engenharia de segurança eletrónica e infraestrutura tecnológica, focada em fornecer as melhores soluções de proteção e conectividade para moradias, empresas, condomínios e indústrias em Portugal.",
      desc2: "Focamo-nos em sistemas avançados de CCTV, alarmes de intrusão, controlo de acessos biométricos, deteção de incêndio, automatismos robustos e redes informáticas de alta performance.",
      mission: "Nossa Missão",
      vision: "Nossa Visão",
      values: "Nossos Valores",
      valuesList: ["Rigor técnico e precisão", "Integridade profissional", "Inovação tecnológica contínua", "Foco na necessidade do cliente", "Estética e organização em obra"]
    },
    contact: {
      tag: "Contacto",
      title: "Fale Conosco",
      subtitle: "Obtenha uma análise técnica detalhada do seu espaço. A nossa equipa de engenharia de segurança está pronta para desenhar a sua solução.",
      form: {
        name: "Seu Nome Completo",
        phone: "Telefone / Telemóvel",
        email: "E-mail de Contacto",
        service: "Serviço Pretendido",
        servicePlaceholder: "Selecione o serviço...",
        message: "Como podemos ajudar? Descreva brevemente o projeto...",
        sending: "A enviar mensagem...",
        sendSuccess: "Mensagem enviada com sucesso! Entraremos em contacto brevemente.",
        sendError: "Erro ao enviar mensagem. Por favor, tente novamente ou use o WhatsApp.",
        submit: "Enviar Pedido de Orçamento"
      },
      info: {
        phone: "Telefone",
        whatsapp: "WhatsApp Comercial",
        email: "E-mail Geral",
        address: "Sede Comercial",
        workingHours: "Segunda a Sexta-feira: 09:00h às 18:30h",
        satHours: "Sábado (Urgências): 09:00h às 13:00h"
      }
    },
    serviceDetail: {
      backHome: "Voltar para a Home",
      requestBudget: "Solicitar Orçamento",
      aboutService: "Sobre o Serviço",
      generalDesc: "Desenvolvemos projetos robustos e funcionais que atendem rigorosamente aos padrões europeus de segurança técnica. Todos os equipamentos por nós instalados são de marcas consagradas, assegurando maior longevidade operacional, estabilidade lógica e garantias completas de fábrica.",
      mainBenefits: "Principais Benefícios",
      appAreas: "Áreas de Aplicação",
      appAreasDesc: "Onde o serviço técnico da Cotton Dome LDA garante o maior grau de eficiência e proteção técnica:",
      relatedEquipments: "Equipamentos & Soluções Relacionadas",
      relatedEquipmentsDesc: "Utilizamos apenas componentes originais de marcas certificadas na montagem de cada sistema técnico:",
      galleryTitle: "Galeria de Soluções e Equipamentos",
      galleryDesc: "Registo visual de soluções técnicas, equipamentos e instalações de alta segurança executadas pela nossa equipa:",
      processTitle: "O Nosso Processo de Trabalho",
      processDesc: "Como a equipa de engenharia da Cotton Dome LDA atua para garantir a máxima fiabilidade técnica:",
      finalCtaTitle: "Precisa de uma solução profissional para o seu espaço?",
      finalCtaDesc: "A Cotton Dome LDA analisa a sua necessidade e desenvolve uma solução à medida, com tecnologia, segurança e profissionalismo.",
      finalCtaBtn: "Solicitar Orçamento",
      errorTitle: "Serviço não encontrado",
      errorDesc: "A página que procura não existe ou foi movida. Por favor, regresse à página inicial."
    },
    services: {
      "cctv": {
        title: "CCTV / Videovigilância Profissional",
        slogan: "Vigilância inteligente 24/7 com câmeras HD e IA para proteger o que mais importa.",
        shortDesc: "Câmeras IP e analógicas HD com IA, gravação contínua e monitorização remota em tempo real via app.",
        desc: "A Cotton Dome LDA projeta e instala sistemas de videovigilância profissionais com câmeras IP e analógicas de alta definição que incorporam IA para deteção precisa de pessoas e veículos. Monitorize o seu espaço de qualquer ponto do mundo em tempo real, com gravação segura, alertas automáticos por movimento e acesso via smartphone."
      },
      "intrusao": {
        title: "Sistemas de Alarme e Intrusão",
        slogan: "Proteção inteligente contra invasões com alertas instantâneos e resposta imediata no seu telemóvel.",
        shortDesc: "Centrais de alarme conectadas, sensores PIR avançados, sirenes de alto impacto e proteção perimetral 24/7.",
        desc: "Os nossos sistemas de alarme e intrusão criam uma barreira de segurança ativa em torno do seu espaço. Detetores PIR imunes a animais de estimação, sensores magnéticos, barreiras perimetrais e centrais GSM/Wi-Fi garantem alerta imediato no seu telemóvel — com opção de ligação a central de monitorização profissional."
      },
      "acessos": {
        title: "Controlo de Acessos",
        slogan: "Segurança máxima em cada entrada: apenas pessoas autorizadas acedem ao seu espaço.",
        shortDesc: "Biometria, reconhecimento facial, RFID e fechaduras eletrónicas para controlo total de acessos.",
        desc: "A Cotton Dome LDA fornece e instala sistemas avançados de controlo de acessos para empresas, condomínios e indústrias. Controle quem entra, quando e por onde — com reconhecimento facial, biometria, cartões RFID e fechaduras eletrónicas. Todos os acessos ficam registados em tempo real, com histórico completo e integração com CCTV e alarme."
      },
      "incendio": {
        title: "Sistemas de Deteção de Incêndio",
        slogan: "Prevenção, alerta e segurança para proteger pessoas, espaços e património.",
        shortDesc: "Sistemas de deteção e alerta para prevenção, segurança e resposta rápida em situações de incêndio.",
        desc: "Os sistemas de deteção de incêndio são essenciais para ambientes comerciais, industriais, residenciais coletivos e institucionais. A Cotton Dome LDA trabalha com soluções de deteção e alerta que permitem identificar sinais de incêndio e acionar respostas rápidas em situações de risco."
      },
      "automatismos": {
        title: "Automatismos para Portões e Acessos",
        slogan: "Mais conforto, segurança e eficiência no controlo dos seus acessos.",
        shortDesc: "Automação de portões, barreiras e acessos para mais conforto, segurança e eficiência.",
        desc: "A Cotton Dome LDA instala soluções de automatização para portões, barreiras, portas e sistemas de acesso. Os automatismos permitem abertura e fecho automático com segurança, praticidade e controlo, sendo ideais para residências, condomínios, empresas e espaços industriais."
      },
      "portas-portoes": {
        title: "Portas de Segurança e Portões Seccionados",
        slogan: "Soluções resistentes, modernas e seguras para proteger os seus acessos.",
        shortDesc: "Soluções resistentes e modernas para acessos residenciais, comerciais e industriais.",
        desc: "A Cotton Dome LDA trabalha com portas de segurança e portões seccionados para ambientes residenciais, comerciais e industriais. Estas soluções combinam resistência, funcionalidade, estética e proteção, podendo ser integradas a automatismos e sistemas de controlo de acesso."
      },
      "ups": {
        title: "UPS e Sistemas de Energia de Backup",
        slogan: "Proteja os seus equipamentos contra falhas, oscilações e interrupções elétricas.",
        shortDesc: "Energia de backup para manter equipamentos críticos protegidos contra falhas elétricas.",
        desc: "Os sistemas UPS garantem energia de backup para equipamentos críticos, como câmeras, servidores, redes, alarmes e sistemas de segurança. A Cotton Dome LDA oferece soluções que ajudam a manter os sistemas essenciais em funcionamento mesmo em situações de instabilidade elétrica."
      },
      "serralharia": {
        title: "Serralharia em Ferro e Inox",
        slogan: "Soluções metálicas resistentes, funcionais e adaptadas ao seu projeto.",
        shortDesc: "Estruturas metálicas, grades, portões e soluções sob medida em ferro e inox.",
        desc: "A Cotton Dome LDA desenvolve soluções em serralharia para ferro e inox, incluindo portões, grades, estruturas metálicas, proteções e acabamentos personalizados. O serviço é ideal para reforçar a segurança, melhorar acessos e criar estruturas sob medida para diferentes necessidades."
      },
      "telecomunicacoes": {
        title: "Telecomunicações e Intercomunicação",
        slogan: "Infraestrutura técnica para comunicação, conectividade e integração de sistemas.",
        shortDesc: "Infraestrutura técnica para comunicação, integração de sistemas e conectividade profissional.",
        desc: "A Cotton Dome LDA oferece soluções em telecomunicações para apoiar sistemas de segurança, redes, comunicação e infraestrutura técnica. O serviço permite criar ambientes mais conectados, organizados e preparados para operações modernas."
      },
      "redes": {
        title: "Redes e Network Solutions",
        slogan: "Infraestrutura de rede profissional para segurança, comunicação e alta performance.",
        shortDesc: "Cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura de rede.",
        desc: "A Cotton Dome LDA desenvolve soluções de rede para residências, empresas, condomínios, lojas e ambientes industriais. Uma rede bem estruturada é essencial para o funcionamento de sistemas de segurança, videovigilância, controlo de acessos, internet, comunicação e equipamentos conectados."
      }
    },
    productsDict: {
      // CCTV
      "câmeras IP": {
        title: "Câmeras IP Profissionais",
        description: "Câmeras de rede inteligentes que transmitem vídeo digital de altíssima definição sobre infraestrutura Ethernet.",
        benefit: "Imagem cristalina com riqueza de detalhes, permitindo zoom digital sem perda severa de qualidade."
      },
      "câmeras analógicas": {
        title: "Câmeras Analógicas HD",
        description: "Câmeras que utilizam cabeamento coaxial para transmitir imagens em alta definição com baixíssima latência.",
        benefit: "Solução robusta, económica e ideal para modernizar instalações existentes sem troca de cabos."
      },
      "câmeras dome": {
        title: "Câmeras Dome Discretas",
        description: "Câmeras de segurança com formato arredondado, ideal para tetos de escritórios ou residências de forma estética.",
        benefit: "Visual elegante, compacto e discreto, oferecendo excelente cobertura de ângulos amplos."
      },
      "câmeras bullet": {
        title: "Câmeras Bullet Dissuasoras",
        description: "Câmeras em formato cilíndrico alongado, perfeitamente visíveis e projetadas para monitorização externa.",
        benefit: "Forte efeito dissuasor visual contra potenciais intrusos e alta resistência a intempéries."
      },
      "gravadores DVR": {
        title: "Gravadores DVR Digitais",
        description: "Unidades centrais de processamento e gravação contínua de vídeo para câmeras de sinal analógico coaxial.",
        benefit: "Armazenamento local fiável e facilidade de configuração lógica de visualização."
      },
      "gravadores NVR": {
        title: "Gravadores NVR de Rede",
        description: "Servidores dedicados de gravação para câmeras de rede IP, com suporte a análises baseadas em Inteligência Artificial.",
        benefit: "Alta capacidade de processamento, análise inteligente de vídeo e gravação redundante segura."
      },
      "discos de gravação": {
        title: "Discos Rígidos de Segurança",
        description: "Discos rígidos de nível empresarial desenhados especificamente para operação de escrita de vídeo 24 horas por dia.",
        benefit: "Extrema durabilidade mecânica e prevenção de perda de dados críticos de videovigilância."
      },
      "fontes de alimentação": {
        title: "Fontes de Alimentação Estabilizadas",
        description: "Unidades centrais de distribuição de corrente elétrica limpa para todas as câmeras do ecossistema.",
        benefit: "Protege o hardware contra picos e sobrecargas elétricas indesejadas no dia a dia."
      },
      "cablagem": {
        title: "Cabeamento Certificado",
        description: "Condutores de cobre de alto padrão blindados contra interferências eletromagnéticas ambientais.",
        benefit: "Transmissão estável do sinal de vídeo e dados a longas distâncias sem qualquer degradação."
      },
      "acesso remoto por aplicação": {
        title: "Acesso Remoto via App",
        description: "Configuração lógica de DNS ou nuvem que permite visualizar câmeras em tempo real via smartphone ou tablet.",
        benefit: "Acompanhe e controle a segurança do seu património em qualquer lugar do mundo instantaneamente."
      },
      // INTRUSÃO
      "centrais de alarme": {
        title: "Centrais de Alarme Conectadas",
        description: "O cérebro do sistema de segurança que monitoriza sensores e coordena disparos de sirenes e transmissões GSM/Wi-Fi.",
        benefit: "Centralização inteligente de alertas e operação ininterrupta mesmo sob falhas de energia."
      },
      "sensores de movimento": {
        title: "Sensores de Movimento PIR/Pivô",
        description: "Detetores de presença infravermelhos passivos calibrados para identificar variações de calor corporal.",
        benefit: "Elevada precisão na deteção de intrusos e imunidade inteligente contra animais domésticos (PET-immune)."
      },
      "sensores magnéticos": {
        title: "Contactos Magnéticos Digitais",
        description: "Sensores de abertura compostos por íman instalados no batente de portas e janelas do imóvel.",
        benefit: "Identificação instantânea de intrusões ou aberturas antes mesmo do intruso penetrar no espaço."
      },
      "sensores perimetrais": {
        title: "Detetores de Barreira Perimetral",
        description: "Sensores de feixes infravermelhos projetados para criar uma barreira invisível nas extremidades exteriores da propriedade.",
        benefit: "Alerta precoce e dissuasão do intruso nas áreas externas, antes do acesso ao interior do edifício."
      },
      "sirenes": {
        title: "Sirenes de Alto Impacto",
        description: "Dispositivos acústicos e luminosos (flash) de alta potência projetados para atordoar intrusos e alertar a vizinhança.",
        benefit: "Elevado fator psicológico de dissuasão acústica e visual imediata no momento da tentativa de intrusão."
      },
      "teclados de alarme": {
        title: "Teclados de Comando LCD",
        description: "Consolas táteis ou com botões retroiluminados instaladas nos pontos de entrada do edifício para controle do alarme.",
        benefit: "Interface de utilização simples, intuitiva e rápida para armar ou desarmar o sistema."
      },
      "comandos": {
        title: "Comandos Remotos Sem Fios",
        description: "Comandos portáteis de bolso em formato de porta-chaves com encriptação anticópia para gestão rápida do alarme.",
        benefit: "Praticidade absoluta para armar, desarmar ou acionar botão de pânico a curtas distâncias do imóvel."
      },
      "módulos GSM ou Wi-Fi": {
        title: "Módulos de Comunicação Integrados",
        description: "Placas lógicas de rede celular (SIM card) ou Ethernet/Wi-Fi para envio de alertas redundantes.",
        benefit: "Garantia de que os alertas de emergência chegam ao seu smartphone mesmo que a linha de internet fixa caia."
      },
      "detectores internos e externos": {
        title: "Detetores de Intrusão Avançados",
        description: "Conjunto completo de detetores de fendas, quebra de vidros ou vibrações estruturais.",
        benefit: "Cobertura completa contra todos os possíveis métodos físicos de invasão ao imóvel."
      },
      // CONTROLO DE ACESSO
      "leitores de cartão": {
        title: "Leitores de Cartões RFID",
        description: "Leitores de proximidade por radiofrequência para validação rápida de chaves virtuais e cartões eletrónicos.",
        benefit: "Abertura ágil de portas e cancelamento instantâneo de cartões em caso de perda ou furto."
      },
      "tags": {
        title: "Chaves Eletrónicas de Proximidade (Tags)",
        description: "Pequenos dispositivos em formato de porta-chaves com microchip RFID integrado para identificação de utilizadores.",
        benefit: "Praticidade no transporte e alta durabilidade física quando comparados a chaves convencionais."
      },
      "teclados numéricos": {
        title: "Teclados Táteis de Acesso",
        description: "Teclados numéricos retroiluminados com código de segurança programável para abertura de trancas.",
        benefit: "Acesso seguro sem necessidade de transportar chaves físicas ou cartões, bastando digitar um código pessoal."
      },
      "biometria": {
        title: "Leitores Biométricos de Precisão",
        description: "Dispositivos biométricos que fazem a leitura ótica ou capacitiva de impressões digitais de utilizadores autorizados.",
        benefit: "Segurança de topo contra falsificação de identidade, garantindo que apenas a própria pessoa possa aceder."
      },
      "reconhecimento facial": {
        title: "Terminais de Reconhecimento Facial",
        description: "Leitores avançados que utilizam câmeras térmicas e luz infravermelha para autenticação biométrica em frações de segundo.",
        benefit: "Acesso totalmente sem contacto físico, extremamente higiénico e imune a fotografias de identificação."
      },
      "fechaduras elétricas": {
        title: "Trincos e Fechaduras Eletromagnéticas",
        description: "Dispositivos mecânicos de trancamento controlados eletricamente, integrados com leitores e saídas de emergência.",
        benefit: "Bloqueio físico robusto com capacidade de abertura automática em situações de corte de energia ou fogo."
      },
      "botões de acesso": {
        title: "Botões de Saída Sensíveis",
        description: "Botões de pressão instalados na parede interior ao lado das portas para libertar o trinco ao sair do espaço.",
        benefit: "Ergonomia de utilização e desbloqueio físico imediato para quem está a sair do edifício."
      },
      "controladores de acesso": {
        title: "Controladores Lógicos de Porta",
        description: "Placas eletrónicas de processamento local que armazenam permissões, horários e ligam leitores aos trincos.",
        benefit: "Funcionamento contínuo em rede ou offline, garantindo que as portas operem mesmo sem comunicação no servidor."
      },
      "torniquetes": {
        title: "Torniquetes e Catracas Físicas",
        description: "Estruturas rotativas metálicas destinadas a forçar a passagem individual e controlada de pessoas.",
        benefit: "Eliminação total de entradas duplicadas por boleia de credenciais válidas e controlo absoluto de fluxo."
      },
      "software de gestão de utilizadores": {
        title: "Software de Gestão de Acessos",
        description: "Plataforma digital para controlo centralizado de permissões, horários, feriados e geração de relatórios de assiduidade.",
        benefit: "Controlo operacional transparente, auditoria em tempo real de entradas e saídas de funcionários e visitantes."
      },
      // DETEÇÃO DE INCÊNDIO
      "centrais de incêndio": {
        title: "Centrais de Deteção de Incêndio",
        description: "Equipamentos centrais que monitorizam a integridade da rede de detetores e botões manuais.",
        benefit: "Cumprimento legal rigoroso e acionamento centralizado de sirenes de evacuação de segurança."
      },
      "detetores de fumo": {
        title: "Detetores Óticos de Fumo",
        description: "Sensores equipados com câmara de análise ótica para identificar a presença física de fumo no ambiente.",
        benefit: "Identificação precoce de chamas lentas ou fumo em suspensão, permitindo ação rápida de evacuação."
      },
      "detetores térmicos": {
        title: "Detetores Térmicos de Temperatura",
        description: "Detetores eletrónicos calibrados para acionar o alarme quando a temperatura ambiente atinge um limite crítico.",
        benefit: "Ideal para cozinhas ou oficinas onde a presença normal de vapores impossibilita o uso de detetores óticos."
      },
      "botões manuais de alarme": {
        title: "Botões de Alarme Manual",
        description: "Caixas vermelhas com vidro frangível destinadas ao acionamento imediato e manual do alarme de fogo.",
        benefit: "Permite a qualquer pessoa presente no espaço sinalizar um foco de incêndio antes mesmo da atuação dos sensores."
      },
      "sinalizadores": {
        title: "Sinalizadores Óticos Intermitentes",
        description: "Dispositivos luminosos com luz estroboscópica de alto brilho destinados a alertar visualmente sobre a emergência.",
        benefit: "Garante o alerta eficaz em ambientes muito ruidosos ou a pessoas com deficiência auditiva."
      },
      "módulos de controlo": {
        title: "Módulos de Interface Inteligentes",
        description: "Módulos eletrónicos para corte de gás, paragem de ventiladores ou abertura automática de clarabóias.",
        benefit: "Integração dinâmica dos sistemas do edifício para evitar a propagação do fogo e do fumo tóxico."
      },
      "sistemas de evacuação": {
        title: "Sistemas de Evacuação de Emergência",
        description: "Dispositivos integrated como barreiras antipânico, portas de emergência e iluminação de saída autónoma.",
        benefit: "Garante uma rota de fuga rápida, desimpedida e em total segurança para todos os ocupantes do espaço."
      },
      "cablagem técnica": {
        title: "Cablagem Resistente ao Fogo",
        description: "Condutores com blindagem de silicone certificados para resistir a temperaturas elevadas por longos períodos.",
        benefit: "Assegura o funcionamento contínuo dos sistemas de deteção e alarme mesmo no calor extremo de um incêndio ativo."
      },
      // AUTOMATISMOS
      "motores para portões de correr": {
        title: "Motores para Portões de Correr",
        description: "Sistemas eletromecânicos de tração linear com engrenagens de alta resistência para abertura de portões deslizantes.",
        benefit: "Abertura suave, rápida e segura de portões residenciais ou industriais pesados com mínimo desgaste mecânico."
      },
      "motores para portões de batente": {
        title: "Motores para Portões de Batente",
        description: "Braços mecânicos articulados ou pistões hidráulicos projetados para abrir portões de folhas giratórias.",
        benefit: "Perfeito alinhamento estético e excelente força de retenção contra rajadas fortes de vento no exterior."
      },
      "barreiras automáticas": {
        title: "Barreiras de Estacionamento Rápidas",
        description: "Hastes automatizadas com motores de serviço contínuo para controlo ágil de acessos a parques e condomínios.",
        benefit: "Fluxo rápido de viaturas, alta velocidade de abertura e grande durabilidade contra ciclos intensos de tráfego."
      },
      "fotocélulas": {
        title: "Sensores de Segurança (Fotocélulas)",
        description: "Feixes de infravermelho instalados nas laterais do portão para detetar viaturas ou peões na zona de fecho.",
        benefit: "Evita acidentes graves impedindo o fecho acidental do portão se houver algum obstáculo na passagem."
      },
      "centrais de comando": {
        title: "Centrais Eletrónicas de Automatismo",
        description: "Quadros de controlo que regulam a velocidade dos motores, força de tração e integram rádio de comandos.",
        benefit: "Calibração precisa da aceleração, desaceleração suave e proteção antiesmagamento integrada."
      },
      "sensores de segurança": {
        title: "Sensores Magnéticos de Limite",
        description: "Sensores eletrónicos que informam a central sobre a posição exata de portão aberto ou fechado.",
        benefit: "Paragem milimétrica do motor no final de curso, poupando a estrutura física do portão de choques mecânicos."
      },
      "acessórios de automação": {
        title: "Acessórios de Segurança e Alerta",
        description: "Pirilampos de aviso de portão em movimento, antenas de rádio amplificadas e recetores externos.",
        benefit: "Garante que o funcionamento do automatismo seja visível e detetado a distância por transeuntes e veículos."
      },
      "sistemas de abertura remota": {
        title: "Módulos de Abertura Inteligente",
        description: "Dispositivos IP ou GSM que permitem abrir portões através de chamadas telefónicas sem custo ou aplicações móveis.",
        benefit: "Abra o seu portão remotamente para familiares ou encomendas mesmo não estando fisicamente no local."
      },
      // PORTAS DE SEGURANÇA
      "portas de segurança": {
        title: "Portas Blindadas de Alta Segurança",
        description: "Portas com estrutura interna de aço galvanizado, dobradiças reforçadas e isolamento acústico/térmico.",
        benefit: "Elevada resistência mecânica contra arrombamento, aliada a um acabamento estético sofisticado."
      },
      "portões seccionados": {
        title: "Portões Seccionados Térmicos",
        description: "Portões de garagem compostos por painéis duplos articulados com poliuretano injetado no interior.",
        benefit: "Poupança total de espaço interior na garagem e excelente isolamento térmico e acústico da habitação."
      },
      "portões industriais": {
        title: "Portões Seccionados Industriais",
        description: "Portões de grandes dimensões reforçados contra ventos fortes e uso intensivo diário em fábricas e armazéns.",
        benefit: "Segurança de topo e facilidade de carga e descarga operacional em docas de logística."
      },
      "portas automáticas": {
        title: "Portas de Vidro Automáticas",
        description: "Portas de correr com vidros temperados controladas por radares de aproximação, ideais para zonas de alto tráfego.",
        benefit: "Conforto absoluto de entrada para clientes e excelente conservação da climatização interior da loja."
      },
      "fechaduras reforçadas": {
        title: "Fechaduras Multiponto Premium",
        description: "Fechaduras equipadas com múltiplos pontos de trancamento mecânico acionados por cilindros de alta segurança.",
        benefit: "Resistência massiva a tentativas de intrusão forçada por arrombamento com alavancas ou berbequins."
      },
      "acessórios de segurança": {
        title: "Ferragens e Escudos de Proteção",
        description: "Protetores de cilindro em aço temperado (defenders) que impedem a extração física do miolo da fechadura.",
        benefit: "Neutralização de ataques com ferramentas de quebra e chaves falsas (bumping e picking)."
      },
      "estruturas de acesso": {
        title: "Aros e Pré-Aros de Alta Resistência",
        description: "Aros metálicos reforçados chumbados diretamente na parede de betão para fixação firme das portas.",
        benefit: "Estabilidade estrutural perfeita ao longo dos anos, impedindo empenos e fragilidades na ancoragem."
      },
      // UPS
      "UPS": {
        title: "Sistemas UPS de Alta Performance",
        description: "Equipamentos de alimentação ininterrupta profissionais com regulação automática de tensão de saída.",
        benefit: "Mantém os sistemas de segurança online sem interrupções mesmo perante apagões elétricos totais."
      },
      "nobreaks": {
        title: "Nobreaks Senoidais Puros",
        description: "UPS com saída de onda senoidal pura de alta precisão, essencial para proteger servidores de dados sensíveis.",
        benefit: "Corrente elétrica limpa e estável, estendendo a vida útil de eletrónicos de topo."
      },
      "baterias": {
        title: "Baterias AGM de Descarga Lenta",
        description: "Acumuladores elétricos blindados e estanques com tecnologia de descarga lenta para alta fiabilidade.",
        benefit: "Elevada durabilidade operacional e maior autonomia elétrica em situações críticas de emergência."
      },
      "sistemas de alimentação ininterrupta": {
        title: "Sistemas de Energia Crítica",
        description: "Unidades completas de gestão de energia redundante integradas em armários de controlo.",
        benefit: "Evita que falhas em disjuntores ou cortes elétricos desliguem câmeras ou sistemas de vigilância essenciais."
      },
      "proteção elétrica": {
        title: "Descarregadores de Sobretensão",
        description: "Dispositivos de proteção contra picos de tensão provocados por trovoadas ou descargas na rede pública.",
        benefit: "Evita a queima de equipamentos eletrónicos caros encaminhando a sobrecarga elétrica para a terra."
      },
      "estabilizadores": {
        title: "Estabilizadores de Tensão Automáticos",
        description: "Equipamentos que corrigem de forma dinâmica pequenas variações e flutuações de tensão elétrica.",
        benefit: "Entrega constante da voltagem correta, mantendo o bom funcionamento operacional das redes informáticas."
      },
      "soluções para racks": {
        title: "UPS e Réguas de Tomadas de Bastidor",
        description: "UPS de bastidor desenhados especificamente no padrão 19 polegadas para integração limpa em racks de rede.",
        benefit: "Organização técnica exemplar, facilidade de arrumação e melhor arrefecimento."
      },
      "energia de suporte para CCTV e redes": {
        title: "Energia Redundante Dedicada",
        description: "Fontes chaveadas com suporte para baterias integradas para alimentar câmeras IP e switches PoE.",
        benefit: "Garante o registo de imagens mesmo que um intruso corte o disjuntor principal do imóvel exteriormente."
      },
      // SERRALHARIA
      "portões metálicos": {
        title: "Portões Metálicos à Medida",
        description: "Portões fabricados em ferro ou inox sob desenho técnico personalizado para vedações exteriores.",
        benefit: "Barreira física extremamente robusta e esteticamente adaptada ao design arquitetónico do projeto."
      },
      "grades de proteção": {
        title: "Grades de Segurança em Ferro",
        description: "Grelhas e grades fixas ou de lagarta fabricadas em ferro galvanizado para proteção de janelas e montras.",
        benefit: "Dificulta o acesso físico e arrombamento de portas de vidro comerciais ou janelas residenciais vulneráveis."
      },
      "estruturas em ferro": {
        title: "Estruturas de Ferro Galvanizado",
        description: "Estruturas de suporte, aros e suportes técnicos soldados e tratados com revestimento antiferrugem.",
        benefit: "Suporte mecânico robusto com excelente resistência estrutural e longa durabilidade sob intempéries."
      },
      "estruturas em inox": {
        title: "Estruturas de Aço Inox Premium",
        description: "Guardas, suportes e acabamentos nobres em aço inoxidável escovado ou polido (AISI 304 ou 316).",
        benefit: "Design sofisticado e imune à corrosão salina, ideal para zonas litorais e acabamentos de alto padrão."
      },
      "corrimãos": {
        title: "Corrimãos e Guardas Metálicas",
        description: "Estruturas metálicas de segurança fabricadas sob medida para escadarias e vedações de varandas.",
        benefit: "Segurança de circulação de pessoas e conformidade com as normas regulamentares de engenharia civil."
      },
      "proteções metálicas": {
        title: "Placas e Proteções de Reforço",
        description: "Revestimentos de chapas metálicas e proteções mecânicas contra vandalismo e desgaste abrasivo.",
        benefit: "Aumento considerável da durabilidade física dos pontos críticos de acesso."
      },
      "acabamentos técnicos": {
        title: "Tratamento de Superfície e Pintura",
        description: "Serviço de decapagem, metalização e pintura eletrostática de peças de ferro e inox.",
        benefit: "Acabamento visual premium de alto nível e durabilidade contra oxidação por décadas."
      },
      "soluções personalizadas": {
        title: "Serralharia de Desenho Técnico",
        description: "Projetos especiais de serralharia desenhados e fabricados para fins específicos do cliente.",
        benefit: "Perfeito encaixe operacional e visual na estrutura física do seu imóvel."
      },
      // TELECOMUNICAÇÕES
      "pontos de comunicação": {
        title: "Tomadas e Pontos de Telecomunicações",
        description: "Tomadas de sinal coaxial e RJ45 instaladas nos locais previstos de moradias ou escritórios.",
        benefit: "Praticidade e organização no acesso a serviços de TV, voz e dados locais."
      },
      "infraestrutura de telecomunicações": {
        title: "Cablagem e Passagens Técnicas (ITED)",
        description: "Caixas de distribuição e tubagens estruturadas segundo as regulamentações técnicas ITED/ITUR.",
        benefit: "Facilidade de manutenção técnica e total abertura para instalação de novos operadores de telecomunicações."
      },
      "antenas": {
        title: "Sistemas de Antena e Receção",
        description: "Antenas terrestres digitais (TDT) e parabólicas satélite com amplificadores de sinal profissional.",
        benefit: "Sinal de TV límpido sem interferências ou ruídos nas tomadas do edifício."
      },
      "equipamentos de comunicação": {
        title: "Centrais e Videoporteiros IP",
        description: "Unidades centrais de sinalização para videoporteiros analógicos, mistos ou IP de alta definição.",
        benefit: "Permite comunicação direta com portaria ou via aplicação móvel de forma estável."
      },
      "interligação de sistemas": {
        title: "Integração Técnica Multissistemas",
        description: "Configuração de cablagem e conversores de sinal para ligar intercomunicadores a sistemas de CCTV.",
        benefit: "Visualização rápida de quem chama no ecrã das câmeras ou monitores da habitação."
      },
      "organização técnica": {
        title: "Armários de Telecomunicações (ATI)",
        description: "Quadros de distribuição de telecomunicações residenciais organizados de forma limpa e identificada.",
        benefit: "Identificação rápida de avarias e estética perfeita nos bastidores do edifício."
      },
      "suporte para sistemas integrados": {
        title: "Infraestrutura de Telecomunicações Integrada",
        description: "Instalação de derivadores, misturadores de sinal e repetidores de sinal RF.",
        benefit: "Sinal forte em todas as extremidades e tomadas da propriedade."
      },
      // REDES
      "cabeamento estruturado": {
        title: "Cabeamento Estruturado CAT6/Fibra",
        description: "Instalação de cabos de par entrançado Categoria 6 ou Fibra Óptica blindada para transmissão de dados de alta velocidade.",
        benefit: "Estabilidade total sem perdas de largura de banda e imunidade a interferências elétricas."
      },
      "racks": {
        title: "Bastidores e Racks de Redes",
        description: "Armários metálicos ventilados de 19 polegadas destinados a acomodar e organizar switches, patch panels e servidores.",
        benefit: "Centralização, excelente arrefecimento dos ativos de rede e facilidade de intervenção técnica."
      },
      "switches": {
        title: "Switches PoE Geríveis",
        description: "Equipamentos de rede que distribuem dados e energia elétrica (Power over Ethernet) diretamente nos cabos de rede.",
        benefit: "Elimina a necessidade de fontes individuais de alimentação de tomadas elétricas junto às câmeras IP."
      },
      "routers": {
        title: "Routers de Alta Performance",
        description: "Equipamentos de fronteira de rede destinados a gerir a ligação à internet e o tráfego interno da rede.",
        benefit: "Controlo avançado de acessos à rede com firewalls ativas e separação de sub-redes dedicadas."
      },
      "patch panels": {
        title: "Painéis de Crimpagem (Patch Panels)",
        description: "Painéis de terminação mecânica RJ45 para cabeamento de dados organizados na parte traseira do rack.",
        benefit: "Evita danos diretos na cablagem interna do edifício aquando de mudanças nos cabos de ligação no bastidor."
      },
      "pontos de rede": {
        title: "Tomadas RJ45 Certificadas",
        description: "Tomadas de parede blindadas de alto padrão técnico para conexão rápida de computadores e câmeras.",
        benefit: "Ligação mecânica perfeita, livre de interferências de rede e perdas de pacotes de sinal."
      },
      "Wi-Fi profissional": {
        title: "Pontos de Acesso Wi-Fi Mesh",
        description: "Antenas de teto profissionais integradas em rede Mesh de roaming rápido para sinal estável em toda a área.",
        benefit: "Sinal Wi-Fi constante e uniforme sem quebras ao mover-se de uma divisão para a outra no edifício."
      },
      "organização de cabos": {
        title: "Guias e Calhas Organizadoras de Cabos",
        description: "Acessórios e guias horizontais/verticais de rack destinados a ocultar e ordenar os cabos de manobra.",
        benefit: "Layout visual impecável de bastidor, de fácil leitura e simples manutenção preventiva."
      },
      "infraestrutura para CCTV e sistemas técnicos": {
        title: "Rede Física de Segurança Dedicada",
        description: "Configuração lógica de VLANs dedicadas exclusivamente ao tráfego de câmeras e gravadores de segurança.",
        benefit: "Impede o congestionamento da rede de dados normal e traz maior segurança cibernética contra hackers."
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      solutions: "Solutions",
      equipments: "Equipment",
      projects: "Projects",
      contact: "Contact",
      backToHome: "Back to Home",
      requestQuote: "Request a Quote"
    },
    hero: {
      badge: "Cotton Dome Security Solutions",
      title: "Smart Security for Residences, Companies and Condominiums",
      subtitle: "Cotton Dome LDA develops complete solutions in video surveillance, access control, intrusion alarms, automation, networks, telecommunications and professional protection systems.",
      ctaPrimary: "Request a Quote",
      ctaSecondary: "Explore Solutions"
    },
    pillars: {
      tag: "Why Choose Us",
      title: "Standard of Excellence and Trust",
      subtitle: "We are committed to delivering technically impeccable projects, providing service that exceeds the highest industry standards.",
      p1Title: "Technical Engineering",
      p1Desc: "Installations calculated to the millimeter, with hidden, structured technical cabling and high-precision logical calibration.",
      p2Title: "Elite Equipment",
      p2Desc: "We work exclusively with hardware from renowned brands, approved and certified with warranties.",
      p3Title: "Permanent Support",
      p3Desc: "Responsive and agile customer support to ensure your security never suffers operational interruptions."
    },
    solutions: {
      tag: "Specialized Services",
      title: "Smart solutions for your security",
      subtitle: "Cotton Dome LDA offers complete solutions in security, automation and technical infrastructure, tailored to the needs of each client.",
      learnMore: "Learn more"
    },
    equipments: {
      tag: "Cutting Edge Technology",
      title: "Equipment and Solutions",
      subtitle: "We use state-of-the-art devices to provide logical stability and robust physical barriers against any security threats.",
      items: {
        cameras: {
          title: "Security Cameras",
          desc: "Modern equipment for monitoring indoor and outdoor environments, ensuring more security and real-time control."
        },
        alarmCenters: {
          title: "Alarm Centers",
          desc: "Intelligent solutions for property protection, with integrated sensors and rapid response against intrusions."
        },
        motionSensors: {
          title: "Motion Sensors",
          desc: "Devices that identify movements in strategic areas, increasing security efficiency."
        },
        biometrics: {
          title: "Biometric Control",
          desc: "Technology for access release by fingerprint, bringing more security and convenience."
        },
        electronicLocks: {
          title: "Electronic Locks",
          desc: "Modern solutions for door control, opening with a password, card, biometrics or application."
        },
        turnstiles: {
          title: "Access Turnstiles",
          desc: "Ideal equipment for companies, condominiums and environments that need to control the flow of people."
        }
      }
    },
    environments: {
      tag: "Areas of Operation",
      title: "Dedicated solutions for each environment",
      subtitle: "Each space requires a specific solution. Cotton Dome LDA develops customized projects, combining cutting-edge technology, certified security and operational efficiency for different types of environments.",
      items: {
        residencias: { name: "Residences", desc: "Complete protection for your home, combining electronic security, intelligent automation and digital convenience in your day-to-day life." },
        condominios: { name: "Condominiums", desc: "Integrated access control, video surveillance and automation solutions for parks, gates and residential common areas." },
        empresas: { name: "Companies", desc: "Data protection systems, physical security of offices, employee time control and access security." },
        comercio: { name: "Retail", desc: "Active loss prevention with 4K video surveillance, anti-intrusion alarms, fire protection and automatic glass doors." },
        industrias: { name: "Industries", desc: "Robust technical projects for demanding environments, with fast barriers, advanced fire detection and biometric control." },
        armazens: { name: "Warehouses", desc: "Structural organization of communications networks, UPS for racks, peripheral video surveillance and high-durability sectional doors." }
      }
    },
    outlet: {
      tag: "Outlet / Special Offers",
      title: "Featured Equipment with Discounts",
      subtitle: "Take advantage of our special conditions on intrusion and alarm systems. High-security equipment with prices on request and professional installation included.",
      viewProduct: "View Product",
      requestQuote: "Request Quote",
      whatsapp: "Chat on WhatsApp",
      badgePromo: "PROMO",
      badgeOutlet: "OUTLET"
    },
    howWeWork: {
      tag: "Methodology",
      title: "How We Work",
      subtitle: "We guarantee excellent monitoring, from initial risk analysis to periodic preventive maintenance.",
      steps: {
        step1Title: "Technical Analysis",
        step1Desc: "We thoroughly understand the client's needs and evaluate the physical space with technical precision.",
        step2Title: "Custom Proposal",
        step2Desc: "We suggest the most suitable high-engineering solutions sized for your budget.",
        step3Title: "Professional Installation",
        step3Desc: "We perform physical assembly and logical calibration with technical rigor, organization and aesthetic respect.",
        step4Title: "Support and Monitoring",
        step4Desc: "We provide dedicated technical assistance to ensure the permanent reliability of your security solutions."
      }
    },
    projects: {
      tag: "Portfolio",
      title: "Recent Projects",
      subtitle: "Discover some of the technical projects successfully implemented by the Cotton Dome LDA team.",
      all: "All",
      categories: {
        cctv: "Video Surveillance",
        intrusao: "Alarm Systems",
        acessos: "Access Control",
        incendio: "Fire Detection",
        automatismos: "Automation",
        redes: "Technical Networks"
      },
      items: {
        p1: { title: "Smart Residential CCTV", desc: "Installation of 4K IP cameras with video analysis and intelligent detection of people around premium villa." },
        p2: { title: "Sectional Garage Door Automation", desc: "Installation of thermal sectional door with fast Motorline automation and rolling code remote controls." },
        p3: { title: "Biometric Access Control", desc: "Implementation of access control with facial recognition and RFID readers for corporate offices." },
        p4: { title: "Network Rack & Infrastructure", desc: "Installation and certification of structured network cabling, organized rack and backup UPS for stable security." },
        p5: { title: "Optical Fire Detection", desc: "System of addressable fire panels and optical smoke detectors with integrated isolator in industrial warehouse." },
        p6: { title: "Perimeter Security & Integrated Alarm", desc: "Outdoor sensors resistant to false alerts combined with smart deterrent sirens connected by app." }
      }
    },
    quoteSection: {
      title: "Security is not a product, it is a permanent state of mind.",
      subtitle: "We design systems focused on the absolute peace of mind of your home or the operational control of your business.",
      cta: "Speak with an Engineer"
    },
    about: {
      tag: "About Us",
      title: "Who We Are",
      desc1: "Cotton Dome LDA is a company specialized in electronic security engineering and technological infrastructure, focused on providing the best protection and connectivity solutions for residences, companies, condominiums and industries in Portugal.",
      desc2: "We focus on advanced CCTV systems, intrusion alarms, biometric access control, fire detection, robust automation and high-performance IT networks.",
      mission: "Our Mission",
      vision: "Our Vision",
      values: "Our Values",
      valuesList: ["Technical rigor and precision", "Professional integrity", "Continuous technological innovation", "Focus on client needs", "Aesthetics and organization at work"]
    },
    contact: {
      tag: "Contact",
      title: "Get in Touch",
      subtitle: "Get a detailed technical analysis of your space. Our security engineering team is ready to design your solution.",
      form: {
        name: "Your Full Name",
        phone: "Phone Number",
        email: "Contact E-mail",
        service: "Desired Service",
        servicePlaceholder: "Select the service...",
        message: "How can we help? Briefly describe the project...",
        sending: "Sending message...",
        sendSuccess: "Message sent successfully! We will get in touch shortly.",
        sendError: "Error sending message. Please try again or use WhatsApp.",
        submit: "Send Quote Request"
      },
      info: {
        phone: "Phone",
        whatsapp: "Commercial WhatsApp",
        email: "General Email",
        address: "Commercial Office",
        workingHours: "Monday to Friday: 09:00 AM to 06:30 PM",
        satHours: "Saturday (Emergencies): 09:00 AM to 01:00 PM"
      }
    },
    serviceDetail: {
      backHome: "Back to Home",
      requestBudget: "Request Quote",
      aboutService: "About the Service",
      generalDesc: "We develop robust and functional projects that strictly comply with European technical security standards. All equipment installed by us is from renowned brands, ensuring greater operational longevity, logical stability and full factory warranties.",
      mainBenefits: "Key Benefits",
      appAreas: "Areas of Application",
      appAreasDesc: "Where Cotton Dome LDA technical services ensure the highest efficiency and technical protection:",
      relatedEquipments: "Related Equipment & Solutions",
      relatedEquipmentsDesc: "We use only original certified components in the installation of each technical system:",
      galleryTitle: "Equipment and Solutions Gallery",
      galleryDesc: "Visual record of technical solutions, equipment and high-security installations executed by our team:",
      processTitle: "Our Work Process",
      processDesc: "How the Cotton Dome LDA engineering team acts to guarantee maximum technical reliability:",
      finalCtaTitle: "Need a professional solution for your space?",
      finalCtaDesc: "Cotton Dome LDA analyzes your needs and develops a tailor-made solution, with technology, security and professionalism.",
      finalCtaBtn: "Request a Quote",
      errorTitle: "Service not found",
      errorDesc: "The page you are looking for does not exist or has been moved. Please return to the homepage."
    },
    services: {
      "cctv": {
        title: "CCTV / Professional Video Surveillance",
        slogan: "Smart monitoring and total real-time control for maximum security of your assets.",
        shortDesc: "High-definition camera systems with artificial intelligence for local and remote monitoring and recording.",
        desc: "We design and install professional video surveillance (CCTV) systems with high-definition cameras (IP and Analog) that incorporate artificial intelligence for precise human and vehicle detection. Monitor your space from anywhere in the world through mobile devices, with secure continuous recording and custom solutions for homes, condominiums and corporate sectors."
      },
      "intrusao": {
        title: "Intrusion / Alarm Systems",
        slogan: "Intelligent intrusion detection systems with fast response and immediate alerts on your mobile phone.",
        shortDesc: "Perimeter and internal protection with advanced motion sensors, high-power sirens and connected control panels.",
        desc: "Our intrusion systems offer an active and intelligent security barrier. With advanced wired or wireless alarm control panels, motion detectors immune to pets, magnetic sensors and outdoor perimeter protection, we guarantee early detection of break-ins with direct notification in the mobile application or link to alarm receiving centers."
      },
      "acessos": {
        title: "Access Control",
        slogan: "Smart management of people flow and permissions with facial recognition, biometrics and RFID tags.",
        shortDesc: "Intelligent readers, electronic locks and turnstiles to ensure only authorized individuals access your space.",
        desc: "We provide and install advanced access control systems for residential and corporate environments. Permit controlled entry of employees, visitors or residents with fingerprint readers, facial recognition in fractions of a second, tags, proximity cards or numeric codes, maintaining a real-time historical log and integration with alarms and CCTV."
      },
      "incendio": {
        title: "Fire Detection Systems",
        slogan: "Prevention, alert and security to protect people, spaces and assets.",
        shortDesc: "Detection and alert systems for prevention, safety and quick response in fire situations.",
        desc: "Fire detection systems are essential for commercial, industrial, collective residential and institutional environments. Cotton Dome LDA works with detection and alert solutions that allow identifying fire signals and trigger quick responses in risk situations."
      },
      "automatismos": {
        title: "Gate & Access Automations",
        slogan: "More comfort, security and efficiency in controlling your access points.",
        shortDesc: "Automation of gates, barriers and accesses for more comfort, security and efficiency.",
        desc: "Cotton Dome LDA installs automation solutions for gates, barriers, doors and access systems. Automations allow automatic opening and closing with safety, convenience and control, being ideal for residences, condominiums, companies and industrial spaces."
      },
      "portas-portoes": {
        title: "Security Doors & Sectional Gates",
        slogan: "Resistant, modern and safe solutions to protect your accesses.",
        shortDesc: "Resistant and modern solutions for residential, commercial and industrial accesses.",
        desc: "Cotton Dome LDA works with security doors and sectional gates for residential, commercial and industrial environments. These solutions combine resistance, functionality, aesthetics and protection, and can be integrated with automations and access control systems."
      },
      "ups": {
        title: "UPS & Backup Power Systems",
        slogan: "Protect your equipment against power failures, fluctuations and interruptions.",
        shortDesc: "Backup power to keep critical equipment protected against electrical failures.",
        desc: "UPS systems guarantee backup power for critical equipment, such as cameras, servers, networks, alarms and security systems. Cotton Dome LDA offers solutions that help keep essential systems running even in situations of electrical instability."
      },
      "serralharia": {
        title: "Iron & Stainless Steel Metalwork",
        slogan: "Resistant, functional metal solutions adapted to your project.",
        shortDesc: "Metal structures, grilles, gates and customized solutions in iron and stainless steel.",
        desc: "Cotton Dome LDA develops metalwork solutions in iron and stainless steel, including gates, grilles, metal structures, guards and custom finishes. The service is ideal for reinforcing security, improving access and creating custom structures for different needs."
      },
      "telecomunicacoes": {
        title: "Telecommunications & Intercoms",
        slogan: "Technical infrastructure for communication, connectivity and system integration.",
        shortDesc: "Technical infrastructure for communication, system integration and professional connectivity.",
        desc: "Cotton Dome LDA offers telecommunications solutions to support security systems, networks, communication and technical infrastructure. The service allows creating more connected, organized and prepared environments for modern operations."
      },
      "redes": {
        title: "Networks & Network Solutions",
        slogan: "Professional network infrastructure for security, communication and high performance.",
        shortDesc: "Structured cabling, racks, switches, professional Wi-Fi and network infrastructure.",
        desc: "Cotton Dome LDA develops network solutions for residences, companies, condominiums, shops and industrial environments. A well-structured network is essential for the operation of security systems, video surveillance, access control, internet, communication and connected devices."
      }
    },
    productsDict: {
      // CCTV
      "câmeras IP": {
        title: "Professional IP Cameras",
        description: "Smart network cameras that transmit ultra-high-definition digital video over Ethernet infrastructure.",
        benefit: "Crystal clear image with rich detail, allowing digital zoom without severe loss of quality."
      },
      "câmeras analógicas": {
        title: "HD Analog Cameras",
        description: "Cameras that use coaxial cabling to transmit high-definition images with very low latency.",
        benefit: "Robust, economical solution, ideal for modernizing existing installations without changing cables."
      },
      "câmeras dome": {
        title: "Discreet Dome Cameras",
        description: "Round security cameras, ideal for ceilings in offices or residences for aesthetic discretion.",
        benefit: "Elegant, compact and discreet look, offering excellent wide-angle coverage."
      },
      "câmeras bullet": {
        title: "Deterrent Bullet Cameras",
        description: "Long cylinder-shaped cameras, perfectly visible and designed for outdoor monitoring.",
        benefit: "Strong visual deterrent effect against potential intruders and high weather resistance."
      },
      "gravadores DVR": {
        title: "Digital DVR Recorders",
        description: "Central processing and continuous video recording units for analog coaxial signal cameras.",
        benefit: "Reliable local storage and easy logical configuration for remote viewing."
      },
      "gravadores NVR": {
        title: "Network NVR Recorders",
        description: "Dedicated recording servers for IP network cameras, with support for Artificial Intelligence video analysis.",
        benefit: "High processing capacity, smart video analytics and secure redundant recording."
      },
      "discos de gravação": {
        title: "Surveillance Hard Drives",
        description: "Enterprise-grade hard drives designed specifically for 24/7 video write operations.",
        benefit: "Extreme mechanical durability and prevention of critical surveillance data loss."
      },
      "fontes de alimentação": {
        title: "Stabilized Power Supplies",
        description: "Central clean electrical power distribution units for all cameras in the ecosystem.",
        benefit: "Protects hardware from unwanted power spikes and overloads in daily operation."
      },
      "cablagem": {
        title: "Certified Cabling",
        description: "High-standard copper conductors shielded against environmental electromagnetic interference.",
        benefit: "Stable transmission of video signal and data over long distances without degradation."
      },
      "acesso remoto por aplicação": {
        title: "Remote App Access",
        description: "Logical DNS or cloud configuration that allows real-time camera viewing via smartphone or tablet.",
        benefit: "Instantly monitor and control the security of your property anywhere in the world."
      },
      // ALARM SYSTEMS
      "centrais de alarme": {
        title: "Connected Alarm Control Panels",
        description: "The brain of the security system that monitors sensors and coordinates siren trigger and GSM/Wi-Fi communication.",
        benefit: "Intelligent centralization of alerts and uninterruptible operation even during power failures."
      },
      "sensores de movimento": {
        title: "PIR Motion Sensors",
        description: "Passive infrared presence detectors calibrated to identify body heat variations.",
        benefit: "High accuracy in detecting intruders and smart immunity against domestic pets (PET-immune)."
      },
      "sensores magnéticos": {
        title: "Digital Magnetic Contacts",
        description: "Open/close sensors composed of magnet installed on the frame of doors and windows.",
        benefit: "Instant detection of openings before the intruder even steps inside the premises."
      },
      "sensores perimetrais": {
        title: "Perimeter Barrier Detectors",
        description: "Infrared beam sensors designed to create an invisible barrier at the outer edges of the property.",
        benefit: "Early warning and deterrence of the intruder in outdoor areas, before accessing the building."
      },
      "sirenes": {
        title: "High-Decibel Sirens",
        description: "High-power acoustic and visual flashing devices designed to stun intruders and alert neighbors.",
        benefit: "High psychological factor of immediate acoustic and visual deterrence at the moment of intrusion attempt."
      },
      "teclados de alarme": {
        title: "LCD Control Keypads",
        description: "Tactile or backlit consoles installed at the building's entrance points to control the alarm system.",
        benefit: "Simple, intuitive and quick user interface to arm or disarm the system."
      },
      "comandos": {
        title: "Wireless Remote Keyfobs",
        description: "Pocket keychain remote controls with anti-copy encryption for quick management of the alarm.",
        benefit: "Absolute convenience to arm, disarm or trigger panic button close to the property."
      },
      "módulos GSM ou Wi-Fi": {
        title: "Integrated Communication Modules",
        description: "Cellular network card (SIM) or Ethernet/Wi-Fi logic boards for sending redundant alerts.",
        benefit: "Guarantee that emergency alerts reach your smartphone even if the fixed internet goes down."
      },
      "detectores internos e externos": {
        title: "Advanced Intrusion Detectors",
        description: "Complete set of glass-break, vibration or crevice detectors.",
        benefit: "Comprehensive coverage against all possible physical entry methods to the property."
      },
      // ACCESS CONTROL
      "leitores de cartão": {
        title: "RFID Card Readers",
        description: "Radio frequency proximity readers for quick validation of virtual keys and cards.",
        benefit: "Fast door release and instant card cancellation in case of loss or theft."
      },
      "tags": {
        title: "RFID Proximity Tags",
        description: "Small keyfob devices with integrated RFID microchip for user identification.",
        benefit: "Convenient to carry and high physical durability compared to conventional keys."
      },
      "teclados numéricos": {
        title: "Tactile Access Keypads",
        description: "Backlit numeric keypads with programmable security code to release electronic locks.",
        benefit: "Secure access without carrying physical keys or cards, simply type a personal code."
      },
      "biometria": {
        title: "Precision Biometric Readers",
        description: "Biometric devices that perform optical or capacitive readings of authorized fingerprints.",
        benefit: "Top security against identity spoofing, ensuring only the enrolled person can access."
      },
      "reconhecimento facial": {
        title: "Facial Recognition Terminals",
        description: "Advanced readers that use thermal cameras and infrared light for biometric authentication in milliseconds.",
        benefit: "Completely contact-free, highly hygienic access and immune to photograph spoofing."
      },
      "fechaduras elétricas": {
        title: "Electromagnetic Locks and Strikes",
        description: "Mechanical locking devices controlled electrically, integrated with readers and emergency exits.",
        benefit: "Robust physical lock with capacity of automatic release during fire alarms or power outages."
      },
      "botões de acesso": {
        title: "Exit Buttons",
        description: "Push buttons installed on the inner wall beside doors to release the lock when leaving.",
        benefit: "User ergonomics and immediate physical release for anyone exiting the building."
      },
      "controladores de acesso": {
        title: "Door Controller Boards",
        description: "Local processing boards that store permissions, schedules and connect readers to locks.",
        benefit: "Continuous operation on network or offline, ensuring doors operate even without server connection."
      },
      "torniquetes": {
        title: "Physical Access Turnstiles",
        description: "Rotating metal structures designed to enforce individual and controlled passage of people.",
        benefit: "Total elimination of tailgating and absolute control of flow."
      },
      "software de gestão de utilizadores": {
        title: "Access Management Software",
        description: "Digital platform for centralized control of permissions, schedules, holidays and attendance reports.",
        benefit: "Transparent operational control, real-time auditing of employee and visitor entries and exits."
      },
      // FIRE DETECTION
      "centrais de incêndio": {
        title: "Fire Alarm Panels",
        description: "Central equipments that monitor the integrity of the network of detectors and manual call points.",
        benefit: "Strict legal compliance and centralized triggering of evacuation sirens."
      },
      "detetores de fumo": {
        title: "Optical Smoke Detectors",
        description: "Sensors equipped with optical analysis chambers to identify physical presence of smoke in the environment.",
        benefit: "Early identification of slow smoldering fires or suspended smoke, allowing fast evacuation."
      },
      "detetores térmicos": {
        title: "Thermal Temperature Detectors",
        description: "Electronic detectors calibrated to trigger alarm when room temperature reaches a critical limit.",
        benefit: "Ideal for kitchens or workshops where normal presence of steam/smoke prevents optical detectors."
      },
      "botões manuais de alarme": {
        title: "Manual Call Points",
        description: "Red glass-break boxes for manual and immediate triggering of the fire alarm.",
        benefit: "Allows anyone present in the space to signal a fire before sensors trigger."
      },
      "sinalizadores": {
        title: "Flashing Strobe Beacons",
        description: "Luminous devices with high-brightness strobe light to visually alert about the emergency.",
        benefit: "Ensures effective alerts in high-noise environments or to hearing-impaired individuals."
      },
      "módulos de controlo": {
        title: "Intelligent Interface Modules",
        description: "Electronic modules for gas shut-off, ventilation stop or automatic skylight opening.",
        benefit: "Dynamic building system integration to prevent fire and toxic smoke spread."
      },
      "sistemas de evacuação": {
        title: "Emergency Evacuation Systems",
        description: "Integrated devices such as panic bars, emergency doors and autonomous exit lighting.",
        benefit: "Guarantees a fast, unhindered and safe escape route for all occupants of the space."
      },
      "cablagem técnica": {
        title: "Fire Resistant Cabling",
        description: "Conductors with silicone shielding certified to resist high temperatures for extended periods.",
        benefit: "Ensures continuous operation of detection systems even in extreme heat."
      },
      // AUTOMATION
      "motores para portões de correr": {
        title: "Sliding Gate Motors",
        description: "Electromechanical linear drive systems with heavy-duty gears to open sliding gates.",
        benefit: "Smooth, fast and secure opening of heavy residential or industrial gates with minimal wear."
      },
      "motores para portões de batente": {
        title: "Swing Gate Motors",
        description: "Articulated mechanical arms or hydraulic pistons designed to open swing gate leaves.",
        benefit: "Perfect alinhamento estético and excellent retention force against strong wind gusts."
      },
      "barreiras automáticas": {
        title: "Automatic Boom Barriers",
        description: "Automated gates with continuous service motors for agile control of parks and condominiums.",
        benefit: "Fast vehicle flow, high speed opening and great durability against intensive traffic."
      },
      "fotocélulas": {
        title: "Safety Sensors (Photocells)",
        description: "Infrared beams installed on the sides of the gate to detect vehicles or pedestrians in the path.",
        benefit: "Prevents serious accidents by stopping the gate from closing if there is an obstacle in the way."
      },
      "centrais de comando": {
        title: "Electronic Control Units",
        description: "Control boards that regulate motor speed, traction force and integrate radio receivers.",
        benefit: "Precise calibration of acceleration, soft deceleration and integrated anti-crushing protection."
      },
      "sensores de segurança": {
        title: "Magnetic Limit Sensors",
        description: "Electronic sensors that report the exact open or closed position of the gate to the control board.",
        benefit: "Millimeter motor stop at end of travel, protecting the gate structure from mechanical impacts."
      },
      "acessórios de automação": {
        title: "Safety and Warning Accessories",
        description: "Flashing warning lights for moving gates, amplified radio antennas and external receivers.",
        benefit: "Ensures the operation of the automation is visible to pedestrians and vehicles from a distance."
      },
      "sistemas de abertura remota": {
        title: "Smart Remote Access Modules",
        description: "IP or GSM devices that allow gates to be opened via toll-free phone calls or mobile applications.",
        benefit: "Open your gate remotely for family members or deliveries even when not physically there."
      },
      // DOORS & SEGURANÇA
      "portas de segurança": {
        title: "High-Security Armored Doors",
        description: "Doors with galvanized steel internal structure, reinforced hinges and acoustic/thermal insulation.",
        benefit: "High mechanical resistance against break-ins combined with a sophisticated aesthetic finish."
      },
      "portões seccionados": {
        title: "Thermal Sectional Doors",
        description: "Garage doors composed of double-skinned panels filled with injected polyurethane.",
        benefit: "Maximum space saving inside the garage and excellent thermal and acoustic insulation."
      },
      "portões industriais": {
        title: "Industrial Sectional Doors",
        description: "Large size doors reinforced against strong winds and heavy daily use in factories.",
        benefit: "Top security and ease of operational loading and unloading in docks."
      },
      "portas automáticas": {
        title: "Automatic Glass Sliding Doors",
        description: "Sliding doors with tempered glass controlled by radar sensors, ideal for commercial spaces.",
        benefit: "Maximum convenience for clients and excellent preservation of indoor climate."
      },
      "fechaduras reforçadas": {
        title: "Premium Multi-Point Locks",
        description: "Locks equipped with multiple mechanical locking points driven by high-security cylinders.",
        benefit: "Massive resistance against break-ins with leverage tools or drill attacks."
      },
      "acessórios de segurança": {
        title: "Defenders & Security Cylinders",
        description: "Tempered steel defenders that prevent physical extraction of the lock cylinder.",
        benefit: "Neutralization of bumping, picking and pulling tool attacks."
      },
      "estruturas de acesso": {
        title: "High-Resistance Frames and Sub-frames",
        description: "Reinforced steel door frames anchored directly into the concrete wall.",
        benefit: "Perfect structural stability over the years, preventing warps and weak anchoring points."
      },
      // UPS
      "UPS": {
        title: "High-Performance UPS Systems",
        description: "Professional uninterruptible power supply systems with automatic voltage regulation.",
        benefit: "Keeps security systems online without interruptions even during complete blackout."
      },
      "nobreaks": {
        title: "Pure Sine Wave Nobreaks",
        description: "UPS with pure sine wave output of high precision, essential for protecting sensitive data servers.",
        benefit: "Clean and stable electrical current, extending the lifespan of premium electronics."
      },
      "baterias": {
        title: "AGM Deep Cycle Batteries",
        description: "Sealed maintenance-free batteries with deep cycle technology for high reliability.",
        benefit: "High operational durability and longer electrical autonomy in emergency situations."
      },
      "sistemas de alimentação ininterrupta": {
        title: "Critical Power Systems",
        description: "Complete redundant power management units integrated in control cabinets.",
        benefit: "Prevents breaker trips or power cuts from turning off cameras or critical systems."
      },
      "proteção elétrica": {
        title: "Surge Protective Devices (SPD)",
        description: "Devices designed to protect against voltage spikes caused by lightning or network discharge.",
        benefit: "Prevents burning expensive electronic hardware by diverting excess voltage to ground."
      },
      "estabilizadores": {
        title: "Automatic Voltage Stabilizers",
        description: "Equipments that dynamically correct small electric network voltage fluctuations.",
        benefit: "Constant delivery of correct voltage, maintaining stable operation of computer networks."
      },
      "soluções para racks": {
        title: "Rackmount UPS & PDU",
        description: "UPS units designed specifically in 19-inch standard for clean integration in network racks.",
        benefit: "Exemplary organization, ease of management and better heat dissipation."
      },
      "energia de suporte para CCTV e redes": {
        title: "Dedicated Backup Power",
        description: "Power supplies with integrated battery backup support to power IP cameras and PoE switches.",
        benefit: "Guarantees image registration even if an intruder cuts the main breaker outside."
      },
      // SERRALHARIA
      "portões metálicos": {
        title: "Bespoke Metal Gates",
        description: "Gates manufactured in iron or stainless steel under custom technical design for exterior fencing.",
        benefit: "Extremely robust physical barrier visually adapted to the architectural design."
      },
      "grades de proteção": {
        title: "Security Grilles & Bars",
        description: "Fixed or expandable grilles made of galvanized iron for window and shopfront protection.",
        benefit: "Prevents physical break-in through glass windows or doors of commercial/residential buildings."
      },
      "estruturas em ferro": {
        title: "Galvanized Iron Structures",
        description: "Support structures, frames and technical brackets welded and treated with anti-rust coating.",
        benefit: "Robust mechanical support with excellent structural resistance and outdoor durability."
      },
      "estruturas em inox": {
        title: "Premium Stainless Steel Structures",
        description: "Handrails, brackets and noble finishes in brushed or polished stainless steel.",
        benefit: "Sophisticated design, immune to saline corrosion, ideal for coastal zones."
      },
      "corrimãos": {
        title: "Metal Handrails & Balustrades",
        description: "Custom-made safety metal structures for staircases and balcony railings.",
        benefit: "Safe circulation of people and compliance with civil engineering regulations."
      },
      "proteções metálicas": {
        title: "Reinforcement Plates and Shields",
        description: "Metallic plate coverings against vandalism and severe abrasive wear.",
        benefit: "Considerable increase of the physical durability of access points."
      },
      "acabamentos técnicos": {
        title: "Surface Treatment and Paint",
        description: "Pickling, metallization and electrostatic powder coating of iron and steel parts.",
        benefit: "Visual premium finish of high level and rust-free durability for decades."
      },
      "soluções personalizadas": {
        title: "Custom Metalwork Projects",
        description: "Special metalwork projects designed and manufactured for client specific purposes.",
        benefit: "Perfect physical fit in your building layout."
      },
      // TELECOMUNICAÇÕES
      "pontos de comunicação": {
        title: "Telecom Wall Sockets",
        description: "Coaxial and RJ45 signal sockets installed in key locations of homes or offices.",
        benefit: "Convenience and organization when accessing TV, voice and local data services."
      },
      "infraestrutura de telecomunicações": {
        title: "Structured Cabling & Conduits (ITED)",
        description: "Distribution boxes and structured conduits according to local telecom regulations.",
        benefit: "Ease of technical maintenance and total openness to install new telecom providers."
      },
      "antenas": {
        title: "Antenna Systems & Receivers",
        description: "Digital terrestrial (TDT) and satellite dishes with professional signal amplifiers.",
        benefit: "Crystal clear TV signal without interference or noise at all building outlets."
      },
      "equipamentos de comunicação": {
        title: "IP Video Intercoms & Panels",
        description: "Central signaling units for analog, mixed or high-definition IP video door entry systems.",
        benefit: "Allows direct communication with reception or via mobile app stably."
      },
      "interligação de sistemas": {
        title: "Multi-system Technical Integration",
        description: "Cabling and signal converter configurations to connect intercoms to CCTV systems.",
        benefit: "Quick visualization of who is calling on home monitors or camera screens."
      },
      "organização técnica": {
        title: "Telecom Distribution Enclosures",
        description: "Structured distribution boxes for residential telecom organized in a clean manner.",
        benefit: "Quick troubleshooting and perfect aesthetics in the building's backend."
      },
      "suporte para sistemas integrados": {
        title: "Integrated Telecom Infrastructure",
        description: "Installation of splitters, signal mixers and RF signal repeaters.",
        benefit: "Strong signal at all ends and outlets of the property."
      },
      // NETWORKS
      "cabeamento estruturado": {
        title: "CAT6/Fiber Structured Cabling",
        description: "Installation of Category 6 twisted pair or shielded fiber optic cables for high speed data transmission.",
        benefit: "Total stability without bandwidth losses and immunity to electric interferences."
      },
      "racks": {
        title: "Network Racks & Enclosures",
        description: "Ventilated 19-inch metal enclosures designed to organize switches, patch panels and servers.",
        benefit: "Centralization, excellent cooling of active equipment and ease of technical intervention."
      },
      "switches": {
        title: "PoE Managed Switches",
        description: "Network devices that distribute data and electric power (Power over Ethernet) directly over network cables.",
        benefit: "Eliminates the need for individual power supplies and electrical outlets near IP cameras."
      },
      "routers": {
        title: "High-Performance Routers",
        description: "Gateway network devices to manage internet connection and internal network traffic.",
        benefit: "Advanced control of network access with active firewalls and dedicated sub-net routing (VLANs)."
      },
      "patch panels": {
        title: "Termination Patch Panels",
        description: "RJ45 mechanical termination panels for data cables organized inside the rack cabinet.",
        benefit: "Avoids direct damage to building internal cabling during cable changes in the cabinet."
      },
      "pontos de rede": {
        title: "Certified RJ45 Sockets",
        description: "Shielded wall sockets of high technical standard for quick computer and camera connections.",
        benefit: "Perfect mechanical connection, free of network interference and signal packet losses."
      },
      "Wi-Fi profissional": {
        title: "Mesh Wi-Fi Access Points",
        description: "Professional ceiling-mount antennas integrated in a fast roaming Mesh network for stable signal.",
        benefit: "Constant and uniform Wi-Fi signal without drops when moving from one room to another in the building."
      },
      "organização de cabos": {
        title: "Cable Organizers & Trays",
        description: "Horizontal and vertical rack accessories designed to hide and order patch cords.",
        benefit: "Impeccable visual layout of cabinet, easy to read and simple to troubleshoot."
      },
      "infraestrutura para CCTV e sistemas técnicos": {
        title: "Dedicated Security Network",
        description: "Logical configuration of VLANs dedicated exclusively to security camera and recorder traffic.",
        benefit: "Prevents network congestion on the normal network and brings higher cyber security."
      }
    }
  },
  fr: {
    nav: {
      home: "Accueil",
      solutions: "Solutions",
      equipments: "Équipement",
      projects: "Projets",
      contact: "Contact",
      backToHome: "Retour à l'accueil",
      requestQuote: "Demander un devis"
    },
    hero: {
      badge: "Cotton Dome Security Solutions",
      title: "Sécurité Intelligente pour Résidences, Entreprises et Copropriétés",
      subtitle: "Cotton Dome LDA développe des solutions complètes de vidéosurveillance, contrôle d'accès, alarmes anti-intrusion, automatisation, réseaux, télécommunications et systèmes de protection professionnelle.",
      ctaPrimary: "Demander un Devis",
      ctaSecondary: "Explorer les Solutions"
    },
    pillars: {
      tag: "Pourquoi Nous Choisir",
      title: "Norme d'Excellence et de Confiance",
      subtitle: "Nous nous engageons à livrer des projets techniquement impeccables, offrant un service qui dépasse nos normes les plus élevées de l'industrie.",
      p1Title: "Ingénierie Technique",
      p1Desc: "Installations calculées au millimètre, avec câblage technique dissimulé, structuré et étalonnage logique de précision.",
      p2Title: "Équipement d'Élite",
      p2Desc: "Nous travaillons exclusivement avec du matériel de marques renommées, homologué et certifié sous garantie.",
      p3Title: "Support Permanent",
      p3Desc: "Assistance client réactive et agile pour garantir que votre sécurité ne subisse jamais d'interruptions opérationnelles."
    },
    solutions: {
      tag: "Services Spécialisés",
      title: "Solutions intelligentes pour votre sécurité",
      subtitle: "Cotton Dome LDA propose des solutions complètes en sécurité, automatisation et infrastructure technique, adaptées aux besoins de chaque client.",
      learnMore: "Savoir plus"
    },
    equipments: {
      tag: "Technologie de Pointe",
      title: "Équipements et Solutions",
      subtitle: "Nous utilisons des dispositifs de dernière génération pour offrir une stabilité logique et des barrières physiques robustes contre toute menace.",
      items: {
        cameras: {
          title: "Caméras de Sécurité",
          desc: "Équipements modernes pour la surveillance des environnements intérieurs et extérieurs, garantissant plus de sécurité et un contrôle en temps réel."
        },
        alarmCenters: {
          title: "Centrales d'Alarme",
          desc: "Solutions intelligentes pour la protection des biens, avec capteurs intégrés et réponse rapide contre les intrusions."
        },
        motionSensors: {
          title: "Détecteurs de Présence",
          desc: "Dispositifs qui identifient les mouvements dans les zones stratégiques, augmentant l'efficacité de la sécurité."
        },
        biometrics: {
          title: "Contrôle Biométrique",
          desc: "Technologie pour la libération d'accès par empreinte digitale, apportant plus de sécurité et de praticité."
        },
        electronicLocks: {
          title: "Serrures Électroniques",
          desc: "Solutions modernes pour le contrôle des portes, s'ouvrant avec un mot de passe, une carte, la biométrie ou une application."
        },
        turnstiles: {
          title: "Tourniquets d'Accès",
          desc: "Équipements idéaux pour les entreprises, les copropriétés et les environnements qui doivent contrôler le flux de personnes."
        }
      }
    },
    environments: {
      tag: "Domaines d'Activité",
      title: "Des solutions dédiées pour chaque environnement",
      subtitle: "Chaque espace nécessite une solution spécifique. Cotton Dome LDA développe des projets personnalisés, combinant technologie de pointe, sécurité certifiée et efficacité opérationnelle pour différents types d'environnements.",
      items: {
        residencias: { name: "Résidences", desc: "Protection complète pour votre maison, combinant sécurité électronique, automatismes intelligents et confort numérique au quotidien." },
        condominios: { name: "Copropriétés", desc: "Solutions intégrées de contrôle d'accès, vidéosurveillance et automatisation pour parcs, portails et parties communes résidentielles." },
        empresas: { name: "Entreprises", desc: "Systèmes de protection des données, sécurité physique des bureaux, contrôle du temps des employés et sécurité des accès." },
        comercio: { name: "Commerces", desc: "Prévention active des pertes avec vidéosurveillance 4K, alarmes anti-intrusion, protection incendie et portes vitrées automatiques." },
        industrias: { name: "Industries", desc: "Projets techniques robustes pour environnements exigeants, avec barrières rapides, détection incendie avancée et contrôle biométrique." },
        armazens: { name: "Entrepôts", desc: "Organisation structurelle des réseaux de communications, onduleurs (UPS) pour baies, vidéosurveillance périphérique et portes sectionnelles durables." }
      }
    },
    outlet: {
      tag: "Outlet / Promotions",
      title: "Équipements en Vedette avec Réduction",
      subtitle: "Profitez de nos conditions spéciales sur les systèmes d'intrusion et d'alarme. Équipements de haute sécurité avec prix sur demande et installation professionnelle incluse.",
      viewProduct: "Voir le produit",
      requestQuote: "Demander un devis",
      whatsapp: "Discuter sur WhatsApp",
      badgePromo: "PROMO",
      badgeOutlet: "OUTLET"
    },
    howWeWork: {
      tag: "Méthodologie",
      title: "Notre Façon de Travailler",
      subtitle: "Nous garantissons un suivi d'excellence, de l'analyse initiale des risques à la maintenance préventive périodique.",
      steps: {
        step1Title: "Analyse Technique",
        step1Desc: "Nous comprenons minutieusement les besoins du client et évaluons l'espace physique avec précision technique.",
        step2Title: "Proposition Personnalisée",
        step2Desc: "Nous indiquons les solutions de haute ingénierie les plus adaptées et dimensionnées pour votre budget.",
        step3Title: "Installation Professionnelle",
        step3Desc: "Nous réalisons le montage physique et l'étalonnage logique avec rigueur, organisation technique et respect esthétique.",
        step4Title: "Support et Suivi",
        step4Desc: "Nous fournissons une assistance technique dédiée pour garantir la fiabilité permanente de vos solutions de sécurité."
      }
    },
    projects: {
      tag: "Portfolio",
      title: "Projets Récents Réalisés",
      subtitle: "Découvrez quelques-uns des projets techniques mis en œuvre avec succès par l'équipe de Cotton Dome LDA.",
      all: "Tous",
      categories: {
        cctv: "Vidéosurveillance",
        intrusao: "Systèmes d'Alarme",
        acessos: "Contrôle d'Accès",
        incendio: "Détection Incendie",
        automatismos: "Automatismes",
        redes: "Réseaux Techniques"
      },
      items: {
        p1: { title: "CCTV Résidentiel Intelligent", desc: "Installation de caméras IP 4K avec analyse vidéo et détection intelligente de personnes autour d'une villa de luxe." },
        p2: { title: "Automatisation de Porte de Garage", desc: "Installation d'une porte sectionnelle thermique avec motorisation rapide Motorline et télécommandes à code évolutif." },
        p3: { title: "Contrôle d'Accès Biométrique", desc: "Mise en œuvre du contrôle d'accès avec reconnaissance faciale et lecteurs RFID pour des bureaux d'entreprise." },
        p4: { title: "Baie de Réseau et Infrastructure", desc: "Installation et certification du câblage réseau structuré, baie organisée et onduleur (UPS) de secours pour une sécurité stable." },
        p5: { title: "Détection Optique d'Incendie", desc: "Système de centrales d'incendie adressables et détecteurs optiques de fumée avec isolateur intégré dans un pavillon industriel." },
        p6: { title: "Sécurité Périphérique & Alarme", desc: "Capteurs extérieurs résistants aux fausses alertes combinés à des sirènes dissuasives intelligentes connectées par application." }
      }
    },
    quoteSection: {
      title: "La sécurité n'est pas un produit, c'est un état d'esprit permanent.",
      subtitle: "Nous concevons des systèmes axés sur la tranquillité absolue de votre habitation ou sur le contrôle opérationnel de votre entreprise.",
      cta: "Parler à un Ingénieur"
    },
    about: {
      tag: "À Propos de Nous",
      title: "Qui Sommes-Nous",
      desc1: "Cotton Dome LDA est une entreprise spécialisée dans l'ingénierie de la sécurité électronique et de l'infrastructure technologique, axée sur la fourniture des meilleures solutions de protection et de connectivité pour les maisons, les entreprises, les copropriétés et les industries au Portugal.",
      desc2: "We focus on advanced CCTV systems, intrusion alarms, biometric access control, fire detection, robust automation and high-performance IT networks.",
      mission: "Notre Mission",
      vision: "Notre Vision",
      values: "Nos Valeurs",
      valuesList: ["Rigueur technique et précision", "Intégrité professionnelle", "Innovation technologique continue", "Focus sur les besoins du client", "Esthétique et organisation sur le chantier"]
    },
    contact: {
      tag: "Contact",
      title: "Contactez-Nous",
      subtitle: "Obtenez une analyse technique détaillée de votre espace. Notre équipe d'ingénieurs en sécurité est prête à concevoir votre solution.",
      form: {
        name: "Votre Nom Complet",
        phone: "Téléphone / Mobile",
        email: "E-mail de Contact",
        service: "Service Souhaité",
        servicePlaceholder: "Sélectionnez le service...",
        message: "Comment pouvons-nous vous aider? Décrivez brièvement le projet...",
        sending: "Envoi du message...",
        sendSuccess: "Message envoyé avec succès! Nous vous contacterons sous peu.",
        sendError: "Erreur lors de l'envoi du message. Veuillez réessayer ou utiliser WhatsApp.",
        submit: "Envoyer la Demande de Devis"
      },
      info: {
        phone: "Téléphone",
        whatsapp: "WhatsApp Commercial",
        email: "E-mail Général",
        address: "Siège Commercial",
        workingHours: "Lundi au Vendredi: 09h00 à 18h30",
        satHours: "Samedi (Urgências): 09h00 à 13h00"
      }
    },
    serviceDetail: {
      backHome: "Retour à l'accueil",
      requestBudget: "Demander Devis",
      aboutService: "À Propos du Service",
      generalDesc: "Nous développons des projets robustes et fonctionnels qui respectent strictement les normes de sécurité technique européennes. Tous les équipements installés par nos soins proviennent de marques renommées, garantissant une longévité opérationnelle accrue, une stabilité logique et des garanties d'usine complètes.",
      mainBenefits: "Principaux Avantages",
      appAreas: "Domaines d'Application",
      appAreasDesc: "Où les services techniques de Cotton Dome LDA garantissent la plus grande efficacité et protection technique:",
      relatedEquipments: "Équipements & Solutions Connexes",
      relatedEquipmentsDesc: "Nous utilisons uniquement des composants d'origine certifiés dans le montage de chaque système technique:",
      galleryTitle: "Galerie d'Équipements et Solutions",
      galleryDesc: "Enregistrement visuel des solutions techniques, équipements et installations de haute sécurité réalisés par notre équipe:",
      processTitle: "Notre Processus de Travail",
      processDesc: "Comment l'équipe d'ingénieurs de Cotton Dome LDA agit pour garantir une fiabilité technique maximale:",
      finalCtaTitle: "Besoin d'une solution professionnelle pour votre espace?",
      finalCtaDesc: "Cotton Dome LDA analyse vos besoins et développe une solution sur mesure, avec technologie, sécurité et professionnalisme.",
      finalCtaBtn: "Demander Devis",
      errorTitle: "Service non trouvé",
      errorDesc: "La page que vous recherchez n'existe pas ou a été déplacée. Veuillez retourner à la page d'accueil."
    },
    services: {
      "cctv": {
        title: "CCTV / Vidéosurveillance Professionnelle",
        slogan: "Surveillance intelligente et contrôle total en temps réel pour une sécurité maximale de votre patrimoine.",
        shortDesc: "Systèmes de caméras haute définition avec intelligence artificielle pour la surveillance et l'enregistrement locaux et à distance.",
        desc: "Nous concevons et installons des systèmes de vidéosurveillance (CCTV) professionnels dotés de caméras haute définition (IP et analogiques) qui intègrent l'intelligence artificielle pour une détection précise des humains et des véhicules. Surveillez votre espace depuis n'importe où dans le monde via des appareils mobiles, avec un enregistrement continu et sécurisé et des solutions sur mesure pour les résidences, les copropriétés et les secteurs d'entreprise."
      },
      "intrusao": {
        title: "Systèmes d'Alarme et d'Intrusion",
        slogan: "Systèmes intelligents de détection d'intrusion avec réponse rapide et alertes immédiates sur votre téléphone portable.",
        shortDesc: "Protection périmétrique et interne avec capteurs de mouvement avancés, sirènes haute puissance et centrales connectées.",
        desc: "Nos systèmes d'intrusion offrent une barrière de sécurité active et intelligente. Avec des centrales d'alarme filaires ou sans fil avancées, des détecteurs de mouvement immunisés contre les animaux domestiques, des capteurs magnétiques et une protection périmétrique extérieure, nous garantissons une détection précoce des effractions avec notification directe dans l'application mobile ou liaison vers les centres de réception d'alarmes."
      },
      "acessos": {
        title: "Contrôle d'Accès",
        slogan: "Gestion intelligente des flux de personnes et des autorisations avec reconnaissance faciale, biométrie et badges RFID.",
        shortDesc: "Lecteurs intelligents, serrures électroniques et tourniquets pour garantir que seules les personnes autorisées accèdent à votre espace.",
        desc: "Nous fournissons et installons des systèmes de contrôle d'accès avancés pour les environnements résidentiels et professionnels. Autorisez l'entrée contrôlée des employés, des visiteurs ou des résidents grâce à des lecteurs d'empreintes digitales, à la reconnaissance faciale en une fraction de seconde, à des badges, à des cartes de proximité ou à des codes numériques, tout en conservant un journal historique en temps réel et en assurant l'intégration avec les alarmes et la vidéosurveillance."
      },
      "incendio": {
        title: "Systèmes de Détection Incendie",
        slogan: "Prévention, alerte et sécurité pour protéger les personnes, les espaces et les biens.",
        shortDesc: "Systèmes de détection et d'alerte pour la prévention, la sécurité et la réponse rapide en cas d'incendie.",
        desc: "Les systèmes de détection incendie sont essentiels pour les environnements commerciaux, industriels, résidentiels collectifs et institutionnels. Cotton Dome LDA travaille avec des solutions de détection et d'alerte qui permettent d'identifier les signaux d'incendie et de déclencher des réponses rapides dans les situations à risque."
      },
      "automatismos": {
        title: "Automatismes pour Portails et Accès",
        slogan: "Plus de confort, de sécurité et d'efficacité dans le contrôle de vos accès.",
        shortDesc: "Automatisation des portails, barrières et accès pour plus de confort, de sécurité et d'efficacité.",
        desc: "Cotton Dome LDA installe des solutions d'automatisation pour portails, barrières, portes et systèmes d'accès. Les automatismes permettent une ouverture et une fermeture automatiques avec sécurité, praticité et contrôle, idéales pour les résidences, les copropriétés, les entreprises et les espaces industriels."
      },
      "portas-portoes": {
        title: "Portes de Sécurité & Portails Sectionnels",
        slogan: "Solutions résistantes, modernes et sûres pour protéger vos accès.",
        shortDesc: "Solutions résistantes et modernes pour les accès résidentiels, commerciaux et industriels.",
        desc: "Cotton Dome LDA propose des portes de sécurité et des portails sectionnels pour les environnements résidentiels, commerciaux et industriels. Ces solutions allient résistance, fonctionnalité, esthétique et protection, et peuvent être intégrées à des automatismes et à des systèmes de contrôle d'accès."
      },
      "ups": {
        title: "Onduleurs (UPS) & Systèmes d'Énergie Secourue",
        slogan: "Protégez vos équipements contre les pannes, les fluctuations et les coupures de courant.",
        shortDesc: "Alimentation de secours pour protéger les équipements critiques contre les pannes électriques.",
        desc: "Les onduleurs (UPS) garantissent une alimentation de secours pour les équipements critiques tels que les caméras, les serveurs, les réseaux, les alarmes et les systèmes de sécurité. Cotton Dome LDA propose des solutions qui contribuent à maintenir les systèmes essentiels en marche même en cas d'instabilité électrique."
      },
      "serralharia": {
        title: "Serrurerie en Fer & Acier Inoxydable",
        slogan: "Solutions métalliques résistantes, fonctionnelles et adaptées à votre projet.",
        shortDesc: "Structures métalliques, grilles, portails et solutions sur mesure en fer et acier inoxydable.",
        desc: "Cotton Dome LDA développe des solutions de serrurerie en fer et en acier inoxydable, notamment des portails, des grilles, des structures métalliques, des garde-corps et des finitions sur mesure. Ce service est idéal pour renforcer la sécurité, améliorer les accès et créer des structures personnalisées pour différents besoins."
      },
      "telecomunicacoes": {
        title: "Télécommunications & Interphonie",
        slogan: "Infrastructure technique pour la communication, la connectivité et l'intégration des systèmes.",
        shortDesc: "Infrastructure technique pour la communication, l'intégration des systèmes et la connectivité professionnelle.",
        desc: "Cotton Dome LDA propose des solutions de télécommunications pour soutenir les systèmes de sécurité, les réseaux, la communication et l'infrastructure technique. Ce service permet de créer des environnements plus connectés, organisés et préparés pour les opérations modernes."
      },
      "redes": {
        title: "Réseaux & Network Solutions",
        slogan: "Infrastructure réseau professionnelle pour la sécurité, la communication et la haute performance.",
        shortDesc: "Câblage structuré, baies, commutateurs, Wi-Fi professionnel et infrastructure réseau.",
        desc: "Cotton Dome LDA développe des solutions réseau pour les résidences, les entreprises, les copropriétés, les commerces et les environnements industriels. Un réseau bien structuré est essentiel pour le fonctionnement des systèmes de sécurité, de vidéosurveillance, de contrôle d'accès, d'internet, de communication et des appareils connectés."
      }
    },
    productsDict: {
      // CCTV
      "câmeras IP": {
        title: "Caméras IP Professionnelles",
        description: "Caméras réseau intelligentes qui transmettent des vidéos numériques ultra haute définition sur l'infrastructure Ethernet.",
        benefit: "Image cristalline riche en détails, permettant un zoom numérique sans perte grave de qualité."
      },
      "câmeras analógicas": {
        title: "Caméras Analogiques HD",
        description: "Caméras utilisant un câblage coaxial pour transmettre des images haute définition avec une latence quasi nulle.",
        benefit: "Solution robuste, économique et idéale pour moderniser les installations existantes sans changer les câbles."
      },
      "câmeras dome": {
        title: "Caméras Dôme Discrètes",
        description: "Caméras de sécurité de forme ronde, idéales pour les plafonds de bureaux ou de résidences pour une discrétion esthétique.",
        benefit: "Aspect élégant, compact et discret, offrant une excellente couverture grand angle."
      },
      "câmeras bullet": {
        title: "Caméras Bullet Dissuasives",
        description: "Caméras cylindriques allongées, parfaitement visibles et conçues pour la surveillance extérieure.",
        benefit: "Effet dissuasif visuel fort contre les intrus potentiels et haute résistance aux intempéries."
      },
      "gravadores DVR": {
        title: "Enregistreurs DVR Numériques",
        description: "Unités de traitement centralisé et d'enregistrement vidéo continu pour les caméras à signal analogique coaxial.",
        benefit: "Stockage local fiable et configuration logique facile pour la visualisation à distance."
      },
      "gravadores NVR": {
        title: "Enregistreurs NVR Réseau",
        description: "Serveurs d'enregistrement dédiés aux caméras réseau IP, prenant en charge les analyses vidéo basées sur l'Intelligence Artificielle.",
        benefit: "Capacité de traitement élevée, analyse vidéo intelligente et enregistrement redondant sécurisé."
      },
      "discos de gravação": {
        title: "Disques Durs Spéciaux Vidéosurveillance",
        description: "Disques durs de classe entreprise conçus spécifiquement pour des opérations d'écriture vidéo 24h/24 et 7j/7.",
        benefit: "Durabilité mécanique extrême et prévention de la perte de données de surveillance critiques."
      },
      "fontes de alimentação": {
        title: "Alimentations Stabilisées",
        description: "Unités de distribution centrale d'énergie propre pour toutes les caméras de l'écosystème.",
        benefit: "Protège le matériel contre les pics de tension et les surcharges indésirables en fonctionnement quotidien."
      },
      "cablagem": {
        title: "Câblage Certifié",
        description: "Conducteurs en cuivre de haute qualité blindados contre les interférences électromagnétiques de l'environnement.",
        benefit: "Transmission stable du signal vidéo et des données sur de longues distances sans dégradation."
      },
      "acesso remoto por aplicação": {
        title: "Accès à Distance via App",
        description: "Configuration logique DNS ou cloud qui permet la visualisation des caméras en temps réel via smartphone ou tablette.",
        benefit: "Surveillez et contrôlez instantanément la sécurité de votre propriété partout dans le monde."
      },
      // ALARM SYSTEMS
      "centrais de alarme": {
        title: "Centrales d'Alarme Connectées",
        description: "Le cérebro du système de sécurité qui surveille les capteurs et coordonne le déclenchement des sirènes et la transmission GSM/Wi-Fi.",
        benefit: "Centralisation intelligente des alertes et fonctionnement sans coupure même lors de pannes électriques."
      },
      "sensores de movimento": {
        title: "Capteurs de Mouvement PIR",
        description: "Détecteurs de présence infrarouges passifs calibrés pour identifier les variations de chaleur corporelle.",
        benefit: "Haute précision dans la détection des intrus et immunité intelligente contre les animaux domestiques (PET-immune)."
      },
      "sensores magnéticos": {
        title: "Contacts Magnétiques Numériques",
        description: "Capteurs d'ouverture composés d'un aimant installés sur le cadre des portes et des fenêtres.",
        benefit: "Détection instantanée des ouvertures avant même que l'intrus ne pénètre dans les lieux."
      },
      "sensores perimetrais": {
        title: "Détecteurs de Barrière Périphérique",
        description: "Capteurs à faisceau infrarouge conçus pour créer une barrière invisible aux bords extérieurs de la propriété.",
        benefit: "Alerte précoce et dissuasion de l'intrus dans les zones extérieures, avant d'accéder au bâtiment."
      },
      "sirenes": {
        title: "Sirènes à Décibels Élevés",
        description: "Dispositifs acoustiques et visuels clignotants de grande puissance conçus pour étourdir les intrus et alerter le voisinage.",
        benefit: "Effet psychologique majeur de dissuasion acoustique et visuelle immédiate au moment de la tentative d'intrusion."
      },
      "teclados de alarme": {
        title: "Claviers de Commande LCD",
        description: "Consoles tactiles ou rétroéclairées installées aux points d'entrée du bâtiment pour contrôler l'alarme.",
        benefit: "Interface utilisateur simple, intuitive et rapide pour armer ou désarmer le système."
      },
      "comandos": {
        title: "Télécommandes sans Fil",
        description: "Télécommandes de poche en porte-clés avec cryptage anti-copie pour une gestion rapide de l'alarme.",
        benefit: "Praticité absolue pour armer, désarmer ou déclencher un bouton de panique à proximité du bâtiment."
      },
      "módulos GSM ou Wi-Fi": {
        title: "Modules de Communication Intégrés",
        description: "Cartes réseau cellulaire (SIM) ou cartes Ethernet/Wi-Fi pour l'envoi d'alertes redondantes.",
        benefit: "Garantie que les alertes d'urgence parviennent à votre smartphone même si l'internet fixe tombe en panne."
      },
      "detectores internos e externos": {
        title: "Détecteurs d'Intrusion Avancés",
        description: "Ensemble complet de détecteurs de bris de glace, de vibration ou de fentes.",
        benefit: "Couverture complète contre toutes les méthodes physiques possibles d'accès à la propriété."
      },
      // ACCESS CONTROL
      "leitores de cartão": {
        title: "Lecteurs de Cartes RFID",
        description: "Lecteurs de proximité par radiofréquence pour la validation rapide des clés virtuelles et des cartes.",
        benefit: "Déverrouillage rapide des portes et annulation instantanée des cartes en cas de perte ou de vol."
      },
      "tags": {
        title: "Badges de Proximité RFID",
        description: "Petits dispositifs de type porte-clés avec puce RFID intégrée pour l'identification de l'utilisateur.",
        benefit: "Pratique à transporter et grande durabilité physique par rapport aux clés conventionnelles."
      },
      "teclados numéricos": {
        title: "Claviers d'Accès Tactiles",
        description: "Claviers numériques rétroéclairés avec code de sécurité programmable pour déverrouiller les verrous.",
        benefit: "Accès sécurisé sans clé physique ni carte, il suffit de saisir un code personnel."
      },
      "biometria": {
        title: "Lecteurs Biométriques de Précision",
        description: "Dispositifs biométriques effectuant des lectures optiques ou capacitives des empreintes digitales autorisées.",
        benefit: "Sécurité maximale contre l'usurpation d'identité, garantissant que seule la personne autorisée peut accéder."
      },
      "reconhecimento facial": {
        title: "Terminaux de Reconnaissance Faciale",
        description: "Lecteurs avancés utilisant des caméras thermiques et de la lumière infrarouge pour une authentification biométrique en quelques millisecondes.",
        benefit: "Accès totalement sans contact physique, extrêmement hygiénique et immunisé contre les fraudes par photo."
      },
      "fechaduras elétricas": {
        title: "Ventouses et Gâches Électromagnétiques",
        description: "Dispositifs de verrouillage mécanique contrôlés électriquement, intégrés aux lecteurs et sorties de secours.",
        benefit: "Verrouillage physique robuste avec capacité de déverrouillage automatique en cas d'incendie ou de panne de courant."
      },
      "botões de acesso": {
        title: "Boutons de Sortie",
        description: "Boutons poussoirs installés sur le mur intérieur près des portes pour libérer le verrou en sortant.",
        benefit: "Ergonomie d'utilisation et déverrouillage physique immédiat pour toute personne sortant du bâtiment."
      },
      "controladores de acesso": {
        title: "Centrales de Contrôle de Porte",
        description: "Cartes de traitement local qui stockent les autorisations, les horaires et connectent les lecteurs aux verrous.",
        benefit: "Fonctionnement continu en réseau ou hors ligne, garantissant le fonctionnement des portes même sans connexion serveur."
      },
      "torniquetes": {
        title: "Tourniquets de Passage",
        description: "Structures métalliques rotatives conçues pour imposer le passage individuel et contrôlé des personnes.",
        benefit: "Élimination totale du talonnage (passage double) et contrôle absolu des flux."
      },
      "software de gestão de utilizadores": {
        title: "Logiciel de Gestion des Accès",
        description: "Plateforme numérique pour le contrôle centralisé des autorisations, des horaires, des jours fériés et des rapports de présence.",
        benefit: "Contrôle opérationnel transparent, audit en temps réel des entrées/sorties des employés et visiteurs."
      },
      // FIRE DETECTION
      "centrais de incêndio": {
        title: "Centrales d'Incendie",
        description: "Équipements centraux surveillant l'intégrité du réseau de détecteurs et de déclencheurs manuels.",
        benefit: "Respect strict des obligations légales et déclenchement centralisé des sirènes d'évacuation."
      },
      "detetores de fumo": {
        title: "Détecteurs Optiques de Fumée",
        description: "Capteurs équipés de chambres d'analyse optique pour identifier la présence physique de fumée dans l'air.",
        benefit: "Identification précoce des feux couvants lents ou de la fumée en suspension, permettant une évacuation rapide."
      },
      "detetores térmicos": {
        title: "Détecteurs Thermiques de Chaleur",
        description: "Détecteurs électroniques calibrés pour déclencher l'alarme lorsque la température atteint un seuil critique.",
        benefit: "Idéal pour les cuisines ou les ateliers où la présence normale de vapeur/fumée exclut les détecteurs optiques."
      },
      "botões manuais de alarme": {
        title: "Déclencheurs Manuels de Feu",
        description: "Boîtiers rouges bris de glace pour le déclenchement immédiat et manuel de l'alarme incendie.",
        benefit: "Permet à quiconque dans l'espace de signaler un incendie avant que les capteurs ne s'activent."
      },
      "sinalizadores": {
        title: "Diffuseurs Lumineux Flash",
        description: "Dispositifs lumineux avec flash stroboscopique haute luminosité pour signaler visuellement l'urgence.",
        benefit: "Assure des alertes efficaces dans les environnements bruyants ou pour les personnes malentendantes."
      },
      "módulos de controlo": {
        title: "Modules d'Interface Intelligents",
        description: "Modules électroniques pour la coupure de gaz, l'arrêt de la ventilation ou l'ouverture automatique des lanterneaux.",
        benefit: "Intégration dynamique des systèmes du bâtiment pour empêcher la propagation du feu et des fumées toxiques."
      },
      "sistemas de evacuação": {
        title: "Systèmes d'Évacuation d'Urgence",
        description: "Dispositifs intégrés tels que barres anti-panique, portes de secours et éclairage autonome de sortie.",
        benefit: "Garante une issue de secours rapide, dégagée et sûre pour tous les occupants du bâtiment."
      },
      "cablagem técnica": {
        title: "Câblage Résistant au Feu",
        description: "Câbles blindés au silicone certifiés pour résister aux températures extrêmes pendant de longues périodes.",
        benefit: "Assure le fonctionnement continu des systèmes de détection incendie même sous une chaleur extrême."
      },
      // AUTOMATION
      "motores para portões de correr": {
        title: "Moteurs de Portails Coulissants",
        description: "Systèmes d'entraînement linéaire électromécaniques avec engrenages robustes pour portails coulissants.",
        benefit: "Ouverture fluide, rapide et sécurisée des portails résidentiels ou industriels lourds avec usure minimale."
      },
      "motores para portões de batente": {
        title: "Moteurs de Portails Battants",
        description: "Bras articulés mécaniques ou pistons hydrauliques conçus pour ouvrir les vantaux de portails pivotants.",
        benefit: "Parfait alignement esthétique et excellente force de rétention contre les fortes rafales de vent."
      },
      "barreiras automáticas": {
        title: "Barrières de Parking Automatiques",
        description: "Barrières automatisées avec moteurs de service continu pour le contrôle agile des parcs et copropriétés.",
        benefit: "Flux de véhicules rapide, vitesse d'ouverture élevée et grande durabilité contre le trafic intense."
      },
      "fotocélulas": {
        title: "Capteurs de Sécurité (Photocellules)",
        description: "Faisceaux infrarouges installés sur les côtés du portail pour détecter les voitures/piétons sur le chemin.",
        benefit: "Prévient les accidents graves en arrêtant la fermeture du portail s'il y a un obstacle sur le passage."
      },
      "centrais de comando": {
        title: "Logiques de Commande Électronique",
        description: "Plates de contrôle régulant la vitesse des moteurs, la force de traction et integrant les récepteurs radio.",
        benefit: "Étalonnage précis de l'accélération, décélération douce et protection anti-écrasement intégrée."
      },
      "sensores de segurança": {
        title: "Capteurs de Limite Magnétiques",
        description: "Capteurs électroniques indiquant la position ouverte ou fermée exacte du portail à la carte de commande.",
        benefit: "Arrêt du moteur au millimètre en fin de course, préservant la structure du portail des chocs mécaniques."
      },
      "acessórios de automação": {
        title: "Feux Clignotants et Antennes radio",
        description: "Feux clignotants d'avertissement pour portails en mouvement, antennes radio amplifiées et récepteurs.",
        benefit: "Garantit que le fonctionnement de l'automatisme soit visible à distance par les piétons et les véhicules."
      },
      "sistemas de abertura remota": {
        title: "Modules d'Accès à Distance Intel",
        description: "Dispositifs IP ou GSM permettant d'ouvrir les portails via des appels téléphoniques gratuits ou des applications.",
        benefit: "Ouvrez votre portail à distance pour la famille ou les livraisons même si vous n'êtes pas sur place."
      },
      // DOORS & SEGURANÇA
      "portas de segurança": {
        title: "Portes Blindées de Haute Sécurité",
        description: "Portes avec structure interna en acier galvanisé, charnières renforcées et isolation acoustique/thermique.",
        benefit: "Haute résistance mécanique contre les effractions combinée à une finition esthétique sophistiquée."
      },
      "portões seccionados": {
        title: "Portes Sectionnelles Thermiques",
        description: "Portes de garage composées de panneaux double paroi remplis de mousse de polyuréthane injectée.",
        benefit: "Gain de place maximal dans le garage et excellente isolation thermique et acoustique."
      },
      "portões industriais": {
        title: "Portes Sectionnelles Industrielles",
        description: "Portes de grande taille renforcées contre les vents violents et l'utilisation quotidienne intensive en usine.",
        benefit: "Sécurité maximale et facilité de chargement et de déchargement opérationnels dans les quais."
      },
      "portas automáticas": {
        title: "Portes Vitrées Coulissantes Automatiques",
        description: "Portes coulissantes en verre trempé contrôlées par des radars de détection, idéales pour les espaces commerciaux.",
        benefit: "Maximum de commodité d'entrée pour les clients et excellente conservation de la climatisation intérieure."
      },
      "fechaduras reforçadas": {
        title: "Serrures Multipoints de Qualité",
        description: "Serrures équipées de plusieurs points de verrouillage mécanique entraînés par des cylindres de haute sécurité.",
        benefit: "Résistance massive contre les effractions avec des outils de levier ou des attaques à la perceuse."
      },
      "acessórios de segurança": {
        title: "Défenseurs & Protecteurs de Cylindre",
        description: "Défenseurs en acier trempé empêchant l'extraction physique du cylindre de serrure.",
        benefit: "Neutralisation des attaques par bumping, crochetage et outils d'extraction."
      },
      "estruturas de acesso": {
        title: "Bâtis et Pré-cadres de Haute Résistance",
        description: "Châssis de porte en acier renforcé ancrés directement dans le mur en béton.",
        benefit: "Stabilité structurelle parfaite au fil des ans, évitant les déformations et les points d'ancrage faibles."
      },
      // UPS
      "UPS": {
        title: "Systèmes d'Onduleurs Performants",
        description: "Équipements d'alimentation ininterrompue professionnels avec régulation automatique de tension.",
        benefit: "Maintient les systèmes de sécurité en ligne sans interruption même en cas de panne de courant totale."
      },
      "nobreaks": {
        title: "Onduleurs à Onde Sinusoïdale Pure",
        description: "UPS avec sortie d'onde sinusoïdale pure de haute précision, essentielle pour proteger les serveurs sensibles.",
        benefit: "Courant électrique propre et stable, prolongeant la durée de vie des appareils électroniques haut de gamme."
      },
      "baterias": {
        title: "Batteries AGM à Décharge Lente",
        description: "Batteries scellées sans entretien avec technologie à décharge lente pour une grande fiabilité.",
        benefit: "Haute durabilité opérationnelle et autonomie électrique prolongée en cas d'urgence."
      },
      "sistemas de alimentação ininterrupta": {
        title: "Systèmes d'Énergie Secourue",
        description: "Unités de gestion d'énergie redondantes complètes intégrées dans des armoires de commande.",
        benefit: "Empêche les déclenchements de disjoncteurs ou les coupures de courant d'éteindre les caméras ou les systèmes critiques."
      },
      "proteção elétrica": {
        title: "Limiteurs de Surtension (SPD)",
        description: "Dispositifs conçus pour protéger contre les pics de tension causés par la foudre ou les décharges réseau.",
        benefit: "Empêche de griller le matériel électronique coûteux en déviant la tension excessive vers la terre."
      },
      "estabilizadores": {
        title: "Régulateurs de Tension Automatiques",
        description: "Équipements corrigeant dynamiquement les petites fluctuations de tension du réseau électrique.",
        benefit: "Livraison constante de la tension correcte, maintenant le fonctionnement stable des réseaux informatiques."
      },
      "soluções para racks": {
        title: "Onduleurs et PDU Rackables",
        description: "Unités d'onduleurs conçues spécifiquement au format 19 pouces pour une intégration propre dans les baies réseau.",
        benefit: "Organisation exemplaire, facilité de gestion et meilleure dissipation de la chaleur."
      },
      "energia de suporte para CCTV e redes": {
        title: "Alimentation de Secours Dédiée",
        description: "Alimentations avec batterie de secours intégrée pour alimenter les caméras IP et les commutateurs PoE.",
        benefit: "Garante l'enregistrement des images même si un intrus coupe le disjoncteur principal à l'extérieur."
      },
      // SERRALHARIA
      "portões metálicos": {
        title: "Portails Métalliques sur Mesure",
        description: "Portails fabriqués en fer ou en acier inoxydable selon un plan technique personnalisé pour les clôtures extérieures.",
        benefit: "Barrière physique extrêmement robuste et adaptée visuellement au design architectural."
      },
      "grades de proteção": {
        title: "Grilles et Barres de Sécurité",
        description: "Grilles fixes ou extensibles en fer galvanisé pour la protection des fenêtres et des devantures de magasins.",
        benefit: "Empêche l'effraction physique par les fenêtres vitrées ou les portes de bâtiments commerciaux ou résidentiels."
      },
      "estruturas em ferro": {
        title: "Structures en Fer Galvanisé",
        description: "Structures de support, cadres et supports techniques soudés et traités avec un revêtement antirouille.",
        benefit: "Support mécanique robuste avec une excellente résistance structurelle et une grande durabilité en extérieur."
      },
      "estruturas em inox": {
        title: "Structures en Inox Premium",
        description: "Garde-corps, supports et finitions nobles en acier inoxydable brossé ou poli.",
        benefit: "Design sophistiqué, insensible à la corrosion saline, idéal pour les zones côtières."
      },
      "corrimãos": {
        title: "Main-courantes Métalliques",
        description: "Structures métalliques de sécurité sur mesure pour les escaliers et les garde-corps de balcons.",
        benefit: "Circulation sûre des personnes et conformité avec les réglementations de génie civil."
      },
      "proteções metálicas": {
        title: "Plaques et Boucliers de Renfort",
        description: "Revêtements en plaques métalliques contre le vandalisme et l'usure abrasive sévère.",
        benefit: "Augmentation considérable de la durabilité physique des points d'accès."
      },
      "acabamentos técnicos": {
        title: "Traitement de Surface et Peinture",
        description: "Decapage, métallisation et thermolaquage des pièces en fer et en acier.",
        benefit: "Finition visuelle premium de haut niveau et durabilité sans rouille pendant des décennies."
      },
      "soluções personalizadas": {
        title: "Projets de Métallerie Spécifiques",
        description: "Projets spéciaux de métallerie conçus et fabriqués pour des usages spécifiques du client.",
        benefit: "Ajustement physique parfait dans l'agencement de votre bâtiment."
      },
      // TELECOMMUNICAÇÕES
      "pontos de comunicação": {
        title: "Prises Murales Télécom",
        description: "Prises de signal coaxial et RJ45 installées dans les endroits clés des maisons ou des bureaux.",
        benefit: "Praticité et organisation lors de l'accès aux services de télévision, de voix et de données locales."
      },
      "infraestrutura de telecomunicações": {
        title: "Câblage Structuré et Conduits (ITED)",
        description: "Boîtes de dérivation et conduits structurés selon les réglementations télécoms locales.",
        benefit: "Facilité de maintenance technique et ouverture totale pour installer de nouveaux fournisseurs télécoms."
      },
      "antenas": {
        title: "Systèmes d'Antennes et Récepteurs",
        description: "Antennes terrestres numériques (TNT) et paraboles satellites avec amplificateurs de signal professionnels.",
        benefit: "Signal TV clair et net, sans interférence ni bruit dans toutes les prises du bâtiment."
      },
      "equipamentos de comunicação": {
        title: "Interphones Vidéo IP & Panneaux",
        description: "Unités de signalisation centrale pour les systèmes de portiers vidéo analogiques, mixtes ou IP haute définition.",
        benefit: "Permet une communication directe avec l'accueil ou via une application mobile de manière stable."
      },
      "interligação de sistemas": {
        title: "Intégration Technique Multi-systèmes",
        description: "Câblage et configurations de convertisseurs de signaux pour connecter les interphones aux systèmes de CCTV.",
        benefit: "Visualisation rapide de qui appelle sur les moniteurs de la maison ou les écrans des caméras."
      },
      "organização técnica": {
        title: "Boîtiers de Distribution Télécom",
        description: "Boîtes de distribution structurées pour télécom résidentiel organisées de manière propre.",
        benefit: "Dépannage rapide et esthétique parfaite à l'arrière du bâtiment."
      },
      "suporte para sistemas integrados": {
        title: "Infrastructure Télécom Intégrée",
        description: "Installation de répartiteurs, de mélangeurs de signaux et de répéteurs de signaux RF.",
        benefit: "Signal fort dans tous les recoins et prises de la propriété."
      },
      // NETWORKS
      "cabeamento estruturado": {
        title: "Câblage Structuré CAT6/Fibre",
        description: "Installation de câbles blindés de catégorie 6 à paires torsadées ou en fibre optique pour la transmission de données à haut débit.",
        benefit: "Stabilité totale sans perte de bande passante et immunité aux interférences électriques."
      },
      "racks": {
        title: "Armoires et Baies Réseau",
        description: "Armoires métalliques ventilées de 19 pouces conçues pour organiser les commutateurs, les bandeaux de brassage et les serveurs.",
        benefit: "Centralisation, excellent refroidissement des équipements actifs et facilité d'intervention technique."
      },
      "switches": {
        title: "Commutateurs PoE Administrables",
        description: "Périphériques réseau distribuant des données et de l'énergie électrique (Power over Ethernet) directement sur les câbles réseau.",
        benefit: "Élimine le besoin d'alimentations individuelles et de prises électriques à proximité des caméras IP."
      },
      "routers": {
        title: "Routeurs Haute Performance",
        description: "Périphériques réseau de passerelle pour gérer la connexion internet et le trafic réseau interne.",
        benefit: "Contrôle avancé de l'accès au réseau avec des pare-feux actifs et routage de sous-réseau dédié (VLAN)."
      },
      "patch panels": {
        title: "Bandeaux de Brassage",
        description: "Panneaux de raccordement mécanique RJ45 pour les câbles de données organisés à l'intérieur de la baie.",
        benefit: "Évite les dommages directs au câblage interne du bâtiment lors des changements de câbles dans l'armoire."
      },
      "pontos de rede": {
        title: "Prises RJ45 Certifiées",
        description: "Prises murales blindées de haut niveau technique pour des connexions rapides d'ordinateurs et de caméras.",
        benefit: "Connexion mécanique parfaite, exempte d'interférences réseau et de pertes de paquets de signaux."
      },
      "Wi-Fi profissional": {
        title: "Points d'Accès Wi-Fi Mesh",
        description: "Antennes de plafond professionnelles intégrées dans un réseau Mesh à itinérance rapide pour un signal stable.",
        benefit: "Signal Wi-Fi constant et uniforme sans coupure lors du déplacement d'une pièce à l'autre du bâtiment."
      },
      "organização de cabos": {
        title: "Organisateurs de Câbles",
        description: "Accessoires de baie verticaux et horizontaux conçus pour masquer et ordonner les cordons de brassage.",
        benefit: "Disposition visuelle impeccable de l'armoire, facile à lire et simple à dépanner."
      },
      "infraestrutura para CCTV e sistemas técnicos": {
        title: "Réseau de Sécurité Dédié",
        description: "Configuration logique de VLAN dédiés exclusivement au trafic des caméras de sécurité et des enregistreurs.",
        benefit: "Prévient l'encombrement du réseau normal et apporte une sécurité informatique accrue."
      }
    }
  }
};

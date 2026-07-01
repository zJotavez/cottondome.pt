export interface ServiceDetails {
  id: string;
  slug: string;
  title: string;
  slogan: string;
  shortDescription: string;
  description: string;
  iconName: string;
  image: string;
  products: string[];
  benefits: string[];
  seoTitle: string;
  seoDescription: string;
  galleryImages?: string[];
}

export const SERVICES_DATA: ServiceDetails[] = [
  {
    id: "cctv",
    slug: "cctv-videovigilancia",
    title: "CCTV / Videovigilância Profissional",
    slogan: "Vigilância inteligente 24/7 com câmeras de alta definição e IA para proteger o que mais importa.",
    shortDescription: "Câmeras IP e analógicas HD com inteligência artificial, gravação contínua e monitorização remota em tempo real via app.",
    description: "A Cotton Dome LDA projeta e instala sistemas de videovigilância (CCTV) profissionais com câmeras IP e analógicas de alta definição que incorporam inteligência artificial para deteção precisa de pessoas e veículos. Cada projeto é desenhado à medida do espaço: residências, condomínios, escritórios, comércio e indústria. Monitorize o seu espaço de qualquer ponto do mundo em tempo real, com gravação segura e redundante, alertas automáticos por movimento e acesso via smartphone ou tablet.",
    iconName: "Camera",
    image: "/images/cctv-hero.png",
    products: [
      "câmeras IP",
      "câmeras analógicas",
      "câmeras dome",
      "câmeras bullet",
      "gravadores DVR",
      "gravadores NVR",
      "discos de gravação",
      "fontes de alimentação",
      "cablagem",
      "acesso remoto por aplicação"
    ],
    benefits: [
      "monitorização em tempo real 24/7",
      "gravação contínua e segura",
      "acesso remoto via smartphone",
      "deteção inteligente de pessoas e veículos",
      "prevenção e dissuasão de intrusões",
      "mais segurança para pessoas e património"
    ],
    seoTitle: "CCTV e Videovigilância Profissional | Cotton Dome LDA",
    seoDescription: "Sistemas profissionais de CCTV e videovigilância com câmeras IP HD e IA para residências, empresas e condomínios. Monitorização remota 24/7.",
    galleryImages: [
      "/images/cctv-1.png",
      "/images/cctv-2.png",
      "/images/cctv-3.png"
    ]
  },
  {
    id: "intrusao",
    slug: "intrusao-sistemas-alarme",
    title: "Sistemas de Alarme e Intrusão",
    slogan: "Proteção inteligente contra invasões com alertas instantâneos e resposta imediata no seu telemóvel.",
    shortDescription: "Centrais de alarme conectadas, sensores de movimento avançados, sirenes de alto impacto e proteção perimetral 24/7.",
    description: "Os nossos sistemas de alarme e deteção de intrusão criam uma barreira de segurança ativa e inteligente em torno do seu espaço. Utilizamos centrais avançadas com ou sem fios, detetores de movimento PIR imunes a animais de estimação, sensores magnéticos para portas e janelas, e proteção perimetral exterior com barreiras infravermelhas. Em caso de intrusão, o alerta chega imediatamente ao seu telemóvel — podendo também ser ligado a uma central de monitorização profissional com despacho de segurança.",
    iconName: "ShieldAlert",
    image: "/images/alarme-hero.png",
    products: [
      "centrais de alarme",
      "sensores de movimento",
      "sensores magnéticos",
      "sensores perimetrais",
      "sirenes",
      "teclados de alarme",
      "comandos",
      "módulos GSM ou Wi-Fi",
      "detectores internos e externos"
    ],
    benefits: [
      "proteção contra invasões",
      "alerta imediato",
      "segurança perimetral",
      "integração com outros sistemas",
      "maior tranquilidade",
      "controlo do ambiente protegido"
    ],
    seoTitle: "Sistemas de Alarme e Intrusão | Cotton Dome LDA",
    seoDescription: "Alarmes e deteção contra intrusão para habitações e espaços comerciais. Sensores, centrais e sirenes de alta qualidade.",
    galleryImages: [
      "/images/alarme-intrusao-1.png",
      "/images/alarme-intrusao-2.png",
      "/images/alarme-intrusao-3.png"
    ]
  },
  {
    id: "acessos",
    slug: "controlo-de-acessos",
    title: "Controlo de Acessos",
    slogan: "Segurança máxima em cada entrada: apenas pessoas autorizadas acedem ao seu espaço.",
    shortDescription: "Biometria, reconhecimento facial, RFID e fechaduras eletrónicas para controlo total de acessos em empresas e condomínios.",
    description: "A Cotton Dome LDA fornece e instala sistemas avançados de controlo de acessos para residências, empresas, condomínios e indústrias. Controle quem entra, quando e por onde — com tecnologias de ponta como reconhecimento facial em frações de segundo, leitores biométricos de impressão digital, cartões e tags RFID, teclados numéricos e fechaduras eletrónicas. Todos os acessos ficam registados em tempo real, com histórico completo e integração com sistemas de CCTV e alarme para segurança total.",
    iconName: "Fingerprint",
    image: "/images/controlo-acessos-hero.png",
    products: [
      "leitores de cartão",
      "tags",
      "teclados numéricos",
      "biometria",
      "reconhecimento facial",
      "fechaduras elétricas",
      "botões de acesso",
      "controladores de acesso",
      "torniquetes",
      "software de gestão de utilizadores"
    ],
    benefits: [
      "maior controlo de entradas",
      "gestão de permissões",
      "redução de acessos não autorizados",
      "mais segurança para empresas e condomínios",
      "histórico de acessos",
      "integração com CCTV e alarmes"
    ],
    seoTitle: "Controlo de Acessos | Cotton Dome LDA",
    seoDescription: "Sistemas de controlo de acessos por cartões, tags, biometria ou reconhecimento facial em escritórios, armazéns e condomínios.",
    galleryImages: [
      "/images/controlo-acessos-1.png",
      "/images/controlo-acessos-2.png",
      "/images/controlo-acessos-3.png"
    ]
  },
  {
    id: "incendio",
    slug: "detecao-de-incendio",
    title: "Sistemas de Deteção de Incêndio",
    slogan: "Prevenção, alerta e segurança para proteger pessoas, espaços e património.",
    shortDescription: "Sistemas de deteção e alerta para prevenção, segurança e resposta rápida em situações de incêndio.",
    description: "Os sistemas de deteção de incêndio são essenciais para ambientes comerciais, industriais, residenciais coletivos e institucionais. A Cotton Dome LDA trabalha com soluções de deteção e alerta que permitem identificar sinais de incêndio e acionar respostas rápidas em situações de risco.",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    products: [
      "centrais de incêndio",
      "detetores de fumo",
      "detetores térmicos",
      "botões manuais de alarme",
      "sirenes",
      "sinalizadores",
      "módulos de controlo",
      "sistemas de evacuação",
      "cablagem técnica"
    ],
    benefits: [
      "deteção rápida de risco",
      "alerta imediato",
      "proteção de vidas",
      "proteção de património",
      "maior segurança operacional",
      "adequação a ambientes profissionais"
    ],
    seoTitle: "Sistemas de Deteção de Incêndio | Cotton Dome LDA",
    seoDescription: "Instalação e manutenção de centrais de deteção de incêndio, detetores de fumo e sistemas de alarme contra fogo.",
    galleryImages: [
      "/images/deteccao-incendio-1.png",
      "/images/deteccao-incendio-2.png",
      "/images/deteccao-incendio-3.png"
    ]
  },
  {
    id: "automatismos",
    slug: "automatismos",
    title: "Automatismos para Portões e Acessos",
    slogan: "Mais conforto, segurança e eficiência no controlo dos seus acessos.",
    shortDescription: "Automação de portões, barreiras e acessos para mais conforto, segurança e eficiência.",
    description: "A Cotton Dome LDA instala soluções de automatização para portões, barreiras, portas e sistemas de acesso. Os automatismos permitem abertura e fecho automático com segurança, praticidade e controlo, sendo ideais para residências, condomínios, empresas e espaços industriais.",
    iconName: "Cpu",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    products: [
      "motores para portões de correr",
      "motores para portões de batente",
      "barreiras automáticas",
      "comandos",
      "fotocélulas",
      "centrais de comando",
      "sensores de segurança",
      "acessórios de automação",
      "sistemas de abertura remota"
    ],
    benefits: [
      "mais conforto no dia a dia",
      "controlo seguro de acessos",
      "valorização do imóvel",
      "redução de esforço manual",
      "integração com controlo de acessos",
      "maior segurança em entradas e saídas"
    ],
    seoTitle: "Automatismos para Portões e Acessos | Cotton Dome LDA",
    seoDescription: "Automatize os seus portões de correr ou bater e barreiras de parque. Motores de alto rendimento com comandos seguros.",
    galleryImages: [
      "/images/automatismos-1.png",
      "/images/automatismos-2.png",
      "/images/automatismos-3.png"
    ]
  },
  {
    id: "portas-portoes",
    slug: "portas-seguranca-portoes-seccionados",
    title: "Portas de Segurança e Portões Seccionados",
    slogan: "Soluções resistentes, modernas e seguras para proteger os seus acessos.",
    shortDescription: "Soluções resistentes e modernas para acessos residenciais, comerciais e industriais.",
    description: "A Cotton Dome LDA trabalha com portas de segurança e portões seccionados para ambientes residenciais, comerciais e industriais. Estas soluções combinam resistência, funcionalidade, estética e proteção, podendo ser integradas a automatismos e sistemas de controlo de acesso.",
    iconName: "DoorClosed",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    products: [
      "portas de segurança",
      "portões seccionados",
      "portões industriais",
      "portas automáticas",
      "fechaduras reforçadas",
      "sistemas de automação",
      "acessórios de segurança",
      "estruturas de acesso"
    ],
    benefits: [
      "reforço da segurança",
      "melhor controlo de acesso",
      "resistência e durabilidade",
      "estética moderna",
      "integração com automatismos",
      "soluções para diferentes ambientes"
    ],
    seoTitle: "Portas de Segurança e Portões Seccionados | Cotton Dome LDA",
    seoDescription: "Instalação de portas blindadas de alta segurança e portões seccionados térmicos para garagens e instalações industriais.",
    galleryImages: [
      "/images/portas-portoes-1.png",
      "/images/portas-portoes-2.png",
      "/images/portas-portoes-3.png"
    ]
  },
  {
    id: "ups",
    slug: "ups-sistemas-energia",
    title: "UPS e Sistemas de Energia de Backup",
    slogan: "Proteja os seus equipamentos contra falhas, oscilações e interrupções elétricas.",
    shortDescription: "Energia de backup para manter equipamentos críticos protegidos contra falhas elétricas.",
    description: "Os sistemas UPS garantem energia de backup para equipamentos críticos, como câmeras, servidores, redes, alarmes e sistemas de segurança. A Cotton Dome LDA oferece soluções que ajudam a manter os sistemas essenciais em funcionamento mesmo em situações de instabilidade elétrica.",
    iconName: "BatteryCharging",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    products: [
      "UPS",
      "nobreaks",
      "baterias",
      "sistemas de alimentação ininterrupta",
      "proteção elétrica",
      "estabilizadores",
      "soluções para racks",
      "energia de suporte para CCTV e redes"
    ],
    benefits: [
      "continuidade dos sistemas",
      "proteção contra falhas elétricas",
      "redução de riscos de perda de dados",
      "proteção de equipamentos",
      "mais estabilidade operacional",
      "suporte a sistemas críticos"
    ],
    seoTitle: "UPS e Sistemas de Energia de Backup | Cotton Dome LDA",
    seoDescription: "Sistemas de alimentação ininterrupta UPS profissionais para racks de redes, CCTV e servidores corporativos.",
    galleryImages: [
      "/images/ups-1.png",
      "/images/ups-2.png",
      "/images/ups-3.png"
    ]
  },
  {
    id: "serralharia",
    slug: "serralharia-ferro-inox",
    title: "Serralharia em Ferro e Inox",
    slogan: "Soluções metálicas resistentes, funcionais e adaptadas ao seu projeto.",
    shortDescription: "Estruturas metálicas, grades, portões e soluções sob medida em ferro e inox.",
    description: "A Cotton Dome LDA desenvolve soluções em serralharia para ferro e inox, incluindo portões, grades, estruturas metálicas, proteções e acabamentos personalizados. O serviço é ideal para reforçar a segurança, melhorar acessos e criar estruturas sob medida para diferentes necessidades.",
    iconName: "Hammer",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    products: [
      "portões metálicos",
      "grades de proteção",
      "estruturas em ferro",
      "estruturas em inox",
      "corrimãos",
      "proteções metálicas",
      "acabamentos técnicos",
      "soluções personalizadas"
    ],
    benefits: [
      "maior resistência",
      "segurança reforçada",
      "soluções sob medida",
      "durabilidade",
      "acabamento profissional",
      "integração com portões e automatismos"
    ],
    seoTitle: "Serralharia em Ferro e Inox | Cotton Dome LDA",
    seoDescription: "Fabricação e montagem de portões metálicos, grades de proteção e serralharia por medida em ferro e aço inoxidável.",
    galleryImages: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590486803833-ffc6de08d6f9?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "telecomunicacoes",
    slug: "telecomunicacoes",
    title: "Telecomunicações",
    slogan: "Infraestrutura técnica para comunicação, conectividade e integração de sistemas.",
    shortDescription: "Infraestrutura técnica para comunicação, integração de sistemas e conectividade profissional.",
    description: "A Cotton Dome LDA oferece soluções em telecomunicações para apoiar sistemas de segurança, redes, comunicação e infraestrutura técnica. O serviço permite criar ambientes mais conectados, organizados e preparados para operações modernas.",
    iconName: "Radio",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    products: [
      "cablagem técnica",
      "pontos de comunicação",
      "infraestrutura de telecomunicações",
      "antenas",
      "equipamentos de comunicação",
      "interligação de sistemas",
      "organização técnica",
      "suporte para sistemas integrados"
    ],
    benefits: [
      "melhor conectividade",
      "comunicação mais eficiente",
      "suporte a sistemas de segurança",
      "infraestrutura organizada",
      "integração entre equipamentos",
      "preparação para ambientes modernos"
    ],
    seoTitle: "Telecomunicações e Intercomunicação | Cotton Dome LDA",
    seoDescription: "Instalação de intercomunicadores, videoporteiros IP e infraestrutura para comunicação corporativa e residencial.",
    galleryImages: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "redes",
    slug: "redes-network-solutions",
    title: "Redes e Network Solutions",
    slogan: "Infraestrutura de rede profissional para segurança, comunicação e alta performance.",
    shortDescription: "Cabeamento estruturado, racks, switches, Wi-Fi profissional e infraestrutura de rede.",
    description: "A Cotton Dome LDA desenvolve soluções de rede para residências, empresas, condomínios, lojas e ambientes industriais. Uma rede bem estruturada é essencial para o funcionamento de sistemas de segurança, videovigilância, controlo de acessos, internet, comunicação e equipamentos conectados.",
    iconName: "Network",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    products: [
      "cabeamento estruturado",
      "racks",
      "switches",
      "routers",
      "patch panels",
      "pontos de rede",
      "Wi-Fi profissional",
      "organização de cabos",
      "infraestrutura para CCTV e sistemas técnicos"
    ],
    benefits: [
      "melhor desempenho da rede",
      "maior estabilidade",
      "suporte a câmeras e sistemas de segurança",
      "organização técnica",
      "expansão futura facilitada",
      "conectividade profissional"
    ],
    seoTitle: "Redes e Network Solutions | Cotton Dome LDA",
    seoDescription: "Desenvolvimento de redes estruturadas, racks integrados, switches PoE e redes Wi-Fi empresariais estáveis.",
    galleryImages: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

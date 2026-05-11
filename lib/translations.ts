export type Locale = "en" | "pt"

const translations = {
  en: {
    hero: {
      industryLabel: "I represent",
      industries: {
        restaurant: "Restaurants",
        clinic: "Clinics",
        auto: "Car Dealerships",
      },
      content: {
        restaurant: {
          h1: "Your restaurant will stop losing",
          emph: "calls",
          tail: "and guests",
          sub: "Emily answers inbound calls 24/7, takes table reservations, handles menu questions and integrates with your POS system. No breaks, no weekends, no bad moods.",
          confirm: { label: "Reservation confirmed", title: "Andrew, 6 guests · 8:00 PM", sub: "Sat, 14 Jun · window table", system: "OpenTable" },
          stat: "+27%", statLabel: "more bookings",
        },
        clinic: {
          h1: "Your clinic will stop losing",
          emph: "patients",
          tail: "due to missed calls",
          sub: "Emily answers calls 24/7, books appointments, sends reminders and works with any medical system. No queues, no waiting, no human errors.",
          confirm: { label: "Appointment booked", title: "Johnson A., 6:30 PM", sub: "GP · Room 4", system: "MedSystem" },
          stat: "+27%", statLabel: "appointments/month",
        },
        auto: {
          h1: "Your dealership will stop missing",
          emph: "hot leads",
          tail: "over the phone",
          sub: "Emily answers calls 24/7, books test drives and service, answers questions about models and stock. Every call lands in your CRM.",
          confirm: { label: "Test drive booked", title: "Model Y 2025 · 7:30 PM", sub: "Manager: John", system: "HubSpot" },
          stat: "+27%", statLabel: "more sales",
        },
      },
      stats: [
        { v: "2.4M", l: "calls handled" },
        { v: "<1s", l: "avg response time" },
        { v: "380+", l: "clients in Europe" },
      ],
      liveLine: "On the line now",
      duration: "Duration 00:34 · Lisbon",
      synced: "Synced",
      btnExpert: "Talk to an expert",
      btnListen: "Listen to a call",
    },

    trust: {
      label: "Trusted by restaurants, clinics and chains across Europe",
      logos: ["Tasca da Esquina", "Bovino", "Alma", "Time Out Market", "Luz Saúde", "BMW Quer", "Bellissimo", "Casa da Comida"],
    },

    problems: {
      eyebrow: "The Problem",
      h2: "What every missed call costs you",
      sub: "These numbers are about your business. Calculate yours with the tool below.",
      items: [
        { stat: "30%", unit: "of calls", text: "are lost during peak hours and after hours. The customer calls a competitor within 30 seconds." },
        { stat: "1 in 4", unit: "customers", text: "won't return after a bad phone experience. Long waits, rudeness, errors." },
        { stat: "€0", unit: "tracked", text: "most businesses don't count how much they lose on missed calls. So they keep losing." },
      ],
    },

    features: {
      eyebrow: "Capabilities",
      h2: "What Emily can do",
      sub: "Not just an answering machine. A full-featured administrator with memory, context and access to your systems.",
      items: [
        { tag: "Reservations", title: "Takes bookings 24/7", text: "Finds a table by guest count, time and preferences. Instantly updates your POS system." },
        { tag: "Menu", title: "Answers menu questions", text: "Knows all dishes, ingredients, allergens, off-menu items. Can recommend wine with a steak." },
        { tag: "Languages", title: "Speaks 12 languages", text: "Switches between English, Portuguese and other languages in a single call. Handles any accent." },
        { tag: "Escalation", title: "Transfers complex calls", text: "Complaints, events, special requests — transfers to manager with a brief handoff summary." },
        { tag: "CRM", title: "Out-of-the-box integrations", text: "OpenTable, Reservio, HubSpot, Salesforce, Zoho. Setup in under an hour." },
        { tag: "Analytics", title: "Transcriptions & metrics", text: "Full recordings and transcripts of every call. See what customers ask and where leads drop off." },
      ],
    },

    howItWorks: {
      eyebrow: "Process",
      h2: "How it works",
      sub: "From the first ring to a confirmed booking — under a minute. No staff required.",
      steps: [
        { n: "01", title: "Guest calls", text: "Your regular number. Emily picks up on the first ring — day, night, on holidays." },
        { n: "02", title: "Emily listens", text: "Understands the need: make a reservation, check opening hours, ask about the kids' menu." },
        { n: "03", title: "Checks the system", text: "Available tables, today's menu, event deposits — all in real time." },
        { n: "04", title: "Confirms to the guest", text: "Reads out the details, sends a confirmation SMS. You see the booking in your dashboard." },
      ],
    },

    cases: {
      eyebrow: "Case Studies",
      h2: "Client results",
      sub: "Real numbers from restaurants, clinics and dealerships after 90 days with Emily.",
    },

    comparison: {
      eyebrow: "Comparison",
      h2: "Why not just hire a receptionist or call centre?",
      sub: "An honest comparison. No marketing spin.",
      cols: ["Emily", "Receptionist", "Call Centre"],
      recommended: "Recommended",
      partial: "partial",
      rows: [
        { metric: "24/7 availability",           values: ["always", "no", "limited"] },
        { metric: "Response time",               values: ["1 sec", "30–120 sec", "60–300 sec"] },
        { metric: "Parallel calls",              values: ["∞", "1", "10–20"] },
        { metric: "Multilingual",                values: ["12 languages", "1–2", "1–2"] },
        { metric: "Menu / service knowledge",    values: ["always", "limited", "no"] },
        { metric: "CRM integration",             values: ["always", "limited", "limited"] },
        { metric: "Call transcripts",            values: ["always", "no", "limited"] },
        { metric: "Never sick, never quits",     values: ["always", "no", "limited"] },
      ],
    },

    faq: {
      eyebrow: "FAQ",
      h2: "Frequently asked questions",
      items: [
        { q: "How much does it cost?", a: "Pricing depends on your call volume and required integrations. Rather than showing an average, we prepare a personalised quote after a short call. It includes your current loss from missed calls, Emily's cost, and your expected ROI. Average payback period: 2–4 months." },
        { q: "Will guests know they're talking to a robot?", a: "Emily's voice is very close to human — most guests don't notice. But by default we set up an honest introduction: 'Hello, this is the restaurant's voice assistant.' This builds trust and avoids disappointment." },
        { q: "How does integration with your POS system work?", a: "We connect via official APIs. A booking in Emily = a booking in the system. The table is automatically blocked and released upon cancellation. Setup takes 1–2 business days." },
        { q: "What if there are no tables available?", a: "Emily suggests alternative times or dates, adds to a waiting list, or transfers to a manager for a custom solution. She never says 'no' and never hangs up." },
        { q: "What if a guest wants to speak to a human?", a: "Emily instantly transfers the call to a receptionist or manager with a brief summary of the conversation. No 'please start over'." },
        { q: "How many calls can she handle at once?", a: "Technically — unlimited. If 100 guests call in one minute, she answers all 100. In practice we provision 10× your typical traffic." },
        { q: "Can I just have a chat first?", a: "Yes. A one-hour call, we review your processes and prepare an estimate for your business. No commitments, no sales pressure." },
      ],
    },

    cta: {
      h2: "Get your personalised estimate in 15 minutes",
      sub: "We'll show you how much you're losing and how much you can recover. No slide decks, no sales pitch — just numbers for your business.",
      stats: [
        { v: "15 min", l: "estimate" },
        { v: "14 days", l: "free trial" },
        { v: "2–4 mo", l: "avg ROI" },
      ],
      successTitle: "Request sent",
      successSub: "Emily will call you within 15 minutes.",
      namePlaceholder: "Your name",
      phonePlaceholder: "+351 ___ ___ ___",
      companyPlaceholder: "Business name",
      btnSubmit: "Get estimate →",
      btnLoading: "Sending...",
      note: "We'll call within 15 minutes during business hours. Estimate sent by email.",
      errorDefault: "Something went wrong. Please try again.",
    },

    footer: {
      desc: "AI voice administrator for offline businesses. Takes calls, books reservations, integrates with your systems.",
      phone: null,
      email: "hello@callemily.eu",
      cols: [
        { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "/price" }, { label: "Security", href: "#" }, { label: "Integrations", href: "#" }] },
        { title: "Industries", links: [{ label: "Restaurants", href: "#" }, { label: "Clinics", href: "#" }, { label: "Car Dealerships", href: "#" }, { label: "Beauty Salons", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Privacy", href: "/privacy" }, { label: "Contact", href: "#cta" }] },
      ],
      copy: "© 2026 CallEmily.",
      privacyLabel: "Privacy Policy",
      madeIn: "Made in Europe",
    },

    nav: {
      items: [
        { id: "problems", label: "Problems",     url: "/#problems" },
        { id: "features", label: "Features",     url: "/#features" },
        { id: "how",      label: "How it works", url: "/#how" },
        { id: "cases",    label: "Case Studies", url: "/#cases" },
        { id: "price",    label: "Pricing",      url: "/price" },
      ],
      cta: "Get pricing",
      menuLabel: "Menu",
    },

    cookie: {
      title: "Cookie usage",
      text: "We use cookies to improve your experience. See our",
      privacyLink: "Privacy Policy",
      textAfter: ". By continuing to use the site, you consent to cookies.",
      accept: "Accept",
      decline: "Decline",
    },

    roi: {
      eyebrow: "Calculator",
      h2Part1: "How much you're losing",
      h2Part2: "right now",
      sub: "Adjust the sliders for your business — see your lost revenue and recovery potential. Emily's pricing is only in your personalised quote.",
      missedDay: "Missed per day",
      lostMonth: "Lost {unit} / month",
      lostRevenue: "Lost {valueLabel}",
      recoveredLabel: "recovered with Emily",
      recoveryNote: "Emily recovers 85% of missed calls",
      recoveryNoteSub: "on average across clients",
      btnCta: "Get your business estimate →",
      ctaNote: "Emily's price is only in your personalised quote. No sales calls.",
      currency: "€",
      locale: "en-GB",
      presets: {
        restaurant: {
          label: "Restaurant",
          callsLabel: "Inbound calls per day",
          calls: 40,
          checkLabel: "Average bill, €",
          check: 45,
          convLabel: "Call → visit conversion, %",
          conv: 65,
          missedRate: 30,
          seats: 2.5,
          valueLabel: "revenue/month",
          lostUnit: "visits",
          maxCheck: 300,
          stepCheck: 5,
        },
        clinic: {
          label: "Clinic",
          callsLabel: "Inbound calls per day",
          calls: 50,
          checkLabel: "Avg appointment fee, €",
          check: 80,
          convLabel: "Call → booking conversion, %",
          conv: 55,
          missedRate: 25,
          seats: 1.4,
          valueLabel: "revenue/month",
          lostUnit: "appointments",
          maxCheck: 500,
          stepCheck: 10,
        },
        auto: {
          label: "Car Dealership",
          callsLabel: "Inbound calls per day",
          calls: 20,
          checkLabel: "Margin per deal, €",
          check: 2500,
          convLabel: "Lead → deal conversion, %",
          conv: 8,
          missedRate: 35,
          seats: 1,
          valueLabel: "margin/month",
          lostUnit: "deals",
          maxCheck: 15000,
          stepCheck: 250,
        },
      },
    },
  },

  // ─── PORTUGUESE ───────────────────────────────────────────────────────────
  pt: {
    hero: {
      industryLabel: "Eu represento",
      industries: {
        restaurant: "Restaurantes",
        clinic: "Clínicas",
        auto: "Concessionárias",
      },
      content: {
        restaurant: {
          h1: "O seu restaurante vai parar de perder",
          emph: "chamadas",
          tail: "e clientes",
          sub: "Emily atende chamadas 24/7, faz reservas, responde sobre o menu e integra com o seu sistema de gestão. Sem pausas, sem fins de semana, sem mau humor.",
          confirm: { label: "Reserva confirmada", title: "André, 6 pessoas · 20:00", sub: "Sáb, 14 jun · mesa à janela", system: "OpenTable" },
          stat: "+27%", statLabel: "mais reservas",
        },
        clinic: {
          h1: "A sua clínica vai parar de perder",
          emph: "pacientes",
          tail: "por chamadas perdidas",
          sub: "Emily atende chamadas 24/7, marca consultas, envia lembretes e funciona com qualquer sistema médico. Sem filas, sem esperas, sem erros humanos.",
          confirm: { label: "Consulta marcada", title: "Silva A., 18:30", sub: "Clínico geral · Sala 4", system: "MedSystem" },
          stat: "+27%", statLabel: "consultas/mês",
        },
        auto: {
          h1: "A sua concessionária vai parar de perder",
          emph: "leads quentes",
          tail: "por telefone",
          sub: "Emily atende chamadas 24/7, marca test drives e serviços, responde sobre modelos e stock. Cada chamada vai para o CRM.",
          confirm: { label: "Test drive marcado", title: "Model Y 2025 · 19:30", sub: "Gestor: João", system: "HubSpot" },
          stat: "+27%", statLabel: "mais vendas",
        },
      },
      stats: [
        { v: "2,4M", l: "chamadas tratadas" },
        { v: "<1s", l: "tempo médio de resposta" },
        { v: "380+", l: "clientes na Europa" },
      ],
      liveLine: "Em linha agora",
      duration: "Duração 00:34 · Lisboa",
      synced: "Sincronizado",
      btnExpert: "Falar com um especialista",
      btnListen: "Ouvir uma chamada",
    },

    trust: {
      label: "Empresas que confiam em nós em toda a Europa",
      logos: ["Tasca da Esquina", "Bovino", "Alma", "Time Out Market", "Luz Saúde", "BMW Quer", "Bellissimo", "Casa da Comida"],
    },

    problems: {
      eyebrow: "O Problema",
      h2: "O que custa cada chamada perdida",
      sub: "Estes números são sobre o seu negócio. Calcule os seus com a ferramenta abaixo.",
      items: [
        { stat: "30%", unit: "das chamadas", text: "perdem-se durante o horário de pico e fora do horário. O cliente liga para a concorrência em 30 segundos." },
        { stat: "1 em 4", unit: "clientes", text: "não regressa após uma má experiência telefónica. Espera longa, erros, descortesia." },
        { stat: "€0", unit: "contabilizado", text: "a maioria dos negócios não conta quanto perde em chamadas perdidas. Por isso continua a perder." },
      ],
    },

    features: {
      eyebrow: "Funcionalidades",
      h2: "O que a Emily sabe fazer",
      sub: "Não é apenas um atendedor automático. É uma recepcionista completa com memória, contexto e acesso aos seus sistemas.",
      items: [
        { tag: "Reservas", title: "Aceita reservas 24/7", text: "Encontra mesa pelo número de pessoas, horário e preferências. Actualiza o sistema imediatamente." },
        { tag: "Menu", title: "Responde sobre o menu", text: "Conhece todos os pratos, ingredientes, alergénios. Pode recomendar um vinho para um bife." },
        { tag: "Idiomas", title: "Fala 12 idiomas", text: "Muda entre português, inglês e outros idiomas numa única chamada. Gere qualquer sotaque." },
        { tag: "Escalação", title: "Transfere chamadas complexas", text: "Reclamações, eventos, pedidos especiais — transfere para o gestor com um breve resumo." },
        { tag: "CRM", title: "Integrações incluídas", text: "OpenTable, Reservio, HubSpot, Salesforce, Zoho. Configuração em menos de uma hora." },
        { tag: "Análise", title: "Transcrições e métricas", text: "Gravações e transcrições de todas as chamadas. Veja o que os clientes perguntam e onde perdem interesse." },
      ],
    },

    howItWorks: {
      eyebrow: "Processo",
      h2: "Como funciona",
      sub: "Do primeiro toque à reserva confirmada — menos de um minuto. Sem necessidade de pessoal.",
      steps: [
        { n: "01", title: "O cliente liga", text: "Para o seu número habitual. Emily atende ao primeiro toque — de dia, de noite, nos feriados." },
        { n: "02", title: "Emily ouve", text: "Percebe o que precisa: fazer uma reserva, saber o horário, perguntar sobre o menu infantil." },
        { n: "03", title: "Verifica o sistema", text: "Mesas disponíveis, menu atual, depósitos para eventos — em tempo real." },
        { n: "04", title: "Confirma ao cliente", text: "Lê os detalhes, envia SMS de confirmação. Você vê a reserva no painel de controlo." },
      ],
    },

    cases: {
      eyebrow: "Casos de Sucesso",
      h2: "Resultados dos clientes",
      sub: "Números reais de restaurantes, clínicas e concessionárias após 90 dias com a Emily.",
    },

    comparison: {
      eyebrow: "Comparação",
      h2: "Por que não contratar um recepcionista ou call centre?",
      sub: "Uma comparação honesta. Sem marketing.",
      cols: ["Emily", "Recepcionista", "Call Centre"],
      recommended: "Recomendamos",
      partial: "parcial",
      rows: [
        { metric: "Disponibilidade 24/7",          values: ["always", "no", "limited"] },
        { metric: "Tempo de resposta",              values: ["1 seg", "30–120 seg", "60–300 seg"] },
        { metric: "Chamadas em paralelo",           values: ["∞", "1", "10–20"] },
        { metric: "Multilíngue",                   values: ["12 idiomas", "1–2", "1–2"] },
        { metric: "Conhecimento do menu / serviços",values: ["always", "limited", "no"] },
        { metric: "Integração com CRM",             values: ["always", "limited", "limited"] },
        { metric: "Transcrições de chamadas",       values: ["always", "no", "limited"] },
        { metric: "Nunca adoece, nunca se despede", values: ["always", "no", "limited"] },
      ],
    },

    faq: {
      eyebrow: "FAQ",
      h2: "Perguntas frequentes",
      items: [
        { q: "Quanto custa?", a: "O preço depende do volume de chamadas e das integrações necessárias. Em vez de mostrar uma média, preparamos uma proposta personalizada após uma chamada rápida. Inclui a sua perda atual com chamadas perdidas, o custo da Emily e o prazo de retorno esperado. Prazo médio: 2–4 meses." },
        { q: "Os clientes vão perceber que estão a falar com um robot?", a: "A voz da Emily é muito próxima da humana — a maioria dos clientes não nota. Mas por padrão configuramos uma apresentação honesta: 'Olá, sou o assistente de voz do restaurante.' Isto cria confiança e evita deceções." },
        { q: "Como funciona a integração com o sistema de gestão?", a: "Ligamos através de APIs oficiais. Uma reserva na Emily = uma reserva no sistema. A mesa é bloqueada automaticamente e libertada em caso de cancelamento. A configuração demora 1–2 dias úteis." },
        { q: "E se não houver mesas disponíveis?", a: "Emily sugere horários ou datas alternativos, adiciona à lista de espera, ou transfere para o gestor para uma solução personalizada. Nunca diz 'não' e nunca desliga." },
        { q: "E se o cliente quiser falar com uma pessoa?", a: "Emily transfere a chamada instantaneamente para o recepcionista ou gestor com um breve resumo da conversa. Sem 'por favor, comece de novo'." },
        { q: "Quantas chamadas pode atender ao mesmo tempo?", a: "Tecnicamente — ilimitadas. Se 100 clientes ligarem num minuto, ela atende todos os 100. Na prática, provisionamos 10× o seu tráfego habitual." },
        { q: "Posso só ter uma conversa primeiro?", a: "Sim. Uma chamada de uma hora, analisamos os seus processos e preparamos uma proposta para o seu negócio. Sem compromissos, sem pressão de vendas." },
      ],
    },

    cta: {
      h2: "Receba uma proposta personalizada em 15 minutos",
      sub: "Mostramos quanto está a perder e quanto pode recuperar. Sem apresentações, sem vendedores — apenas números para o seu negócio.",
      stats: [
        { v: "15 min", l: "para a proposta" },
        { v: "14 dias", l: "trial gratuito" },
        { v: "2–4 meses", l: "ROI médio" },
      ],
      successTitle: "Pedido enviado",
      successSub: "Emily ligará em 15 minutos.",
      namePlaceholder: "O seu nome",
      phonePlaceholder: "+351 ___ ___ ___",
      companyPlaceholder: "Nome do negócio",
      btnSubmit: "Obter proposta →",
      btnLoading: "A enviar...",
      note: "Ligamos em 15 minutos durante o horário laboral. Proposta enviada por email.",
      errorDefault: "Algo correu mal. Por favor tente novamente.",
    },

    footer: {
      desc: "Recepcionista de voz IA para negócios presenciais. Atende chamadas, faz reservas, integra com os seus sistemas.",
      phone: null,
      email: "hello@callemily.eu",
      cols: [
        { title: "Produto", links: [{ label: "Funcionalidades", href: "#features" }, { label: "Preços", href: "/price" }, { label: "Segurança", href: "#" }, { label: "Integrações", href: "#" }] },
        { title: "Sectores", links: [{ label: "Restaurantes", href: "#" }, { label: "Clínicas", href: "#" }, { label: "Concessionárias", href: "#" }, { label: "Beleza", href: "#" }] },
        { title: "Empresa", links: [{ label: "Sobre nós", href: "/about" }, { label: "Blog", href: "/blog" }, { label: "Privacidade", href: "/privacy" }, { label: "Contacto", href: "#cta" }] },
      ],
      copy: "© 2026 CallEmily.",
      privacyLabel: "Política de Privacidade",
      madeIn: "Feito na Europa",
    },

    nav: {
      items: [
        { id: "problems", label: "Problemas",       url: "/#problems" },
        { id: "features", label: "Funcionalidades", url: "/#features" },
        { id: "how",      label: "Como funciona",   url: "/#how" },
        { id: "cases",    label: "Casos",           url: "/#cases" },
        { id: "price",    label: "Preços",          url: "/price" },
      ],
      cta: "Ver preços",
      menuLabel: "Menu",
    },

    cookie: {
      title: "Utilização de cookies",
      text: "Utilizamos cookies para melhorar a sua experiência. Veja a nossa",
      privacyLink: "Política de Privacidade",
      textAfter: ". Ao continuar a usar o site, consente na utilização de cookies.",
      accept: "Aceitar",
      decline: "Recusar",
    },

    roi: {
      eyebrow: "Calculadora",
      h2Part1: "Quanto está a perder",
      h2Part2: "agora mesmo",
      sub: "Ajuste os controlos para o seu negócio — veja a receita perdida e o potencial de recuperação. O preço da Emily está apenas na proposta personalizada.",
      missedDay: "Perdidas por dia",
      lostMonth: "Perdidas {unit} / mês",
      lostRevenue: "Receita {valueLabel} perdida",
      recoveredLabel: "recuperação com Emily",
      recoveryNote: "Emily recupera 85% das chamadas perdidas",
      recoveryNoteSub: "em média entre clientes",
      btnCta: "Obter proposta para o seu negócio →",
      ctaNote: "O preço da Emily está apenas na proposta personalizada. Sem chamadas de vendas.",
      currency: "€",
      locale: "pt-PT",
      presets: {
        restaurant: {
          label: "Restaurante",
          callsLabel: "Chamadas por dia",
          calls: 40,
          checkLabel: "Factura média, €",
          check: 45,
          convLabel: "Conversão chamada → visita, %",
          conv: 65,
          missedRate: 30,
          seats: 2.5,
          valueLabel: "receita/mês",
          lostUnit: "visitas",
          maxCheck: 300,
          stepCheck: 5,
        },
        clinic: {
          label: "Clínica",
          callsLabel: "Chamadas por dia",
          calls: 50,
          checkLabel: "Consulta média, €",
          check: 80,
          convLabel: "Conversão chamada → consulta, %",
          conv: 55,
          missedRate: 25,
          seats: 1.4,
          valueLabel: "receita/mês",
          lostUnit: "consultas",
          maxCheck: 500,
          stepCheck: 10,
        },
        auto: {
          label: "Concessionária",
          callsLabel: "Chamadas por dia",
          calls: 20,
          checkLabel: "Margem por venda, €",
          check: 2500,
          convLabel: "Conversão lead → venda, %",
          conv: 8,
          missedRate: 35,
          seats: 1,
          valueLabel: "margem/mês",
          lostUnit: "vendas",
          maxCheck: 15000,
          stepCheck: 250,
        },
      },
    },
  },
} as const

export type Translations = typeof translations.en

export function t(locale: string): Translations {
  return (translations as any)[locale] ?? translations.en
}

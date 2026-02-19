/* =======================
   js/script.js (COMPLETO)
======================= */

const GITHUB_USER = "mateusvicentin";
const PER_PAGE = 3;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

let currentLang = "pt";
let typingTimer = null;

/* ✅ NOVO: fonte atual (github = Dados, infra = LinkedIn) */
let currentSource = "github"; // "github" | "infra"
let infraFiltered = null;

/* ✅ NOVO: posts Infra (LinkedIn) */
const INFRA_POSTS = [
   {
    title: "Documentação de Datacenters com Netbox",
    url: "https://www.linkedin.com/posts/mateusvicentin_datacenter-infraestrutura-networkinfrastructure-activity-7430294981564624896-NvOP",
    descPT: "Implementei toda documentação de equipamentos, cabos de links, cabos de energia, IPs, blocos, VLANs e toda Infraestrutura de conexão.",
    descEN: "I implemented complete documentation for equipment, link cabling, power cabling, IPs, IP blocks/subnets, VLANs, and the entire connectivity infrastructure.",
    date: "2026-02-20"
  },
  {
    title: "Alertas de Backup do Proxmox no Telegram",
    url: "https://www.linkedin.com/posts/mateusvicentin_proxmox-virtualizacao-backup-activity-7430005608407416833-9_1u",
    descPT: "Automatizei alertas de backup no Proxmox enviando notificações pelo Telegram com status de sucesso, falha, duração e tamanho do job.",
    descEN: "I automated Proxmox backup alerts by sending Telegram notifications with the job’s success/failure status, duration, and size.",
    date: "2026-02-19"
  },
  // Adicionar novos projetos abaixo
];

const I18N = {
  pt: {
    "logo.sub": "Engenharia de Dados & Infra",

    "nav.about": "Sobre",
    "nav.stack": "Habilidades",
    "nav.projects": "Projetos",
    "nav.journey": "Trajetória",
    "nav.contact": "Contato",
    "nav.certs": "Certificações",

    "hero.pill": "Engenharia de Dados & Infraestrutura",
    "hero.subtitle": "Pós-graduado em Engenharia de Dados (PUC Minas) e formado em Análise e Desenvolvimento de Sistemas (IFSP). Atuo como Analista de Infraestrutura, com foco em servidores, telefonia e datacenter.",
    "hero.cta.projects": "Ver projetos",
    "hero.cta.resume": "Baixar currículo",
    "hero.cta.linkedin": "Ver LinkedIn",

    "about.kicker": "Quem sou",
    "about.title": "Sobre mim",
    "about.p1": `Pós-graduado em <strong>Engenharia de Dados</strong> pela Pontifícia Universidade Católica de Minas Gerais (PUC Minas) e formado em <strong>Análise e Desenvolvimento de Sistemas</strong> pelo Instituto Federal de São Paulo (IFSP). Tenho me aprofundado na área de Engenharia de Dados com foco na construção de soluções escaláveis para coleta, processamento, modelagem e análise de dados.`,
    "about.p2": `Minha atuação envolve o desenvolvimento de <strong>pipelines de dados</strong> eficientes, utilizando processos ETL/ELT, conceitos de Big Data e arquiteturas modernas em nuvem (<strong>AWS</strong> e <strong>Azure</strong>). Nesse contexto, aplico ferramentas amplamente consolidadas no ecossistema de dados, como <strong>Apache Spark</strong>, <strong>Databricks</strong> e <strong>Apache Kafka</strong> para processamento distribuído e streaming; <strong>Apache Airflow</strong> e <strong>dbt</strong> para orquestração de fluxos e transformação de dados; além de <strong>Python</strong> e <strong>Pandas</strong> para análise e manipulação.`,
    "about.p3": `Também trabalho com bancos de dados relacionais e não relacionais, como <strong>BigQuery</strong>, <strong>Snowflake</strong>, <strong>MongoDB</strong>, <strong>DuckDB</strong>, <strong>SQL</strong> e <strong>NoSQL</strong>, garantindo a persistência, governança e disponibilidade dos dados para diferentes aplicações analíticas e operacionais.`,
    "about.p4": `Sou apaixonado por áreas como <strong>Segurança da Informação</strong>, <strong>Redes</strong>, <strong>Infraestrutura de TI</strong> e <strong>Computação em Nuvem</strong>. Atualmente, estou disponível para colaborar em projetos que envolvam engenharia de dados, com o objetivo de aplicar na prática os conhecimentos que venho adquirindo e aprofundar minhas habilidades técnicas.`,

    "skills.kicker": "Stack",
    "skills.title": "Habilidades",

    "projects.kicker": "GitHub",
    "projects.title": "Projetos",
    "projects.subtitle.prefix": "GitHub",
    "projects.search.placeholder": "Buscar projeto por nome, tecnologia ou descrição...",
    "projects.pagination.prev": "« Anterior",
    "projects.pagination.next": "Próxima »",
    "projects.pagination.page": "Página 1",

    /* ✅ NOVO (Dados / Infra) */
    "projects.source.data": "Dados",
    "projects.source.infra": "Infra",

    "journey.kicker": "Carreira",
    "journey.title": "Trajetória profissional e acadêmica",
    "journey.tabs.experience": "Experiência",
    "journey.tabs.education": "Formação",
    "journey.details": "Ver detalhes",
    "journey.subjects": "Ver disciplinas",

    "journey.exp1.role": "Analista de Infraestrutura",
    "journey.exp1.meta": "Flash Net Brasil • 2023 - Atual",
    "journey.exp1.desc": "Responsável pela infraestrutura crítica de datacenter, servidores, redes, telefonia e monitoramento.",

    "journey.exp2.role": "Analista de Infraestrutura",
    "journey.exp2.meta": "TOTVS • 2023",
    "journey.exp2.desc": "Atuação em Data Center, provisionamento de VMs, redes, firewalls e suporte corporativo.",

    "journey.exp3.role": "Analista de Qualidade",
    "journey.exp3.meta": "Flash Net Brasil • 2018 - 2023",
    "journey.exp3.desc": "Garantia de qualidade de conexão, monitoramento, documentação e atuação em SOC/LGPD.",

    "journey.edu1.title": "Pós-Graduação em Engenharia de Dados",
    "journey.edu1.meta": "PUC Minas • 2024 - 2025",
    "journey.edu1.desc": "Foco em arquitetura de dados, big data, processamento distribuído e plataformas modernas.",

    "journey.edu2.title": "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    "journey.edu2.meta": "IFSP • 2016 - 2020",
    "journey.edu2.desc": "Base sólida em desenvolvimento, banco de dados, redes, segurança e engenharia de software.",

    "certs.kicker": "Certificações",
    "certs.title": "Certificações",
    "certs.subtitle": "Trilhas e certificações em andamento e concluídas.",
    "certs.status.inprogress": "Em Andamento",
    "certs.status.done": "Concluída",

    "certs.c1.name": "Zabbix Certified User",
    "certs.c1.desc": "Certificação focada em fundamentos, itens, triggers, templates e boas práticas no ecossistema Zabbix.",
    "certs.c1.link.aria": "Abrir link da certificação",
    "certs.c1.link.title": "Abrir link",

    "certs.c2.name": "ICC-A Telefonia IP (Intelbras)",
    "certs.c2.desc": "Certificação em Telefonia IP com foco em fundamentos, configuração e boas práticas em soluções Intelbras.",
    "certs.c2.link.aria": "Abrir certificado Intelbras",
    "certs.c2.link.title": "Abrir certificado",

    "contact.kicker": "Contato",
    "contact.title": "Vamos conversar?",
    "contact.subtitle": "Aberto para colaborações, freelas e oportunidades em engenharia de dados e infraestrutura.",
    "contact.where.title": "Onde me encontrar",
    "contact.where.desc": "Escolha o canal que fizer mais sentido para o seu contexto:",
    "contact.direct.title": "Direto ao ponto",
    "contact.direct.desc": "Se preferir, pode enviar um e-mail direto com contexto técnico, stack atual e objetivo do projeto.",
    "contact.direct.cta": "Enviar e-mail",

    "dyn.loading": "Carregando...",
    "dyn.loadingRepos": "Carregando repositórios...",
    "dyn.loadFail": "Falha ao carregar",
    "dyn.loadError": "Erro ao carregar.",
    "dyn.noProjects": "Nenhum projeto encontrado.",
    "dyn.noDesc": "Sem descrição",
    "dyn.projectsCount": "{n} projeto(s)",
    "dyn.pageOf": "Página {p} de {t}",

    "aria.theme": "Alternar tema",
    "aria.lang.toEN": "Traduzir para inglês",
    "aria.lang.toPT": "Voltar para português",
    "aria.openGithub": "Abrir no GitHub"
  },

  en: {
    "logo.sub": "Data & Infrastructure",

    "nav.about": "About",
    "nav.stack": "Skills",
    "nav.projects": "Projects",
    "nav.journey": "Journey",
    "nav.contact": "Contact",
    "nav.certs": "Certifications",

    "hero.pill": "Data Engineering & Infrastructure",
    "hero.subtitle": "Postgraduate in Data Engineering (PUC Minas) and graduated in Systems Analysis and Development (IFSP). I work as an Infrastructure Analyst focused on servers, telephony, and datacenter operations.",
    "hero.cta.projects": "View projects",
    "hero.cta.resume": "Download resume",
    "hero.cta.linkedin": "Open LinkedIn",

    "about.kicker": "Who I am",
    "about.title": "About me",
    "about.p1": `Postgraduate in <strong>Data Engineering</strong> at Pontifícia Universidade Católica de Minas Gerais (PUC Minas) and graduated in <strong>Systems Analysis and Development</strong> at Instituto Federal de São Paulo (IFSP). I’ve been deepening my work in Data Engineering, focused on building scalable solutions for data collection, processing, modeling, and analysis.`,
    "about.p2": `My work includes building efficient <strong>data pipelines</strong> using ETL/ELT processes, Big Data concepts, and modern cloud architectures (<strong>AWS</strong> and <strong>Azure</strong>). I use proven tools in the data ecosystem, such as <strong>Apache Spark</strong>, <strong>Databricks</strong>, and <strong>Apache Kafka</strong> for distributed processing and streaming; <strong>Apache Airflow</strong> and <strong>dbt</strong> for orchestration and transformations; plus <strong>Python</strong> and <strong>Pandas</strong> for analysis and manipulation.`,
    "about.p3": `I also work with relational and non-relational databases such as <strong>BigQuery</strong>, <strong>Snowflake</strong>, <strong>MongoDB</strong>, <strong>DuckDB</strong>, <strong>SQL</strong>, and <strong>NoSQL</strong>, ensuring data persistence, governance, and availability for analytical and operational needs.`,
    "about.p4": `I’m passionate about <strong>Information Security</strong>, <strong>Networking</strong>, <strong>IT Infrastructure</strong>, and <strong>Cloud Computing</strong>. I’m currently open to collaborating on data engineering projects to apply what I’m learning in real scenarios and keep evolving my technical skills.`,

    "skills.kicker": "Skills",
    "skills.title": "Skills",

    "projects.kicker": "GitHub",
    "projects.title": "Projects",
    "projects.subtitle.prefix": "GitHub",
    "projects.search.placeholder": "Search projects by name, tech, or description...",
    "projects.pagination.prev": "« Previous",
    "projects.pagination.next": "Next »",
    "projects.pagination.page": "Page 1",

    /* ✅ NOVO (Dados / Infra) */
    "projects.source.data": "Data",
    "projects.source.infra": "Infra",

    "journey.kicker": "Career",
    "journey.title": "Professional & academic journey",
    "journey.tabs.experience": "Experience",
    "journey.tabs.education": "Education",
    "journey.details": "View details",
    "journey.subjects": "View subjects",

    "journey.exp1.role": "Infrastructure Analyst",
    "journey.exp1.meta": "Flash Net Brasil • 2023 - Present",
    "journey.exp1.desc": "Responsible for critical datacenter infrastructure, servers, networking, telephony, and monitoring.",

    "journey.exp2.role": "Infrastructure Analyst",
    "journey.exp2.meta": "TOTVS • 2023",
    "journey.exp2.desc": "Datacenter operations, VM provisioning, networking, firewalls, and corporate support.",

    "journey.exp3.role": "Quality Analyst",
    "journey.exp3.meta": "Flash Net Brasil • 2018 - 2023",
    "journey.exp3.desc": "Connectivity quality assurance, monitoring, documentation, and SOC/LGPD support.",

    "journey.edu1.title": "Postgraduate in Data Engineering",
    "journey.edu1.meta": "PUC Minas • 2024 - 2025",
    "journey.edu1.desc": "Focus on data architecture, big data, distributed processing, and modern platforms.",

    "journey.edu2.title": "Systems Analysis & Development (Tech Degree)",
    "journey.edu2.meta": "IFSP • 2016 - 2020",
    "journey.edu2.desc": "Solid foundation in development, databases, networking, security, and software engineering.",

    "certs.kicker": "Certifications",
    "certs.title": "Certifications",
    "certs.subtitle": "Ongoing and completed certifications and tracks.",
    "certs.status.inprogress": "In Progress",
    "certs.status.done": "Completed",

    "certs.c1.name": "Zabbix Certified User",
    "certs.c1.desc": "Certification focused on fundamentals, items, triggers, templates, and best practices in the Zabbix ecosystem.",
    "certs.c1.link.aria": "Open certification link",
    "certs.c1.link.title": "Open link",

    "certs.c2.name": "ICC-A IP Telephony (Intelbras)",
    "certs.c2.desc": "IP Telephony certification focused on fundamentals, configuration, and best practices for Intelbras solutions.",
    "certs.c2.link.aria": "Open Intelbras certificate",
    "certs.c2.link.title": "Open certificate",

    "contact.kicker": "Contact",
    "contact.title": "Let’s talk?",
    "contact.subtitle": "Open to collaborations, freelance work, and opportunities in data engineering and infrastructure.",
    "contact.where.title": "Where to find me",
    "contact.where.desc": "Choose the best channel for your context:",
    "contact.direct.title": "Straight to the point",
    "contact.direct.desc": "If you prefer, send an email with technical context, current stack, and project goals.",
    "contact.direct.cta": "Send email",

    "dyn.loading": "Loading...",
    "dyn.loadingRepos": "Loading repositories...",
    "dyn.loadFail": "Failed to load",
    "dyn.loadError": "Error while loading.",
    "dyn.noProjects": "No projects found.",
    "dyn.noDesc": "No description",
    "dyn.projectsCount": "{n} project(s)",
    "dyn.pageOf": "Page {p} of {t}",

    "aria.theme": "Toggle theme",
    "aria.lang.toEN": "Translate to English",
    "aria.lang.toPT": "Back to Portuguese",
    "aria.openGithub": "Open on GitHub"
  }
};

function t(key, vars = {}) {
  const str = (I18N[currentLang] && I18N[currentLang][key]) || key;
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "pt";

  const root = document.documentElement;
  root.setAttribute("data-lang", currentLang);
  root.setAttribute("lang", currentLang === "en" ? "en" : "pt-BR");

  $$("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  $$("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = t(key);
  });

  $$("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", t(key));
  });

  $$("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", t(key));
  });

  $$("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    el.setAttribute("aria-label", t(key));
  });

  const themeToggle = $("#themeToggle");
  if (themeToggle) themeToggle.setAttribute("aria-label", t("aria.theme"));

  const langToggle = $("#langToggle");
  if (langToggle) {
    langToggle.setAttribute(
      "aria-label",
      currentLang === "en" ? t("aria.lang.toPT") : t("aria.lang.toEN")
    );
    langToggle.setAttribute("title", currentLang === "en" ? "PT" : "EN");
  }

  refreshDynamicProjectTexts();
  restartTyping();
  window.lucide && window.lucide.createIcons();

  // Reaplica layout quando trocar idioma (não muda nada, mas garante consistência)
  layoutCertifications();
}

function initI18n() {
  const saved = localStorage.getItem("lang");
  const initial = saved === "en" ? "en" : "pt";
  applyLanguage(initial);

  const btn = $("#langToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = currentLang === "pt" ? "en" : "pt";
    applyLanguage(next);
    localStorage.setItem("lang", next);
  });
}

function applyTheme(theme) {
  const root = document.documentElement;
  const toggle = $("#themeToggle");

  root.setAttribute("data-theme", theme);

  if (toggle) {
    toggle.innerHTML =
      theme === "light"
        ? '<span class="material-symbols-outlined">light_mode</span>'
        : '<span class="material-symbols-outlined">dark_mode</span>';
  }
}

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = saved || (prefersDark ? "dark" : "light");
  applyTheme(initial);

  const toggle = $("#themeToggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

function getTypingPhrases() {
  return currentLang === "en"
    ? ["Data Engineer ", "Infrastructure Analyst "]
    : ["Engenheiro de Dados ", "Analista de Infraestrutura "];
}

function restartTyping() {
  const el = $("#typing");
  if (!el) return;

  if (typingTimer) clearTimeout(typingTimer);
  el.textContent = "";

  const phrases = getTypingPhrases();
  let idx = 0, char = 0, deleting = false;

  function tick() {
    const current = phrases[idx];
    el.textContent = deleting
      ? current.substring(0, char--)
      : current.substring(0, char++);

    let delay = deleting ? 55 : 105;

    if (!deleting && char === current.length) {
      delay = 1400;
      deleting = true;
    } else if (deleting && char <= 0) {
      deleting = false;
      idx = (idx + 1) % phrases.length;
      delay = 550;
      el.style.opacity = 0.4;
      setTimeout(() => (el.style.opacity = 1), 120);
    }

    typingTimer = setTimeout(tick, delay);
  }

  tick();
}

function initTyping() { restartTyping(); }

function initNav() {
  const toggle = $("#navToggle");
  const mobile = $("#navMobile");
  if (!toggle || !mobile) return;

  toggle.addEventListener("click", () => {
    mobile.classList.toggle("open");
  });

  $$("#navMobile a").forEach((link) =>
    link.addEventListener("click", () => mobile.classList.remove("open"))
  );
}

function initScrollHelpers() {
  const bar = $("#scrollProgress");
  const topBtn = $("#backToTop");
  if (!bar || !topBtn) return;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = `${progress}%`;
    topBtn.classList.toggle("visible", scrollTop > 350);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

function initReveal() {
  const elements = $$(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 40, 220)}ms`;
    observer.observe(el);
  });
}

function initCursor() {
  const cursor = $("#cursor");
  if (!cursor) return;

  const isTouch =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    cursor.style.display = "none";
    return;
  }

  window.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });

  document.addEventListener("mouseover", (e) => {
    cursor.classList.toggle(
      "cursor--active",
      !!e.target.closest("a, button, .btn, .project-card, .social-btn, .timeline-btn, .cert-item, .cert-go")
    );
  });
}

function initTabs() {
  const tabs = document.querySelector(".tabs");
  if (!tabs) return;

  const buttons = tabs.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  function activate(tabName) {
    buttons.forEach((btn) => {
      const active = btn.dataset.tab === tabName;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== tabName);
    });
  }

  activate("experience");
  buttons.forEach((btn) =>
    btn.addEventListener("click", () => activate(btn.dataset.tab))
  );
}

function getModalsByLang() {
  const pt = {
    "exp-flashnet-atual": `
      <h2>Analista de Infraestrutura</h2>
      <h3>Flash Net Brasil • 2023 - Atual</h3>
      <ul>
      <li>Responsável pela manutenção, operação e evolução da infraestrutura crítica do datacenter, garantindo alta disponibilidade e segurança.</li>
      <li>Gerenciamento completo de energia: baterias, geradores e monitoramento.</li>
      <li>Administração de servidores físicos e virtuais com Proxmox: criação de VMs, snapshots, atualizações e manutenção.</li>
      <li>Gerenciamento de redes e firewalls (iptables), acessos via JumpServer e NGINX para proxy reverso e balanceamento.</li>
      <li>Uso de TrueNAS para armazenamento em rede com foco em redundância e desempenho.</li>
      <li>Responsável pela infraestrutura de telefonia (Issabel, PBX, PABX e VoIP): configuração, integração e suporte.</li>
      <li>Monitoramento contínuo com Zabbix, Grafana e Home Assistant, incluindo criação de dashboards e análise de métricas.</li>
      <li>Documentação detalhada da infraestrutura no NetBox: inventário, topologia e sistemas de energia.</li>
      <li>Organização de cabeamento, montagem e padronização de racks.</li>
      </ul>
    `,
    "exp-totvs": `
      <h2>Analista de Infraestrutura</h2>
      <h3>TOTVS • 2023</h3>
      <ul>
      <li>Atuação no Data Center com manutenção de servidores Dell, substituição de blades Cisco UCS, troca de discos NetApp e gestão de fitas em robôs IBM.</li>
      <li>Provisionamento completo de VMs no VMware vCenter (Windows/Linux), integração com CyberArk, upgrades de hardware e inclusão em backups Rubrik.</li>
      <li>Monitoramento da infraestrutura via T-Cloud Watch, Grafana e Zabbix, com atuação inicial em incidentes críticos e escalonamento para times especializados.</li>
      <li>Administração de rede e segurança: regras NAT, firewall Palo Alto, Big IP, VPNs, ajustes de rotas e manutenção da disponibilidade de serviços.</li>
      <li>Gestão de acessos IAM no T-Cloud, garantindo conformidade e controles de permissão corporativos.</li>
      <li>Suporte técnico via Cherwell, Zendesk e Slack, atuando também como “mão remota” em atividades presenciais no Data Center.</li>
      <li>Foco em confiabilidade, automação e segurança, garantindo continuidade operacional e melhoria contínua de processos.</li>
      </ul>
    `,
    "exp-flashnet-qualidade": `
      <h2>Analista de Qualidade</h2>
      <h3>Flash Net Brasil • 2018 - 2023</h3>
      <ul>
      <li>Ativação e configuração de conexões de clientes, garantindo qualidade e conformidade técnica.</li>
      <li>Configuração e manutenção de redes com MikroTik, Ubiquiti, rádios, PTPs, roteamento e firewall.</li>
      <li>Monitoramento e análise de incidentes usando Grafana e Zabbix, com troubleshooting e atuação junto ao NOC.</li>
      <li>Treinamento, mentoria e liderança da equipe de suporte técnico, incluindo criação de materiais e vídeos.</li>
      <li>Atendimento ao cliente presencial e remoto, com foco em diagnóstico rápido e fidelização.</li>
      <li>Testes, validação e atualização de equipamentos antes de instalações e assistências técnicas.</li>
      <li>Criação e manutenção de SOPs para padronização e melhoria contínua dos processos.</li>
      <li>Administração de Windows Server: criação de usuários, grupos e GPOs em Active Directory.</li>
      <li>Atuação no SOC com foco em LGPD, segurança da informação e conformidade operacional.</li>
      </ul>
    `,
    "edu-puc": `
      <h2>Pós-graduação em Engenharia de Dados</h2>
      <h3>PUC Minas • 2024 - 2025</h3>
      <ul>
      <li>Processamento de fluxos de dados discretos e contínuos</li>
      <li>Arquiteturas e serviços de Data Lakes e Data Warehousing</li>
      <li>Python aplicado à Engenharia de Dados</li>
      <li>Ingestão e catalogação de dados</li>
      <li>Otimização, monitoramento e operação em bancos de dados</li>
      <li>Segurança no armazenamento, manuseio e consumo de dados</li>
      <li>Bancos de Dados NoSQL</li>
      <li>Armazenamento e processamento de dados massivos e distribuídos</li>
      <li>Preparação, orquestração e automação de fluxos de dados</li>
      <li>Camadas e serviços de consumo de dados</li>
      <li>Bancos de dados relacionais e linguagem SQL</li>
      <li>Cultura e práticas de DataOps e MLOps</li>
      <li>Fundamentos de Humanidades aplicados à área</li>
      <li>Governança de Dados</li>
      <li>Computação em Nuvem</li>
      <li>Cultura e práticas de DevOps</li>
      </ul>
    `,
    "edu-ifsp": `
      <h2>ADS — IFSP</h2>
      <ul>
        <li>Algoritmos e Programação</li>
        <li>Arquitetura de Computadores</li>
        <li>Comunicação e Expressão</li>
        <li>História da Ciência e Tecnologia</li>
        <li>Inglês Técnico</li>
        <li>Matemática</li>
        <li>Programação Estruturada</li>
        <li>Banco de Dados I</li>
        <li>Estatística</li>
        <li>Estrutura de Dados I</li>
        <li>Interação Humano-Computador</li>
        <li>Programação Orientada a Objetos</li>
        <li>Sistemas Operacionais</li>
        <li>Análise Orientada a Objetos</li>
        <li>Banco de Dados II</li>
        <li>Estrutura de Dados II</li>
        <li>Linguagem de Programação I</li>
        <li>Redes de Computadores I</li>
        <li>Administração de Banco de Dados</li>
        <li>Desenvolvimento Web I</li>
        <li>Engenharia de Software I</li>
        <li>Introdução à Administração</li>
        <li>Linguagem de Programação II</li>
        <li>Redes de Computadores II</li>
        <li>Desenvolvimento para Dispositivos Móveis</li>
        <li>Desenvolvimento Web II</li>
        <li>Engenharia de Software II</li>
        <li>Implementação de Servidores</li>
        <li>Metodologia de Pesquisa Científica e Tecnológica</li>
        <li>Sistema de Informação Gerencial</li>
        <li>Empreendedorismo</li>
        <li>Gestão de Projetos</li>
        <li>Meio Ambiente, Sustentabilidade e TI</li>
        <li>Projeto Integrado</li>
        <li>Segurança da Informação</li>
        <li>Tópicos em Tecnologia da Informação</li>
      </ul>
    `
  };

  const en = {
    "exp-flashnet-atual": `
      <h2>Infrastructure Analyst</h2>
      <h3>Flash Net Brasil • 2023 - Present</h3>
      <ul>
      <li>Responsible for maintaining, operating, and evolving critical datacenter infrastructure, ensuring availability and security.</li>
      <li>Full power management: batteries, generators, and monitoring.</li>
      <li>Physical/virtual server administration with Proxmox: VM creation, snapshots, updates, and maintenance.</li>
      <li>Networking and firewall management (iptables), JumpServer access, and NGINX as reverse proxy/load balancer.</li>
      <li>TrueNAS storage management with focus on redundancy and performance.</li>
      <li>Telephony infrastructure (Issabel, PBX/PABX, VoIP): configuration, integration, and support.</li>
      <li>Continuous monitoring with Zabbix, Grafana, and Home Assistant, including dashboards and metrics analysis.</li>
      <li>Detailed infrastructure documentation in NetBox: inventory, topology, and power systems.</li>
      <li>Structured cabling organization and rack standardization.</li>
      </ul>
    `,
    "exp-totvs": `
      <h2>Infrastructure Analyst</h2>
      <h3>TOTVS • 2023</h3>
      <ul>
      <li>Datacenter operations: Dell servers, Cisco UCS blade replacements, NetApp disk swaps, and IBM tape robot handling.</li>
      <li>Full VM provisioning in VMware vCenter (Windows/Linux), CyberArk integration, hardware upgrades, and Rubrik backup onboarding.</li>
      <li>Infrastructure monitoring via T-Cloud Watch, Grafana, and Zabbix; first-response for critical incidents and escalation.</li>
      <li>Network & security administration: NAT rules, Palo Alto firewall, Big IP, VPNs, routing adjustments, and service availability.</li>
      <li>IAM access management in T-Cloud ensuring compliance and permission controls.</li>
      <li>Support via Cherwell, Zendesk, and Slack, including hands-on remote support inside the datacenter.</li>
      <li>Focus on reliability, automation, and security to ensure continuity and continuous improvement.</li>
      </ul>
    `,
    "exp-flashnet-qualidade": `
      <h2>Quality Analyst</h2>
      <h3>Flash Net Brasil • 2018 - 2023</h3>
      <ul>
      <li>Client connection activation and configuration ensuring technical compliance and quality.</li>
      <li>Network setup and maintenance (MikroTik, Ubiquiti, radios, PTP links, routing, and firewall).</li>
      <li>Incident monitoring and analysis using Grafana and Zabbix, troubleshooting and collaboration with NOC.</li>
      <li>Team training, mentoring, and leadership, including creation of materials and videos.</li>
      <li>On-site and remote customer support with fast diagnostics and retention focus.</li>
      <li>Testing, validation, and updates of equipment before deployments and support visits.</li>
      <li>SOP creation and maintenance to standardize and improve processes.</li>
      <li>Windows Server administration: users, groups, and GPOs in Active Directory.</li>
      <li>SOC support focused on LGPD, information security, and operational compliance.</li>
      </ul>
    `,
    "edu-puc": `
      <h2>Postgraduate in Data Engineering</h2>
      <h3>PUC Minas • 2024 - 2025</h3>
      <ul>
      <li>Discrete and continuous data stream processing</li>
      <li>Data Lake and Data Warehousing architectures/services</li>
      <li>Python applied to Data Engineering</li>
      <li>Data ingestion and cataloging</li>
      <li>Database optimization, monitoring, and operations</li>
      <li>Security in data storage, handling, and consumption</li>
      <li>NoSQL databases</li>
      <li>Massive/distributed data storage and processing</li>
      <li>Workflow preparation, orchestration, and automation</li>
      <li>Consumption layers and services</li>
      <li>Relational databases and SQL</li>
      <li>DataOps and MLOps culture and practices</li>
      <li>Humanities fundamentals applied to the field</li>
      <li>Data governance</li>
      <li>Cloud computing</li>
      <li>DevOps culture and practices</li>
      </ul>
    `,
    "edu-ifsp": `
      <h2>Systems Analysis & Development — IFSP</h2>
      <ul>
        <li>Algorithms and Programming</li>
        <li>Computer Architecture</li>
        <li>Communication and Writing</li>
        <li>History of Science and Technology</li>
        <li>Technical English</li>
        <li>Mathematics</li>
        <li>Structured Programming</li>
        <li>Databases I</li>
        <li>Statistics</li>
        <li>Data Structures I</li>
        <li>Human-Computer Interaction</li>
        <li>Object-Oriented Programming</li>
        <li>Operating Systems</li>
        <li>Object-Oriented Analysis</li>
        <li>Databases II</li>
        <li>Data Structures II</li>
        <li>Programming Language I</li>
        <li>Computer Networks I</li>
        <li>Database Administration</li>
        <li>Web Development I</li>
        <li>Software Engineering I</li>
        <li>Introduction to Administration</li>
        <li>Programming Language II</li>
        <li>Computer Networks II</li>
        <li>Mobile Development</li>
        <li>Web Development II</li>
        <li>Software Engineering II</li>
        <li>Server Implementation</li>
        <li>Research Methodology</li>
        <li>Management Information Systems</li>
        <li>Entrepreneurship</li>
        <li>Project Management</li>
        <li>Environment, Sustainability and IT</li>
        <li>Capstone Project</li>
        <li>Information Security</li>
        <li>Topics in IT</li>
      </ul>
    `
  };

  return currentLang === "en" ? en : pt;
}

function initModal() {
  const modal = $("#modal");
  const body = $("#modalBody");
  const closeBtn = $(".modal-close");
  if (!modal || !body || !closeBtn) return;

  let lastActiveEl = null;

  const open = (html) => {
    lastActiveEl = document.activeElement;
    body.innerHTML = html || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
    window.lucide && window.lucide.createIcons();
  };

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    body.innerHTML = "";
    document.body.style.overflow = "";
    if (lastActiveEl) lastActiveEl.focus();
  };

  $$(".timeline-more").forEach((btn) =>
    btn.addEventListener("click", () => {
      const MODALS = getModalsByLang();
      open(MODALS[btn.dataset.modalTarget] || "");
    })
  );

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
}

function formatRepoName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

function formatUpdated(dateStr) {
  try {
    const d = new Date(dateStr);
    const locale = currentLang === "en" ? "en-US" : "pt-BR";
    const fmt = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" });
    return currentLang === "en"
      ? `Updated ${fmt.format(d)}`
      : `Atualizado ${fmt.format(d)}`;
  } catch {
    return currentLang === "en" ? "Recently updated" : "Atualizado recentemente";
  }
}

/* ================================
   Projects data
================================ */
let allRepos = [];
let filteredRepos = [];
let currentPage = 1;

function renderProjectSkeleton() {
  const list = $("#projectList");
  const counter = $("#projectCount");
  if (!list || !counter) return;

  counter.textContent = t("dyn.loading");
  list.innerHTML = Array.from({ length: PER_PAGE }).map(() => `
    <article class="project-card" aria-hidden="true">
      <div style="position:absolute;top:.9rem;right:.9rem;width:40px;height:40px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(148,163,184,.12)"></div>
      <div style="height:18px;width:60%;border-radius:10px;background:rgba(255,255,255,.06);margin-bottom:12px"></div>
      <div style="height:14px;width:92%;border-radius:10px;background:rgba(255,255,255,.05);margin-bottom:10px"></div>
      <div style="height:14px;width:78%;border-radius:10px;background:rgba(255,255,255,.05)"></div>
      <div style="margin-top:14px;display:flex;gap:8px">
        <div style="height:26px;width:92px;border-radius:999px;background:rgba(255,255,255,.05)"></div>
        <div style="height:26px;width:64px;border-radius:999px;background:rgba(255,255,255,.05)"></div>
      </div>
    </article>
  `).join("");
}

async function fetchRepos() {
  const list = $("#projectList");
  const counter = $("#projectCount");
  if (!list || !counter) return;

  // Só faz skeleton se estiver em GitHub
  if (currentSource === "github") renderProjectSkeleton();

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`, {
      headers: { "Accept": "application/vnd.github+json" }
    });

    if (!res.ok) {
      if (currentSource === "github") {
        list.innerHTML = `<p>${t("dyn.loadError")}</p>`;
        counter.textContent = t("dyn.loadFail");
      }
      return;
    }

    const data = await res.json();

    allRepos = (Array.isArray(data) ? data : []).filter((r) => !r.fork);
    filteredRepos = [...allRepos];
    currentPage = 1;

    if (currentSource === "github") renderItems();
  } catch (err) {
    if (currentSource === "github") {
      list.innerHTML = `<p>${t("dyn.loadError")}</p>`;
      counter.textContent = t("dyn.loadFail");
    }
  }
}

/* ✅ NOVO: pega itens da fonte atual (Github/Infra) */
function getInfraBaseItems() {
  return INFRA_POSTS.map((p) => ({
    kind: "infra",
    title: p.title,
    desc: currentLang === "en" ? p.descEN : p.descPT,
    updated_at: p.date,
    url: p.url
  }));
}

function getActiveItems() {
  if (currentSource === "infra") {
    return infraFiltered ?? getInfraBaseItems();
  }

  // github
  return filteredRepos.map((repo) => ({
    kind: "github",
    title: formatRepoName(repo.name),
    desc: repo.description || t("dyn.noDesc"),
    updated_at: repo.updated_at,
    url: repo.html_url
  }));
}

/* ✅ NOVO: render unificado */
function renderItems() {
  const list = $("#projectList");
  const counter = $("#projectCount");
  const pageInfo = $("#pageInfo");
  const prev = $("#prevPage");
  const next = $("#nextPage");

  if (!list || !counter || !pageInfo || !prev || !next) return;

  const items = getActiveItems();

  if (!items.length) {
    list.innerHTML = `<p>${t("dyn.noProjects")}</p>`;
    counter.textContent = t("dyn.projectsCount", { n: 0 });
    pageInfo.textContent = currentLang === "en" ? "Page 1" : "Página 1";
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const slice = items.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  list.innerHTML = slice.map((it) => `
    <article class="project-card">
      <button class="project-link" type="button" aria-label="${t("aria.openGithub")}"
        onclick="window.open('${it.url}', '_blank')">
        <i data-lucide="${it.kind === "infra" ? "linkedin" : "github"}"></i>
      </button>

      <h3 class="project-title">${it.title}</h3>
      <p class="project-desc">${it.desc}</p>

      <div class="project-meta">
        <span class="meta-pill">
          <i data-lucide="clock-3"></i>${formatUpdated(it.updated_at)}
        </span>
      </div>
    </article>
  `).join("");

  counter.textContent = t("dyn.projectsCount", { n: items.length });
  pageInfo.textContent = t("dyn.pageOf", { p: currentPage, t: totalPages });

  prev.disabled = currentPage === 1;
  next.disabled = currentPage === totalPages;

  window.lucide && window.lucide.createIcons();
}

function refreshDynamicProjectTexts() {
  const counter = $("#projectCount");
  const list = $("#projectList");
  const pageInfo = $("#pageInfo");

  if (counter && (!allRepos.length && currentSource === "github")) {
    counter.textContent = t("dyn.loadingRepos");
  }

  if (list && (currentSource === "infra" || allRepos.length)) {
    renderItems();
  } else if (pageInfo) {
    pageInfo.textContent = currentLang === "en" ? "Page 1" : "Página 1";
  }
}

function initProjects() {
  const search = $("#projectSearch");
  const prev = $("#prevPage");
  const next = $("#nextPage");
  const counter = $("#projectCount");

  const btnGithub = $("#sourceGithub");
  const btnInfra = $("#sourceInfra");

  function syncSourceButtons() {
    if (!btnGithub || !btnInfra) return;
    const isGit = currentSource === "github";
    btnGithub.classList.toggle("active", isGit);
    btnInfra.classList.toggle("active", !isGit);
    btnGithub.setAttribute("aria-selected", isGit ? "true" : "false");
    btnInfra.setAttribute("aria-selected", !isGit ? "true" : "false");
  }

  function setSource(nextSource) {
    currentSource = nextSource === "infra" ? "infra" : "github";
    currentPage = 1;
    infraFiltered = null;

    if (search) search.value = "";

    syncSourceButtons();

    // Atualiza contagem/estado imediatamente
    if (currentSource === "infra") {
      renderItems();
    } else {
      // github
      if (!allRepos.length) {
        if (counter) counter.textContent = t("dyn.loadingRepos");
        fetchRepos();
      } else {
        filteredRepos = [...allRepos];
        renderItems();
      }
    }
  }

  if (btnGithub) btnGithub.addEventListener("click", () => setSource("github"));
  if (btnInfra) btnInfra.addEventListener("click", () => setSource("infra"));

  // estado inicial
  syncSourceButtons();

  if (counter) {
    counter.textContent = currentSource === "infra" ? t("dyn.projectsCount", { n: INFRA_POSTS.length }) : t("dyn.loadingRepos");
  }

  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase();
      currentPage = 1;

      if (currentSource === "infra") {
        const base = getInfraBaseItems();
        infraFiltered = base.filter(
          (x) =>
            x.title.toLowerCase().includes(term) ||
            (x.desc || "").toLowerCase().includes(term)
        );
        renderItems();
        return;
      }

      // github
      filteredRepos = allRepos.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          (r.description || "").toLowerCase().includes(term)
      );
      renderItems();
    });
  }

  if (prev) {
    prev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderItems();
      }
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      const totalPages = Math.ceil(getActiveItems().length / PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderItems();
      }
    });
  }

  // carrega GitHub ao iniciar
  fetchRepos();
}

/* =========================================================
   CERTIFICATIONS LAYOUT (1 central / 2 lado a lado / 3 = 2+1 / etc)
========================================================= */
function layoutCertifications() {
  const list = document.querySelector(".certs-list");
  if (!list) return;

  // Pega itens mesmo se já estiver em colunas
  const items = [...list.querySelectorAll(".cert-item")];

  // Limpa e recria
  list.innerHTML = "";

  const isMobile = window.matchMedia("(max-width: 820px)").matches;

  if (items.length <= 1) {
    list.classList.add("is-single");
    items.forEach((it) => list.appendChild(it));
    return;
  }

  list.classList.remove("is-single");

  if (isMobile) {
    items.forEach((it) => list.appendChild(it));
    return;
  }

  const col1 = document.createElement("div");
  const col2 = document.createElement("div");
  col1.className = "certs-col";
  col2.className = "certs-col";

  const mid = Math.ceil(items.length / 2);
  items.slice(0, mid).forEach((it) => col1.appendChild(it));
  items.slice(mid).forEach((it) => col2.appendChild(it));

  list.appendChild(col1);
  list.appendChild(col2);
}

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initTheme();
  initTyping();
  initNav();
  initScrollHelpers();
  initReveal();
  initCursor();
  initTabs();
  initModal();
  initProjects();

  layoutCertifications();
  window.addEventListener("resize", layoutCertifications);

  window.lucide && window.lucide.createIcons();
});

const GITHUB_USER = "mateusvicentin";
const PER_PAGE = 3;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

let currentLang = "pt";

let currentSource = "github"; // "github" | "infra"
let infraFiltered = null;

const INFRA_POSTS = [
   {
    title: "Notificação de Backup TrueNAS no Telegram",
    url: "https://www.linkedin.com/posts/mateusvicentin_infraestrutura-backup-automacao-activity-7430983198022656002-uxRb",
    descPT: "Automatizado o envio de notificações sempre que uma Cloud Sync Task é realizada com sucesso, ou em casos de falhas.",
    descEN: "Automated notifications are sent whenever a Cloud Sync Task is completed successfully or in case of failures.",
    date: "2026-02-22"
   },
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
    "hero.greeting": "Oi, sou o Mateus 👋",
    "hero.title.line1": "Engenheiro de Dados",
    "hero.title.line2": "& Analista de Infra",
    "hero.subtitle": "Pós-graduado em Engenharia de Dados (PUC Minas) e formado em Análise e Desenvolvimento de Sistemas (IFSP). Atuo como Analista de Infraestrutura, com foco em servidores, telefonia e datacenter.",
    "hero.cta.projects": "Ver projetos",
    "hero.cta.resume": "Deploy Currículo",
    "hero.cta.linkedin": "Ver LinkedIn",
    "hero.deploy.init": "Inicializando...",
    "hero.deploy.apply": "Aplicando configs...",
    "hero.deploy.success": "Deploy Concluído!",
    "about.kicker": "Quem sou",
    "about.title": "Sobre mim",
    "about.p1": `Pós-graduado em <strong>Engenharia de Dados</strong> (PUC Minas) e formado em <strong>Análise e Desenvolvimento de Sistemas</strong> (IFSP). Minha jornada profissional combina uma forte base operacional em infraestrutura de TI tradicional com arquiteturas modernas de dados, focando em soluções escaláveis.`,
    "about.p2": `Sou apaixonado por resolver problemas complexos na interseção entre <strong>Segurança da Informação</strong>, <strong>Redes</strong> e <strong>Computação em Nuvem</strong>. Atualmente, busco aplicar minha bagagem em operações de missão crítica na construção de ambientes analíticos que sejam robustos, governados e de alta disponibilidade.`,
    "about.card1.title": "Engenharia & Pipelines",
    "about.card1.desc": "Construção de fluxos eficientes utilizando Python, Apache Spark, Databricks, Kafka, Airflow e dbt, do processamento distribuído à transformação de dados.",
    "about.card2.title": "Ecossistema Cloud",
    "about.card2.desc": "Modelagem e governança de dados em plataformas como BigQuery, Snowflake, MongoDB e bancos SQL/NoSQL, operando sobre arquiteturas AWS e Azure.",
    "skills.kicker": "Stack",
    "skills.title": "Habilidades",
    "projects.kicker": "GitHub",
    "projects.title": "Projetos",
    "projects.subtitle.prefix": "GitHub",
    "projects.search.placeholder": "Buscar projeto por nome, tecnologia ou descrição...",
    "projects.pagination.prev": "« Anterior",
    "projects.pagination.next": "Próxima »",
    "projects.pagination.page": "Página 1",
    "projects.source.data": "Dados",
    "projects.source.infra": "Infra",
    "journey.kicker": "Carreira",
    "journey.title": "Trajetória profissional e acadêmica",
    "journey.tabs.experience": "Experiência",
    "journey.tabs.education": "Formação",
    "journey.details": "Ver detalhes",
    "journey.subjects": "Ver disciplinas",
    "journey.exp1.role": "Analista de Infraestrutura",
    "journey.exp1.date": "2023 - Atual",
    "journey.exp1.desc": "Responsável pela infraestrutura crítica de datacenter, servidores, redes, telefonia e monitoramento.",
    "journey.exp2.role": "Analista de Infraestrutura",
    "journey.exp2.date": "2023",
    "journey.exp2.desc": "Atuação em Data Center, provisionamento de VMs, redes, firewalls e suporte corporativo.",
    "journey.exp3.role": "Analista de Qualidade",
    "journey.exp3.date": "2018 - 2023",
    "journey.exp3.desc": "Garantia de qualidade de conexão, monitoramento, documentação e atuação em SOC/LGPD.",
    "journey.edu1.title": "Pós-Graduação em Engenharia de Dados",
    "journey.edu1.date": "2024 - 2025",
    "journey.edu1.desc": "Foco em arquitetura de dados, big data, processamento distribuído e plataformas modernas.",
    "journey.edu2.title": "Análise e Desenv. de Sistemas",
    "journey.edu2.date": "2016 - 2020",
    "journey.edu2.desc": "Base sólida em desenvolvimento, banco de dados, redes, segurança e engenharia de software.",
    "certs.title": "Certificações",
    "certs.verify": "Verificar credencial",
    "certs.c1.name": "ICC-A Telefonia IP",
    "certs.c1.date": "Concluída",
    "certs.c1.desc": "Certificação focada em implementação, configuração e arquitetura de centrais telefônicas IP e infraestrutura VoIP.",
    "contact.title": "Vamos conversar?",
    "contact.subtitle": "Estou sempre aberto a novos desafios e oportunidades.",
    "contact.social.linkedin": "Conexões profissionais",
    "contact.social.github": "Repositórios e códigos",
    "contact.social.telegram": "Bate-papo rápido",
    "contact.direct.title": "Direto ao ponto",
    "contact.direct.desc": "Se preferir, envie um e-mail direto com o contexto técnico ou objetivo do projeto.",
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
    "aria.openGithub": "Abrir link"
  },
  en: {
    "logo.sub": "Data & Infrastructure",
    "nav.about": "About",
    "nav.stack": "Skills",
    "nav.projects": "Projects",
    "nav.journey": "Journey",
    "nav.contact": "Contact",
    "nav.certs": "Certifications",
    "hero.greeting": "Hi, I'm Mateus 👋",
    "hero.title.line1": "Data Engineer",
    "hero.title.line2": "& Infrastructure Analyst",
    "hero.subtitle": "Postgraduate in Data Engineering (PUC Minas) and graduated in Systems Analysis and Development (IFSP). I work as an Infrastructure Analyst focused on servers, telephony, and datacenter operations.",
    "hero.cta.projects": "View projects",
    "hero.cta.resume": "Deploy Resume",
    "hero.cta.linkedin": "Open LinkedIn",
    "hero.deploy.init": "Initializing...",
    "hero.deploy.apply": "Applying configs...",
    "hero.deploy.success": "Deploy Successful!",
    "about.kicker": "Who I am",
    "about.title": "About me",
    "about.p1": `Postgraduate in <strong>Data Engineering</strong> (PUC Minas) and graduated in <strong>Systems Analysis and Development</strong> (IFSP). My professional journey combines a strong operational foundation in traditional IT infrastructure with modern data architectures, focusing on scalable solutions.`,
    "about.p2": `I am passionate about solving complex problems at the intersection of <strong>Information Security</strong>, <strong>Networking</strong>, and <strong>Cloud Computing</strong>. Currently, I aim to apply my background in mission-critical operations to build robust, governed, and highly available analytical environments.`,
    "about.card1.title": "Engineering & Pipelines",
    "about.card1.desc": "Building efficient workflows using Python, Apache Spark, Databricks, Kafka, Airflow, and dbt, from distributed processing to data transformation.",
    "about.card2.title": "Cloud Ecosystem",
    "about.card2.desc": "Data modeling and governance on platforms like BigQuery, Snowflake, MongoDB, and SQL/NoSQL databases, operating on AWS and Azure architectures.",
    "skills.kicker": "Skills",
    "skills.title": "Skills",
    "projects.kicker": "GitHub",
    "projects.title": "Projects",
    "projects.subtitle.prefix": "GitHub",
    "projects.search.placeholder": "Search projects by name, tech, or description...",
    "projects.pagination.prev": "« Previous",
    "projects.pagination.next": "Next »",
    "projects.pagination.page": "Page 1",
    "projects.source.data": "Data",
    "projects.source.infra": "Infra",
    "journey.kicker": "Career",
    "journey.title": "Professional & academic journey",
    "journey.tabs.experience": "Experience",
    "journey.tabs.education": "Education",
    "journey.details": "View details",
    "journey.subjects": "View subjects",
    "journey.exp1.role": "Infrastructure Analyst",
    "journey.exp1.date": "2023 - Present",
    "journey.exp1.desc": "Responsible for critical datacenter infrastructure, servers, networking, telephony, and monitoring.",
    "journey.exp2.role": "Infrastructure Analyst",
    "journey.exp2.date": "2023",
    "journey.exp2.desc": "Datacenter operations, VM provisioning, networking, firewalls, and corporate support.",
    "journey.exp3.role": "Quality Analyst",
    "journey.exp3.date": "2018 - 2023",
    "journey.exp3.desc": "Connectivity quality assurance, monitoring, documentation, and SOC/LGPD support.",
    "journey.edu1.title": "Postgraduate in Data Engineering",
    "journey.edu1.date": "2024 - 2025",
    "journey.edu1.desc": "Focus on data architecture, big data, distributed processing, and modern platforms.",
    "journey.edu2.title": "Systems Analysis & Dev.",
    "journey.edu2.date": "2016 - 2020",
    "journey.edu2.desc": "Solid foundation in development, databases, networking, security, and software engineering.",
    "certs.title": "Certifications",
    "certs.verify": "Verify credential",
    "certs.c1.name": "ICC-A IP Telephony",
    "certs.c1.date": "Completed",
    "certs.c1.desc": "Certification focused on the implementation, configuration, and architecture of IP PBX and VoIP infrastructure.",
    "contact.title": "Let’s talk?",
    "contact.subtitle": "I'm always open to new challenges and opportunities.",
    "contact.social.linkedin": "Professional network",
    "contact.social.github": "Repositories & code",
    "contact.social.telegram": "Quick chat",
    "contact.direct.title": "Straight to the point",
    "contact.direct.desc": "If you prefer, send a direct email with technical context and project goals.",
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
    "aria.openGithub": "Open link"
  }
};

function getModalsByLang() {
  if (currentLang === "en") {
    return {
      "exp-flashnet-atual": `
        <h2>Infrastructure Analyst - Flash Net Brasil</h2>
        <ul>
          <li>Responsible for the maintenance, operation, and evolution of critical datacenter infrastructure, ensuring high availability and security.</li>
          <li>Full power management: batteries, generators, and monitoring.</li>
          <li>Administration of physical and virtual servers with Proxmox: VM creation, snapshots, updates, and maintenance.</li>
          <li>Network and firewall management (iptables), access via JumpServer, and NGINX for reverse proxy and load balancing.</li>
          <li>Use of TrueNAS for network storage focusing on redundancy and performance.</li>
          <li>Responsible for telephony infrastructure (Issabel, PBX, PABX, and VoIP): configuration, integration, and support.</li>
          <li>Continuous monitoring with Zabbix, Grafana, and Home Assistant, including dashboard creation and metrics analysis.</li>
          <li>Detailed infrastructure documentation in NetBox: inventory, topology, and power systems.</li>
          <li>Cabling organization, rack assembly, and standardization.</li>
        </ul>
      `,
      "exp-totvs": `
        <h2>Infrastructure Analyst - TOTVS</h2>
        <ul>
          <li>Data Center operations including Dell server maintenance, Cisco UCS blade replacement, NetApp disk swapping, and tape management in IBM robots.</li>
          <li>Full VM provisioning in VMware vCenter (Windows/Linux), CyberArk integration, hardware upgrades, and inclusion in Rubrik backups.</li>
          <li>Infrastructure monitoring via T-Cloud Watch, Grafana, and Zabbix, with initial incident response and escalation to specialized teams.</li>
          <li>Network and security administration: NAT rules, Palo Alto firewall, Big IP, VPNs, route adjustments, and ensuring service availability.</li>
          <li>IAM access management in T-Cloud, ensuring compliance and corporate permission controls.</li>
          <li>Technical support via Cherwell, Zendesk, and Slack, also acting as "remote hands" for on-site activities in the Data Center.</li>
          <li>Focus on reliability, automation, and security, ensuring operational continuity and continuous process improvement.</li>
        </ul>
      `,
      "exp-flashnet-qualidade": `
        <h2>Quality Analyst - Flash Net Brasil</h2>
        <ul>
          <li>Activation and configuration of client connections, ensuring quality and technical compliance.</li>
          <li>Network configuration and maintenance with MikroTik, Ubiquiti, radios, PTPs, routing, and firewalls.</li>
          <li>Monitoring and incident analysis using Grafana and Zabbix, with troubleshooting and collaboration with the NOC.</li>
          <li>Training, mentoring, and leadership of the technical support team, including the creation of materials and videos.</li>
          <li>In-person and remote customer service, focused on quick diagnosis and customer retention.</li>
          <li>Testing, validation, and equipment updating prior to installations and technical assistance.</li>
          <li>Creation and maintenance of SOPs for standardization and continuous process improvement.</li>
          <li>Windows Server administration: creation of users, groups, and GPOs in Active Directory.</li>
          <li>SOC operations focusing on GDPR (LGPD), information security, and operational compliance.</li>
        </ul>
      `,
      "edu-puc": `
        <h2>Postgraduate in Data Engineering - PUC Minas</h2>
        <ul>
          <li>Discrete and continuous data flow processing</li>
          <li>Data Lakes and Data Warehousing architectures and services</li>
          <li>Python applied to Data Engineering</li>
          <li>Data ingestion and cataloging</li>
          <li>Database optimization, monitoring, and operation</li>
          <li>Security in data storage, handling, and consumption</li>
          <li>NoSQL Databases</li>
          <li>Massive and distributed data storage and processing</li>
          <li>Data flow preparation, orchestration, and automation</li>
          <li>Data consumption layers and services</li>
          <li>Relational databases and SQL language</li>
          <li>DataOps and MLOps culture and practices</li>
          <li>Humanities fundamentals applied to the field</li>
          <li>Data Governance</li>
          <li>Cloud Computing</li>
          <li>DevOps culture and practices</li>
        </ul>
      `,
      "edu-ifsp": `
        <h2>Systems Analysis and Development - IFSP</h2>
        <ul>
          <li>Algorithms and Programming</li>
          <li>Computer Architecture</li>
          <li>Communication and Expression</li>
          <li>History of Science and Technology</li>
          <li>Technical English</li>
          <li>Mathematics</li>
          <li>Structured Programming</li>
          <li>Database I</li>
          <li>Statistics</li>
          <li>Data Structures I</li>
          <li>Human-Computer Interaction</li>
          <li>Object-Oriented Programming</li>
          <li>Operating Systems</li>
          <li>Object-Oriented Analysis</li>
          <li>Database II</li>
          <li>Data Structures II</li>
          <li>Programming Language I</li>
          <li>Computer Networks I</li>
          <li>Database Administration</li>
          <li>Web Development I</li>
          <li>Software Engineering I</li>
          <li>Introduction to Administration</li>
          <li>Programming Language II</li>
          <li>Computer Networks II</li>
          <li>Mobile Device Development</li>
          <li>Web Development II</li>
          <li>Software Engineering II</li>
          <li>Server Implementation</li>
          <li>Scientific and Technological Research Methodology</li>
          <li>Management Information Systems</li>
          <li>Entrepreneurship</li>
          <li>Project Management</li>
          <li>Environment, Sustainability, and IT</li>
          <li>Integrated Project</li>
          <li>Information Security</li>
          <li>Topics in Information Technology</li>
        </ul>
      `
    };
  }

  return {
    "exp-flashnet-atual": `
      <h2>Analista de Infraestrutura - Flash Net Brasil</h2>
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
      <h2>Analista de Infraestrutura - TOTVS</h2>
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
      <h2>Analista de Qualidade - Flash Net Brasil</h2>
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
      <h2>Pós-Graduação em Engenharia de Dados - PUC Minas</h2>
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
      <h2>Análise e Desenv. de Sistemas - IFSP</h2>
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
}

function t(key, vars = {}) {
  const str = (I18N[currentLang] && I18N[currentLang][key]) || key;
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "pt";

  const root = document.documentElement;
  root.setAttribute("data-lang", currentLang);
  root.setAttribute("lang", currentLang === "en" ? "en" : "pt-BR");

  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
  $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  $$("[data-i18n-placeholder]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
  $$("[data-i18n-title]").forEach((el) => { el.setAttribute("title", t(el.getAttribute("data-i18n-title"))); });
  $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });

  const themeToggle = $("#themeToggle");
  if (themeToggle) themeToggle.setAttribute("aria-label", t("aria.theme"));

  const langToggle = $("#langToggle");
  if (langToggle) {
    langToggle.setAttribute("aria-label", currentLang === "en" ? t("aria.lang.toPT") : t("aria.lang.toEN"));
    langToggle.setAttribute("title", currentLang === "en" ? "PT" : "EN");
  }

  refreshDynamicProjectTexts();
  window.lucide && window.lucide.createIcons();
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
    toggle.innerHTML = theme === "light"
      ? '<span class="material-symbols-outlined">light_mode</span>'
      : '<span class="material-symbols-outlined">dark_mode</span>';
  }
}

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
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

function initDeployResume() {
  const deployBtns = $$(".btn-deploy-resume");
  
  deployBtns.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      
      if (btn.classList.contains("deploying")) return;
      btn.classList.add("deploying");

      const iconEl = btn.querySelector(".icon-default");
      const textEl = btn.querySelector(".btn-text");
      const href = btn.getAttribute("href");
      
      const originalTextKey = textEl.getAttribute("data-i18n");

      // Passo 1: Inicializando
      iconEl.textContent = "terminal";
      textEl.textContent = t("hero.deploy.init");
      textEl.removeAttribute("data-i18n"); 
      await new Promise(r => setTimeout(r, 600));

      // Passo 2: Aplicando Configs
      iconEl.textContent = "settings";
      iconEl.classList.add("spin-animation");
      textEl.textContent = t("hero.deploy.apply");
      await new Promise(r => setTimeout(r, 1200));

      // Passo 3: Sucesso
      iconEl.classList.remove("spin-animation");
      iconEl.textContent = "check_circle";
      textEl.textContent = t("hero.deploy.success");
      btn.classList.add("deploy-success");

      await new Promise(r => setTimeout(r, 800));

      // Abrir PDF 
      window.open(href, "_blank");

      // Reset
      setTimeout(() => {
        btn.classList.remove("deploying", "deploy-success");
        iconEl.textContent = "terminal";
        textEl.setAttribute("data-i18n", originalTextKey);
        textEl.textContent = t(originalTextKey);
      }, 2500);
    });
  });
}

function initNav() {
  const toggle = $("#navToggle");
  const mobile = $("#navMobile");
  if (!toggle || !mobile) return;

  toggle.addEventListener("click", () => {
    mobile.classList.toggle("open");
    document.body.style.overflow = mobile.classList.contains("open") ? "hidden" : "";
  });

  $$("#navMobile a").forEach((link) =>
    link.addEventListener("click", () => {
      mobile.classList.remove("open");
      document.body.style.overflow = ""; 
    })
  );
}

function initScrollHelpers() {
  const bar = $("#scrollProgress");
  const topBtn = $("#backToTop");
  if (!bar || !topBtn) return;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = `${progress}%`;
    topBtn.classList.toggle("visible", scrollTop > 350);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
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

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
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
      !!e.target.closest("a, button, .btn, .project-link-external, .social-btn, .timeline-more-link, .cert-card, .skill-item, .cert-verify-btn, .social-bento")
    );
  });
}

function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  if (!buttons.length || !panels.length) return;

  function activate(tabName) {
    buttons.forEach((btn) => {
      const active = btn.dataset.tab === tabName;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      if (panel.id === tabName) {
        panel.classList.remove("hidden");
        const reveals = panel.querySelectorAll('.reveal');
        reveals.forEach((el, i) => {
          setTimeout(() => el.classList.add('reveal-visible'), i * 60);
        });
      } else {
        panel.classList.add("hidden");
        const reveals = panel.querySelectorAll('.reveal');
        reveals.forEach(el => el.classList.remove('reveal-visible'));
      }
    });
  }

  activate("experience"); 
  buttons.forEach((btn) => btn.addEventListener("click", (e) => {
    e.preventDefault();
    activate(btn.dataset.tab);
  }));
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

  $$(".timeline-more-link").forEach((btn) =>
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
  return name.replace(/[-_]/g, " ").replace(/\s+/g, " ").trim().split(" ")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ");
}

function formatUpdated(dateStr) {
  try {
    const d = new Date(dateStr);
    const locale = currentLang === "en" ? "en-US" : "pt-BR";
    const fmt = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" });
    return currentLang === "en" ? `Updated ${fmt.format(d)}` : `Atualizado ${fmt.format(d)}`;
  } catch {
    return currentLang === "en" ? "Recently updated" : "Atualizado recentemente";
  }
}

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
      <div style="height:40px;width:40px;border-radius:12px;background:var(--border);margin-bottom:1rem"></div>
      <div style="height:18px;width:60%;border-radius:10px;background:var(--border);margin-bottom:12px"></div>
      <div style="height:14px;width:92%;border-radius:10px;background:var(--border);margin-bottom:10px;opacity:0.6"></div>
      <div style="height:14px;width:78%;border-radius:10px;background:var(--border);opacity:0.6"></div>
    </article>
  `).join("");
}

async function fetchRepos() {
  const list = $("#projectList");
  const counter = $("#projectCount");
  if (!list || !counter) return;

  if (currentSource === "github") renderProjectSkeleton();

  const cacheKey = `github_repos_${GITHUB_USER}`;
  const cachedData = sessionStorage.getItem(cacheKey);
  const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
  const now = new Date().getTime();

  if (cachedData && cacheTime && (now - cacheTime < 3600000)) {
    allRepos = JSON.parse(cachedData);
    filteredRepos = [...allRepos];
    currentPage = 1;
    if (currentSource === "github") renderItems();
    return;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`, {
      headers: { "Accept": "application/vnd.github+json" }
    });
    if (!res.ok) throw new Error("API Error");

    const data = await res.json();
    allRepos = (Array.isArray(data) ? data : []).filter((r) => !r.fork);
    
    sessionStorage.setItem(cacheKey, JSON.stringify(allRepos));
    sessionStorage.setItem(`${cacheKey}_time`, now.toString());

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

function getInfraBaseItems() {
  return INFRA_POSTS.map((p) => ({
    kind: "infra", title: p.title, desc: currentLang === "en" ? p.descEN : p.descPT, updated_at: p.date, url: p.url
  }));
}

function getActiveItems() {
  if (currentSource === "infra") return infraFiltered ?? getInfraBaseItems();
  return filteredRepos.map((repo) => ({
    kind: "github", title: formatRepoName(repo.name), desc: repo.description || t("dyn.noDesc"), updated_at: repo.updated_at, url: repo.html_url
  }));
}

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
    prev.disabled = true; next.disabled = true;
    return;
  }

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const slice = items.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  list.innerHTML = slice.map((it) => {
    return `
      <article class="project-card">
        <div class="project-card-header">
          <div class="project-icon">
            <i data-lucide="${it.kind === "infra" ? "server" : "database"}"></i>
          </div>
          <a href="${it.url}" target="_blank" rel="noopener noreferrer" class="project-link-external" aria-label="${t("aria.openGithub")}">
            <i data-lucide="external-link"></i>
          </a>
        </div>
        <h3 class="project-title">${it.title}</h3>
        <p class="project-desc">${it.desc}</p>
        <div class="project-footer">
          <span class="project-date">${formatUpdated(it.updated_at)}</span>
        </div>
      </article>
    `;
  }).join("");

  counter.textContent = t("dyn.projectsCount", { n: items.length });
  pageInfo.textContent = t("dyn.pageOf", { p: currentPage, t: totalPages });
  prev.disabled = currentPage === 1;
  next.disabled = currentPage === totalPages;

  window.lucide && window.lucide.createIcons();

  if (window.matchMedia("(pointer: fine)").matches) {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }
}

function refreshDynamicProjectTexts() {
  const counter = $("#projectCount");
  const list = $("#projectList");
  const pageInfo = $("#pageInfo");
  if (counter && (!allRepos.length && currentSource === "github")) counter.textContent = t("dyn.loadingRepos");
  if (list && (currentSource === "infra" || allRepos.length)) renderItems();
  else if (pageInfo) pageInfo.textContent = currentLang === "en" ? "Page 1" : "Página 1";
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
    currentPage = 1; infraFiltered = null;
    if (search) search.value = "";
    syncSourceButtons();

    if (currentSource === "infra") renderItems();
    else {
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

  syncSourceButtons();
  if (counter) counter.textContent = currentSource === "infra" ? t("dyn.projectsCount", { n: INFRA_POSTS.length }) : t("dyn.loadingRepos");

  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase();
      currentPage = 1;
      if (currentSource === "infra") {
        const base = getInfraBaseItems();
        infraFiltered = base.filter((x) => x.title.toLowerCase().includes(term) || (x.desc || "").toLowerCase().includes(term));
        renderItems();
        return;
      }
      filteredRepos = allRepos.filter((r) => r.name.toLowerCase().includes(term) || (r.description || "").toLowerCase().includes(term));
      renderItems();
    });
  }

  if (prev) prev.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderItems(); } });
  if (next) next.addEventListener("click", () => {
    const totalPages = Math.ceil(getActiveItems().length / PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderItems(); }
  });

  const skillChips = $$(".skill-item");
  if (skillChips.length && search) {
    skillChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const skillName = chip.querySelector(".skill-name").textContent.trim();
        
        const projectsSection = $("#projects");
        if (projectsSection) {
          const headerOffset = 80;
          const elementPosition = projectsSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }

        search.value = skillName;
        search.dispatchEvent(new Event("input"));
      });
    });
  }

  fetchRepos();
}

function initScrollSpy() {
  const sections = $$("section[id]");
  const navLinks = $$(".nav a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) link.classList.add("active");
        });
      }
    });
  }, { rootMargin: "-20% 0px -70% 0px" });

  sections.forEach(sec => observer.observe(sec));
}

document.addEventListener("DOMContentLoaded", () => {
  initI18n(); initTheme(); initNav();
  initScrollHelpers(); initReveal(); initCursor(); initTabs();
  initModal(); initProjects(); initScrollSpy();
  initDeployResume();
  window.lucide && window.lucide.createIcons();

  if (window.matchMedia("(pointer: fine)").matches) {
    const tiltCards = document.querySelectorAll(".cert-tilt");
    tiltCards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = `none`; 
        
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        
        const glarePercent = (x / rect.width) * 100;
        card.style.setProperty("--glare-pos", `${glarePercent}%`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = `transform 0.5s ease`;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  }
});


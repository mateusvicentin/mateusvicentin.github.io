/* ============================================================
   CONFIG
============================================================ */
const GITHUB_USER = "mateusvicentin";
const PER_PAGE = 6;

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   THEME TOGGLE (Dark ↔ Light com LocalStorage)
============================================================ */
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

/* ============================================================
   TYPING EFFECT
============================================================ */
function initTyping() {
  const el = $("#typing");
  if (!el) return;

  const phrases = ["Engenheiro de Dados ", "Analista de Infraestrutura "];
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
    } else if (deleting && char === 0) {
      deleting = false;
      idx = (idx + 1) % phrases.length;
      delay = 550;
      el.style.opacity = 0.4;
      setTimeout(() => (el.style.opacity = 1), 120);
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ============================================================
   NAV MOBILE
============================================================ */
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

/* ============================================================
   SCROLL PROGRESS + BACK TO TOP
============================================================ */
function initScrollHelpers() {
  const bar = $("#scrollProgress");
  const topBtn = $("#backToTop");
  if (!bar || !topBtn) return;

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = `${progress}%`;

    topBtn.classList.toggle("visible", scrollTop > 350);
  });

  topBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

/* ============================================================
   REVEAL ON SCROLL
============================================================ */
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
    { threshold: 0.15 }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 40}ms`;
    observer.observe(el);
  });
}

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function initCursor() {
  const cursor = $("#cursor");
  if (!cursor) return;

  window.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.addEventListener("mouseover", (e) => {
    cursor.classList.toggle(
      "cursor--active",
      !!e.target.closest("a, button, .btn, .project-card")
    );
  });
}

/* ============================================================
   TABS (TRAJETÓRIA)
============================================================ */
function initTabs() {
  const tabs = document.querySelector(".tabs");
  if (!tabs) return;

  const buttons = tabs.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  function activate(tabName) {
    tabs.classList.remove("experience-active", "education-active");
    tabs.classList.add(`${tabName}-active`);

    buttons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.tab === tabName)
    );

    panels.forEach((panel) =>
      panel.classList.toggle("hidden", panel.id !== tabName)
    );
  }

  activate("experience");

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => activate(btn.dataset.tab))
  );
}

/* ============================================================
   MODAL (TIMELINE)
============================================================ */
function initModal() {
  const modal = $("#modal");
  const body = $("#modalBody");
  const closeBtn = $(".modal-close");
  if (!modal || !body || !closeBtn) return;

  const modals = {
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
    `,
  };

  $$(".timeline-more").forEach((btn) =>
    btn.addEventListener("click", () => {
      body.innerHTML = modals[btn.dataset.modalTarget] || "";
      modal.classList.add("open");
    })
  );

  const close = () => modal.classList.remove("open");
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
}

/* ============================================================
   FORMATTER DE NOMES
============================================================ */
function formatRepoName(name) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

let allRepos = [];
let filteredRepos = [];
let currentPage = 1;

/* ============================================================
   FETCH GITHUB
============================================================ */
async function fetchRepos() {
  const list = $("#projectList");
  const counter = $("#projectCount");

  list.innerHTML = "<p>Carregando projetos...</p>";
  counter.textContent = "Carregando...";

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`
    );
    let data = await res.json();

    allRepos = data.filter((r) => !r.fork);
    filteredRepos = [...allRepos];
    currentPage = 1;

    renderRepos();
  } catch (err) {
    list.innerHTML = "<p>Erro ao carregar.</p>";
    counter.textContent = "Falha ao carregar";
  }
}

/* ============================================================
   EXTRACT TAGS (mantido se quiser usar depois)
============================================================ */
const LANGUAGE_COLORS = {
  python: "#16a394",
  javascript: "#f59e0b",
  typescript: "#3b82f6",
  html: "#f97316",
  css: "#6366f1",
  dockerfile: "#0ea5e9",
  spark: "#d97706",
  kafka: "#8b5cf6",
  default: "#00c896",
};

function extractTags(repo) {
  const tags = [];

  if (repo.language) {
    const lang = repo.language.toLowerCase();
    tags.push({
      label: repo.language,
      color: LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default,
    });
  }

  const desc = (repo.description || "").toLowerCase();
  const keywords = ["python", "docker", "spark", "etl", "airflow", "kafka"];

  keywords.forEach((k) => {
    if (desc.includes(k)) {
      tags.push({ label: k.toUpperCase(), color: LANGUAGE_COLORS[k] });
    }
  });

  return tags;
}

/* ============================================================
   RENDER REPOS — COM PAGINAÇÃO
============================================================ */
function renderRepos() {
  const list = $("#projectList");
  const counter = $("#projectCount");
  const pageInfo = $("#pageInfo");
  const prev = $("#prevPage");
  const next = $("#nextPage");

  if (!filteredRepos.length) {
    list.innerHTML = "<p>Nenhum projeto encontrado.</p>";
    counter.textContent = "0 projetos";
    return;
  }

  const totalPages = Math.ceil(filteredRepos.length / PER_PAGE);
  const slice = filteredRepos.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  list.innerHTML = slice
    .map((repo) => {
      const niceName = formatRepoName(repo.name);

      return `
        <article class="project-card">
          <button class="project-link" onclick="window.open('${repo.html_url}', '_blank')">
            <i data-lucide="github"></i>
          </button>

          <h3 class="project-title">${niceName}</h3>
          <p class="project-desc">${repo.description || "Sem descrição"}</p>
        </article>
      `;
    })
    .join("");

  counter.textContent = `${filteredRepos.length} projeto(s)`;
  pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

  prev.disabled = currentPage === 1;
  next.disabled = currentPage === totalPages;

  window.lucide && window.lucide.createIcons();
}

/* ============================================================
   INIT PROJECTS
============================================================ */
function initProjects() {
  const search = $("#projectSearch");
  const prev = $("#prevPage");
  const next = $("#nextPage");

  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase();

      filteredRepos = allRepos.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          (r.description || "").toLowerCase().includes(term)
      );

      currentPage = 1;
      renderRepos();
    });
  }

  if (prev) {
    prev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderRepos();
      }
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredRepos.length / PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderRepos();
      }
    });
  }

  fetchRepos();
}



/* ============================================================
   INIT — MAIN
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTyping();
  initNav();
  initScrollHelpers();
  initReveal();
  initCursor();
  initTabs();
  initModal();
  initProjects();
  window.lucide && window.lucide.createIcons();
});

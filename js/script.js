let allRepos = [], currentPage = 1;
const perPage = 6;

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initPagination();
  initSearch();
  initCursor();
  initScrollProgress();
  initModals();
  loadProjects();
});

// Tabs
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      contents.forEach(content =>
        content.classList.toggle("hidden", content.id !== btn.dataset.tab)
      );
    });
  });
}

// Paginação
function initPagination() {
  document.getElementById("prevPage")?.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProjects();
    }
  });

  document.getElementById("nextPage")?.addEventListener("click", () => {
    const totalPages = Math.ceil(allRepos.length / perPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderProjects();
    }
  });
}

// Busca com debounce
function initSearch() {
  const input = document.getElementById("projectSearch");
  if (!input) return;

  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      currentPage = 1;
      renderProjects();
    }, 300);
  });
}

// Cursor customizado
function initCursor() {
  document.addEventListener("mousemove", e => {
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });
}

// Scroll progress e botão topo
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  const topBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = `${(scrolled / height) * 100}%`;
    if (topBtn) topBtn.classList.toggle("visible", scrolled > 300);
  });

  topBtn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// Modal de experiência
function initModals() {
  const modal = document.querySelector(".exp-modal");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-description");
  const closeBtn = document.querySelector(".modal-close");

  document.querySelectorAll(".timeline-content[data-modal]").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.classList.contains("btn-details")) {
        title.textContent = item.querySelector("h3").textContent;
        if (item.dataset.modal === "infra-details") {
          desc.innerHTML = `
            <ul>
              <li>Coordenação de equipe técnica de 8 membros</li>
              <li>Gestão de infraestrutura de TI com 200+ dispositivos</li>
              <li>Implantação de sistema de monitoramento Zabbix</li>
              <li>Redução de custos em 30%</li>
              <li>Gestão de servidores Linux/Windows</li>
            </ul>
            <p><strong>Tecnologias:</strong> Zabbix, Proxmox, Docker, Ansible, GitLab CI/CD</p>`;
        }
        modal.classList.add("active");
      }
    });
  });

  closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
  modal?.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
}

// Repositórios do GitHub
async function loadProjects() {
  try {
    showSkeletons();
    const res = await fetch("https://api.github.com/users/mateusvicentin/repos?sort=updated");
    const data = await res.json();
    allRepos = data.filter(repo => !repo.fork);
    renderProjects();
  } catch (err) {
    console.error("Erro ao carregar projetos:", err);
  }
}

// Skeleton loading
function showSkeletons() {
  const container = document.getElementById("project-list");
  container.innerHTML = "";
  for (let i = 0; i < perPage; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-title"></div>
      <div class="skeleton-line" style="width: 90%;"></div>
      <div class="skeleton-line" style="width: 70%;"></div>`;
    container.appendChild(card);
  }
}

// Renderizar projetos
function renderProjects() {
  const container = document.getElementById("project-list");
  const searchTerm = document.getElementById("projectSearch")?.value.toLowerCase() || "";

  const filtered = allRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm) ||
    (repo.description || "").toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  container.innerHTML = pageItems.length ? "" : "<p>Nenhum projeto encontrado.</p>";

  const fragment = document.createDocumentFragment();

  pageItems.forEach(repo => {
    const tags = getRepoTags(repo);
    const title = repo.description || repo.name.replace(/-/g, " ");
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header" data-aos="flip-left">
        <span class="material-symbols-outlined">folder</span>
        <div class="tech-tags">${tags.join("")}</div>
      </div>
      <div class="card-content">
        <h3 class="title-large">${title}</h3>
        <a href="${repo.html_url}" target="_blank" class="btn btn-outline">
          <span class="label-large">Ver no GitHub</span>
          <div class="state-layer"></div>
        </a>
      </div>`;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  updatePaginationControls(totalPages);
  lucide?.createIcons();
}

// Tags automáticas
function getRepoTags(repo) {
  const tags = [];
  const keywords = ["Python", "Docker", "MongoDB", "Spark", "Apache", "FastAPI"];
  if (repo.language) tags.push(`<span class="tag">${repo.language}</span>`);
  keywords.forEach(k => {
    if ((repo.description || "").toLowerCase().includes(k.toLowerCase())) {
      tags.push(`<span class="tag">${k}</span>`);
    }
  });
  return tags;
}

// Atualizar paginação
function updatePaginationControls(totalPages) {
  document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

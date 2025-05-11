let allRepos = [];
let currentPage = 1;
const perPage = 6;

// Configurações iniciais
document.addEventListener("DOMContentLoaded", () => {
  // Scroll inicial
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  // Inicialização de componentes
  initTabs();
  initPagination();
  initSearch();
  initCursor();
  initScrollProgress();
  initModals();
  loadProjects();
  
});

// Funções de inicialização
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const target = button.dataset.tab;
      tabContents.forEach(content => {
        content.classList.toggle("hidden", content.id !== target);
      });
    });
  });
}

function initPagination() {
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProjects();
    }
  });

  document.getElementById('nextPage')?.addEventListener('click', () => {
    const total = Math.ceil(allRepos.length / perPage);
    if (currentPage < total) {
      currentPage++;
      renderProjects();
    }
  });
}

function initSearch() {
  document.getElementById('projectSearch')?.addEventListener('input', () => {
    currentPage = 1;
    renderProjects();
  });
}

function initCursor() {
  document.addEventListener("mousemove", e => {
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  });
}

function initScrollProgress() {
  const scrollBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (scrollBar) scrollBar.style.width = `${progress}%`;
    if (backToTop) backToTop.classList.toggle("visible", scrollTop > 300);
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initModals() {
  const modal = document.querySelector('.exp-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');

  // Abrir modal
  document.querySelectorAll('.timeline-content[data-modal]').forEach(item => {
    item.addEventListener('click', (e) => {
      if(e.target.classList.contains('btn-details')) {
        const title = item.querySelector('h3').textContent;
        modalTitle.textContent = title;
        
        // Conteúdo dinâmico
        switch(item.dataset.modal) {
          case 'infra-details':
            modalDescription.innerHTML = `
              <ul>
                <li>Coordenação de equipe técnica de 8 membros</li>
                <li>Gestão de infraestrutura de TI com 200+ dispositivos</li>
                <li>Implantação de sistema de monitoramento Zabbix</li>
                <li>Otimização de custos reduzindo 30% em infraestrutura</li>
                <li>Gestão de servidores Linux/Windows</li>
              </ul>
              <p><strong>Tecnologias:</strong> Zabbix, Proxmox, Docker, Ansible, GitLab CI/CD</p>`;
            break;
          // Adicione outros casos conforme necessário
        }
        
        modal.classList.add('active');
      }
    });
  });

  // Fechar modal
  document.querySelector('.modal-close').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Funções de carregamento de projetos
async function loadProjects() {
  try {
    showSkeletons();
    const res = await fetch(`https://api.github.com/users/mateusvicentin/repos?sort=updated`);
    const data = await res.json();
    allRepos = data.filter(r => !r.fork);
    renderProjects();
  } catch (err) {
    console.error("Erro ao carregar repositórios:", err);
  }
}

function showSkeletons() {
  const container = document.getElementById('project-list');
  container.innerHTML = Array(6).fill().map(() => `
    <div class="skeleton-card">
      <div class="skeleton-title"></div>
      <div class="skeleton-line" style="width: 90%;"></div>
      <div class="skeleton-line" style="width: 70%;"></div>
    </div>
  `).join('');
}

function renderProjects() {
  const container = document.getElementById('project-list');
  const searchTerm = document.getElementById('projectSearch')?.value.toLowerCase() || "";
  
  const filtered = allRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm) ||
    (repo.description || "").toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageRepos = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  container.innerHTML = pageRepos.length ? '' : "<p>Nenhum projeto encontrado.</p>";
  
  pageRepos.forEach(repo => {
    const tags = getRepoTags(repo);
    const title = repo.description || repo.name.replace(/-/g, ' ');
    
    container.innerHTML += `
      <article class="card">
        <div class="card-header" data-aos="flip-left">
          <span class="material-symbols-outlined">folder</span>
          <div class="tech-tags">${tags.join('')}</div>
        </div>
        <div class="card-content">
          <h3 class="title-large">${title}</h3>
          <a href="${repo.html_url}" target="_blank" class="btn btn-outline">
            <span class="label-large">Ver no GitHub</span>
            <div class="state-layer"></div>
          </a>
        </div>
      </article>`;
  });

  updatePaginationControls(totalPages);
}

function getRepoTags(repo) {
  const tags = [];
  if (repo.language) tags.push(`<span class="tag">${repo.language}</span>`);
  ['Python', 'Docker', 'MongoDB', 'Spark', 'Apache', 'FastAPI'].forEach(tech => {
    if ((repo.description || '').toLowerCase().includes(tech.toLowerCase())) {
      tags.push(`<span class="tag">${tech}</span>`);
    }
  });
  return tags;
}



function updatePaginationControls(totalPages) {
  document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

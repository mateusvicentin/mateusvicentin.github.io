// script.js

let allRepos = [];
let currentPage = 1;
const perPage = 6;

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Troca botão ativo
      tabButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Troca conteúdo visível
      const target = button.dataset.tab;
      tabContents.forEach(content => {
        if (content.id === target) {
          content.classList.remove("hidden");
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });


  // Eventos de paginação
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

  // Filtro de busca
  document.getElementById('projectSearch')?.addEventListener('input', () => {
    currentPage = 1;
    renderProjects();
  });

  // Barra de progresso de scroll
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    const scrollBar = document.getElementById("scrollProgress");
    if (scrollBar) {
      scrollBar.style.width = `${progress}%`;
    }
  });

  // Carrega os projetos ao iniciar
  loadProjects();
});

// Busca os projetos do GitHub
async function loadProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/mateusvicentin/repos?sort=updated`);
    const data = await res.json();
    allRepos = data.filter(r => !r.fork);
    renderProjects();
  } catch (err) {
    console.error("Erro ao carregar repositórios:", err);
  }
}

// Renderiza os projetos
function renderProjects() {
  const container = document.getElementById('project-list');
  const search = document.getElementById('projectSearch')?.value.toLowerCase() || "";
  const filtered = allRepos.filter(repo =>
    repo.name.toLowerCase().includes(search) ||
    (repo.description || "").toLowerCase().includes(search)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const pageRepos = filtered.slice(start, start + perPage);

  container.innerHTML = "";
  if (filtered.length === 0) {
    container.innerHTML = "<p>Nenhum projeto encontrado.</p>";
    document.getElementById('pageInfo').textContent = "Página 1";
    return;
  }

  pageRepos.forEach(repo => {
    const tags = [];
    if (repo.language) tags.push(`<span class="tag">${repo.language}</span>`);
    ['Python', 'Docker', 'MongoDB', 'Spark', 'Apache', 'FastAPI'].forEach(k => {
      if ((repo.description || '').toLowerCase().includes(k.toLowerCase())) {
        tags.push(`<span class="tag">${k}</span>`);
      }
    });

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

  document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}

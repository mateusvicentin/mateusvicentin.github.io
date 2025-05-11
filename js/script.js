let allRepos = [];
let currentPage = 1;
const perPage = 6;

window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, 10);
});

window.onload = function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
if (window.location.hash) {
  history.replaceState(null, null, window.location.pathname);
}

document.addEventListener("DOMContentLoaded", () => {
  // Alternância entre abas: Experiência e Formação
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


  // Paginação de projetos
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

  

  // Busca de projetos
  document.getElementById('projectSearch')?.addEventListener('input', () => {
    currentPage = 1;
    renderProjects();
  });

  // Cursor personalizado
  document.addEventListener("mousemove", e => {
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
  });

  // Barra de progresso de scroll e botão "Voltar ao Topo"
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

  // Carrega os projetos do GitHub
  loadProjects();
});

// Exibe skeletons enquanto carrega projetos
function showSkeletons() {
  const container = document.getElementById('project-list');
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    container.innerHTML += `
      <div class="skeleton-card">
        <div class="skeleton-title"></div>
        <div class="skeleton-line" style="width: 90%;"></div>
        <div class="skeleton-line" style="width: 70%;"></div>
      </div>
    `;
  }
}

// Carrega repositórios do GitHub
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

// Renderiza os cards de projeto
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

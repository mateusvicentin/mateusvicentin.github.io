let allRepos = [];
let currentPage = 1;
const perPage = 6;

async function loadProjects() {
  const res = await fetch(`https://api.github.com/users/mateusvicentin/repos?sort=updated`);
  const data = await res.json();
  allRepos = data.filter(r => !r.fork);
  renderProjects();
}

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
    return;
  }

  pageRepos.forEach(repo => {
    const tags = [];
    if (repo.language) tags.push(`<span class="tag">${repo.language}</span>`);
    ['Python','Docker','MongoDB','Spark','Apache','FastAPI'].forEach(k => {
      if ((repo.description||'').toLowerCase().includes(k.toLowerCase())) tags.push(`<span class="tag">${k}</span>`);
    });
    const title = repo.description || repo.name.replace(/-/g,' ');
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

document.addEventListener('input', e => {
  if (e.target.id === 'projectSearch') {
    currentPage = 1;
    renderProjects();
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  currentPage--;
  renderProjects();
});
document.getElementById('nextPage').addEventListener('click', () => {
  currentPage++;
  renderProjects();
});

import { $, $$, escapeHtml, showView } from '../utils/dom.js';

let allResources = [];

export function initResourcesView(resources) {
  allResources = resources;
}

export async function showResources() {
  showView('resources-view');
  document.title = '资源 · SteinsGate';

  const container = $('#resources-container');

  if (allResources.length === 0) {
    try {
      const res = await fetch('data/resources.json');
      allResources = await res.json();
    } catch (err) {
      container.innerHTML = `
        <div class="error-state">
          <div class="error-icon">❌</div>
          <p>资源数据加载失败</p>
        </div>`;
      return;
    }
  }

  const defaultCategory = 0;

  container.innerHTML = `
    <div class="res-categories">
      ${allResources.map((group, index) => `
        <button class="res-category-btn ${index === defaultCategory ? 'active' : ''}" 
                data-category-index="${index}">
          <span class="category-icon">${group.icon}</span>
          <span class="category-name">${group.category}</span>
        </button>
      `).join('')}
    </div>
    <div class="res-content-area">
      <div class="res-grid" id="res-grid-content">
        ${allResources[defaultCategory].items.map(item => `
          <a class="res-card" href="${item.url}" target="_blank" rel="noopener">
            <h3 class="res-card-title">${escapeHtml(item.title)}</h3>
            <p class="res-card-desc">${escapeHtml(item.desc)}</p>
            <span class="res-card-link">访问 →</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  $$('.res-category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      $$('.res-category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const categoryIndex = parseInt(this.getAttribute('data-category-index'));
      const category = allResources[categoryIndex];

      const contentArea = $('#res-grid-content');
      
      contentArea.innerHTML = category.items.map((item) => `
        <a class="res-card" href="${item.url}" target="_blank" rel="noopener">
          <h3 class="res-card-title">${escapeHtml(item.title)}</h3>
          <p class="res-card-desc">${escapeHtml(item.desc)}</p>
          <span class="res-card-link">访问 →</span>
        </a>
      `).join('');
    });
  });
}
import { $, $$, escapeHtml, showView } from '../utils/dom.js';
import { formatDate } from '../utils/date.js';
import { getCategoryStyle } from '../utils/categories.js';
import { navigate } from '../utils/router.js';

let allPosts = [];
let currentCategory = 'all';

export function initListView(posts) {
  allPosts = posts;
}

export function showList() {
  showView('list-view');
  renderPosts();
}

function renderPosts() {
  const grid = $('#posts-grid');
  const categoryEl = $('#categories');

  const cats = new Set(allPosts.map(p => p.category));
  categoryEl.innerHTML = `
    <button class="cat-pill active" data-cat="all">全部</button>
    ${[...cats].map(cat => {
      const style = getCategoryStyle(cat);
      return `<button class="cat-pill" data-cat="${cat}">${style.label}</button>`;
    }).join('')}
  `;

  $$('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat;
      filterPosts();
    });
  });

  filterPosts();
}

function filterPosts() {
  const grid = $('#posts-grid');
  let filtered = allPosts;

  if (currentCategory !== 'all') {
    filtered = allPosts.filter(p => p.category === currentCategory);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1">
        <div class="empty-icon">📭</div>
        <p>暂无相关文章</p>
      </div>
    `;
    return;
  }

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  grid.innerHTML = filtered.map(post => {
    const cat = getCategoryStyle(post.category);
    return `
      <div class="post-card" data-post-id="${post.id}">
        <span class="post-card-category" style="background:${cat.bg};color:${cat.text}">
          ${cat.label}
        </span>
        <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
        <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="post-card-meta">
          <span>${formatDate(post.date)}</span>
          <span class="dot"></span>
          <span>${post.tags ? post.tags.map(t => '#' + t).join(' ') : ''}</span>
        </div>
      </div>
    `;
  }).join('');

  $$('.post-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate(`/article/${card.dataset.postId}`);
    });
  });
}
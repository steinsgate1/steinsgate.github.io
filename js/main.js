(function () {
  'use strict';

  let allPosts = [];
  let allResources = [];
  let currentCategory = 'all';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ========== Category Colors ==========
  const CAT_COLORS = {
    tech: { bg: '#eff6ff', text: '#2563eb', label: '技术' },
    life: { bg: '#ecfdf5', text: '#059669', label: '生活' },
    essay: { bg: '#fffbeb', text: '#d97706', label: '随笔' },
    travel: { bg: '#f5f3ff', text: '#7c3aed', label: '旅行' },
    reading: { bg: '#fdf2f8', text: '#db2777', label: '阅读' },
  };

  function getCategoryStyle(cat) {
    return CAT_COLORS[cat] || { bg: '#f1f5f9', text: '#64748b', label: cat };
  }

  // ========== Date Formatting ==========
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y} 年 ${m} 月 ${day} 日`;
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${m}-${day}`;
  }

  function getReadingTime(text) {
    const cnChars = (text.match(/[一-鿿]/g) || []).length;
    const words = text.split(/\s+/).length;
    const wpm = 200;
    const minutes = Math.ceil((cnChars / 2 + words) / wpm) || 1;
    return `阅读约 ${minutes} 分钟`;
  }

  // ========== Router ==========
  function getRoute() {
    const hash = location.hash.slice(1) || '/';
    return hash;
  }

  function navigate(hash) {
    history.pushState(null, '', `#${hash}`);
    handleRoute();
  }

  function handleRoute() {
    const route = getRoute();

    if (route.startsWith('/article/')) {
      const postId = route.replace('/article/', '');
      showArticle(postId);
    } else if (route === '/posts' || route === '/' || route === '') {
      showList();
    } else if (route === '/resources') {
      showResources();
    } else {
      showList();
    }

    updateSidebarNav(route);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateSidebarNav(route) {
    $$('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    
    let navRoute = route;
    if (route === '/' || route === '') {
      navRoute = '/posts';
    }
    
    const activeLink = document.querySelector(`.sidebar-nav a[href="#${navRoute}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // ========== List View ==========
  function showList() {
    showView('list-view');
    renderPosts();
  }

  function renderPosts() {
    const grid = $('#posts-grid');
    const categoryEl = $('#categories');

    // Render categories
    const cats = new Set(allPosts.map(p => p.category));
    categoryEl.innerHTML = `
      <button class="cat-pill active" data-cat="all">全部</button>
      ${[...cats].map(cat => {
        const style = getCategoryStyle(cat);
        return `<button class="cat-pill" data-cat="${cat}">${style.label}</button>`;
      }).join('')}
    `;

    // Category click handler
    $$('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        filterPosts();
      });
    });

    // Also render year-grouped archive
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

    // Sort by date descending
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

    // Card click → article
    $$('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        navigate(`/article/${card.dataset.postId}`);
      });
    });
  }

  // ========== Article View ==========
  async function showArticle(postId) {
    showView('article-view');

    const titleEl = $('#article-title');
    const metaEl = $('#article-meta');
    const contentEl = $('#article-content');
    const tagsEl = $('#article-tags');

    const post = allPosts.find(p => p.id === postId);

    if (!post) {
      titleEl.textContent = '文章未找到';
      metaEl.innerHTML = '';
      contentEl.innerHTML = `
        <div class="error-state">
          <div class="error-icon">🔍</div>
          <p>找不到这篇文章</p>
          <button class="retry-btn" onclick="location.hash=''">返回首页</button>
        </div>
      `;
      return;
    }

    // Set header
    const cat = getCategoryStyle(post.category);
    titleEl.textContent = post.title;
    metaEl.innerHTML = `
      <span class="post-card-category" style="background:${cat.bg};color:${cat.text}">
        ${cat.label}
      </span>
      <span>${formatDate(post.date)}</span>
    `;

    if (post.tags && post.tags.length > 0) {
      tagsEl.innerHTML = post.tags.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('');
    } else {
      tagsEl.innerHTML = '';
    }

    // Loading state
    contentEl.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    `;

    try {
      const res = await fetch(post.file);
      if (!res.ok) throw new Error('Not found');
      const markdown = await res.text();

      const readingTime = getReadingTime(markdown);
      metaEl.innerHTML += `<span class="dot"></span><span>${readingTime}</span>`;

      document.title = `${post.title} · SteinsGate`;

      contentEl.innerHTML = marked.parse(markdown, { breaks: true });

      // Highlight code blocks with data-language if available
      contentEl.querySelectorAll('pre code').forEach(block => {
        const parent = block.parentElement;
        const lang = block.className.replace('language-', '');
        if (lang && lang !== block.className) {
          parent.setAttribute('data-language', lang);
        }
      });

    } catch (err) {
      contentEl.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <p>文章加载失败，请稍后重试</p>
          <button class="retry-btn" onclick="location.hash=''">返回首页</button>
        </div>
      `;
    }
  }

  // ========== Resources View ==========
  async function showResources() {
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
              <h3 class="res-card-title">🔗 ${escapeHtml(item.title)}</h3>
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
        
        contentArea.innerHTML = category.items.map((item, idx) => `
          <a class="res-card" href="${item.url}" target="_blank" rel="noopener">
            <h3 class="res-card-title">🔗 ${escapeHtml(item.title)}</h3>
            <p class="res-card-desc">${escapeHtml(item.desc)}</p>
            <span class="res-card-link">访问 →</span>
          </a>
        `).join('');
      });
    });
  }

  // ========== Utils ==========
  function showView(viewId) {
    $$('.view').forEach(v => v.classList.remove('active'));
    $(`#${viewId}`).classList.add('active');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========== Scroll to Top ==========
  function initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========== Sidebar Toggle ==========
  function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // ========== Init ==========
  async function init() {
    document.title = 'SteinsGate · 个人博客';

    try {
      const res = await fetch('data/posts.json');
      allPosts = await res.json();
    } catch (err) {
      console.error('Failed to load posts:', err);
      $('#posts-grid').innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">❌</div>
          <p>博客数据加载失败</p>
        </div>
      `;
      return;
    }

    handleRoute();

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
  }

  // ========== DOM Ready ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initScrollTop();
      initSidebarToggle();
    });
  } else {
    init();
    initScrollTop();
    initSidebarToggle();
  }

})();

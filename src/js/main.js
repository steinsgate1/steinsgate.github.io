import { getRoute, navigate, updateSidebarNav } from './utils/router.js';
import { initListView, showList } from './views/ListView.js';
import { initArticleView, showArticle } from './views/ArticleView.js';
import { showResources } from './views/ResourcesView.js';
import { initScrollTop } from './components/ScrollTop.js';
import { initSidebarToggle } from './components/Sidebar.js';

async function handleRoute() {
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

async function init() {
  document.title = 'SteinsGate · 个人博客';

  try {
    const res = await fetch('data/posts.json');
    const allPosts = await res.json();
    
    initListView(allPosts);
    initArticleView(allPosts);
  } catch (err) {
    console.error('Failed to load posts:', err);
    const grid = document.getElementById('posts-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">❌</div>
          <p>博客数据加载失败</p>
        </div>
      `;
    }
    return;
  }

  handleRoute();

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('popstate', handleRoute);
}

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
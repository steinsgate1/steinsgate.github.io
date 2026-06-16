import { $, escapeHtml, showView } from '../utils/dom.js';
import { formatDate, getReadingTime } from '../utils/date.js';
import { getCategoryStyle } from '../utils/categories.js';

let allPosts = [];

export function initArticleView(posts) {
  allPosts = posts;
}

export async function showArticle(postId) {
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
export function getRoute() {
  const hash = location.hash.slice(1) || '/';
  return hash;
}

export function navigate(hash) {
  history.pushState(null, '', `#${hash}`);
}

export function updateSidebarNav(route) {
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  
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
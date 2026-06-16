export function $(sel, ctx = document) {
  return ctx.querySelector(sel);
}

export function $$(sel, ctx = document) {
  return [...ctx.querySelectorAll(sel)];
}

export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function showView(viewId) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#${viewId}`).classList.add('active');
}
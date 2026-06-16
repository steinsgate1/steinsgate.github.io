export function formatDate(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y} 年 ${m} 月 ${day} 日`;
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}-${day}`;
}

export function getReadingTime(text) {
  const cnChars = (text.match(/[一-鿿]/g) || []).length;
  const words = text.split(/\s+/).length;
  const wpm = 200;
  const minutes = Math.ceil((cnChars / 2 + words) / wpm) || 1;
  return `阅读约 ${minutes} 分钟`;
}
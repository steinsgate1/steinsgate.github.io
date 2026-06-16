export const CAT_COLORS = {
  tech: { bg: '#eff6ff', text: '#2563eb', label: '技术' },
  life: { bg: '#ecfdf5', text: '#059669', label: '生活' },
  essay: { bg: '#fffbeb', text: '#d97706', label: '随笔' },
  travel: { bg: '#f5f3ff', text: '#7c3aed', label: '旅行' },
  reading: { bg: '#fdf2f8', text: '#db2777', label: '阅读' },
};

export function getCategoryStyle(cat) {
  return CAT_COLORS[cat] || { bg: '#f1f5f9', text: '#64748b', label: cat };
}
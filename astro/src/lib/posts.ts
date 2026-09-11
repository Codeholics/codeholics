export const PAGE_SIZE = 10;

export function loadPosts() {
  const modules = import.meta.glob('../content/posts/*.md', { eager: true });
  const posts = Object.entries(modules).map(([path, mod]) => {
    const fileName = path.split('/').pop();
    const slug = fileName.replace('.md', '');
    return { slug, frontmatter: (mod as any).frontmatter, Content: (mod as any).default };
  }).sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  return posts;
}

export function paginate(posts, page = 1, pageSize = PAGE_SIZE) {
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Number(page)), totalPages);
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const items = posts.slice(start, end);
  return { items, current, totalPages, total };
}

export function getAllTags(posts) {
  const map = new Map();
  for (const p of posts) {
    const tags = (p.frontmatter.tags || '')
      .toString()
      .split(/,\s*/)
      .map((t) => t.trim())
      .filter(Boolean);
    for (const t of tags) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([tag, count]) => ({ tag, count })).sort((a,b)=>b.count-a.count);
}

export function getAllCategories(posts) {
  const map = new Map();
  for (const p of posts) {
    const cat = (p.frontmatter.category || '').toString().trim();
    if (cat) map.set(cat, (map.get(cat) || 0) + 1);
  }
  return Array.from(map.entries()).map(([category, count]) => ({ category, count }));
}

export function postsByTag(posts, tag) {
  const t = tag.toString().toLowerCase();
  return posts.filter(p => (p.frontmatter.tags||'').toString().toLowerCase().split(',').map(s=>s.trim()).includes(t));
}

export function postsByCategory(posts, category) {
  const c = category.toString().toLowerCase();
  return posts.filter(p => ((p.frontmatter.category||'')+'').toString().toLowerCase() === c);
}

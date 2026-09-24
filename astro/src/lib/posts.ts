import { getCollection, render, type CollectionEntry } from 'astro:content';

export const PAGE_SIZE = 10;

type PostFrontmatter = Record<string, unknown>;
type PostRecord = {
  slug: string;
  frontmatter: PostFrontmatter;
  body: string;
  entry: CollectionEntry<'posts'>;
};

function resolveSlug(entry: CollectionEntry<'posts'>) {
  const frontmatterSlug = entry.data.slug;
  if (typeof frontmatterSlug === 'string' && frontmatterSlug.trim()) {
    return frontmatterSlug.trim();
  }

  return entry.id.replace(/\.mdx?$/, '');
}

function isDraft(frontmatter: PostFrontmatter) {
  const explicitDraft = frontmatter.draft;
  if (typeof explicitDraft === 'boolean') return explicitDraft;

  const publicationState = [frontmatter.status, frontmatter.state]
    .find((value) => typeof value === 'string')
    ?.toString()
    .trim()
    .toLowerCase();

  return publicationState === 'draft';
}

export async function loadPosts() {
  const entries = await getCollection('posts');
  const posts: PostRecord[] = entries.map((entry) => {
    return {
      slug: resolveSlug(entry),
      frontmatter: entry.data,
      body: entry.body,
      entry,
    };
  })
    .filter((post) => !isDraft(post.frontmatter))
    .sort((a, b) => new Date(String(b.frontmatter.date ?? '')).getTime() - new Date(String(a.frontmatter.date ?? '')).getTime());
  return posts;
}

export async function getPostBySlug(slug: string) {
  const post = (await loadPosts()).find((entry) => entry.slug === slug);
  if (!post) return undefined;

  const { Content } = await render(post.entry);

  return {
    ...post,
    Content,
  };
}

export function stripMarkdown(raw = '') {
  return raw
    .replace(/^---[\s\S]*?---/, ' ')
    .replace(/^\s*import\s+.+$/gm, ' ')
    .replace(/^\s*export\s+.+$/gm, ' ')
    .replace(/\{%\s*youtube\s+[^%]+\s*%\}/g, ' ')
    .replace(/<\/?[A-Z][\w.-]*\b[^>]*\/?>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildExcerpt(text = '', maxLength = 220) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function getPostDescription(post: PostRecord, maxLength = 220) {
  const summary = (post.frontmatter.summary || '').toString().trim();
  if (summary) return summary;
  return buildExcerpt(stripMarkdown(post.body), maxLength);
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

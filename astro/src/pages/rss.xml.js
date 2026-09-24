import rss from '@astrojs/rss';
import { getPostDescription, loadPosts } from '../lib/posts';
import { SITE_URL } from '../../site.config.mjs';

export async function GET() {
  const posts = await loadPosts();

  return rss({
    title: 'Codeholics',
    description: 'Published posts from Codeholics.',
    site: SITE_URL,
    items: posts.map((post) => ({
      title: (post.frontmatter.title || post.slug).toString(),
      description: getPostDescription(post),
      link: `/posts/${post.slug}/`,
      pubDate: new Date(String(post.frontmatter.date ?? '')),
    })),
  });
}

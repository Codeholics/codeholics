import rss from '@astrojs/rss';
import { getPostDescription, loadPosts } from '../lib/posts';

export function GET(context) {
  const posts = loadPosts();

  return rss({
    title: 'Codeholics',
    description: 'Published posts from Codeholics.',
    site: context.site,
    items: posts.map((post) => ({
      title: (post.frontmatter.title || post.slug).toString(),
      description: getPostDescription(post),
      link: `/posts/${post.slug}/`,
      pubDate: new Date(String(post.frontmatter.date ?? '')),
    })),
  });
}

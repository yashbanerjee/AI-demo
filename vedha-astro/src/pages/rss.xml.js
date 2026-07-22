import rss from '@astrojs/rss';
import { listPosts } from '../lib/db';

export async function GET(context) {
  let posts = [];
  try {
    posts = await listPosts();
  } catch (error) {
    console.error('Unable to include posts in RSS:', error);
  }
  return rss({
    title: 'VEDHA Blog',
    description:
      'Smart insights on web development, AI, e-commerce and digital transformation from the Vedha team in Dubai.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: post.pub_date,
      link: `/blog/${post.slug}/`,
    })),
  });
}

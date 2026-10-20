import rss from '@astrojs/rss';
import { articlesPublies, publieLe } from '../../lib/journal';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return rss({
    title: 'Le Journal de PLT Family Office',
    description: 'Gestion de patrimoine, transmission et fiscalité : les analyses des fondateurs de PLT Family Office.',
    site: context.site,
    items: (await articlesPublies()).map((a) => ({
      title: a.data.title,
      description: a.data.meta_description,
      pubDate: new Date(`${publieLe(a)}T06:00:00Z`),
      link: `${base}/journal/${a.data.slug}`,
      author: a.data.auteur,
    })),
    customData: '<language>fr-fr</language>',
  });
}

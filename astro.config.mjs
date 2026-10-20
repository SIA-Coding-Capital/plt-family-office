import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeJournal from './src/lib/rehype-journal.mjs';
import { slugsPublies } from './src/lib/publication.mjs';

// SITE_URL et BASE_PATH permettent de prévisualiser sur github.io avant de brancher le domaine.
const site = process.env.SITE_URL || 'https://www.plt-family-office.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })],
  markdown: {
    processor: unified({ smartypants: false, rehypePlugins: [[rehypeJournal, { publies: slugsPublies(), base }]] }),
  },
});

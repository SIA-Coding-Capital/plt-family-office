import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/journal', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    mot_cle_principal: z.string(),
    mots_cles_secondaires: z.array(z.string()).default([]),
    auteur: z.string(),
    ordre_publication: z.number(),
    date_mise_a_jour: z.coerce.date(),
    resume_geo: z.string(),
    liens_internes: z.array(z.string()).default([]),
    videos: z
      .array(
        z.object({
          id: z.string(),
          titre: z.string(),
          url: z.string(),
          date_publication: z.coerce.date(),
          duree: z.string(),
          passages: z.array(z.object({ t: z.number(), label: z.string() })).default([]),
        }),
      )
      .default([]),
    faq: z.array(z.object({ q: z.string(), r: z.string() })).default([]),
    sources: z.array(z.string()).default([]),
  }),
});

const auteurs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/auteurs' }),
  schema: z.object({
    title: z.string(),
    meta_description: z.string(),
    slug: z.string(),
    nom: z.string(),
    fonction: z.string(),
    organisation: z.string(),
    same_as: z.array(z.string()).default([]),
    expertise: z.array(z.string()).default([]),
    date_mise_a_jour: z.coerce.date(),
  }),
});

export const collections = { journal, auteurs };

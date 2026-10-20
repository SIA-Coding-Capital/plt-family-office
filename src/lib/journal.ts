import { getCollection, type CollectionEntry } from 'astro:content';
import grappes from '../data/grappes.json';
import { datePublication, estPublie } from './publication.mjs';

export type Article = CollectionEntry<'journal'>;

// Articles sortis, du plus récent au plus ancien.
export async function articlesPublies(): Promise<Article[]> {
  const tous = await getCollection('journal', (a) => estPublie(a.data.ordre_publication));
  return tous.sort((a, b) => b.data.ordre_publication - a.data.ordre_publication);
}

export const publieLe = (a: Article) => datePublication(a.data.ordre_publication);

// La date de mise à jour affichée n'est jamais antérieure à la date de sortie.
export const misAJourLe = (a: Article) => {
  const maj = a.data.date_mise_a_jour.toISOString().slice(0, 10);
  const pub = publieLe(a);
  return maj > pub ? maj : pub;
};

export const grappe = (a: Article) => (grappes as Record<string, string>)[String(Number(a.id.split('-')[0]))] ?? 'Patrimoine';

export const minutes = (a: Article) => Math.max(3, Math.round((a.body ?? '').split(/\s+/).length / 230));

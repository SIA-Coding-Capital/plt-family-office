// Calendrier : l'article n° N (ordre_publication) sort le jour LANCEMENT + N - 1, à Paris.
// Le site est reconstruit chaque matin ; seuls les articles déjà sortis sont générés et liés.
import fs from 'node:fs';
import path from 'node:path';

export const LANCEMENT = process.env.PUBLICATION_START || '2026-11-02';
const TOUT_AFFICHER = process.env.SHOW_ALL === '1';

const jourParis = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d);

export const aujourdhui = () => process.env.BUILD_DATE || jourParis();

export function datePublication(ordre) {
  const d = new Date(`${LANCEMENT}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + ordre - 1);
  return d.toISOString().slice(0, 10);
}

export const estPublie = (ordre) => TOUT_AFFICHER || datePublication(ordre) <= aujourdhui();

// Slugs publiés, lus directement dans les fichiers (utilisé par la config Markdown).
export function slugsPublies(dossier = path.resolve(import.meta.dirname, '../content/journal')) {
  const slugs = new Set();
  for (const f of fs.readdirSync(dossier).filter((f) => f.endsWith('.md'))) {
    const tete = fs.readFileSync(path.join(dossier, f), 'utf8').split('\n---')[0];
    const slug = tete.match(/^slug:\s*(\S+)/m)?.[1];
    const ordre = Number(tete.match(/^ordre_publication:\s*(\d+)/m)?.[1]);
    if (slug && estPublie(ordre)) slugs.add(slug);
  }
  return slugs;
}

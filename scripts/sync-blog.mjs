// Copie les articles et pages auteur du dossier éditorial vers src/content,
// et extrait la grappe de chaque article depuis le calendrier du README.
// Usage : node scripts/sync-blog.mjs [dossier_blog]
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2] || '/mnt/project-files/blog';
const root = path.resolve(import.meta.dirname, '..');

for (const [from, to] of [['articles', 'src/content/journal'], ['auteurs', 'src/content/auteurs']]) {
  const dest = path.join(root, to);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(path.join(src, from)).filter((f) => f.endsWith('.md'))) {
    fs.copyFileSync(path.join(src, from, f), path.join(dest, f));
  }
}

// Repère les colonnes « N° » et « Grappe » dans l'en-tête du tableau du calendrier.
const grappes = {};
let colNum = -1;
let colGrappe = -1;
for (const line of fs.readFileSync(path.join(src, 'README.md'), 'utf8').split('\n')) {
  if (!line.startsWith('|')) continue;
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.includes('N°') && cells.includes('Grappe')) {
    colNum = cells.indexOf('N°');
    colGrappe = cells.indexOf('Grappe');
  } else if (colNum >= 0 && /^\d+$/.test(cells[colNum] ?? '')) {
    grappes[Number(cells[colNum])] = cells[colGrappe];
  }
}
fs.writeFileSync(path.join(root, 'src/data/grappes.json'), JSON.stringify(grappes, null, 2) + '\n');
console.log(`${Object.keys(grappes).length} grappes, articles copiés depuis ${src}`);

// Mise en forme des articles du journal au moment du build :
// en-tête retiré (le gabarit l'affiche), liens vers des articles pas encore sortis neutralisés,
// encadrés typés, tableaux défilants et lecteur YouTube léger (chargé au clic).
import { visit, SKIP } from 'unist-util-visit';

const texte = (n) => (n.type === 'text' ? n.value : (n.children || []).map(texte).join(''));
const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

export default function rehypeJournal({ publies, base = '/', formulaire }) {
  const prefixe = base.replace(/\/$/, '');
  return (tree, file) => {
    // 1. Titre et signature des articles : rendus par le gabarit
    const article = /content[\\/]journal[\\/]/.test(file?.path || '');
    const i = article ? tree.children.findIndex((n) => n.tagName === 'h1') : -1;
    if (i >= 0) {
      tree.children.splice(i, 1);
      const j = tree.children.findIndex((n) => n.type === 'element');
      if (j >= 0 && tree.children[j].tagName === 'p' && /^Par /.test(texte(tree.children[j]))) tree.children.splice(j, 1);
    }

    visit(tree, (node, index, parent) => {
      if (!parent) return;
      // Typographie française : pas de retour à la ligne avant : ; ? ! »
      if (node.type === 'text') node.value = node.value.replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0').replace(/(\d) (?=\d{3}\b|%|€)/g, '$1\u00a0');
      // 2. Liens internes
      if (node.tagName === 'a') {
        const href = String(node.properties.href || '');
        const m = href.match(/^\/journal\/([^/#?]+)/);
        if (m && !publies.has(m[1])) {
          // « [Titre](lien) : description » dans une liste : l'entrée entière attend la sortie de l'article
          const premier = parent.children.find((c) => c.type !== 'text' || c.value.trim());
          if (parent.tagName === 'li' && premier === node) {
            parent.properties.dataRetirer = true;
          } else {
            parent.children.splice(index, 1, ...node.children);
            return [SKIP, index];
          }
        } else if (href === '/candidater' && formulaire) {
          node.properties.href = formulaire;
          node.properties.rel = ['noopener'];
        } else if (href.startsWith('/')) {
          node.properties.href = prefixe + href;
        } else if (/^https?:/.test(href)) {
          node.properties.rel = ['noopener'];
        }
      }
      // 3. Encadrés
      if (node.tagName === 'blockquote') {
        const t = texte(node).trim();
        if (t.startsWith("L'essentiel")) node.properties.className = ['essentiel'];
        else if (t.startsWith('Attention')) node.properties.className = ['attention'];
      }
      // 4. Tableaux
      if (node.tagName === 'table' && parent.properties?.className?.[0] !== 'tableau') {
        parent.children[index] = el('div', { className: ['tableau'] }, [node]);
        return SKIP;
      }
      // 5. Lecteur YouTube : façade légère, l'iframe ne se charge qu'au clic
      if (node.type === 'raw' || node.type === 'comment') {
        const m = String(node.value).match(/Lecteur YouTube à intégrer ici\s*:\s*([\w-]{11})/);
        if (m) {
          parent.children[index] = el('div', { className: ['video'], dataId: m[1] }, [
            el('img', { src: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`, alt: '', loading: 'lazy', decoding: 'async', width: 480, height: 360 }),
            el('button', { type: 'button', ariaLabel: 'Lire la vidéo' }, [el('span', { ariaHidden: 'true' })]),
          ]);
          return SKIP;
        }
      }
    });

    // Éléments de liste vers des articles à venir, puis listes et sections devenues vides
    visit(tree, 'element', (node) => {
      if (node.children) node.children = node.children.filter((c) => !c.properties?.dataRetirer);
    });
    const kids = tree.children;
    for (let k = kids.length - 1; k >= 0; k--) {
      if (kids[k].tagName !== 'ul' || kids[k].children.some((c) => c.tagName === 'li')) continue;
      let h = k - 1;
      while (h >= 0 && kids[h].type === 'text' && !kids[h].value.trim()) h--;
      const debut = h >= 0 && /^h[23]$/.test(kids[h].tagName) ? h : k;
      kids.splice(debut, k - debut + 1);
      k = debut;
    }
  };
}

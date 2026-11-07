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

// Catégories du Journal : ordre d'affichage, adresse /journal/categorie/<slug> et textes SEO.
export const CATEGORIES = [
  {
    nom: 'Transmission et succession',
    slug: 'transmission-succession',
    description:
      "Donation, démembrement, assurance-vie, pacte Dutreil, SCI familiale : nos analyses pour préparer et alléger la transmission de votre patrimoine.",
    chapo: "Préparer sa succession, donner de son vivant, protéger son conjoint et ses enfants : les outils de la transmission expliqués simplement, chiffres à l'appui.",
  },
  {
    nom: 'Enveloppes et fiscalité',
    slug: 'enveloppes-fiscalite',
    description:
      "Assurance-vie française et luxembourgeoise, compte-titres, PEA, frais cachés : comment choisir et optimiser les enveloppes qui portent votre patrimoine.",
    chapo: "Assurance-vie, compte-titres, PEA, contrat luxembourgeois : ce que chaque enveloppe permet, ce qu'elle coûte et comment elle se transmet.",
  },
  {
    nom: 'Allocation et investissement',
    slug: 'allocation-investissement',
    description:
      "Allocation d'actifs, private equity, obligations, ETF, small caps, devises : nos analyses pour investir un patrimoine important avec méthode.",
    chapo: "Construire une allocation solide, choisir ses fonds, diversifier sans se disperser : notre lecture des marchés et des classes d'actifs pour les patrimoines importants.",
  },
  {
    nom: 'Dirigeants et international',
    slug: 'dirigeants-international',
    description:
      "Holding, cession d'entreprise, rémunération du dirigeant, trésorerie, crédit lombard, expatriation : le patrimoine du chef d'entreprise et des familles mobiles.",
    chapo: "Holding patrimoniale, cession, trésorerie d'entreprise, départ à l'étranger : les sujets propres aux dirigeants et aux familles qui vivent entre plusieurs pays.",
  },
  {
    nom: 'Choisir son accompagnement',
    slug: 'choisir-son-accompagnement',
    description:
      "Family office, banque privée ou CGP, honoraires ou rétrocessions, audit patrimonial : les clés pour bien choisir qui vous accompagne.",
    chapo: "Multi-family office, banque privée, conseiller indépendant : comprendre les modèles, leurs coûts et leurs conflits d'intérêts pour choisir en connaissance de cause.",
  },
] as const;

export type Categorie = (typeof CATEGORIES)[number];

export const categorie = (a: Article) => CATEGORIES.find((c) => c.nom === grappe(a));
export const lienCategorie = (c: Categorie) => `/journal/categorie/${c.slug}`;

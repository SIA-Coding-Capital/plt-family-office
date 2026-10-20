export const SITE = {
  nom: 'PLT Family Office',
  description:
    "Multi-Family Office indépendant à Paris. Nous aidons entrepreneurs, dirigeants et familles à structurer, protéger et transmettre leur patrimoine, à partir de 300 000 € d'actifs.",
  formulaire: 'https://forms.gle/78iLjWRAvM94KBA48',
  linkedin: 'https://www.linkedin.com/company/plt-family-office/',
  youtube: 'https://www.youtube.com/@parlons-long-terme',
  adresse: { rue: '1 passage des Acacias', cp: '75017', ville: 'Paris', pays: 'FR' },
  email: 'sebastien@parlons-long-terme.com',
};

// Chemin interne tenant compte du sous-dossier éventuel (prévisualisation github.io).
export const lien = (chemin: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + chemin;

export const dateLongue = (d: Date | string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d));

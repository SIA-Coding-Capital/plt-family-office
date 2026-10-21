# PLT Family Office

Site de [PLT Family Office](https://www.plt-family-office.com) : la page d'accueil et le Journal (blog SEO).

Site 100 % statique généré avec [Astro](https://astro.build) : du HTML et du CSS intégré, aucune dépendance JavaScript côté navigateur hormis un petit script d'animations (environ 3 Ko). Polices auto-hébergées, aucune requête vers un service tiers au chargement.

## Démarrer

```sh
npm install
npm run dev          # http://localhost:4321
SHOW_ALL=1 npm run dev   # affiche aussi les articles pas encore sortis
npm run build        # génère dist/
```

## Le Journal

- Les articles sont dans `src/content/journal/`, un fichier Markdown par article. L'en-tête YAML porte le titre SEO, la meta description, l'ordre de publication, la FAQ, les vidéos et les sources.
- Ils viennent du dossier éditorial du projet : `npm run sync-blog -- /chemin/vers/blog` recopie `articles/` et `auteurs/` et relit les thèmes (grappes) dans le calendrier du `README.md`.
- **10 articles au lancement, puis un par jour.** Les 10 premiers (`ordre_publication` 1 à 10) sortent le jour `PUBLICATION_START` (par défaut le 20 octobre 2026), puis l'article n° N sort le jour `PUBLICATION_START + N - 10`. La taille du premier lot se règle avec `PUBLICATION_FIRST_BATCH`. Le site est reconstruit chaque matin vers 6 h (heure de Paris) par GitHub Actions : seuls les articles déjà sortis sont générés, listés dans le sitemap et le flux RSS, et liés depuis les autres articles. Un lien vers un article à venir est affiché comme du texte simple, et les entrées « À lire aussi » correspondantes sont masquées jusqu'à sa sortie.
- Le commentaire `<!-- Lecteur YouTube à intégrer ici : ID -->` devient un lecteur léger : seule la miniature est chargée, la vidéo (youtube-nocookie) ne se charge qu'au clic.

## SEO

- URL propres (`/journal/<slug>`), balise canonique, Open Graph et Twitter, `sitemap-index.xml`, `robots.txt`, flux `journal/rss.xml`.
- Données structurées : `FinancialService` et `WebSite` sur l'accueil, `BlogPosting`, `FAQPage`, `BreadcrumbList` et `VideoObject` (avec les passages horodatés) sur les articles, `ProfilePage` sur les pages auteur, `Blog` sur le Journal.

## Mise en ligne (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque push sur `main`, chaque matin, et à la demande. Il est servi sur `https://www.plt-family-office.com` (domaine renseigné dans **Settings > Pages**, fichier `CNAME` généré au build).

DNS chez OVH :
- `www` : `CNAME` vers `sia-coding-capital.github.io.`
- domaine nu `plt-family-office.com` : quatre enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (et `AAAA` vers `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`). GitHub redirige alors le domaine nu vers `www`.

Variables facultatives (**Settings > Secrets and variables > Actions > Variables**) : `CUSTOM_DOMAIN` pour changer de domaine, `PUBLICATION_START` et `PUBLICATION_FIRST_BATCH` pour décaler le calendrier du journal.

GitHub désactive les tâches planifiées d'un dépôt sans activité pendant 60 jours : un commit de temps en temps (un nouvel article, par exemple) suffit à les garder actives.

## Arborescence

```
src/
  pages/           accueil, journal, auteurs, mentions légales, RSS, robots
  layouts/         gabarit commun (balises SEO, en-tête, pied de page, script)
  components/      en-tête, pied de page, appel final, carte d'article, fleur de lys
  content/         articles et pages auteur (Markdown)
  lib/             calendrier de publication et mise en forme des articles
  styles/          base.css (commun), landing.css, journal.css
public/            photos, favicon, image de partage
```

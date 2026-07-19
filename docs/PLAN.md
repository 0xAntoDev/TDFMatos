# PLAN — Matos TDF Live IRL

## Vision v1

Un inventaire visuel partagé pour préparer le tour de France en live IRL : on liste le matériel avec image, prix et lien d'achat, on suit les statuts (à acheter / acheté / à prendre / pris), et on l'utilise sur mobile comme checklist les jours de tournage. Outil interne, ~5 personnes, mot de passe d'équipe unique.

## Déjà en place (fondations, ne pas refaire)

- Scaffold Next.js App Router + TS + Tailwind 4 (pnpm)
- Neon Postgres provisionné, table `items` créée avec index (projet `square-art-14364567`)
- Drizzle configuré : `src/db/schema.ts` (source de vérité), `src/db/index.ts`, `drizzle.config.ts`
- `.env.local` : `DATABASE_URL` + `SITE_PASSWORD`

## Découpe en salves

### Salve A — Socle : auth, layout, CRUD ✅ FAITE (19/07/2026)

- Middleware mot de passe : page `/login` (un champ, gros bouton), cookie httpOnly signé, redirect. `SITE_PASSWORD` en env.
- Layout mobile-first : barre de navigation basse 3 onglets (Liste, Shopping, Checklist), header simple « Matos TDF ».
- Server Actions CRUD sur `items` : créer, modifier, changer le statut, supprimer.
- Formulaire d'ajout/édition (bottom sheet ou page) : tous les champs du schéma, catégorie et statut en selects, prix saisi en euros converti en centimes.
- **Fetch lien Amazon** : action serveur qui prend une URL, fetch la page (User-Agent navigateur), extrait `og:title`, `og:image` et le prix si trouvable ; pré-remplit le formulaire. Best effort : si ça échoue, on remplit à la main, jamais bloquant.
- Vue liste `/` minimale : cartes (vignette, titre, prix, badge statut, quantité), filtres catégorie + statut.
- Zone : tout `src/`, c'est la salve fondatrice.

### Salve B — Mode shopping ✅ FAITE (19/07/2026, worker Orca)

- `/shopping` : uniquement statut `a_acheter`, grosses vignettes, prix visible, total du panier restant, bouton « Acheter » qui ouvre le lien dans un nouvel onglet.
- Après achat : bouton « Marqué acheté » qui passe le statut à `achete`.
- Zone : `src/app/shopping/`, composants partagés en lecture seule.

### Salve C — Mode checklist tournage ✅ FAITE (19/07/2026, worker Orca)

- `/checklist` : items `a_prendre` + `pris` + `achete` (tout ce qui doit monter dans le van), groupés par catégorie, gros toggles tactiles « pris ✓ », compteur « il reste N ».
- Bouton « Réinitialiser la checklist » (repasse tous les `pris` en `a_prendre`) pour le tournage suivant. Confirmation avant.
- `manifest.json` + icônes : installable sur l'écran d'accueil.
- Zone : `src/app/checklist/`, `src/app/manifest.ts`, composants partagés en lecture seule.

### Ensuite (v1.1, à trancher plus tard)

- Filtre « qui apporte quoi » par personne
- Upload d'image direct (Vercel Blob) pour le matos déjà possédé sans lien
- Temps réel (polling léger suffit sans doute)

## Définition de fait

`pnpm lint` + `pnpm build` verts, écrans vérifiés en 390px de large, puis `/ship` (deploy Vercel + check URL).

# PLAN — Matos TDF Live IRL

## Vision v1

Un inventaire visuel partagé pour préparer le tour de France en live IRL : on liste le matériel avec image, prix et lien d'achat, on suit les statuts (à acheter / acheté / à prendre / pris), et on l'utilise sur mobile comme checklist les jours de tournage. Outil interne, ~5 personnes, mot de passe d'équipe unique.

## Fait

### Étape A — Socle : auth, layout, CRUD (19/07/2026)

- Middleware mot de passe (`src/proxy.ts`) : page `/login`, cookie httpOnly signé, redirect. `SITE_PASSWORD` en env.
- Layout mobile-first : header « Matos TDF », nav basse 3 onglets, route group `(app)`.
- Server Actions CRUD sur `items` + revérification du cookie dans chaque action.
- Formulaire d'ajout/édition : tous les champs, selects catégorie/statut, prix en euros converti en centimes.
- Pré-remplissage par lien Amazon (og:title / og:image / prix, fallbacks Amazon), best effort jamais bloquant.
- Vue liste `/` : cartes, badge statut cliquable pour changer le statut, filtres catégorie + statut, état vide.

## À faire

### Migration Supabase (avant B et C)

- Créer le projet Supabase, récupérer la connection string (pooler), remplacer `DATABASE_URL`.
- Remplacer le driver `@neondatabase/serverless` par un driver Postgres standard dans `src/db/index.ts`.
- `pnpm drizzle-kit push` pour recréer la table `items` (la base Neon était vide, rien à migrer).

### Étape B — Mode shopping

- `/shopping` : uniquement statut `a_acheter`, grosses vignettes, prix visible, total du panier restant, bouton « Acheter » qui ouvre le lien dans un nouvel onglet.
- Après achat : bouton « Marqué acheté » qui passe le statut à `achete`.

### Étape C — Mode checklist tournage

- `/checklist` : items `a_prendre` + `pris` + `achete` (tout ce qui doit monter dans le van), groupés par catégorie, gros toggles tactiles « pris ✓ », compteur « il reste N ».
- Bouton « Réinitialiser la checklist » (repasse tous les `pris` en `a_prendre`) pour le tournage suivant. Confirmation avant.
- `manifest.json` + icônes : installable sur l'écran d'accueil.

### Ensuite (v1.1, à trancher plus tard)

- Filtre « qui apporte quoi » par personne
- Upload d'image direct pour le matos déjà possédé sans lien
- Temps réel (polling léger suffit sans doute)

## Définition de fait

`pnpm lint` + `pnpm build` verts, écrans vérifiés en 390px de large, puis `/ship` (deploy Vercel + check URL).

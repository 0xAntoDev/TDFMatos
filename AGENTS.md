<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Matos TDF Live IRL

> Outil interne : inventaire visuel partagé du matériel pour le tour de France en live IRL.
> Rien à voir avec MakeShort/ClipMix. Petit projet, vitesse et simplicité avant tout.

## Le produit en une phrase

Une liste de matériel partagée (image + prix + lien Amazon), filtrable par statut et catégorie, utilisable sur mobile comme checklist les jours de tournage.

## Stack

- **Next.js (App Router) + TypeScript + Tailwind 4**, déployé sur **Vercel**
- **Neon Postgres** (projet `square-art-14364567`, branche `main`, région us-west-2) + **Drizzle** (`src/db/`)
- Auth : **mot de passe d'équipe unique** (`SITE_PASSWORD`, cookie posé par le middleware). Pas de comptes.
- Mutations : Server Actions. Pas d'API séparée, pas de sur-architecture.
- Env : `.env.local` (jamais commité), variables listées dans `.env.example`.

## Modèle de données (source de vérité : `src/db/schema.ts`)

Une table `items` : titre, image_url, price_cents, link, category, quantity, status, assigned_to, note.
Statuts : `a_acheter` → `achete` / `a_prendre` → `pris`. Labels FR dans `STATUS_LABELS`.
Schéma déjà appliqué en base. Toute évolution : modifier `schema.ts` puis `pnpm drizzle-kit push`.

## Les 3 vues

1. `/` : liste filtrable (catégorie + statut), grille de cartes avec vignette et prix.
2. `/shopping` : uniquement « à acheter », grosses vignettes, lien marchand cliquable.
3. `/checklist` : mobile, gros items cochables « pris », compteur restant.

## Règles

- **Mobile-first** : chaque écran se conçoit d'abord en 390px de large. Cibles tactiles ≥ 44px.
- **Français user-facing**, casse normale, pas de tirets cadratins.
- Simplicité assumée : pas de tests exhaustifs, pas de state manager, pas de dépendance sans nécessité. Outil interne pour ~5 personnes.
- Prix stockés en centimes (`price_cents`), affichés « 12,99 € ».
- Ajout par lien Amazon : fetch serveur des balises og (titre/image/prix) en best effort, fallback saisie manuelle. Ne jamais bloquer l'ajout si le scrape échoue.

## Commandes

```bash
pnpm dev                # dev local (port 3000)
pnpm build              # build prod
pnpm lint               # eslint
pnpm drizzle-kit push   # applique schema.ts sur Neon
```

## Skills

- `/ship` : valide (lint + build) puis déploie sur Vercel et vérifie l'URL.
- `/brief` : génère un `BRIEF.md` de salve pour un worker Orca (worktree isolé).

## Mode salve (Orca)

Si tu es un worker dans un worktree : ton brief est dans `.claude/BRIEF.md` à la racine du worktree. Exécute-le en autonomie, décide seul les doutes mineurs, note-les. Le plan produit et la découpe des salves vivent dans `docs/PLAN.md`.

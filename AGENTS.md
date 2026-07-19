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
- **Supabase Postgres** + **Drizzle** (`src/db/`). MCP Supabase et Vercel configurés dans `.mcp.json`.
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
pnpm drizzle-kit push   # applique schema.ts sur Supabase
```

## Skills

- `/ship` : valide (lint + build) puis déploie sur Vercel et vérifie l'URL.

## Organisation du travail

Pas de mode salve ni de workers Orca sur ce projet : le travail se fait directement en session, étape par étape. Le plan produit et l'avancement vivent dans `docs/PLAN.md`.

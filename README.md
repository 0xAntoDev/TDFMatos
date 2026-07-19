# Matos TDF

Inventaire visuel partagé du matériel pour le tour de France en live IRL : liste avec image, prix et lien d'achat, suivi des statuts (à acheter / acheté / à prendre / pris), utilisable sur mobile comme checklist les jours de tournage.

Outil interne (~5 personnes), accès par mot de passe d'équipe unique.

## Stack

Next.js (App Router) + TypeScript + Tailwind 4, Neon Postgres + Drizzle, déployé sur Vercel.

## Démarrer

```bash
pnpm install
cp .env.example .env.local   # remplir DATABASE_URL et SITE_PASSWORD
pnpm dev
```

Le plan produit et la découpe du travail vivent dans `docs/PLAN.md`, les conventions dans `AGENTS.md`.

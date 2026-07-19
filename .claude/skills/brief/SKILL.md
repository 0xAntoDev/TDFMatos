---
name: brief
description: Génère un BRIEF.md de salve pour un worker Orca dans un worktree isolé. À utiliser quand on découpe le travail en salves parallèles.
---

# /brief — préparer une salve Orca

Arguments attendus : la lettre de la salve (A, B, C…) ou une description libre de la tâche.

1. Lire `docs/PLAN.md` (découpe des salves) et `AGENTS.md`.
2. Créer le worktree :
   ```bash
   git worktree add ../tdf-matos-wt-<slug> -b salve/<slug>
   ```
3. Écrire `.claude/BRIEF.md` À LA RACINE DU WORKTREE (chemin absolu, jamais dans le checkout principal) avec :
   - **Contexte** : une phrase sur le produit + renvoi à AGENTS.md (auto-chargé).
   - **Mission** : le périmètre exact de la salve, tiré de `docs/PLAN.md`.
   - **Zone de code** : fichiers/dossiers autorisés (les salves ne se chevauchent pas).
   - **Hors périmètre** : ce qu'on ne touche PAS.
   - **Définition de fait** : `pnpm lint` + `pnpm build` verts, écrans vérifiés en 390px.
   - **Setup** : `cp <checkout-principal>/.env.local .env.local && pnpm install`, puis `pnpm dev --port 30XX` (un port par salve : A=3001, B=3002, C=3003).
4. Rappeler la commande de lancement du worker dans le rapport final :
   ```bash
   cd <chemin-absolu-du-worktree> && claude --model claude-opus-4-8 --dangerously-skip-permissions
   ```

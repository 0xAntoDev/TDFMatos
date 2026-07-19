---
name: brief
description: Génère un BRIEF.md de salve pour un worker Orca dans un worktree isolé. À utiliser quand on découpe le travail en salves parallèles.
---

# /brief — préparer une salve Orca

Arguments attendus : la lettre de la salve (A, B, C…) ou une description libre de la tâche.

Le flux complet de lancement/supervision vit dans `.claude/SUPERVISOR.md` — ce skill ne
produit QUE le brief. Étapes :

1. Lire `docs/PLAN.md` (découpe des salves) et `AGENTS.md`.
2. Rédiger le brief (fichier temporaire dans le scratchpad, il sera copié dans le
   worktree par le superviseur) avec ces sections :
   - **Contexte** : une phrase sur le produit + renvoi à AGENTS.md (auto-chargé).
   - **Mission** : le périmètre exact de la salve, tiré de `docs/PLAN.md`.
   - **Zone de code** : fichiers/dossiers autorisés (les salves ne se chevauchent pas).
   - **Hors périmètre** : ce qu'on ne touche PAS.
   - **Définition de fait** : `pnpm lint` + `pnpm build` verts, parcours vérifié en
     390px sur le port dédié du worktree (lire `.claude/ports.env`).
   - **Setup** : déjà fait par `scripts/orca-wt-setup.sh prepare` (deps + `.env.local`
     + port) ; le serveur dev tourne dans le terminal Orca `run-<slug>`.
   - **Autonomie** : décide seul les doutes mineurs et note-les dans ton rapport final ;
     escalade (`decision_gate`) uniquement les vraies décisions produit.
   - **Commit** : petits commits propres sur la branche du worktree. Ne merge pas, ne
     push pas main : le superviseur gère le gate et le merge.
3. Remettre au superviseur le chemin du brief + le slug proposé pour le worktree.

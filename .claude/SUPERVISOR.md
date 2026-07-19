# SUPERVISOR.md — playbook du superviseur de salve (tdf-matos)

> Version légère du modèle ClipMix, adaptée à un petit projet. À lire par tout agent
> qui orchestre une salve. Une salve = un worktree Orca isolé + un worker Claude
> autonome dedans. Le superviseur ne code pas lui-même pendant une salve : il découpe,
> lance, supervise, valide au gate, merge.

## 0. Avant toute salve

```bash
git fetch origin --prune && git checkout main && git pull --ff-only origin main
orca status --json          # runtime "ready" attendu
git worktree list           # des worktrees d'une session précédente peuvent traîner
```

Les salves sont **file-disjointes** (zones définies dans `docs/PLAN.md`). Si deux salves
doivent toucher le même fichier, elles passent en séquentiel.

## 1. Lancer une salve

```bash
# 1. Worktree Orca neuf (adresser ensuite par sélecteur name:<slug>)
orca worktree create --name <slug> --no-parent --json
path=$(orca worktree show --worktree name:<slug> --json | jq -r '.result.worktree.path')

# 2. Brief déposé comme fichier (généré via le skill /brief)
mkdir -p "$path/.claude" && cp <brief.md> "$path/.claude/BRIEF.md"

# 3. Setup + serveur dev dans UN terminal Orca (port dédié écrit dans .claude/ports.env)
orca terminal create --worktree name:<slug> --title run-<slug> \
  --command "bash scripts/orca-wt-setup.sh prepare && bash scripts/orca-wt-setup.sh serve" --json

# 4. Worker Claude dans un second terminal (toujours --dangerously-skip-permissions :
#    un prompt shell bloquerait le worker sans message d'orchestration)
orca terminal create --worktree name:<slug> --title claude-<slug> \
  --command "claude --model claude-opus-4-8 --dangerously-skip-permissions" --json

# 5. Dispatch supervisé
h=$(orca terminal list --json | jq -r '.result.terminals[] | select(.title=="claude-<slug>") | .handle')
tid=$(orca orchestration task-create --spec "Lis .claude/BRIEF.md et exécute cette salve en autonomie. Tu ne touches qu'à ta zone." --json | jq -r '.result.task.id')
orca orchestration dispatch --task "$tid" --to "$h" --inject --json
```

## 2. Superviser (réactif, pas de polling de panes)

```bash
orca orchestration check --wait --types worker_done,escalation,decision_gate --timeout-ms 600000 --json
```

- `decision_gate` → réponds via `orca orchestration reply --id <msg_id> --body "…" --json`.
  N'escalade vers Antoine que les vraies décisions produit.
- `escalation` → inspecte le terminal (`orca terminal read --terminal <handle> --json`), débloque.
- `worker_done` → passe au gate (§3).
- Timeout / `{count:0}` = simple checkpoint, PAS un échec : une salve prend 15-60 min. Reboucle.
- Worker vivant mais silencieux depuis longtemps → `orca terminal read` : il attend
  probablement un prompt (une vraie décision à traiter).

## 3. Gate de validation (avant merge)

Dans le worktree de la salve :
1. `pnpm lint` et `pnpm build` verts.
2. Vérif visuelle en 390px sur le port dédié du worktree (`.claude/ports.env`),
   parcours réel de la salve (pas juste un screenshot de la home).
3. Diff relu : la salve n'a touché que sa zone.

## 4. Merge et cleanup

```bash
cd /Users/antoine/Documents/dev/tdf-matos
git merge --no-ff <branche-de-la-salve> && git push
orca worktree rm --worktree name:<slug> --force --json   # une fois mergé et clean
```

## Pièges connus (hérités des runs ClipMix + spécifiques machine)

- Le coordinateur peut être sandboxé à la racine du checkout principal : ne PAS faire
  `(cd <worktree> && …)` inline — passer par des terminaux Orca pour tout ce qui tourne
  dans un worktree.
- `next dev` (Next 16) est un démon : s'il répond 404 partout, tuer le vieux
  `next-server` (`pgrep -fl next-server`). EMFILE watchers → tuer les démons dev
  zombies, contournement `WATCHPACK_POLLING=true`.
- `.env.local` n'est pas commité : c'est le `prepare` du setup qui le copie depuis le
  checkout principal. Sans lui, l'app crashe à la première requête DB.

#!/usr/bin/env bash
# Setup d'un worktree Orca : dépendances + .env.local + port dev dédié.
# Appelé par orca.yaml à la création du worktree (prepare), puis par le
# superviseur pour lancer le serveur (serve). cwd = racine du worktree.
#
#   bash scripts/orca-wt-setup.sh prepare
#   bash scripts/orca-wt-setup.sh serve
set -euo pipefail

MAIN_CHECKOUT="/Users/antoine/Documents/dev/tdf-matos"
cmd="${1:-prepare}"

# Port déterministe par worktree (3010-3099), stable entre prepare et serve.
name="$(basename "$PWD")"
port=$((3010 + $(printf '%s' "$name" | cksum | cut -d' ' -f1) % 90))

case "$cmd" in
  prepare)
    pnpm install --prefer-offline
    if [ "$PWD" != "$MAIN_CHECKOUT" ] && [ ! -f .env.local ]; then
      cp "$MAIN_CHECKOUT/.env.local" .env.local
    fi
    mkdir -p .claude
    echo "PORT=$port" > .claude/ports.env
    echo "worktree '$name' prêt — dev sur le port $port"
    ;;
  serve)
    exec pnpm dev --port "$port"
    ;;
  *)
    echo "usage: $0 prepare|serve" >&2
    exit 1
    ;;
esac

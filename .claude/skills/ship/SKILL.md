---
name: ship
description: Valide le build puis déploie sur Vercel et vérifie que la prod répond. À utiliser pour livrer, déployer, "ship", mettre en prod.
---

# /ship — valider puis déployer

1. **Valider en local, s'arrêter à la première erreur :**
   ```bash
   pnpm lint
   pnpm build
   ```
   Une erreur = on corrige d'abord, on ne déploie jamais un build rouge.

2. **Déployer :**
   ```bash
   vercel --prod --yes
   ```
   Si le projet Vercel n'est pas encore lié (`.vercel/` absent), lancer `vercel link` puis pousser les env vars une fois :
   ```bash
   vercel env add DATABASE_URL production
   vercel env add SITE_PASSWORD production
   ```
   (valeurs dans `.env.local`).

3. **Vérifier la prod :** `curl -sI <url-prod>` doit répondre 200 (ou 307 vers /login, normal avec le middleware mot de passe). Puis un fetch de la page de login pour vérifier qu'elle rend.

4. **Rapporter** : URL de prod + ce qui a été déployé en une ligne. Si un check échoue, le dire tel quel, ne pas marquer livré.

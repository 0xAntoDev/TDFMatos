export const AUTH_COOKIE = "tdf_auth";

// Jeton signé : HMAC-SHA256 d'une valeur fixe, clé = SITE_PASSWORD.
// Web Crypto : fonctionne dans le proxy (edge) comme dans les Server Actions.
export async function computeAuthToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("tdf-matos-session"),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAuthToken(
  token: string | undefined,
): Promise<boolean> {
  const password = process.env.SITE_PASSWORD;
  if (!password || !token) return false;
  return token === (await computeAuthToken(password));
}

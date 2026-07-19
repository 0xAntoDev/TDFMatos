const AMAZON_AFFILIATE_TAG = "conseilcon008-21";

// Ajoute (ou remplace) le tag d'affiliation sur les liens Amazon.
// Les autres marchands et les liens illisibles passent tels quels.
export function withAffiliateTag(link: string): string {
  try {
    const url = new URL(link);
    if (/(^|\.)amazon\.[a-z.]+$/.test(url.hostname)) {
      url.searchParams.set("tag", AMAZON_AFFILIATE_TAG);
    }
    return url.toString();
  } catch {
    return link;
  }
}

const SHORTLINK_HOSTS = new Set(["amzn.eu", "amzn.to", "a.co"]);

// Les liens courts de partage Amazon (amzn.eu/d/…) ne portent pas de tag :
// on suit la redirection UNE fois côté serveur pour stocker la vraie URL
// amazon.*, débarrassée de ses paramètres de tracking. Best effort : en cas
// d'échec, on garde le lien d'origine.
export async function resolveShortLink(link: string): Promise<string> {
  try {
    const url = new URL(link);
    if (!SHORTLINK_HOSTS.has(url.hostname)) return link;
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    const finalUrl = new URL(response.url);
    if (!/(^|\.)amazon\.[a-z.]+$/.test(finalUrl.hostname)) return link;
    // On ne garde que le chemin produit, sans les paramètres de partage.
    return `${finalUrl.origin}${finalUrl.pathname}`;
  } catch {
    return link;
  }
}

// Scrape best effort d'une page produit (Amazon ou autre marchand) :
// og:title, og:image et prix si trouvable. Ne lève jamais, renvoie ce qu'on a.

export type ScrapedProduct = {
  title: string | null;
  imageUrl: string | null;
  priceCents: number | null;
};

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function extractMeta(html: string, property: string): string | null {
  // <meta property="og:title" content="..."> dans les deux ordres d'attributs
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }
  return null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(Number.parseInt(dec, 10)),
    );
}

function extractPriceCents(html: string): number | null {
  // 1. Meta produit standard (montant en point décimal)
  const metaPrice =
    extractMeta(html, "product:price:amount") ??
    extractMeta(html, "og:price:amount");
  if (metaPrice) {
    const value = Number.parseFloat(metaPrice.replace(",", "."));
    if (Number.isFinite(value) && value > 0) return Math.round(value * 100);
  }

  // 2. Amazon : <span class="a-offscreen">12,99&nbsp;€</span>
  const offscreen = html.match(
    /class="a-offscreen"[^>]*>\s*([\d\s.,]+)(?:&nbsp;|\s)*€/i,
  );
  if (offscreen) {
    const value = Number.parseFloat(
      offscreen[1].replace(/[\s.]/g, "").replace(",", "."),
    );
    if (Number.isFinite(value) && value > 0) return Math.round(value * 100);
  }

  // 3. Amazon : priceToPay en JSON embarqué ("priceAmount":12.99)
  const jsonPrice = html.match(/"priceAmount"\s*:\s*([\d.]+)/);
  if (jsonPrice) {
    const value = Number.parseFloat(jsonPrice[1]);
    if (Number.isFinite(value) && value > 0) return Math.round(value * 100);
  }

  return null;
}

export async function scrapeProductPage(url: string): Promise<ScrapedProduct> {
  const empty: ScrapedProduct = { title: null, imageUrl: null, priceCents: null };
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return empty;
    }
    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return empty;
    const html = await response.text();

    // Amazon ne fournit pas toujours d'og:title : fallback sur <title> et #landingImage
    const title =
      extractMeta(html, "og:title") ??
      (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
        ?.replace(/\s*[:|]\s*Amazon\.fr.*$/i, "")
        .replace(/^Amazon\.fr\s*[:|]\s*/i, "")
        .trim() ??
        null);
    const imageUrl =
      extractMeta(html, "og:image") ??
      html.match(/id="landingImage"[^>]+src="([^"]+)"/i)?.[1] ??
      // Galerie Amazon en JSON embarqué
      html.match(/"hiRes"\s*:\s*"(https:\/\/[^"]+)"/)?.[1] ??
      html.match(/data-a-dynamic-image="\{&quot;(https:[^&]+)&quot;/)?.[1] ??
      null;

    return {
      title: title ? decodeEntities(title) : null,
      imageUrl,
      priceCents: extractPriceCents(html),
    };
  } catch {
    return empty;
  }
}

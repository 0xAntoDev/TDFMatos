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

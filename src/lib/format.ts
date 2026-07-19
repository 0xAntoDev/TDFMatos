const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(cents: number): string {
  return euroFormatter.format(cents / 100);
}

// « 12,99 » ou « 12.99 » → 1299. Renvoie null si illisible.
export function parseEurosToCents(input: string): number | null {
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

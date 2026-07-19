import { inArray } from "drizzle-orm";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { CATEGORIES, items, type Category, type Item } from "@/db/schema";
import { ChecklistView } from "@/components/checklist-view";

// Toujours frais : c'est l'écran utilisé en direct les jours de tournage.
export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const list = await db
    .select()
    .from(items)
    .where(inArray(items.status, ["a_prendre", "pris", "achete"]))
    .orderBy(asc(items.title));

  // Groupé par catégorie, dans l'ordre de CATEGORIES, catégories vides masquées.
  const groups = CATEGORIES.map((category) => ({
    category,
    items: list.filter((item) => (item.category as Category) === category),
  })).filter((group) => group.items.length > 0);

  return <ChecklistView groups={groups} />;
}

export type ChecklistGroup = { category: Category; items: Item[] };

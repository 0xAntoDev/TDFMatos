import Link from "next/link";
import { Suspense } from "react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  CATEGORIES,
  STATUSES,
  items,
  type Category,
  type Status,
} from "@/db/schema";
import { FilterBar } from "@/components/filter-bar";
import { ItemCard } from "@/components/item-card";

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; statut?: string }>;
}) {
  const { categorie, statut } = await searchParams;
  const category = CATEGORIES.includes(categorie as Category)
    ? (categorie as Category)
    : null;
  const status = STATUSES.includes(statut as Status)
    ? (statut as Status)
    : null;

  const conditions = [
    category ? eq(items.category, category) : undefined,
    status ? eq(items.status, status) : undefined,
  ].filter((c) => c !== undefined);

  const list = await db
    .select()
    .from(items)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(items.createdAt));

  const filtered = category !== null || status !== null;

  return (
    <div className="flex flex-col gap-3">
      <Suspense>
        <FilterBar />
      </Suspense>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">🎒</span>
          <p className="font-semibold">
            {filtered ? "Rien ne correspond à ces filtres." : "Le sac est vide !"}
          </p>
          <p className="text-sm text-neutral-500">
            {filtered
              ? "Essaie d'élargir la recherche."
              : "Ajoute le premier matos avec le bouton ci-dessous."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/items/new"
        className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-3xl font-light text-white shadow-lg dark:bg-white dark:text-neutral-900"
        aria-label="Ajouter un item"
      >
        +
      </Link>
    </div>
  );
}

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { ShoppingItem } from "@/components/shopping-item";

export const dynamic = "force-dynamic";

export default async function ShoppingPage() {
  const list = await db
    .select()
    .from(items)
    .where(eq(items.status, "a_acheter"))
    .orderBy(desc(items.createdAt));

  const total = list.reduce(
    (sum, item) => sum + (item.priceCents ?? 0) * item.quantity,
    0,
  );
  const withoutPrice = list.filter((item) => item.priceCents == null).length;

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-5xl">🎉</span>
        <p className="font-semibold">Tout est acheté !</p>
        <p className="text-sm text-neutral-500">
          Plus rien dans la liste de courses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 flex items-baseline justify-between gap-2 border-b border-neutral-200 bg-neutral-50/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            Panier restant
          </span>
          <span className="text-2xl font-bold">{formatPrice(total)}</span>
        </div>
        <span className="text-sm text-neutral-500">
          {list.length} article{list.length > 1 ? "s" : ""}
          {withoutPrice > 0 ? ` · dont ${withoutPrice} sans prix` : ""}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((item) => (
          <li key={item.id}>
            <ShoppingItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

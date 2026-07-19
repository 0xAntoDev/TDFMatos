import Link from "next/link";
import { CATEGORY_LABELS, type Category, type Item } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { StatusSelect } from "@/components/status-select";

export function ItemCard({ item }: { item: Item }) {
  return (
    <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <Link
        href={`/items/${item.id}/edit`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800"
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl">
            📦
          </span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/items/${item.id}/edit`} className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">
            {item.title}
          </p>
        </Link>
        <p className="text-xs text-neutral-500">
          {CATEGORY_LABELS[item.category as Category] ?? item.category}
          {item.quantity > 1 ? ` · x${item.quantity}` : ""}
          {item.assignedTo ? ` · ${item.assignedTo}` : ""}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-sm font-bold">
            {item.priceCents != null ? formatPrice(item.priceCents) : ""}
          </span>
          <StatusSelect id={item.id} status={item.status} />
        </div>
      </div>
    </div>
  );
}

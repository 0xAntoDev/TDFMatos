"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, type Category, type Item } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { updateItemStatus } from "@/lib/actions";

export function ShoppingItem({ item }: { item: Item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function markBought() {
    startTransition(async () => {
      await updateItemStatus(item.id, "achete");
      router.refresh();
    });
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-opacity dark:border-neutral-800 dark:bg-neutral-900 ${
        pending ? "opacity-50" : ""
      }`}
    >
      <div className="aspect-square w-full bg-neutral-100 dark:bg-neutral-800">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-6xl">
            📦
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 font-semibold leading-snug">{item.title}</p>
        <p className="text-xs text-neutral-500">
          {CATEGORY_LABELS[item.category as Category] ?? item.category}
          {item.quantity > 1 ? ` · x${item.quantity}` : ""}
          {item.assignedTo ? ` · ${item.assignedTo}` : ""}
        </p>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-1">
          <span className="text-lg font-bold">
            {item.priceCents != null ? formatPrice(item.priceCents) : "Prix ?"}
          </span>
          {item.priceCents != null && item.quantity > 1 ? (
            <span className="text-xs text-neutral-500">
              soit {formatPrice(item.priceCents * item.quantity)}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex gap-2">
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-neutral-900 px-4 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
            >
              Acheter
            </a>
          ) : (
            <span className="flex h-11 flex-1 items-center justify-center rounded-full bg-neutral-100 px-4 text-sm font-semibold text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600">
              Pas de lien
            </span>
          )}
          <button
            type="button"
            onClick={markBought}
            disabled={pending}
            className="flex h-11 flex-1 items-center justify-center rounded-full border border-emerald-600 px-4 text-sm font-semibold text-emerald-700 disabled:opacity-60 dark:border-emerald-500 dark:text-emerald-400"
          >
            Marqué acheté
          </button>
        </div>
      </div>
    </div>
  );
}

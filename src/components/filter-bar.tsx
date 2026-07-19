"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUSES,
  STATUS_LABELS,
} from "@/db/schema";

const selectClass =
  "h-11 flex-1 rounded-lg border border-neutral-300 bg-white px-2 text-sm text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex gap-2">
      <select
        value={searchParams.get("categorie") ?? ""}
        onChange={(e) => setParam("categorie", e.target.value)}
        className={selectClass}
        aria-label="Filtrer par catégorie"
      >
        <option value="">Toutes catégories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </option>
        ))}
      </select>
      <select
        value={searchParams.get("statut") ?? ""}
        onChange={(e) => setParam("statut", e.target.value)}
        className={selectClass}
        aria-label="Filtrer par statut"
      >
        <option value="">Tous statuts</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

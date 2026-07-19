"use client";

import { useTransition } from "react";
import { STATUSES, STATUS_LABELS, type Status } from "@/db/schema";
import { updateItemStatus } from "@/lib/actions";

const STATUS_STYLES: Record<Status, string> = {
  a_acheter:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  achete:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  a_prendre: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300",
  pris: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300",
};

export function StatusSelect({ id, status }: { id: string; status: Status }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(() => updateItemStatus(id, next));
      }}
      onClick={(e) => e.stopPropagation()}
      className={`h-11 rounded-full px-3 text-sm font-semibold outline-none disabled:opacity-60 ${STATUS_STYLES[status]}`}
      aria-label="Changer le statut"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

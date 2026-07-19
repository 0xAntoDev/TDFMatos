"use client";

import { useMemo, useState, useTransition } from "react";
import { CATEGORY_LABELS, type Item } from "@/db/schema";
import { updateItemStatus } from "@/lib/actions";
import { resetChecklist } from "@/lib/checklist-actions";
import type { ChecklistGroup } from "@/app/(app)/checklist/page";

export function ChecklistView({ groups }: { groups: ChecklistGroup[] }) {
  const allItems = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups],
  );

  // État local des coches pour un compteur qui réagit instantanément.
  const [taken, setTaken] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(allItems.map((item) => [item.id, item.status === "pris"])),
  );
  const [, startTransition] = useTransition();
  const [resetting, startReset] = useTransition();

  const total = allItems.length;
  const remaining = allItems.filter((item) => !taken[item.id]).length;
  const done = total > 0 && remaining === 0;

  function toggle(item: Item) {
    const next = !taken[item.id];
    setTaken((prev) => ({ ...prev, [item.id]: next }));
    startTransition(() => {
      updateItemStatus(item.id, next ? "pris" : "a_prendre");
    });
  }

  function reset() {
    if (!window.confirm("Repasser tout le matériel en « à prendre » ?")) return;
    setTaken((prev) => {
      const cleared: Record<string, boolean> = {};
      for (const id of Object.keys(prev)) cleared[id] = false;
      return cleared;
    });
    startReset(() => {
      resetChecklist();
    });
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="text-5xl">🚐</span>
        <p className="font-semibold">Rien à charger.</p>
        <p className="text-sm text-neutral-500">
          Ajoute du matériel à prendre depuis la liste.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`sticky top-14 z-10 rounded-xl border px-4 py-3 text-center ${
          done
            ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950"
            : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        }`}
      >
        {done ? (
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
            🎉 Tout est dans le van !
          </p>
        ) : (
          <p className="text-base font-bold">
            Il reste <span className="text-xl">{remaining}</span>{" "}
            {remaining > 1 ? "articles" : "article"} à charger
          </p>
        )}
        <p className="mt-0.5 text-xs text-neutral-500">
          {total - remaining} / {total} pris
        </p>
      </div>

      {groups.map((group) => (
        <section key={group.category} className="flex flex-col gap-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {CATEGORY_LABELS[group.category]}
          </h2>
          <ul className="flex flex-col gap-2">
            {group.items.map((item) => {
              const checked = !!taken[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggle(item)}
                    aria-pressed={checked}
                    className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                      checked
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60"
                        : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
                        checked
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-neutral-300 text-transparent dark:border-neutral-600"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span
                        className={`truncate text-base font-semibold ${
                          checked
                            ? "text-neutral-400 line-through dark:text-neutral-500"
                            : ""
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.quantity > 1 || item.assignedTo ? (
                        <span className="text-xs text-neutral-500">
                          {item.quantity > 1 ? `x${item.quantity}` : ""}
                          {item.quantity > 1 && item.assignedTo ? " · " : ""}
                          {item.assignedTo ?? ""}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <button
        type="button"
        onClick={reset}
        disabled={resetting}
        className="mt-4 h-12 rounded-xl border border-neutral-300 text-base font-semibold text-neutral-700 disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-300"
      >
        {resetting ? "Réinitialisation…" : "Réinitialiser la checklist"}
      </button>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { deleteItem } from "@/lib/actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Supprimer cet item ?")) {
          startTransition(() => deleteItem(id));
        }
      }}
      className="h-12 rounded-xl border border-red-300 text-base font-semibold text-red-600 disabled:opacity-60 dark:border-red-900 dark:text-red-400"
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}

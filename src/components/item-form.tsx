"use client";

import { useState, useTransition } from "react";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type Item,
} from "@/db/schema";
import { prefillFromLink } from "@/lib/actions";

const inputClass =
  "h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-300";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export function ItemForm({
  item,
  action,
  submitLabel,
}: {
  item?: Item;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [price, setPrice] = useState(
    item?.priceCents != null ? (item.priceCents / 100).toFixed(2).replace(".", ",") : "",
  );
  const [link, setLink] = useState(item?.link ?? "");
  const [scraping, startScraping] = useTransition();
  const [scrapeMessage, setScrapeMessage] = useState<string | null>(null);

  function handlePrefill() {
    const url = link.trim();
    if (!url) return;
    setScrapeMessage(null);
    startScraping(async () => {
      const result = await prefillFromLink(url);
      if (result.title) setTitle(result.title);
      if (result.imageUrl) setImageUrl(result.imageUrl);
      if (result.priceCents != null) {
        setPrice((result.priceCents / 100).toFixed(2).replace(".", ","));
      }
      setScrapeMessage(
        result.title || result.imageUrl || result.priceCents != null
          ? "Champs pré-remplis, vérifie et complète."
          : "Impossible de lire cette page, remplis à la main.",
      );
    });
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Lien (Amazon ou autre)">
        <div className="flex gap-2">
          <input
            type="url"
            name="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.amazon.fr/…"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handlePrefill}
            disabled={scraping || !link.trim()}
            className="h-12 shrink-0 rounded-lg bg-neutral-200 px-4 text-sm font-semibold text-neutral-800 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-200"
          >
            {scraping ? "…" : "Pré-remplir"}
          </button>
        </div>
      </Field>
      {scrapeMessage ? (
        <p className="text-sm text-neutral-500">{scrapeMessage}</p>
      ) : null}

      <Field label="Titre *">
        <input
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : batterie V-mount"
          className={inputClass}
        />
      </Field>

      <Field label="Image (URL)">
        <input
          type="url"
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
          className={inputClass}
        />
      </Field>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="h-28 w-28 rounded-lg border border-neutral-200 object-contain dark:border-neutral-800"
        />
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix (€)">
          <input
            type="text"
            inputMode="decimal"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="12,99"
            className={inputClass}
          />
        </Field>
        <Field label="Quantité">
          <input
            type="number"
            name="quantity"
            min={1}
            defaultValue={item?.quantity ?? 1}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Catégorie">
          <select
            name="category"
            defaultValue={item?.category ?? "divers"}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Statut">
          <select
            name="status"
            defaultValue={item?.status ?? "a_acheter"}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Assigné à">
        <input
          type="text"
          name="assignedTo"
          defaultValue={item?.assignedTo ?? ""}
          placeholder="Qui s'en occupe ?"
          className={inputClass}
        />
      </Field>

      <Field label="Note">
        <textarea
          name="note"
          defaultValue={item?.note ?? ""}
          rows={3}
          placeholder="Détails, référence, etc."
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-300"
        />
      </Field>

      <button
        type="submit"
        className="mt-2 h-14 rounded-xl bg-neutral-900 text-lg font-semibold text-white active:scale-[0.98] dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}

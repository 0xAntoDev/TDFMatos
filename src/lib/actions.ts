"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  CATEGORIES,
  STATUSES,
  items,
  type Category,
  type NewItem,
  type Status,
} from "@/db/schema";
import { scrapeProductPage, type ScrapedProduct } from "@/lib/amazon";
import { AUTH_COOKIE, isValidAuthToken } from "@/lib/auth";
import { parseEurosToCents } from "@/lib/format";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!(await isValidAuthToken(token))) {
    redirect("/login");
  }
}

function text(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function itemValuesFromForm(formData: FormData): Omit<NewItem, "id"> {
  const title = text(formData, "title");
  if (!title) throw new Error("Le titre est obligatoire");

  const category = text(formData, "category") ?? "divers";
  const status = text(formData, "status") ?? "a_acheter";
  if (!CATEGORIES.includes(category as Category)) {
    throw new Error("Catégorie inconnue");
  }
  if (!STATUSES.includes(status as Status)) {
    throw new Error("Statut inconnu");
  }

  const price = text(formData, "price");
  const quantityRaw = Number.parseInt(text(formData, "quantity") ?? "1", 10);

  return {
    title,
    imageUrl: text(formData, "imageUrl"),
    priceCents: price ? parseEurosToCents(price) : null,
    link: text(formData, "link"),
    category,
    quantity: Number.isFinite(quantityRaw) && quantityRaw > 0 ? quantityRaw : 1,
    status: status as Status,
    assignedTo: text(formData, "assignedTo"),
    note: text(formData, "note"),
  };
}

export async function createItem(formData: FormData) {
  await requireAuth();
  await db.insert(items).values(itemValuesFromForm(formData));
  revalidatePath("/");
  redirect("/");
}

export async function updateItem(id: string, formData: FormData) {
  await requireAuth();
  await db
    .update(items)
    .set({ ...itemValuesFromForm(formData), updatedAt: new Date() })
    .where(eq(items.id, id));
  revalidatePath("/");
  redirect("/");
}

export async function updateItemStatus(id: string, status: Status) {
  await requireAuth();
  if (!STATUSES.includes(status)) throw new Error("Statut inconnu");
  await db
    .update(items)
    .set({ status, updatedAt: new Date() })
    .where(eq(items.id, id));
  revalidatePath("/");
}

export async function deleteItem(id: string) {
  await requireAuth();
  await db.delete(items).where(eq(items.id, id));
  revalidatePath("/");
  redirect("/");
}

export async function prefillFromLink(url: string): Promise<ScrapedProduct> {
  await requireAuth();
  return scrapeProductPage(url);
}

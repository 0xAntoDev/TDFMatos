"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { items } from "@/db/schema";
import { AUTH_COOKIE, isValidAuthToken } from "@/lib/auth";

// Même revérification du cookie que dans actions.ts (modèle : requireAuth).
async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!(await isValidAuthToken(token))) {
    redirect("/login");
  }
}

// Repasse tous les items « pris » en « à prendre » pour le tournage suivant.
export async function resetChecklist() {
  await requireAuth();
  await db
    .update(items)
    .set({ status: "a_prendre", updatedAt: new Date() })
    .where(eq(items.status, "pris"));
  revalidatePath("/checklist");
  revalidatePath("/");
}

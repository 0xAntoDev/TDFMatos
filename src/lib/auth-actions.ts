"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, computeAuthToken } from "@/lib/auth";

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

export async function login(formData: FormData) {
  const password = formData.get("password");
  const next = safeNext(formData.get("next"));
  const expected = process.env.SITE_PASSWORD;

  if (!expected || password !== expected) {
    const params = new URLSearchParams({ error: "1" });
    if (next !== "/") params.set("next", next);
    redirect(`/login?${params.toString()}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, await computeAuthToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect(next);
}

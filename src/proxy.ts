import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isValidAuthToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (await isValidAuthToken(token)) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", request.url);
  const requested = request.nextUrl.pathname + request.nextUrl.search;
  if (requested !== "/") {
    loginUrl.searchParams.set("next", requested);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Tout sauf /login, les assets Next et les fichiers statiques.
  matcher: ["/((?!login|_next|favicon\\.ico|.*\\..*).*)"],
};

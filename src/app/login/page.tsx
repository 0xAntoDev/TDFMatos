import type { Metadata } from "next";
import { login } from "@/lib/auth-actions";

export const metadata: Metadata = {
  title: "Connexion - Matos TDF",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-bold">Matos TDF</h1>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Entre le mot de passe de l&apos;équipe pour accéder à l&apos;inventaire.
        </p>
        <form action={login} className="mt-8 flex flex-col gap-4">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Mot de passe"
            className="h-14 rounded-xl border border-neutral-300 bg-white px-4 text-lg text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-300"
          />
          {error ? (
            <p className="text-sm font-medium text-red-600">
              Mot de passe incorrect, réessaie.
            </p>
          ) : null}
          <button
            type="submit"
            className="h-14 rounded-xl bg-neutral-900 text-lg font-semibold text-white active:scale-[0.98] dark:bg-white dark:text-neutral-900"
          >
            Entrer
          </button>
        </form>
      </div>
    </main>
  );
}

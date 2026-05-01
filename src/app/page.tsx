import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col px-6 pb-10 pt-6">
      <div className="flex flex-1 items-center justify-center">
        <section className="w-full">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
              LOGO
            </div>
          </div>
          <h1 className="text-center text-4xl font-semibold tracking-tight text-foreground">
            Welcome
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-muted-foreground">
            Continue with email authentication to access your expense dashboard.
          </p>
          <div className="my-8 h-px w-full bg-border" />
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Login with Email
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Create Account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

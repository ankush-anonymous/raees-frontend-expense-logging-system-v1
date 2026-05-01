"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();

    if (!name || !email) {
      return;
    }

    const params = new URLSearchParams({ mode: "signup", name, email });
    router.push(`/otp?${params.toString()}`);
  };

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-6 pb-10 pt-6">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {"<-"} Back
      </Link>
      <div className="flex flex-1 items-center justify-center">
        <section className="w-full">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
              LOGO
            </div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter your details to receive an OTP.
          </p>
          <div className="my-8 h-px w-full bg-border" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="Raees Khan"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue to OTP
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const mode = searchParams.get("mode");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const otp = formData.get("otp")?.toString().trim();

    if (!otp) {
      return;
    }

    alert("OTP submitted. Connect this screen with your backend verification API.");
  };

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-6 pb-10 pt-6">
      <Link
        href="/login"
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Verify OTP</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We sent a one-time code to{" "}
            <span className="font-medium text-foreground">{email ?? "your email"}</span>.
          </p>
          {mode === "signup" && name ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Verifying account for <span className="font-medium text-foreground">{name}</span>.
            </p>
          ) : null}
          <div className="my-8 h-px w-full bg-border" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-foreground">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                required
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm tracking-[0.3em] text-foreground outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="123456"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Verify OTP
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Use a different email?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Go back
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  Gem,
  Layers,
  Plane,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AddExpenseDatePicker } from "@/components/add-expense-date-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconTile = cn(
  "flex size-[4.25rem] shrink-0 items-center justify-center rounded-2xl sm:size-[4.75rem]",
  "bg-muted/65",
  "ring-1 ring-white/14",
  "shadow-[inset_0_1px_0_0_oklch(1_0_0/0.11),0_3px_8px_-2px_oklch(1_0_0/0.13),0_1px_2px_-1px_oklch(1_0_0/0.06)]",
  "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "will-change-transform",
  "group-hover:-translate-y-0.5 group-hover:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.15),0_6px_14px_-4px_oklch(1_0_0/0.16),0_2px_4px_-2px_oklch(1_0_0/0.08)]",
  "group-focus-within:-translate-y-0.5 group-focus-within:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.15),0_6px_14px_-4px_oklch(1_0_0/0.16),0_2px_4px_-2px_oklch(1_0_0/0.08)]",
  "active:translate-y-0 active:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.11),0_2px_6px_-2px_oklch(1_0_0/0.12),0_1px_2px_-1px_oklch(1_0_0/0.06)]"
);

const inputLine = cn(
  "w-full min-w-0 border-0 bg-transparent py-2.5 pb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem] sm:leading-snug",
  "outline-none placeholder:text-muted-foreground/55 placeholder:font-semibold",
  "focus-visible:ring-0"
);

const lineWrap = cn(
  "min-w-0 flex-1 border-b border-border pb-px transition-colors",
  "focus-within:border-primary"
);

type CategoryId = "food" | "travel" | "luxury" | "others";

type CategoryOption = {
  id: CategoryId;
  label: string;
  Icon: LucideIcon;
  colorVar: string;
};

const CATEGORIES: CategoryOption[] = [
  { id: "food", label: "Food", Icon: UtensilsCrossed, colorVar: "--chart-1" },
  { id: "travel", label: "Travel", Icon: Plane, colorVar: "--chart-2" },
  { id: "luxury", label: "Luxury", Icon: Gem, colorVar: "--chart-3" },
  { id: "others", label: "Others", Icon: Layers, colorVar: "--chart-4" },
];

function parseAmount(raw: string): number | null {
  const trimmed = raw.trim().replace(/^₹?\s*/, "");
  const n = Number.parseFloat(trimmed.replace(/,/g, ""));
  if (Number.isNaN(n) || n <= 0) return null;
  return n;
}

export function AddExpenseForm() {
  const router = useRouter();
  const [category, setCategory] = React.useState<CategoryId | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const description = formData.get("description")?.toString().trim() ?? "";
    const amountRaw =
      formData.get("amount")?.toString() ?? "";

    if (!amountRaw.trim()) {
      setError("Please enter an amount.");
      return;
    }

    const amount = parseAmount(amountRaw);
    if (amount == null) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (category === null) {
      setError("Please select a category (Food, Travel, Luxury, or Others).");
      return;
    }

    if (
      (category === "luxury" || category === "others") &&
      description.length === 0
    ) {
      setError("Description is required when Luxury or Others is selected.");
      return;
    }

    router.push("/home");
  };

  const descNeeds =
    category === "luxury" || category === "others";

  return (
    <main className="flex min-h-dvh flex-col px-6 pb-28 pt-8">
      <Link
        href="/home"
        className="w-fit text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {"<-"} Back
      </Link>

      <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Add expense
      </h1>

      <form
        className="mt-14 flex flex-col gap-10 sm:gap-12"
        aria-label="Add expense"
        onSubmit={handleSubmit}
      >
        <label
          htmlFor="expense-description"
          className="group flex items-end gap-4 sm:gap-5"
        >
          <span className={iconTile}>
            <AlignLeft
              className="size-9 text-foreground sm:size-10"
              strokeWidth={2.5}
              aria-hidden
            />
          </span>
          <div className={lineWrap}>
            <input
              id="expense-description"
              name="description"
              type="text"
              autoComplete="off"
              placeholder="Description"
              className={inputLine}
              spellCheck={false}
              aria-required={descNeeds}
            />
          </div>
        </label>

        <label
          htmlFor="expense-amount"
          className="group flex items-end gap-4 sm:gap-5"
        >
          <span
            className={cn(
              iconTile,
              "text-4xl font-bold tabular-nums leading-none text-foreground sm:text-[2.5rem]"
            )}
            aria-hidden
          >
            ₹
          </span>
          <div className={lineWrap}>
            <input
              id="expense-amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Amount"
              className={cn(inputLine, "tabular-nums")}
              required
            />
          </div>
        </label>

        <div>
          <p className="sr-only">Category — select one.</p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {CATEGORIES.map((c) => {
              const Icon = c.Icon;
              const selected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setCategory(c.id);
                    setError(null);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-2 sm:py-3.5",
                    selected
                      ? "border-primary bg-primary/15 ring-2 ring-primary/40"
                      : "border-transparent bg-muted/35 hover:bg-muted/50"
                  )}
                >
                  <span
                    className="flex size-11 items-center justify-center rounded-xl bg-muted/60 [&_svg]:size-5 sm:size-12 sm:[&_svg]:size-6"
                    style={{ color: `var(${c.colorVar})` }}
                  >
                    <Icon aria-hidden />
                  </span>
                  <span className="inline-block truncate max-w-[4.75rem] text-center text-[0.68rem] font-bold leading-tight tracking-tight text-foreground sm:max-w-none sm:text-xs">
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
          <input type="hidden" name="category" value={category ?? ""} />
        </div>

        {error ? (
          <p
            className="-mt-2 text-center text-sm font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="h-14 w-full rounded-xl text-base font-bold">
          Add expense
        </Button>

        <AddExpenseDatePicker />
      </form>
    </main>
  );
}

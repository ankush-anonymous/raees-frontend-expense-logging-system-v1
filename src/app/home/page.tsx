"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { differenceInCalendarDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays, CalendarRange, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HomeExpenseSummary } from "@/components/home-expense-summary";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function firstNameFromParams(name: string | null, email: string | null): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const part = trimmed.split(/\s+/)[0];
    return part || trimmed;
  }
  const local = email?.split("@")?.[0]?.trim();
  if (local) return local;
  return "there";
}

function timeBasedSalutation(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function yearOptions(): number[] {
  const y = new Date().getFullYear();
  const out: number[] = [];
  for (let i = y - 5; i <= y + 5; i++) out.push(i);
  return out;
}

function isSameMonthYear(
  y: string,
  m: string,
  ref: Date
): boolean {
  return (
    Number(y) === ref.getFullYear() && Number(m) === ref.getMonth()
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const displayName = firstNameFromParams(
    searchParams.get("name"),
    searchParams.get("email")
  );

  const now = new Date();
  const [openPopover, setOpenPopover] = React.useState<
    "month" | "date" | null
  >(null);

  const [filterYear, setFilterYear] = React.useState(String(now.getFullYear()));
  const [filterMonthIndex, setFilterMonthIndex] = React.useState(
    String(now.getMonth())
  );

  const [dateMode, setDateMode] = React.useState<"single" | "range">("single");
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const monthSummary = format(
    new Date(Number(filterYear), Number(filterMonthIndex), 1),
    "MMMM yyyy"
  );

  const isThisMonth = isSameMonthYear(filterYear, filterMonthIndex, now);

  let dateSummary = "No dates selected";
  let dateDetail = "";
  if (dateMode === "single" && singleDate) {
    dateSummary = format(singleDate, "MMM d, yyyy");
    dateDetail = format(singleDate, "EEEE");
  } else if (dateMode === "range" && dateRange?.from) {
    const from = format(dateRange.from, "MMM d");
    const to = dateRange.to ? format(dateRange.to, "MMM d, yyyy") : null;
    dateSummary = to ? `${from} – ${to}` : `${from} – pick end`;
    if (to && dateRange.to) {
      const span =
        differenceInCalendarDays(dateRange.to, dateRange.from) + 1;
      dateDetail = `${format(dateRange.from, "yyyy")} · ${span} day${span === 1 ? "" : "s"}`;
    } else {
      dateDetail = "Select the last day of your range";
    }
  }

  const hasDateSelection =
    (dateMode === "single" && singleDate) ||
    (dateMode === "range" && dateRange?.from);

  const setThisMonth = () => {
    const n = new Date();
    setFilterYear(String(n.getFullYear()));
    setFilterMonthIndex(String(n.getMonth()));
  };

  const setPreviousMonth = () => {
    const n = new Date();
    n.setMonth(n.getMonth() - 1);
    setFilterYear(String(n.getFullYear()));
    setFilterMonthIndex(String(n.getMonth()));
  };

  const clearDates = () => {
    setSingleDate(undefined);
    setDateRange(undefined);
  };

  const filterTriggerClass = cn(
    "flex w-full items-center gap-2 px-2.5 py-2.5 text-left outline-none transition-colors",
    "rounded-xl border border-border bg-card/40 hover:bg-muted/50",
    "focus-visible:ring-2 focus-visible:ring-ring/50",
    "data-[state=open]:bg-muted/40 data-[state=open]:ring-1 data-[state=open]:ring-ring/30"
  );

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-6 pb-10 pt-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">{timeBasedSalutation()},</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {displayName}
        </h1>
      </header>

      <div className="my-6 h-px w-full bg-border" />

      <section aria-label="Expense filters">
        <div className="grid grid-cols-2 gap-2">
          <Popover
            modal={false}
            open={openPopover === "month"}
            onOpenChange={(open) =>
              setOpenPopover(open ? "month" : null)
            }
          >
            <PopoverTrigger className={filterTriggerClass}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/80 text-primary pointer-events-none">
                <CalendarRange className="size-3.5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 pointer-events-none">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs font-semibold text-foreground">
                    Month
                  </span>
                  {!isThisMonth ? (
                    <span className="rounded-full bg-primary/15 px-1.5 py-px text-[0.6rem] font-medium uppercase tracking-wide text-primary">
                      Custom
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-[0.65rem] leading-tight text-muted-foreground">
                  {monthSummary}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 pointer-events-none",
                  openPopover === "month" && "rotate-180"
                )}
                aria-hidden
              />
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              collisionPadding={16}
              className="flex w-[min(calc(100vw-3rem),20rem)] max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-xl border-border p-4 shadow-lg"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <p className="text-xs leading-relaxed text-muted-foreground">
                Jump to common ranges or pick month and year.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-9 rounded-lg"
                  onClick={setThisMonth}
                >
                  This month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg"
                  onClick={setPreviousMonth}
                >
                  Previous month
                </Button>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                  Custom month
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="filter-year"
                      className="text-xs font-medium text-foreground"
                    >
                      Year
                    </label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger
                        id="filter-year"
                        className="h-11 w-full"
                        size="default"
                      >
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions().map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="filter-month"
                      className="text-xs font-medium text-foreground"
                    >
                      Month
                    </label>
                    <Select
                      value={filterMonthIndex}
                      onValueChange={setFilterMonthIndex}
                    >
                      <SelectTrigger
                        id="filter-month"
                        className="h-11 w-full"
                        size="default"
                      >
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {MONTH_LABELS.map((label, i) => (
                          <SelectItem key={label} value={String(i)}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover
            modal={false}
            open={openPopover === "date"}
            onOpenChange={(open) =>
              setOpenPopover(open ? "date" : null)
            }
          >
            <PopoverTrigger className={filterTriggerClass}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/80 text-primary pointer-events-none">
                <CalendarDays className="size-3.5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 pointer-events-none">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-xs font-semibold text-foreground">
                    Date
                  </span>
                  {hasDateSelection ? (
                    <span className="rounded-full bg-primary/15 px-1.5 py-px text-[0.6rem] font-medium uppercase tracking-wide text-primary">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-[0.65rem] leading-tight text-muted-foreground">
                  {dateSummary}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 pointer-events-none",
                  openPopover === "date" && "rotate-180"
                )}
                aria-hidden
              />
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              collisionPadding={16}
              className="flex max-h-[min(85dvh,calc(100vh-8rem))] w-[min(calc(100vw-3rem),20rem)] max-w-[calc(100vw-2rem)] flex-col gap-3 overflow-y-auto rounded-xl border-border p-3 shadow-lg"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <p className="text-xs leading-relaxed text-muted-foreground px-1">
                {dateMode === "range" && dateRange?.from && !dateRange.to
                  ? "Tap the second date to finish your range."
                  : "Single day or range — dates update as you tap."}
              </p>

              <div className="px-1">
                {hasDateSelection && dateDetail ? (
                  <p className="text-xs font-medium text-foreground">
                    {dateDetail}
                  </p>
                ) : null}
              </div>

              <div
                role="group"
                aria-label="Date selection mode"
                className="grid grid-cols-2 gap-1 rounded-xl bg-muted/50 p-1"
              >
                <button
                  type="button"
                  aria-pressed={dateMode === "single"}
                  onClick={() => {
                    setDateMode("single");
                    setDateRange(undefined);
                  }}
                  className={cn(
                    "rounded-lg py-2 text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:py-2.5 sm:text-sm",
                    dateMode === "single"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Single day
                </button>
                <button
                  type="button"
                  aria-pressed={dateMode === "range"}
                  onClick={() => {
                    setDateMode("range");
                    setSingleDate(undefined);
                  }}
                  className={cn(
                    "rounded-lg py-2 text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:py-2.5 sm:text-sm",
                    dateMode === "range"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Date range
                </button>
              </div>

              <div className="rounded-lg border border-border/60 bg-background p-1 [&_[data-slot=calendar]]:w-full [&_[data-slot=calendar]]:min-w-0">
                {dateMode === "single" ? (
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={singleDate}
                    defaultMonth={singleDate ?? new Date()}
                    onSelect={setSingleDate}
                  />
                ) : (
                  <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    selected={dateRange}
                    defaultMonth={
                      dateRange?.from ?? dateRange?.to ?? new Date()
                    }
                    onSelect={setDateRange}
                    numberOfMonths={1}
                  />
                )}
              </div>

              {hasDateSelection ? (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 gap-2 border-dashed text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                  onClick={clearDates}
                >
                  <X className="size-4" aria-hidden />
                  Clear dates
                </Button>
              ) : null}
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <HomeExpenseSummary />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh flex-1 items-center justify-center px-6">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </main>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

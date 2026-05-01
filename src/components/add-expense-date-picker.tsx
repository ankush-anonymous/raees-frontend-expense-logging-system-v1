"use client";

import * as React from "react";
import { format, isToday, startOfDay } from "date-fns";
import { CalendarDays, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function AddExpenseDatePicker() {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(() => startOfDay(new Date()));
  const [shared, setShared] = React.useState(false);

  const dateLabel = isToday(date)
    ? "Today"
    : format(date, "MMM d, yyyy");

  return (
    <>
      <input
        type="hidden"
        name="date"
        value={format(date, "yyyy-MM-dd")}
      />
      <input
        type="hidden"
        name="shared"
        value={shared ? "true" : "false"}
      />

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40",
          "pb-[max(0px,env(safe-area-inset-bottom,0px))]"
        )}
      >
        <div
          className={cn(
            "pointer-events-auto mx-auto w-full max-w-[430px]",
            "border-t border-border bg-background/85 backdrop-blur-md",
            "shadow-[0_-8px_24px_-8px_oklch(0_0_0/0.35)]"
          )}
        >
          <div className="grid h-[3.75rem] grid-cols-2 divide-x divide-border sm:h-16">
            <div className="flex min-w-0 items-center justify-center gap-2.5 px-3 sm:gap-3">
              <Popover
                modal={false}
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className={cn(
                      "size-10 shrink-0 rounded-xl border-border bg-muted/40",
                      "hover:bg-muted/70"
                    )}
                    aria-label={`Expense date ${format(date, "MMMM d, yyyy")}. Tap to change.`}
                  >
                    <CalendarDays
                      className="size-[1.15rem] text-foreground"
                      aria-hidden
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="start"
                  sideOffset={10}
                  collisionPadding={16}
                  className="w-auto overflow-hidden border-border p-0 shadow-xl"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={date}
                    defaultMonth={date}
                    onSelect={(d) => {
                      if (d) {
                        setDate(startOfDay(d));
                        setCalendarOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              <span className="min-w-0 truncate text-sm font-bold tracking-tight text-foreground">
                {dateLabel}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={shared}
              onClick={() => setShared((s) => !s)}
              className={cn(
                "flex h-full w-full items-center justify-center gap-2.5 px-3",
                "text-sm font-bold tracking-tight text-foreground outline-none transition-colors",
                "hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                shared && "bg-primary/15 text-primary"
              )}
            >
              <UsersRound className="size-[1.15rem] shrink-0" aria-hidden />
              Shared
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

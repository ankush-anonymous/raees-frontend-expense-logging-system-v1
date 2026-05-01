"use client";

import type { LucideIcon } from "lucide-react";
import { Gem, Layers, Plane, UtensilsCrossed } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type ExpenseCategorySlice = {
  key: string;
  label: string;
  amount: number;
  colorVar: string;
  Icon: LucideIcon;
};

const MOCK_CATEGORIES: ExpenseCategorySlice[] = [
  {
    key: "food",
    label: "Food",
    amount: 4_250,
    colorVar: "--chart-1",
    Icon: UtensilsCrossed,
  },
  {
    key: "travel",
    label: "Travel",
    amount: 3_100,
    colorVar: "--chart-2",
    Icon: Plane,
  },
  {
    key: "luxury",
    label: "Luxury",
    amount: 1_800,
    colorVar: "--chart-3",
    Icon: Gem,
  },
  {
    key: "others",
    label: "Others",
    amount: 980,
    colorVar: "--chart-4",
    Icon: Layers,
  },
];

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function HomeExpenseSummary({
  categories = MOCK_CATEGORIES,
}: {
  categories?: ExpenseCategorySlice[];
}) {
  const total = categories.reduce((sum, c) => sum + c.amount, 0);
  const chartData = categories.map((c) => ({
    name: c.label,
    value: c.amount,
    fill: `var(${c.colorVar})`,
  }));

  return (
    <section aria-label="Expense summary" className="mt-8">
      <div className="rounded-xl border border-border bg-card/40 p-4 shadow-sm">
        <div className="relative mx-auto h-52 w-full max-w-[272px] sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="84%"
                paddingAngle={3}
                cornerRadius={6}
                stroke="transparent"
              >
                {chartData.map((row) => (
                  <Cell key={row.name} fill={row.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatInr(Number(value ?? 0))}
                cursor={{ fill: "oklch(1 0 0 / 6%)" }}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  background: "oklch(0.218 0.008 223.9)",
                  padding: "8px 12px",
                }}
                labelStyle={{
                  color: "oklch(0.987 0.002 197.1)",
                  marginBottom: 4,
                  fontWeight: 600,
                }}
                itemStyle={{ color: "oklch(0.987 0.002 197.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
              Total expense
            </p>
            <p className="mt-0.5 max-w-[7.5rem] text-center text-lg font-semibold tracking-tight text-foreground tabular-nums leading-tight sm:text-xl">
              {formatInr(total)}
            </p>
          </div>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-2.5">
          {categories.map((c) => {
            const Icon = c.Icon;
            return (
              <li key={c.key} className="min-w-0">
                <div className="flex h-full min-h-[4.25rem] items-center gap-2 rounded-xl border border-transparent bg-muted/35 px-2.5 py-2.5 transition-colors hover:border-border hover:bg-muted/50 sm:min-h-0 sm:px-3">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 sm:size-10"
                    style={{ color: `var(${c.colorVar})` }}
                  >
                    <Icon className="size-[1.05rem] sm:size-[1.15rem]" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-xs font-medium text-foreground sm:text-sm">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold tabular-nums text-foreground">
                      {formatInr(c.amount)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

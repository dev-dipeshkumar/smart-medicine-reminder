"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoseLog, useExportCSV } from "@/hooks/useDoseLog";
import type { DoseLog } from "@/lib/types";
import { Calendar, CalendarDays, ChevronDown, Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDateLabel(dateStr: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  if (dateStr === toYMD(today)) return "Today";
  if (dateStr === toYMD(yesterday)) return "Yesterday";

  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function actionDateKey(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type StatusFilter = "all" | "taken" | "missed";

const PAGE_SIZE = 50;

// ─── sub-components ─────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "default" | "green" | "red";
}) {
  const colorClass =
    color === "green"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40"
      : color === "red"
        ? "bg-destructive/10 text-destructive border-destructive/20"
        : "bg-muted text-muted-foreground border-border";
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${colorClass}`}
    >
      <span className="text-base font-bold">{value}</span>
      <span>{label}</span>
    </div>
  );
}

function DoseRow({ log, index }: { log: DoseLog; index: number }) {
  const isTaken = log.status === "taken";
  return (
    <div
      data-ocid={`history.item.${index + 1}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors duration-150 group"
    >
      {/* Icon dot */}
      <div
        className={`flex-shrink-0 w-2 h-2 rounded-full mt-0.5 ${
          isTaken ? "bg-emerald-500" : "bg-destructive"
        }`}
      />

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {log.medicineName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {log.scheduledTime ? `Scheduled ${log.scheduledTime} · ` : ""}
          {formatTime(log.actionTime)}
        </p>
      </div>

      {/* Status badge */}
      <Badge
        variant="outline"
        className={`flex-shrink-0 text-xs font-semibold capitalize ${
          isTaken
            ? "border-emerald-300 dark:border-emerald-700 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "border-destructive/40 bg-destructive/10 text-destructive"
        }`}
      >
        {log.status}
      </Badge>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div data-ocid="history.loading_state" className="space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          key={i}
          className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0"
        >
          <Skeleton className="w-2 h-2 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-ocid="history.empty_state"
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <CalendarDays className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        No dose history yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Start marking your doses as taken or missed from the Dashboard.
      </p>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = useExportCSV();

  // Fetch all logs; pass date filters to the API
  const { data: allLogs = [], isLoading } = useDoseLog({
    from: fromDate || undefined,
    to: toDate || undefined,
  });

  // Client-side status filter
  const filtered = useMemo(() => {
    let logs = [...allLogs];
    if (statusFilter !== "all")
      logs = logs.filter((l) => l.status === statusFilter);
    // Sort descending by actionTime
    logs.sort((a, b) => b.actionTime - a.actionTime);
    return logs;
  }, [allLogs, statusFilter]);

  // Stats
  const stats = useMemo(
    () => ({
      total: filtered.length,
      taken: filtered.filter((l) => l.status === "taken").length,
      missed: filtered.filter((l) => l.status === "missed").length,
    }),
    [filtered],
  );

  // Pagination
  const visible = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page],
  );
  const hasMore = visible.length < filtered.length;

  // Group by date
  const groups = useMemo(() => {
    const map = new Map<string, DoseLog[]>();
    for (const log of visible) {
      const key = actionDateKey(log.actionTime);
      const arr = map.get(key) ?? [];
      arr.push(log);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [visible]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportCSV();
    } finally {
      setIsExporting(false);
    }
  }, [exportCSV]);

  // Reset page when filters change
  const handleFromDate = (v: string) => {
    setFromDate(v);
    setPage(1);
  };
  const handleToDate = (v: string) => {
    setToDate(v);
    setPage(1);
  };
  const handleStatus = (v: StatusFilter) => {
    setStatusFilter(v);
    setPage(1);
  };

  const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Taken", value: "taken" },
    { label: "Missed", value: "missed" },
  ];

  return (
    <div data-ocid="history.page" className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Dose History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your complete medication log
          </p>
        </div>
        <Button
          data-ocid="history.export_button"
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting || isLoading || filtered.length === 0}
          className="flex-shrink-0 gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? "Exporting…" : "Export CSV"}
        </Button>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        {/* Date range */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label
              htmlFor="from-date"
              className="text-xs font-medium text-muted-foreground"
            >
              From
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                id="from-date"
                data-ocid="history.from_input"
                type="date"
                value={fromDate}
                onChange={(e) => handleFromDate(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label
              htmlFor="to-date"
              className="text-xs font-medium text-muted-foreground"
            >
              To
            </label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                id="to-date"
                data-ocid="history.to_input"
                type="date"
                value={toDate}
                onChange={(e) => handleToDate(e.target.value)}
                min={fromDate || undefined}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-ocid={`history.filter.${opt.value}`}
              onClick={() => handleStatus(opt.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-150 ${
                statusFilter === opt.value
                  ? opt.value === "taken"
                    ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-600 dark:text-emerald-400"
                    : opt.value === "missed"
                      ? "bg-destructive/15 border-destructive/40 text-destructive"
                      : "bg-primary/10 border-primary/30 text-primary"
                  : "bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats summary ── */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <StatChip label="Total Logged" value={stats.total} color="default" />
          <StatChip label="Taken" value={stats.taken} color="green" />
          <StatChip label="Missed" value={stats.missed} color="red" />
        </div>
      )}
      {isLoading && (
        <div className="flex gap-2">
          {(["filter-80", "filter-64a", "filter-64b"] as const).map(
            (key, i) => (
              <Skeleton
                key={key}
                className={`h-8 ${i === 0 ? "w-28" : "w-20"} rounded-full`}
              />
            ),
          )}
        </div>
      )}

      {/* ── Log list ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <SkeletonRows />
        ) : groups.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {groups.map(([dateKey, logs]) => (
              <div key={dateKey}>
                {/* Date group header */}
                <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b border-border px-4 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {formatDateLabel(dateKey)}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground/70">
                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                  </span>
                </div>
                {/* Rows */}
                <div className="divide-y divide-border">
                  {logs.map((log, i) => (
                    <DoseRow key={log.id} log={log} index={i} />
                  ))}
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center border-t border-border p-4">
                <Button
                  data-ocid="history.load_more_button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load more ({filtered.length - visible.length} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

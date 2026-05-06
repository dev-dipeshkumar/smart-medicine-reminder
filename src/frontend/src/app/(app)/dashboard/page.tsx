"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoseLog } from "@/hooks/useDoseLog";
import { useReminderNotifications } from "@/hooks/useReminderNotifications";
import { useLogDose, useReminders } from "@/hooks/useReminders";
import type { DoseLog, Reminder } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

// ── Greeting helpers ────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function todayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return days;
}

function dayLabel(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00`);
  return DAYS[d.getDay()];
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-2xl font-bold ${accent ?? "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

// ── Reminder Row ─────────────────────────────────────────────────────────────
function ReminderRow({
  reminder,
  index,
  loggedToday,
}: {
  reminder: Reminder;
  index: number;
  loggedToday: DoseLog | undefined;
}) {
  const logDose = useLogDose();

  const handleLog = (status: "taken" | "missed") => {
    logDose.mutate({
      reminderId: reminder.id,
      status,
      medicineName: reminder.medicineName,
      scheduledTime: reminder.scheduledTime,
    });
  };

  const isTaken = loggedToday?.status === "taken";
  const isMissed = loggedToday?.status === "missed";
  const isLogged = isTaken || isMissed;

  return (
    <div
      data-ocid={`dashboard.schedule.item.${index}`}
      className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
    >
      {/* Medicine icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isTaken
            ? "bg-success/15"
            : isMissed
              ? "bg-destructive/10"
              : "bg-primary/10"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-5 h-5 ${
            isTaken
              ? "text-success"
              : isMissed
                ? "text-destructive"
                : "text-primary"
          }`}
        >
          <title>Medicine</title>
          <ellipse
            cx={12}
            cy={12}
            rx={9}
            ry={4.5}
            transform="rotate(45 12 12)"
          />
          <line x1="4.8" y1="4.8" x2="19.2" y2="19.2" />
        </svg>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {reminder.medicineName}
        </p>
        <p className="text-xs text-muted-foreground">
          {reminder.dosage} · {reminder.scheduledTime}
        </p>
      </div>

      {/* Actions / status */}
      {isLogged ? (
        <Badge
          variant="outline"
          className={`shrink-0 text-xs ${
            isTaken
              ? "border-success/40 text-success bg-success/10"
              : "border-destructive/40 text-destructive bg-destructive/10"
          }`}
        >
          {isTaken ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-3 h-3 mr-1"
              >
                <title>Check</title>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Taken
            </>
          ) : (
            "Missed"
          )}
        </Badge>
      ) : (
        <div className="flex gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            data-ocid={`dashboard.schedule.taken_button.${index}`}
            disabled={logDose.isPending}
            onClick={() => handleLog("taken")}
            className="h-7 px-2.5 text-xs border-success/40 text-success hover:bg-success/10 hover:text-success"
          >
            Taken
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid={`dashboard.schedule.missed_button.${index}`}
            disabled={logDose.isPending}
            onClick={() => handleLog("missed")}
            className="h-7 px-2.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Missed
          </Button>
        </div>
      )}
    </div>
  );
}

// ── 7-Day Bar Chart ───────────────────────────────────────────────────────────
function WeekChart({ logs }: { logs: DoseLog[] }) {
  const days = last7Days();

  const bars = useMemo(() => {
    return days.map((day) => {
      const dayLogs = logs.filter(
        (l) =>
          l.actionTime &&
          new Date(l.actionTime).toISOString().slice(0, 10) === day,
      );
      const taken = dayLogs.filter((l) => l.status === "taken").length;
      const total = dayLogs.length;
      const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
      return { day, label: dayLabel(day), pct };
    });
  }, [logs, days]);

  const chartColors = [
    "oklch(var(--chart-1))",
    "oklch(var(--chart-2))",
    "oklch(var(--chart-3))",
    "oklch(var(--chart-4))",
    "oklch(var(--chart-5))",
    "oklch(var(--chart-1))",
    "oklch(var(--chart-2))",
  ];

  const BAR_W = 28;
  const GAP = 12;
  const CHART_H = 80;
  const LABEL_H = 20;
  const totalW = 7 * BAR_W + 6 * GAP;

  return (
    <div
      data-ocid="dashboard.week_chart"
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        7-Day Adherence
      </h3>
      <svg
        viewBox={`0 0 ${totalW} ${CHART_H + LABEL_H + 4}`}
        className="w-full"
        role="img"
        aria-label="7-day adherence bar chart"
      >
        <title>7-day adherence bar chart</title>
        {/* Background guide lines */}
        {[25, 50, 75, 100].map((pct) => {
          const y = CHART_H - (pct / 100) * CHART_H;
          return (
            <line
              key={pct}
              x1={0}
              y1={y}
              x2={totalW}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.07}
              strokeWidth={1}
            />
          );
        })}
        {bars.map((bar, i) => {
          const x = i * (BAR_W + GAP);
          const barH = Math.max(3, (bar.pct / 100) * CHART_H);
          const y = CHART_H - barH;
          const isToday = i === 6;
          return (
            <g key={bar.day}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={5}
                fill={chartColors[i]}
                opacity={isToday ? 1 : 0.65}
              />
              {/* Percentage label */}
              {bar.pct > 0 && (
                <text
                  x={x + BAR_W / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={8}
                  fill="currentColor"
                  opacity={0.6}
                >
                  {bar.pct}%
                </text>
              )}
              {/* Day label */}
              <text
                x={x + BAR_W / 2}
                y={CHART_H + LABEL_H}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                opacity={isToday ? 1 : 0.55}
                fontWeight={isToday ? "700" : "400"}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as
    | { fullName?: string; name?: string; username?: string }
    | undefined;
  const displayName = user?.fullName ?? user?.name ?? user?.username ?? "there";

  const { data: reminders = [], isLoading: remindersLoading } = useReminders();
  const today = todayDateStr();

  // Build today's from+to for filtering
  const todayFrom = today;
  const todayTo = today;
  const { data: todayLogs = [], isLoading: logsLoading } = useDoseLog({
    from: todayFrom,
    to: todayTo,
  });
  const { data: allLogs = [] } = useDoseLog();

  // Notifications
  const { notifPermission } = useReminderNotifications(
    reminders.length > 0 ? reminders : undefined,
  );

  // ── Derived stats ─────────────────────────────────────────────────
  const activeReminders = useMemo(
    () => reminders.filter((r) => r.isActive),
    [reminders],
  );

  const sortedReminders = useMemo(
    () =>
      [...activeReminders].sort((a, b) =>
        a.scheduledTime.localeCompare(b.scheduledTime),
      ),
    [activeReminders],
  );

  // Map reminderId -> today's log entry
  const todayLogMap = useMemo(() => {
    const m = new Map<string, DoseLog>();
    for (const l of todayLogs) {
      m.set(l.reminderId, l);
    }
    return m;
  }, [todayLogs]);

  const takenToday = useMemo(
    () => todayLogs.filter((l) => l.status === "taken").length,
    [todayLogs],
  );
  const totalToday = activeReminders.length;
  const adherencePct =
    totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0;

  // Current streak
  const currentStreak = useMemo(() => {
    if (allLogs.length === 0) return 0;
    let streak = 0;
    const daysToCheck = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      daysToCheck.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      );
    }
    for (const day of daysToCheck) {
      const dayLogs = allLogs.filter((l) => {
        const actionDate = new Date(l.actionTime).toISOString().slice(0, 10);
        return actionDate === day;
      });
      if (dayLogs.length === 0) break;
      const hasTaken = dayLogs.some((l) => l.status === "taken");
      if (!hasTaken) break;
      streak++;
    }
    return streak;
  }, [allLogs]);

  // Overall stats from all logs
  const totalTaken = allLogs.filter((l) => l.status === "taken").length;
  const totalMissed = allLogs.filter((l) => l.status === "missed").length;
  const overallAdherence =
    allLogs.length > 0 ? Math.round((totalTaken / allLogs.length) * 100) : 0;

  const isLoading = remindersLoading || logsLoading;

  return (
    <div data-ocid="dashboard.page" className="space-y-5 pb-2">
      {/* ── Greeting ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {getGreeting()}, <span className="text-primary">{displayName}</span>{" "}
            👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {/* Notification dot */}
        {notifPermission === "granted" && (
          <div
            data-ocid="dashboard.notif_active"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            title="Notification monitoring active"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
            </span>
            <span className="hidden sm:inline text-success font-medium">
              Active
            </span>
          </div>
        )}
      </div>

      {/* ── Daily Progress ────────────────────────────────────── */}
      <div
        data-ocid="dashboard.daily_progress"
        className="bg-card border border-border rounded-xl p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Daily Progress
          </h3>
          {isLoading ? (
            <Skeleton className="h-4 w-12" />
          ) : (
            <span
              data-ocid="dashboard.adherence_pct"
              className={`text-sm font-bold ${
                adherencePct >= 80
                  ? "text-success"
                  : adherencePct >= 50
                    ? "text-warning"
                    : "text-destructive"
              }`}
            >
              {adherencePct}%
            </span>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-3 w-full rounded-full" />
        ) : (
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${adherencePct}%`,
                background: "oklch(var(--primary))",
              }}
            />
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-3 w-28" />
        ) : (
          <p className="text-xs text-muted-foreground">
            {takenToday} of {totalToday} dose{totalToday !== 1 ? "s" : ""} taken
            today
          </p>
        )}
      </div>

      {/* ── Streak + Stats row ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div
          data-ocid="dashboard.streak_card"
          className="bg-card border border-border rounded-xl p-4 space-y-1"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Current Streak
          </span>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : currentStreak > 0 ? (
            <div className="flex items-end gap-1">
              <span className="flame-anim text-2xl leading-none">🔥</span>
              <span className="text-2xl font-bold text-foreground">
                {currentStreak}
              </span>
              <span className="text-xs text-muted-foreground pb-0.5">
                day streak
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground pt-1">
              Start today! Take your first dose.
            </p>
          )}
        </div>

        {/* Adherence % card */}
        <StatCard
          label="Overall Adherence"
          value={`${overallAdherence}%`}
          accent={
            overallAdherence >= 80
              ? "text-success"
              : overallAdherence >= 50
                ? "text-warning"
                : "text-destructive"
          }
        />
      </div>

      {/* ── Overall Adherence Stats ──────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Total Taken"
          value={isLoading ? "—" : totalTaken}
          accent="text-success"
        />
        <StatCard
          label="Missed"
          value={isLoading ? "—" : totalMissed}
          accent="text-destructive"
        />
        <StatCard label="Logged" value={isLoading ? "—" : allLogs.length} />
      </div>

      {/* ── Today's Schedule ─────────────────────────────────────── */}
      <section data-ocid="dashboard.schedule">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Today's Schedule
          </h3>
          <Badge variant="outline" className="text-xs">
            {isLoading ? "…" : `${sortedReminders.length} active`}
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : sortedReminders.length === 0 ? (
          <div
            data-ocid="dashboard.schedule.empty_state"
            className="bg-card border border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-6 h-6 text-muted-foreground"
              >
                <title>No reminders</title>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                No reminders yet
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add a reminder to start tracking your medication.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedReminders.map((reminder, i) => (
              <ReminderRow
                key={reminder.id}
                reminder={reminder}
                index={i + 1}
                loggedToday={todayLogMap.get(reminder.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 7-Day Chart ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <WeekChart logs={allLogs} />
      )}
    </div>
  );
}

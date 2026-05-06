import { useQuery } from "@tanstack/react-query";
import type { DoseLog } from "../backend";
import { useActor } from "./useActor";

export function useDoseLog() {
  const { actor, isFetching } = useActor();
  return useQuery<DoseLog[]>({
    queryKey: ["dose-log"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllLogs();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias used by Dashboard and History pages
export function useAllLogs() {
  return useDoseLog();
}

export function useExportCSV(
  allLogs: DoseLog[] | undefined,
  reminderMap: Map<string, string>,
) {
  return function exportCSV() {
    if (!allLogs) return;
    const rows = [
      ["Date", "Time", "Medicine", "Status", "Snooze Minutes"],
      ...allLogs.map((l) => {
        const d = new Date(Number(l.timestamp / 1_000_000n));
        return [
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          reminderMap.get(l.reminderId) ?? l.reminderId,
          l.status,
          l.snoozeMinutes ? String(l.snoozeMinutes) : "",
        ];
      }),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mediremind-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

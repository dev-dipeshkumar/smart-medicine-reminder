import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CheckupReport as BackendCheckupReport,
  DoctorGuidance as BackendDoctorGuidance,
} from "../backend";
import { useActor } from "./useActor";

// Re-export backend types with local names for backward compat
export type DoctorGuidance = BackendDoctorGuidance;
export type CheckupReport = BackendCheckupReport;

export function useDoctorGuidance() {
  const { actor, isFetching } = useActor();
  return useQuery<DoctorGuidance[]>({
    queryKey: ["doctorGuidance"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllDoctorGuidance();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDoctorGuidance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (guidance: DoctorGuidance) => {
      if (!actor) throw new Error("Not connected");
      await actor.addDoctorGuidance(guidance);
    },
    onMutate: async (newItem: DoctorGuidance) => {
      await qc.cancelQueries({ queryKey: ["doctorGuidance"] });
      const previous = qc.getQueryData<DoctorGuidance[]>(["doctorGuidance"]);
      qc.setQueryData(["doctorGuidance"], (old: DoctorGuidance[] = []) => [
        ...old,
        newItem,
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["doctorGuidance"], context.previous);
      }
      toast.error("Failed to add doctor guidance");
    },
    onSuccess: () => {
      toast.success("Doctor guidance added");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["doctorGuidance"] });
    },
  });
}

export function useUpdateDoctorGuidance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (guidance: DoctorGuidance) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateDoctorGuidance(guidance);
    },
    onMutate: async (updated: DoctorGuidance) => {
      await qc.cancelQueries({ queryKey: ["doctorGuidance"] });
      const previous = qc.getQueryData<DoctorGuidance[]>(["doctorGuidance"]);
      qc.setQueryData(["doctorGuidance"], (old: DoctorGuidance[] = []) =>
        old.map((item) => (item.id === updated.id ? updated : item)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["doctorGuidance"], context.previous);
      }
      toast.error("Failed to update doctor guidance");
    },
    onSuccess: () => {
      toast.success("Doctor guidance updated");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["doctorGuidance"] });
    },
  });
}

export function useDeleteDoctorGuidance() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteDoctorGuidance(id);
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["doctorGuidance"] });
      const previous = qc.getQueryData<DoctorGuidance[]>(["doctorGuidance"]);
      qc.setQueryData(["doctorGuidance"], (old: DoctorGuidance[] = []) =>
        old.filter((item) => item.id !== id),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["doctorGuidance"], context.previous);
      }
      toast.error("Failed to delete doctor guidance");
    },
    onSuccess: () => {
      toast.success("Doctor guidance deleted");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["doctorGuidance"] });
    },
  });
}

export function useCheckupReports() {
  const { actor, isFetching } = useActor();
  return useQuery<CheckupReport[]>({
    queryKey: ["checkupReports"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllCheckupReports();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCheckupReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (report: CheckupReport) => {
      if (!actor) throw new Error("Not connected");
      await actor.addCheckupReport(report);
    },
    onMutate: async (newItem: CheckupReport) => {
      await qc.cancelQueries({ queryKey: ["checkupReports"] });
      const previous = qc.getQueryData<CheckupReport[]>(["checkupReports"]);
      qc.setQueryData(["checkupReports"], (old: CheckupReport[] = []) => [
        ...old,
        newItem,
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["checkupReports"], context.previous);
      }
      toast.error("Failed to add checkup report");
    },
    onSuccess: () => {
      toast.success("Checkup report added");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["checkupReports"] });
    },
  });
}

export function useUpdateCheckupReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (report: CheckupReport) => {
      if (!actor) throw new Error("Not connected");
      await actor.updateCheckupReport(report);
    },
    onMutate: async (updated: CheckupReport) => {
      await qc.cancelQueries({ queryKey: ["checkupReports"] });
      const previous = qc.getQueryData<CheckupReport[]>(["checkupReports"]);
      qc.setQueryData(["checkupReports"], (old: CheckupReport[] = []) =>
        old.map((item) => (item.id === updated.id ? updated : item)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["checkupReports"], context.previous);
      }
      toast.error("Failed to update checkup report");
    },
    onSuccess: () => {
      toast.success("Checkup report updated");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["checkupReports"] });
    },
  });
}

export function useDeleteCheckupReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteCheckupReport(id);
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["checkupReports"] });
      const previous = qc.getQueryData<CheckupReport[]>(["checkupReports"]);
      qc.setQueryData(["checkupReports"], (old: CheckupReport[] = []) =>
        old.filter((item) => item.id !== id),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        qc.setQueryData(["checkupReports"], context.previous);
      }
      toast.error("Failed to delete checkup report");
    },
    onSuccess: () => {
      toast.success("Checkup report deleted");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["checkupReports"] });
    },
  });
}

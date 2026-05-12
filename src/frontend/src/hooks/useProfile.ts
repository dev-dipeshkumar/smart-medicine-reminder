import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserProfile } from "../backend";
import { useActor } from "./useActor";

export type { UserProfile };

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      await actor.updateProfile(profile);
    },
    onMutate: async (newProfile: UserProfile) => {
      // Cancel any in-flight refetches so they don't stomp our optimistic value
      await qc.cancelQueries({ queryKey: ["profile"] });
      // Snapshot previous value for rollback
      const previous = qc.getQueryData<UserProfile | null>(["profile"]);
      // Apply optimistic update immediately — UI feels instant
      qc.setQueryData(["profile"], newProfile);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back on network failure
      if (context?.previous !== undefined) {
        qc.setQueryData(["profile"], context.previous);
      }
      toast.error("Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Profile updated");
    },
    onSettled: () => {
      // Sync with server in background to confirm
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

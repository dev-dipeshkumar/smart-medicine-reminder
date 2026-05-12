// Custom useActor that injects passwordIdentity when II identity is not available.
// CRITICAL FIX: Before calling createActorWithConfig, we resolve the canister ID
// via getCanisterConfig() which reads import.meta.env.VITE_BACKEND_CANISTER_ID
// (baked in at Vite build time) as the primary source. This ensures Vercel builds
// always have the correct canister ID even when env.json still has 'undefined'.
import {
  createActorWithConfig,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createActor } from "../backend";
import { useAuth } from "./useAuth";

const ACTOR_QUERY_KEY = "actor";

export function useActor() {
  const { identity: iiIdentity } = useInternetIdentity();
  const { passwordIdentity, isRestoring } = useAuth();
  const queryClient = useQueryClient();

  // Use II identity if available, else fall back to password-derived identity
  const effectiveIdentity = iiIdentity ?? passwordIdentity ?? undefined;
  const identityKey = effectiveIdentity
    ? effectiveIdentity.getPrincipal().toString()
    : "anonymous";

  const actorQuery = useQuery({
    // Include isRestoring + identityKey so the query re-runs once restoration
    // completes and whenever the identity changes (login / logout).
    queryKey: [ACTOR_QUERY_KEY, isRestoring ? "restoring" : identityKey],
    queryFn: async () => {
      // Before calling createActorWithConfig, ensure the config cache is
      // primed with the canister ID we baked in at Vite build time.
      // This prevents loadConfig() from throwing on Vercel when env.json
      // still contains 'undefined' but import.meta.env.VITE_BACKEND_CANISTER_ID
      // was injected correctly at build time.
      const { getCanisterConfig } = await import("../config");
      let canisterId: string;
      try {
        const cfg = await getCanisterConfig();
        canisterId = cfg.canisterId;
      } catch (err) {
        console.error(
          "[useActor] Cannot create actor — canister ID not resolved.",
          "Set CANISTER_ID_BACKEND in your Vercel environment variables.",
          "See VERCEL_SETUP.md for instructions.",
          err,
        );
        throw err;
      }

      // Patch process.env so loadConfig() inside createActorWithConfig
      // finds the canister ID even when env.json has 'undefined'.
      const env = (
        typeof process !== "undefined"
          ? process.env
          : (window as any).process?.env
      ) as Record<string, string>; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (env && !env.CANISTER_ID_BACKEND) {
        env.CANISTER_ID_BACKEND = canisterId;
      }

      const actorOptions = effectiveIdentity
        ? { agentOptions: { identity: effectiveIdentity } }
        : {};
      const actor = await createActorWithConfig(createActor, actorOptions);

      if (
        typeof actor === "object" &&
        actor !== null &&
        "_initializeAccessControl" in actor
      ) {
        if (effectiveIdentity) {
          try {
            await (
              actor as { _initializeAccessControl: () => Promise<void> }
            )._initializeAccessControl();
          } catch {
            // ignore — may fail for non-admin users
          }
        }
      }
      return actor;
    },
    // Never cache the actor across identity changes — always refetch for a new key.
    staleTime: 0,
    // Discard the cached result immediately so a stale anonymous actor is
    // never returned after the user logs in or the page is restored.
    gcTime: 0,
    // Do NOT create the actor until session restoration is complete AND we
    // have a real identity. This prevents the cold-start anonymous-actor bug
    // on Vercel where sessionStorage hasn't been read yet.
    enabled: !isRestoring && !!effectiveIdentity,
  });

  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
      queryClient.refetchQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
  };
}

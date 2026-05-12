/**
 * Resilient canister config for Vercel and ICP deployments.
 *
 * Canister ID resolution order:
 *   1. import.meta.env.VITE_BACKEND_CANISTER_ID  — baked in at Vite build time
 *      (set CANISTER_ID_BACKEND or VITE_BACKEND_CANISTER_ID in Vercel dashboard)
 *   2. /env.json — written by vite.config.js or scripts/generate-env.js
 *   3. Throws with a clear diagnostic message so failures are obvious
 *
 * To deploy to Vercel, set ONE of these environment variables in your
 * Vercel project settings:
 *   - CANISTER_ID_BACKEND   (preferred — same key the Caffeine pipeline uses)
 *   - VITE_BACKEND_CANISTER_ID  (alternative — automatically exposed to the browser)
 *
 * The real canister ID looks like: xxxxx-xxxxx-xxxxx-xxxxx-cai
 * Find it on your Caffeine project page or from the deployment logs.
 */

export interface CanisterConfig {
  canisterId: string;
  backendHost: string;
  storageGatewayUrl: string;
  projectId: string;
  iiDerivationOrigin: string | undefined;
}

const MAINNET_HOST = "https://icp-api.io";
const DEFAULT_STORAGE_URL = "https://blob.caffeine.ai";
const DEFAULT_PROJECT_ID = "0000000-0000-0000-0000-00000000000";

let _cachedConfig: CanisterConfig | null = null;

/**
 * Returns the canister config, loading it once and caching for the session.
 * Throws with a clear diagnostic if the canister ID cannot be resolved.
 */
export async function getCanisterConfig(): Promise<CanisterConfig> {
  if (_cachedConfig) return _cachedConfig;

  // Source 1: Vite build-time constant (works on Vercel without custom scripts)
  const viteBaked = import.meta.env.VITE_BACKEND_CANISTER_ID as string | undefined;
  if (viteBaked && viteBaked !== "undefined" && viteBaked.trim() !== "") {
    console.info("[config] canister ID resolved from VITE_BACKEND_CANISTER_ID:", viteBaked);
    _cachedConfig = {
      canisterId: viteBaked.trim(),
      backendHost: (import.meta.env.VITE_BACKEND_HOST as string | undefined) ?? MAINNET_HOST,
      storageGatewayUrl: DEFAULT_STORAGE_URL,
      projectId: DEFAULT_PROJECT_ID,
      iiDerivationOrigin: undefined,
    };
    return _cachedConfig;
  }

  // Source 2: /env.json (written by vite.config.js or scripts/generate-env.js)
  try {
    const baseUrl = (import.meta.env.BASE_URL as string | undefined) ?? "/";
    const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const response = await fetch(`${base}env.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json() as Record<string, string>;

    const id = json.backend_canister_id;
    if (id && id !== "undefined" && id.trim() !== "") {
      console.info("[config] canister ID resolved from /env.json:", id);
      _cachedConfig = {
        canisterId: id.trim(),
        backendHost: json.backend_host && json.backend_host !== "undefined"
          ? json.backend_host
          : MAINNET_HOST,
        storageGatewayUrl: json.storage_gateway_url && json.storage_gateway_url !== "undefined"
          ? json.storage_gateway_url
          : DEFAULT_STORAGE_URL,
        projectId: json.project_id && json.project_id !== "undefined"
          ? json.project_id
          : DEFAULT_PROJECT_ID,
        iiDerivationOrigin: json.ii_derivation_origin && json.ii_derivation_origin !== "undefined"
          ? json.ii_derivation_origin
          : undefined,
      };
      return _cachedConfig;
    }

    console.error(
      "[config] /env.json loaded but backend_canister_id is 'undefined'.\n" +
      "To fix this, set CANISTER_ID_BACKEND in your Vercel project environment variables.\n" +
      "The value is the ICP canister ID shown on your Caffeine project page (format: xxxxx-xxxxx-xxxxx-xxxxx-cai)."
    );
  } catch (err) {
    console.error("[config] Failed to fetch /env.json:", err);
  }

  // Source 3: Caffeine platform globals injected at runtime
  // The Caffeine ICP runtime may inject canister IDs into well-known window globals.
  // Check all known global shapes before giving up.
  try {
    const caffeineGlobal =
      (window as Window & { __CANISTER_IDS__?: Record<string, string> }).__CANISTER_IDS__?.backend ??
      (window as Window & { __CAFFEINE_CANISTER_IDS__?: Record<string, string> }).__CAFFEINE_CANISTER_IDS__?.backend ??
      (window as Window & { __DFX_CANISTER_IDS__?: Record<string, string> }).__DFX_CANISTER_IDS__?.backend;
    if (caffeineGlobal && caffeineGlobal !== "undefined" && caffeineGlobal.trim() !== "") {
      console.info("[config] canister ID resolved from Caffeine platform global:", caffeineGlobal);
      _cachedConfig = {
        canisterId: caffeineGlobal.trim(),
        backendHost: MAINNET_HOST,
        storageGatewayUrl: DEFAULT_STORAGE_URL,
        projectId: DEFAULT_PROJECT_ID,
        iiDerivationOrigin: undefined,
      };
      return _cachedConfig;
    }
  } catch {
    // window globals may not be available in all environments — ignore
  }

  throw new Error(
    "[MediRemind] Backend canister ID is not configured.\n" +
    "Set CANISTER_ID_BACKEND in your Vercel project settings.\n" +
    "Find the canister ID on your Caffeine project deployment page."
  );
}

/** Reset the config cache (useful in tests or after environment changes). */
export function resetConfigCache(): void {
  _cachedConfig = null;
}

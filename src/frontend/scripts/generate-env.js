#!/usr/bin/env node
// Generates env.json from environment variables at build time.
// Run as prebuild on Vercel so the canister config is baked into the dist.
// All values fall back to "undefined" (the sentinel the loadConfig() function
// uses to decide whether to try process.env.CANISTER_ID_BACKEND instead).
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const backendCanisterId =
  process.env.CANISTER_ID_BACKEND ??
  process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID ??
  "undefined";

const backendHost =
  process.env.BACKEND_HOST ??
  // Default to the ICP mainnet API for all Vercel / non-local builds.
  // This is required — without it the actor points to localhost and all calls fail.
  "https://icp-api.io";

const storageGatewayUrl =
  process.env.STORAGE_GATEWAY_URL ?? "https://blob.caffeine.ai";

const iiDerivationOrigin =
  process.env.II_DERIVATION_ORIGIN ?? "undefined";

const projectId =
  process.env.PROJECT_ID ?? "undefined";

const config = {
  backend_host: backendHost,
  backend_canister_id: backendCanisterId,
  project_id: projectId,
  ii_derivation_origin: iiDerivationOrigin,
  storage_gateway_url: storageGatewayUrl,
};

// Write to the frontend root so `pnpm build` picks it up and copies it to dist/
const outputPath = resolve(__dirname, "../env.json");
writeFileSync(outputPath, JSON.stringify(config, null, 2) + "\n");
console.log("[generate-env] env.json written:", config);

import { fileURLToPath, URL } from "url";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the correct ICP host for production builds.
// On Vercel (and any non-local build), use the ICP mainnet API.
// The Caffeine ICP pipeline injects the real backend_canister_id at build
// time via $BACKEND_CANISTER_ID; on Vercel that env var must be set in the
// project settings.
const backendHost =
  process.env.BACKEND_HOST ??
  (process.env.DFX_NETWORK === "local"
    ? "http://localhost:8081"
    : "https://icp-api.io");

const backendCanisterId =
  process.env.CANISTER_ID_BACKEND ??
  process.env.BACKEND_CANISTER_ID ??
  process.env.VITE_BACKEND_CANISTER_ID ??
  "undefined";

// Write env.json before the Vite build starts so loadConfig() can find it.
// This covers both the Vercel build path and local `pnpm build` invocations
// that don't go through the Caffeine canister.yaml pipeline.
const envJsonPath = resolve(__dirname, "env.json");
try {
  const envPayload = {
    backend_host: backendHost,
    backend_canister_id: backendCanisterId,
    project_id: process.env.PROJECT_ID ?? "undefined",
    ii_derivation_origin: process.env.II_DERIVATION_ORIGIN ?? "undefined",
    storage_gateway_url:
      process.env.STORAGE_GATEWAY_URL ?? "https://blob.caffeine.ai",
  };
  writeFileSync(envJsonPath, JSON.stringify(envPayload, null, 2) + "\n");
  console.log("[vite] env.json generated:", envPayload);
} catch (err) {
  console.warn("[vite] Could not write env.json (may be read-only in ICP pipeline — OK):", err.message);
}

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

export default defineConfig({
  logLevel: "error",
  base: "/",
  // Bake VITE_BACKEND_CANISTER_ID into the bundle at build time.
  // On Vercel: set CANISTER_ID_BACKEND (or VITE_BACKEND_CANISTER_ID) in your
  // project environment variables. The value is your ICP canister ID
  // (format: xxxxx-xxxxx-xxxxx-xxxxx-cai) from your Caffeine deployment page.
  define: {
    "import.meta.env.VITE_BACKEND_CANISTER_ID": JSON.stringify(backendCanisterId),
    "import.meta.env.VITE_BACKEND_HOST": JSON.stringify(backendHost),
  },
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "dfinity-vendor": [
            "@dfinity/agent",
            "@dfinity/auth-client",
            "@dfinity/identity",
            "@dfinity/principal",
            "@dfinity/candid",
          ],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
});

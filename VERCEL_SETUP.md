# Vercel Deployment Setup for MediRemind

## Why backend calls fail after deploying to Vercel

MediRemind's backend runs on the **Internet Computer (ICP)** blockchain via Caffeine.
The frontend deployed on Vercel must know the ICP canister ID to connect to the backend.

When the Caffeine pipeline deploys the app, it injects the canister ID at build time.
When **you** deploy to Vercel yourself, Vercel doesn't run the Caffeine pipeline —
so you must provide the canister ID manually as an environment variable.

Without this, every backend call (create reminder, update profile, save records) silently
fails because the frontend doesn't know where to send the request.

---

## How to fix it: one-time setup in Vercel

### Step 1 — Find your canister ID

Your canister ID is shown on the Caffeine platform:

1. Open your project on **caffeine.ai**
2. Go to the deployment / settings page
3. Copy the **Backend Canister ID** (looks like: `xxxxx-xxxxx-xxxxx-xxxxx-cai`)

### Step 2 — Add it to Vercel

1. Open your project on **vercel.com**
2. Go to **Settings → Environment Variables**
3. Add a new variable:
   - **Name**: `CANISTER_ID_BACKEND`
   - **Value**: your canister ID (e.g., `abcde-12345-xxxxx-xxxxx-cai`)
   - **Environments**: Production, Preview, Development (all three)
4. Click **Save**
5. Go to **Deployments**, click the three dots on the latest build, and choose **Redeploy**

After the redeploy completes, adding reminders and updating your profile will work.

---

## Alternative: use VITE_BACKEND_CANISTER_ID

If you prefer, you can use `VITE_BACKEND_CANISTER_ID` instead of `CANISTER_ID_BACKEND`.
Both variable names are accepted — use whichever is easier to remember.

---

## How it works (technical)

```
Vercel build process:
  1. vite.config.js runs
  2. Reads CANISTER_ID_BACKEND env var → writes it into env.json
  3. Also bakes it into the JS bundle as import.meta.env.VITE_BACKEND_CANISTER_ID
  4. At runtime, getCanisterConfig() reads the baked-in value first
  5. Falls back to fetching /env.json if the baked-in value is missing
```

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `CANISTER_ID_BACKEND` | **YES** | ICP backend canister ID (e.g., `xxxxx-xxxxx-xxxxx-xxxxx-cai`) |
| `VITE_BACKEND_CANISTER_ID` | Alternative | Same as above, Vite-prefixed |
| `BACKEND_HOST` | No | Defaults to `https://icp-api.io` (ICP mainnet) |
| `STORAGE_GATEWAY_URL` | No | Defaults to `https://blob.caffeine.ai` |

---

## Keeping Vercel in sync with Caffeine

Each time you **redeploy on Caffeine** (which may generate a new canister ID),
you need to update the `CANISTER_ID_BACKEND` in Vercel and redeploy there too.

The GitHub repository is automatically updated each time Caffeine deploys.
Vercel auto-deploys from GitHub — but the canister ID only changes if Caffeine creates
a new canister, which is rare. Normally the same canister ID is used across all deploys.

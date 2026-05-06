# MediRemind – Smart Medicine Reminder

![Platform](https://img.shields.io/badge/Platform-Internet%20Computer-blue) ![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb) ![Backend](https://img.shields.io/badge/Backend-Motoko%20%2F%20ICP-orange) ![License](https://img.shields.io/badge/License-BTech%20CSE%20Project-green)

> A decentralized, browser-based medicine reminder system that helps patients, caregivers, and elderly users take their medications on time — with scheduled notifications, AI-assisted drug lookup, adherence analytics, and a full user profile management system, all backed by the Internet Computer Protocol.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Authentication](#authentication)
6. [Medicine Lookup](#medicine-lookup)
7. [Reminder Notifications](#reminder-notifications)
8. [User Profile Management](#user-profile-management)
9. [Analytics and Adherence Tracking](#analytics-and-adherence-tracking)
10. [Data Storage](#data-storage)
11. [Getting Started](#getting-started)
12. [Project Structure](#project-structure)
13. [Deployment](#deployment)
14. [Known Issues and Fixes](#known-issues-and-fixes)
15. [Future Enhancements](#future-enhancements)
16. [License](#license)

---

## Overview

Medication non-adherence is a critical public health problem. Studies consistently show that nearly 50% of patients with chronic conditions do not take their medicines as prescribed, contributing to disease complications, avoidable hospitalizations, and increased healthcare costs. The challenge is especially acute among elderly patients, individuals managing multiple concurrent medications, and caregivers coordinating schedules for others.

**MediRemind** addresses this problem by providing a smart, lightweight, and privacy-first web application that:

- Allows users to register and create personalized medicine reminder schedules with specific dosages and times.
- Delivers real-time browser popup notifications and voice alerts (via the Web Speech API) at the scheduled time, without requiring any server-side push infrastructure.
- Gives users instant access to AI-summarized drug information from the OpenFDA database directly within the app.
- Tracks adherence over time through a 7-day bar chart, streak counter, and overall adherence percentage, motivating consistent behavior.
- Stores all data securely and permanently on the Internet Computer Protocol (ICP) blockchain — no centralized cloud server, no third-party database, and no reliance on local browser storage.

The application targets three primary user groups:

- **Patients** managing chronic conditions (diabetes, hypertension, cardiovascular disease) who need reliable daily dose reminders.
- **Caregivers** who coordinate medication schedules for family members or patients in their care.
- **Elderly users** who benefit from the combination of browser popup alerts, voice reminders, and a simple, well-structured interface.

---

## Features

### Core Functionality

- Schedule medicine reminders with medicine name, dosage, frequency, and a specific daily time.
- Edit and delete existing reminders from the dashboard.
- Mark doses as taken or missed directly from the reminder interface.
- Real-time browser popup notifications at the scheduled dose time (requires notification permission).
- Voice alert via the Web Speech API that reads the reminder aloud (e.g., "Time to take your Metformin 500mg").
- Pulsing green dot in the application header confirms that the notification monitoring system is actively running.

### Medicine Information

- Search any medicine by name to retrieve structured drug label data from the OpenFDA API (~200ms average response).
- AI-generated plain-language summary produced in parallel using the Hugging Face `facebook/bart-large-cnn` model.
- In production, medicine search is routed through the backend canister's ICP HTTPS outcalls to bypass browser Content Security Policy restrictions.
- Local offline fallback database of 8 common medicines (Metformin, Lisinopril, Atorvastatin, Omeprazole, Amoxicillin, Ibuprofen, Paracetamol, Amlodipine) used if external APIs are unavailable.

### User Profile Management

- Dedicated Profile tab in the main navigation, also accessible via a clickable avatar icon in the application header.
- Editable profile card with fields: Full Name, Email, Age, Gender, and Locality / Address.
- Profile photo upload using a simple file picker backed by ICP Blob Storage; the photo is displayed in both the header avatar and the profile card.
- Medical Records section with three fully editable sub-sections: Doctor Guidance (doctor name and prescribed treatment), Checkup Reports (visit date and notes), and Medication Reports (auto-populated from active reminders, read-only).
- "Last Updated" timestamp displayed on the profile card after any save.
- Logout button inside the Profile tab that clears the session and redirects to the login page.

### Analytics and Adherence

- 7-day SVG bar chart showing daily dose completion rate.
- Streak tracker with flame animation showing consecutive days of full adherence.
- Overall adherence percentage calculated from the dose log.
- Filterable dose history log showing all taken and missed doses with timestamps.
- CSV export of the complete dose log for sharing with a healthcare provider.

### User Experience

- Dark mode toggle for comfortable use in low-light environments.
- Fully responsive design supporting desktop, tablet, and mobile browsers.
- Registration form collects Full Name, Email, Age, Gender, Locality, Username, and Password — all fields present in the profile edit section, so the profile is populated from day one.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 19 + TypeScript + Vite | Component-based SPA with compile-time type safety |
| Styling | Tailwind CSS | Utility-first responsive design and dark mode |
| Graphics | SVG (Scalable Vector Graphics) | Adherence bar charts, flame animations, inline icons |
| Scripting | JavaScript ES6+ | Notification scheduling, Web Speech API, PBKDF2 crypto, CSV export |
| Backend Language | Motoko | Smart contract logic on the Internet Computer |
| Backend Platform | Internet Computer Protocol (ICP) | Decentralized hosting, canister-based data storage, HTTPS outcalls |
| Authentication | Internet Identity + PBKDF2 / Ed25519 | Wallet-based and username/password login with derived IC identity |
| File Storage | ICP Blob Storage | Profile photo upload and retrieval |
| Medicine Data | OpenFDA API | Real-time drug label and dosage information |
| AI Summarization | Hugging Face (`facebook/bart-large-cnn`) | Plain-language AI summaries of raw FDA drug labels |
| External API Proxy | ICP HTTPS Outcalls | Routes API requests through the canister in production to bypass CSP |
| Build Tooling | Vite + pnpm | Dev server, hot module replacement, production bundling |
| Package Manager (Backend) | Mops | Motoko dependency management |

---

## System Architecture

MediRemind uses a decentralized full-stack architecture hosted entirely on the ICP network. The frontend is served from an ICP asset canister and communicates with the backend Motoko canister through the ICP Agent library over HTTPS.

```
User Browser
    |
    +-- React Frontend (ICP Asset Canister)
    |       |
    |       +-- ICP Agent (HTTPS) --------> Motoko Backend Canister (ICP Network)
    |                                               |
    |                                               +-- User Store (Stable Memory)
    |                                               +-- Reminders Store (Stable Memory)
    |                                               +-- Dose Log Store (Stable Memory)
    |                                               +-- Medical Records Store (Stable Memory)
    |                                               |
    |                                               +-- HTTPS Outcalls
    |                                                       |
    |                                                       +-- OpenFDA API
    |                                                       +-- Hugging Face API
    |
    +-- Direct Browser Fetch (Dev / Draft) -> OpenFDA API (~200ms)
```

### Architecture Layers

| Layer | Technology | Responsibility |
|---|---|---|
| Presentation | React, TypeScript, Tailwind CSS, SVG, Web APIs | UI rendering, user input, state display, notification scheduling |
| Application Logic | TypeScript, ICP Agent JS, PBKDF2, Ed25519, Web Speech API | Authentication, identity derivation, backend actor creation, medicine search orchestration |
| Business Logic | Motoko, ICP Canister SDK | Access control, CRUD operations, dose log management, HTTPS outcall proxy |
| Data Persistence | ICP Stable Memory | Permanent, replicated, tamper-resistant data storage across ICP subnet nodes |

---

## Authentication

MediRemind supports two authentication methods. Both produce a valid Internet Computer principal that is used to sign all backend canister calls.

| Method | Mechanism | Use Case |
|---|---|---|
| Username + Password | User credentials are passed through PBKDF2 (100,000 iterations, SHA-256) using the browser's `SubtleCrypto` API to deterministically derive an Ed25519 keypair. This keypair becomes the user's unique IC principal. | General users unfamiliar with Web3 workflows |
| Internet Identity | ICP's native browser-based decentralized authentication. Uses a hardware authenticator, fingerprint sensor, or device PIN to produce a unique IC identity anchor. | Web3-native users |

### Implementation Details

- `AuthContext` (React Context API) holds the authenticated state globally across all components. It is always present in `main.tsx` as the outermost provider wrapper, preventing crashes caused by `useAuth()` calls outside of context.
- The `useActor` custom hook creates the authenticated backend actor using `iiIdentity ?? passwordIdentity`, ensuring that password-login users receive a properly authenticated actor even when Internet Identity is not active.
- The password-derived identity seed is stored in `sessionStorage` to survive page refreshes within a browser session. It is cleared automatically when the tab is closed or the user logs out.

---

## Medicine Lookup

The medicine information lookup feature uses a layered strategy to balance speed, reliability, and production compatibility:

1. **Direct OpenFDA fetch (primary)** — The frontend performs a direct `fetch()` to `https://api.fda.gov/drug/label.json` from the browser. Average response time is approximately 200ms. This path is used in development and draft environments.

2. **Hugging Face AI summary (parallel)** — While the OpenFDA response is loading, a concurrent request is made to the Hugging Face Inference API using the `facebook/bart-large-cnn` model. The model condenses the raw FDA drug label text into a short, plain-language paragraph suitable for non-medical users.

3. **Backend canister HTTPS outcall (production fallback)** — In production deployments, browser Content Security Policy (CSP) headers may block direct fetch calls to external APIs. In this case, the same requests are routed through the Motoko backend canister's ICP HTTPS outcall mechanism, which proxies the requests from within the ICP network and returns the results to the frontend. Typical response time via this path is 4–8 seconds.

4. **Local offline database (final fallback)** — If both the direct fetch and the backend outcall fail (e.g., due to network unavailability or API downtime), a local static database of 8 common medicines is used to return basic information.

---

## Reminder Notifications

All notification scheduling runs entirely within the user's browser. No server-side push infrastructure is required.

### How It Works

1. On application load, `useReminderNotifications` requests browser notification permission from the user.
2. A `setInterval` loop runs every 30 seconds in the background while the page is open.
3. Each tick retrieves the current local time in `HH:MM` format and compares it against the scheduled time of all active reminders.
4. When a match is found, the system fires:
   - A **browser Notification popup** displaying the medicine name and dosage.
   - A **voice alert** via `window.speechSynthesis` reading the reminder aloud.
   - A **console log entry** for debugging.
5. `sessionStorage` is used to track which reminders have already fired in the current minute, preventing duplicate alerts.
6. If the user has not granted notification permission, the system falls back to `window.alert()` to ensure the reminder is never silently missed.

### Important Limitation

Reminder notifications only trigger while the browser tab is open and active. Background or service worker notification support is not yet implemented. The pulsing green dot in the application header provides visual confirmation that the notification monitoring system is actively running in the current tab.

---

## User Profile Management

### Access Points

The profile section is accessible from two locations:
- The dedicated **Profile tab** in the main navigation bar.
- The **clickable avatar icon** in the application header, which switches the active view to the Profile tab.

### Profile Card

The profile card displays and allows editing of the following fields:

| Field | Type | Notes |
|---|---|---|
| Full Name | Text | Required |
| Email | Text | Required |
| Age | Number | Optional |
| Gender | Select | Optional |
| Locality / Address | Text | Optional |
| Profile Photo | Image | Optional — uploaded via ICP Blob Storage |
| Last Updated | Timestamp | Auto-set on save |

### Medical Records

| Section | Content | Editable |
|---|---|---|
| Doctor Guidance | Doctor name and prescribed treatment details | Yes — free text |
| Checkup Reports | Visit date and clinical notes | Yes — free text |
| Medication Reports | List of active reminders with dosage and time | No — auto-populated from reminder data |

### Logout

The Logout button in the Profile tab clears the current session (removes the password identity seed from `sessionStorage` and resets the `AuthContext` state), then redirects the user to the login page.

---

## Analytics and Adherence Tracking

| Feature | Description |
|---|---|
| 7-Day SVG Bar Chart | Displays daily dose completion percentage as a bar chart rendered with inline SVG for the past seven days. |
| Streak Tracker | Counts consecutive days on which all scheduled doses were marked as taken. Displays a flame animation when an active streak is present. |
| Adherence Percentage | Calculates the overall ratio of taken doses to total scheduled doses across the user's full dose log history. |
| Dose History Log | A scrollable, filterable list of all dose actions (taken or missed) with medicine name, scheduled time, and action timestamp. |
| CSV Export | Generates a comma-separated file from the dose log and triggers a browser download, suitable for sharing with a healthcare provider. |

---

## Data Storage

All persistent data is stored in the Motoko backend canister's **ICP stable memory**. This storage survives canister upgrades, is replicated across all nodes in the ICP subnet for fault tolerance, and is accessible only through the canister's own code.

No `localStorage`, `sessionStorage` (except for the temporary session identity seed), cookies, or third-party databases are used for application data.

### Data Collections

| Collection | Key | Key Fields |
|---|---|---|
| Users | IC Principal | username, passwordHash, fullName, email, age, gender, locality, profilePhotoId, lastUpdated |
| Reminders | IC Principal + Reminder ID | medicineName, dosage, frequency, scheduledTime (HH:MM), isActive, createdAt |
| Dose Log | IC Principal + Log ID | reminderId, medicineName, scheduledTime, actionTime, status (taken \| missed) |
| Medical Records | IC Principal | doctorName, prescribedTreatment, checkupDate, checkupNotes, lastUpdated |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm v8 or higher
- DFINITY Canister SDK (DFX) — [installation guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- Mops (Motoko package manager) — installed automatically via `npm install -g ic-mops`

### Install Dependencies

**Frontend**

```bash
cd src/frontend
pnpm install --prefer-offline
```

**Backend**

```bash
cd src/backend
mops install
```

### Generate Backend Bindings

This step produces the TypeScript type definitions (`backend.d.ts`) and the runtime actor wrapper (`backend.ts`) that allow the frontend to call backend methods with full type safety.

```bash
# Run from the project root
pnpm bindgen
```

This step must be re-run whenever the Motoko canister interface changes.

### Run Locally

```bash
# Start the ICP local replica
dfx start --background

# Deploy canisters to the local replica
dfx deploy

# Start the Vite development server (from src/frontend/)
cd src/frontend
pnpm dev
```

The application will be available at `http://localhost:5173` by default.

### Typecheck

```bash
# Frontend type check
cd src/frontend
pnpm typecheck

# Backend type check
cd src/backend
mops check --fix
```

### Build for Production

```bash
# Frontend production build
cd src/frontend
pnpm build
```

---

## Project Structure

```
smart-medicine-reminder/
+-- src/
|   +-- frontend/
|   |   +-- src/
|   |   |   +-- components/         # Shared UI components (Layout, Header, etc.)
|   |   |   +-- context/            # AuthContext — global authentication state
|   |   |   +-- hooks/              # Custom React hooks (useQueries, useReminderNotifications)
|   |   |   +-- pages/              # One file per application route/tab
|   |   |   +-- services/           # Medicine search service, CSV export, identity derivation
|   |   |   +-- App.tsx             # Router configuration and provider wrappers
|   |   |   +-- main.tsx            # Application entry point — AuthProvider always present here
|   |   +-- public/
|   |   |   +-- assets/
|   |   |       +-- images/         # Static image assets
|   |   +-- index.html
|   |   +-- tailwind.config.js
|   |   +-- tsconfig.json
|   |   +-- vite.config.ts
|   +-- backend/
|       +-- main.mo                 # Motoko canister entry point and public API surface
|       +-- types/                  # Shared Motoko type definitions
|       +-- mops.toml               # Motoko package manifest
+-- dfx.json                        # DFX canister and network configuration
+-- package.json                    # Root package.json (bindgen script)
+-- README.md
```

---

## Deployment

MediRemind is deployed on the Internet Computer Protocol network via the **Caffeine AI Platform**, which handles canister scaffolding, automated TypeScript binding generation, and one-click production deployment.

**GitHub Repository:** [https://github.com/dev-dipeshkumar/smart-medicine-reminder](https://github.com/dev-dipeshkumar/smart-medicine-reminder)

### Manual Deployment to ICP Mainnet

```bash
dfx deploy --network ic
```

Before deploying, ensure:
- The local replica is stopped (`dfx stop`).
- You have a cycles wallet with sufficient cycles for canister creation and initial storage.
- `pnpm bindgen` has been run after any backend interface changes.
- The frontend production build (`pnpm build`) completes without errors.

---

## Known Issues and Fixes

The following recurring bugs were identified and permanently resolved during development.

| Issue | Root Cause | Fix Applied |
|---|---|---|
| Blank white screen on app load | `AuthProvider` was missing from `main.tsx`, causing `useAuth()` to throw an unhandled error immediately on mount, crashing the entire React tree silently. | `AuthProvider` is now always the outermost wrapper in `main.tsx`. This is a protected file — modifications must be reviewed carefully to prevent regression. |
| "Failed to create reminder" on submission | `useActor` was only reading `iiIdentity` and ignoring the password-derived identity entirely. Backend calls were sent anonymously and rejected by the canister's access control. | `useActor` now uses `iiIdentity ?? passwordIdentity`, ensuring password-login users receive a correctly authenticated actor. |
| "Failed to update profile" in all three Profile sections | Same root cause as above — anonymous backend calls were rejected by the canister. | Same fix: `useActor` now always uses the available authenticated identity. |
| Daily progress section not updating after marking a dose | Backend calls for the progress update were made anonymously (same identity issue), returning empty data silently. | Resolved by the identity fix above; progress now updates immediately after a dose action. |

---

## Future Enhancements

- **Progressive Web App / Mobile** — Package the application as a PWA or native mobile application (iOS and Android) for offline access and home screen installation.
- **Service Worker Background Reminders** — Implement a service worker to fire notifications even when the browser tab is closed or the device is locked, removing the current requirement for an open tab.
- **AI-Powered Smart Scheduling** — Use machine learning to analyze a user's adherence history and automatically suggest optimal reminder times based on past behavior patterns.
- **Doctor and Pharmacy Integration** — Allow healthcare providers to push prescriptions and dosage instructions directly to a patient's MediRemind account, reducing manual data entry.
- **Smart Wearable Support** — Integrate with wearable devices (smartwatches, fitness bands) to deliver haptic and display alerts directly on the wrist.
- **Email Notification Backup** — Send a backup email notification when a scheduled dose time passes without the user marking it as taken, for users who may not have the browser open.
- **Multi-Language Support** — Localize the interface and voice alerts into regional languages to serve a broader patient population, including non-English-speaking elderly users.
- **Prescription Image Upload** — Allow users to photograph and upload a prescription document, storing it in ICP Blob Storage and associating it with the corresponding reminder record.

---

## License

This project is developed as a **B.Tech Computer Science Engineering final year project** and is intended for academic demonstration purposes.

---

*Built with [Caffeine AI](https://caffeine.ai) on the [Internet Computer Protocol](https://internetcomputer.org).*

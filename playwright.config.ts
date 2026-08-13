import { defineConfig, devices } from "@playwright/test";

// Landing smoke suite (phase v51.0-C1).
//
// Two run modes:
//
//   1. Self-contained (default) — Playwright builds + previews the site and the
//      spec mocks POST /public/leads at the network layer, so no backend is
//      needed:
//        npx playwright test
//
//   2. Against a REAL api — the api base is baked into the bundle at build
//      time, so it is handed to the webServer build here:
//        E2E_MOCK_API=0 E2E_API_BASE=http://localhost:8011/api/v1 npx playwright test
//
//      Point it at an already-running preview/dev server with E2E_BASE_URL
//      (that server must have been built with the matching VITE_API_BASE).

const PORT = Number(process.env.E2E_PORT ?? 4173);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const API_BASE = process.env.E2E_API_BASE ?? "http://localhost:8011/api/v1";
const EXTERNAL_SERVER = Boolean(process.env.E2E_BASE_URL);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  reporter: [["list"]],

  use: {
    baseURL: BASE_URL,
    viewport: { width: 1200, height: 800 },
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1200, height: 800 } },
    },
  ],

  webServer: EXTERNAL_SERVER
    ? undefined
    : {
        // `vite preview` serves the prerendered dist/, so the build has to run
        // first — that is also what bakes VITE_API_BASE into the bundle.
        command: `yarn build && yarn preview --port ${PORT} --strictPort`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: "pipe",
        env: {
          VITE_API_BASE: API_BASE,
          // No site key => the form skips the Turnstile widget and sends the
          // stub token, mirroring an api running without TURNSTILE_SECRET.
          VITE_TURNSTILE_SITE_KEY: "",
        },
      },
});

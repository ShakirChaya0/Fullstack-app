import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./src/tests/e2e",
    timeout: 15_000,
    expect: {
        timeout: 10_000,
    },
    retries: 0,
    reporter: "html",
    use: {
        baseURL: "http://localhost:5173",
        screenshot: "only-on-failure",
        video: "on-first-retry",
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],

                viewport: { width: 1280, height: 720 },
            },
        },
    ],

    webServer: {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 60_000,
    },
});

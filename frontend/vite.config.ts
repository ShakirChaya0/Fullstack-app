/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/tests/setup.ts",
        css: true,
        exclude: [
            "**/node_modules/**",
            "**/e2e/**",
            "**/*.spec.ts",
        ],
    },
});

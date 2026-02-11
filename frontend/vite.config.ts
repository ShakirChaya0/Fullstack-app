/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        globals: true, // Permite usar describe/it/expect sin importarlos
        environment: "jsdom", // Simula un navegador
        setupFiles: "./src/tests/setup.ts", // Archivo de setup global
        css: true, // Procesa imports de CSS sin romper
    },
});

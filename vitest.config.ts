import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Where your tests live
        include: ["src/**/*.test.ts"],
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        // Coverage configuration
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/types/**"],
        },
    },
})
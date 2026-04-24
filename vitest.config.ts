import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // Where your tests live
        include: ["tests/**/*.test.ts"],

        // Coverage configuration
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/types/**"],
        },
    },
})
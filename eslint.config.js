import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    // Base ESLint recommended rules
    eslint.configs.recommended,

    // TypeScript-specific rules that require type information
    ...tseslint.configs.strictTypeChecked,

    // Stylistic rules (optional, but I like them)
    ...tseslint.configs.stylisticTypeChecked,

    // Tell the TS parser where to find your tsconfig
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // Overrides for test files: loosen rules where strictness adds noise
    {
        files: ["tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },

    // Ignore compiled output
    {
        ignores: ["dist/"],
    }
);
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            sourceType: "module"
        },
        plugins: {
            import: importPlugin
        },
        rules: {
            "no-unused-vars": "error",
            "import/order": ["error", { "alphabetize": { "order": "asc" } }]
        }
    }
];

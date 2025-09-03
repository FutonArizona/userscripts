import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    { ignores: ["scripts/**/*"] },
    {
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: { ...globals.browser, ...globals.greasemonkey } },
    },
    { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
    eslintConfigPrettier,
]);

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin.configs.recommended,
    },
  },
  {
    ignores: ["node_modules", "coverage"],
  },
  {
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "eol-last": ["error", "always"],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "eqeqeq": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "curly": ["error", "all"],
      "no-trailing-spaces": ["error"],
      "array-bracket-spacing": ["error", "never"],
    },
  },
];

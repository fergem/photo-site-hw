import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintConfigPrettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "src/components/ui"],
  },
  eslint.configs.recommended,
  {
    rules: {
      "no-console": "error",
      "no-useless-rename": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "zustand",
              importNames: ["useStore"],
              message: "Please import from features/hooks/useStore.ts instead.",
            },
          ],
          patterns: [
            {
              group: ["@radix-ui/*"],
              message: "Please import from Shadcn instead.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ["*.config*", "**/App.tsx", "**/i18n.ts", "**/pages/**"],
    rules: {
      "no-restricted-exports": [
        "error",
        { restrictDefaultExports: { direct: true } },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.strictTypeChecked],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: true },
      ],
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      // "react/no-array-index-key": "error",
      "react/no-multi-comp": "error",
      "react/destructuring-assignment": ["error", "always"],
      "react/self-closing-comp": "error",
      "react/display-name": "off",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "block-like", next: "*" },
      ],
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    rules: {
      curly: ["error", "all"],
    },
  }
);

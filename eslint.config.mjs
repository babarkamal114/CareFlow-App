// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const noDeepFeatureImports = [
  "app/**/*.{ts,tsx}",
  "components/**/*.{ts,tsx}",
  "lib/**/*.{ts,tsx}",
  "server/**/*.{ts,tsx}",
  "hooks/**/*.{ts,tsx}",
  "stores/**/*.{ts,tsx}",
  "config/**/*.{ts,tsx}",
  "types/**/*.{ts,tsx}",
  "emails/**/*.{ts,tsx}",
];

const eslintConfig = defineConfig([...nextVitals, ...nextTs, {
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    "simple-import-sort/imports": "off",
    "simple-import-sort/exports": "off",
  },
}, {
  files: noDeepFeatureImports,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@/features/*/components/**",
              "@/features/*/hooks/**",
              "@/features/*/actions/**",
              "@/features/*/schemas/**",
              "@/features/*/queries/**",
            ],
            message:
              "Import from @/features/<module> (barrel) only — no deep imports from outside that feature.",
          },
        ],
      },
    ],
  },
}, globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  "scripts/**",
]), ...storybook.configs["flat/recommended"]]);

export default eslintConfig;

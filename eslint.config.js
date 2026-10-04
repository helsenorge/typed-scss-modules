import js from "@eslint/js";
import promise from "eslint-plugin-promise";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "dist/**/*",
    "**/*.snap",
    "**/*.config.js",
    "**/*.config.cjs",
  ]),
  {
    extends: [js.configs.recommended, tseslint.configs.recommended],

    plugins: {
      promise,
    },

    rules: {
      "promise/prefer-await-to-then": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [tseslint.configs.recommendedTypeCheckedOnly],

    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./examples/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);

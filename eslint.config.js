const { defineConfig, globalIgnores } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const promise = require("eslint-plugin-promise");
const jest = require("eslint-plugin-jest");
const jestFormatting = require("eslint-plugin-jest-formatting");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:jest-formatting/strict",
      "plugin:jest/recommended",
    ),

    languageOptions: {
      parser: tsParser,
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      promise,
      jest,
      "jest-formatting": jestFormatting,
    },

    rules: {
      "promise/prefer-await-to-then": "error",

      "jest/consistent-test-it": [
        "error",
        {
          fn: "it",
        },
      ],
    },
  },
  globalIgnores(["dist/**/*", "**/*.snap", "**/*.config.js"]),
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: compat.extends(
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ),

    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  },
]);

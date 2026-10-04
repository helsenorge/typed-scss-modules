const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const promise = require("eslint-plugin-promise");
const jest = require("eslint-plugin-jest");

module.exports = defineConfig([
  globalIgnores(["dist/**/*", "**/*.snap", "**/*.config.js"]),
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      jest.configs["flat/recommended"],
    ],

    plugins: {
      promise,
    },

    rules: {
      "promise/prefer-await-to-then": "error",

      "jest/consistent-test-it": [
        "error",
        {
          fn: "it",
        },
      ],

      "jest/padding-around-all": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [tseslint.configs.recommendedTypeCheckedOnly],

    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ["__tests__/helpers/**"],
    rules: {
      "jest/no-export": "off",
    },
  },
]);

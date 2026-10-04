const { defineConfig, globalIgnores } = require("eslint/config");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const promise = require("eslint-plugin-promise");

module.exports = defineConfig([
  globalIgnores(["dist/**/*", "**/*.snap", "**/*.config.js"]),
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
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
]);

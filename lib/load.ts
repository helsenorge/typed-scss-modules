import { CLIOptions, ConfigOptions } from "./core";
import { nameFormatDefault } from "./sass";
import {
  bannerTypeDefault,
  exportTypeDefault,
  exportTypeInterfaceDefault,
  exportTypeNameDefault,
  logLevelDefault,
  quoteTypeDefault,
} from "./typescript";

/**
 * Load a custom config file in the project root directory with any options for this package.
 *
 * This supports config files in the following formats and order:
 *  - Named `config` export: `export const config = {}`
 *  - Default export: `export default {}`
 *  - `module.exports = {}`
 */
export const loadConfig = (): Record<string, never> | ConfigOptions => {
  // config file support has been removed, in order to be able remove dependencies
  return {};
};

// Default values for all options that need defaults.
export const DEFAULT_OPTIONS: CLIOptions = {
  nameFormat: [nameFormatDefault],
  exportType: exportTypeDefault,
  exportTypeName: exportTypeNameDefault,
  exportTypeInterface: exportTypeInterfaceDefault,
  watch: false,
  ignoreInitial: false,
  listDifferent: false,
  ignore: [],
  quoteType: quoteTypeDefault,
  updateStaleOnly: false,
  logLevel: logLevelDefault,
  banner: bannerTypeDefault,
  outputFolder: null,
  allowArbitraryExtensions: false,
};

const removedUndefinedValues = <Obj extends Record<string, unknown>>(
  obj: Obj
): Obj => {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
};

/**
 * Given both the CLI and config file options merge into a single options object.
 *
 * When possible, CLI options will override config file options.
 *
 * Some options are only available in the config file. For example, a custom function can't
 * be easily defined via the CLI so some complex options are only available in the config file.
 */
export const mergeOptions = (
  cliOptions: Partial<CLIOptions>,
  configOptions: Partial<ConfigOptions>
): ConfigOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...configOptions,
    ...removedUndefinedValues(cliOptions),
  };
};

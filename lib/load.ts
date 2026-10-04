import type { CLIOptions, ConfigOptions } from "./core/index.js";
import { nameFormatDefault } from "./sass/index.js";
import {
  bannerTypeDefault,
  exportTypeDefault,
  exportTypeInterfaceDefault,
  exportTypeNameDefault,
  logLevelDefault,
  quoteTypeDefault,
} from "./typescript/index.js";

/**
 * Config file support has been removed; always returns an empty config.
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
  obj: Obj,
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
  configOptions: Partial<ConfigOptions>,
): ConfigOptions => {
  return {
    ...DEFAULT_OPTIONS,
    ...configOptions,
    ...removedUndefinedValues(cliOptions),
  };
};

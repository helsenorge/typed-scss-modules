import { camelCase, kebabCase, Options, snakeCase } from "change-case";
import fs from "fs";
import { getImplementation } from "../implementations";
import { Aliases, customImporters, SASSImporterOptions } from "./importer";
import { sourceToClassNames } from "./source-to-class-names";

export { Aliases };
export type ClassName = string;
interface Transformer {
  (className: ClassName): string;
}

/**
 * Word splitting compatible with change-case v4, which only treats ASCII letters
 * and digits as word characters. Keeps generated class names unchanged.
 */
const caseOptions: Options = {
  locale: false,
  split: (value: string) =>
    value
      .replace(/([a-z0-9])([A-Z])/g, "$1\0$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1\0$2")
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean),
};

const transformersMap = {
  camel: (className: ClassName) =>
    camelCase(className, { ...caseOptions, mergeAmbiguousCharacters: true }),
  dashes: (className: ClassName) =>
    /-/.test(className) ? camelCase(className, caseOptions) : className,
  kebab: (className: ClassName) => transformersMap.param(className),
  none: (className: ClassName) => className,
  param: (className: ClassName) => kebabCase(className, caseOptions),
  snake: (className: ClassName) => snakeCase(className, caseOptions),
} as const;

type NameFormatWithTransformer = keyof typeof transformersMap;
const NAME_FORMATS_WITH_TRANSFORMER = Object.keys(
  transformersMap,
) as NameFormatWithTransformer[];

export const NAME_FORMATS = [...NAME_FORMATS_WITH_TRANSFORMER, "all"] as const;
export type NameFormat = (typeof NAME_FORMATS)[number];

export interface SASSOptions extends SASSImporterOptions {
  additionalData?: string;
  includePaths?: string[];
  nameFormat?: string | string[];
}
export const nameFormatDefault: NameFormatWithTransformer = "camel";

export const fileToClassNames = async (
  file: string,
  {
    additionalData,
    includePaths = [],
    nameFormat: rawNameFormat,
    aliases,
    aliasPrefixes,
    importer,
  }: SASSOptions = {},
) => {
  const { renderSync } = getImplementation();

  const nameFormat = (
    typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat
  ) as NameFormat[];

  const nameFormats: NameFormatWithTransformer[] = nameFormat
    ? nameFormat.includes("all")
      ? NAME_FORMATS_WITH_TRANSFORMER
      : (nameFormat as NameFormatWithTransformer[])
    : [nameFormatDefault];

  const data = fs.readFileSync(file).toString();
  const result = renderSync({
    file,
    data: additionalData ? `${additionalData}\n${data}` : data,
    includePaths,
    importer: customImporters({ aliases, aliasPrefixes, importer }),
  });

  const classNames = await sourceToClassNames(result.css, file);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassName>([]);
  classNames.forEach((className: ClassName) => {
    transformers.forEach((transformer: Transformer) => {
      transformedClassNames.add(transformer(className));
    });
  });

  return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
};

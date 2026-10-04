import { join } from "path";
import prettier from "prettier";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canResolvePrettier,
  loadPrettier,
} from "../../lib/prettier/can-resolve.js";
import { attemptPrettier } from "../../lib/prettier/index.js";
import { classNamesToTypeDefinitions } from "../../lib/typescript/index.js";

vi.mock("../../lib/prettier/can-resolve.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../lib/prettier/can-resolve.js")>();

  return {
    canResolvePrettier: vi.fn(actual.canResolvePrettier),
    loadPrettier: vi.fn(actual.loadPrettier),
  };
});

const file = join(import.meta.dirname, "test.d.ts");
const input =
  "export type Styles = {'myClass': string;'yourClass': string;}; export type Classes = keyof Styles; declare const styles: Styles; export default styles;";

afterEach(() => {
  vi.mocked(canResolvePrettier).mockRestore();
  vi.mocked(loadPrettier).mockRestore();
});

describe("attemptPrettier", () => {
  it("should locate and apply prettier.format", async () => {
    const output = await attemptPrettier(file, input);

    expect(await prettier.format(input, { parser: "typescript" })).toMatch(
      output,
    );
  });

  it("should match snapshot", async () => {
    const typeDefinition = await classNamesToTypeDefinitions({
      banner: "",
      classNames: ["nestedAnother", "nestedClass", "someStyles"],
      file,
      exportType: "default",
    });

    if (!typeDefinition) {
      throw new Error("failed to collect typeDefinition");
    }

    const output = await attemptPrettier(file, typeDefinition);

    expect(output).toMatchSnapshot();
  });
});

describe("attemptPrettier - mock prettier", () => {
  it("should fail to recognize prettier and return input", async () => {
    vi.mocked(loadPrettier).mockResolvedValue({ format: undefined });

    const output = await attemptPrettier(file, input);

    expect(output).toBe(input);
    expect(loadPrettier).toHaveBeenCalled();
  });
});

describe("attemptPrettier - mock resolution check", () => {
  it("should fail to resolve prettier and return input", async () => {
    vi.mocked(canResolvePrettier).mockReturnValue(false);

    const output = await attemptPrettier(file, input);

    expect(output).toBe(input);
    expect(loadPrettier).not.toHaveBeenCalled();
  });
});

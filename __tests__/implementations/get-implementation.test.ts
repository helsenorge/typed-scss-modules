import { createRequire } from "module";
import { describe, expect, it } from "vitest";
import { getImplementation } from "../../lib/implementations";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    // lib loads sass via require (CJS build), so compare against the same module.
    const sass: unknown = createRequire(__filename)("sass");

    expect(getImplementation()).toBe(sass);
  });
});

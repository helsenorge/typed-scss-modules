import * as sass from "sass";
import { describe, expect, it } from "vitest";
import { getImplementation } from "../../lib/implementations/index.js";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation()).toBe(sass);
  });
});

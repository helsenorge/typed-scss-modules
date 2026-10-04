import { describe, expect, it } from "vitest";
import { getDefaultImplementation } from "../../lib/implementations/index.js";

describe("getDefaultImplementation", () => {
  it("returns sass", () => {
    expect(getDefaultImplementation()).toBe("sass");
  });
});

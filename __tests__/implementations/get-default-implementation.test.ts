import { getDefaultImplementation } from "../../lib/implementations";

describe("getDefaultImplementation", () => {
  it("returns sass", () => {
    expect(getDefaultImplementation()).toBe("sass");
  });
});

import sass from "sass";
import { getImplementation } from "../../lib/implementations";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation()).toEqual(sass);
  });
});

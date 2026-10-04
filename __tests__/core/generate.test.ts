import fs from "fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generate } from "../../lib/core";
import { describeAllImplementations } from "../helpers";

describeAllImplementations(() => {
  describe("generate", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = vi.fn();
      console.log = vi.fn(); // avoid console logs showing up
    });

    it("generates types for all files matching the pattern", async () => {
      const pattern = `${__dirname}/../dummy-styles/**/*.scss`;

      await generate(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: false,
        ignore: [],

        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
        outputFolder: null,
        allowArbitraryExtensions: false,
      });

      expect(fs.writeFileSync).toHaveBeenCalledTimes(6);
    });
  });
});

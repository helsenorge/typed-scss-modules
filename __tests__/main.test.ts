import fs from "fs";
import path from "path";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { alerts } from "../lib/core";
import { main } from "../lib/main";
import { slash } from "../lib/slash";
import { describeAllImplementations } from "./helpers";

describeAllImplementations(() => {
  describe("main", () => {
    let writeFileSyncSpy: MockInstance<typeof fs.writeFileSync>;

    beforeEach(() => {
      // Only mock the writes, so the example files can still be read.
      writeFileSyncSpy = vi
        .spyOn(fs, "writeFileSync")
        .mockImplementation(() => {});

      // Avoid creating directories while running tests.
      vi.spyOn(fs, "mkdirSync").mockImplementation(() => {});

      // Avoid console logs showing up.
      vi.spyOn(console, "log").mockImplementation(() => {});

      vi.spyOn(alerts, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      writeFileSyncSpy.mockReset();
    });

    it("generates types for all .scss files when the pattern is a directory", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      await main(pattern, {
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
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(9);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export declare const nestedAnother: string;\nexport declare const nestedClass: string;\nexport declare const number1: string;\nexport declare const someStyles: string;\nexport declare const whereSelector: string;\n",
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${expectedDirname}/style.scss.d.ts`,
        "export declare const someClass: string;\n",
      );
    });

    it("generates types for all .scss files and ignores files that match the ignore pattern", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      await main(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: false,
        ignore: ["**/style.scss"],
        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(7);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export declare const nestedAnother: string;\nexport declare const nestedClass: string;\nexport declare const number1: string;\nexport declare const someStyles: string;\nexport declare const whereSelector: string;\n",
      );

      // Files that should match the ignore pattern.
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(
        `${expectedDirname}/style.scss.d.ts`,
        expect.anything(),
      );
      expect(fs.writeFileSync).not.toHaveBeenCalledWith(
        `${expectedDirname}/nested-styles/style.scss.d.ts`,
        expect.anything(),
      );
    });

    it("reads options from the configuration file", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      vi.spyOn(process, "cwd").mockReturnValue(path.resolve(pattern));

      await main(pattern, {
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
        exportType: "default",
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(9);

      // Transform the calls into a more readable format for the snapshot.
      const contents = writeFileSyncSpy.mock.calls
        .map(([fullFilePath, contents]) => ({
          path: path.relative(__dirname, fullFilePath as string),
          contents,
        }))
        // Sort to avoid flakey snapshot tests if call order changes.
        .sort((a, b) => a.path.localeCompare(b.path));

      expect(contents).toMatchSnapshot();
    });

    it("outputs the correct files when outputFolder is passed", async () => {
      const pattern = path.resolve(__dirname, "dummy-styles");

      await main(pattern, {
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
        outputFolder: "__generated__",
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalledTimes(9);
      expect(fs.mkdirSync).toHaveBeenCalledTimes(9);

      // Transform the calls into a more readable format for the snapshot.
      const contents = writeFileSyncSpy.mock.calls
        .map(([fullFilePath, contents]) => ({
          path: path.relative(__dirname, fullFilePath as string),
          contents,
        }))
        // Sort to avoid flakey snapshot tests if call order changes.
        .sort((a, b) => a.path.localeCompare(b.path));

      expect(contents).toMatchSnapshot();
    });
  });
});

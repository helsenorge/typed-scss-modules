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
import { alerts } from "../../lib/core/alerts";
import { removeSCSSTypeDefinitionFile } from "../../lib/core/remove-file";
import { DEFAULT_OPTIONS } from "../../lib/load";

describe("removeFile", () => {
  const originalTestFile = path.resolve(__dirname, "..", "removable.scss");
  const existingFile = path.resolve(__dirname, "..", "style.scss");
  const existingTypes = path.join(
    process.cwd(),
    "__tests__/removable.scss.d.ts",
  );
  const outputFolderExistingTypes = path.resolve(
    process.cwd(),
    "__generated__/__tests__/removable.scss.d.ts",
  );

  let existsSpy: MockInstance<typeof fs.existsSync>;
  let unlinkSpy: MockInstance;
  let alertsSpy: MockInstance;

  beforeEach(() => {
    existsSpy = vi
      .spyOn(fs, "existsSync")
      .mockImplementation(
        (path) =>
          path === existingTypes ||
          path === existingFile ||
          path === outputFolderExistingTypes,
      );

    unlinkSpy = vi.spyOn(fs, "unlinkSync").mockImplementation(() => {});

    alertsSpy = vi.spyOn(alerts, "success").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing if types file doesn't exist", () => {
    const nonExistingFile = path.resolve(__dirname, "..", "deleted.scss");
    const nonExistingTypes = path.join(
      process.cwd(),
      "__tests__/deleted.scss.d.ts",
    );

    removeSCSSTypeDefinitionFile(nonExistingFile, DEFAULT_OPTIONS);

    expect(existsSpy).toHaveBeenCalledWith(
      expect.stringMatching(nonExistingFile),
    );
    expect(existsSpy).toHaveBeenCalledWith(
      expect.stringMatching(nonExistingTypes),
    );
    expect(unlinkSpy).not.toHaveBeenCalled();
    expect(alertsSpy).not.toHaveBeenCalled();
  });

  it("removes *.scss.d.ts types file for *.scss", () => {
    removeSCSSTypeDefinitionFile(originalTestFile, DEFAULT_OPTIONS);

    expect(existsSpy).toHaveBeenCalledWith(
      expect.stringMatching(existingTypes),
    );
    expect(unlinkSpy).toHaveBeenCalled();
    expect(unlinkSpy).toHaveBeenCalledWith(
      expect.stringMatching(existingTypes),
    );
    expect(alertsSpy).toHaveBeenCalled();
  });

  describe("when outputFolder is passed", () => {
    it("removes the correct files", () => {
      removeSCSSTypeDefinitionFile(originalTestFile, {
        ...DEFAULT_OPTIONS,
        outputFolder: "__generated__",
      });

      expect(existsSpy).toHaveBeenCalledWith(
        expect.stringMatching(outputFolderExistingTypes),
      );
      expect(unlinkSpy).toHaveBeenCalled();
      expect(unlinkSpy).toHaveBeenCalledWith(
        expect.stringMatching(outputFolderExistingTypes),
      );
      expect(alertsSpy).toHaveBeenCalled();
    });
  });
});

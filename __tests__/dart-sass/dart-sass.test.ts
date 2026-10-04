import fs from "fs";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { alerts } from "../../lib/core";
import { main } from "../../lib/main";
import { slash } from "../../lib/slash";

describe("dart-sass", () => {
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

  it("@use support", async () => {
    const pattern = `${__dirname}`;

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
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    const expectedDirname = slash(__dirname);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${expectedDirname}/use.scss.d.ts`,
      "export declare const foo: string;\n",
    );
  });
});

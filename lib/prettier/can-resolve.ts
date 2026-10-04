// Extracted to a separate module so it can be mocked in tests,
// as require.resolve and runtime require calls can't be mocked directly.
export function canResolvePrettier() {
  try {
    require.resolve("prettier");
    return true;
  } catch {
    // cannot resolve prettier
    return false;
  }
}

export function loadPrettier(): unknown {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("prettier");
}

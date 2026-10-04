// Extracted to a separate module so it can be mocked in tests,
// as import.meta.resolve and dynamic imports can't be mocked directly.
export function canResolvePrettier() {
  try {
    import.meta.resolve("prettier");
    return true;
  } catch {
    // cannot resolve prettier
    return false;
  }
}

export async function loadPrettier(): Promise<unknown> {
  const prettier: { default?: unknown } = await import("prettier");
  return prettier.default ?? prettier;
}

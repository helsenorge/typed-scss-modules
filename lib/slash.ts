/**
 * Convert Windows backslash paths to forward slash paths (same behavior as the `slash` package).
 * Extended-length paths and paths with non-ASCII characters are returned unchanged.
 */
export const slash = (path: string): string => {
  const isExtendedLengthPath = path.startsWith("\\\\?\\");
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path);

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, "/");
};

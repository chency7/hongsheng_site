export function displayFilePath(value: string) {
  try {
    const url = new URL(value);
    return decodeURIComponent(`${url.pathname}${url.search}${url.hash}`);
  } catch {
    return value.replace(/^https?:\/\/[^/]+/i, '');
  }
}

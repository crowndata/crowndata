export function getInitialsFromString(str: string): string {
  // Remove URL structure (if it's a URL)
  const cleanedStr = str.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Split by `/` and other common delimiters like dashes, underscores, or spaces
  const parts = cleanedStr.split(/[-_/ ]+/);

  // Take the first letter of the first and last word (or at least the first two parts)
  const firstInitial = parts[0]?.charAt(0) ?? "";
  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";

  // Return initials in uppercase
  return (firstInitial + lastInitial).toUpperCase();
}

export function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function hashToColor(hash: number): string {
  // Generate a hex color based on the hash
  const color = (hash & 0x00ffffff).toString(16).padStart(6, "0").toUpperCase();
  return `#${color}`; // Ensure it's always 6 digits
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

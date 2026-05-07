import LZString from 'lz-string';

export interface PasteData {
  code: string;
  language: string;
}

export function encodePaste(data: PasteData): string {
  const jsonString = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodePaste(encoded: string): PasteData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch (error) {
    console.error("Failed to decode paste:", error);
    return null;
  }
}
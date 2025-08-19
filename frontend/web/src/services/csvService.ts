// frontend/web/src/services/csvService.ts
export type CsvRow = Record<string, string | number | undefined>;

/**
 * parseCsvText
 * - header row required
 * - returns array of objects keyed by lowercase header names
 */
export function parseCsvText(text: string): CsvRow[] {
  if (!text) return [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    if (cols.length === 0 || (cols.length === 1 && cols[0] === "")) continue;
    const obj: CsvRow = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cols[j] ?? "";
    }
    rows.push(obj);
  }
  return rows;
}

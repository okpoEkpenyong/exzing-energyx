import { describe, it, expect } from "vitest";
import { parseCsvText } from "../csvService";

describe("parseCsvText", () => {
  it("parses a small csv with header", () => {
    const text = "device_id,fuel_type,fuel_amount\nvessel-1,diesel,1200\nvessel-2,petrol,800";
    const rows = parseCsvText(text);
    expect(rows.length).toBe(2);
    expect(rows[0].device_id).toBe("vessel-1");
    expect(rows[1].fuel_type).toBe("petrol");
  });

  it("returns empty array for empty input", () => {
    expect(parseCsvText("")).toEqual([]);
  });

  it("ignores blank lines and trims headers", () => {
    const text = " device_id , fuel_type \n v1 , diesel \n\n v2, petrol ";
    const rows = parseCsvText(text);
    expect(rows.length).toBe(2);
    expect((rows[0] as any).device_id).toBe("v1");
  });
});

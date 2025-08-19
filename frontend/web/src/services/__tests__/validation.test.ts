import { describe, it, expect } from "vitest";
import { validateVoyage } from "../validationService";

describe("validateVoyage", () => {
  it("accepts valid payload", () => {
    const { valid, errors } = validateVoyage({ device_id: "v1", fuel_type: "diesel", fuel_amount: 120 });
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });

  it("rejects missing fields and invalid fuel", () => {
    const { valid, errors } = validateVoyage({ device_id: "", fuel_type: "bad", fuel_amount: 0 });
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });

  it("rejects invalid date", () => {
    const { valid, errors } = validateVoyage({ device_id: "v1", fuel_type: "diesel", fuel_amount: 10, date: "not-a-date" });
    expect(valid).toBe(false);
    expect(errors).toContain("date is invalid");
  });
});

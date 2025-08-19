// frontend/web/src/services/validation.ts
export type VoyagePayload = {
    device_id?: string;
    fuel_type?: string;
    fuel_amount?: number;
    distance_nm?: number;
    date?: string;
  };
  
  const VALID_FUEL = ["diesel", "petrol", "lng", "cng", "electric", "hybrid"];
  
  /**
   * validateVoyage
   * returns { valid, errors[] }
   */
  export function validateVoyage(payload: VoyagePayload) {
    const errors: string[] = [];
  
    if (!payload.device_id) errors.push("device_id is required");
    if (payload.fuel_amount == null || isNaN(Number(payload.fuel_amount)) || Number(payload.fuel_amount) <= 0) {
      errors.push("fuel_amount must be a positive number");
    }
    if (!payload.fuel_type) errors.push("fuel_type is required");
    else if (!VALID_FUEL.includes(String(payload.fuel_type).toLowerCase())) {
      errors.push(`fuel_type must be one of: ${VALID_FUEL.join(", ")}`);
    }
    if (payload.distance_nm != null && Number(payload.distance_nm) < 0) {
      errors.push("distance_nm cannot be negative");
    }
    // basic date check
    if (payload.date) {
      const d = new Date(payload.date);
      if (isNaN(d.getTime())) errors.push("date is invalid");
    }
  
    return { valid: errors.length === 0, errors };
  }
  
// frontend/web/src/services/api.ts
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";
// const API_BASE = process.env.VITE_API_BASE_URL;
// (import.meta.env.VITE_API_BASE_URL as string

export type Emission = {
  id?: number;
  device_id: string;
  fuel_type: string;
  fuel_amount: number;
  co2_emitted?: number;
  timestamp?: string;
  notes?: string;
};

export async function createEmission(payload: Partial<Emission>) {
  const res = await fetch(`${API_BASE}/emissions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create emission");
  return res.json();
}

export async function listEmissions(page = 1, per_page = 50, fuel_type?: string) {
  const params = new URLSearchParams({ page: String(page), per_page: String(per_page) });
  if (fuel_type) params.set("fuel_type", fuel_type);
  const res = await fetch(`${API_BASE}/emissions/?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to list emissions");
  return res.json(); // { total, page, per_page, items: Emission[] }
}

export async function generateCredit(emissionId: number) {
  const res = await fetch(`${API_BASE}/credits/${emissionId}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to generate credit");
  return res.json();
}

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE}/metrics/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return res.json();
}

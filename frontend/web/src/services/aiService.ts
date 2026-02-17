// import API_BASE_URL from "../config";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://exzing-energyx.onrender.com";

export interface Scope3Record {
  category: string;
  transport_mode: string;
  quantity: number;
  distance_km: number;
  unit_weight_kg: number;
  spend: number;
}

export const predictScope3 = async (records: Scope3Record[]) => {
  const res = await fetch(`${API_BASE_URL}/predict/scope3`, {
    // method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ records }),
  });

  if (!res.ok) throw new Error("Scope3 prediction failed");
  print(res.message)
  return res.json();
};

export const detectAnomaly = async (records: any[]) => {
  const res = await fetch(`${API_BASE_URL}/predict/anomaly`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records }),
  });

  if (!res.ok) throw new Error("Anomaly detection failed");
  return res.json();
};

export const generateRecommendations = async (supplier_summary: any[]) => {
  const res = await fetch(`${API_BASE_URL}/predict/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ supplier_summary }),
  });

  if (!res.ok) throw new Error("Recommendation request failed");
  return res.json();
};

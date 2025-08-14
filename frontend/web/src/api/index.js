const API_BASE = "http://localhost:5000";

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Failed to fetch health status");
  return res.json();
}

export async function getEmissions() {
  const res = await fetch(`${API_BASE}/emissions/`);
  if (!res.ok) throw new Error("Failed to fetch emissions");
  return res.json();
}

export async function logEmission(data) {
  const res = await fetch(`${API_BASE}/emissions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to log emission");
  return res.json();
}

export async function generateCredit(emissionId) {
  const res = await fetch(`${API_BASE}/credits/${emissionId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to generate credit");
  return res.json();
}

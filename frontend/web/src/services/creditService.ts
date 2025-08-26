const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";

export async function getCreditDetail(id: number) {
  const res = await fetch(`${API_BASE}/registry/credits/${id}`);
  if (!res.ok) throw new Error("Failed to fetch credit");
  return res.json();
}

export async function listCredits(page = 1, per_page = 50) {
  const res = await fetch(`${API_BASE}/registry/credits?page=${page}&per_page=${per_page}`);
  if (!res.ok) throw new Error("Failed to fetch credits");
  return res.json();
}

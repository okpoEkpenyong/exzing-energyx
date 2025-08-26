// const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "https://exzing-energyx.onrender.com";

export async function submitAudit(payload: any) {
  const res = await fetch(`${API_BASE}/audits/submit`, {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Audit submit failed');
  return res.json();
}

export async function uploadAuditEvidence(auditId: number, file: File) {
  const fd = new FormData(); fd.append('file', file);
  const res = await fetch(`${API_BASE}/audits/upload_evidence/${auditId}`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function listPendingAudits() {
  const res = await fetch(`${API_BASE}/audits/pending`);
  if (!res.ok) throw new Error('Failed to list pending audits');
  return res.json();
}

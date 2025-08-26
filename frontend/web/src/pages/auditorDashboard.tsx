import React, { useEffect, useState } from "react";
import { Stack, Text, PrimaryButton, DefaultButton, TextField } from "@fluentui/react";
import { listPendingAudits, submitAudit } from "../services/auditService";

const AuditorDashboard: React.FC = () => {
  const [pending, setPending] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await listPendingAudits();
        setPending(list);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const onSubmit = async (verdict: string) => {
    if (!selected) return alert("Select an audit");
    const p = pending.find(p => p.id === selected);
    try {
      await submitAudit({ project_id: p.project_id, credit_id: p.credit_id, auditor: "auditor-demo", verdict, notes });
      alert("submitted");
    } catch (e) { console.error(e); alert("submit failed"); }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="xLarge">Auditor Dashboard</Text>
      <Stack tokens={{ childrenGap: 8 }}>
        {pending.map(p => (
          <div key={p.id} style={{ padding: 8, border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>
            <Text>Audit #{p.id} — project: {p.project_id} credit: {p.credit_id}</Text>
            <PrimaryButton text="Select" onClick={() => setSelected(p.id)} />
          </div>
        ))}
      </Stack>

      <TextField label="Notes" value={notes} onChange={(_, v) => setNotes(v ?? "")} />
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Pass" onClick={() => onSubmit("pass")} />
        <DefaultButton text="Minor issues" onClick={() => onSubmit("minor_issues")} />
        <DefaultButton text="Fail" onClick={() => onSubmit("fail")} />
      </Stack>
    </Stack>
  );
};

export default AuditorDashboard;

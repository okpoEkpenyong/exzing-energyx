import React, { useState } from "react";
import { Stack, TextField, PrimaryButton, Text } from "@fluentui/react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";

const SatelliteStub: React.FC = () => {
  const [projectId, setProjectId] = useState("1");
  const [result, setResult] = useState<any | null>(null);

  const run = async () => {
    try {
      const res = await fetch(`${API_BASE}/satellite/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: Number(projectId) }),
      });
      const j = await res.json();
      setResult(j);
    } catch (e) {
      console.error(e);
      alert("Satellite call failed");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="xLarge">Satellite Stub</Text>
      <TextField label="Project id" value={projectId} onChange={(_, v) => setProjectId(v ?? "1")} />
      <PrimaryButton text="Run check" onClick={run} />
      {result && (
        <div>
          <Text>NDVI mean: {result.ndvi_mean}</Text>
          <Text>Tree delta: {result.tree_cover_delta}</Text>
          <Text>Pass: {result.pass ? "Yes" : "No"}</Text>
          <Text>{result.note}</Text>
        </div>
      )}
    </Stack>
  );
};

export default SatelliteStub;

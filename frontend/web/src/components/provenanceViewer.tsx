import React from "react";
import { Stack, DefaultButton, Text } from "@fluentui/react";

const ProvenanceViewer: React.FC<{ evidence: any[] }> = ({ evidence }) => {
  if (!evidence || evidence.length === 0) return <Text>No evidence available.</Text>;
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {evidence.map(e => (
        <div key={e.id} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: 8, borderRadius: 6 }}>
          <Text variant="small">Bundle #{e.id}</Text>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {(e.manifest?.files ?? []).map((f: any, i: number) => (
              <div key={i}>
                <a href={f.url} target="_blank" rel="noreferrer">
                  <DefaultButton text={f.name} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Stack>
  );
};

export default ProvenanceViewer;

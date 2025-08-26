import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Text, Separator, ProgressIndicator } from "@fluentui/react";
import { getCreditDetail } from "../services/creditService.ts";
import ProvenanceViewer from "../components/provenanceViewer.tsx";

const CreditDetail: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await getCreditDetail(Number(id));
        setData(d);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!data) return <Text>Loading...</Text>;

  const score = data.rating?.overall ?? 0;
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Stack horizontal horizontalAlign="space-between">
        <Text variant="xxLarge">Credit #{data.id}</Text>
        <Text>{data.issued_at}</Text>
      </Stack>

      <Text>Total Credits: {data.credits_awarded}</Text>
      <Separator />

      <Text variant="large">Rating</Text>
      <ProgressIndicator percentComplete={score / 100} label={`Overall score: ${score}`} />

      {data.rating?.components && (
        <Stack tokens={{ childrenGap: 6 }}>
          {Object.entries(data.rating.components).map(([k, v]) => (
            <Text key={k}>{k}: {String(v)}</Text>
          ))}
        </Stack>
      )}

      <Separator />
      <Text variant="large">Audits</Text>
      {data.audits?.length ? data.audits.map((a: any) => (
        <Stack key={a.id}>
          <Text>{a.verdict} — {a.created_at}</Text>
          <Text>{a.notes}</Text>
        </Stack>
      )) : <Text>No audits yet</Text>}

      <Separator />
      <ProvenanceViewer evidence={data.evidence ?? []} />
    </Stack>
  );
};

export default CreditDetail;

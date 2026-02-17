import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Stack, Text, Separator, ProgressIndicator } from "@fluentui/react";
import { getCreditDetail, listCredits } from "../services/creditService.ts";
import ProvenanceViewer from "../components/provenanceViewer.tsx";

type Credit = {
  id: number;
  emission_log_id: number;
  credits_awarded: number;
  issued_at: string;
  emission: {
    device_id: string;
    fuel_type: string;
    fuel_amount: number;
    co2_emitted: number;
  };
};



const CreditDetail: React.FC = () => {
  const { id } = useParams();
  // const [data, setData] = useState<any | null>(null);
  const [data, setData] = useState<Credit[]>([]);
  useEffect(() => {
    // if (!id) return;
    (async () => {
      try {
        // const d = await getCreditDetail(Number(id));
        const d = await listCredits(1, 10);
        console.log("credit details:", d)
        setData(d);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // if (!data) return <Text>Loading...</Text>;

  // return (
  //   <Stack tokens={{ childrenGap: 12 }}>
  //     <Stack horizontal horizontalAlign="space-between">
  //       <Text variant="xxLarge">Credit #{data?.emission_log_id}</Text>
  //       <Text>{data.issued_at}</Text>
  //     </Stack>

  //     <Text>Total Credits: {data.credits_awarded}</Text>
  //     <Separator />

  //     <Text variant="large">Rating</Text>
  //     <ProgressIndicator percentComplete={score / 100} label={`Overall score: ${score}`} />

  //     {data.rating?.components && (
  //       <Stack tokens={{ childrenGap: 6 }}>
  //         {Object.entries(data.rating.components).map(([k, v]) => (
  //           <Text key={k}>{k}: {String(v)}</Text>
  //         ))}
  //       </Stack>
  //     )}

  //     <Separator />
  //     <Text variant="large">Audits</Text>
  //     {data.audits?.length ? data.audits.map((a: any) => (
  //       <Stack key={a.id}>
  //         <Text>{a.verdict} — {a.created_at}</Text>
  //         <Text>{a.notes}</Text>
  //       </Stack>
  //     )) : <Text>No audits yet</Text>}

  //     <Separator />
  //     <ProvenanceViewer evidence={data.evidence ?? []} />
  //   </Stack>
  // );


if (!data || data.length === 0) return <Text>No credits found</Text>;

return (
  <Stack tokens={{ childrenGap: 20 }}>
    {data.map((credit: any) => {
      const score = credit.rating?.overall ?? 0;

      return (
        <Stack key={credit.id} tokens={{ childrenGap: 10 }} style={{ padding: 16, border: "1px solid #eee", borderRadius: 8 }}>
          <Stack horizontal horizontalAlign="space-between">
            <Text variant="large">Credit #{credit.emission_log_id}</Text>
            <Text>{credit.issued_at}</Text>
          </Stack>

          <Text>Total Credits: {credit.credits_awarded.toFixed(2)}</Text>

          <Text>
            {credit.emission?.device_id} — {credit.emission?.fuel_type}
          </Text>

          <ProgressIndicator
            percentComplete={score / 100}
            label={`Score: ${score}`}
          />
        </Stack>
      );
    })}
  </Stack>
);


};

export default CreditDetail;

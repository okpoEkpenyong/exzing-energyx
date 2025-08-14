// frontend/web/src/components/EmissionsList.tsx
import React, { useEffect, useState } from "react";
import { DetailsList, PrimaryButton, Stack, Text } from "@fluentui/react";
import { listEmissions, generateCredit } from "../services/api";

const EmissionsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);

  const load = async () => {
    try {
      const res = await listEmissions(page, 20);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [page]);

  const onGenerate = async (id: number) => {
    try {
      const credit = await generateCredit(id);
      alert(`Generated credit: ${credit.credits_awarded}`);
      // refresh list
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to generate credit");
    }
  };

  const items = data?.items ?? [];

  const columns = [
    { key: "c1", name: "Device", fieldName: "device_id", minWidth: 80 },
    { key: "c2", name: "Fuel", fieldName: "fuel_type", minWidth: 80 },
    { key: "c3", name: "Fuel Amount", fieldName: "fuel_amount", minWidth: 80 },
    { key: "c4", name: "CO₂ (kg)", fieldName: "co2_emitted", minWidth: 80 },
    { key: "c5", name: "Timestamp", fieldName: "timestamp", minWidth: 140 },
    { key: "c6", name: "Actions", fieldName: "id", minWidth: 120,
      onRender: (item: any) => (<PrimaryButton onClick={() => onGenerate(item.id)}>Generate Credit</PrimaryButton>)}
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="large">Emissions</Text>
      <DetailsList items={items} columns={columns} />
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Prev" onClick={() => setPage(p => Math.max(1, p - 1))} />
        <PrimaryButton text="Next" onClick={() => setPage(p => p + 1)} />
      </Stack>
    </Stack>
  );
};

export default EmissionsList;

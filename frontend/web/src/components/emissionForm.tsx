// frontend/web/src/components/EmissionForm.tsx
import React, { useState } from "react";
import { TextField, PrimaryButton, Dropdown, IDropdownOption, Stack } from "@fluentui/react";
import { createEmission } from "../services/api";

const fuelOptions: IDropdownOption[] = [
  { key: "diesel", text: "diesel" },
  { key: "petrol", text: "petrol" },
  { key: "lng", text: "lng" },
  { key: "cng", text: "cng" },
  { key: "electric", text: "electric" },
  { key: "hybrid", text: "hybrid" },
];

type Props = { onCreated?: (e: any) => void };

const EmissionForm: React.FC<Props> = ({ onCreated }) => {
  const [deviceId, setDeviceId] = useState("");
  const [fuelType, setFuelType] = useState<string>("diesel");
  const [fuelAmount, setFuelAmount] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const submit = async () => {
    if (!deviceId || !fuelAmount) {
      alert("Please provide device id and fuel amount");
      return;
    }
    try {
      const payload = {
        device_id: deviceId,
        fuel_type: fuelType,
        fuel_amount: Number(fuelAmount),
        notes: notes || undefined,
      };
      const created = await createEmission(payload);
      setDeviceId("");
      setFuelAmount(undefined);
      setNotes("");
      if (onCreated) onCreated(created);
    } catch (err) {
      console.error(err);
      alert("Failed to create emission");
    }
  };

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <TextField label="Device ID" value={deviceId} onChange={(_, v) => setDeviceId(v || "")} />
      <Dropdown
        label="Fuel Type"
        selectedKey={fuelType}
        options={fuelOptions}
        onChange={(_, opt) => setFuelType(String(opt?.key))}
      />
      <TextField label="Fuel Amount" type="number" value={fuelAmount?.toString() ?? ""} onChange={(_, v) => setFuelAmount(v ? Number(v) : undefined)} />
      <TextField label="Notes (optional)" value={notes} onChange={(_, v) => setNotes(v || "")} />
      <PrimaryButton text="Log Emission" onClick={submit} />
    </Stack>
  );
};

export default EmissionForm;

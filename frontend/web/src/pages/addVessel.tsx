// frontend/web/src/pages/addVessel.tsx
import React, { useState } from "react";
import { Stack, Text, TextField, Dropdown, PrimaryButton, DefaultButton, Separator, MessageBar, MessageBarType } from "@fluentui/react";
import { authHeaders } from "../services/authService";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";
const FUEL_OPTIONS = ["HFO", "MDO", "LNG", "Biofuel", "Diesel", "Electric"];

const AddVessel: React.FC = () => {
  const [name, setName] = useState("");
  const [imo, setImo] = useState("");
  const [fuelType, setFuelType] = useState<string | undefined>("HFO");
  const [dwt, setDwt] = useState<number | undefined>(undefined);
  const [engineKw, setEngineKw] = useState<number | undefined>(undefined);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setMsg(null);
    if (!name) { setMsg("Vessel name required"); return; }
    setLoading(true);
    try {
      const payload = { name, imo, fuel_type: fuelType, dwt, engine_kw: engineKw };
      const res = await fetch(`${API_BASE}/vessels`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // read response and use it (avoid unused variable)
        const created = await res.json();
        setMsg(`Vessel saved successfully (id=${created?.id ?? "unknown"})`);
      } else {
        // fallback: store locally if backend not implemented
        console.warn("vessels endpoint returned", res.status);
        const local = JSON.parse(localStorage.getItem("energyx:vessels") || "[]");
        local.push({ id: `local-${Date.now()}`, name, imo, fuel_type: fuelType, dwt, engine_kw: engineKw });
        localStorage.setItem("energyx:vessels", JSON.stringify(local));
        setMsg("Vessel saved locally (backend not available)");
      }
    } catch (err) {
      console.error(err);
      // fallback store locally
      const local = JSON.parse(localStorage.getItem("energyx:vessels") || "[]");
      local.push({ id: `local-${Date.now()}`, name, imo, fuel_type: fuelType, dwt, engine_kw: engineKw });
      localStorage.setItem("energyx:vessels", JSON.stringify(local));
      setMsg("Error saving vessel (saved locally).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 20, maxWidth: 720, margin: "0 auto" } }}>
      <Text variant="xxLarge">Add Vessel</Text>
      <Separator />
      {msg && <MessageBar messageBarType={MessageBarType.info}>{msg}</MessageBar>}

      <TextField label="Vessel Name" value={name} onChange={(_, v) => setName(v ?? "")} />
      <TextField label="IMO Number" value={imo} onChange={(_, v) => setImo(v ?? "")} />

      <Dropdown
        label="Fuel Type"
        selectedKey={fuelType}
        options={FUEL_OPTIONS.map(f => ({ key: f, text: f }))}
        onChange={(_, o) => setFuelType(String(o?.key))}
      />

      {/* TextField expects a string value. Convert number -> string for value, and string -> number for onChange */}
      <TextField
        label="DWT (tons)"
        value={dwt !== undefined ? String(dwt) : ""}
        onChange={(_, v) => {
          const clean = (v ?? "").toString().trim();
          setDwt(clean === "" ? undefined : Number(clean));
        }}
      />
      <TextField
        label="Engine Power (kW)"
        value={engineKw !== undefined ? String(engineKw) : ""}
        onChange={(_, v) => {
          const clean = (v ?? "").toString().trim();
          setEngineKw(clean === "" ? undefined : Number(clean));
        }}
      />

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text={loading ? "Saving..." : "Save Vessel"} onClick={onSave} disabled={loading} />
        <DefaultButton text="Import from Excel" onClick={() => alert("Import coming soon")} />
      </Stack>
    </Stack>
  );
};

export default AddVessel;

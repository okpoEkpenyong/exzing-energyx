// frontend/web/src/pages/voyageLog.tsx
import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  Separator,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { authHeaders } from "../services/authService";

type VesselOption = { key: string; text: string };

const VALID_FUEL = ["diesel", "petrol", "lng", "cng", "electric", "hybrid"];

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";

const parseCsvText = (text: string) => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(l => {
    const cols = l.split(",").map(c => c.trim());
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => obj[h] = cols[i] ?? "");
    return obj;
  });
  return rows;
};

const VoyageLog: React.FC = () => {
  const [vessels, setVessels] = useState<VesselOption[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const [route, setRoute] = useState("");
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [fuel, setFuel] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [fuelType, setFuelType] = useState<string>("diesel");
  const [message, setMessage] = useState<string | null>(null);
  const [csvPreviewMsg, setCsvPreviewMsg] = useState<string | null>(null);
  const [csvRowsCount, setCsvRowsCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/vessels`);
        if (!res.ok) throw new Error(`vessels endpoint returned ${res.status}`);
        const arr = await res.json();
        if (!mounted) return;
        const opts = Array.isArray(arr) ? arr.map((v: any) => ({ key: String(v.id ?? v.imo ?? v.name), text: v.name ?? v.imo ?? v.id })) : [];
        setVessels(opts);
        setSelectedVessel(opts[0]?.key ?? null);
      } catch (err) {
        console.warn("Failed to load vessels, using local fallback", err);
        const fallback = [
          { key: "vessel-001", text: "Vessel-001" },
          { key: "vessel-002", text: "Vessel-002" },
        ];
        setVessels(fallback);
        setSelectedVessel(fallback[0].key);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSubmit = async () => {
    setMessage(null);
    if (!selectedVessel) { setMessage("Please pick a vessel"); return; }
    if (!fuel || fuel <= 0) { setMessage("Fuel must be positive"); return; }
    if (!fuelType || !VALID_FUEL.includes(fuelType.toLowerCase())) { setMessage("Invalid fuel type"); return; }

    setLoading(true);
    try {
      const payload = { device_id: selectedVessel, fuel_type: fuelType, fuel_amount: Number(fuel) };
      const res = await fetch(`${API_BASE}/emissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error ${res.status}: ${txt}`);
      }
      const data = await res.json();
      setMessage(`Voyage logged — CO₂: ${(data.co2_emitted/1000).toFixed(3)} t (id=${data.id})`);
      setFuel(undefined);
      setRoute("");
    } catch (err: any) {
      console.error(err);
      setMessage(String(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  const onCsvSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvPreviewMsg(null);
    setCsvRowsCount(0);
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? "");
      const rows = parseCsvText(text);
      setCsvRowsCount(rows.length);
      setCsvPreviewMsg(`Parsed ${rows.length} rows. First row keys: ${Object.keys(rows[0] ?? {}).join(", ")}`);
      (window as any).__energyx_csv_rows = rows; // temporarily store for upload action
    };
    reader.readAsText(f);
  };

  const onUploadCsv = async () => {
    const rows: any[] = (window as any).__energyx_csv_rows ?? [];
    if (!rows.length) { setMessage("No parsed CSV rows found. Select a CSV first."); return; }
    setLoading(true);
    let success = 0, failed = 0;
    for (const r of rows) {
      const device_id = r.device_id ?? r.vessel ?? r.vessel_id ?? r.ship ?? selectedVessel;
      const fuel_type = (r.fuel_type ?? r.fuel ?? "diesel").toString().toLowerCase();
      const fuel_amount = Number(r.fuel_amount ?? r.fuel ?? r.fuelused ?? 0);
      if (!device_id || !fuel_amount || !VALID_FUEL.includes(fuel_type)) { failed++; continue; }
      try {
        const res = await fetch(`${API_BASE}/emissions/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ device_id, fuel_type, fuel_amount }),
        });
        if (res.ok) success++; else failed++;
      } catch (e) { failed++; }
    }
    setLoading(false);
    setMessage(`CSV upload finished — success: ${success}, failed: ${failed}`);
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 20, maxWidth: 900, margin: "0 auto" } }}>
      <Text variant="xxLarge">Voyage Log</Text>
      <Separator />

      {message && <MessageBar messageBarType={MessageBarType.info}>{message}</MessageBar>}

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        <Stack styles={{ root: { minWidth: 320 } }} tokens={{ childrenGap: 8 }}>
          <Dropdown
            label="Select Vessel"
            selectedKey={selectedVessel}
            options={vessels}
            onChange={(_, o) => setSelectedVessel(String(o?.key))}
            placeholder="Choose a vessel"
          />
          <TextField label="Voyage Route" placeholder="Lagos → Rotterdam" value={route} onChange={(_, v) => setRoute(v ?? "")} />

          <TextField
            label="Distance (nautical miles)"
            value={distance !== undefined ? String(distance) : ""}
            onChange={(_, v) => {
              const clean = (v ?? "").toString().trim();
              setDistance(clean === "" ? undefined : Number(clean));
            }}
          />

          <TextField
            label="Fuel Used (tons)"
            value={fuel !== undefined ? String(fuel) : ""}
            onChange={(_, v) => {
              const clean = (v ?? "").toString().trim();
              setFuel(clean === "" ? undefined : Number(clean));
            }}
          />

          <Dropdown
            label="Fuel Type"
            selectedKey={fuelType}
            options={VALID_FUEL.map(f => ({ key: f, text: f } as IDropdownOption))}
            onChange={(_, o) => setFuelType(String(o?.key))}
          />
          <TextField label="Date" type="date" value={date} onChange={(_, v) => setDate(v ?? "")} />
          <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 8 } }}>
            <PrimaryButton text="Submit & Calculate Emissions" onClick={onSubmit} disabled={loading} />
            <DefaultButton text="Clear" onClick={() => { setRoute(""); setDistance(undefined); setFuel(undefined); }} />
          </Stack>
        </Stack>

        <Stack styles={{ root: { minWidth: 320 } }} tokens={{ childrenGap: 8 }}>
          <Text variant="large">CSV Upload / Sensor</Text>
          <input type="file" accept=".csv,text/csv" onChange={onCsvSelected} />
          {csvPreviewMsg && <Text variant="small">{csvPreviewMsg} ({csvRowsCount} rows)</Text>}
          <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 8 } }}>
            <PrimaryButton text="Upload CSV" onClick={onUploadCsv} disabled={loading || csvRowsCount===0} />
            <DefaultButton text="Connect Sensor" onClick={() => alert("Sensor integration coming in Phase 2")} />
          </Stack>

          <Separator />
          <Text variant="small">CSV format recommendations (header row): device_id,fuel_type,fuel_amount[,timestamp]</Text>
          <Text variant="small">Allowed fuel types: {VALID_FUEL.join(", ")}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VoyageLog;

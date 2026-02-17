// frontend/web/src/pages/vesselSnapshot.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Stack, Text, Separator, ProgressIndicator, DetailsList, IColumn, MessageBar, MessageBarType } from "@fluentui/react";
import { fetchDashboardMetrics, DashboardMetrics } from "../services/metricsServices";
import { getCreditDetail, listCredits } from "../services/creditService.ts";

// chart imports (react-chartjs-2 & chart.js)
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { getEmissions, EmissionLog } from "../services/api";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, BarElement, Tooltip, Legend);



const columns: IColumn[] = [
  { key: "c1", name: "Vessel", fieldName: "vessel", minWidth: 120, maxWidth: 200, isResizable: true },
  { key: "c2", name: "Total CO₂ (t)", fieldName: "co2t", minWidth: 100, maxWidth: 140, isResizable: true },
  { key: "c3", name: "Status", fieldName: "status", minWidth: 100, maxWidth: 140, isResizable: true },
];

const VesselSnapshot: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  // const [emissions, setEmissions] = useState<EmissionLog | null >(null);
  const [emissions, setEmissions] = useState<EmissionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API base — use Vite env; fallback is only for local dev
  const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "https://exzing-energyx.onrender.com";
  // const API_BASE = "http://localhost:5000";

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const d = await fetchDashboardMetrics();
        console.log({metrics_res: d})
        if (!mounted) return;
        setMetrics(d ?? null);
      } catch (err: any) {
        console.error("VesselSnapshot load error:", err);
        if (mounted) setError(String(err?.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

//  uvicorn api.main:app --reload

  useEffect(() => {
    let mounted = true;
    const loadEmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        // const res: EmissionsResponse = await getEmissions();
        // const res = await getEmissions() as any;
         const res = await listCredits(1, 10);
        // const res = await getEmissions(); // <-- returns paginated object
        console.log({ emission_res: res });
        if (!mounted) return;
        // ✅ Extract items before setting state
        setEmissions(res ?? []); 
      } catch (err: any) {
        console.error("Emissions load error:", err);
        if (mounted) setError(String(err?.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadEmissions();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);
  

  console.log({emissions})
  console.log({metrics})

  // compute per-vessel totals (tonnes)
  const perVessel = useMemo(() => {
    const map = new Map<string, number>(); // device_id => tonnes
    for (const e of emissions) {  
      const id = e.emission.device_id ?? "unknown";
      const co2kg = Number(e.emission.co2_emitted ?? 0);
      const prev = map.get(id) ?? 0;
      map.set(id, prev + co2kg / 1000.0);
    }
    const arr = Array.from(map.entries()).map(([vessel, co2t]) => ({ vessel, co2t }));
    // sort desc by co2
    arr.sort((a, b) => b.co2t - a.co2t);
    return arr;
  }, [emissions]);


  const averagePerVessel = useMemo(() => {
    if (!perVessel.length) return 0;
    const s = perVessel.reduce((acc, x) => acc + x.co2t, 0);
    return s / perVessel.length;
  }, [perVessel]);

  // alerts: vessels > 1.5x average flagged
  const alerts = useMemo(() => {
    if (!perVessel.length) return [] as { vessel: string; co2t: number; reason: string }[];
    return perVessel.filter(p => p.co2t > averagePerVessel * 1.5).map(p => ({
      vessel: p.vessel,
      co2t: p.co2t,
      reason: "CO₂ output > 150% of fleet average (investigate efficiency/CII).",
    }));
  }, [perVessel, averagePerVessel]);

  // CII-like heuristic: map avgPerVessel (tonnes) to simple rating
  const ciiRating = useMemo(() => {
    const v = metrics?.avgPerVessel ?? averagePerVessel;
    // thresholds are heuristics for display only
    if (v <= 10) return { rating: "A", color: "#2e7d32" };
    if (v <= 25) return { rating: "B", color: "#4caf50" };
    if (v <= 50) return { rating: "C", color: "#f9a825" };
    if (v <= 100) return { rating: "D", color: "#f57c00" };
    return { rating: "E", color: "#d32f2f" };
  }, [metrics, averagePerVessel]);

  // Chart data: emissions trend (line)
  const lineChartData = useMemo(() => {
    const labels = metrics?.labels ?? [];
    const values = metrics?.weeklyTrend ?? [];
    return {
      labels,
      datasets: [
        {  
          label: "Total CO₂ (t)",
          data: values,
          borderColor: "#bf9b30",
          backgroundColor: "rgba(3,146,255,0.15)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [metrics]);

  // Bar chart for top vessels vs baseline (baseline = averagePerVessel)
  const barChartData = useMemo(() => {
    const top = perVessel.slice(0, 6);
    const labels = top.map(t => t.vessel);
    const vesselValues = top.map(t => Number(t.co2t.toFixed(3)));
    const baseline = top.map(() => Number(averagePerVessel.toFixed(3)));
    return {
      labels,
      datasets: [
        {
          label: "Vessel CO₂ (t)",
          data: vesselValues,
          backgroundColor: "#bf9b30",
        },
        {
          label: "Fleet baseline (avg) (t)",
          data: baseline,
          backgroundColor: "#cfd8dc",
        },
      ],
    };
  }, [perVessel, averagePerVessel]);

  // details list items for vessels
  const vesselRows = perVessel.map(v => ({
    vessel: v.vessel,
    co2t: v.co2t.toLocaleString(undefined, { maximumFractionDigits: 3 }),
    status: v.co2t > averagePerVessel * 1.5 ? "At Risk" : "OK",
  }));

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, maxWidth: 1200, margin: "0 auto" } }}>
      <Text variant="xxLarge">Vessel Snapshot</Text>
      {/* <Separator /> */}

      {error && (
        <MessageBar messageBarType={MessageBarType.error}>
          {error} — check that the backend `/emissions` and `/metrics/dashboard` endpoints are reachable.
        </MessageBar>
      )}

      <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
        {/* Summary Card */}
        <Stack styles={{ root: { minWidth: 320, padding: 16, border: "1px solid #bf9b30", borderRadius: 6 } }} tokens={{ childrenGap: 8 }}>
          {/* <Text variant="large">Vessel Snapshot</Text> */}
          <Text>Total Emissions: <strong>{(metrics?.totalCO2 ?? perVessel.reduce((s, p) => s + p.co2t, 0)).toLocaleString(undefined, { maximumFractionDigits: 3 })} tCO₂</strong></Text>
          <Text>CII Rating: <strong style={{ color: ciiRating.color }}>{ciiRating.rating}</strong></Text>
          <Text>Credits Earned: <strong>{metrics?.percentOffset ? ((metrics.percentOffset * (metrics.totalCO2 ?? 0))).toFixed(3) : "—"} tCO₂ (indicative)</strong></Text>

          <div style={{ marginTop: 12 }}>
            <ProgressIndicator label="Fleet Utilization" percentComplete={metrics?.utilizationRate ?? 0} styles={{progressBar:{backgroundColor:'#bf9b30'}}} />
          </div>

          <Separator />
          <Text variant="small">Average per vessel: {averagePerVessel.toLocaleString(undefined, { maximumFractionDigits: 3 })} tCO₂</Text>
          <Text variant="small">Active vessels: {metrics?.activeVessels ?? perVessel.length}</Text>
        </Stack>

        {/* Charts column */}
        <Stack grow styles={{ root: { minWidth: 0 } }} tokens={{ childrenGap: 12 }}>
          <Stack styles={{ root: { padding: 12, border: "1px solid #bf9b30", borderRadius: 6 } }}>
            <Text variant="large">Emissions Trend (last 7 days)</Text>
            {loading ? (
              <Text>Loading chart...</Text>
            ) : (
              <div style={{ width: "100%", height: 220 }}>
                <Line data={lineChartData} />
              </div>
            )}
          </Stack>

          <Stack styles={{ root: { padding: 12, border: "1px solid #bf9b30", borderRadius: 6 } }}>
            <Text variant="large">Top vessels vs baseline</Text>
            {perVessel.length === 0 ? (
              <Text>No vessel data yet</Text>
            ) : (
              <div style={{ width: "100%", height: 260 }}>
                <Bar data={barChartData} />
              </div>
            )}
          </Stack>

          <Stack styles={{ root: { padding: 12, border: "1px solid #fff", borderRadius: 6 } }}>
            <Text variant="large">Alerts</Text>
            {alerts.length === 0 ? (
              <Text>No alerts — fleet performing within expected range.</Text>
            ) : (
              <Stack tokens={{ childrenGap: 8 }}>
                {alerts.map(a => (
                  <Stack key={a.vessel} horizontal horizontalAlign="space-between" styles={{ root: { padding: 8, border: "1px dashed #eee", borderRadius: 6 } }}>
                    <Stack>
                      <Text><strong>{a.vessel}</strong></Text>
                      <Text variant="small">{a.reason}</Text>
                    </Stack>
                    <Text>{a.co2t.toLocaleString(undefined, { maximumFractionDigits: 3 })} tCO₂</Text>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Separator />

      <Stack>
        <Text variant="large">Vessel Details</Text>
        <DetailsList 
          items={vesselRows} 
          columns={columns} selectionMode={0} setKey="vesselsList"
          styles={{ root: { padding: 12, border: "1px solid #bf9b30", borderRadius: 6 } }}
        />
      </Stack>
    </Stack>
  );
};

export default VesselSnapshot;

// frontend/web/src/pages/creditsDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Separator,
  PrimaryButton,
  DefaultButton,
  ProgressIndicator,
  DetailsList,
  IColumn,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { fetchDashboardMetrics, DashboardMetrics } from "../services/metricsServices";
import { customButtonStyle } from "../utility/customColors";

const columns: IColumn[] = [
  { key: "col1", name: "Credit ID", fieldName: "id", minWidth: 60, maxWidth: 100, isResizable: true },
  { key: "col2", name: "Source", fieldName: "source", minWidth: 100, maxWidth: 200, isResizable: true },
  { key: "col3", name: "Tonnes", fieldName: "tonnes", minWidth: 80, maxWidth: 120, isResizable: true },
  { key: "col4", name: "Status", fieldName: "status", minWidth: 80, maxWidth: 120, isResizable: true },
  { key: "col5", name: "Issued At", fieldName: "issuedAt", minWidth: 120, maxWidth: 200, isResizable: true },
];

type CreditRow = {
  id: string | number;
  source: string;
  tonnes: number;
  status: "issued" | "pending" | "retired";
  issuedAt?: string;
};

const CreditsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [creditsRows, setCreditsRows] = useState<CreditRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const m = await fetchDashboardMetrics();
        if (!mounted) return;
        setMetrics(m);

        // Heuristic credit computation when there's no dedicated credits API:
        // percentOffset is stored as ratio (0..1). Multiply by totalCO2 (tonnes) to get credited tonnes.
        const totalCO2 = m?.totalCO2 ?? 0;
        const percentOffset = m?.percentOffset ?? 0;
        const creditedTonnes = Number((percentOffset * totalCO2).toFixed(3));

        // For display split into Issued vs Pending heuristically:
        // Assume 70% issued, 30% pending (placeholder until backend credit data exists).
        const issued = Math.round(creditedTonnes * 0.7 * 1000) / 1000;
        const pending = Math.round((creditedTonnes - issued) * 1000) / 1000;

        const rows: CreditRow[] = [
          {
            id: "C-001",
            source: "Baseline Reduction (simulation)",
            tonnes: issued,
            status: "issued",
            issuedAt: new Date().toISOString(),
          },
        ];
        if (pending > 0) {
          rows.push({
            id: "C-000-pend",
            source: "Pending Verification",
            tonnes: pending,
            status: "pending",
            issuedAt: new Date().toISOString(),
          });
        }

        setCreditsRows(rows);
      } catch (err: any) {
        console.error("CreditsDashboard load error", err);
        setError("Failed to load credit information. Backend endpoint may be missing.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onExportToETS = async () => {
    // placeholder — to be wired to real endpoint later
    alert("Export to ETS requested — backend integration required.");
  };

  const onOffsetWithPartner = async () => {
    // placeholder — open partner flow
    alert("Offset flow (partner integration) — not implemented yet.");
  };

  const totalBalance = creditsRows.reduce((s, r) => s + (r.tonnes || 0), 0);
  const totalCO2 = metrics?.totalCO2 ?? 0;
  const creditCoverage = totalCO2 ? Math.min(1, totalBalance / totalCO2) : 0;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, maxWidth: 1100, margin: "0 auto" } }}>
      <Text variant="xxLarge">Credits Dashboard</Text>
      <Separator />

      {error && !loading &&(
        <MessageBar messageBarType={MessageBarType.error}>
          {error} — If you have a dedicated credits API, make sure it is reachable by the frontend.
        </MessageBar>
      )}
        <Stack horizontal tokens={{ childrenGap: 24 }} styles={{ root: { alignItems: "flex-start", border: "1px solid #bf9b30", borderRadius: 6 } }}>
        <Stack styles={{ root: { width: 320 } }} tokens={{ childrenGap: 8 }}>
          <Text variant="large">Current Balance</Text>
          <Text variant="xLarge">{totalBalance.toLocaleString(undefined, { maximumFractionDigits: 3 })} tCO₂ credits</Text>

          <Text variant="medium" styles={{ root: { marginTop: 8 } }}>
            Issued:{" "}
            {creditsRows.filter(r => r.status === "issued").reduce((s, r) => s + r.tonnes, 0).toLocaleString(undefined, { maximumFractionDigits: 3 })}{" "}
            tCO₂
          </Text>
          <Text variant="medium">
            Pending:{" "}
            {creditsRows.filter(r => r.status === "pending").reduce((s, r) => s + r.tonnes, 0).toLocaleString(undefined, { maximumFractionDigits: 3 })}{" "}
            tCO₂
          </Text>

          <div style={{ marginTop: 12 }}>
            <ProgressIndicator label="Credit coverage vs emissions" percentComplete={creditCoverage}  styles={{progressBar:{backgroundColor:'#bf9b30'}}} />
          </div>

          <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 12 } }}>
            <PrimaryButton text="Export to ETS" onClick={onExportToETS} styles={customButtonStyle}/>
            <DefaultButton text="Offset with Partner" onClick={onOffsetWithPartner} />
          </Stack>
        </Stack>

        <Stack grow styles={{ root: { minWidth: 0 } }}>
          <Text variant="large">Issued Credits</Text>
          <DetailsList
            items={creditsRows.map(r => ({
              id: r.id,
              source: r.source,
              tonnes: r.tonnes,
              status: r.status,
              issuedAt: r.issuedAt ? new Date(r.issuedAt).toLocaleString() : "",
            }))}
            columns={columns}
            selectionMode={0}
            setKey="creditsList"
          />

          <Separator styles={{ root: { marginTop: 12 } }} />
          <Text variant="small" styles={{ root: { color: "#666" } }}>
            Note: Credits shown above are indicative (calculated from percentOffset × total CO₂). 
            Pending the integration with a verified registry (Gold Standard, Verra, Govt. Approved Bodies).
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CreditsDashboard;

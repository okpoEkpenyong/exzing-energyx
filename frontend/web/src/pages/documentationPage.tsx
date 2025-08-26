// frontend/web/src/pages/documentationPage.tsx
import React from "react";
import {
  Stack,
  Text,
  Separator,
  DefaultButton,
  Link,
  DetailsList,
  IColumn,
  PrimaryButton,
  TooltipHost,
} from "@fluentui/react";

const emissionFactors = [
  // Replace with authoritative source values and cite in the whitepaper
  { fuel: "diesel (MDO/MGO)", factor_kgCO2_per_ton: 3140 },
  { fuel: "HFO", factor_kgCO2_per_ton: 3330 },
  { fuel: "LNG", factor_kgCO2_per_ton: 2750 },
  { fuel: "CNG", factor_kgCO2_per_ton: 2700 },
  { fuel: "Biofuel (varies)", factor_kgCO2_per_ton: 0 },
];

const columns: IColumn[] = [
  { key: "c1", name: "Fuel", fieldName: "fuel", minWidth: 180 },
  { key: "c2", name: "Emission factor (kg CO₂ / tonne fuel)", fieldName: "factor_kgCO2_per_ton", minWidth: 220 },
];

const csvTemplate = `device_id,fuel_type,fuel_amount,timestamp,voyage_id
vessel-001,diesel,1200,2025-08-12T08:00:00Z,voyage-20250812-001
vessel-002,lng,800,2025-08-11T14:00:00Z,voyage-20250811-002
`;

const Section: React.FC<{ title?: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 18 } }}>
    {title ? (
      <>
        <Text variant="xLarge">{title}</Text>
        <Separator />
      </>
    ) : null}
    <div>{children}</div>
  </Stack>
);

const DocumentationPage: React.FC = () => {
  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csvTemplate);
      alert("CSV template copied to clipboard");
    } catch (e) {
      alert("Unable to copy. Select and copy manually.");
    }
  };

  const openWhitepaper = () => {
    // Assumes docs/whitepaper.md is served at /docs/whitepaper.md by your static host (Vercel/Netlify).
    window.open("/docs/whitepaper.md", "_blank");
  };

  return (
    <Stack tokens={{ childrenGap: 18 }} styles={{ root: { padding: 20, maxWidth: 1100, margin: "0 auto" } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <div>
          <Text variant="xxLarge">Methodology, API & Roadmap</Text>
          <Text variant="small">Standards: IPCC • IMO • GHG Protocol • ISO 14064</Text>
        </div>

        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <TooltipHost content="Download a developer-friendly whitepaper (markdown)">
            <PrimaryButton text="Download Whitepaper" onClick={openWhitepaper} />
          </TooltipHost>
          {/* <DefaultButton text="Contact info@exzing.com" onClick={() => (window.location.href = "mailto:info@exzing.com")} /> */}
        </Stack>
      </Stack>

      <Section>
        <Text variant="large">🌍 Vision</Text>
        <Text>
          Exzing-EnergyX is a standards-first carbon intelligence platform for maritime operators, verifiers and regulators.
          We compute, record and present emissions with provenance, verification metadata and a deterministic rating so purchasers and auditors can
          trust credits. This page documents formulas, data formats, API examples and the roadmap.
        </Text>
      </Section>

      <Section title="How it works — quick">
        <Text>
          Ingest data (manual, CSV or telemetry) → normalize to standard units → compute CO₂ using referenced emission factors → store with evidence
          & provenance → optionally run automated remote sensing checks → create audit tasks and issue provisional credits → compute a rating and surface the
          credit in the public registry.
        </Text>

        <Text variant="large">Example calculation</Text>
        <Text>
          If a vessel reports <code>fuel_amount = 1,200</code> tonnes diesel and emission factor = <code>3,140 kg CO₂ / tonne</code>:
        </Text>
        <Text>
          <strong>CO₂ = 1,200 × 3,140 = 3,768,000 kg = 3,768 tCO₂</strong>
        </Text>

        <Text variant="large">Emission factors (recommended baseline)</Text>
        <DetailsList items={emissionFactors} columns={columns} selectionMode={0} setKey="efTable" />

        <Text variant="small">
          <strong>Note:</strong> Always record the *source and version* of the emission factor used (IPCC table or IMO guidance). The platform stores that metadata
          per calculation for auditability.
        </Text>

        <Text variant="large">Data schema — POST /emissions</Text>
        <pre style={{ padding: 12, borderRadius: 6, background: "#0b0b0b22", overflowX: "auto" }}>
{`{
  "device_id": "vessel-001",
  "voyage_id": "voyage-20250812-001",
  "fuel_type": "diesel",
  "fuel_amount": 1200.0,
  "timestamp": "2025-08-12T08:00:00Z",
  "evidence": {
    "bunker_receipt_url": "https://...",
    "fuel_density_kg_per_m3": 860,
    "source": "sensor|manual|bunker_receipt"
  }
}`}
        </pre>

        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton text="Copy CSV template" onClick={copyCsv} />
          <DefaultButton text="Open CSV example" onClick={() => alert(csvTemplate)} />
        </Stack>
      </Section>

      <Section title="Credibility-first design (short)">
        <Text variant="large">Core principles</Text>
        <ol>
          <li><Text>Verification beyond standards — telemetry, remote sensing & third-party audits.</Text></li>
          <li><Text>Radical transparency — public registry with downloadable evidence bundles.</Text></li>
          <li><Text>Shift from offsets to insetting & reductions — actionable packages, not just credits.</Text></li>
          <li><Text>Risk-tiering & rating — deterministic A/B/C with component breakdown.</Text></li>
          <li><Text>Continuous disclosure — mandatory project metadata and periodic audits.</Text></li>
        </ol>

        <Text variant="large">Credit rating (overview)</Text>
        <Text>
          Each credit is assigned a score (0–100) from the following weighted components:
        </Text>
        <ul>
          <li><Text>Monitoring quality — 30%</Text></li>
          <li><Text>Additionality — 25%</Text></li>
          <li><Text>Permanence — 20%</Text></li>
          <li><Text>Auditor score — 15%</Text></li>
          <li><Text>Data integrity — 10%</Text></li>
        </ul>
        <Text>
          Tiers: <strong>A</strong> (score ≥ 80), <strong>B</strong> (50–79), <strong>C</strong> (&lt;50).
        </Text>
      </Section>

      <Section title="Provenance & Public Registry">
        <Text>
          The platform exposes a public registry endpoint returning issued credits and their rating + links to evidence bundles:
        </Text>

        <pre style={{ padding: 12, borderRadius: 6, background: "#0b0b0b22", overflowX: "auto" }}>
{`GET /registry/credits?page=1&per_page=50
Response:
{
  total: 123,
  page: 1,
  per_page: 50,
  items: [
    { id: 101, project_id: 5, credits_awarded: 12.5, issued_at: '2025-08-12T08:00:00Z',
      rating: { overall: 83.6, components: { monitoring_quality: 90, additionality: 80, ... } } }
  ]
}`}
        </pre>

        <Text variant="small">
          Evidence bundles contain receipts, geotagged images, satellite thumbnails and a manifest of file hashes. For production, we store evidence in object storage
          and publish signed URLs in the manifest.
        </Text>
      </Section>

      <Section title="APIs & Quickstart (developer) — minimal">
        <Text variant="small">These are the demo endpoints available in the MVP implementation.</Text>

        <pre style={{ padding: 12, borderRadius: 6, background: "#0b0b0b22", overflowX: "auto" }}>
{`POST /emissions
GET  /emissions
POST /projects
POST /audits/submit
POST /audits/upload_evidence/{audit_id}
POST /ratings/compute/{credit_id}
GET  /ratings/{credit_id}
GET  /registry/credits
GET  /registry/credits/{credit_id}
POST /satellite/run   <-- demo remote-sensing stub
`}
        </pre>

        <Text variant="small">Sample compute-rating payload:</Text>
        <pre style={{ padding: 12, borderRadius: 6, background: "#0b0b0b22", overflowX: "auto" }}>
{`POST /ratings/compute/123
{
  "components": {
    "monitoring_quality": 80,
    "additionality": 70,
    "permanence": 60,
    "auditor_score": 90,
    "data_integrity": 85
  }
}
`}
        </pre>

        <Text variant="small">
          For telemetry devices, we recommend signing payloads (HMAC) and authenticating clients via OIDC/JWT. Auditor actions should be RBAC protected.
        </Text>
      </Section>

      <Section title="Satellite & automated checks (demo)">
        <Text>
          You can run a simulated remote-sensing check using the Satellite stub endpoint. It returns NDVI mean and a simple pass/fail heuristic.
        </Text>
        <pre style={{ padding: 12, borderRadius: 6, background: "#0b0b0b22", overflowX: "auto" }}>
        {`POST /satellite/run
        { "project_id": 5 }
        Response:
        { "ndvi_mean": 0.42, "tree_cover_delta": -0.002, "pass": true, "note": "simulated" }
        `}
        </pre>
        <DefaultButton text="Run a satellite demo" onClick={() => window.open("/satellite-stub", "_blank")} />
      </Section>

      <Section title="Pilot & onboarding checklist">
        <ol>
          <li><Text>Agree on scope & timeframe (4–6 weeks pilot recommended).</Text></li>
          <li><Text>Share sample data (CSV) and vessel metadata (IMO, DWT, engine kW).</Text></li>
          <li><Text>Decide verification level & required evidence.</Text></li>
          <li><Text>Run ingestion → verification → provisional credits → audit cycle.</Text></li>
        </ol>
      </Section>

      <Section title="References & further reading">
        <ul>
          <li><Link href="https://www.ipcc.ch" target="_blank">IPCC Guidelines</Link></li>
          <li><Link href="https://www.imo.org" target="_blank">IMO (MEPC guidance)</Link></li>
          <li><Link href="https://ghgprotocol.org" target="_blank">GHG Protocol</Link></li>
          <li><Link href="https://energytracker.asia/are-carbon-offsets-a-scam/" target="_blank">Energy Tracker Asia — Are carbon offsets a scam?</Link></li>
        </ul>
      </Section>

      <Stack horizontal horizontalAlign="space-between" styles={{ root: { marginTop: 12 } }}>
        <Text variant="small">© {new Date().getFullYear()} Exzing-EnergyX — Methodology & API</Text>
        <div>
          <DefaultButton text="Open registry (demo)" onClick={() => window.open("/registry/credits", "_blank")} />
          <DefaultButton text="Auditor dashboard" onClick={() => window.open("/auditor", "_blank")} styles={{ root: { marginLeft: 8 } }} />
        </div>
      </Stack>
    </Stack>
  );
};

export default DocumentationPage;

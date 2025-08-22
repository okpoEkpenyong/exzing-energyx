// frontend/web/src/pages/documentationPage.tsx
import React from "react";
import { Stack, Text, Separator, DefaultButton, Link, DetailsList, IColumn } from "@fluentui/react";

const emissionFactors = [
  // These values are example placeholders. Replace with chosen authoritative source values and cite.
  { fuel: "diesel (MDO/MGO)", factor_kgCO2_per_ton: 3140 }, // example: ~3.14 kg CO2 per kg => 3140 per ton
  { fuel: "HFO", factor_kgCO2_per_ton: 3330 },
  { fuel: "LNG", factor_kgCO2_per_ton: 2750 },
  { fuel: "CNG", factor_kgCO2_per_ton: 2700 },
  { fuel: "Biofuel (varies)", factor_kgCO2_per_ton: 0 }, // note: lifecycle accounting required
];

const columns: IColumn[] = [
  { key: "c1", name: "Fuel", fieldName: "fuel", minWidth: 150 },
  { key: "c2", name: "Emission factor (kg CO₂ / tonne fuel)", fieldName: "factor_kgCO2_per_ton", minWidth: 200 },
];

const csvTemplate = `device_id,fuel_type,fuel_amount,timestamp,voyage_id
vessel-001,diesel,1200,2025-08-12T08:00:00Z,voyage-20250812-001
vessel-002,lng,800,2025-08-11T14:00:00Z,voyage-20250811-002
`;

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 10 } }}>
    <Text variant="xLarge">{title}</Text>
    <Separator />
    <div>{children}</div>
  </Stack>
);

const DocumentationPage: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 14 }} styles={{ root: { padding: 10, maxWidth: 1100, margin: "0 auto" } }}>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <h1 className="text-3xl font-bold mb-6 text-center">Methodology & Roadmap</h1>
        <Text variant="small">Standards: IPCC • IMO • GHG Protocol • ISO 14064</Text>
      </Stack>

      <Section title={""}>
      <h2 className="text-2xl font-semibold mb-2">🌍 Vision</h2>
        <Text>
           Exzing-EnergyX is a platform designed to help organizations and fleet operators
            track, manage, and reduce their carbon emissions. Backed by Miscrosoft for Startsups, we provide verified
            emission calculations, compliance metrics, and transparent reporting to
            support sustainable operations in line with international standards. 
            This page documents the formulas, data formats, assumptions and references.
        </Text>
      </Section>

      <Section title={""}>
      <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
        <Stack tokens={{ childrenGap: 8 }}>
        <p>
            Emissions are calculated based on internationally recognized standards
            including{" "}
            <strong>IPCC Guidelines</strong>,{" "}
            <strong>IMO (International Maritime Organization)</strong>, and{" "}
            <strong>GHG Protocol</strong>.
          </p>
          <Text variant="large">Example calculation</Text>
        <Text>
          If a vessel reports <code>fuel_amount = 1,200</code> tonnes diesel and emission factor = <code>3140 kg CO₂ / tonne</code>:
        </Text>
        <Text><strong>CO₂ = 1,200 × 3,140 = 3,768,000 kg = 3,768 tCO₂</strong></Text>

        <Text variant="large">Emission factors (recommended baseline)</Text>
        <DetailsList items={emissionFactors} columns={columns} selectionMode={0} setKey="efTable" />

        <Text variant="small">
          <strong>NOTE:</strong> Emission factors must be chosen from a reputable source (IPCC, IMO, IPCC/UNFCCC tables, or national EPA lists).
          For accuracy and auditing, we record the source and version of the factor used for each calculation.
        </Text>

        <Text variant="large">Data schema</Text>
        <Text>Sample JSON payload (POST /emissions):</Text>
        <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 6 }}>
{`{
  "device_id": "vessel-001",
  "voyage_id": "voyage-20250812-001",     // optional
  "fuel_type": "diesel",
  "fuel_amount": 1200.0,                  // in tonnes
  "timestamp": "2025-08-12T08:00:00Z",
  "evidence": {                           // optional metadata for verification
    "bunker_receipt_url": "https://...",
    "fuel_density_kg_per_m3": 860,
    "source": "sensor|manual|bunker_receipt"
  }
}`}
        </pre>

        <Text variant="large">CSV template</Text>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: 12, borderRadius: 6 }}>{csvTemplate}</pre>
        <DefaultButton text="Copy CSV to clipboard" onClick={() => navigator.clipboard?.writeText(csvTemplate)} />

        <Text variant="large">Credits & issuance (MVP)</Text>
        <Text>
          For the MVP we compute an indicative credit value as:
        </Text>
        <Text><code>credits = (co2_kg / 1000) × CREDIT_RATE</code> where <code>CREDIT_RATE</code> is a configurable USD/tonne placeholder.</Text>
        <Text variant="small">
          <strong>Important:</strong> Formal carbon credits require independent verification by an accredited verifier (e.g., Lloyd's Register, DNV, or Verra-approved verifiers).
          Our platform records audit metadata (evidence links, verifier id, verification timestamp) for each credit. Ensure a verification process is completed before using credits in any market or registry.
        </Text>
        <Text variant="large">References & standards</Text>
        <ul>
          <li><strong>IMO</strong> — MEPC.245(66) and related guidance (methodology for calculation & reporting).</li>
          <li><strong>EU MRV</strong> — Regulation (EU) 2015/757 (Monitoring, Reporting & Verification of CO₂ emissions from maritime transport).</li>
          <li><strong>IPCC / EPA</strong> — emission factor tables and guidance for fuel types.</li>
        </ul>
        
        <Text variant="large">Pilot & onboarding checklist (for partners)</Text>
        <ol>
          <li>Agreement on scope & duration (4–6 weeks, 3–10 vessels recommended).</li>
          <li>Shared vessel metadata (IMO, DWT, engine kW) and sample logs or CSVs.</li>
          <li>Verified decision on scope (spot checks or full verification) and evidence requirements.</li>
          <li>Contact & escalation points for data issues.</li>
        </ol>

          <Text variant="small" styles={{ root: { color: "#666" } }}>
            References: IPCC 2006 Guidelines; IMO MEPC.245(66); GHG Protocol Corporate Standard.
          </Text>
        </Stack>
      </Section>

      <Section title="Carbon Credits & Compliance">
        <Text>
          Credits are represented as equivalent tonnes of CO₂ reduced. In this early stage, these are indicative and tracked
          internally; integration with registries (Gold Standard / Verra or accredited bodies in Nigeria) is planned for later phases.  
          Users earn credits when emissions are reduced below baseline values
            or offset via certified projects. Credits are tracked transparently and
            will be verified with external registries in future updates.
        </Text>
        <ul>
          <li><Text>1 credit = 1 tonne CO₂e reduced (indicative)</Text></li>
          <li><Text>Issuance basis: verified reduction against baseline / regulatory benchmarks</Text></li>
        </ul>
      </Section>

      <Section  title={""}>
      <h2 className="text-2xl font-semibold mb-2">🔒 Data Integrity & Security</h2>
          <p>
            Our system ensures secure authentication, encrypted data transmission,
            and privacy protection. EnergyX is designed with compliance to{" "}
            <strong>GDPR</strong> and <strong>ISO 27001</strong> principles.
          </p>
        <Text>
          Security is built-in with HTTPS, JWT authentication, role-based access, and audit logs. We intend to meet
          GDPR principles and encrypt sensitive data at rest using Azure security and scalable tools.
        </Text>
      </Section>

      <Section title="Input Methods">
        <ul>
          <li><Text>Manual entry (forms)</Text></li>
          <li><Text>CSV / Excel bulk uploads</Text></li>
          <li><Text>IoT / sensors (REST ingestion endpoint or MQTT adapter in future)</Text></li>
        </ul>
      </Section>

      <Section  title={""}>
      <h2 className="text-2xl font-semibold mb-2">🚀 Roadmap</h2>
        <ul>
          <li><Text>Phase 1 — MVP: Core Emission Calculations (manual entry, CSV upload), dashboard, & Reporting</Text></li>
          <li><Text>Phase 2 — Integrations: IoT sensors, AIS, telematics providers</Text></li>
          <li><Text>Phase 3 — Registry integrations: Gold Standard, Verra, EU ETS</Text></li>
          <li><Text>Phase 4 — Optimization: route/fuel suggestions and marketplace</Text></li>
        </ul>
         
        <Text variant="small" styles={{ root: { color: "#666" } }}>
          IMO MEPC.245(66) — Guidance on method of calculation of the attained Energy Efficiency Design Index (EEDI) (useful for fuel-to-CO₂ factors & calculation guidance).
        </Text>
        ,{" "}
        <Text variant="small" styles={{ root: { color: "#666" } }}>
          Want to learn more? Contact the team at info@exzing.com or view the referenced standards:
          {" "}
          <Link href="https://www.ipcc.ch" target="_blank">IPCC</Link>,{" "}
          <Link href="https://www.imo.org" target="_blank">IMO</Link>,{" "}
          <Link href="https://ghgprotocol.org" target="_blank">GHG Protocol</Link>.
        </Text>
      </Section>
    </Stack>
  );
};

export default DocumentationPage;

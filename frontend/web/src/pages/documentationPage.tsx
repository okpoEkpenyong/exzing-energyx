// frontend/web/src/pages/documentationPage.tsx
import React from "react";
import { Stack, Text, Separator, Link } from "@fluentui/react";

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 20 } }}>
    <Text variant="xLarge">{title}</Text>
    <Separator />
    <div>{children}</div>
  </Stack>
);

const DocumentationPage: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: 20, maxWidth: 1100, margin: "0 auto" } }}>
      <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
        <h1 className="text-3xl font-bold mb-6 text-center">Documentation & Roadmap</h1>
        <Text variant="small">Standards: IPCC • IMO • GHG Protocol • ISO 14064</Text>
      </Stack>

      <Section title={""}>
      <h2 className="text-2xl font-semibold mb-2">🌍 Vision</h2>
        <Text>
           EnergyX is a platform designed to help organizations and fleet operators
            track, manage, and reduce their carbon emissions. We provide verified
            emission calculations, compliance metrics, and transparent reporting to
            support sustainable operations in line with international standards.
        </Text>
      </Section>

      <Section title={""}>
      <h2 className="text-2xl font-semibold mb-2">⚡ How It Works</h2>
        <Stack tokens={{ childrenGap: 8 }}>
        <p>
            Emissions are calculated based on internationally recognized standards
            including{" "}
            <strong>IPCC Guidelines</strong>,{" "}
            <strong>IMO (International Maritime Organization)</strong>, and{" "}
            <strong>GHG Protocol</strong>.
          </p>
          <Text>
            Some standard emission factors and accepted methods employed include:
          </Text>
          <ul>
            <li>
              <Text>Fuel → CO₂: <em>CO₂ = Fuel consumed × Emission factor</em> (factors from IMO / IPCC / EPA)</Text>
            </li>
            <li>
              <Text>Energy consumption uses grid-specific emission factors (IEA / national agencies)</Text>
            </li>
            <li>
              <Text>Shipping metrics reference IMO CII and EU MRV methodologies</Text>
            </li>
          </ul>

          <Text variant="small" styles={{ root: { color: "#666" } }}>
            Example references: IPCC 2006 Guidelines; IMO MEPC.245(66); GHG Protocol Corporate Standard.
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
          Want to learn more? Contact the team or view the referenced standards:
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

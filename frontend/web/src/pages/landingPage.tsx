import React, { useState } from "react";
import {
  Stack,
  PrimaryButton,
  DefaultButton,
  Text,
  TextField,
  MessageBar,
  MessageBarType,
  Separator,
  FontIcon,
  getTheme,
//   IconButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import BackgroundCanvas from "../components/backgroundCanvas";
import ConceptIllustration from "../components/images/conceptIllustration";
import HeroIllustration from "../components/images/heroIllustration";
import FeatureCard from "../components/FeatureCard";
import { customButtonStyle } from "../utility/customColors";
import { Cloud, Layers } from "lucide-react";



const API_BASE = "http://localhost:5000";
const theme = getTheme();

const IconTile: React.FC<{ iconName: string; label?: string }> = ({ iconName, label }) => (
  <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
    <FontIcon iconName={iconName} style={{ fontSize: 22, color: "#bf9b30" }} />
    {label && <Text>{label}</Text>}
  </Stack>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onRequestPilot = async () => {
    setMsg(null);
    if (!email) {
      setMsg("Please provide an email.");
      return;
    }
    setLoading(true);
    const payload = { name: name || "n/a", email, org: org || "n/a", created_at: new Date().toISOString() };
    try {
      const res = await fetch(`${API_BASE}/pilot-signups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setMsg("Thanks — your pilot request was submitted.");
      else {
        const local = JSON.parse(localStorage.getItem("energyx:pilot_requests") || "[]");
        local.push(payload);
        localStorage.setItem("energyx:pilot_requests", JSON.stringify(local));
        setMsg("Saved locally (backend not reachable).");
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("energyx:pilot_requests") || "[]");
      local.push(payload);
      localStorage.setItem("energyx:pilot_requests", JSON.stringify(local));
      setMsg("Network error — saved locally.");
    } finally {
      setLoading(false);
      setName("");
      setEmail("");
      setOrg("");
    }
  };

  // scroll helpers for anchors
  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <BackgroundCanvas>
      <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: "36px 24px", maxWidth: 1200, margin: "0 auto" } }}>
        {/* header */}
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" wrap>
          <Stack>
           
            <Stack horizontal wrap tokens={{ childrenGap: 12 }} verticalAlign="center" styles={{ root: { justifyContent: "space-between" } }}>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <FontIcon iconName="AnalyticsView" style={{ fontSize: 28, color:"#bf9b30" }} />
                <Text variant="xLarge">Measure</Text>
                <Text variant="small">
                Ingest fuel & telemetry, validated & standardized.
                </Text>
            </Stack>

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <FontIcon iconName="CheckMark" style={{ fontSize: 28, color: "#bf9b30" }} />
                <Text variant="xLarge">Verify</Text>
                <Text variant="small">
                Audit trails & evidence links for independent verifiers.
                </Text>
            </Stack>

            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <FontIcon iconName="Money" style={{ fontSize: 28, color: "#bf9b30" }} />
                <Text variant="xLarge">Reduce</Text>
                <Text variant="small">
                Actionable insights, credits & offset workflows.
                </Text>
            </Stack>
            </Stack>
            <Text styles={{ root: { marginTop: 8, maxWidth: 680 } }}>
              Standards-first carbon intelligence for individuals and organisations like marine operators, oil/gas firms, and verification bodies. Fast onboarding, audit-ready data, and pilot workflows.
            </Text>
            <Separator />
          </Stack>

          {/* illustrations horizontally */}
          <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { alignItems: "center" } }}>
            <div style={{ width: 380, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ConceptIllustration width={360} height={260} />
            </div>
            <div style={{ width: 380, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeroIllustration width={360} height={260} />
            </div>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginTop: 14 } }}>
              <PrimaryButton styles={customButtonStyle} text="Reach Out " onClick={() => goTo("pilot-form")} />
              <DefaultButton text="Documentation" onClick={() => navigate("/documentation")} />
          </Stack>
        </Stack>

        <Separator />
        <Separator />

        {/* What we offer section */}
        <Stack id="offer" tokens={{ childrenGap: 12 }}>
          <Text variant="xLarge">What we offer</Text>
          <Stack horizontal wrap tokens={{ childrenGap: 18 }}>
            <FeatureCard
              title="Accurate Emissions"
              body="Standardized CO₂ calculations based on IMO/EU/IPCC emission factors, stored with audit metadata for verification."
              icon={<FontIcon iconName="BarChart4" style={{ fontSize: 22, color: "#bf9b30" }} />}
              onClick={() => goTo("how")}
            />
            <FeatureCard
              title="Telemetry & Batch"
              body="Accepts CSV uploads, API POSTs and telemetry streams — automatic parsing, validation and anomaly detection."
              icon={<FontIcon iconName="CloudUpload" style={{ fontSize: 22, color: "#bf9b30" }} />}
              onClick={() => goTo("how")}
            />
            <FeatureCard
              title="Verification Ready"
              body="Evidence links, bunker receipt tracking and verifier workflows for formal credit issuance."
              icon={<FontIcon iconName="CheckList" style={{ fontSize: 22, color: "#bf9b30" }} />}
              onClick={() => goTo("how")}
            />
            {/* <FeatureCard
              title="CO2 Sequestration"
              body="AI Models for optimal prediction of CO2 injection parameters."
              icon={<FontIcon iconName="CloudDownload" style={{ fontSize: 22, color: "#bf9b30" }} />}
              onClick={() => goTo("how")}
            /> */}
            <FeatureCard
                title="CO₂ Sequestration"
                body="AI Models for optimal prediction of CO₂ injection parameters."
                icon={<Layers size={22} style={{ fontSize: 22, color: "#bf9b30" }} />}
                onClick={() => goTo("how")}
                />
          </Stack>
        </Stack>

        <Separator />
        <Separator />
        {/* styles={{ root: { minWidth: 320, padding: 16, border: "1px solid #bf9b30", borderRadius: 6 } }} */}
        {/* Pilot signup */}
        <Stack id="pilot-form" horizontalAlign="start" tokens={{ childrenGap: 8 }} styles={{ root: { maxWidth: 640 } }}>
          <Text variant="xLarge">Request a Pilot</Text>
          {msg && <MessageBar messageBarType={MessageBarType.info}>{msg}</MessageBar>}
          <TextField label="Full name" value={name} onChange={(_, v) => setName(v ?? "")} />
          <TextField label="Email" value={email} onChange={(_, v) => setEmail(v ?? "")} />
          <TextField label="Organization" value={org} onChange={(_, v) => setOrg(v ?? "")} />
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton styles={customButtonStyle} text={loading ? "Submitting..." : "Request"} onClick={onRequestPilot} disabled={loading} />
            <DefaultButton text="Contact" onClick={() => (window.location.href = "mailto:info@exzing.com?subject=Pilot%20Enquiry")} />
          </Stack>
        </Stack>

        <Separator />
        <Stack horizontal horizontalAlign="space-between">
          <Text variant="small">© {new Date().getFullYear()} Exzing-EnergyX</Text>
          {/* <Stack horizontal tokens={{ childrenGap: 12 }}>
            <a style={{ color: "#bf9b30" }} href="/documentation">Documentation</a>
            <a style={{ color: "#bf9b30" }} href="/reports">Reports</a>
            <a style={{ color: "#bf9b30" }} href="https://energyx.exzing.com" target="_blank">Live site</a>
          </Stack> */}
        </Stack>
      </Stack>
    </BackgroundCanvas>
  );
};

export default LandingPage;

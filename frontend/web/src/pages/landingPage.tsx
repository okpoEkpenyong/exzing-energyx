import React, { Fragment, useState } from "react";
import {
  // Stack,
  PrimaryButton,
  // DefaultButton,
  Text,
  // TextField,
  MessageBar,
  MessageBarType,
  Separator,
  FontIcon,
  getTheme,
  Stack,
  Shimmer,
  ShimmerElementType,
  // IconButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import BackgroundCanvas from "../components/backgroundCanvas";
import ConceptIllustration from "../components/images/conceptIllustration";
import HeroIllustration from "../components/images/heroIllustration";
import FeatureCard from "../components/featureCard";
import { Layers } from "lucide-react";
import "../styles/landingPage.css"; // <-- add this CSS file (below)
import { defaultButtonStyle, customButtonStyle } from "../utility/customColors";

import GoldTextField from "../components/goldTextField";
import { stackGaps, stackPadding, titleStackStyles } from "../ux/styles";


// const API_BASE = "http://localhost:5000";
 const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "https://exzing-energyx.onrender.com";
const theme = getTheme();

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

// style={{ fontSize: 28, color:"#bf9b30" }}

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

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

 return (

   <Stack tokens={{ childrenGap: 8 }} styles={{ root: { marginBottom: 10,padding: 10, maxWidth: 1100, margin: "0 auto" } }}>
      <Text> Standards-first carbon intelligence for individals and sectors like maritime, oil&gas,
        verification bodies, and industrial partners. Fast onboarding,
        audit-ready data, and pilot workflows. We don’t just sell carbon credits.
        We sell trustworthy climate action by hard-wiring transparency, verification,
        and accountability into every step. Where others issue offsets, we issue evidence.
        We make every credit and emission record verifiable, auditable, and risk-rated so buyers and verifiers 
        can trust the credits. To do so, we combine automated monitoring (satellite, IoT, telemetry),
        robust third-party verification, public provenance, and an internal rating system that surfaces credit quality.
      </Text>
      <Separator />
      <Separator />
      <div className="mvr-row">
        <div className="mvr-item">
          <FontIcon iconName="AnalyticsView" className="mvr-icon" />
          <div>
            <Text className="mvr-title">Measure: {""}</Text> 
            <Text className="mvr-desc">Ingest fuel & telemetry, validated & standardized.</Text>
          </div>
        </div>
        <div className="mvr-item">
          <FontIcon iconName="CheckMark" className="mvr-icon" />
          <div>
            <Text className="mvr-title">Verify: {""}</Text>
            <Text className="mvr-desc">Audit trails & evidence links for independent verifiers.</Text>
          </div>
        </div>
        <div className="mvr-item">
          <FontIcon iconName="Money" className="mvr-icon" />
          <div>
            <Text className="mvr-title">Reduce: {""}</Text>
            <Text className="mvr-desc">Actionable insights, credits & offset workflows.</Text>
          </div>
        </div>
      </div>
      <Separator />
      <Separator />
      <Stack.Item>
        <Stack horizontal styles={titleStackStyles} tokens={stackPadding} >
            <Stack.Item grow={1}>
                <HeroIllustration width={360} height={260} />
            </Stack.Item>
            <Stack.Item grow={1}>
                <ConceptIllustration width={360} height={260} />
            </Stack.Item>
        </Stack>
      </Stack.Item>
      <div className="hero-ctas">
          <PrimaryButton styles={customButtonStyle} text="Request Pilot" onClick={() => goTo("pilot-form")} />
          <PrimaryButton styles={defaultButtonStyle} text="Documentation" onClick={() => navigate("/documentation")} />
      </div>

      <Separator />
      <Separator />
      <Stack.Item>
        <Stack horizontal styles={titleStackStyles} tokens={stackPadding} >
         <Stack.Item grow={1}>
            <FeatureCard
                    title="Accurate Emissions"
                    body="Standardized CO₂ calculations based on IMO/EU/IPCC emission factors, stored with audit metadata for verification."
                    icon={<FontIcon iconName="BarChart4" className="feature-icon" />}
                    onClick={() => goTo("how")}
            />
          </Stack.Item>
         <Stack.Item grow={1}>
         <FeatureCard
                title="Telemetry & Batch"
                body="Accepts CSV uploads, API POSTs and telemetry streams — automatic parsing, validation and anomaly detection."
                icon={<FontIcon iconName="CloudUpload" className="feature-icon" />}
                onClick={() => goTo("how")}
              />
          </Stack.Item>
         <Stack.Item grow={1}>
         <FeatureCard
                title="Verification Ready"
                body="Evidence links, bunker receipt tracking and verifier workflows for formal credit issuance."
                icon={<FontIcon iconName="CheckList" className="feature-icon" />}
                onClick={() => goTo("how")}
              />
          </Stack.Item>
          <Stack.Item grow={1}>
              <FeatureCard
                title="CO₂ Sequestration"
                body="AI Models for optimal prediction of CO₂ injection parameters."
                icon={<Layers size={22} className="feature-icon" />}
                onClick={() => goTo("how")}
              />
            </Stack.Item>
        </Stack>
      </Stack.Item>       
      <Separator />
      <Separator />

           {/* Pilot signup */}
           <div id="pilot-form" className="pilot-form">
             <Text className="section-title">Request a Pilot</Text>
             {msg && <MessageBar messageBarType={MessageBarType.info}>{msg}</MessageBar>}
             <div >
               <GoldTextField label="Full name" value={name} onChange={(_, v) => setName(v ?? "")} />
               <GoldTextField label="Email" value={email} onChange={(_, v) => setEmail(v ?? "")} />
               <GoldTextField label="Organization" value={org} onChange={(_, v) => setOrg(v ?? "")} />
             </div>

             <div className="pilot-actions">
               <PrimaryButton styles={customButtonStyle} text={loading ? "Submitting..." : "Request"} onClick={onRequestPilot} disabled={loading} />
               <PrimaryButton styles={defaultButtonStyle} text="Contact" onClick={() => (window.location.href = "mailto:info@exzing.com?subject=Pilot%20Enquiry")} />
             </div>
           </div>
           <Separator />
           <div className="footer-row">
             <Text variant="small">© {new Date().getFullYear()} Exzing-EnergyX</Text>
           </div>
  </Stack>
 )
};
export default LandingPage;

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
  IconButton,
} from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import BackgroundCanvas from "../components/backgroundCanvas";
import ConceptIllustration from "../components/images/conceptIllustration";
import HeroIllustration from "../components/images/heroIllustration";
import FeatureCard from "../components/featureCard";
import { Layers } from "lucide-react";
import "../styles/landingPage.css"; // <-- add this CSS file (below)

const API_BASE = "http://localhost:5000";
const theme = getTheme();

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

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <BackgroundCanvas>
      <div className="landing-root">
        <div className="landing-inner">
          {/* header & hero */}
          <div className="hero-grid">
            <div className="hero-left">
              <Text >
                Standards-first carbon intelligence for individals and sectors like maritime, oil&Gas, 
                verification bodies, and industrial partners. Fast onboarding,
                audit-ready data, and pilot workflows.
              </Text>

              {/* measure verify reduce row - responsive */}

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
            {/* Illustrations: stack on mobile, side-by-side on desktop */}
            <div className="hero-right">
              <div className="illustration-box">
                <ConceptIllustration width={360} height={260} />
              </div>
              <div className="illustration-box">
                <HeroIllustration width={360} height={260} />
              </div>
            </div>
          </div>

          <Separator />
          <Separator />

          <div className="hero-ctas">
                <PrimaryButton text="Request Pilot" onClick={() => goTo("pilot-form")} />
                <DefaultButton text="Documentation" onClick={() => navigate("/documentation")} />
              </div>
            </div>


          {/* What we offer - responsive card grid */}
          <section id="offer" className="feature-section">
            <Text className="section-title">What we offer</Text>
            <div className="feature-grid">
              <FeatureCard
                title="Accurate Emissions"
                body="Standardized CO₂ calculations based on IMO/EU/IPCC emission factors, stored with audit metadata for verification."
                icon={<FontIcon iconName="BarChart4" className="feature-icon" />}
                onClick={() => goTo("how")}
              />
              <FeatureCard
                title="Telemetry & Batch"
                body="Accepts CSV uploads, API POSTs and telemetry streams — automatic parsing, validation and anomaly detection."
                icon={<FontIcon iconName="CloudUpload" className="feature-icon" />}
                onClick={() => goTo("how")}
              />
              <FeatureCard
                title="Verification Ready"
                body="Evidence links, bunker receipt tracking and verifier workflows for formal credit issuance."
                icon={<FontIcon iconName="CheckList" className="feature-icon" />}
                onClick={() => goTo("how")}
              />
              <FeatureCard
                title="CO₂ Sequestration"
                body="AI Models for optimal prediction of CO₂ injection parameters."
                icon={<Layers size={22} className="lucide-icon" />}
                onClick={() => goTo("how")}
              />
            </div>
          </section>

          <Separator />
          <Separator />

          {/* Pilot signup */}
          <div id="pilot-form" className="pilot-form">
            <Text className="section-title">Request a Pilot</Text>
            {msg && <MessageBar messageBarType={MessageBarType.info}>{msg}</MessageBar>}
            <div className="pilot-fields">
              <TextField label="Full name" value={name} onChange={(_, v) => setName(v ?? "")} />
              <TextField label="Email" value={email} onChange={(_, v) => setEmail(v ?? "")} />
              <TextField label="Organization" value={org} onChange={(_, v) => setOrg(v ?? "")} />
            </div>

            <div className="pilot-actions">
              <PrimaryButton text={loading ? "Submitting..." : "Request"} onClick={onRequestPilot} disabled={loading} />
              <DefaultButton text="Contact" onClick={() => (window.location.href = "mailto:info@exzing.com?subject=Pilot%20Enquiry")} />
            </div>
          </div>

          <Separator />

          <div className="footer-row">
            <Text variant="small">© {new Date().getFullYear()} Exzing-EnergyX</Text>
          </div>
        </div>
      </div>
    </BackgroundCanvas>
  );
};

export default LandingPage;

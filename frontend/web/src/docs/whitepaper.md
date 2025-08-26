# Exzing-EnergyX — Credibility Whitepaper

## Executive summary
Exzing-EnergyX provides a credibility-first approach to carbon accounting and credit issuance for maritime operations.
We combine telemetry ingestion, standardized CO₂ calculations, automated remote sensing, and independent audits to produce credits with verifiable provenance and a deterministic quality rating.

---

## Problem statement
Voluntary carbon markets and many offset projects suffer from problems including poor additionality, weak monitoring, permanence risks (e.g., forest loss), and lack of transparency. These issues reduce buyer confidence and invite greenwashing.

---

## Our approach
We apply five pillars:

1. **Verification beyond current standards**  
   Telemetry (fuel-flow meters), AIS correlation, satellite imagery and independent audits are combined to validate claims.

2. **Radical transparency**  
   Credits issued on the platform include a public provenance record: issuance, evidence bundles, audits, and lifecycle state (issued, transferred, retired).

3. **Shift to insetting & reductions**  
   We prioritize measures that reduce emissions inside a company's value chain (insetting) and present credits as an optional transitional tool.

4. **Risk-tiering & rating**  
   Each credit receives a deterministic 0–100 score based on: Monitoring quality (30%), Additionality (25%), Permanence (20%), Auditor score (15%), Data integrity (10%).  
   Tiers: A (>=80), B (50–79), C (<50).

5. **Continuous disclosure**  
   Project owners publish baseline assumptions, leakage analysis, and financial additionality. Audits and re-assessments are versioned and public.

---

## Data model & APIs (summary)
Core concepts:
- **Project** — metadata, location, disclosures.
- **EmissionLog** — device_id, fuel_type, fuel_amount (tonnes), co2_emitted (kg), timestamp, provenance (signed metadata).
- **CarbonCredit** — link to project/emission_log, credits_awarded, issued_at, status.
- **AuditRecord** — auditor, verdict, notes, evidence bundle.
- **CreditRating** — overall score and components.

Sample endpoints:
- `POST /emissions`
- `GET /registry/credits`
- `POST /ratings/compute/{credit_id}`
- `POST /audits/submit`
- `POST /satellite/run` (demo)

---

## Emission calculation & factors (references)
- CO₂ = fuel_amount (tonnes) × emission_factor (kg CO₂ / tonne)  
- Record emission_factor source (e.g. IPCC 2006 Tables, IMO guidance) per calculation.
- Example factors (illustrative — use authoritative table for production).

**References**
- IPCC 2006 Guidelines
- IMO MEPC.245(66)
- GHG Protocol Corporate Standard

---

## Verification & monitoring
1. **Telemetry** — signed payloads from onboard sensors; correlate with AIS for route attribution.
2. **Satellite** — periodic NDVI / forest cover checks for nature-based projects; time series snapshots for permanence.
3. **Auditor workflow** — manual evidence upload, auditor verdicts, and re-rating on new evidence.

Operational recommendations:
- Use object storage (S3/Azure Blob) for evidence; store file hashes in manifest.
- Anchor daily merkle root hashes to a public chain for tamper evidence (optional).

---

## Rating methodology (detailed)
Components and weights:
- Monitoring quality (30%): frequency, sensor accuracy, AIS correlation.
- Additionality (25%): financial and project-based additionality evidence.
- Permanence (20%): buffer pools, insurance, storability of carbon.
- Auditor score (15%): independent auditor verdict.
- Data integrity (10%): signed ingestion, evidence completeness.

Algorithm: weighted average of component scores (0–100) → overall score → tier.

---

## Governance & legal
- Advisory board: independent verifiers (DNV, Lloyd’s Register) and academic partners.
- Terms: project owner attestations, liability clauses for misreporting.
- Privacy & security: follow GDPR and ISO 27001 best practices; encrypt data at rest.

---

## Roadmap
- **MVP**: ingestion (CSV/API), registry, rating engine, auditor workflow (manual), demo satellite stub.
- **Phase 2**: telemetry streaming (MQTT), automated satellite checks, evidence bundles, S3 storage.
- **Phase 3**: registry integrations (Gold Standard / Verra), blockchain anchoring, enterprise governance.

---

## Appendix: Example manifests & evidence spec
- Evidence bundle manifest:
```json
{
  "files": [
    {"name":"bunker_receipt.pdf","url":"https://...","sha256":"..."},
    {"name":"satellite_thumbnail.png","url":"https://...","sha256":"..."}
  ],
  "notes":"Uploaded by auditor",
  "uploader":"auditor@example.com"
}

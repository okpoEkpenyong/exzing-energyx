# backend/api/routers/metrics.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta
from typing import Optional
from backend.api.db_models import models
from backend.api.deps import get_db

router = APIRouter()

#  const res = await fetch(`${API_BASE}/metrics/dashboard`);

@router.get("/dashboard")
def dashboard_metrics(db: Session = Depends(get_db)):
    # --- Emissions & basic aggregates (existing logic) ---
    emissions = db.query(models.EmissionLog).all()
    total_co2_kg = sum((e.co2_emitted or 0) for e in emissions)
    total_co2_tonnes = (total_co2_kg / 1000.0) if total_co2_kg is not None else 0.0

    unique_devices = len(set(e.device_id for e in emissions))
    avg_per_vessel = (total_co2_tonnes / unique_devices) if unique_devices else 0.0

    # weekly trend (last 7 days)
    today = datetime.utcnow().date()
    labels = []
    trend = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        labels.append(day.strftime("%a"))
        day_total = sum(
            ((e.co2_emitted or 0) / 1000.0)
            for e in emissions
            if (e.timestamp is not None and getattr(e.timestamp, "date", lambda: None)() == day)
        )
        trend.append(round(float(day_total) if isinstance(day_total, (int, float)) else 0.0, 3))

    # percent offset (compute total credits in tonnes)
    credits = db.query(models.CarbonCredit).all()
    total_credits_money = sum((c.credits_awarded or 0) for c in credits)
    CREDIT_RATE = 10.0
    credited_tonnes = (total_credits_money / CREDIT_RATE) if CREDIT_RATE else 0.0
    percent_offset = (credited_tonnes / total_co2_tonnes) if total_co2_tonnes is not None else 0.0

    # utilization - simple proxy using fuel amounts
    active_vessels = len(set(e.device_id for e in emissions))
    utilization = 0.0
    if emissions:
        avg_fuel = sum((e.fuel_amount or 0) for e in emissions) / len(emissions)
        utilization = min(1.0, float(avg_fuel) / 2000.0) if isinstance(avg_fuel, (int, float)) else 0.0

    # --- New: Fuel Efficiency ---
    # Try to compute from VoyageLog model if it exists and has distance/fuel fields.
    fuel_efficiency: Optional[float] = None  # units: nautical miles per tonne (or whichever your VoyageLog uses)
    try:
        VoyageLog = getattr(models, "VoyageLog")
    except AttributeError:
        VoyageLog = None

    if VoyageLog is not None:
        # Prefer aggregated DB-side sums if columns exist
        try:
            # try to aggregate distance and fuel columns if present
            total_distance = db.query(func.sum(getattr(VoyageLog, "distance_nm"))).scalar() or 0.0
            total_fuel_tonnes = db.query(func.sum(getattr(VoyageLog, "fuel_consumed_ton"))).scalar() or 0.0
            if total_fuel_tonnes and total_distance:
                fuel_efficiency = float(total_distance) / float(total_fuel_tonnes)
        except Exception:
            # If the columns aren't present or aggregation failed, fallback to None
            fuel_efficiency = None
    else:
        # Fallback heuristic (if no VoyageLog): compute distance proxy unavailable -> set None
        fuel_efficiency = None

    # --- New: Compliance Rate ---
    compliance_rate: Optional[float] = None  # percent 0..100
    try:
        ComplianceReport = getattr(models, "ComplianceReport")
    except AttributeError:
        ComplianceReport = None

    if ComplianceReport is not None:
        try:
            comp_counts = db.query(
                func.sum(case((ComplianceReport.compliant == True, 1), else_=0)).label("compliant_count"),
                func.count().label("total_count")
            ).one()
            compliant_count = comp_counts.compliant_count or 0
            total_count = comp_counts.total_count or 0
            if total_count:
                compliance_rate = (float(compliant_count) / float(total_count)) * 100.0
        except Exception:
            compliance_rate = None
    else:
        # No compliance table -> set None so frontend can show placeholder
        compliance_rate = None

    # --- Final response (include new fields) ---
    return {
        "totalCO2": round(float(total_co2_tonnes) if isinstance(total_co2_tonnes, (int, float)) else 0.0, 3),
        "avgPerVessel": round(float(avg_per_vessel) if isinstance(avg_per_vessel, (int, float)) else 0.0, 3),
        "percentOffset": round(float(percent_offset) if isinstance(percent_offset, (int, float)) else 0.0, 3),
        "weeklyTrend": trend,
        "labels": labels,
        "activeVessels": active_vessels,
        "utilizationRate": round(utilization, 3),
        # New fields:
        "fuelEfficiency": round(fuel_efficiency, 3) if isinstance(fuel_efficiency, (int, float)) else None,
        "complianceRate": round(compliance_rate, 2) if isinstance(compliance_rate, (int, float)) else None,
    }


# backend\api\routers\credits.py

# backend/api/routers/credits.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from backend.api.schemas import credits as schemas
from backend.api.db_models import models
from backend.api.deps import get_db

router = APIRouter()

CREDIT_RATE = 10  # $10 per tonne placeholder

@router.post("/{emission_id}", response_model=schemas.CreditOut)
def generate_credit(emission_id: int, db: Session = Depends(get_db)):
    log = db.query(models.EmissionLog).filter(models.EmissionLog.id == emission_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Emission log not found")

    # compute monetary credit: CREDIT_RATE * tonnes (co2_emitted is kg)
    tonnes = (log.co2_emitted or 0) / 1000.0
    credits_money = tonnes * CREDIT_RATE

    credit = models.CarbonCredit(
        emission_log_id=log.id,
        credits_awarded=credits_money
    )
    db.add(credit)
    db.commit()
    db.refresh(credit)

    # Build response that includes emission details
    result = {
        "id": credit.id,
        "emission_log_id": credit.emission_log_id,
        "credits_awarded": credit.credits_awarded,
        "issued_at": credit.issued_at,
        "emission": log,
    }
    return result  # Pydantic will validate into schemas.CreditOut

@router.get("/", response_model=list[schemas.CreditOut])
def list_credits(db: Session = Depends(get_db)):
    credits = db.query(models.CarbonCredit).all()
    # optionally include emission details
    out = []
    for c in credits:
        emission = db.query(models.EmissionLog).filter(models.EmissionLog.id == c.emission_log_id).first()
        out.append({
            "id": c.id,
            "emission_log_id": c.emission_log_id,
            "credits_awarded": c.credits_awarded,
            "issued_at": c.issued_at,
            "emission": emission
        })
    return out


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend import models, schemas
from backend.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

CREDIT_RATE = 10  # $10 per tonne as placeholder

@router.post("/{emission_id}", response_model=schemas.CreditOut)
def generate_credit(emission_id: int, db: Session = Depends(get_db)):
    log = db.query(models.EmissionLog).filter(models.EmissionLog.id == emission_id).first()
    if not log:
        return {"error": "Emission log not found"}
    credits = (log.co2_emitted / 1000) * CREDIT_RATE  # convert kg to tonnes
    credit = models.CarbonCredit(
        emission_log_id=log.id,
        credits_awarded=credits
    )
    db.add(credit)
    db.commit()
    db.refresh(credit)
    return credit

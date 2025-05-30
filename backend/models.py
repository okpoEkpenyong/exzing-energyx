from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.database import Base

class EmissionLog(Base):
    __tablename__ = "emission_logs"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    fuel_type = Column(String)
    fuel_amount = Column(Float)
    co2_emitted = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class CarbonCredit(Base):
    __tablename__ = "carbon_credits"
    id = Column(Integer, primary_key=True, index=True)
    emission_log_id = Column(Integer)
    credits_awarded = Column(Float)
    issued_at = Column(DateTime, default=datetime.utcnow)

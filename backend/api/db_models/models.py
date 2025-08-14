# backend\api\db_models\models.py

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.api.database import Base

class VoyageLog(Base):
    __tablename__ = "voyage_logs"
    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(String, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    distance_nm = Column(Float, default=0.0)          # nautical miles
    fuel_consumed_ton = Column(Float, default=0.0)    # tonnes
    # optional link to emission log
    emission_log_id = Column(Integer, ForeignKey("emission_logs.id"), nullable=True)

class ComplianceReport(Base):
    __tablename__ = "compliance_reports"
    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(String, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    compliant = Column(Integer, default=1)  # 1 true, 0 false (or use Boolean)
    notes = Column(String, nullable=True)


class EmissionLog(Base):
    __tablename__ = "emission_logs"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    fuel_type = Column(String)
    fuel_amount = Column(Float)
    co2_emitted = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # relationship to credits
    credits = relationship("CarbonCredit", back_populates="emission", cascade="all, delete-orphan")

class CarbonCredit(Base):
    __tablename__ = "carbon_credits"
    id = Column(Integer, primary_key=True, index=True)
    emission_log_id = Column(Integer, ForeignKey("emission_logs.id"))
    credits_awarded = Column(Float)
    issued_at = Column(DateTime, default=datetime.utcnow)

    emission = relationship("EmissionLog", back_populates="credits")

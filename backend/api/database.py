from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./carbon_mvp.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


def create_db_and_tables():
    # Import db_models so SQLAlchemy knows about the models before creating tables
    from backend.api.db_models import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
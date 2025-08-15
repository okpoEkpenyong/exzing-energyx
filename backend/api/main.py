from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routers import emissions, credits, devices, health, items
from backend.api.database import create_db_and_tables
from backend.api.routers import metrics



app = FastAPI(title="Exzing EnergyX Carbon Intelligence Platform", version="1.0")

origins = [
    "http://localhost:5173",
    "localhost:5173",
    "https://exzing-energyx.onrender.com/"
]

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(emissions.router, prefix="/emissions", tags=["Emissions"])
app.include_router(credits.router, prefix="/credits", tags=["Carbon Credits"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])
app.include_router(health.router)
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])


@app.on_event("startup")
def on_startup():
    # ensure DB models are imported and tables created
    create_db_and_tables()


@app.get("/")
def root():
    return {"message": "Carbon Intelligence Platform is running"}
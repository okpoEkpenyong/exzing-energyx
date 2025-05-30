from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import emissions, credits, devices
from backend.database import create_db_and_tables

app = FastAPI(title="Carbon Intelligence Platform MVP")

origins = [
    "http://localhost:5173",
    "localhost:5173"
]

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Frontend Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Routers
app.include_router(emissions.router, prefix="/emissions", tags=["Emissions"])
app.include_router(credits.router, prefix="/credits", tags=["Carbon Credits"])
app.include_router(devices.router, prefix="/devices", tags=["Devices"])

@app.get("/")
def root():
    return {"message": "Carbon Intelligence Platform is running"}

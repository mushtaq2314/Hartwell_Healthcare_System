from fastapi import FastAPI

from hartwell_backend.api.patient_api import router as patient_router
from hartwell_backend.database import Base, engine

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hartwell Healthcare System")

app.include_router(patient_router)


@app.get("/")
def root():
    return {"message": "Hartwell Healthcare System API"}
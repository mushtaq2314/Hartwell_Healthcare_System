from fastapi import FastAPI

from hartwell_backend.api.patient_api import router as patient_router
from hartwell_backend.api.doctor_api import router as doctor_router
from hartwell_backend.api.department_api import router as department_router
from hartwell_backend.api.appointment_api import router as appointment_router
from hartwell_backend.api.medication_api import router as medication_router
from hartwell_backend.api.visit_api import router as visit_router
from hartwell_backend.api.prescription_api import router as prescription_router
from hartwell_backend.api.report_api import router as report_router
from hartwell_backend.api.timeline_event_api import router as timeline_event_router
from hartwell_backend.api.patient_chat_api import router as patient_chat_router
from hartwell_backend.api.doctor_chat_api import router as doctor_chat_router

from hartwell_backend.database import Base, engine

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hartwell Healthcare System")

app.include_router(patient_router)
app.include_router(patient_chat_router)
app.include_router(doctor_router)
app.include_router(doctor_chat_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(medication_router)
app.include_router(visit_router)
app.include_router(prescription_router)
app.include_router(report_router)
app.include_router(timeline_event_router)


@app.get("/")
def root():
    return {"message": "Hartwell Healthcare System API"}
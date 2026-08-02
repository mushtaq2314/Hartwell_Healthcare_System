from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from hartwell_backend.database import get_db
from hartwell_backend.schemas.patient import PatientCreate, PatientResponse
from hartwell_backend.services.patient_service import PatientService

router = APIRouter(prefix="/patients", tags=["Patients"])

service = PatientService()


@router.post("/", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    try:
        return service.create_patient(db, patient)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return service.get_all_patients(db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    try:
        return service.get_patient(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))